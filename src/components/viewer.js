import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { el, icon, mountQr } from './ui.js'

/**
 * Full-screen document reader for the datasheets, brochures and manuals in
 * /public/docs. Pages are rendered with pdf.js onto canvases as they scroll
 * into view and released again once they are far off-screen, so a 100-page
 * manual costs no more memory than a 4-page datasheet.
 *
 * pdf.js itself is loaded on first use, so the kiosk bundle stays small
 * for visitors who never open a document.
 */

const ZOOMS = [1, 1.5, 2, 3]
/** Render pages this many viewport-heights above and below the fold. */
const AHEAD = 1
/** Keep rendered canvases this many pages either side of the current one. */
const KEEP = 3
/** Cap the backing-store scale: 4K kiosks would otherwise burn memory. */
const MAX_DPR = 2
/** pdf.js support files (CMaps, standard fonts, WASM decoders); see vite.config.js. */
const PDFJS_ASSETS = '/pdfjs/'

let current = null

/** True while a document is open (the idle timer reads this). */
export function isViewerOpen() {
  return current !== null
}

/** Close whatever document is open (used by navigation and the idle timer). */
export function closeViewer() {
  if (!current) return
  const node = current
  current = null
  try {
    node.cleanup?.()
  } catch (err) {
    // Never let a teardown error keep the overlay on screen.
    console.warn('Viewer cleanup failed', err)
  }
  node.classList.remove('is-open')
  node.addEventListener('transitionend', () => node.remove(), { once: true })
  // Safety net in case transitionend never fires (e.g. reduced motion).
  setTimeout(() => node.remove(), 400)
}

/**
 * Open a document from `documents` in products.js:
 * `{ title, type, file, source, url }`.
 */
export function openViewer(doc) {
  closeViewer()

  const node = el(
    `<div class="viewer" role="dialog" aria-modal="true" aria-labelledby="viewer-title">
       <header class="viewer__bar">
         <div class="viewer__meta">
           <p class="eyebrow viewer__eyebrow">${doc.type}${doc.source ? `<span class="viewer__source">${doc.source}</span>` : ''}</p>
           <h2 id="viewer-title" class="viewer__title">${doc.title}</h2>
         </div>
         <span class="viewer__count" aria-live="polite" aria-atomic="true"></span>
         <button class="iconbtn iconbtn--close" type="button" aria-label="Close document">${icon('close')}</button>
       </header>

       <div class="viewer__scroll" tabindex="0">
         <div class="viewer__pages" style="--zoom: 1"></div>
         <p class="viewer__status" role="status"><span class="viewer__spinner" aria-hidden="true"></span>Loading document…</p>
       </div>

       <footer class="viewer__tools">
         <div class="viewer__zoom" role="group" aria-label="Zoom">
           <button class="viewer__zoombtn viewer__zoombtn--out" type="button" aria-label="Zoom out">${icon('minus')}</button>
           <span class="viewer__zoomlevel">100%</span>
           <button class="viewer__zoombtn viewer__zoombtn--in" type="button" aria-label="Zoom in">${icon('plus')}</button>
         </div>
         ${
           doc.url
             ? `<div class="viewer__qr">
                  <div class="qr__code qr__code--sm" aria-busy="true"></div>
                  <span class="viewer__qrlabel">Scan to open<br/>on your phone</span>
                </div>`
             : ''
         }
       </footer>
     </div>`,
  )

  document.body.append(node)
  current = node
  requestAnimationFrame(() => node.classList.add('is-open'))

  node.querySelector('.iconbtn--close').addEventListener('click', closeViewer)
  const onKey = (e) => {
    if (e.key === 'Escape') closeViewer()
  }
  window.addEventListener('keydown', onKey)

  if (doc.url) {
    const qr = node.querySelector('.qr__code')
    mountQr(qr, doc.url).then(() => qr.removeAttribute('aria-busy'))
  }

  const reader = mountReader(node, doc)
  node.cleanup = () => {
    window.removeEventListener('keydown', onKey)
    reader.destroy()
  }
  return node
}

/* -------------------------------------------------------------------------- */
/* Page rendering                                                             */
/* -------------------------------------------------------------------------- */

function mountReader(node, doc) {
  const scroll = node.querySelector('.viewer__scroll')
  const pagesEl = node.querySelector('.viewer__pages')
  const status = node.querySelector('.viewer__status')
  const count = node.querySelector('.viewer__count')
  const zoomLevel = node.querySelector('.viewer__zoomlevel')
  const zoomOut = node.querySelector('.viewer__zoombtn--out')
  const zoomIn = node.querySelector('.viewer__zoombtn--in')

  let pdf = null
  let loading = null
  let destroyed = false
  let zoom = 1
  /** Bumped whenever page sizes change; a render whose key is stale is dropped. */
  let layout = 0
  const holders = []
  const pageCache = new Map()
  const tasks = new Map()
  let raf = 0

  const fail = (message) => {
    status.innerHTML = `${icon('close')}${message}`
    status.classList.add('is-error')
  }

  async function load() {
    let pdfjs
    try {
      pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc ||= workerUrl
      loading = pdfjs.getDocument({
        url: doc.file,
        cMapUrl: `${PDFJS_ASSETS}cmaps/`,
        standardFontDataUrl: `${PDFJS_ASSETS}standard_fonts/`,
        wasmUrl: `${PDFJS_ASSETS}wasm/`,
        iccUrl: `${PDFJS_ASSETS}iccs/`,
      })
      pdf = await loading.promise
    } catch (err) {
      console.warn('Could not open document', doc.file, err)
      if (!destroyed) fail('This document isn\u2019t available right now.')
      return
    }
    if (destroyed) return

    // Size every page from the first one; pages that differ correct
    // themselves when they render.
    const first = await getPage(0)
    const ratio = pageRatio(first)
    for (let i = 0; i < pdf.numPages; i++) {
      const holder = el(`<div class="viewer__page" style="aspect-ratio: ${ratio}" data-page="${i + 1}"></div>`)
      holders.push(holder)
    }
    pagesEl.append(...holders)
    status.hidden = true
    setCount(0)
    update()
  }

  function getPage(i) {
    if (!pageCache.has(i)) pageCache.set(i, pdf.getPage(i + 1))
    return pageCache.get(i)
  }

  function pageRatio(page) {
    const { width, height } = page.getViewport({ scale: 1 })
    return `${width} / ${height}`
  }

  function setCount(i) {
    count.innerHTML = `<b>${i + 1}</b> / ${pdf.numPages}`
  }

  /**
   * Render pages near the fold, release those far away and keep the page
   * counter in step with the scroll position. Runs at most once a frame.
   */
  function update() {
    if (!pdf || destroyed) return
    const top = scroll.scrollTop
    const h = scroll.clientHeight
    const lo = top - h * AHEAD
    const hi = top + h * (1 + AHEAD)
    const mid = top + h / 2

    let nearest = 0
    let nearestDist = Infinity
    holders.forEach((holder, i) => {
      const t = holder.offsetTop
      const b = t + holder.offsetHeight
      const dist = Math.abs((t + b) / 2 - mid)
      if (dist < nearestDist) {
        nearestDist = dist
        nearest = i
      }
      if (b > lo && t < hi) render(i)
    })
    holders.forEach((holder, i) => {
      if (Math.abs(i - nearest) > KEEP && holder.firstChild) release(i)
    })
    setCount(nearest)
  }

  function schedule() {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(update)
  }

  async function render(i) {
    const holder = holders[i]
    const key = `${layout}:${zoom}`
    if (holder.dataset.key === key || tasks.get(i)?.key === key) return

    tasks.get(i)?.task?.cancel()
    const entry = { key, task: null }
    tasks.set(i, entry)

    const page = await getPage(i)
    if (destroyed || tasks.get(i) !== entry) return

    const cssWidth = holder.clientWidth
    if (!cssWidth) {
      tasks.delete(i) // not laid out yet; try again on the next update
      return
    }
    const base = page.getViewport({ scale: 1 })
    const viewport = page.getViewport({ scale: cssWidth / base.width })
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)

    const canvas = document.createElement('canvas')
    canvas.width = Math.floor(viewport.width * dpr)
    canvas.height = Math.floor(viewport.height * dpr)
    const ctx = canvas.getContext('2d', { alpha: false })

    entry.task = page.render({
      canvasContext: ctx,
      viewport,
      transform: dpr === 1 ? null : [dpr, 0, 0, dpr, 0, 0],
    })
    try {
      await entry.task.promise
    } catch (err) {
      if (err?.name !== 'RenderingCancelledException') console.warn('Page render failed', i + 1, err)
      return
    }
    if (destroyed || tasks.get(i) !== entry) return

    holder.style.aspectRatio = pageRatio(page)
    holder.replaceChildren(canvas)
    holder.dataset.key = key
    tasks.delete(i)
  }

  function release(i) {
    tasks.get(i)?.task?.cancel()
    tasks.delete(i)
    holders[i].replaceChildren()
    delete holders[i].dataset.key
  }

  function setZoom(next) {
    const z = ZOOMS[Math.max(0, Math.min(ZOOMS.length - 1, next))]
    if (z === zoom) return
    // Keep the same point of the document under the middle of the screen.
    const cy = (scroll.scrollTop + scroll.clientHeight / 2) / scroll.scrollHeight
    const cx = (scroll.scrollLeft + scroll.clientWidth / 2) / scroll.scrollWidth
    zoom = z
    layout++
    pagesEl.style.setProperty('--zoom', z)
    zoomLevel.textContent = `${Math.round(z * 100)}%`
    zoomOut.disabled = z === ZOOMS[0]
    zoomIn.disabled = z === ZOOMS[ZOOMS.length - 1]
    requestAnimationFrame(() => {
      scroll.scrollTop = cy * scroll.scrollHeight - scroll.clientHeight / 2
      scroll.scrollLeft = cx * scroll.scrollWidth - scroll.clientWidth / 2
      update()
    })
  }

  zoomOut.disabled = true
  zoomOut.addEventListener('click', () => setZoom(ZOOMS.indexOf(zoom) - 1))
  zoomIn.addEventListener('click', () => setZoom(ZOOMS.indexOf(zoom) + 1))
  scroll.addEventListener('scroll', schedule, { passive: true })

  // Pages are sized by the container: re-render if it changes (rotation,
  // window resize during testing).
  const ro = new ResizeObserver(() => {
    layout++
    schedule()
  })
  ro.observe(scroll)

  load()

  return {
    destroy() {
      destroyed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      tasks.forEach((t) => t.task?.cancel())
      tasks.clear()
      // Aborts a pending fetch and terminates the worker (pdf.js puts
      // destroy() on the loading task, not the document).
      loading?.destroy()
    },
  }
}

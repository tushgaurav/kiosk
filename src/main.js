import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import './style.css'

import { about, brand, categories, products } from './data/products.js'
import { renderAbout } from './screens/about.js'
import { renderHome } from './screens/home.js'
import { renderInfo } from './screens/info.js'
import { closeInquiry, flushPendingLeads, openInquiry } from './components/inquiry.js'
import { interests } from './components/interests.js'
import { mountTray } from './components/tray.js'
import { closeViewer, isViewerOpen } from './components/viewer.js'
import { syncSettings } from './settings.js'

/** Return to the attract screen after this much inactivity. */
const IDLE_MS = 75_000
/** Longer leash while a datasheet is open: a page takes a while to read. */
const READING_IDLE_MS = 180_000

const app = document.querySelector('#app')
const state = { view: 'home', index: 0, page: 'company' }

function draw() {
  const screen =
    state.view === 'home'
      ? renderHome({
          brand,
          categories,
          products,
          onSelect: (i) => go({ view: 'info', index: i }, 'forward'),
          onAbout: () => go({ view: 'about', page: 'company' }, 'forward'),
        })
      : state.view === 'about'
      ? renderAbout({
          brand,
          about,
          categories,
          page: state.page,
          onHome: () => go({ view: 'home' }, 'back'),
          onVisit: () => go({ view: 'about', page: 'visit' }, 'forward'),
          onAbout: () => go({ view: 'about', page: 'company' }, 'back'),
          onExplore: () => go({ view: 'info', index: 0 }, 'forward'),
          onCategory: (id) => {
            const i = products.findIndex((p) => p.category === id)
            go({ view: 'info', index: i < 0 ? 0 : i }, 'forward')
          },
          onInquire: openInquiry,
        })
      : renderInfo({
          brand,
          product: products[state.index],
          category: categories.find((c) => c.id === products[state.index].category),
          siblings: products
            .map((product, index) => ({ product, index }))
            .filter(({ product }) => product.category === products[state.index].category),
          index: state.index,
          total: products.length,
          onHome: () => go({ view: 'home' }, 'back'),
          onPrev: () => go({ index: (state.index - 1 + products.length) % products.length }, 'back'),
          onNext: () => go({ index: (state.index + 1) % products.length }, 'forward'),
          onSelect: (i) => go({ index: i }, i > state.index ? 'forward' : 'back'),
        })
  // Screens that hold resources (the map) clean up before they are replaced.
  app.firstElementChild?.cleanup?.()
  app.replaceChildren(screen)
}

// ---- Hash routing (#/, #/about, #/about/visit, #/p/<product-id>) ----------
function readHash() {
  const a = location.hash.match(/^#\/about(?:\/(visit))?\b/)
  if (a) return { view: 'about', index: 0, page: a[1] === 'visit' ? 'visit' : 'company' }
  const m = location.hash.match(/^#\/p\/([\w-]+)/)
  const i = m ? products.findIndex((p) => p.id === m[1]) : -1
  return i >= 0 ? { view: 'info', index: i, page: 'company' } : { view: 'home', index: 0, page: 'company' }
}

function writeHash() {
  const hash =
    state.view === 'info'
      ? `#/p/${products[state.index].id}`
      : state.view === 'about'
        ? state.page === 'visit'
          ? '#/about/visit'
          : '#/about'
        : '#/'
  if (location.hash !== hash) history.replaceState(null, '', hash)
}

window.addEventListener('hashchange', () => {
  const next = readHash()
  if (next.view !== state.view || next.index !== state.index || next.page !== state.page) go(next, 'forward')
})

function go(next, dir = 'forward') {
  Object.assign(state, next)
  writeHash()
  closeInquiry()
  closeViewer()
  document.documentElement.dataset.dir = dir
  if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.startViewTransition(draw)
  } else {
    draw()
  }
}

// ---- Idle → attract screen -------------------------------------------------
// The visitor has walked away: reset everything, including the interests
// they were collecting, so the next person starts with a clean slate.
let idleTimer
function armIdle() {
  clearTimeout(idleTimer)
  idleTimer = setTimeout(
    () => {
      interests.clear()
      if (state.view !== 'home') go({ view: 'home', index: 0 }, 'back')
      else {
        closeInquiry()
        closeViewer()
      }
    },
    isViewerOpen() ? READING_IDLE_MS : IDLE_MS,
  )
}
// `click` fires after the tap that opened a document, so the timer is armed
// with the reading allowance in place.
for (const evt of ['pointerdown', 'pointermove', 'click', 'keydown', 'touchstart']) {
  window.addEventListener(evt, armIdle, { passive: true })
}
armIdle()

// ---- Kiosk hardening -------------------------------------------------------
window.addEventListener('contextmenu', (e) => e.preventDefault())
window.addEventListener('dragstart', (e) => e.preventDefault())
// Block pinch-zoom gestures on browsers that still allow them.
document.addEventListener('gesturestart', (e) => e.preventDefault())
document.addEventListener(
  'wheel',
  (e) => {
    if (e.ctrlKey) e.preventDefault()
  },
  { passive: false },
)

// ---- Keyboard (handy for testing on a laptop) ------------------------------
window.addEventListener('keydown', (e) => {
  if (e.target.matches('input, textarea')) return
  // The document reader handles Escape itself; don't page products under it.
  if (isViewerOpen() && e.key !== 'f') return
  switch (e.key) {
    case 'ArrowRight':
      state.view === 'info' ? go({ index: (state.index + 1) % products.length }, 'forward') : go({ view: 'info', index: 0 })
      break
    case 'ArrowLeft':
      if (state.view === 'info') go({ index: (state.index - 1 + products.length) % products.length }, 'back')
      break
    case 'Escape':
    case 'Home':
      go({ view: 'home', index: 0 }, 'back')
      break
    case 'f':
      document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.()
      break
  }
})

// Leads captured while the server was down get another chance now and
// periodically; the call is a no-op when nothing is queued.
flushPendingLeads()
setInterval(flushPendingLeads, 60_000)

// Pull the admin-editable QR link now and keep it current while running.
syncSettings()

// The interests bar sits under every screen; it shows once something is added.
mountTray(document.body, { onReview: openInquiry })

Object.assign(state, readHash())
writeHash()
draw()

import QRCode from 'qrcode'

/** Turn an HTML string into a single DOM element. */
export function el(html) {
  const t = document.createElement('template')
  t.innerHTML = html.trim()
  return t.content.firstElementChild
}

const ICONS = {
  conveyor: `<path d="M3 15.5h18"/><circle cx="6" cy="18.5" r="1.5"/><circle cx="12" cy="18.5" r="1.5"/><circle cx="18" cy="18.5" r="1.5"/><rect x="5" y="6" width="9" height="6.5" rx="1"/><path d="M14 9.5h3.5l2 3"/>`,
  shield: `<path d="M12 3l8 3v6c0 4.6-3.4 8.1-8 9-4.6-.9-8-4.4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4.5"/>`,
  robot: `<path d="M4 20h11"/><path d="M9.5 20v-5.5"/><path d="M6 14.5h7l3.5-6"/><circle cx="18" cy="6.5" r="2.5"/><path d="M6 14.5a2 2 0 1 0 0 .01"/>`,
  wrench: `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`,
  weight: `<path d="M9 7a3 3 0 1 1 6 0"/><path d="M6.5 7h11l2 13H4.5l2-13z"/><path d="M12 12v4"/>`,
  magnet: `<path d="M6 3v9a6 6 0 0 0 12 0V3h-4v9a2 2 0 0 1-4 0V3H6z"/><path d="M6 7h4"/><path d="M14 7h4"/>`,
  funnel: `<path d="M4 4h16l-6 7v7l-4 2v-9L4 4z"/>`,
  layers: `<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>`,
  xray: `<path d="M8 4H4v4"/><path d="M16 4h4v4"/><path d="M8 20H4v-4"/><path d="M16 20h4v-4"/><path d="M3 12h18"/><path d="M12 8v8"/><path d="M9 10h6"/><path d="M9 14h6"/>`,
  eye: `<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>`,
  box: `<path d="M3 8l9-5 9 5v8l-9 5-9-5V8z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/>`,
  monitor: `<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8"/><path d="M12 16v4"/><path d="M7 12.5l3-3 2.5 2 4.5-4.5"/>`,
  gear: `<circle cx="12" cy="12" r="3"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/><path d="M4.9 4.9L7 7"/><path d="M17 17l2.1 2.1"/><path d="M4.9 19.1L7 17"/><path d="M17 7l2.1-2.1"/>`,
  // Solid glyphs for the round top-bar buttons (Home, About us).
  home: `<path d="M10 20.5v-6h4v6h5.5v-9h3L12 2.5 1.5 11.5h3v9z" fill="currentColor" stroke="none"/>`,
  info: `<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1.15 15.5h-2.3v-7h2.3v7zm0-9h-2.3V6.2h2.3v2.3z" fill="currentColor" fill-rule="evenodd" stroke="none"/>`,
  prev: `<path d="M15 5l-7 7 7 7"/>`,
  next: `<path d="M9 5l7 7-7 7"/>`,
  arrow: `<path d="M7 17L17 7"/><path d="M8 7h9v9"/>`,
  close: `<path d="M6 6l12 12"/><path d="M18 6L6 18"/>`,
  check: `<path d="M5 12.5l4.5 4.5L19 7.5"/>`,
  pin: `<path d="M12 21.5s-6.5-5.6-6.5-10.8a6.5 6.5 0 0 1 13 0C18.5 15.9 12 21.5 12 21.5z"/><circle cx="12" cy="10.7" r="2.3"/>`,
  plus: `<path d="M12 5v14"/><path d="M5 12h14"/>`,
  minus: `<path d="M5 12h14"/>`,
  target: `<circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><path d="M12 2.5v3"/><path d="M12 18.5v3"/><path d="M2.5 12h3"/><path d="M18.5 12h3"/>`,
  // Datasheets, brochures and manuals
  doc: `<path d="M6.5 3h7.5l4.5 4.5V21h-12z"/><path d="M14 3v5h4.5"/><path d="M9.5 13h5"/><path d="M9.5 16.5h5"/>`,
  // Product-page advantages & applications
  ruler: `<path d="M2.5 16.5L16.5 2.5l5 5L7.5 21.5z"/><path d="M6.5 12.5l2 2"/><path d="M9.5 9.5l2 2"/><path d="M12.5 6.5l2 2"/>`,
  blocks: `<rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/><rect x="3" y="3" width="8" height="8" rx="1.5"/><path d="M17 4v6"/><path d="M14 7h6"/>`,
  clock: `<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>`,
  trend: `<path d="M3 6l6.5 6.5 3.5-3.5 8 8"/><path d="M21 12v5h-5"/>`,
  lift: `<path d="M12 19V5"/><path d="M6.5 10.5L12 5l5.5 5.5"/><path d="M4 21h16"/>`,
  stack: `<rect x="4" y="15" width="16" height="5" rx="1"/><rect x="6" y="9.5" width="12" height="5" rx="1"/><rect x="8" y="4" width="8" height="5" rx="1"/>`,
  warehouse: `<path d="M3 20V8.5L12 4l9 4.5V20"/><path d="M3 20h18"/><path d="M8 20v-6h8v6"/><path d="M12 14v6"/>`,
  // On-screen keyboard
  shift: `<path d="M12 4l8.5 8.5H15.5V20h-7v-7.5H3.5z"/>`,
  backspace: `<path d="M9 5h11.5v14H9l-6-7z"/><path d="M12 9.5l5 5"/><path d="M17 9.5l-5 5"/>`,
}

export function icon(name, cls = '') {
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] ?? ''}</svg>`
}

/** Brand logo. Falls back to a typographic wordmark if the PNG is missing. */
export function logo(brand, { onTap } = {}) {
  const wrap = el(
    `<div class="logo" role="img" aria-label="${brand.name}">
       <img src="${brand.logo}" alt="" draggable="false" />
     </div>`,
  )
  const img = wrap.querySelector('img')
  img.addEventListener(
    'error',
    () => {
      wrap.innerHTML = `<span class="wordmark">SAFE<b>SURGE</b></span>`
    },
    { once: true },
  )
  if (onTap) wrap.addEventListener('click', onTap)
  return wrap
}

/**
 * Cover media markup for a product: a silent looping video when `video` is
 * set (with `image` as the poster), otherwise a plain image.
 */
export function media(product, cls = '', alt = '') {
  if (product.video) {
    return `<video class="${cls}" src="${product.video}" poster="${product.image}" autoplay muted loop playsinline disablepictureinpicture aria-label="${alt}"></video>`
  }
  return `<img class="${cls}" src="${product.image}" alt="${alt}" draggable="false" />`
}

/**
 * Product image/video with a designed placeholder when the file is absent.
 * A missing video clip falls back to its poster image; a missing image to
 * the placeholder. Keeps the layout identical either way.
 */
export function figure(product) {
  const fig = el(
    `<figure class="hero" data-icon="${product.icon}">
       ${media(product, 'hero__media', product.name)}
       <div class="hero__fallback">${icon(product.icon)}<span>${product.name}</span></div>
     </figure>`,
  )
  const watch = (node) => {
    const ready = node.tagName === 'VIDEO' ? 'loadeddata' : 'load'
    node.addEventListener(ready, () => fig.classList.add('is-loaded'), { once: true })
    node.addEventListener(
      'error',
      () => {
        if (node.tagName === 'VIDEO' && product.image) {
          const still = el(media({ image: product.image }, 'hero__media', product.name))
          node.replaceWith(still)
          watch(still)
        } else {
          fig.classList.add('is-fallback')
        }
      },
      { once: true },
    )
  }
  watch(fig.querySelector('.hero__media'))
  return fig
}

/**
 * Toggle `is-scrollable` on a scroll container while there is more content
 * below the fold, so CSS can fade its bottom edge as a hint.
 */
export function scrollFade(node) {
  if (!node) return
  const update = () => {
    const more = node.scrollHeight - node.clientHeight - node.scrollTop > 4
    node.classList.toggle('is-scrollable', more)
  }
  node.addEventListener('scroll', update, { passive: true })
  // Transformed descendants count towards scrollHeight, so re-check once
  // any entrance animation inside has finished.
  node.addEventListener('animationend', update)
  // Watch the children as well as the box: content gets shorter when the web
  // font swaps in or an image settles, and the box alone would not notice.
  const ro = new ResizeObserver(update)
  ro.observe(node)
  for (const child of node.children) ro.observe(child)
}

const qrCache = new Map()

/** Async QR as an inline SVG string; cached per URL. */
export function qrSvg(text) {
  if (!qrCache.has(text)) {
    qrCache.set(
      text,
      QRCode.toString(text, {
        type: 'svg',
        margin: 0,
        errorCorrectionLevel: 'M',
        color: { dark: '#141414', light: '#00000000' },
      }),
    )
  }
  return qrCache.get(text)
}

/** Mount a QR into a container element, replacing its children. */
export async function mountQr(container, url) {
  const svg = await qrSvg(url)
  if (!container.isConnected) return
  container.innerHTML = svg
  container.firstElementChild?.setAttribute('aria-label', `QR code for ${url}`)
}

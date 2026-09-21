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
  home: `<path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>`,
  prev: `<path d="M15 5l-7 7 7 7"/>`,
  next: `<path d="M9 5l7 7-7 7"/>`,
  arrow: `<path d="M7 17L17 7"/><path d="M8 7h9v9"/>`,
  close: `<path d="M6 6l12 12"/><path d="M18 6L6 18"/>`,
  check: `<path d="M5 12.5l4.5 4.5L19 7.5"/>`,
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
 * Product image with a designed placeholder when the file is absent.
 * Keeps the layout identical either way.
 */
export function figure(product) {
  const fig = el(
    `<figure class="hero" data-icon="${product.icon}">
       <img src="${product.image}" alt="${product.name}" draggable="false" />
       <div class="hero__fallback">${icon(product.icon)}<span>${product.name}</span></div>
     </figure>`,
  )
  const img = fig.querySelector('img')
  img.addEventListener('error', () => fig.classList.add('is-fallback'), { once: true })
  img.addEventListener('load', () => fig.classList.add('is-loaded'), { once: true })
  return fig
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

import { mountQr } from './components/ui.js'
import { brand } from './data/products.js'

/**
 * Settings the admin can change at /admin without rebuilding the kiosk.
 * Today that is one thing: the link every product QR code carries — the
 * catalogue PDF (`brand.catalog`) unless the admin has set another.
 *
 * The last value the server sent is kept in localStorage, so a kiosk that
 * boots while the server is down (or before the fetch returns) still shows
 * the right QR rather than flipping from one link to another.
 */

const CACHE_KEY = 'safesurge:settings'
const POLL_MS = 60_000

const defaults = { qr_url: brand.catalog }
let current = { ...defaults, ...readCache() }

/** The link product QR codes point to right now. */
export function qrUrl() {
  return current.qr_url || defaults.qr_url
}

/**
 * Mount the product QR into `container`. The node is tagged so it can be
 * redrawn in place if the admin changes the link while the kiosk is running.
 */
export function mountProductQr(container) {
  container.dataset.qr = 'product'
  return mountQr(container, qrUrl())
}

/** Fetch settings now and keep them fresh for as long as the kiosk runs. */
export function syncSettings() {
  refresh()
  setInterval(refresh, POLL_MS)
}

async function refresh() {
  let next
  try {
    const res = await fetch('/api/settings', { cache: 'no-store' })
    if (!res.ok) return
    next = await res.json()
  } catch {
    return // Offline — keep the last known settings.
  }
  if (typeof next?.qr_url !== 'string' || !next.qr_url || next.qr_url === current.qr_url) return
  current = { ...current, qr_url: next.qr_url }
  writeCache(current)
  document.querySelectorAll('[data-qr="product"]').forEach((node) => mountQr(node, qrUrl()))
}

function readCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
    return typeof cached?.qr_url === 'string' && cached.qr_url ? { qr_url: cached.qr_url } : {}
  } catch {
    return {}
  }
}

function writeCache(value) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(value))
  } catch (err) {
    console.warn('Could not persist kiosk settings', err)
  }
}

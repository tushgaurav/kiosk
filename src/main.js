import '@fontsource-variable/geist'
import './style.css'

import { brand, products } from './data/products.js'
import { renderHome } from './screens/home.js'
import { renderInfo } from './screens/info.js'
import { closeInquiry, installLeadExport, openInquiry } from './components/inquiry.js'

/** Return to the attract screen after this much inactivity. */
const IDLE_MS = 75_000

const app = document.querySelector('#app')
const state = { view: 'home', index: 0 }

function draw() {
  const screen =
    state.view === 'home'
      ? renderHome({ brand, products, onSelect: (i) => go({ view: 'info', index: i }, 'forward') })
      : renderInfo({
          brand,
          product: products[state.index],
          index: state.index,
          total: products.length,
          onHome: () => go({ view: 'home' }, 'back'),
          onPrev: () => go({ index: (state.index - 1 + products.length) % products.length }, 'back'),
          onNext: () => go({ index: (state.index + 1) % products.length }, 'forward'),
          onInquire: openInquiry,
        })
  app.replaceChildren(screen)
}

// ---- Hash routing (#/ or #/p/<product-id>) so screens are deep-linkable ----
function readHash() {
  const m = location.hash.match(/^#\/p\/([\w-]+)/)
  const i = m ? products.findIndex((p) => p.id === m[1]) : -1
  return i >= 0 ? { view: 'info', index: i } : { view: 'home', index: 0 }
}

function writeHash() {
  const hash = state.view === 'info' ? `#/p/${products[state.index].id}` : '#/'
  if (location.hash !== hash) history.replaceState(null, '', hash)
}

window.addEventListener('hashchange', () => {
  const next = readHash()
  if (next.view !== state.view || next.index !== state.index) go(next, 'forward')
})

function go(next, dir = 'forward') {
  Object.assign(state, next)
  writeHash()
  closeInquiry()
  document.documentElement.dataset.dir = dir
  if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.startViewTransition(draw)
  } else {
    draw()
  }
}

// ---- Idle → attract screen -------------------------------------------------
let idleTimer
function armIdle() {
  clearTimeout(idleTimer)
  idleTimer = setTimeout(() => {
    if (state.view !== 'home') go({ view: 'home', index: 0 }, 'back')
    else closeInquiry()
  }, IDLE_MS)
}
for (const evt of ['pointerdown', 'pointermove', 'keydown', 'touchstart']) {
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

installLeadExport()
Object.assign(state, readHash())
writeHash()
draw()

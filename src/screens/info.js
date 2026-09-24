import { el, figure, icon, logo, mountQr, scrollFade } from '../components/ui.js'

export function renderInfo({ brand, product, category, siblings = [], index, total, onHome, onPrev, onNext, onSelect, onInquire }) {
  const screen = el(
    `<section class="screen screen--info">
       <header class="topbar">
         <button class="pill pill--home" type="button" aria-label="Back to start">
           ${icon('home')}<span>Home</span>
         </button>
       </header>

       <div class="info__title">
         <p class="eyebrow info__eyebrow">${category?.name ?? ''}${product.partner ? `<span class="info__partner">${product.partner}</span>` : ''}</p>
         <h1 class="title">${product.name}</h1>
         ${subTabs(siblings, index)}
       </div>

       <div class="info__hero"></div>

       <div class="info__copy">
         <p class="lede">${product.description}</p>
         <div class="qr">
           <div class="qr__code" aria-busy="true"></div>
           <span class="qr__label">Scan for details on your phone</span>
         </div>
         ${facts(product.facts)}
         ${range(product.range)}
       </div>

       <footer class="info__footer">
         <div class="pager">
           <button class="iconbtn iconbtn--prev" type="button" aria-label="Previous product">${icon('prev')}</button>
           <span class="pager__count" aria-label="Product ${index + 1} of ${total}"><b>${index + 1}</b> / ${total}</span>
           <button class="iconbtn iconbtn--next" type="button" aria-label="Next product">${icon('next')}</button>
         </div>
         <button class="cta cta--inquire" type="button"><span>Inquire Now</span></button>
       </footer>
     </section>`,
  )

  screen.querySelector('.topbar').prepend(logo(brand, { onTap: onHome }))
  screen.querySelector('.info__hero').append(figure(product))

  const qr = screen.querySelector('.qr__code')
  mountQr(qr, product.url).then(() => qr.removeAttribute('aria-busy'))

  scrollFade(screen.querySelector('.range'))

  screen.querySelector('.pill--home').addEventListener('click', onHome)
  screen.querySelector('.iconbtn--prev').addEventListener('click', onPrev)
  screen.querySelector('.iconbtn--next').addEventListener('click', onNext)
  screen.querySelector('.cta--inquire').addEventListener('click', () => onInquire(product))
  mountSubnav(screen.querySelector('.subnav'), siblings, index, onSelect)

  // Horizontal swipe between products (touch / pen / mouse drag).
  let startX = null
  let startY = null
  screen.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, .subnav')) return
    startX = e.clientX
    startY = e.clientY
  })
  screen.addEventListener('pointerup', (e) => {
    if (startX === null) return
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    startX = startY = null
    if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      dx < 0 ? onNext() : onPrev()
    }
  })
  screen.addEventListener('pointercancel', () => (startX = startY = null))

  return screen
}

/**
 * Switcher between the sub-categories of the current category: one
 * horizontally scrolling row of tabs with a step arrow at each end.
 */
function subTabs(siblings, current) {
  if (siblings.length < 2) return ''
  const pos = siblings.findIndex((s) => s.index === current)
  return `<div class="subnav">
    <button class="subnav__arrow subnav__arrow--prev" type="button" aria-label="Previous in category" ${pos <= 0 ? 'disabled' : ''}>${icon('prev')}</button>
    <div class="subnav__strip" role="tablist" aria-label="Sub-categories">${siblings
      .map(
        ({ product, index }) =>
          `<button class="subnav__item" type="button" role="tab" aria-selected="${index === current}" data-index="${index}">${product.name}</button>`,
      )
      .join('')}</div>
    <button class="subnav__arrow subnav__arrow--next" type="button" aria-label="Next in category" ${pos >= siblings.length - 1 ? 'disabled' : ''}>${icon('next')}</button>
  </div>`
}

function mountSubnav(nav, siblings, current, onSelect) {
  if (!nav || !onSelect) return
  const pos = siblings.findIndex((s) => s.index === current)
  const strip = nav.querySelector('.subnav__strip')

  nav.querySelectorAll('.subnav__item').forEach((tab) => {
    tab.addEventListener('click', () => onSelect(Number(tab.dataset.index)))
  })
  nav.querySelector('.subnav__arrow--prev').addEventListener('click', () => {
    if (pos > 0) onSelect(siblings[pos - 1].index)
  })
  nav.querySelector('.subnav__arrow--next').addEventListener('click', () => {
    if (pos < siblings.length - 1) onSelect(siblings[pos + 1].index)
  })

  // Keep the active tab in view. Runs once the strip has been laid out
  // (it has no size until the screen is in the DOM), then on any resize.
  const active = strip.querySelector('[aria-selected="true"]')
  const edges = () => {
    const max = strip.scrollWidth - strip.clientWidth
    strip.classList.toggle('fade-left', strip.scrollLeft > 2)
    strip.classList.toggle('fade-right', max - strip.scrollLeft > 2)
  }
  const settle = () => {
    if (!active || !strip.clientWidth) return
    strip.scrollTo({ left: active.offsetLeft - (strip.clientWidth - active.offsetWidth) / 2, behavior: 'instant' })
    edges()
  }
  strip.addEventListener('scroll', edges, { passive: true })
  new ResizeObserver(settle).observe(strip)
}

/** Headline specs as a row of stat blocks. */
function facts(items = []) {
  if (!items.length) return ''
  return `<dl class="facts">${items
    .map((f) => `<div class="fact"><dt>${f.label}</dt><dd>${f.value}</dd></div>`)
    .join('')}</dl>`
}

/** Model / variant list, optionally grouped. Scrolls if it outgrows the screen. */
function range(groups = []) {
  const withItems = groups.filter((g) => g.items?.length)
  if (!withItems.length) return ''
  return `<div class="range">${withItems
    .map(
      (g) => `<section class="range__group">
        ${g.title ? `<h2 class="range__title">${g.title}</h2>` : ''}
        <ul class="range__list" role="list">
          ${g.items
            .map(
              (it) => `<li class="range__item">
                <span class="range__name">${it.name}</span>
                ${it.note ? `<span class="range__note">${it.note}</span>` : ''}
              </li>`,
            )
            .join('')}
        </ul>
      </section>`,
    )
    .join('')}</div>`
}

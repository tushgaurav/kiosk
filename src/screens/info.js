import { card, deck } from '../components/deck.js'
import { el, figure, icon, logo, mountQr } from '../components/ui.js'

/**
 * Product screen: title and sub-category switcher, cover photo, then a deck
 * of cards the visitor swipes through. Which cards appear depends on what
 * the product defines (see `pages()` below); every product has at least an
 * Overview.
 */
export function renderInfo({ brand, product, category, siblings = [], index, total, onHome, onPrev, onNext, onSelect, onInquire }) {
  const screen = el(
    `<section class="screen screen--info">
       <header class="topbar">
         <button class="navbtn navbtn--home" type="button" aria-label="Back to start" title="Home">${icon('home')}</button>
       </header>

       <div class="info__title">
         <p class="eyebrow info__eyebrow">${category?.name ?? ''}${product.partner ? `<span class="info__partner">${product.partner}</span>` : ''}</p>
         <h1 class="title">${product.name}</h1>
         ${subTabs(siblings, index)}
       </div>

       <div class="info__hero"></div>

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

  screen.querySelector('.info__footer').before(
    deck({
      label: `${product.name} details`,
      cards: pages(product),
      render: (p, i, n) => card({ title: p.label, index: i, total: n, body: p.body, bodyClass: p.bodyClass }),
    }),
  )

  const qr = screen.querySelector('.qr__code')
  mountQr(qr, product.url).then(() => qr.removeAttribute('aria-busy'))

  screen.querySelector('.navbtn--home').addEventListener('click', onHome)
  screen.querySelector('.iconbtn--prev').addEventListener('click', onPrev)
  screen.querySelector('.iconbtn--next').addEventListener('click', onNext)
  screen.querySelector('.cta--inquire').addEventListener('click', () => onInquire(product))
  mountSubnav(screen.querySelector('.subnav'), siblings, index, onSelect)

  // Horizontal swipe between products (touch / pen / mouse drag) on the
  // title and photo. The deck below has its own sideways scroll.
  let startX = null
  let startY = null
  screen.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, .subnav, .deck')) return
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

/* -------------------------------------------------------------------------- */
/* Cards                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * The deck for a product, in reading order. Each entry is `{ id, label,
 * body, bodyClass }`; cards whose content the product does not define are
 * left out.
 */
function pages(product) {
  const list = [
    {
      id: 'overview',
      label: 'Overview',
      bodyClass: 'card__body--overview',
      body: `
        <p class="lede">${product.description}</p>
        <div class="qr">
          <div class="qr__code" aria-busy="true"></div>
          <span class="qr__label">Scan for details on your phone</span>
        </div>
        ${facts(product.facts)}
        ${applications(product.applications)}`,
    },
  ]
  if (product.advantages?.length) {
    list.push({ id: 'advantages', label: 'Key advantages', bodyClass: 'card__body--adv', body: advantages(product.advantages) })
  }
  if (product.performance?.length) {
    list.push({ id: 'glance', label: 'At a glance', bodyClass: 'card__body--glance', body: glance(product.performance) })
  }
  const groups = (product.range ?? []).filter((g) => g.items?.length)
  if (groups.length) {
    list.push({ id: 'range', label: product.rangeLabel ?? 'Range', body: range(groups) })
  }
  return list
}

/** Headline specs as a row of stat blocks. */
function facts(items = []) {
  if (!items.length) return ''
  return `<dl class="facts">${items
    .map((f) => `<div class="fact"><dt>${f.label}</dt><dd>${f.value}</dd></div>`)
    .join('')}</dl>`
}

/** Where the product is used: a row of icon chips under the overview. */
function applications(items = []) {
  if (!items.length) return ''
  return `<section class="apps">
    <h3 class="range__title">Applications</h3>
    <ul class="chips" role="list">
      ${items.map((a) => `<li class="chip chip--icon">${icon(a.icon)}<span>${a.name}</span></li>`).join('')}
    </ul>
  </section>`
}

/** Key advantages: a grid of panels, each an icon, a title and 2–3 points. */
function advantages(items) {
  return `<ul class="adv" role="list">${items
    .map(
      (a) => `<li class="adv__item">
        <h3 class="adv__title"><span class="adv__icon">${icon(a.icon)}</span>${a.title}</h3>
        <ul class="adv__points" role="list">
          ${a.points.map((p) => `<li>${p.lead ? `<b>${p.lead}</b> ` : ''}${p.text}</li>`).join('')}
        </ul>
      </li>`,
    )
    .join('')}</ul>`
}

/** Performance at a glance: big figures on dark tiles. */
function glance(items) {
  return `<ul class="glance" role="list">${items
    .map(
      (s) => `<li class="glance__item">
        <span class="glance__label">${s.label}</span>
        <b class="glance__value">${s.value}</b>
        ${s.note ? `<span class="glance__note">${s.note}</span>` : ''}
      </li>`,
    )
    .join('')}</ul>`
}

/** Model / variant list, optionally grouped. */
function range(withItems) {
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

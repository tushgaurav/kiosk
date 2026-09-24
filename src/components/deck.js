import { el, scrollFade } from './ui.js'

/**
 * Swipeable deck of cards with a tab index above it. One card fills the
 * viewport with the next one peeking in from the right; the visitor swipes
 * or taps a tab to move between them. Used by the About screen and by the
 * product pages.
 *
 * - `cards` is a list of `{ id, label }`.
 * - `render(card, i, total)` returns a `.card` element; see `card()` below.
 *   Its `.card__body` becomes a fading scroll region.
 * - `initial` (optional) is the id of the card to start on.
 *
 * The returned `.deck` element exposes `select(id)`.
 */
export function deck({ label, cards, render, initial }) {
  const node = el(
    `<div class="deck">
       <div class="deck__nav" role="tablist" aria-label="${label}">
         ${cards
           .map(
             (c, i) =>
               `<button class="deck__tab" type="button" role="tab" id="tab-${c.id}" aria-controls="card-${c.id}" aria-selected="${i === 0}" data-id="${c.id}">${c.label}</button>`,
           )
           .join('')}
       </div>
       <div class="deck__track"></div>
     </div>`,
  )

  const track = node.querySelector('.deck__track')
  const panels = cards.map((c, i) => {
    const panel = render(c, i, cards.length)
    panel.id = `card-${c.id}`
    panel.setAttribute('role', 'tabpanel')
    panel.setAttribute('aria-labelledby', `tab-${c.id}`)
    return panel
  })
  track.append(...panels)
  const tabs = [...node.querySelectorAll('.deck__tab')]

  function select(id, { scroll = true, behavior = 'smooth' } = {}) {
    const i = Math.max(
      0,
      cards.findIndex((c) => c.id === id),
    )
    tabs.forEach((t, n) => t.setAttribute('aria-selected', String(n === i)))
    panels.forEach((p, n) => p.classList.toggle('is-current', n === i))
    tabs[i]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior })
    if (scroll) track.scrollTo({ left: panels[i].offsetLeft - track.offsetLeft, behavior })
  }

  tabs.forEach((t) => t.addEventListener('click', () => select(t.dataset.id)))

  // Keep the index in step with finger swipes.
  let raf = 0
  track.addEventListener(
    'scroll',
    () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const x = track.scrollLeft + track.offsetLeft
        let best = 0
        panels.forEach((p, n) => {
          if (Math.abs(p.offsetLeft - x) < Math.abs(panels[best].offsetLeft - x)) best = n
        })
        select(cards[best].id, { scroll: false })
      })
    },
    { passive: true },
  )

  panels.forEach((p) => scrollFade(p.querySelector('.card__body')))
  select(initial ?? cards[0].id, { scroll: Boolean(initial), behavior: 'instant' })

  node.select = select
  return node
}

/**
 * One card of a deck: a title, its position in the deck and a body.
 * `bodyClass` picks a body layout (see the `.card__body--*` rules in CSS).
 */
export function card({ title, index, total, body, bodyClass = '' }) {
  return el(
    `<article class="card">
       <header class="card__head">
         <h2 class="card__title">${title}</h2>
         <span class="card__index">${pad(index + 1)} / ${pad(total)}</span>
       </header>
       <div class="card__body ${bodyClass}">${body}</div>
     </article>`,
  )
}

export const pad = (n) => String(n).padStart(2, '0')

import { card, deck, pad } from '../components/deck.js'
import { mountMap } from '../components/map.js'
import { el, icon, logo, mountQr } from '../components/ui.js'

/**
 * About screen. Two subpages:
 *  - 'company' (#/about): page title, head-office photo and a deck of cards
 *    the visitor swipes through (or taps the index to jump).
 *  - 'visit' (#/about/visit): interactive map, address plate and a QR that
 *    opens directions on the visitor's phone.
 *
 * The returned element carries a `cleanup()` the router calls before the
 * screen is replaced (the map holds window listeners).
 */
export function renderAbout(props) {
  return props.page === 'visit' ? renderVisit(props) : renderCompany(props)
}

/* -------------------------------------------------------------------------- */
/* Company                                                                    */
/* -------------------------------------------------------------------------- */

function renderCompany({ brand, about, categories, initialCard, onHome, onVisit, onExplore, onInquire, onCategory }) {
  const screen = el(
    `<section class="screen screen--about">
       <header class="topbar">
         <div class="topbar__actions">
           <button class="pill pill--visit" type="button">${icon('pin')}<span>Visit Us</span></button>
           <button class="navbtn navbtn--home" type="button" aria-label="Back to start" title="Home">${icon('home')}</button>
         </div>
       </header>

       <div class="about__head">
         <p class="eyebrow info__eyebrow">${about.eyebrow}<span class="info__partner">${about.company}</span></p>
         <h1 class="title about__title">${about.title.replace(/\.$/, '')}<span class="dot">.</span></h1>
       </div>

       <figure class="about__hero">
         <div class="about__frame">
           <img class="about__photo" src="${about.image}" alt="${about.imageAlt ?? ''}" draggable="false" />
         </div>
       </figure>

       <footer class="info__footer">
         <button class="cta cta--explore" type="button"><span>Explore Products</span></button>
         <button class="cta cta--inquire" type="button"><span>Inquire Now</span></button>
       </footer>
     </section>`,
  )

  screen.querySelector('.topbar').prepend(logo(brand, { onTap: onHome }))
  screen.querySelector('.navbtn--home').addEventListener('click', onHome)
  screen.querySelector('.pill--visit').addEventListener('click', onVisit)
  screen.querySelector('.cta--explore').addEventListener('click', onExplore)
  screen.querySelector('.cta--inquire').addEventListener('click', onInquire)

  const frame = screen.querySelector('.about__frame')
  const photo = frame.querySelector('.about__photo')
  photo.addEventListener('load', () => frame.classList.add('is-loaded'), { once: true })
  photo.addEventListener('error', () => frame.classList.add('is-fallback'), { once: true })

  screen.querySelector('.info__footer').before(
    deck({
      label: 'About SafeSurge',
      cards: about.cards,
      initial: initialCard,
      render: (c, i, total) => renderCard(c, i, total, { categories, onCategory }),
    }),
  )
  return screen
}

/** One card of the deck. */
function renderCard(c, i, total, { categories, onCategory }) {
  const node = card({
    title: c.label,
    index: i,
    total,
    body: `
      ${c.text ? `<p class="card__text">${c.text}</p>` : ''}
      ${c.stats ? stats(c.stats) : ''}
      ${c.categories ? categoryList(categories) : ''}
      ${c.groups ? c.groups.map(group).join('') : ''}
      ${c.steps ? steps(c.steps) : ''}`,
  })
  node.querySelectorAll('.card__link').forEach((b) => {
    b.addEventListener('click', () => onCategory?.(b.dataset.category))
  })
  return node
}

function stats(items) {
  return `<dl class="card__stats">${items
    .map((s) => `<div class="card__stat"><dd>${s.value}</dd><dt>${s.label}</dt></div>`)
    .join('')}</dl>`
}

function categoryList(categories = []) {
  return `<ul class="card__list" role="list">${categories
    .map(
      (c) => `<li>
        <button class="card__link" type="button" data-category="${c.id}">
          <span class="card__icon">${icon(c.icon)}</span>
          <span class="card__name">${c.name}<span class="card__sub">${c.eyebrow}</span></span>
          <span class="card__arrow">${icon('arrow')}</span>
        </button>
      </li>`,
    )
    .join('')}</ul>`
}

function group(g) {
  const rich = g.items.some((it) => typeof it === 'object')
  const list = rich
    ? `<ul class="partners" role="list">${g.items
        .map((it) => `<li class="partner"><b>${it.name}</b>${it.note ? `<span>${it.note}</span>` : ''}</li>`)
        .join('')}</ul>`
    : `<ul class="chips" role="list">${g.items.map((it) => `<li class="chip">${it}</li>`).join('')}</ul>`
  return `<section class="card__group"><h3 class="range__title">${g.label}</h3>${list}</section>`
}

function steps(items) {
  return `<ol class="steps" role="list">${items
    .map((s, n) => `<li><span class="steps__num">${pad(n + 1)}</span><p>${s}</p></li>`)
    .join('')}</ol>`
}

/* -------------------------------------------------------------------------- */
/* Visit us                                                                   */
/* -------------------------------------------------------------------------- */

function renderVisit({ brand, about, onHome, onAbout, onExplore, onInquire }) {
  const { contact, location, visit } = about
  const screen = el(
    `<section class="screen screen--visit">
       <header class="topbar">
         <div class="topbar__actions">
           <button class="navbtn navbtn--about" type="button" aria-label="About us" title="About us">${icon('info')}</button>
           <button class="navbtn navbtn--home" type="button" aria-label="Back to start" title="Home">${icon('home')}</button>
         </div>
       </header>

       <div class="about__head">
         <p class="eyebrow info__eyebrow">${visit.eyebrow}<span class="info__partner">${about.company}</span></p>
         <h1 class="title about__title">${visit.title.replace(/\.$/, '')}<span class="dot">.</span></h1>
         ${visit.note ? `<p class="visit__note">${visit.note}</p>` : ''}
       </div>

       <div class="visit__map" aria-label="Map showing SafeSurge at ${location.place}"></div>

       <address class="plate">
         <div class="plate__text">
           <p class="plate__label"><span class="about__pin" aria-hidden="true"></span>${brand.name} \u00b7 ${location.place}</p>
           <p class="plate__address">${contact.address}</p>
           <p class="plate__lines">
             <span class="plate__phone">${contact.phone}</span>
             <span>${contact.email}</span>
             <span class="plate__coords">${location.coords}</span>
           </p>
         </div>
         <div class="plate__qr">
           <div class="qr__code qr__code--plate" aria-busy="true"></div>
           <span class="plate__qrlabel">Scan for directions on your phone</span>
         </div>
       </address>

       <footer class="info__footer">
         <button class="cta cta--explore" type="button"><span>Explore Products</span></button>
         <button class="cta cta--inquire" type="button"><span>Inquire Now</span></button>
       </footer>
     </section>`,
  )

  screen.querySelector('.topbar').prepend(logo(brand, { onTap: onHome }))
  screen.querySelector('.navbtn--home').addEventListener('click', onHome)
  screen.querySelector('.navbtn--about').addEventListener('click', onAbout)
  screen.querySelector('.cta--explore').addEventListener('click', onExplore)
  screen.querySelector('.cta--inquire').addEventListener('click', onInquire)

  const qr = screen.querySelector('.qr__code')
  mountQr(qr, contact.mapsUrl ?? brand.site).then(() => qr.removeAttribute('aria-busy'))

  const map = mountMap(screen.querySelector('.visit__map'), {
    lat: location.lat,
    lng: location.lng,
    zoom: location.zoom,
    label: brand.name,
    sub: contact.address.split(',').slice(0, 2).join(','),
  })
  screen.cleanup = () => map.destroy()
  return screen
}

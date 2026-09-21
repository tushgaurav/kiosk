import { el, icon, logo } from '../components/ui.js'

/**
 * Attract screen. Large touch targets, asymmetric tile grid, and a
 * pulsing "Touch to Start" CTA so it reads from across the aisle.
 */
export function renderHome({ brand, products, onSelect }) {
  const screen = el(
    `<section class="screen screen--home">
       <header class="topbar"></header>
       <h1 class="headline">${brand.tagline.replace(/\.$/, '')}<span class="dot">.</span></h1>
       <div class="tiles" role="list"></div>
       <footer class="home__footer">
         <button class="cta cta--start" type="button">
           <span>Touch to Start</span>
         </button>
       </footer>
     </section>`,
  )

  screen.querySelector('.topbar').append(logo(brand))

  const tiles = screen.querySelector('.tiles')
  products.forEach((p, i) => {
    const tile = el(
      `<button class="tile tile--${p.tile}" type="button" role="listitem" style="--i:${i}">
         <img class="tile__img" src="${p.image}" alt="" draggable="false" />
         <span class="tile__meta">
           <span class="tile__eyebrow">${p.eyebrow}</span>
           <span class="tile__name">${p.name}</span>
         </span>
         <span class="tile__arrow">${icon('arrow')}</span>
       </button>`,
    )
    const img = tile.querySelector('.tile__img')
    img.addEventListener('load', () => tile.classList.add('has-image'), { once: true })
    img.addEventListener('error', () => img.remove(), { once: true })
    tile.addEventListener('click', () => onSelect(i))
    tiles.append(tile)
  })

  screen.querySelector('.cta--start').addEventListener('click', () => onSelect(0))
  return screen
}

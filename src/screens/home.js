import { el, icon, logo, media } from '../components/ui.js'

/**
 * Attract screen. Large touch targets, asymmetric tile grid, and a
 * pulsing "Touch to Start" CTA so it reads from across the aisle.
 */
export function renderHome({ brand, products, onSelect, onAbout }) {
  const screen = el(
    `<section class="screen screen--home">
       <header class="topbar">
         <button class="pill pill--about" type="button">
           <span>About us</span>${icon('arrow')}
         </button>
       </header>
       <h1 class="headline">${brand.tagline.replace(/\.$/, '')}<span class="dot">.</span></h1>
       <nav class="tiles" aria-label="Products"></nav>
       <footer class="home__footer">
         <button class="cta cta--start" type="button">
           <span>Touch to Start</span>
         </button>
       </footer>
     </section>`,
  )

  screen.querySelector('.topbar').prepend(logo(brand))
  screen.querySelector('.pill--about').addEventListener('click', onAbout)

  const tiles = screen.querySelector('.tiles')
  products.forEach((p, i) => {
    const tile = el(
      `<button class="tile tile--${p.tile}" type="button" style="--i:${i}">
         ${media(p, 'tile__img')}
         <span class="tile__meta">
           <span class="tile__eyebrow">${p.eyebrow}</span>
           <span class="tile__name">${p.name}</span>
         </span>
         <span class="tile__arrow">${icon('arrow')}</span>
       </button>`,
    )
    const img = tile.querySelector('.tile__img')
    const ready = img.tagName === 'VIDEO' ? 'loadeddata' : 'load'
    img.addEventListener(ready, () => tile.classList.add('has-image'), { once: true })
    img.addEventListener('error', () => img.remove(), { once: true })
    tile.addEventListener('click', () => onSelect(i))
    tiles.append(tile)
  })

  screen.querySelector('.cta--start').addEventListener('click', () => onSelect(0))
  return screen
}

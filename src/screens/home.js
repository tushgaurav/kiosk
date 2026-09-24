import { el, icon, logo, media } from '../components/ui.js'

/**
 * Attract screen. One large tile per category with its sub-categories
 * listed underneath. Tapping a tile opens the first product in the
 * category; the info screen then offers the rest as a switcher.
 */
export function renderHome({ brand, categories, products, onSelect, onAbout }) {
  const screen = el(
    `<section class="screen screen--home">
       <header class="topbar">
         <button class="navbtn navbtn--about" type="button" aria-label="About us" title="About us">${icon('info')}</button>
       </header>
       <h1 class="headline">${brand.tagline.replace(/\.$/, '')}<span class="dot">.</span></h1>
       <nav class="tiles" aria-label="Product categories"></nav>
       <footer class="home__footer">
         <button class="cta cta--start" type="button">
           <span>Touch to Start</span>
         </button>
       </footer>
     </section>`,
  )

  screen.querySelector('.topbar').prepend(logo(brand))
  screen.querySelector('.navbtn--about').addEventListener('click', onAbout)

  const tiles = screen.querySelector('.tiles')
  categories.forEach((c, i) => {
    const first = products.findIndex((p) => p.category === c.id)
    const subs = products.filter((p) => p.category === c.id).map((p) => p.name)

    const tile = el(
      `<button class="tile tile--${c.tile}" type="button" style="--i:${i}">
         ${media(c, 'tile__img')}
         <span class="tile__meta">
           <span class="tile__name">${c.name}</span>
           ${subs.length ? `<span class="tile__subs">${subs.map((s) => `<span class="tile__sub">${s}</span>`).join(' \u00b7 ')}</span>` : ''}
         </span>
         <span class="tile__arrow">${icon('arrow')}</span>
       </button>`,
    )

    // Reveal the photo once it loads. If a video clip is missing, fall back
    // to its poster image; if that is missing too, keep the flat tile.
    const watch = (node) => {
      const ready = node.tagName === 'VIDEO' ? 'loadeddata' : 'load'
      node.addEventListener(ready, () => tile.classList.add('has-image'), { once: true })
      node.addEventListener(
        'error',
        () => {
          if (node.tagName === 'VIDEO' && c.image) {
            const fallback = el(media({ image: c.image }, 'tile__img'))
            node.replaceWith(fallback)
            watch(fallback)
          } else {
            node.remove()
          }
        },
        { once: true },
      )
    }
    watch(tile.querySelector('.tile__img'))

    tile.addEventListener('click', () => onSelect(first < 0 ? 0 : first))
    tiles.append(tile)
  })

  screen.querySelector('.cta--start').addEventListener('click', () => onSelect(0))
  return screen
}

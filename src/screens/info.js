import { el, figure, icon, logo, mountQr, scrollFade } from '../components/ui.js'

export function renderInfo({ brand, product, index, total, onHome, onPrev, onNext, onInquire }) {
  const screen = el(
    `<section class="screen screen--info">
       <header class="topbar">
         <button class="pill pill--home" type="button" aria-label="Back to start">
           ${icon('home')}<span>Home</span>
         </button>
       </header>

       <div class="info__title">
         <p class="eyebrow info__eyebrow">${product.eyebrow}${product.partner ? `<span class="info__partner">${product.partner}</span>` : ''}</p>
         <h1 class="title">${product.name}</h1>
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

  // Horizontal swipe between products (touch / pen / mouse drag).
  let startX = null
  let startY = null
  screen.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button')) return
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

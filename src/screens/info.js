import { el, figure, icon, logo, mountQr } from '../components/ui.js'

export function renderInfo({ brand, product, onHome, onPrev, onNext, onInquire }) {
  const screen = el(
    `<section class="screen screen--info">
       <header class="topbar">
         <button class="iconbtn iconbtn--home" type="button" aria-label="Back to start">
           ${icon('home')}
         </button>
       </header>

       <div class="info__title">
         <h1 class="title">${product.name}</h1>
       </div>

       <div class="info__hero"></div>

       <div class="info__copy">
         <p class="lede">${product.description}</p>
         <div class="qr">
           <div class="qr__code" aria-busy="true"></div>
         </div>
       </div>

       <footer class="info__footer">
         <div class="pager">
           <button class="iconbtn iconbtn--prev" type="button" aria-label="Previous">${icon('prev')}</button>
           <button class="iconbtn iconbtn--next" type="button" aria-label="Next">${icon('next')}</button>
         </div>
         <button class="cta cta--inquire" type="button"><span>Inquire Now</span></button>
       </footer>
     </section>`,
  )

  screen.querySelector('.topbar').prepend(logo(brand, { onTap: onHome }))
  screen.querySelector('.info__hero').append(figure(product))

  const qr = screen.querySelector('.qr__code')
  mountQr(qr, product.url).then(() => qr.removeAttribute('aria-busy'))

  screen.querySelector('.iconbtn--home').addEventListener('click', onHome)
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

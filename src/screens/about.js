import { el, icon, logo, mountQr, scrollFade } from '../components/ui.js'

/**
 * Company profile as a handful of short sections behind a segmented
 * switcher. Only one section is on screen at a time so nothing needs to
 * be read top to bottom.
 */
export function renderAbout({ brand, about, initial, onHome, onExplore, onInquire }) {
  const screen = el(
    `<section class="screen screen--about">
       <header class="topbar">
         <button class="pill pill--home" type="button" aria-label="Back to start">
           ${icon('home')}<span>Home</span>
         </button>
       </header>

       <div class="about__head">
         <p class="eyebrow">${about.eyebrow}<span class="info__partner">${about.company}</span></p>
         <div class="tabs" role="tablist" aria-label="About sections">
           ${about.sections
             .map(
               (s, i) =>
                 `<button class="tab" type="button" role="tab" id="tab-${s.id}" aria-selected="${i === 0}" aria-controls="panel-${s.id}" data-id="${s.id}">${s.label}</button>`,
             )
             .join('')}
         </div>
       </div>

       <div class="about__panel" role="tabpanel"></div>

       <footer class="info__footer">
         <button class="cta cta--explore" type="button"><span>Explore Products</span></button>
         <button class="cta cta--inquire" type="button"><span>Inquire Now</span></button>
       </footer>
     </section>`,
  )

  screen.querySelector('.topbar').prepend(logo(brand, { onTap: onHome }))
  screen.querySelector('.pill--home').addEventListener('click', onHome)
  screen.querySelector('.cta--explore').addEventListener('click', onExplore)
  screen.querySelector('.cta--inquire').addEventListener('click', onInquire)

  const tabs = [...screen.querySelectorAll('.tab')]
  const panel = screen.querySelector('.about__panel')

  function show(id) {
    const section = about.sections.find((s) => s.id === id) ?? about.sections[0]
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.id === section.id)))
    panel.id = `panel-${section.id}`
    panel.setAttribute('aria-labelledby', `tab-${section.id}`)
    panel.replaceChildren(renderSection(section, brand))
    scrollFade(panel.querySelector('.section__content'))
  }

  tabs.forEach((t) => t.addEventListener('click', () => show(t.dataset.id)))

  // Swipe left/right to move between sections.
  let startX = null
  let startY = null
  panel.addEventListener('pointerdown', (e) => {
    startX = e.clientX
    startY = e.clientY
  })
  panel.addEventListener('pointerup', (e) => {
    if (startX === null) return
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    startX = startY = null
    if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      const i = about.sections.findIndex((s) => `panel-${s.id}` === panel.id)
      const n = about.sections.length
      show(about.sections[(i + (dx < 0 ? 1 : -1) + n) % n].id)
    }
  })
  panel.addEventListener('pointercancel', () => (startX = startY = null))

  show(initial ?? about.sections[0].id)
  return screen
}

function renderSection(s, brand) {
  const node = el(
    `<div class="section">
      <div class="section__content">
       <h1 class="title section__title">${s.title}</h1>
       ${s.text ? `<p class="section__text">${s.text}</p>` : ''}
       ${
         s.points
           ? `<ul class="points" role="list">${s.points.map((p) => `<li>${p}</li>`).join('')}</ul>`
           : ''
       }
       ${
         s.stats
           ? `<dl class="stats">${s.stats
               .map((st) => `<div class="stat"><dd>${st.value}</dd><dt>${st.label}</dt></div>`)
               .join('')}</dl>`
           : ''
       }
       ${
         s.chips
           ? `<section class="about__list">
                <h2 class="range__title">${s.chips.title}</h2>
                <ul class="chips" role="list">${s.chips.items.map((c) => `<li class="chip">${c}</li>`).join('')}</ul>
              </section>`
           : ''
       }
       ${
         s.contact
           ? `<section class="contact">
                <div class="contact__block">
                  <h2 class="range__title">Get in touch</h2>
                  <address class="contact__lines">
                    <span>${s.contact.address}</span>
                    <span>${s.contact.phone}</span>
                    <span>${s.contact.email}</span>
                    <span>${s.contact.web}</span>
                  </address>
                </div>
                <div class="qr">
                  <div class="qr__code" aria-busy="true"></div>
                  <span class="qr__label">Scan to visit ${s.contact.web}</span>
                </div>
              </section>`
           : ''
       }
      </div>
      ${s.image ? `<figure class="section__media"><img src="${s.image}" alt="" draggable="false" /></figure>` : ''}
     </div>`,
  )
  const qr = node.querySelector('.qr__code')
  if (qr) mountQr(qr, brand.site).then(() => qr.removeAttribute('aria-busy'))
  const img = node.querySelector('.section__media img')
  if (img) {
    img.addEventListener('load', () => img.parentElement.classList.add('is-loaded'), { once: true })
    img.addEventListener('error', () => img.parentElement.remove(), { once: true })
  }
  return node
}

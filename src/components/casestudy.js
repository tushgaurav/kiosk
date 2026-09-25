import { interests } from './interests.js'
import { el, figure, icon } from './ui.js'

/**
 * Full-screen page for one case study: the site video (or photo) large,
 * then the story — challenge, solution and outcome figures. Opened from
 * the tiles on a product's "Case studies" card; the footer steps through
 * the other studies on the same product and adds the product to the
 * visitor's interests.
 *
 * Mirrors the document reader: one overlay at a time, closed by the ✕,
 * Escape, navigating away or the idle timer (see main.js).
 */

let current = null

/** True while a case study is open (the idle timer reads this). */
export function isCaseStudyOpen() {
  return current !== null
}

/** Close the open case study, if any. */
export function closeCaseStudy() {
  if (!current) return
  const node = current
  current = null
  node.cleanup?.()
  node.classList.remove('is-open')
  node.addEventListener('transitionend', () => node.remove(), { once: true })
  setTimeout(() => node.remove(), 400)
}

/**
 * Open study number `index` of `product.caseStudies`. `category` (optional)
 * is shown in the header eyebrow.
 */
export function openCaseStudy(product, index, { category } = {}) {
  closeCaseStudy()
  const studies = product.caseStudies ?? []
  const study = studies[index]
  if (!study) return

  const node = el(
    `<div class="casepage" role="dialog" aria-modal="true" aria-labelledby="casepage-title">
       <header class="casepage__bar">
         <div class="casepage__meta">
           <p class="eyebrow casepage__eyebrow">Case study<span class="casepage__product">${product.name}</span></p>
           <h2 id="casepage-title" class="casepage__title">${study.title}</h2>
         </div>
         <button class="iconbtn iconbtn--close" type="button" aria-label="Close case study">${icon('close')}</button>
       </header>

       <div class="casepage__body">
         <div class="casepage__media"></div>
         <div class="casepage__story">
           ${study.industry ? `<p class="casepage__industry">${study.industry}</p>` : ''}
           <dl class="casepage__text">
             ${study.challenge ? `<div><dt>Challenge</dt><dd>${study.challenge}</dd></div>` : ''}
             ${study.solution ? `<div><dt>Solution</dt><dd>${study.solution}</dd></div>` : ''}
           </dl>
           ${results(study.results)}
         </div>
       </div>

       <footer class="casepage__foot">
         ${
           studies.length > 1
             ? `<div class="pager">
                  <button class="iconbtn iconbtn--prev" type="button" aria-label="Previous case study">${icon('prev')}</button>
                  <span class="pager__count"><b>${index + 1}</b> / ${studies.length}</span>
                  <button class="iconbtn iconbtn--next" type="button" aria-label="Next case study">${icon('next')}</button>
                </div>`
             : `<span class="casepage__cat">${category?.name ?? ''}</span>`
         }
         <button class="cta cta--interest" type="button" aria-pressed="false">
           <span class="cta__swap"><span class="cta__off">${icon('plus')}Add to Interests</span><span class="cta__on">${icon('check')}Added</span></span>
         </button>
       </footer>
     </div>`,
  )

  node.querySelector('.casepage__media').append(
    figure({ video: study.video, image: study.image, icon: product.icon, name: study.title }, 'casefig'),
  )

  document.body.append(node)
  current = node
  requestAnimationFrame(() => node.classList.add('is-open'))

  node.querySelector('.iconbtn--close').addEventListener('click', closeCaseStudy)
  const step = (d) => openCaseStudy(product, (index + d + studies.length) % studies.length, { category })
  node.querySelector('.iconbtn--prev')?.addEventListener('click', () => step(-1))
  node.querySelector('.iconbtn--next')?.addEventListener('click', () => step(1))

  const onKey = (e) => {
    if (e.key === 'Escape') closeCaseStudy()
    else if (e.key === 'ArrowRight' && studies.length > 1) step(1)
    else if (e.key === 'ArrowLeft' && studies.length > 1) step(-1)
  }
  window.addEventListener('keydown', onKey)

  // Interests button mirrors the store, like the one on the product page.
  const interest = node.querySelector('.cta--interest')
  const paint = () => {
    const on = interests.has(product.id)
    interest.classList.toggle('is-added', on)
    interest.setAttribute('aria-pressed', String(on))
  }
  interest.addEventListener('click', () => interests.toggle(product))
  paint()
  const unsubscribe = interests.subscribe(paint)

  node.cleanup = () => {
    window.removeEventListener('keydown', onKey)
    unsubscribe()
  }
  return node
}

/** Outcome figures as dark stat tiles. */
function results(items = []) {
  if (!items.length) return ''
  return `<ul class="casepage__results" role="list">${items
    .map((r) => `<li><b>${r.value}</b><span>${r.label}</span></li>`)
    .join('')}</ul>`
}

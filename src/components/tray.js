import { interests } from './interests.js'
import { el, icon } from './ui.js'

/** Names shown in the bar before it collapses the rest into "+N more". */
const NAMES_SHOWN = 3

/**
 * Bar docked under the screens once the visitor has added at least one
 * interest: how many, which, and a button to review and submit them all.
 * Mounted once by main.js; it follows the visitor from screen to screen.
 */
export function mountTray(container, { onReview }) {
  const tray = el(
    `<div class="tray" aria-live="polite">
       <div class="tray__inner">
         <div class="tray__bar">
           <div class="tray__text">
             <b class="tray__count"></b>
             <span class="tray__names"></span>
           </div>
           <button class="cta cta--review" type="button">
             <span>Review &amp; Submit</span>${icon('arrow')}
           </button>
         </div>
       </div>
     </div>`,
  )
  const count = tray.querySelector('.tray__count')
  const names = tray.querySelector('.tray__names')

  tray.querySelector('.cta--review').addEventListener('click', onReview)

  function paint(list) {
    const n = list.length
    tray.classList.toggle('is-open', n > 0)
    if (!n) return
    count.textContent = n === 1 ? '1 interest' : `${n} interests`
    const shown = list.slice(0, NAMES_SHOWN).map((p) => p.name)
    const more = n - shown.length
    names.textContent = more > 0 ? `${shown.join(', ')} +${more} more` : shown.join(', ')
    // Nudge the count so the change registers even in peripheral vision.
    count.classList.remove('is-bump')
    void count.offsetWidth
    count.classList.add('is-bump')
  }

  interests.subscribe(paint)
  paint(interests.list())
  container.append(tray)
  return tray
}

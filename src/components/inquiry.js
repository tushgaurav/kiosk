import { el, icon, mountQr } from './ui.js'

const STORAGE_KEY = 'safesurge:leads'
const SUCCESS_MS = 4500

let current = null

/** Close whatever inquiry sheet is open (used by the idle timer too). */
export function closeInquiry() {
  if (!current) return
  const node = current
  current = null
  node.classList.remove('is-open')
  node.addEventListener('transitionend', () => node.remove(), { once: true })
  // Safety net in case transitionend never fires (e.g. reduced motion).
  setTimeout(() => node.remove(), 400)
}

/**
 * Bottom-sheet lead form. Leads are persisted to localStorage so staff can
 * export them from the kiosk later (see window.safesurgeLeads()).
 */
export function openInquiry(product) {
  closeInquiry()

  const sheet = el(
    `<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
       <div class="sheet__backdrop"></div>
       <div class="sheet__panel">
         <div class="sheet__grab" aria-hidden="true"></div>
         <header class="sheet__head">
           <div>
             <p class="eyebrow">Inquiry</p>
             <h2 id="sheet-title" class="sheet__title">${product.name}</h2>
           </div>
           <button class="iconbtn iconbtn--close" type="button" aria-label="Close">${icon('close')}</button>
         </header>

         <form class="form" novalidate>
           <div class="form__grid">
             <label class="field">
               <span class="field__label">Name</span>
               <input name="name" type="text" autocomplete="off" required placeholder="Jane Smith" />
             </label>
             <label class="field">
               <span class="field__label">Company</span>
               <input name="company" type="text" autocomplete="off" placeholder="Acme Manufacturing" />
             </label>
             <label class="field">
               <span class="field__label">Email</span>
               <input name="email" type="email" autocomplete="off" inputmode="email" required placeholder="jane@acme.com" />
             </label>
             <label class="field">
               <span class="field__label">Phone</span>
               <input name="phone" type="tel" autocomplete="off" inputmode="tel" placeholder="+1 555 010 0100" />
             </label>
           </div>
           <p class="form__error" role="alert" hidden></p>
           <div class="form__actions">
             <div class="form__qr">
               <div class="qr__code qr__code--sm"></div>
               <span>Prefer your phone?<br/>Scan to inquire online.</span>
             </div>
             <button class="cta cta--submit" type="submit"><span>Send Inquiry</span></button>
           </div>
         </form>

         <div class="success" hidden>
           <div class="success__mark">${icon('check')}</div>
           <h3>Thanks, we'll be in touch.</h3>
           <p>Our ${product.name} team will reach out shortly.</p>
         </div>
       </div>
     </div>`,
  )

  document.body.append(sheet)
  current = sheet
  requestAnimationFrame(() => sheet.classList.add('is-open'))

  mountQr(sheet.querySelector('.qr__code'), product.url)

  sheet.querySelector('.sheet__backdrop').addEventListener('click', closeInquiry)
  sheet.querySelector('.iconbtn--close').addEventListener('click', closeInquiry)

  const form = sheet.querySelector('form')
  const error = sheet.querySelector('.form__error')
  const firstInput = form.querySelector('input[name=name]')
  setTimeout(() => firstInput.focus({ preventScroll: true }), 350)

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(form))
    const problems = []
    if (!data.name.trim()) problems.push('name')
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email.trim())) problems.push('a valid email')

    form.querySelectorAll('.field').forEach((f) => f.classList.remove('is-invalid'))
    if (problems.length) {
      if (problems.includes('name')) form.querySelector('[name=name]').closest('.field').classList.add('is-invalid')
      if (problems.includes('a valid email')) form.querySelector('[name=email]').closest('.field').classList.add('is-invalid')
      error.textContent = `Please enter ${problems.join(' and ')}.`
      error.hidden = false
      return
    }

    saveLead({ ...data, product: product.id, at: new Date().toISOString() })
    form.hidden = true
    sheet.querySelector('.success').hidden = false
    sheet.classList.add('is-done')
    setTimeout(() => {
      if (current === sheet) closeInquiry()
    }, SUCCESS_MS)
  })

  return sheet
}

function saveLead(lead) {
  try {
    const leads = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    leads.push(lead)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads))
  } catch (err) {
    console.warn('Could not persist lead', err, lead)
  }
}

/** Staff helper: run `safesurgeLeads()` in DevTools to download a CSV. */
export function installLeadExport() {
  window.safesurgeLeads = () => {
    const leads = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const cols = ['at', 'product', 'name', 'company', 'email', 'phone']
    const csv = [cols.join(','), ...leads.map((l) => cols.map((c) => JSON.stringify(l[c] ?? '')).join(','))].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `safesurge-leads-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    return leads
  }
}

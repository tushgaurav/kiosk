import { el, icon, mountQr } from './ui.js'

const API = '/api/leads'
const PENDING_KEY = 'safesurge:pending-leads'
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
 * Bottom-sheet lead form. Leads are posted to the kiosk server (SQLite) and
 * reviewed at /admin. If the server can't be reached the lead is queued in
 * localStorage and retried later — the visitor still sees the thank-you.
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
               <input name="name" type="text" autocomplete="off" autocapitalize="words" enterkeyhint="next" required placeholder="Jane Smith" />
             </label>
             <label class="field">
               <span class="field__label">Designation</span>
               <input name="designation" type="text" autocomplete="off" autocapitalize="words" enterkeyhint="next" placeholder="Plant Head" />
             </label>
             <label class="field field--wide">
               <span class="field__label">Company</span>
               <input name="company" type="text" autocomplete="off" autocapitalize="words" enterkeyhint="next" placeholder="Acme Manufacturing" />
             </label>
             <label class="field">
               <span class="field__label">Email</span>
               <input name="email" type="email" autocomplete="off" autocapitalize="off" inputmode="email" enterkeyhint="next" required placeholder="jane@acme.com" />
             </label>
             <label class="field">
               <span class="field__label">Phone</span>
               <input name="phone" type="tel" autocomplete="off" inputmode="tel" enterkeyhint="next" placeholder="+91 98765 43210" />
             </label>
             <label class="field">
               <span class="field__label">City</span>
               <input name="city" type="text" autocomplete="off" autocapitalize="words" enterkeyhint="next" placeholder="Pune" />
             </label>
             <label class="field">
               <span class="field__label">State</span>
               <input name="state" type="text" autocomplete="off" autocapitalize="words" enterkeyhint="send" placeholder="Maharashtra" />
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
  const inputs = [...form.querySelectorAll('input')]

  // No auto-focus: on a touch kiosk that would pop the on-screen keyboard
  // over the sheet before the visitor has seen it. Instead, keep whichever
  // field they tap in view once the keyboard shrinks the viewport.
  inputs.forEach((input, i) => {
    input.addEventListener('focus', () => {
      setTimeout(() => input.scrollIntoView({ block: 'center', behavior: 'smooth' }), 250)
    })
    // Clear the error state as soon as the visitor starts correcting it.
    input.addEventListener('input', () => {
      input.closest('.field').classList.remove('is-invalid')
      if (!form.querySelector('.field.is-invalid')) error.hidden = true
    })
    // "Next" on the on-screen keyboard moves to the following field.
    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || i === inputs.length - 1) return
      e.preventDefault()
      inputs[i + 1].focus()
    })
  })

  const submit = form.querySelector('.cta--submit')
  const submitLabel = submit.firstElementChild
  let busy = false

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (busy) return
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
      form.querySelector('.field.is-invalid input')?.focus()
      return
    }

    busy = true
    submit.disabled = true
    submitLabel.textContent = 'Sending…'
    inputs.forEach((i) => i.blur())

    const result = await sendLead({ ...data, product: product.id, product_name: product.name, client_id: uid() })

    if (!result.ok) {
      busy = false
      submit.disabled = false
      submitLabel.textContent = 'Send Inquiry'
      error.textContent = result.error
      error.hidden = false
      return
    }

    form.hidden = true
    sheet.querySelector('.success').hidden = false
    sheet.classList.add('is-done')
    setTimeout(() => {
      if (current === sheet) closeInquiry()
    }, SUCCESS_MS)
  })

  return sheet
}

// ---- Persistence -----------------------------------------------------------

/** Unique id per submission so a retried request can never create a duplicate. */
function uid() {
  return crypto.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

async function post(lead) {
  return fetch(API, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(lead),
  })
}

/**
 * Send a lead to the server. Resolves `{ ok: true }` when stored (or safely
 * queued for retry), `{ ok: false, error }` when the server rejected it.
 */
async function sendLead(lead) {
  try {
    const res = await post(lead)
    if (res.ok) {
      flushPendingLeads()
      return { ok: true }
    }
    if (res.status < 500) {
      const body = await res.json().catch(() => ({}))
      return { ok: false, error: body.error || 'Something went wrong. Please try again.' }
    }
  } catch {
    // Network failure — fall through to the queue.
  }
  queuePending(lead)
  return { ok: true, queued: true }
}

function readPending() {
  try {
    return JSON.parse(localStorage.getItem(PENDING_KEY) || '[]')
  } catch {
    return []
  }
}

function writePending(list) {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(list))
  } catch (err) {
    console.warn('Could not persist pending lead', err)
  }
}

function queuePending(lead) {
  writePending([...readPending(), lead])
}

let flushing = false

/** Retry leads that were captured while the server was unreachable. */
export async function flushPendingLeads() {
  if (flushing || readPending().length === 0) return
  flushing = true
  try {
    for (const lead of readPending()) {
      const res = await post(lead)
      // Server-side trouble: stop and try again later.
      if (res.status >= 500) break
      // Stored — or rejected as invalid, which a retry can never fix.
      if (!res.ok) console.warn('Dropping invalid queued lead', lead, await res.text())
      writePending(readPending().filter((l) => l.client_id !== lead.client_id))
    }
  } catch {
    // Still offline; leave the queue for next time.
  } finally {
    flushing = false
  }
}

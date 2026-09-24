import { mountProductQr } from '../settings.js'
import { interests } from './interests.js'
import { keyboard } from './keyboard.js'
import { el, icon } from './ui.js'

const API = '/api/leads'
const PENDING_KEY = 'safesurge:pending-leads'
const SUCCESS_MS = 4500
/** Time for the sheet to slide in before the first field takes focus. */
const OPEN_MS = 480

let current = null
let unsubscribe = null

/** Close whatever inquiry sheet is open (used by the idle timer too). */
export function closeInquiry() {
  if (!current) return
  const node = current
  current = null
  unsubscribe?.()
  unsubscribe = null
  node.classList.remove('is-open')
  node.addEventListener('transitionend', () => node.remove(), { once: true })
  // Safety net in case transitionend never fires (e.g. reduced motion).
  setTimeout(() => node.remove(), 400)
}

/** "Conveyors, X-ray and 2 more" for the thank-you line. */
function summarise(list) {
  const names = list.map((p) => p.name)
  if (names.length <= 2) return names.join(' and ')
  if (names.length === 3) return `${names[0]}, ${names[1]} and ${names[2]}`
  return `${names[0]}, ${names[1]} and ${names.length - 2} more`
}

/**
 * Bottom-sheet lead form. The visitor's interests (see interests.js) sit at
 * the top as removable chips; below them their details, typed on the
 * on-screen keyboard docked at the bottom. One submission carries every
 * interest. With no interests it goes out as a general inquiry.
 *
 * Leads are posted to the kiosk server (SQLite) and reviewed at /admin. If
 * the server can't be reached the lead is queued in localStorage and
 * retried later — the visitor still sees the thank-you.
 */
export function openInquiry() {
  closeInquiry()

  const sheet = el(
    `<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
       <div class="sheet__backdrop"></div>
       <div class="sheet__panel">
         <header class="sheet__head">
           <div class="sheet__grab" aria-hidden="true"></div>
           <div class="sheet__heading">
             <div>
               <p class="eyebrow sheet__eyebrow"></p>
               <h2 id="sheet-title" class="sheet__title"></h2>
             </div>
             <button class="iconbtn iconbtn--close" type="button" aria-label="Close">${icon('close')}</button>
           </div>
         </header>

         <div class="sheet__body">
           <div class="picks"></div>

           <form class="form" novalidate>
             <div class="form__grid">
               <label class="field">
                 <span class="field__label">Name</span>
                 <input name="name" type="text" autocomplete="off" autocapitalize="words" inputmode="none" data-kbd="text" maxlength="120" required placeholder="Jane Smith" />
               </label>
               <label class="field">
                 <span class="field__label">Designation</span>
                 <input name="designation" type="text" autocomplete="off" autocapitalize="words" inputmode="none" data-kbd="text" maxlength="120" placeholder="Plant Head" />
               </label>
               <label class="field field--wide">
                 <span class="field__label">Company</span>
                 <input name="company" type="text" autocomplete="off" autocapitalize="words" inputmode="none" data-kbd="text" maxlength="160" placeholder="Acme Manufacturing" />
               </label>
               <label class="field">
                 <span class="field__label">Email</span>
                 <input name="email" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="none" data-kbd="email" maxlength="200" required placeholder="jane@acme.com" />
               </label>
               <label class="field">
                 <span class="field__label">Phone</span>
                 <input name="phone" type="tel" autocomplete="off" inputmode="none" data-kbd="tel" maxlength="40" placeholder="+91 98765 43210" />
               </label>
               <label class="field">
                 <span class="field__label">City</span>
                 <input name="city" type="text" autocomplete="off" autocapitalize="words" inputmode="none" data-kbd="text" maxlength="120" placeholder="Pune" />
               </label>
               <label class="field">
                 <span class="field__label">State</span>
                 <input name="state" type="text" autocomplete="off" autocapitalize="words" inputmode="none" data-kbd="text" data-enter="Send" maxlength="120" placeholder="Maharashtra" />
               </label>
             </div>
             <p class="form__error" role="alert" hidden></p>
             <div class="form__actions">
               <div class="form__qr">
                 <div class="qr__code qr__code--sm"></div>
                 <span>Prefer your phone?<br/>Scan for our catalogue.</span>
               </div>
               <button class="cta cta--submit" type="submit"><span>Send Inquiry</span></button>
             </div>
           </form>

           <div class="success" hidden>
             <div class="success__mark">${icon('check')}</div>
             <h3>Thanks, we'll be in touch.</h3>
             <p></p>
           </div>
         </div>

         <div class="sheet__kbd"></div>
       </div>
     </div>`,
  )

  document.body.append(sheet)
  current = sheet
  requestAnimationFrame(() => sheet.classList.add('is-open'))

  mountProductQr(sheet.querySelector('.qr__code'))

  sheet.querySelector('.sheet__backdrop').addEventListener('click', closeInquiry)
  sheet.querySelector('.iconbtn--close').addEventListener('click', closeInquiry)

  // ---- Interests -----------------------------------------------------------

  const eyebrow = sheet.querySelector('.sheet__eyebrow')
  const title = sheet.querySelector('.sheet__title')
  const picks = sheet.querySelector('.picks')

  function paintInterests(list) {
    const n = list.length
    eyebrow.textContent = n ? `Inquiry \u00b7 ${n} ${n === 1 ? 'product' : 'products'}` : 'Inquiry'
    title.textContent = n ? 'Your interests' : 'General inquiry'
    picks.innerHTML = n
      ? `<ul class="picks__list" role="list" aria-label="Products you are interested in">${list
          .map(
            (p) =>
              `<li><button class="pick" type="button" data-id="${p.id}" aria-label="Remove ${p.name}">
                 <span>${p.name}</span>${icon('close')}
               </button></li>`,
          )
          .join('')}</ul>`
      : `<p class="picks__empty">No products picked — we'll treat this as a general inquiry. Add products from their pages with <b>Add to Interests</b>.</p>`
  }

  picks.addEventListener('click', (e) => {
    const id = e.target.closest('.pick')?.dataset.id
    if (id) interests.remove(id)
  })

  paintInterests(interests.list())
  unsubscribe = interests.subscribe(paintInterests)

  // ---- Form ----------------------------------------------------------------

  const body = sheet.querySelector('.sheet__body')
  const form = sheet.querySelector('form')
  const error = sheet.querySelector('.form__error')
  const inputs = [...form.querySelectorAll('input')]

  /** Enter (on-screen or hardware) moves on; on the last field it sends. */
  const advance = (input) => {
    const i = inputs.indexOf(input)
    if (i < inputs.length - 1) inputs[i + 1].focus()
    else form.requestSubmit()
  }

  const kbd = keyboard({ onEnter: advance })
  sheet.querySelector('.sheet__kbd').append(kbd.el)
  form.addEventListener('focusin', (e) => {
    if (e.target.matches('input')) kbd.attach(e.target)
  })

  inputs.forEach((input) => {
    // Keep the field being typed into above the keyboard.
    input.addEventListener('focus', () => {
      const r = input.getBoundingClientRect()
      const b = body.getBoundingClientRect()
      if (r.top < b.top || r.bottom > b.bottom) input.scrollIntoView({ block: 'center', behavior: 'smooth' })
    })
    // Clear the error state as soon as the visitor starts correcting it.
    input.addEventListener('input', () => {
      input.closest('.field').classList.remove('is-invalid')
      if (!form.querySelector('.field.is-invalid')) error.hidden = true
    })
    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return
      e.preventDefault()
      advance(input)
    })
  })

  // The keyboard is part of the sheet, so focusing straight away costs
  // nothing — wait for the slide-in so the caret lands on a settled layout.
  setTimeout(() => {
    if (current === sheet && !form.hidden) inputs[0].focus({ preventScroll: true })
  }, OPEN_MS)

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

    const picked = interests.list()
    const result = await sendLead({ ...data, interests: picked, client_id: uid() })

    if (!result.ok) {
      busy = false
      submit.disabled = false
      submitLabel.textContent = 'Send Inquiry'
      error.textContent = result.error
      error.hidden = false
      return
    }

    inputs.forEach((i) => i.blur())
    form.hidden = true
    picks.hidden = true
    sheet.querySelector('.sheet__kbd').hidden = true
    sheet.querySelector('.success p').textContent = picked.length
      ? `Our team will reach out shortly about ${summarise(picked)}.`
      : 'Our team will reach out shortly.'
    sheet.querySelector('.success').hidden = false
    sheet.classList.add('is-done')
    // Stop listening first so the heading keeps naming what was just sent.
    unsubscribe?.()
    unsubscribe = null
    interests.clear()
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

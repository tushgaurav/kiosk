/**
 * Leads admin (/admin). Sign in with ADMIN_PASSWORD, then review, search,
 * export and prune the inquiries captured by the kiosk.
 */
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import './admin.css'

import { el, icon, logo } from '../components/ui.js'
import { brand } from '../data/products.js'

const TOKEN_KEY = 'safesurge:admin-token'
const REFRESH_MS = 30_000
const SEARCH_FIELDS = ['name', 'designation', 'company', 'email', 'phone', 'city', 'state', 'product_name']

const root = document.querySelector('#admin')

let token = sessionStorage.getItem(TOKEN_KEY) || ''
let rows = []
let query = ''
/** The active dashboard's reload function, or null when signed out. */
let reload = null

// Keep the list live during the show; pause while the tab is hidden.
setInterval(() => {
  if (document.visibilityState === 'visible') reload?.()
}, REFRESH_MS)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') reload?.()
})

// ---- Helpers ---------------------------------------------------------------

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

const fmtDate = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
const fmtTime = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
const fmtClock = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })

async function api(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: { authorization: `Bearer ${token}`, ...options.headers },
  })
  if (res.status === 401) {
    signOut()
    throw new Error('Signed out')
  }
  return res
}

function signOut() {
  token = ''
  reload = null
  sessionStorage.removeItem(TOKEN_KEY)
  renderLogin()
}

function matches(lead, q) {
  if (!q) return true
  const hay = SEARCH_FIELDS.map((f) => lead[f] || '')
    .join(' ')
    .toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => hay.includes(term))
}

// ---- Login -----------------------------------------------------------------

function renderLogin(message = '') {
  const view = el(
    `<main class="login">
       <form class="login__card" novalidate>
         <div class="login__brand"></div>
         <p class="eyebrow">Kiosk admin</p>
         <h1 class="login__title">Leads</h1>
         <label class="field">
           <span class="field__label">Password</span>
           <input name="password" type="password" autocomplete="current-password" autofocus required />
         </label>
         <p class="login__error" role="alert" ${message ? '' : 'hidden'}>${esc(message)}</p>
         <button class="btn btn--primary btn--block" type="submit"><span>Sign in</span></button>
       </form>
     </main>`,
  )
  view.querySelector('.login__brand').append(logo(brand))

  const form = view.querySelector('form')
  const input = form.querySelector('input')
  const error = form.querySelector('.login__error')
  const button = form.querySelector('button')

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const password = input.value
    if (!password) return input.focus()
    button.disabled = true
    button.firstElementChild.textContent = 'Signing in…'
    try {
      const res = await fetch('/api/leads', { headers: { authorization: `Bearer ${password}` } })
      if (res.status === 401) throw new Error('That password is not right.')
      if (!res.ok) throw new Error('The server returned an error. Try again.')
      token = password
      sessionStorage.setItem(TOKEN_KEY, token)
      rows = await res.json()
      renderDashboard()
    } catch (err) {
      error.textContent = err.message.includes('fetch') ? 'Cannot reach the kiosk server.' : err.message
      error.hidden = false
      button.disabled = false
      button.firstElementChild.textContent = 'Sign in'
      input.select()
    }
  })

  root.replaceChildren(view)
  input.focus()
}

// ---- Dashboard -------------------------------------------------------------

function renderDashboard() {
  const view = el(
    `<div class="page">
       <header class="head">
         <div class="head__brand"></div>
         <div class="head__title">
           <p class="eyebrow">Kiosk admin</p>
           <h1>Leads</h1>
         </div>
         <p class="head__meta">
           <span class="head__count"></span>
           <span class="head__status"></span>
         </p>
         <div class="head__actions">
           <label class="search">
             ${icon('funnel')}
             <input type="search" placeholder="Search name, company, city…" autocomplete="off" spellcheck="false" />
           </label>
           <button class="btn" type="button" data-action="refresh">Refresh</button>
           <button class="btn btn--primary" type="button" data-action="export">Export CSV</button>
           <button class="btn btn--ghost" type="button" data-action="signout">Sign out</button>
         </div>
       </header>

       <main class="body">
         <div class="table-wrap">
           <table class="leads">
             <thead>
               <tr>
                 <th>Received</th>
                 <th>Visitor</th>
                 <th>Company</th>
                 <th>Contact</th>
                 <th>Location</th>
                 <th>Interest</th>
                 <th><span class="sr-only">Actions</span></th>
               </tr>
             </thead>
             <tbody></tbody>
           </table>
           <div class="empty" hidden></div>
         </div>
       </main>
     </div>`,
  )
  view.querySelector('.head__brand').append(logo(brand))

  const tbody = view.querySelector('tbody')
  const empty = view.querySelector('.empty')
  const count = view.querySelector('.head__count')
  const status = view.querySelector('.head__status')
  const search = view.querySelector('.search input')

  function paint() {
    const visible = rows.filter((r) => matches(r, query))
    tbody.innerHTML = visible.map(rowHtml).join('')
    empty.hidden = visible.length > 0
    if (!visible.length) {
      empty.innerHTML = rows.length
        ? `<h2>No matches</h2><p>Nothing matches “${esc(query)}”.</p>`
        : `<h2>No inquiries yet</h2><p>Leads submitted on the kiosk will appear here.</p>`
    }
    count.textContent = query ? `${visible.length} of ${rows.length}` : `${rows.length}`
    count.dataset.unit = rows.length === 1 && !query ? 'lead' : 'leads'
  }

  function setStatus(text, offline = false) {
    status.textContent = text
    status.classList.toggle('is-offline', offline)
  }

  async function load() {
    try {
      const res = await api('/leads')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      rows = await res.json()
      paint()
      setStatus(`Updated ${fmtClock.format(new Date())}`)
    } catch (err) {
      if (err.message !== 'Signed out') setStatus('Cannot reach server — retrying', true)
    }
  }

  search.addEventListener('input', () => {
    query = search.value.trim()
    paint()
  })

  view.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]')
    if (!btn) return
    const action = btn.dataset.action

    if (action === 'refresh') return load()
    if (action === 'signout') return signOut()

    if (action === 'export') {
      btn.disabled = true
      try {
        const res = await api('/leads.csv')
        if (!res.ok) throw new Error()
        const url = URL.createObjectURL(await res.blob())
        const a = Object.assign(document.createElement('a'), {
          href: url,
          download: `safesurge-leads-${new Date().toISOString().slice(0, 10)}.csv`,
        })
        a.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      } catch {
        setStatus('Export failed — is the server up?', true)
      } finally {
        btn.disabled = false
      }
      return
    }

    if (action === 'delete') {
      const tr = btn.closest('tr')
      const id = Number(tr.dataset.id)
      const lead = rows.find((r) => r.id === id)
      if (!lead || !confirm(`Delete the inquiry from ${lead.name}?\n\nThis cannot be undone.`)) return
      tr.classList.add('is-removing')
      const res = await api(`/leads/${id}`, { method: 'DELETE' })
      if (res.ok || res.status === 404) {
        rows = rows.filter((r) => r.id !== id)
        paint()
      } else {
        tr.classList.remove('is-removing')
        setStatus('Could not delete that lead', true)
      }
    }
  })

  reload = load
  root.replaceChildren(view)
  paint()
  setStatus(`Updated ${fmtClock.format(new Date())}`)
}

function rowHtml(lead) {
  const at = new Date(lead.created_at)
  const location = [lead.city, lead.state].filter(Boolean).join(', ')
  return `
    <tr data-id="${lead.id}">
      <td class="leads__when">
        <time datetime="${esc(lead.created_at)}">${fmtDate.format(at)}<span>${fmtTime.format(at)}</span></time>
      </td>
      <td class="leads__who">
        <strong>${esc(lead.name)}</strong>
        ${lead.designation ? `<span>${esc(lead.designation)}</span>` : ''}
      </td>
      <td class="leads__company">${lead.company ? esc(lead.company) : '<span class="dash">—</span>'}</td>
      <td class="leads__contact">
        <a href="mailto:${esc(lead.email)}">${esc(lead.email)}</a>
        ${lead.phone ? `<a href="tel:${esc(lead.phone.replace(/\s+/g, ''))}">${esc(lead.phone)}</a>` : ''}
      </td>
      <td class="leads__where">${location ? esc(location) : '<span class="dash">—</span>'}</td>
      <td class="leads__interest"><span class="tag">${esc(lead.product_name)}</span></td>
      <td class="leads__tools">
        <button class="rowbtn" type="button" data-action="delete" aria-label="Delete inquiry from ${esc(lead.name)}">${icon('close')}</button>
      </td>
    </tr>`
}

// ---- Boot ------------------------------------------------------------------

if (token) {
  api('/leads')
    .then(async (res) => {
      if (!res.ok) throw new Error()
      rows = await res.json()
      renderDashboard()
    })
    .catch(() => {
      if (token) renderLogin('Could not reach the kiosk server.')
    })
} else {
  renderLogin()
}

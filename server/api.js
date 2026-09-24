import { timingSafeEqual } from 'node:crypto'
import express from 'express'
import { ADMIN_PASSWORD, DEFAULT_QR_URL } from './config.js'
import { leads, settings } from './db.js'

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const QR_URL_KEY = 'qr_url'
/** Longer than this and the QR gets too dense to scan from a kiosk screen. */
const QR_URL_MAX = 1024
/** More products than this in one inquiry is not a visitor, it's a bug. */
const MAX_INTERESTS = 40
const CSV_COLUMNS = ['id', 'created_at', 'name', 'designation', 'company', 'email', 'phone', 'city', 'state', 'interests']

/** Coerce an incoming value to a trimmed, bounded string. */
function str(value, max = 160) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

/**
 * The products a submission is about, as `[{ id, name }]` without
 * duplicates. Empty means a general inquiry. Older kiosk builds (and leads
 * they queued while offline) send a single `product` / `product_name`.
 */
function parseInterests(body) {
  if (Array.isArray(body.interests)) {
    const seen = new Set()
    const list = []
    for (const item of body.interests.slice(0, MAX_INTERESTS)) {
      const id = str(item?.id, 64)
      const name = str(item?.name, 120)
      if (!id || !name || seen.has(id)) continue
      seen.add(id)
      list.push({ id, name })
    }
    return list
  }
  const id = str(body.product, 64)
  return id && id !== 'general' ? [{ id, name: str(body.product_name, 120) || id }] : []
}

/** Validate a submission from the kiosk. Returns `{ lead }` or `{ error }`. */
function parseLead(body) {
  if (!body || typeof body !== 'object') return { error: 'Invalid request body.' }
  const lead = {
    client_id: str(body.client_id, 64) || null,
    interests: parseInterests(body),
    name: str(body.name, 120),
    designation: str(body.designation, 120),
    company: str(body.company, 160),
    email: str(body.email, 200).toLowerCase(),
    phone: str(body.phone, 40),
    city: str(body.city, 120),
    state: str(body.state, 120),
  }
  if (!lead.name) return { error: 'Please enter your name.' }
  if (!EMAIL_RE.test(lead.email)) return { error: 'Please enter a valid email.' }
  return { lead }
}

/** Kiosk settings with defaults applied — the shape both GET and PUT return. */
function currentSettings() {
  return {
    qr_url: settings.get(QR_URL_KEY) || DEFAULT_QR_URL,
    default_qr_url: DEFAULT_QR_URL,
  }
}

/**
 * Validate the QR link from the admin. Returns `{ url }` with the trimmed
 * link, `{ url: null }` when the admin cleared it (restore the default), or
 * `{ error }`.
 */
function parseQrUrl(value) {
  if (value == null) return { url: null }
  if (typeof value !== 'string') return { error: 'Invalid link.' }
  const url = value.trim()
  if (!url) return { url: null }
  if (url.length > QR_URL_MAX) return { error: 'That link is too long to fit in a QR code.' }
  try {
    const { protocol } = new URL(url)
    if (protocol !== 'http:' && protocol !== 'https:') throw new Error()
  } catch {
    return { error: 'Enter a full link starting with http:// or https://.' }
  }
  return { url }
}

/** Bearer-token check against ADMIN_PASSWORD, constant-time. */
function requireAdmin(req, res, next) {
  const given = Buffer.from((req.get('authorization') || '').replace(/^Bearer\s+/i, ''))
  const expected = Buffer.from(ADMIN_PASSWORD)
  if (given.length === expected.length && timingSafeEqual(given, expected)) return next()
  res.status(401).json({ error: 'Unauthorized' })
}

function csvCell(value) {
  const s = value == null ? '' : String(value)
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/** One CSV row; the interests column lists product names, `;`-separated. */
function csvRow(lead) {
  const values = { ...lead, interests: lead.interests.length ? lead.interests.map((p) => p.name).join('; ') : 'General' }
  return CSV_COLUMNS.map((c) => csvCell(values[c])).join(',')
}

/**
 * The JSON API. Exported as a factory so the same app can be mounted under
 * `/api` by the Vite dev server (see vite.config.js) and by server/index.js
 * in production.
 */
export function createApi() {
  const api = express()
  api.disable('x-powered-by')
  api.use(express.json({ limit: '16kb' }))

  // Kiosk → new lead.
  api.post('/leads', (req, res) => {
    const { lead, error } = parseLead(req.body)
    if (error) return res.status(400).json({ error })
    const result = leads.create(lead)
    res.status(result.created ? 201 : 200).json(result.lead)
  })

  // Admin → everything, newest first.
  api.get('/leads', requireAdmin, (req, res) => {
    res.json(leads.all())
  })

  // Admin → spreadsheet export. BOM so Excel reads UTF-8 correctly.
  api.get('/leads.csv', requireAdmin, (req, res) => {
    const rows = leads.all().map(csvRow)
    const csv = '\uFEFF' + [CSV_COLUMNS.join(','), ...rows].join('\r\n') + '\r\n'
    res
      .type('text/csv; charset=utf-8')
      .set('Content-Disposition', `attachment; filename="safesurge-leads-${new Date().toISOString().slice(0, 10)}.csv"`)
      .send(csv)
  })

  api.delete('/leads/:id', requireAdmin, (req, res) => {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || !leads.remove(id)) return res.status(404).json({ error: 'Lead not found.' })
    res.status(204).end()
  })

  // Kiosk → the link its product QR codes should carry. Public: the kiosk
  // polls this so an admin change shows up without a reload.
  api.get('/settings', (req, res) => {
    res.set('Cache-Control', 'no-store').json(currentSettings())
  })

  // Admin → change the QR link. An empty `qr_url` restores the default.
  api.put('/settings', requireAdmin, (req, res) => {
    if (!req.body || typeof req.body !== 'object' || !('qr_url' in req.body)) {
      return res.status(400).json({ error: 'Nothing to update.' })
    }
    const { url, error } = parseQrUrl(req.body.qr_url)
    if (error) return res.status(400).json({ error })
    if (url) settings.set(QR_URL_KEY, url)
    else settings.remove(QR_URL_KEY)
    res.json(currentSettings())
  })

  api.use((req, res) => res.status(404).json({ error: 'Not found' }))

  // eslint-disable-next-line no-unused-vars
  api.use((err, req, res, next) => {
    const status = err.status || err.statusCode || 500
    if (status >= 500) console.error('[api]', err)
    res.status(status).json({ error: status >= 500 ? 'Server error' : err.message })
  })

  return api
}

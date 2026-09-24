import { timingSafeEqual } from 'node:crypto'
import express from 'express'
import { ADMIN_PASSWORD } from './config.js'
import { leads } from './db.js'

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const CSV_COLUMNS = [
  'id',
  'created_at',
  'name',
  'designation',
  'company',
  'email',
  'phone',
  'city',
  'state',
  'product',
  'product_name',
]

/** Coerce an incoming value to a trimmed, bounded string. */
function str(value, max = 160) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

/** Validate a submission from the kiosk. Returns `{ lead }` or `{ error }`. */
function parseLead(body) {
  if (!body || typeof body !== 'object') return { error: 'Invalid request body.' }
  const lead = {
    client_id: str(body.client_id, 64) || null,
    product: str(body.product, 64) || 'general',
    product_name: str(body.product_name, 120) || 'General',
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
    const rows = leads.all().map((l) => CSV_COLUMNS.map((c) => csvCell(l[c])).join(','))
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

  api.use((req, res) => res.status(404).json({ error: 'Not found' }))

  // eslint-disable-next-line no-unused-vars
  api.use((err, req, res, next) => {
    const status = err.status || err.statusCode || 500
    if (status >= 500) console.error('[api]', err)
    res.status(status).json({ error: status >= 500 ? 'Server error' : err.message })
  })

  return api
}

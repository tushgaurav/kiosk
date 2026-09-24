import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { DB_PATH } from './config.js'

mkdirSync(dirname(DB_PATH), { recursive: true })

const db = new DatabaseSync(DB_PATH)

db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS leads (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id    TEXT UNIQUE,
    created_at   TEXT NOT NULL,
    product      TEXT NOT NULL,
    product_name TEXT NOT NULL,
    name         TEXT NOT NULL,
    designation  TEXT NOT NULL DEFAULT '',
    company      TEXT NOT NULL DEFAULT '',
    email        TEXT NOT NULL,
    phone        TEXT NOT NULL DEFAULT '',
    city         TEXT NOT NULL DEFAULT '',
    state        TEXT NOT NULL DEFAULT ''
  );

  CREATE INDEX IF NOT EXISTS leads_created_at ON leads (created_at DESC);

  CREATE TABLE IF NOT EXISTS settings (
    key        TEXT PRIMARY KEY,
    value      TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`)

// One inquiry can cover several products. `interests` holds them as a JSON
// array of { id, name }; `product` / `product_name` keep the first one so
// older rows and tools keep working. Added after the first release, hence
// the guarded ALTER.
const columns = db.prepare(`PRAGMA table_info(leads)`).all().map((c) => c.name)
if (!columns.includes('interests')) db.exec(`ALTER TABLE leads ADD COLUMN interests TEXT`)

const insertStmt = db.prepare(`
  INSERT OR IGNORE INTO leads
    (client_id, created_at, product, product_name, interests, name, designation, company, email, phone, city, state)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)
const byIdStmt = db.prepare(`SELECT * FROM leads WHERE id = ?`)
const byClientIdStmt = db.prepare(`SELECT * FROM leads WHERE client_id = ?`)
const listStmt = db.prepare(`SELECT * FROM leads ORDER BY created_at DESC, id DESC`)
const deleteStmt = db.prepare(`DELETE FROM leads WHERE id = ?`)

/** A row as the API returns it: `interests` parsed, derived for old rows. */
function hydrate(row) {
  if (!row) return row
  let interests = null
  try {
    interests = row.interests ? JSON.parse(row.interests) : null
  } catch {
    interests = null
  }
  if (!Array.isArray(interests)) {
    interests = row.product && row.product !== 'general' ? [{ id: row.product, name: row.product_name }] : []
  }
  return { ...row, interests }
}

export const leads = {
  /**
   * Insert a lead. `client_id` makes this idempotent: the kiosk retries
   * submissions that failed mid-flight, and a retry must not duplicate.
   * Returns `{ lead, created }`.
   */
  create(lead) {
    const [first] = lead.interests
    const info = insertStmt.run(
      lead.client_id || null,
      new Date().toISOString(),
      first?.id ?? 'general',
      first?.name ?? 'General',
      JSON.stringify(lead.interests),
      lead.name,
      lead.designation,
      lead.company,
      lead.email,
      lead.phone,
      lead.city,
      lead.state,
    )
    if (info.changes > 0) return { lead: hydrate(byIdStmt.get(info.lastInsertRowid)), created: true }
    return { lead: hydrate(byClientIdStmt.get(lead.client_id)), created: false }
  },

  all() {
    return listStmt.all().map(hydrate)
  },

  remove(id) {
    return deleteStmt.run(id).changes > 0
  },
}

const getSettingStmt = db.prepare(`SELECT value FROM settings WHERE key = ?`)
const setSettingStmt = db.prepare(`
  INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
  ON CONFLICT (key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
`)
const deleteSettingStmt = db.prepare(`DELETE FROM settings WHERE key = ?`)

/**
 * Key/value overrides the admin sets at runtime. Only overrides are stored;
 * callers apply their own default when `get` returns null.
 */
export const settings = {
  get(key) {
    return getSettingStmt.get(key)?.value ?? null
  },

  set(key, value) {
    setSettingStmt.run(key, value, new Date().toISOString())
  },

  remove(key) {
    deleteSettingStmt.run(key)
  },
}

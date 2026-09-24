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
`)

const insertStmt = db.prepare(`
  INSERT OR IGNORE INTO leads
    (client_id, created_at, product, product_name, name, designation, company, email, phone, city, state)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)
const byIdStmt = db.prepare(`SELECT * FROM leads WHERE id = ?`)
const byClientIdStmt = db.prepare(`SELECT * FROM leads WHERE client_id = ?`)
const listStmt = db.prepare(`SELECT * FROM leads ORDER BY created_at DESC, id DESC`)
const deleteStmt = db.prepare(`DELETE FROM leads WHERE id = ?`)

export const leads = {
  /**
   * Insert a lead. `client_id` makes this idempotent: the kiosk retries
   * submissions that failed mid-flight, and a retry must not duplicate.
   * Returns `{ lead, created }`.
   */
  create(lead) {
    const info = insertStmt.run(
      lead.client_id || null,
      new Date().toISOString(),
      lead.product,
      lead.product_name,
      lead.name,
      lead.designation,
      lead.company,
      lead.email,
      lead.phone,
      lead.city,
      lead.state,
    )
    if (info.changes > 0) return { lead: byIdStmt.get(info.lastInsertRowid), created: true }
    return { lead: byClientIdStmt.get(lead.client_id), created: false }
  },

  all() {
    return listStmt.all()
  },

  remove(id) {
    return deleteStmt.run(id).changes > 0
  },
}

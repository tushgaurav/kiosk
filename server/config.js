import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { brand } from '../src/data/products.js'

/** Project root (the folder holding package.json). */
export const ROOT = fileURLToPath(new URL('..', import.meta.url))

// Optional `.env` in the project root. Real environment variables win.
try {
  process.loadEnvFile(resolve(ROOT, '.env'))
} catch {
  // No .env file — that's fine, defaults below apply.
}

export const PORT = Number(process.env.PORT) || 3000
export const DB_PATH = process.env.DB_PATH || resolve(ROOT, 'data', 'leads.db')
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'safesurge'

/**
 * What product QR codes open until the admin sets another link at /admin.
 * Shared with the kiosk bundle so both sides agree before the first fetch.
 */
export const DEFAULT_QR_URL = brand.catalog

if (!process.env.ADMIN_PASSWORD) {
  console.warn(
    '[kiosk] ADMIN_PASSWORD is not set — the admin page accepts the default password "safesurge".\n' +
      '        Copy .env.example to .env and choose your own before the show.',
  )
}

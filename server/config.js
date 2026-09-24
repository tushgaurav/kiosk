import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

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

if (!process.env.ADMIN_PASSWORD) {
  console.warn(
    '[kiosk] ADMIN_PASSWORD is not set — the admin page accepts the default password "safesurge".\n' +
      '        Copy .env.example to .env and choose your own before the show.',
  )
}

/**
 * Production server: serves the built kiosk (dist/) and the leads API from a
 * single process, so the kiosk machine only needs `npm run build && npm start`.
 */
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import express from 'express'
import { createApi } from './api.js'
import { PORT, ROOT } from './config.js'

const dist = resolve(ROOT, 'dist')
const shell = resolve(dist, 'index.html')

if (!existsSync(shell)) {
  console.warn('[kiosk] dist/ is missing — run `npm run build` first. Serving the API only.')
}

const app = express()
app.disable('x-powered-by')

app.use('/api', createApi())

// `extensions: ['html']` lets /admin resolve to dist/admin.html.
app.use(express.static(dist, { extensions: ['html'] }))

// The kiosk uses hash routing, so any other path is the app shell.
app.use((req, res) => {
  if (!existsSync(shell)) return res.status(404).type('text').send('Build not found. Run `npm run build`.')
  res.sendFile(shell)
})

app.listen(PORT, () => {
  console.log(`SafeSurge kiosk  →  http://localhost:${PORT}`)
  console.log(`Leads admin      →  http://localhost:${PORT}/admin`)
})

import { cpSync, createReadStream, existsSync } from 'node:fs'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

/**
 * Serve the leads API from inside Vite's dev/preview server, so `npm run dev`
 * is the only process you need while working on the kiosk. In production
 * server/index.js mounts the very same app under /api.
 *
 * Imported lazily so `vite build` never touches the database.
 */
function kioskApi() {
  const mount = async (server) => {
    const { createApi } = await import('./server/api.js')
    server.middlewares.use('/api', createApi())
  }
  return { name: 'kiosk-api', configureServer: mount, configurePreviewServer: mount }
}

/**
 * The document reader needs pdf.js's support files by URL, under their
 * original names: CMaps for CJK fonts (the A&D brochures are Japanese in
 * origin), the 14 standard fonts, and the WASM decoders for JPEG 2000 /
 * JBIG2 images. Serve them from /pdfjs/ straight out of node_modules in
 * dev, and copy them into dist/pdfjs/ on build. They are fetched lazily by
 * pdf.js, only when a document actually needs them.
 */
function pdfjsAssets() {
  const dirs = ['cmaps', 'standard_fonts', 'wasm', 'iccs']
  const root = fileURLToPath(new URL('node_modules/pdfjs-dist', import.meta.url))
  const types = {
    '.bcmap': 'application/octet-stream',
    '.pfb': 'application/octet-stream',
    '.ttf': 'font/ttf',
    '.wasm': 'application/wasm',
    '.js': 'text/javascript',
    '.icc': 'application/vnd.iccprofile',
  }
  return {
    name: 'kiosk-pdfjs-assets',
    configureServer(server) {
      server.middlewares.use('/pdfjs', (req, res, next) => {
        const rel = normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^[\\/]+/, '')
        const [dir] = rel.split(/[\\/]/)
        const file = resolve(root, rel)
        if (!dirs.includes(dir) || !file.startsWith(root) || !existsSync(file)) return next()
        res.setHeader('Content-Type', types[extname(file)] ?? 'application/octet-stream')
        createReadStream(file).pipe(res)
      })
    },
    closeBundle() {
      const out = fileURLToPath(new URL('dist/pdfjs', import.meta.url))
      for (const dir of dirs) cpSync(join(root, dir), join(out, dir), { recursive: true })
    },
  }
}

export default defineConfig({
  plugins: [kioskApi(), pdfjsAssets()],
  build: {
    rolldownOptions: {
      input: {
        kiosk: fileURLToPath(new URL('index.html', import.meta.url)),
        admin: fileURLToPath(new URL('admin.html', import.meta.url)),
      },
    },
  },
})

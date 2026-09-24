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

export default defineConfig({
  plugins: [kioskApi()],
  build: {
    rolldownOptions: {
      input: {
        kiosk: fileURLToPath(new URL('index.html', import.meta.url)),
        admin: fileURLToPath(new URL('admin.html', import.meta.url)),
      },
    },
  },
})

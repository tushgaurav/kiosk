import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { el, icon } from './ui.js'

const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

/**
 * Interactive map for the Visit-us page. Pan and pinch like any map, plus
 * big touch buttons for zoom and "back to us". No links anywhere (this is a
 * kiosk), and a designed fallback when there is no connection for tiles.
 *
 * Returns a `destroy()` to call when the screen goes away.
 */
export function mountMap(host, { lat, lng, zoom = 15, label, sub }) {
  host.classList.add('map')
  host.append(
    el(`<div class="map__canvas"></div>`),
    el(
      `<div class="map__controls">
         <button class="map__btn" type="button" data-act="in" aria-label="Zoom in">${icon('plus')}</button>
         <button class="map__btn" type="button" data-act="out" aria-label="Zoom out">${icon('minus')}</button>
         <button class="map__btn map__btn--home" type="button" data-act="home" aria-label="Back to SafeSurge">${icon('target')}</button>
       </div>`,
    ),
    el(`<p class="map__credit">Map data \u00a9 OpenStreetMap contributors</p>`),
    el(
      `<div class="map__offline" role="status">
         <span class="map__offline-pin">${icon('pin')}</span>
         <strong>Map needs a connection</strong>
         <span>Scan the code below for directions on your phone.</span>
       </div>`,
    ),
  )

  const canvas = host.querySelector('.map__canvas')
  const centre = [lat, lng]
  let map = null
  let tileErrors = 0
  let tilesLoaded = 0

  const setOffline = (off) => host.classList.toggle('is-offline', off)

  function init() {
    map = L.map(canvas, {
      center: centre,
      zoom,
      minZoom: 9,
      maxZoom: 18,
      zoomSnap: 0.5,
      zoomControl: false,
      attributionControl: false,
      keyboard: false,
      // Keep the map about where we are: roughly the National Capital Region.
      maxBounds: [
        [27.6, 76.2],
        [29.1, 77.9],
      ],
      maxBoundsViscosity: 1,
    })

    const tiles = L.tileLayer(TILES, { maxZoom: 19, updateWhenIdle: true })
    tiles.on('tileload', () => {
      tilesLoaded++
      setOffline(false)
    })
    tiles.on('tileerror', () => {
      tileErrors++
      if (tilesLoaded === 0 && tileErrors >= 3) setOffline(true)
    })
    tiles.addTo(map)

    const pin = L.divIcon({
      className: 'pin',
      iconSize: [0, 0],
      iconAnchor: [0, 0],
      html: `<span class="pin__ring"></span><span class="pin__dot"></span>
             <span class="pin__label"><b>${label}</b>${sub ? `<small>${sub}</small>` : ''}</span>`,
    })
    L.marker(centre, { icon: pin, interactive: false, keyboard: false }).addTo(map)

    if (navigator.onLine === false) setOffline(true)
  }

  // Leaflet needs a laid-out box. The screen is built before it is attached,
  // so wait for the first real size, then keep the map in step with resizes.
  const ro = new ResizeObserver(() => {
    if (canvas.clientWidth === 0 || canvas.clientHeight === 0) return
    if (!map) init()
    else map.invalidateSize({ animate: false })
  })
  ro.observe(canvas)

  host.querySelector('.map__controls').addEventListener('click', (e) => {
    const act = e.target.closest('[data-act]')?.dataset.act
    if (!map || !act) return
    if (act === 'in') map.zoomIn()
    else if (act === 'out') map.zoomOut()
    else map.flyTo(centre, zoom, { duration: 0.6 })
  })

  const onOnline = () => setOffline(false)
  window.addEventListener('online', onOnline)

  return {
    destroy() {
      ro.disconnect()
      window.removeEventListener('online', onOnline)
      map?.remove()
      map = null
    },
  }
}

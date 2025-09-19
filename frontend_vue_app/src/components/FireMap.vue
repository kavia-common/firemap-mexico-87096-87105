<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

/**
 * NASA FIRMS Source:
 * For hackathon-level MVP, we can use the last-24h CSV feed for Mexico via VIIRS or MODIS,
 * restricted geographically on the client side. If a regional feed is not directly exposed,
 * we fetch global last-24h and filter by Mexico bounding box.
 *
 * CSV format reference (typical headers):
 * latitude,longitude,brightness,scan,track,acq_date,acq_time,satellite,confidence,version,bright_t31,frp,daynight
 */

// Mexico approximate bounding box
const MEXICO_BBOX = {
  minLat: 14.0,
  maxLat: 33.0,
  minLng: -118.0,
  maxLng: -86.0
}

// PUBLIC_INTERFACE
function isInMexico(lat: number, lng: number): boolean {
  /** Check if a coordinate lies within the rough Mexico bounding box. */
  return lat >= MEXICO_BBOX.minLat && lat <= MEXICO_BBOX.maxLat && lng >= MEXICO_BBOX.minLng && lng <= MEXICO_BBOX.maxLng
}

type FireRecord = {
  latitude: number
  longitude: number
  acq_date?: string
  acq_time?: string
  confidence?: string
  daynight?: string
  bright_t31?: string
  brightness?: string
  frp?: string
  satellite?: string
  version?: string
}

const mapDiv = ref<HTMLDivElement | null>(null)
const mapObj = ref<google.maps.Map | null>(null)
const markers = ref<google.maps.marker.AdvancedMarkerElement[]>([])
const infoWindow = ref<google.maps.InfoWindow | null>(null)
const loading = ref(false)
const lastUpdated = ref<string>('')

// NASA FIRMS CSV - global last 24 hours (VIIRS NOAA-20/MODIS can be swapped)
// Using a permissive endpoint variant. In production, register and use API key if required.
const FIRMS_CSV_URL = 'https://firms.modaps.eosdis.nasa.gov/data/active_fire/viirs/csv/VNP14IMGTDL_NRT_Global_24h.csv'

// Load Google Maps JS API dynamically using API key provided via environment var VITE_GOOGLE_MAPS_API_KEY
async function loadGoogleMaps(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Avoid "any" by checking type guards
    const hasGoogle =
      typeof window !== 'undefined' &&
      typeof (window as unknown as { google?: unknown }).google !== 'undefined' &&
      typeof (window as unknown as { google: { maps?: unknown } }).google.maps !== 'undefined'

    if (hasGoogle) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=marker`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Maps'))
    document.head.appendChild(script)
  })
}

function clearMarkers() {
  // Properly clear markers without using any
  markers.value.forEach((m) => {
    // set map to null to remove from map
    ;(m as google.maps.marker.AdvancedMarkerElement).map = undefined as unknown as google.maps.Map
  })
  markers.value = []
}

function buildInfoContent(f: FireRecord): string {
  const timeText = f.acq_date && f.acq_time ? `${f.acq_date} ${formatAcqTime(f.acq_time)}` : 'N/A'
  return `
    <div style="min-width:240px;max-width:320px;font-family:Inter,system-ui,Arial;">
      <div style="font-weight:600;margin-bottom:6px;color:#111827">Fire detection</div>
      <div style="font-size:13px;color:#374151;display:grid;gap:4px;">
        <div><b>When:</b> ${timeText}</div>
        <div><b>Coords:</b> ${f.latitude?.toFixed(4)}, ${f.longitude?.toFixed(4)}</div>
        <div><b>Type:</b> ${f.daynight ?? 'N/A'}</div>
        <div><b>Confidence:</b> ${f.confidence ?? 'N/A'}</div>
        <div><b>Brightness:</b> ${f.brightness ?? f.bright_t31 ?? 'N/A'}</div>
        <div><b>FRP:</b> ${f.frp ?? 'N/A'}</div>
        <div><b>Satellite:</b> ${f.satellite ?? 'N/A'} v${f.version ?? ''}</div>
      </div>
    </div>
  `
}

function formatAcqTime(t?: string): string {
  if (!t) return ''
  // t can be like "1830" for 18:30 UTC
  const s = t.toString().padStart(4, '0')
  return `${s.slice(0, 2)}:${s.slice(2)} UTC`
}

function markerHTML(isNight: boolean): string {
  const color = isNight ? '#2563EB' : '#F59E0B'
  const glow = isNight ? 'rgba(37,99,235,0.35)' : 'rgba(245,158,11,0.35)'
  return `
    <div style="
      width:16px;height:16px;border-radius:999px;
      background:${color};
      box-shadow: 0 0 0 6px ${glow};
      border: 2px solid #fff;
    "></div>`
}

/** Fetch and render fires */
async function refreshFires() {
  if (!mapObj.value) return
  loading.value = true
  try {
    const resp = await fetch(FIRMS_CSV_URL, { mode: 'cors' })
    const text = await resp.text()
    const fires = parseFirmsCSV(text)
      .filter((f) => Number.isFinite(f.latitude) && Number.isFinite(f.longitude) && isInMexico(f.latitude, f.longitude))

    clearMarkers()

    fires.forEach((f) => {
      const isNight = (f.daynight ?? '').toLowerCase() === 'n'
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapObj.value as google.maps.Map,
        position: { lat: f.latitude, lng: f.longitude },
        content: stringToElement(markerHTML(isNight)),
        title: 'Fire detection'
      })
      marker.addListener('gmp-click', () => {
        if (!infoWindow.value) infoWindow.value = new google.maps.InfoWindow()
        infoWindow.value.setContent(buildInfoContent(f))
        infoWindow.value.open({ anchor: marker, map: mapObj.value as google.maps.Map })
      })
      markers.value.push(marker)
    })
    lastUpdated.value = new Date().toLocaleString()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to load FIRMS CSV', e)
    alert('Failed to load NASA FIRMS data. Please try again later.')
  } finally {
    loading.value = false
  }
}

function parseFirmsCSV(csv: string): FireRecord[] {
  const lines = csv.trim().split(/\r?\n/)
  if (lines.length < 2) return []
  const header = lines[0].split(',').map((h) => h.trim())
  const idx = (name: string) => header.findIndex((h) => h.toLowerCase() === name)
  const latI = idx('latitude')
  const lngI = idx('longitude')
  const acqD = idx('acq_date')
  const acqT = idx('acq_time')
  const conf = idx('confidence')
  const dayn = idx('daynight')
  const b31 = idx('bright_t31')
  const bri = idx('brightness')
  const frp = idx('frp')
  const sat = idx('satellite')
  const ver = idx('version')

  const out: FireRecord[] = []
  for (let i = 1; i < lines.length; i++) {
    const row = safeSplitCSV(lines[i])
    if (!row.length) continue
    const lat = parseFloat(row[latI])
    const lng = parseFloat(row[lngI])
    out.push({
      latitude: lat,
      longitude: lng,
      acq_date: row[acqD],
      acq_time: row[acqT],
      confidence: row[conf],
      daynight: row[dayn],
      bright_t31: b31 >= 0 ? row[b31] : undefined,
      brightness: bri >= 0 ? row[bri] : undefined,
      frp: frp >= 0 ? row[frp] : undefined,
      satellite: sat >= 0 ? row[sat] : undefined,
      version: ver >= 0 ? row[ver] : undefined
    })
  }
  return out
}

function safeSplitCSV(line: string): string[] {
  // Simple CSV splitter for this dataset (no embedded commas in quoted fields expected)
  // If quotes exist, we handle basic cases.
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      inQuotes = !inQuotes
      continue
    }
    if (ch === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  result.push(current)
  return result.map((s) => s.trim())
}

function stringToElement(html: string): HTMLElement {
  const div = document.createElement('div')
  div.innerHTML = html.trim()
  return div.firstElementChild as HTMLElement
}

onMounted(async () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined
  if (!apiKey) {
    // eslint-disable-next-line no-console
    console.error('Missing VITE_GOOGLE_MAPS_API_KEY environment variable.')
  }
  await loadGoogleMaps(apiKey ?? '')
  mapObj.value = new google.maps.Map(mapDiv.value as HTMLDivElement, {
    // Mexico center near Mexico City
    center: { lat: 23.6345, lng: -102.5528 },
    zoom: 5,
    mapId: 'DEMO_MAP_ID',
    streetViewControl: false,
    mapTypeControl: true,
    fullscreenControl: true,
  })
  await refreshFires()
})

onUnmounted(() => {
  clearMarkers()
})
</script>

<template>
  <div class="card">
    <div class="toolbar">
      <div class="left">
        <button class="btn" :disabled="loading" @click="refreshFires">
          <span class="icon" :class="{ spin: loading }">⟲</span>
          <span>{{ loading ? 'Refreshing…' : 'Refresh data' }}</span>
        </button>
        <div v-if="lastUpdated" class="meta">Last updated: {{ lastUpdated }}</div>
      </div>
      <div class="legend">
        <span class="legend-item"><span class="dot day"></span>Day</span>
        <span class="legend-item"><span class="dot night"></span>Night</span>
      </div>
    </div>
    <div ref="mapDiv" class="map"></div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
}

.toolbar {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px;
  background: linear-gradient(180deg, rgba(37,99,235,0.05), rgba(255,255,255,0.95));
  border-bottom: 1px solid rgba(17,24,39,0.06);
}
.left { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  background: linear-gradient(135deg, #2563EB, #60A5FA);
  color: #fff;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(37,99,235,0.25), 0 2px 6px rgba(37,99,235,0.18);
  transition: transform 0.12s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  font-weight: 600;
}
.btn:hover { transform: translateY(-1px); }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }

.icon { display: inline-block; }
.spin { animation: spin 0.9s linear infinite; }
@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }

.meta {
  font-size: 12px;
  color: rgba(17,24,39,0.7);
}

.legend {
  display: flex;
  gap: 10px;
  align-items: center;
}
.legend-item {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px; color: #111827;
  background: #fff;
  border: 1px solid rgba(17,24,39,0.06);
  padding: 6px 10px; border-radius: 999px;
  box-shadow: 0 4px 10px rgba(17,24,39,0.06);
}

.dot { width: 10px; height: 10px; border-radius: 999px; display: inline-block; }
.dot.day { background: #F59E0B; box-shadow: 0 0 0 4px rgba(245,158,11,0.25); }
.dot.night { background: #2563EB; box-shadow: 0 0 0 4px rgba(37,99,235,0.25); }

.map {
  height: min(70vh, 760px);
  width: 100%;
}
@media (min-width: 960px) {
  .map { height: min(78vh, 820px); }
}
</style>

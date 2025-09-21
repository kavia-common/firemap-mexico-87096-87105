<script setup lang="ts">
import { onMounted, ref } from "vue"
import L, { Map as LeafletMap, Marker, CircleMarker } from "leaflet"
import "leaflet/dist/leaflet.css"

// Mexico bounding box
const MEXICO_BBOX = { minLat: 14.0, maxLat: 33.0, minLng: -118.0, maxLng: -86.0 }
function isInMexico(lat: number, lng: number): boolean {
  return (
    lat >= MEXICO_BBOX.minLat &&
    lat <= MEXICO_BBOX.maxLat &&
    lng >= MEXICO_BBOX.minLng &&
    lng <= MEXICO_BBOX.maxLng
  )
}

// CSV record type
type FireRecord = {
  latitude: number
  longitude: number
  acq_date?: string
  acq_time?: string
  confidence?: string
  daynight?: string
  brightness?: string
}

// Leaflet map & state
const mapDiv = ref<HTMLDivElement | null>(null)
let mapObj: LeafletMap | null = null
let markers: Array<Marker | CircleMarker> = []
const lastUpdated = ref<string>("")
const loading = ref(false)
const days = ref(1) // default: last 1 day

// Store your FIRMS MAP_KEY in .env.local
const MAP_KEY = import.meta.env.VITE_NASA_FIRMS_API_KEY

function buildFirmsUrl(days: number): string {
  // VIIRS SNPP NRT + bounding box for Mexico
  return `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${MAP_KEY}/VIIRS_SNPP_NRT/-118,14,-86,33/${days}`
}

function formatAcqTime(t?: string): string {
  if (!t) return ""
  const s = t.toString().padStart(4, "0")
  return `${s.slice(0, 2)}:${s.slice(2)} UTC`
}

function buildPopup(f: FireRecord): string {
  const timeText =
    f.acq_date && f.acq_time ? `${f.acq_date} ${formatAcqTime(f.acq_time)}` : "N/A"
  return `
    <b>🔥 Fire detection</b><br>
    <b>When:</b> ${timeText}<br>
    <b>Coords:</b> ${f.latitude.toFixed(4)}, ${f.longitude.toFixed(4)}<br>
    <b>Type:</b> ${f.daynight ?? "N/A"}<br>
    <b>Confidence:</b> ${f.confidence ?? "N/A"}<br>
    <b>Brightness:</b> ${f.brightness ?? "N/A"}<br>
  `
}

function clearMarkers() {
  markers.forEach((m) => m.remove())
  markers = []
}

async function refreshFires() {
  if (!mapObj) return
  loading.value = true
  try {
    const resp = await fetch(buildFirmsUrl(days.value))
    const text = await resp.text()
    const fires = parseFirmsCSV(text).filter((f) =>
      isInMexico(f.latitude, f.longitude)
    )

    clearMarkers()

    fires.forEach((f) => {
      const isNight = (f.daynight ?? "").toLowerCase() === "n"
      const color = isNight ? "red" : "yellow"

      const marker = L.circleMarker([f.latitude, f.longitude], {
        radius: 6,
        color: "#000",
        fillColor: color,
        fillOpacity: 0.8
      }).addTo(mapObj!)

      marker.bindPopup(buildPopup(f))
      markers.push(marker)
    })

    lastUpdated.value = new Date().toLocaleString()
    console.log(`✅ Loaded ${fires.length} fires`)
  } catch (err) {
    console.error("Failed to load FIRMS CSV", err)
    alert("Failed to load NASA FIRMS data. Please try again later.")
  } finally {
    loading.value = false
  }
}

function parseFirmsCSV(csv: string): FireRecord[] {
  const lines = csv.trim().split(/\r?\n/)
  if (lines.length < 2) return []
  const header = lines[0].split(",").map((h) => h.trim().toLowerCase())
  const latI = header.indexOf("latitude")
  const lngI = header.indexOf("longitude")
  const acqD = header.indexOf("acq_date")
  const acqT = header.indexOf("acq_time")
  const conf = header.indexOf("confidence")
  const dayn = header.indexOf("daynight")
  const bri = header.indexOf("bright_ti4")

  return lines.slice(1).map((line) => {
    const row = line.split(",")
    return {
      latitude: parseFloat(row[latI]),
      longitude: parseFloat(row[lngI]),
      acq_date: row[acqD],
      acq_time: row[acqT],
      confidence: row[conf],
      daynight: row[dayn],
      brightness: row[bri]
    }
  })
}

onMounted(() => {
  mapObj = L.map(mapDiv.value as HTMLDivElement).setView([23.6345, -102.5528], 5)

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(mapObj)

  refreshFires()
})
</script>

<template>
  <div class="card">
    <div class="toolbar">
      <button class="btn" :disabled="loading" @click="refreshFires">
        🔄 {{ loading ? "Refreshing…" : "Refresh data" }}
      </button>

      <label>
        Last {{ days }} day(s)
        <select v-model="days" @change="refreshFires">
          <option value="1">1</option>
          <option value="3">3</option>
          <option value="7">7</option>
        </select>
      </label>

      <div v-if="lastUpdated" class="meta">Last updated: {{ lastUpdated }}</div>
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
  border: 1px solid rgba(17, 24, 39, 0.06);
  box-shadow: 0 4px 10px rgba(17, 24, 39, 0.08);
}

.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background: #f3f4f6;
  color: #000; /* ensure toolbar text is black */
}

.btn {
  padding: 6px 12px;
  border-radius: 8px;
  background: #e5efff; /* lightened primary background to maintain contrast with black text */
  color: #000; /* enforce black text */
  font-weight: 600;
  border: 1px solid rgba(0,0,0,0.12);
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
}
.btn:hover:not(:disabled) {
  background: #f2f6ff;
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(0,0,0,0.12);
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

label, select {
  color: #000; /* enforce black text on form controls */
}
.meta {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.7); /* keep readable but in black spectrum */
}

.map {
  height: min(70vh, 700px);
  width: 100%;
}
</style>

export type FirmsRecord = {
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

// PUBLIC_INTERFACE
export function parseFirmsCSV(csv: string): FirmsRecord[] {
  /** Parse NASA FIRMS CSV into typed records. */
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

  const out: FirmsRecord[] = []
  for (let i = 1; i < lines.length; i++) {
    const row = safeSplitCSV(lines[i])
    if (!row.length) continue
    const lat = parseFloat(row[latI])
    const lng = parseFloat(row[lngI])
    if (!isFinite(lat) || !isFinite(lng)) continue
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
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') { inQuotes = !inQuotes; continue }
    if (ch === ',' && !inQuotes) { result.push(current); current = '' }
    else { current += ch }
  }
  result.push(current)
  return result.map((s) => s.trim())
}

<script setup lang="ts">
import FireMap from '@/components/FireMap.vue'
</script>

<template>
  <section class="layout">
    <div class="info-card">
      <h2>Active Fires in Mexico</h2>
      <p>
        This interactive map visualizes active fire detections over Mexico using NASA FIRMS
        (VIIRS/Modis) hotspots. Markers are color-coded:
      </p>
      <ul>
        <li><span class="dot day" /> Daytime detection</li>
        <li><span class="dot night" /> Nighttime detection</li>
      </ul>
      <p class="note">
        Click on any marker to see details like acquisition time, coordinates, confidence, and more.
      </p>
    </div>

    <div class="map-card">
      <FireMap />
    </div>
  </section>
</template>

<style scoped>
:root {
  --primary: #2563EB;
  --secondary: #F59E0B;
  --surface: #ffffff;
  --text: #111827;
  --shadow: 0 10px 20px rgba(17, 24, 39, 0.06), 0 2px 6px rgba(17, 24, 39, 0.04);
  --radius: 16px;
}

.layout {
  display: grid;
  gap: 16px;
}

.info-card, .map-card {
  background: var(--surface);
  border: 1px solid rgba(17,24,39,0.06);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.info-card {
  padding: 18px;
}

.info-card h2 {
  margin-bottom: 6px;
  font-size: 20px;
  color: var(--text);
}
.info-card p {
  margin-bottom: 8px;
  color: rgba(17,24,39,0.8);
  font-size: 14px;
}
.info-card ul {
  margin: 6px 0 10px;
  padding-left: 18px;
  display: grid;
  gap: 6px;
  font-size: 14px;
}
.dot {
  display: inline-block;
  width: 10px; height: 10px;
  border-radius: 999px;
  margin-right: 8px;
  vertical-align: middle;
  box-shadow: 0 0 0 2px rgba(0,0,0,0.04) inset;
}
.dot.day { background: #F59E0B; }
.dot.night { background: #2563EB; }

.note {
  font-size: 13px;
  color: rgba(17,24,39,0.7);
}

.map-card {
  overflow: clip;
}

@media (min-width: 960px) {
  .layout {
    grid-template-columns: 360px 1fr;
    align-items: start;
  }
  .info-card {
    position: sticky;
    top: 84px;
  }
}
</style>

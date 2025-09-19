<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="brand">
        <div class="logo">🔥</div>
        <div class="titles">
          <h1>Mexico Fire Map</h1>
          <p>NASA FIRMS + Google Maps</p>
        </div>
      </div>
      <div class="actions">
        <a class="link" href="https://firms.modaps.eosdis.nasa.gov/" target="_blank" rel="noreferrer">NASA FIRMS</a>
        <a class="link" href="https://developers.google.com/maps" target="_blank" rel="noreferrer">Google Maps</a>
      </div>
    </header>

    <main class="app-content">
      <RouterView />
    </main>

    <footer class="app-footer">
      <span>Data: NASA FIRMS • Map: Google Maps</span>
      <span>Theme: Ocean Professional</span>
    </footer>
  </div>
</template>

<style scoped>
:root {
  --primary: #2563EB;
  --secondary: #F59E0B;
  --error: #EF4444;
  --bg: #f9fafb;
  --surface: #ffffff;
  --text: #111827;
  --shadow: 0 10px 20px rgba(17, 24, 39, 0.06), 0 2px 6px rgba(17, 24, 39, 0.04);
  --radius: 16px;
}

.app-shell {
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(59,130,246,0.08), #f9fafb 35%, #ffffff 100%);
  color: var(--text);
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.75));
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(37,99,235,0.1);
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logo {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(135deg, var(--primary), #60a5fa);
  box-shadow: var(--shadow);
  font-size: 20px;
}

.titles h1 {
  font-size: 18px;
  margin: 0;
  color: var(--text);
}
.titles p {
  font-size: 12px;
  margin: 0;
  color: rgba(17,24,39,0.7);
}

.actions {
  display: flex;
  gap: 10px;
}
.link {
  color: var(--primary);
  text-decoration: none;
  padding: 8px 10px;
  font-size: 13px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid rgba(37,99,235,0.15);
  box-shadow: var(--shadow);
  transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease;
}
.link:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(37,99,235,0.12);
  background: linear-gradient(135deg, rgba(37,99,235,0.06), #fff);
}

.app-content {
  padding: 16px;
}

.app-footer {
  padding: 14px 18px;
  background: #fff;
  border-top: 1px solid rgba(17,24,39,0.06);
  color: rgba(17,24,39,0.65);
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
  font-size: 12px;
}

@media (min-width: 960px) {
  .app-content {
    padding: 24px;
  }
}
</style>

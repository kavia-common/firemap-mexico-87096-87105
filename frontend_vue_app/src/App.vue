<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="brand centered">
        <div class="titles">
          <h1 class="app-title">Fire detection in Mexico using NASA's FIRMS API</h1>
          <p>NASA FIRMS + Google Maps</p>
        </div>
      </div>
      <!-- Actions removed as requested -->
    </header>

    <main class="app-content">
      <!-- Important info band under header -->
      <section class="info-band" aria-label="Important information on fire detection using NASA satellite systems">
        <div class="info-band__inner">
          <h2>Why NASA Satellite Fire Detection Matters</h2>
          <p>
            This area highlights timely information about wildfire activity detected by NASA’s FIRMS
            satellites. Use this space to communicate best practices, safety updates, and data notes.
            You can update this text anytime to reflect current priorities.
          </p>
          <a class="info-link" href="https://firms.modaps.eosdis.nasa.gov/" target="_blank" rel="noreferrer">
            Learn more about NASA FIRMS
          </a>
        </div>
      </section>

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
  /* Use cream background globally behind content and map */
  background: #FFFDD0;
  color: var(--text);
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #CDD9BA; /* requested hero/header background */
  border-bottom: 1px solid rgba(0,0,0,0.08);
  padding: 16px 18px;
  display: grid;
  place-items: center;
  color: #000; /* ensure black text for all content in this section */
  text-align: center;
}

/* Ensure ALL text in header is pure black, including nested links/spans/etc. */
.app-header, 
.app-header *, 
.app-header a, 
.app-header a:visited, 
.app-header a:hover, 
.app-header a:active {
  color: #000 !important;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
  color: #000;
}

/* Ensure the brand container centers its contents horizontally */
.centered {
  justify-content: center;
}

/* logo removed as no emojis or logo should be shown near the heading */

.titles h1,
.app-title {
  font-size: 20px;
  margin: 0;
  color: #000; /* enforce black */
  /* Use Helixa font with fallbacks */
  font-family: var(--helixa-stack, 'Helixa', 'Helvetica Neue', Helvetica, Arial, sans-serif);
  font-weight: 700;
  letter-spacing: 0.2px;
}
.titles p {
  font-size: 12px;
  margin: 4px 0 0 0;
  color: #000; /* enforce black for all text in header section */
  opacity: 0.85; /* subtle hierarchy while staying black */
}

/* Removed actions styles since the actions container is deleted */

.app-content {
  padding: 16px;
}

/* Distinct area under the header for important information */
.info-band {
  /* create clear vertical space below header */
  margin-top: 14px;
  margin-bottom: 18px;

  /* soft, on-brand surface that stands out on cream body background */
  background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%);
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 14px;
  box-shadow: var(--shadow);
}

.info-band__inner {
  padding: 16px 18px;
}

.info-band h2 {
  margin: 0 0 6px 0;
  font-size: 18px;
  line-height: 1.3;
  color: #000; /* enforce pure black */
}

.info-band p {
  margin: 0 0 10px 0;
  font-size: 14px;
  line-height: 1.55;
  color: #000; /* enforce pure black */
  opacity: 0.9;
}

.info-link {
  display: inline-block;
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  text-decoration: none;
  background: rgba(245, 158, 11, 0.18); /* subtle amber tint */
  border: 1px solid rgba(0,0,0,0.12);
  padding: 8px 10px;
  border-radius: 10px;
  transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.info-link:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(0,0,0,0.12);
  background: rgba(245, 158, 11, 0.26);
}

.app-footer {
  padding: 14px 18px;
  background: #fff;
  border-top: 1px solid rgba(17,24,39,0.06);
  color: rgba(0,0,0,0.75); /* ensure black-based text */
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

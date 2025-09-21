<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * Simple, dependency-free, minimal carousel state.
 * Slides hold image URLs that can be easily replaced.
 * By default, they point to a transparent placeholder.
 */
const placeholder =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="640"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#111" font-size="28" font-family="Arial, sans-serif">Add your image in /public/assets and update slides[] in App.vue</text></svg>`
  )

const slides = ref([
  { image: '/assets/detection.jpg' },
  { image: '/assets/tracking.jpg' },
  { image: '/assets/response.jpg' },
])

const currentIndex = ref(0)
let timer: number | undefined

function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % slides.value.length
}
function prevSlide() {
  currentIndex.value =
    (currentIndex.value - 1 + slides.value.length) % slides.value.length
}
// PUBLIC_INTERFACE
function goTo(i: number) {
  /** Jump to a particular slide by index. */
  if (i >= 0 && i < slides.value.length) currentIndex.value = i
}

function startAuto() {
  stopAuto()
  timer = window.setInterval(nextSlide, 6000)
}
function stopAuto() {
  if (timer) {
    window.clearInterval(timer)
    timer = undefined
  }
}

// If an image fails to load, replace with a neutral placeholder.
function usePlaceholder(e: Event) {
  const el = e.target as HTMLImageElement
  if (!el) return
  el.src = placeholder
}

onMounted(startAuto)
onBeforeUnmount(stopAuto)
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

      <!-- New minimal carousel directly below the header/info area -->
      <section class="carousel" aria-label="Detection Tracking Response highlights">
        <div class="carousel__viewport">
          <div class="carousel__track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
            <!-- Slide 1 -->
            <article class="carousel__slide" aria-roledescription="slide" aria-label="1 of 3">
              <div class="slide-media">
                <!-- Replace src below with your image path, e.g., /assets/detection.jpg -->
                <img
                  :src="slides[0].image"
                  alt="Detection slide image"
                  @error="usePlaceholder($event)"
                />
              </div>
              <p class="slide-caption">Detection: Use NASA FIRMS API to know when/where new fires ignite.</p>
            </article>
            <!-- Slide 2 -->
            <article class="carousel__slide" aria-roledescription="slide" aria-label="2 of 3">
              <div class="slide-media">
                <!-- Replace src below with your image path, e.g., /assets/tracking.jpg -->
                <img
                  :src="slides[1].image"
                  alt="Tracking slide image"
                  @error="usePlaceholder($event)"
                />
              </div>
              <p class="slide-caption">Tracking: Receiving signals on possible fire disasters</p>
            </article>
            <!-- Slide 3 -->
            <article class="carousel__slide" aria-roledescription="slide" aria-label="3 of 3">
              <div class="slide-media">
                <!-- Replace src below with your image path, e.g., /assets/response.jpg -->
                <img
                  :src="slides[2].image"
                  alt="Response slide image"
                  @error="usePlaceholder($event)"
                />
              </div>
              <p class="slide-caption">Response: Sending over SMS alerts on fire events near a place of choice/convenience</p>
            </article>
          </div>
        </div>

        <!-- Controls -->
        <div class="carousel__controls">
          <button class="ctrl" aria-label="Previous slide" @click="prevSlide">‹</button>
          <div class="dots" role="tablist" aria-label="Carousel Pagination">
            <button
              v-for="(s, i) in slides"
              :key="i"
              class="dot"
              :class="{ active: i === currentIndex }"
              @click="goTo(i)"
              :aria-selected="i === currentIndex"
              role="tab"
              :aria-controls="`slide-${i+1}`"
            />
          </div>
          <button class="ctrl" aria-label="Next slide" @click="nextSlide">›</button>
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
  font-size: 22px;
  margin: 0;
  color: #000; /* enforce black */
  /* Use Open Sans for the header title */
  font-family: var(--open-sans-stack, 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif);
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

/* Carousel - modern, minimal, black text */
.carousel {
  margin: 18px 0 22px;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 14px;
  box-shadow: var(--shadow);
  color: #000; /* ensure captions and controls are black */
  overflow: hidden;
}

.carousel__viewport {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.carousel__track {
  display: flex;
  transition: transform 450ms ease;
  will-change: transform;
}

.carousel__slide {
  min-width: 100%;
  padding: 14px 14px 16px;
  display: grid;
  gap: 10px;
  place-items: center;
  background: linear-gradient(180deg, rgba(248,250,252,0.5) 0%, rgba(255,255,255,0.65) 100%);
}

.slide-media {
  width: 100%;
  max-width: 960px;
  aspect-ratio: 3 / 1.6;
  background: #f3f4f6; /* neutral light gray if image missing while loading */
  border: 1px dashed rgba(0,0,0,0.15);
  border-radius: 12px;
  overflow: hidden;
  display: grid;
  place-items: center;
}

.slide-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  color: transparent;
  display: block;
}

.slide-caption {
  margin: 2px 0 0;
  font-size: 14px;
  line-height: 1.45;
  color: #000; /* enforce black */
  text-align: center;
  max-width: 980px;
}

.carousel__controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 10px 12px 14px;
  border-top: 1px solid rgba(0,0,0,0.06);
  background: rgba(255,255,255,0.8);
}

.ctrl {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.12);
  background: #f8fafc;
  color: #000;
  font-size: 22px;
  line-height: 1;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease;
}
.ctrl:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(0,0,0,0.12);
  background: #ffffff;
}

.dots {
  display: flex;
  gap: 8px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(0,0,0,0.25);
  border: 1px solid rgba(0,0,0,0.2);
  cursor: pointer;
  transition: transform 0.15s ease, background 0.2s ease;
}
.dot:hover {
  transform: scale(1.1);
}
.dot.active {
  background: #000; /* active is solid black */
}
</style>

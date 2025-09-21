<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref } from 'vue'

// Carousel slides will be rendered via Vuetify VCarousel
const slides = ref([
  { image: '/assets/detection.jpg', caption: 'Detection: Use NASA FIRMS API to know when/where new fires ignite.' },
  { image: '/assets/tracking.jpg', caption: 'Tracking: Receiving signals on possible fire disasters' },
  { image: '/assets/response.jpg', caption: 'Response: Sending over SMS alerts on fire events near a place of choice/convenience' },
])

// Fallback placeholder for missing images
const placeholder =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="640"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#111" font-size="28" font-family="Arial, sans-serif">Add your image in /public/assets and update slides[] in App.vue</text></svg>`
  )
</script>

<template>
  <v-app>
    <!-- Header -->
    <v-app-bar border="b" elevation="1">
      <v-container class="text-center py-3">
        <div class="d-flex align-center justify-center">
          <div>
            <h1 class="text-h5 font-weight-bold app-title black--text">Fire detection in Mexico using NASA's FIRMS API</h1>
            <p class="text-caption mt-1 black--text">NASA FIRMS + Google Maps</p>
          </div>
        </div>
      </v-container>
    </v-app-bar>

    <v-main class="app-bg">
      <v-container class="py-4">
        <!-- Info band -->
        <v-card class="mb-4 info-band" variant="elevated">
          <v-card-text>
            <h2 class="text-subtitle-1 font-weight-bold black--text mb-2">Why NASA Satellite Fire Detection Matters</h2>
            <p class="text-body-2 black--text mb-3">
              This area highlights timely information about wildfire activity detected by NASA’s FIRMS
              satellites. Use this space to communicate best practices, safety updates, and data notes.
              You can update this text anytime to reflect current priorities.
            </p>
            <v-btn
              color="secondary"
              variant="tonal"
              href="https://firms.modaps.eosdis.nasa.gov/"
              target="_blank"
              rel="noreferrer"
              class="text-none font-weight-bold"
            >
              Learn more about NASA FIRMS
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Carousel -->
        <v-card class="mb-6">
          <v-carousel hide-delimiter-background color="primary" height="380">
            <v-carousel-item v-for="(s, i) in slides" :key="i">
              <v-sheet class="d-flex flex-column align-center pa-3" color="transparent">
                <v-img
                  :src="s.image"
                  :lazy-src="placeholder"
                  width="100%"
                  max-width="960"
                  aspect-ratio="1.875"
                  cover
                >
                </v-img>
                <div class="text-body-2 text-center mt-2" style="color: #000;">
                  {{ s.caption }}
                </div>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
        </v-card>

        <!-- Routed views -->
        <RouterView />
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer class="py-3" color="white" border="t">
      <v-container class="d-flex justify-space-between align-center text-caption">
        <span style="color: rgba(0,0,0,0.75)">Data: NASA FIRMS • Map: Google Maps</span>
        <span style="color: rgba(0,0,0,0.75)">Theme: Ocean Professional</span>
      </v-container>
    </v-footer>
  </v-app>
</template>

<style scoped>
.app-bg {
  background: #FFFDD0;
}

/* enforce Open Sans for header title */
.app-title {
  font-family: var(--open-sans-stack, 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif);
}

/* Info band subtle gradient while keeping black text */
.info-band {
  background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.88) 100%);
  border: 1px solid rgba(0,0,0,0.08);
}

/* ensure all header content text is black */
:deep(.v-app-bar), :deep(.v-app-bar *){
  color: #000 !important;
}
</style>

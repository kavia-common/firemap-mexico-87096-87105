# Mexico Fire Map (Vue 3 + Vite + Vuetify)

Interactive, responsive map of active fires over Mexico using NASA FIRMS hotspots and Google Maps.

Features:
- Vuetify UI: AppBar header, info band, and image carousel below the header
- Google Map centered on Mexico, mobile and desktop friendly
- Fetches NASA FIRMS feed, filters to Mexico
- Color-coded markers: amber for day, blue for night
- Click markers to view details (time, coordinates, confidence, brightness, FRP, satellite)
- Refresh button to re-fetch

Styling & Theming:
- Ocean Professional theme (blue & amber accents, minimalist, rounded corners, shadows, gradients)
- Header background color: #CDD9BA, text enforced as black
- Global background: cream (#FFFDD0)
- Font: Open Sans (loaded in index.html)

Prerequisites:
- Google Maps JavaScript API key with Maps JavaScript API enabled

Setup:
1) Copy environment template and set your API key:
```
cp .env.example .env
# edit .env and set VITE_GOOGLE_MAPS_API_KEY=YOUR_KEY
```

2) Install dependencies:
```
npm install
```

3) Run the app:
```
npm run dev
```

Build for production:
```
npm run build
```

Using Vuetify:
- Vuetify is initialized in `src/plugins/vuetify.ts` with a custom theme.
- Vite integration is configured in `vite.config.ts` via `vite-plugin-vuetify`.
- App shell (header/info band/carousel/footer) is implemented in `src/App.vue` with VApp, VAppBar, VContainer, VCard, VCarousel, VImg, etc.

Carousel images:
- A 3-slide carousel appears directly below the header/info area with captions:
  1) "Detection: Use NASA FIRMS API to know when/where new fires ignite."
  2) "Tracking: Receiving signals on possible fire disasters"
  3) "Response: Sending over SMS alerts on fire events near a place of choice/convenience"
- To add your images:
  1) Place files in `frontend_vue_app/public/assets/` as `detection.jpg`, `tracking.jpg`, `response.jpg` (or any names of your choice).
  2) In `src/App.vue`, update the `slides` array to point to your filenames.
- If an image path is missing or fails to load, a neutral gray placeholder is used as a lazy-src.
- All carousel captions are rendered in black.

Notes:
- Data source: NASA FIRMS. For production usage, review and adhere to FIRMS terms and usage limits.

Manual steps (if needed):
- Ensure Open Sans font link remains present in `index.html`.
- Add your three images to `public/assets` for the carousel, or keep the placeholder in place.

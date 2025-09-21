# Mexico Fire Map (Vue 3 + Vite)

Interactive, responsive map of active fires over Mexico using NASA FIRMS hotspots and Google Maps.

Features:
- Google Map centered on Mexico, mobile and desktop friendly
- Fetches NASA FIRMS last-24h feed (VIIRS CSV), filters to Mexico
- Color-coded markers: amber for day, blue for night
- Click markers to view details (time, coordinates, confidence, brightness, FRP, satellite)
- Refresh button to re-fetch

Styling: Ocean Professional theme (blue & amber accents, minimalist, rounded corners, shadows, gradients)

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

Notes:
- Data source: NASA FIRMS. For production usage, review and adhere to FIRMS terms and usage limits.
- The app fetches the 24h global CSV and filters client-side to Mexico bounding box.

Carousel images:
- A 3-slide carousel appears directly below the header/info area with captions:
  1) "Detection: Use NASA FIRMS API to know when/where new fires ignite."
  2) "Tracking: Receiving signals on possible fire disasters"
  3) "Response: Sending over SMS alerts on fire events near a place of choice/convenience"
- To add your images:
  1) Place files in `frontend_vue_app/public/assets/` as `detection.jpg`, `tracking.jpg`, `response.jpg` (or use your preferred names).
  2) In `src/App.vue`, update the `slides` array to point to your filenames, e.g.:
     const slides = ref([
       { image: '/assets/my-detection.png' },
       { image: '/assets/my-tracking.png' },
       { image: '/assets/my-response.png' },
     ])
- If an image path is missing or fails to load, a neutral gray placeholder will be used automatically.
- All carousel text is rendered in black; styling is minimal and modern.

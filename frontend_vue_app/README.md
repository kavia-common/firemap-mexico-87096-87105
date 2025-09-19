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

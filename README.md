# PICKet — Waste Picker Spatial Organizing Toolkit

**PICKet** is a 100% client-side Web GIS toolkit built for waste picker cooperatives and organizers in Kenya. It runs offline, requires no server or internet in the field, and generates GPS-stamped GeoJSON evidence packs for EPR (Extended Producer Responsibility) advocacy.

Built by waste pickers, for waste pickers — to replace "they say" with data.

## Features

- **Offline-first** — all data persists in `localStorage`; no internet needed after initial load
- **Dumpsite proximity mapping** — 30m (Hot Zone) and 60m (Buffer) zones around dumpsite boundaries
- **4-ward support** — cycle through Mathare, Dandora, Kibera, Kawangware with synthetic collection point data
- **Hazard/incident tagging** — click to mark health incidents, harassment, unfair pricing directly on the map
- **Collection Pricing tool** — adjust price per kg (KES 5–100) and see daily affected value per ward
- **GPS geofence verification** — log site visits with high-accuracy GPS; records are timestamped and buffer-verified
- **EPR Evidence Pack export** — download all tagged hazards and visit logs as a standard `.geojson` file, ready for QGIS/ArcGIS or presentation to NEMA/county officials
- **Custom GeoJSON upload** — bring your own collection point data

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build | Vite 5 |
| Map | Leaflet 1.9 + react-leaflet 4 |
| Spatial | Turf.js 6.5 |
| Styling | Tailwind CSS 3.3 |
| Icons | Lucide React |
| Persistence | localStorage (crash-proof wrapper) |
| Testing | Vitest 4 |
| Linting | ESLint (inherited) |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Production build
npm run build
```

## Usage

1. Open the app — a dark-themed side panel shows **Dumpsite Proximity** stats for the current ward
2. Click **Mathare Valley** button in the Field Toolkit to cycle wards (Mathare → Dandora → Kibera → Kawangware)
3. Adjust the **Price per kg** slider to see total daily value for affected collection points
4. Click **Tag Hazard / Incident** then click anywhere on the map to mark a location
5. Click **Log Site Visit** to capture your GPS coordinates and verify you're within the dumpsite buffer
6. Click **Download EPR Evidence Pack** to export all hazards and visit logs as `.geojson`

## Architecture

```
src/
├── App.jsx                          # Main layout: side panel + map
├── main.jsx                         # Entry point
├── components/
│   ├── MapViewer.jsx                # Leaflet map with buffer zones, collection points, hazard overlay
│   ├── PICKetOverlay.jsx            # Floating toolbar: ward toggle, hazard brush, export
│   └── LocalLedger.jsx              # GPS site-verification widget with localStorage persistence
├── hooks/
│   ├── useTraumaBrush.js            # Centralized hazard-mark state with undo/clear/auto-save
│   └── useGeoData.js                # Async fetch with localStorage cache
└── utils/
    ├── spatialEngine.js             # Turf.js calculations: buffer, runoff, LVS, GeoJSON validation
    ├── exportUtils.js               # GeoJSON audit export with metadata
    └── spatialEngine.test.js        # Vitest suite (2/2 passing)
```

### Key Design Decisions

- **100% client-side** — no backend, no database, no SIM required in the field
- **ES modules** throughout (`"type": "module"` in package.json)
- **Crash-proof persistence** — `saveToLedger` wraps writes in try-catch with timestamp metadata to prevent corruption from `localStorage` quota overflows
- **Centralized brush state** — `useTraumaBrush` hook keeps hazard marks outside the view layer so undo/clear/persistence work independently of the map component
- **Standard GeoJSON output** — exports are valid `FeatureCollection` objects compatible with QGIS, ArcGIS, and any GIS pipeline

## Deployment

Push to `master` triggers GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and deploys to `gh-pages`.

```bash
git push origin master
```

## Context

This toolkit was built alongside the Nairobi waste picker organizing movement. The WhatsApp transcript in this repository documents real organizing around EPR pricing disputes, county consolidation, Dandora evictions, and the fight for formal recognition.

Key organizing pain points the toolkit addresses:
- **Data gap** — NEMA uses a Ghana formula (41 kg/day) that doesn't fit Kenyan reality; pickers now collect their own site-level data
- **Stigma → exclusion** — "Chokora" stigma means no contracts, insurance, or minimum wage; GPS-verified route logs build the case for formalization
- **Meeting overload** — organizers spread across 17 sub-counties can now share a unified spatial picture

## License

MIT

# Integration & Deployment Guide

How to **embed**, **deploy**, **theme**, or **reuse the data** of the Cao Bằng
Travel Map in another project. For an overview of features, see
[`README.md`](README.md).

---

## TL;DR

- It's a **static site** (`index.html` + `app.js` + `data.js` + a few data files
  + a photo folder). No framework, no build, no API keys.
- `app.js` is a self-running IIFE that reads five **globals** loaded before it:
  `CAO_BANG_BOUNDARY`, `HIGHWAYS`, `ASSETS`/`CATEGORIES`/`MAP_CONFIG`/`TOWNS`/`POIS`
  (from `data.js`), and `TRIPS`/`DAY_COLORS` (from `trips.js`).
- The only external runtime dependency is **Leaflet 1.9.4** (from unpkg) and the
  **map tile providers** (CARTO / Esri / OpenTopoMap — all keyless). Routing and
  geometry are **precomputed**, so nothing calls OSRM/Nominatim at runtime.

---

## 1. Deploy as-is (recommended)

Copy the whole folder (minus `admin/`) to any static host.

**Must deploy together:**

```
index.html  app.js  data.js  boundary.js  highways.js  trips.js  sw.js
SEN WEB OTA - main/        ← photos + thumbs + guide pages
```

**Do NOT deploy:** `admin/`, `AI_REPORT.md`, `make-thumbs.ps1`, `*.bat`
(dev-only tooling).

Checklist:

- [ ] Serve over **HTTPS** (or `localhost`) so the service worker registers and
      offline/tile-cache works. On `file://` the SW is silently skipped.
- [ ] Keep the folder name `SEN WEB OTA - main` **or** change the `ASSETS`
      constant at the top of `data.js` to match your folder. Paths are
      **case-sensitive** on Linux hosts (`images/Food/`, capital F).
- [ ] If hosting under a **sub-path** (e.g. `example.com/map/`), the relative
      paths still work, but register the SW with the right scope — see §5.

Tested targets: Netlify, GitHub Pages, Railway, Nginx/Apache static, S3+CloudFront.

---

## 2. Embed inside another page (iframe)

The map is full-viewport by design. The clean way to embed it in a larger site
is an **iframe**:

```html
<iframe
  src="/map/index.html"
  title="Cao Bằng Travel Map"
  style="width:100%; height:80vh; border:0; border-radius:16px"
  loading="lazy"
  allow="geolocation">     <!-- needed for the "show my location" button -->
</iframe>
```

- `allow="geolocation"` is required for the GPS locate button to work in the
  iframe.
- Deep-link into a state with the query string:
  - `?edit` — coordinate-picker mode (tap map → coords copied to clipboard).
- The map manages its own dark mode (follows the viewer's OS setting) — you don't
  need to sync themes across the iframe boundary.

> Embedding the raw `#map` element in your own page (no iframe) is possible but
> means bundling Leaflet + all the CSS in `index.html`'s `<style>` and matching
> the load order below. The iframe is far less fragile.

---

## 3. Reuse the DATA in your own app

The data files are plain JS with no dependencies on the app, so any project can
load them and read the globals. In Node:

```js
const vm = require("vm");
const fs = require("fs");
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync("data.js", "utf8"), ctx);     // ASSETS, CATEGORIES, MAP_CONFIG, TOWNS, POIS
vm.runInContext(fs.readFileSync("boundary.js", "utf8"), ctx); // CAO_BANG_BOUNDARY (GeoJSON)
vm.runInContext(fs.readFileSync("highways.js", "utf8"), ctx); // HIGHWAYS
vm.runInContext(fs.readFileSync("trips.js", "utf8"), ctx);    // TRIPS, DAY_COLORS (needs ASSETS first)

console.log(ctx.POIS.length, "places,", ctx.TOWNS.length, "towns");
```

Note: `trips.js` references `ASSETS`, so load `data.js` **before** it.

### Data shapes (quick reference)

```
POIS[]      { id, name, localName, category, tier:'province'|'city',
              lat, lng, minZoom?, desc, distance?, price?, img?, maps?,
              mapsName?, bookUrl?, guideUrl?, guideLabel?, phone?,
              photoPin?, zPriority?, pick?, veg?, approx?, featured?, labelAbove? }

TOWNS[]     { id, name, localName, lat, lng }          // orientation markers only

HIGHWAYS[]  { id, name, color, line: [[lat,lng], …] }  // precomputed road geometry

TRIPS[]     { id, title, subtitle, days, pace, vibe, cover, km,
              stopsByDay: [[poiId, …], …],             // stops per day
              segsByDay:  [[[[lat,lng],…], …], …] }    // OSRM geometry per day

CAO_BANG_BOUNDARY   // GeoJSON Polygon/MultiPolygon (lng,lat order)
```

Field meanings are documented in the header comment of `data.js`.

---

## 4. Adapt it to a DIFFERENT province / region

The app code is region-agnostic — everything Cao-Bằng-specific is in data. To
retarget:

1. **`data.js`** — replace `POIS`, `TOWNS`, and set `MAP_CONFIG`
   (`cityCenter`, `cityZoom`, `provinceCenter`, `provinceZoom`, `maxBounds`,
   `cityThreshold`, `cityImg`, `cityPinImg`). Point `ASSETS` at your photo folder.
2. **`boundary.js`** — replace `CAO_BANG_BOUNDARY` with your region's outline.
   Get it from Nominatim:
   `https://nominatim.openstreetmap.org/search?q=<region>&format=json&polygon_geojson=1&polygon_threshold=0.002`
   then wrap the `geojson` as `var CAO_BANG_BOUNDARY = {…}` (keep the variable
   name, or rename in `app.js` too).
3. **`highways.js`** — replace `HIGHWAYS` with your corridors (or set to `[]` to
   disable). Each corridor's `line` is `[[lat,lng], …]`; build it from OSRM
   `route/v1/driving/<lng,lat>;<lng,lat>?overview=simplified&geometries=geojson`.
4. **`trips.js`** — replace `TRIPS` (or trim `SUGGESTED_TRIP_IDS` in `app.js`).
   Build `segsByDay` from OSRM between consecutive `stopsByDay` stops.
5. **Thumbnails** — run `make-thumbs.ps1` (or your own resizer) to (re)generate
   `thumbs/` for the new photos.

The "provincial capital" star pin is keyed to `MAP_CONFIG.cityCenter` /
`cityPinImg`; the iconic-teardrop tier is any POI with `photoPin: true`.

---

## 5. Configuration knobs

| Where | Knob | Effect |
|---|---|---|
| `data.js` → `MAP_CONFIG` | `cityThreshold` | zoom at which city-tier pins appear (default 12) |
| `data.js` → `MAP_CONFIG` | `maxBounds` | pan limits |
| `data.js` → `MAP_CONFIG` | `cityPinImg` | photo inside the capital pin |
| `app.js` | `SUGGESTED_TRIP_IDS` | which itineraries the picker shows |
| `app.js` | `PROVINCE_BBOX` / `CITY_BBOX` | tile-preload extents |
| `app.js` (`applyBasemap`) | mask `maskO` per style | how strongly the outside-province area is dimmed |
| `sw.js` | `VERSION` | bump to invalidate caches after changes |
| `sw.js` | `TILE_HOSTS` | which tile hosts are cached |

**localStorage keys** the app writes (namespace if you run several instances):
`cbmap-theme`, `cbmap-basemap`, `cbmap-highways`, `cbmap-welcomed`,
`cbmap-preload-<basemap>…`.

**Service-worker scope** — `app.js` registers `sw.js` with the default (folder)
scope. Under a sub-path this is fine; if you move `sw.js`, update the
`register("sw.js")` path and the SW's own asset-matching in `sw.js`.

---

## 6. External services & privacy

At **runtime** the app only talks to:

- **Leaflet** — `unpkg.com/leaflet@1.9.4` (script + CSS). To self-host, download
  Leaflet into the folder and change the `<script>`/`<link>` in `index.html`.
- **Tile providers** — `basemaps.cartocdn.com`, `server.arcgisonline.com`,
  `tile.opentopomap.org` (all keyless, subject to their usage policies — for
  heavy traffic use your own tile plan / provider).
- **Google Maps deep links** — only when the user taps Directions / Google Maps /
  a Day chip (opens Google Maps, no embedding, no key).

No analytics, no cookies, no login. Geolocation is used only when the user taps
the locate button and is never sent anywhere (stays in the browser).

OSRM and Nominatim are used **only offline, at authoring time** to precompute
geometry — never called from the shipped app.

---

## 7. Managing content after launch

- **Small edits** → the admin tool (`node admin/server.js` → `:4173/admin/`),
  which writes `data.js` and keeps timestamped backups. Dev-only; don't deploy it.
- **Adding a place from a Google Maps short link** — resolve the redirect to get
  coordinates + the registered name:

  ```
  GET https://maps.app.goo.gl/XXXX   (no auto-redirect)
  → follow the Location header
  → parse  !3d<lat>!4d<lng>   (coordinates)
       and /place/<name>       (mapsName)
  ```

  Then add a `POIS` entry with `lat`, `lng`, `maps` (the short link) and
  `mapsName`. Set `approx: true` if you didn't verify the exact pin.

- After any photo change, regenerate thumbnails and (if caching changed) bump
  `sw.js` `VERSION`.

---

## 8. Load order (if you assemble the page yourself)

```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<!-- ...all the app CSS from index.html <style>... -->

<div id="map"></div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="boundary.js"></script>
<script src="highways.js"></script>
<script src="data.js"></script>   <!-- defines ASSETS, needed by trips.js -->
<script src="trips.js"></script>
<script src="app.js"></script>    <!-- self-runs on load; expects #map to exist -->
```

`app.js` runs immediately and looks for an element with `id="map"` plus the DOM
hooks in `index.html`'s `<body>` (search bar, chips, card, trip bar, welcome,
etc.). Reusing `app.js` outside `index.html` means reproducing those hooks — for
most integrations the **iframe (§2)** is the right call.

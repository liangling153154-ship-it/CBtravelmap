# Cao Bằng Travel Map 🗺️

A mobile-first, English-language interactive travel map of **Cao Bằng province**,
Vietnam — built by **Sen's Homestay** for foreign visitors. Zero build step:
three static files (`index.html`, `app.js`, `data.js`) plus a few data files and
a photo folder. Open it, or drop it on any static host.

> **Made by locals — the spots we'd take a friend.** Every place on the map is
> hand-picked from Sen's own lists, not scraped or generic.

---

## What's on the map

- **45 places** across the province and the city, in 6 live categories
  (Sights & Nature, Culture & History, Stay, Food & Café, Services, Transport).
  Category chips are generated automatically and only appear for categories that
  actually have places.
- **Two seamless zoom tiers:**
  - **Province view** (zoomed out) — Ban Gioc, Nguom Ngao, Pac Bo, Angel Eye,
    Thang Hen, Phia Oac, craft villages, viewpoints… with real distances and
    drive times from Sen's Homestay.
  - **City view** (zoom ≥ 12) — Sen's Homestay + the restaurants & cafés from
    Sen's food guide with photos and prices. Pins reveal progressively per
    `minZoom` to keep things uncluttered.
- **14 district towns** (Trùng Khánh, Trà Lĩnh, Quảng Uyên, Bảo Lạc…) drawn as
  small "cluster of houses" orientation markers (`TOWNS` in `data.js`) — they
  help visitors read where they are; they are **not** clickable POIs. The icon
  scales with zoom (small on the province overview, larger when you zoom in).

### Three distinct pin shapes (a visual hierarchy)

| Tier | Look | Which places |
|---|---|---|
| **Provincial capital** | Round **city photo** in a **gold ring + star badge**, with a soft pulsing halo | Cao Bằng City |
| **Iconic sites** | **Teardrop** map-pin with the photo inside; sharp tip on the exact spot; category-coloured halo + gentle glow | `photoPin: true` sights (Angel Eye, Ban Gioc, Ba Quang, Pac Bo, Khau Coc Cha) |
| **Everything else** | **Round** photo pin (province a touch larger than city) | any place with an `img`, revealed per `minZoom` |

Every pin carries a small category badge. Iconic/capital names sit in a solid
pill for high contrast; `labelAbove: true` flips a label above its pin to avoid
collisions. All motion respects `prefers-reduced-motion`.

---

## Look & feel

- **Province focus** — the province boundary is drawn and everything outside
  Cao Bằng is strongly dimmed, so the eye lands on the province.
- **Dark mode** — moon/sun button in the search bar; follows the phone's setting
  by default, remembers the choice (`localStorage`).
- **3 basemap styles** — layers button in the search bar:
  - **Streets** (CARTO Voyager / Dark Matter — follows the theme)
  - **Satellite** (Esri World Imagery + place-name overlay)
  - **Terrain** (OpenTopoMap contours)
  All keyless/free; the choice is remembered.
- **Instant on phones** — a service worker (`sw.js`) caches tiles and photos, and
  the province is pre-loaded in the background so panning doesn't show grey
  tiles. (Needs HTTPS or `localhost`; silently skipped on `file://`.)

---

## Suggested itineraries

The **Suggested itineraries** picker offers **3 ready-made road trips**:

- **Classic One Day** (~182 km) — the greatest hits.
- **Full East Loop 2D1N** (~237 km) — Ban Gioc & Quay Son, then viewpoints & Thang Hen.
- **Nature & History 3D2N** (~367 km) — Pac Bo & lakes, east villages, Ban Gioc finale.

Pick one and the real driving route is drawn on the map — **one colour per day**,
every stop numbered, other pins hidden. The bottom bar shows **one tappable
"Day N" chip per day**, each opening that day's route directly in **Google Maps**
(Sen's → that day's stops → Sen's) for live navigation. Exit with ✕, Esc, or by
tapping a filter chip.

> `trips.js` actually holds 5 itineraries; only these 3 are shown, via
> `SUGGESTED_TRIP_IDS` in `app.js`. Route geometry is precomputed from the public
> OSRM server (`route/v1/driving`, `overview=simplified`).

---

## Main roads (highways)

The province view draws Cao Bằng's main road corridors as bold lines (white/dark
casing so they pop on any basemap). **10 corridors**, colour-coded by role:

- **In-province roads** — all **amber** (`#F59E0B`): QL3 to Ban Gioc, QL34 to
  Bảo Lạc, the Pac Bo road, the Ba Quang → Ban Gioc scenic route, Pac Bo → Khau
  Coc Cha, the Ban Gioc → Trung Khanh → Tra Linh → Thang Hen inland link, the
  Phia Oac road, and scenic connectors.
- **Inter-province connectors** — kept a distinct colour to read as "leaving the
  province": **Hanoi arrival** (blue `#0EA5E9`) and **onward to Hà Giang**
  (fuchsia `#D946EF`).

Toggle under the layers button → **Main roads**. They hide automatically in the
city and trip views. Geometry lives in `highways.js` — **this file is the source
of truth**; edit it directly rather than regenerating (see NOTES below).

---

## Google Maps integration

Every place card has two Google Maps buttons:

- **Directions** — turn-by-turn from the traveller's own GPS to the place, opening
  the native Google Maps app on phones. Uses the registered business name
  (`mapsName`) when known so it lands on the exact business, else the coordinates.
- **Google Maps** — opens the place's own Google Maps page (reviews, hours,
  photos) via the owner's real `maps.app.goo.gl` link.

In **trip** mode, each **Day N** chip builds a full multi-stop route for that day.

---

## Promoting the host (Sen's Homestay)

The map funnels travellers to the host who made it:

- A **"Stay with Sen's Homestay"** pill sits next to the "Find places" button,
  always visible; tapping it opens Sen's card.
- Sen's card shows a warm **"Your friendly local host"** promo panel (one-stop:
  rooms, motorbike rental, tours, bus tickets, local tips) and a **"Book your
  stay"** primary button.

---

## Files — no build step

| File | Purpose | Size |
|---|---|---|
| `index.html` | App shell + all CSS (incl. dark theme) | ~54 KB |
| `app.js` | Map logic (Leaflet 1.9.4) | ~52 KB |
| `data.js` | **All places + towns + config live here — edit this file** | ~29 KB |
| `boundary.js` | Cao Bằng province outline (OSM/Nominatim GeoJSON, simplified) | ~13 KB |
| `highways.js` | Main-road corridors (OSRM geometry) — **source of truth** | ~31 KB |
| `trips.js` | Suggested itineraries + per-day road geometry (OSRM) | ~58 KB |
| `sw.js` | Service worker — tile/photo cache + offline | ~3 KB |
| `SEN WEB OTA - main/` | Photo assets + guide pages — **deploy with the map** | — |

Load order (bottom of `index.html`): Leaflet → `boundary.js` → `highways.js` →
`data.js` → `trips.js` → `app.js`.

### Running it

Open `index.html` directly (internet needed for map tiles), **or** serve the
folder with any static host:

```bash
python -m http.server 8000        # then open http://localhost:8000
```

Works as-is on Netlify / GitHub Pages / Railway / any static host.
⚠️ The service worker needs **HTTPS** (or `localhost`) — it is skipped on
`file://`, so for full offline behaviour serve over http(s).
⚠️ Keep the `SEN WEB OTA - main` folder name (or update the `ASSETS` constant at
the top of `data.js`). Asset paths are **case-sensitive** on Linux hosting.

---

## Editing places (`data.js`)

`data.js` is the only file most edits touch. It exports `ASSETS`, `CATEGORIES`,
`MAP_CONFIG`, `TOWNS` and `POIS`. A POI:

```js
{
  id: "pedros-pizza",              // unique slug
  name: "Pedro's Pizza",           // English name
  localName: "Pedro's Pizza",      // Vietnamese (shown small; hidden if same)
  category: "food",                // sights | culture | stay | food | nightlife
                                   // | shopping | services | health | transport
  tier: "city",                    // "province" or "city" (city shows at zoom ≥ 12)
  lat: 22.66756, lng: 106.26157,
  minZoom: 13,                     // optional — hide pin below this zoom
  desc: "1–2 line description",
  distance: "84.6 km east · ~2 h", // optional (province tier)
  price: "from 150,000₫",          // optional, shown next to distance
  img: ASSETS + "images/…jpg",     // optional photo (falls back to styled header)
  maps: "https://maps.app.goo.gl/…", // Google place link — Directions opens this
  mapsName: "Pedro's Pizza, Cao Bằng", // registered GM name → precise Directions
  bookUrl: "https://…",            // optional → "Book now" button
  guideUrl: ASSETS + "food.html",  // optional → guide button
  guideLabel: "Food guide",        //   its label
  phone: "0822946888",             // optional → call button
  photoPin: true,                  // render as a large teardrop iconic pin
  zPriority: 700,                   //   stacking order among iconic pins
  pick: true,                      // "★ Sen's pick" badge
  veg: true,                       // "Veg-friendly" badge
  approx: true,                    // location is a best guess — please fine-tune!
  featured: true,                  // star badge on the pin itself
  labelAbove: true                 // flip the pin's label above it
}
```

**Adding a place from a Google Maps link** — resolve the short link to
coordinates + the registered name, then add an entry (see
[`INTEGRATION.md`](INTEGRATION.md) for the exact technique). Sen's Homestay is at
**22.67379, 106.25561**.

**Pin thumbnails** — pins load 128 px thumbs from `SEN WEB OTA - main/thumbs/`
(~6 KB each; cards use the full photos). After adding/changing photos, regenerate:

```bash
powershell -ExecutionPolicy Bypass -File .\make-thumbs.ps1
```

(if a thumb is missing, the pin falls back to the full photo automatically.)

### Still approximate (fine-tune when convenient)

A few province spots have estimated coordinates (`approx: true`) — e.g. Phia
Thap, Dia Tren, Quay Son swim, Pi Pha, Pac Nga, Ban Giang. Fix in seconds: open
`index.html?edit` → tap the real spot → coordinates are copied to the clipboard →
paste into `data.js`, remove `approx: true`.

---

## Admin tool (internal, dev-only)

An owner-only panel for managing places without hand-editing `data.js`:

```bash
node admin/server.js        # or double-click START-ADMIN.bat on Windows
```

Open **http://127.0.0.1:4173/admin/** (localhost only, not internet-reachable):

- **Địa điểm (Places)** — searchable table; add / edit (full form + "pick coords
  on the map" shortcut) / delete. Written straight into `data.js`.
- **AI chỉnh sửa (AI edit)** — no API key, no cost: describe a change in
  Vietnamese → it copies a prompt (your request + current `data.js`) to the
  clipboard → paste into Claude/ChatGPT → paste the new `data.js` back →
  **Validate** → **Save**.
- **Bản lưu (Backups)** — every save auto-backs up the previous `data.js`;
  restore any version with one click.

The server validates any incoming `data.js` (parses, unique ids, valid
categories, numeric coords) before writing, so a bad edit can't corrupt the map.
**Don't deploy the `admin/` folder with the public map.**

---

## Credits

Map tiles © OpenStreetMap contributors, © CARTO, Esri, OpenTopoMap. Routing by
OSRM. Photos © Sen's Homestay. Built by Sen's Homestay.

---

## NOTES for maintainers

- **`highways.js` is the source of truth** — do **not** regenerate it from an old
  `make-highways.py`; several corridors were hand-fixed/added and the generator
  doesn't know them. Edit the file directly, or ask an AI to add a corridor
  (waypoints → OSRM `route/v1/driving`, `overview=simplified`, then splice into
  the `HIGHWAYS` array).
- After changing tiles/caching logic, **bump `VERSION`** in `sw.js` to invalidate
  old caches.
- To show more/fewer suggested trips, edit `SUGGESTED_TRIP_IDS` in `app.js`.
- See **[`INTEGRATION.md`](INTEGRATION.md)** for embedding this map in another
  site/app, theming it, or reusing the data.

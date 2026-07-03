# Cao Bằng Travel Map 🗺️

Mobile-first interactive travel map of Cao Bằng province for foreign visitors.
100% English UI, two seamless layers:

- **Province view** (zoomed out) — Ban Gioc, Nguom Ngao, Pac Bo, Thang Hen,
  Phia Oac, grass hills, craft villages, viewpoints… with real distances from
  Sen's Homestay and drive times.
- **City view** (zoom ≥ 12) — Sen's Homestay + all 18 restaurants & cafés from
  Sen's food guide with photos and prices, plus Sen's motorbike rental and the
  Ban Gioc bus stop. Pins reveal progressively as you zoom.

**Every place comes from Sen's own lists** (`itinerary-v2-data.js`, `food.html`,
Sen's services) — nothing generic. Category chips appear automatically only for
categories that have places.

Extra polish: the **province boundary** is drawn on the map and everything
outside Cao Bằng is gently dimmed; there is a **dark mode** (moon/sun button in
the search bar — follows the phone's setting by default, remembers the choice);
**3 map styles** via the layers button in the search bar — Streets (CARTO
Voyager / Dark Matter, follows the theme), Satellite (Esri World Imagery with
place-name overlay) and Terrain (OpenTopoMap contours) — choice is remembered;
and **three distinct pin shapes** mark the three tiers:
- **Provincial capital** (Cao Bằng City) — a large **gold star** with the city
  photo inside, the classic map symbol for a capital.
- **Iconic sites** (`photoPin: true` + `zPriority`: Angel Eye, Ban Gioc, Ba
  Quang, Pac Bo, Khau Coc Cha) — a large **teardrop map-pin** with the photo
  inside, its sharp tip on the exact spot. Always visible first.
- **Everything else** with a photo — a **round** photo pin (province a bit
  larger than city), revealed as you zoom in per `minZoom`.

Every pin carries a small category badge. `labelAbove: true` flips a pin's
label above it when labels would collide.

**Pin thumbnails:** pins load tiny 128px thumbs from
`SEN WEB OTA - main/thumbs/` (~6 KB each; cards still use the full photos).
After adding/changing photos in `data.js`, regenerate them with:
`powershell -ExecutionPolicy Bypass -File .\make-thumbs.ps1`
(if a thumb is missing the pin falls back to the full photo automatically).

## Admin tool (internal)

An owner-only panel for managing places without hand-editing `data.js`:

```
node admin/server.js        # or double-click START-ADMIN.bat on Windows
```

Then open **http://127.0.0.1:4173/admin/**. It binds to localhost only (not
reachable from the internet). Three tabs:

- **Địa điểm (Places)** — searchable/filterable table of all POIs; add, edit
  (a full form drawer with every field + a "pick coords on the map" shortcut),
  or delete. Every change is written straight into `data.js`.
- **AI chỉnh sửa (AI edit)** — the AI-assisted flow (no API key, no cost):
  describe a change in Vietnamese → it copies a ready prompt (your request +
  the current `data.js`) to the clipboard → paste into Claude/ChatGPT → paste
  the new `data.js` back → **Validate** → **Save**.
- **Bản lưu (Backups)** — every save auto-backs up the previous `data.js` to
  `admin/backups/`; restore any version with one click.

The server validates that any incoming `data.js` parses and has unique ids /
valid categories / numeric coords before writing, so a bad edit can't corrupt
the map. The admin folder is dev-only — you don't deploy it with the public map.

## Main roads (highways)

The province view draws Cao Bằng's main road corridors as bold coloured lines
(white/dark casing so they pop on any basemap):
- QL3 · City → Ban Gioc (orange)
- QL3 · City → Hanoi, south (blue)
- QL34 · City → Bao Lac, west (purple)
- City → Pac Bo, north (green)
- City → Ba Quang → Ban Gioc, scenic grass-hills route (crimson)
- Pac Bo → Khau Coc Cha, western back road (pink)
- Ban Gioc → Trung Khanh → Tra Linh → Thang Hen → Pac Bo, inland link (cyan)
- Road to Phia Oac, southwest (amber)

Toggle them on/off under the map-style (layers) button → **Main roads**. They hide automatically in the city view and in trip
mode. Geometry is precomputed from OSRM into `highways.js` (~18 KB); to change
the corridors, regenerate it (ask Claude, or adapt the `make-highways.py`
logic — waypoints per road → OSRM `route/v1/driving`, `overview=simplified`).

Trip routes are drawn thicker (6 px line + 10 px casing) so the selected
itinerary stands out from the base highways.

## Files — no build step

| File | Purpose |
|---|---|
| `index.html` | App shell + all styles (incl. dark theme) |
| `app.js` | Map logic (Leaflet 1.9) |
| `data.js` | **All places live here — edit this file** |
| `boundary.js` | Cao Bằng province outline (OSM/Nominatim GeoJSON, simplified) |
| `trips.js` | Sen's 5 suggested itineraries + real road geometry (OSRM, precomputed) |
| `SEN WEB OTA - main/` | Photo assets + guide pages (food, motorbike, bus) — **deploy together with the map** |

Open `index.html` in a browser (internet needed for map tiles/fonts), or serve
the folder with any static host. Works as-is on Netlify/GitHub Pages/Railway.
⚠️ Keep the `SEN WEB OTA - main` folder name unchanged (or update the
`ASSETS` constant at the top of `data.js`). Paths are **case-sensitive** on
Linux hosting.

## Itineraries on the map

The **Trips** button (bottom bar) lists the 5 itineraries from
`itinerary-v2-data.js` (Classic One Day … Full Circle 5D4N). Picking one draws
the real driving route (one colour per day, matching `DAY_COLORS`), numbers
every stop, hides all other pins, and shows a bottom bar with total km and a
link to the full planner page. Exit with ✕, Esc, or by tapping a filter chip.

Routes were precomputed from the public OSRM server into `trips.js` — if you
change an itinerary, regenerate the file (ask Claude, or adapt
`make-trips.py` logic: OSRM `route/v1/driving` per consecutive stop pair).

## Google Maps integration

Every place card has two Google Maps buttons:
- **Directions** — turn-by-turn from the traveller's own GPS location to the
  place, opening the native Google Maps app on phones. Uses the place's
  registered name (`mapsName`) when known so it lands on the exact business,
  otherwise the exact coordinates.
- **Google Maps** — opens the place's own Google Maps page (reviews, photos,
  opening hours). Uses the owner's real `maps.app.goo.gl` link when present.

In **trip** mode, the bottom bar's **Google Maps** button builds a full
multi-stop driving route (Sen's → each of day 1's stops → back to Sen's) that
opens in Google Maps for live navigation. The full day-by-day planner page is
linked from the top of the trips sheet.

## Editing places (`data.js`)

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
  bookUrl: "https://…",            // optional → "Book now" button
  guideUrl: ASSETS + "food.html",  // optional → guide button
  guideLabel: "Food guide",        //   its label
  phone: "0822946888",             // optional → call button
  pick: true,                      // "★ Sen's pick" badge
  veg: true,                       // "Veg-friendly" badge
  approx: true,                    // location is a best guess — please fine-tune!
  featured: true                   // star badge on the pin itself
}
```

### Data sources

Coordinates, photos, food descriptions and prices come from the Sen Web OTA
site (`itinerary-v2-data.js`, `food.html`) — all Google Maps short links were
resolved to exact coordinates. **Sen's Homestay: 22.67379, 106.25561.**

### ⚠️ Still approximate (fine-tune when convenient)

Only the 5 province spots whose entries in `itinerary-v2-data.js` have no maps
link: **Phia Thap, Dia Tren, Quay Son swim, Pi Pha, Pac Nga** (estimated from
your illustrated itinerary map).

Fix in seconds: open `index.html?edit` → tap the real spot → coordinates are
copied to clipboard → paste into `data.js`, remove `approx: true`.

### Known data issue

In `food.html` the maps link for the *morning* Phở Vịt Quay duplicates the
Phở Chua Quyên link, so the morning duck-pho spot is not on the map yet. Add
it once you have the correct link/coordinates.

## Credits

Map tiles © OpenStreetMap contributors, © CARTO. Photos © Sen's Homestay.

## Ideas for later

- Draw the classic road-trip routes (Ban Gioc loop, Pac Bo, Phia Oac) as polylines
- "Open now" hours per place, VI/EN language toggle
- PWA manifest for offline tile caching

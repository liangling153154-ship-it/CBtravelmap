# Cao Bằng Travel Map 🗺️

Mobile-first interactive travel map of Cao Bằng province for foreign visitors.
100% English UI, two seamless layers:

- **Province view** (zoomed out) — Ban Gioc, Nguom Ngao, Pac Bo, Thang Hen,
  Phia Oac, ethnic villages, road-trip lunch stops, with distance/drive-time info.
- **City view** (zoom in ≥ 12) — stay, food & cafés, nightlife, shopping,
  services, health, transport in Cao Bằng city. Pins reveal progressively as
  you zoom, so the map never clutters.

## Files — no build step

| File | Purpose |
|---|---|
| `index.html` | App shell + all styles |
| `app.js` | Map logic (Leaflet 1.9) |
| `data.js` | **All places live here — edit this file** |

Open `index.html` in a browser (internet needed for map tiles/fonts), or serve
the folder with any static host. Works as-is on Netlify/GitHub Pages/Railway.

## Editing places (`data.js`)

Each entry looks like:

```js
{
  id: "sens-homestay",            // unique slug
  name: "Sen's Homestay",         // English name
  localName: "Sen Nghỉ Giờ",      // Vietnamese (shown small, useful for taxis)
  category: "stay",               // sights | culture | stay | food | nightlife
                                  // | shopping | services | health | transport
  tier: "city",                   // "province" or "city" (city shows at zoom ≥ 12)
  lat: 22.6663, lng: 106.2568,
  desc: "1–2 line description",
  distance: "85 km east · ~2 h",  // optional, province tier
  img: "https://…jpg",            // optional photo (falls back to styled header)
  bookUrl: "https://…",           // optional → "Book now" button
  phone: "0822946888",            // optional → call button
  approx: true,                   // location is a best guess — please fine-tune!
  minZoom: 11,                    // optional — hide pin below this zoom
  featured: true                  // star badge + highlight
}
```

### ⚠️ Fixing approximate locations

Entries marked `approx: true` (all city POIs + several province ones) are placed
by best estimate and **should be nudged to their real spots** — you know the
city, it takes seconds:

1. Open the map as `index.html?edit`
2. Tap the real location on the map → exact `lat, lng` is copied to your clipboard
3. Paste into the entry in `data.js`, remove `approx: true`

**Sen's Homestay is currently pinned at the city centre — set its real
coordinates first.** Its "Book now" button already links to
`https://sen-nghi-gio-production.up.railway.app/book`.

## Credits

Map tiles © OpenStreetMap contributors, © CARTO. Landmark photos from
Wikimedia Commons (hot-linked thumbnails; replace with your own photos in
`data.js` whenever you like).

## Ideas for later

- Draw the 3 classic road-trip routes (Ban Gioc loop, Pac Bo, Phia Oac) as polylines
- Real photos for city spots (own uploads instead of hotlinks)
- "Open now" hours per place, VI/EN language toggle
- PWA manifest for offline tiles caching

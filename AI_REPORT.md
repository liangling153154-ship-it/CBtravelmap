# AI Report: Cao Bang Travel Map Updates & Investigation

This report documents the changes made to the map highlights and explains the map zoom visibility logic for future reference.

---

## 🛠️ Changes Implemented

We updated the coordinates and metadata in `highways.js` based on OSRM driving routes:

1. **Pink Road (`pacbo-khaucoc` - Pac Bo ↔ Khau Coc Cha)**:
   - **Issue:** The original geometry contained back-and-forth backtracking loops, making the line look incorrect.
   - **Fix:** Replaced with a clean, single-path routing. Distance reduced to **60 km** (127 points).

2. **Green Road (`pacbo-road` - City ↔ Pac Bo)**:
   - **Issue:** Had an extra detour segment near Nước Hai that stuck out unnecessarily.
   - **Fix:** Rerouted to go directly along the main road to Pác Bó. Distance is **51 km** (29 points).

3. **Red Road (`baquang-bangioc` - City ↔ Ba Quang ↔ Ban Gioc)**:
   - **Issue:** Needed to connect to Thang Hen Lake and Angel Eye Mountain, and route through Lý Quốc (along the border) instead of joining the highway at Thoong Got.
   - **Fix:** Rerouted via: `City` -> `Thang Hen Lake` -> `Angel Eye Mountain` -> `Ba Quang` -> `Lý Quốc` -> `Ban Giốc` (along the border road). Distance updated to **151 km** (130 points).
   - **Metadata:** Updated name property to `"City → Thang Hen → Angel Eye → Ba Quang → Ly Quoc → Ban Gioc"`.

4. **New Route (`khaucoc-hagiang` - Khau Coc Cha ↔ Ha Giang (Meo Vac))**:
   - **New Route Added:** Connected Khau Cốc Chà Pass to Mèo Vạc in Hà Giang province to support the popular loop extension. Distance is **91 km** (105 points, fuchsia color `"#D946EF"`).

5. **Scenic Route (`bangioc-pipha-trungkhanh` - Ban Gioc ↔ Pi Pha ↔ Pac Nga ↔ Trung Khanh)**:
   - **New Route Added:** Connected Ban Gioc area to Pi Pha Viewpoint, Pac Nga Hanging Bridge, and returned to Trung Khanh town center. Distance is **39 km** (58 points, teal color `"#14B8A6"`).

---

## 🔍 Investigation: Why do Main Roads disappear when zooming in?

### Code Analysis
The visibility logic is defined in **[app.js](file:///c:/Users/Administrator/Desktop/PROJECT/CAO%20BANG%20SUPER%20MAP/app.js#L235-L266)** inside the `refresh()` function:

1. **Zoom Threshold:**
   ```javascript
   var cityVisible = zoom >= MAP_CONFIG.cityThreshold;
   ```
   - `MAP_CONFIG.cityThreshold` is defined as `12` in **[data.js](file:///c:/Users/Administrator/Desktop/PROJECT/CAO%20BANG%20SUPER%20MAP/data.js#L57)**.
   - Therefore, when zoom level is `12` or higher, `cityVisible` is `true`.

2. **Highways Visibility Condition:**
   ```javascript
   // highways: show in province view only (hidden inside the city & in trip mode)
   var wantHw = highwaysToggle && !cityVisible && !activeTrip;
   ```
   - When zooming in (zoom >= 12), `cityVisible` becomes `true`, making `wantHw` evaluate to `false`.
   - Consequently, Leaflet removes the `highwayLayer` from the map:
   ```javascript
   if (wantHw && !highwaysOn2) { highwayLayer.addTo(map); highwaysOn2 = true; }
   else if (!wantHw && highwaysOn2) { map.removeLayer(highwayLayer); highwaysOn2 = false; }
   ```

### Original Behavior (Bug)
- **Highways disappeared entirely** when zoom >= 12 (City View), because `!cityVisible` was a hard requirement.

### Fix Applied (app.js lines 118–127 and 257–270)
1. Added a `highwayLines` array to track the coloured polyline objects (alongside the existing `highwayCasings` array).
2. Changed the visibility condition from:
   ```javascript
   var wantHw = highwaysToggle && !cityVisible && !activeTrip;  // OLD — hides at zoom >= 12
   ```
   to:
   ```javascript
   var wantHw = highwaysToggle && !activeTrip;  // NEW — only hides in trip mode
   ```
3. Added dynamic style adjustment in `refresh()`:
   ```javascript
   if (highwaysOn2) {
     var hwFaded = cityVisible;
     var casingW = hwFaded ? 4 : 8;       // thinner casing in city view
     var casingO = hwFaded ? 0.25 : 0.9;   // nearly transparent casing
     var lineW   = hwFaded ? 2.5 : 4.5;    // thinner coloured line
     var lineO   = hwFaded ? 0.4 : 0.95;   // semi-transparent coloured line
     highwayCasings.forEach(function (c) { c.setStyle({ weight: casingW, opacity: casingO }); });
     highwayLines.forEach(function (l) { l.setStyle({ weight: lineW, opacity: lineO }); });
   }
   ```

### Result
- **Province view (zoom < 12):** Bold, fully opaque highway lines (unchanged).
- **City view (zoom >= 12):** Highways remain visible but are thinner (2.5px vs 4.5px) and semi-transparent (40% opacity vs 95%), providing geographic context without cluttering the city-level detail.
- **Trip mode:** Highways are still fully hidden to avoid confusion with itinerary route lines.

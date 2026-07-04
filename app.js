/* =====================================================================
   CAO BANG TRAVEL MAP — APP LOGIC
   Plain JS + Leaflet, no build step. Data lives in data.js.
   ===================================================================== */
(function () {
  "use strict";

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EDIT_MODE = new URLSearchParams(location.search).has("edit");

  /* ---------------- Inline SVG icons ---------------- */
  var PATHS = {
    mountain: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
    landmark: '<line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7 12 2"/>',
    bed: '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
    food: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z"/><path d="M21 15v7"/>',
    wine: '<path d="M8 22h8"/><path d="M12 15v7"/><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"/>',
    bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    health: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z"/>',
    bus: '<rect x="4" y="3" width="16" height="13" rx="2"/><path d="M4 9h16"/><circle cx="8" cy="19" r="1.6"/><circle cx="16" cy="19" r="1.6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    nav: '<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.81.37 1.6.72 2.33a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.75-1.29a2 2 0 0 1 2.11-.45c.73.35 1.52.6 2.33.72A2 2 0 0 1 22 16.92z"/>',
    book: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="m9 15.5 2 2 4-4"/>',
    all: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    city: '<rect x="4" y="8" width="16" height="13" rx="1"/><path d="M9 21v-4h6v4"/><path d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M16 16h.01"/><path d="M8 8V4h8v4"/>',
    route: '<circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M12 19h4.5a3.5 3.5 0 0 0 0-7h-9a3.5 3.5 0 0 1 0-7H12"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    home: '<path d="m3 10.5 9-7.5 9 7.5"/><path d="M5 10v11h14V10"/>',
    map: '<path d="m9 3-6 2v16l6-2 6 2 6-2V3l-6 2-6-2z"/><path d="M9 3v16"/><path d="M15 5v16"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18"/><path d="M12 3a15 15 0 0 0 0 18"/>',
    gmaps: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    locate: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    arrow: '<path d="M9 18l6-6-6-6"/>',
    compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'
  };
  function svg(name, extra) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' +
      (extra ? " " + extra : "") + ">" + PATHS[name] + "</svg>";
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFD")
      .replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/['’]/g, "");
  }

  /* ---------------- Map ---------------- */
  var map = L.map("map", {
    zoomControl: false,
    attributionControl: true,
    maxBounds: MAP_CONFIG.maxBounds,
    maxBoundsViscosity: 0.8,
    minZoom: 8,
    maxZoom: 18,
    zoomSnap: 0.5
  });
  L.control.zoom({ position: "bottomright" }).addTo(map);

  var tileOpts = {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a> · photos &copy; Sen&#39;s Homestay',
    subdomains: "abcd",
    maxZoom: 19,
    // smoother mobile panning: load a wide ring of tiles beyond the viewport,
    // start loading mid-pan instead of waiting for the gesture to end,
    // and request tiles in CORS mode so the service worker can cache them
    keepBuffer: 4,
    updateWhenIdle: false,
    crossOrigin: true
  };
  var lightTiles = L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", tileOpts);
  var darkTiles = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", tileOpts);
  var satTiles = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: 'Imagery &copy; Esri, Maxar, Earthstar Geographics · photos &copy; Sen&#39;s Homestay',
    maxZoom: 19,
    maxNativeZoom: 18,
    keepBuffer: 4,
    updateWhenIdle: false,
    crossOrigin: true
  });
  var satLabels = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png", {
    subdomains: "abcd",
    maxZoom: 19,
    keepBuffer: 4,
    updateWhenIdle: false,
    crossOrigin: true
  });
  var topoTiles = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>, SRTM · &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA) · photos &copy; Sen&#39;s Homestay',
    maxZoom: 19,
    maxNativeZoom: 17,
    keepBuffer: 4,
    updateWhenIdle: false,
    crossOrigin: true
  });
  var ALL_BASE_LAYERS = [lightTiles, darkTiles, satTiles, satLabels, topoTiles];

  /* ---------------- Province boundary + dim everything outside ---------------- */
  function ringToLatLngs(ring) {
    return ring.map(function (c) { return [c[1], c[0]]; });
  }
  // outer ring of each polygon (Polygon or MultiPolygon)
  var provinceRings = (CAO_BANG_BOUNDARY.type === "Polygon"
    ? [CAO_BANG_BOUNDARY.coordinates]
    : CAO_BANG_BOUNDARY.coordinates
  ).map(function (poly) { return ringToLatLngs(poly[0]); });

  // world-sized polygon with the province cut out = dimmed "outside"
  var worldRing = [[-85, -180], [-85, 180], [85, 180], [85, -180]];
  var outsideMask = L.polygon([worldRing].concat(provinceRings), {
    stroke: false,
    fillColor: "#0B2530",
    fillOpacity: 0.46,
    interactive: false
  }).addTo(map);
  var boundaryLine = L.polygon(provinceRings, {
    fill: false,
    color: "#0E7490",
    weight: 3,
    opacity: 0.95,
    interactive: false
  }).addTo(map);

  /* ---------------- Main road corridors (highways) ---------------- */
  // Drawn as bold coloured lines (white casing underneath) so the main routes
  // pop on any basemap. Toggleable, and auto-hidden in city / trip views.
  var highwayLayer = L.layerGroup();
  var highwayCasings = [];
  var highwayLines = [];
  if (typeof HIGHWAYS !== "undefined") {
    HIGHWAYS.forEach(function (hw) {
      var casing = L.polyline(hw.line, { color: "#FFFFFF", weight: 8, opacity: 0.9, lineJoin: "round", lineCap: "round", interactive: false });
      highwayCasings.push(casing);
      highwayLayer.addLayer(casing);
      var line = L.polyline(hw.line, { color: hw.color, weight: 4.5, opacity: 0.95, lineJoin: "round", lineCap: "round", interactive: false });
      highwayLines.push(line);
      highwayLayer.addLayer(line);
    });
  }
  var highwaysToggle = true;   // user on/off preference
  var highwaysOn2 = false;     // whether the layer is currently on the map
  try { highwaysToggle = localStorage.getItem("cbmap-highways") !== "off"; } catch (e) { /* private mode */ }

  /* ---------------- District towns (orientation labels) ---------------- */
  // Small non-clicking markers (dot + name) that help visitors read where they
  // are on the province map. Shown only at province zoom, hidden in city / trip.
  var townLayer = L.layerGroup();
  var townsOn = false;
  // cluster-of-three-houses image marking a township / district seat
  var TOWN_IMG = '<img class="town-glyph" src="' + esc(ASSETS + "images/icons/town.png") + '" alt="" loading="lazy">';
  if (typeof TOWNS !== "undefined") {
    TOWNS.forEach(function (t) {
      var icon = L.divIcon({
        className: "town-marker",
        html: TOWN_IMG + '<span class="town-name">' + esc(t.name) + "</span>",
        iconSize: null,
        iconAnchor: [19, 12]   // anchor near the centre of the house cluster
      });
      L.marker([t.lat, t.lng], { icon: icon, interactive: false, keyboard: false, zIndexOffset: -500 }).addTo(townLayer);
    });
  }

  var provinceBounds = L.latLngBounds(POIS.filter(function (p) { return p.tier === "province"; })
    .map(function (p) { return [p.lat, p.lng]; })).pad(0.12);
  map.fitBounds(provinceBounds);

  /* ---------------- Markers ---------------- */
  var records = [];       // { poi, cat, marker, onMap }
  var activeCat = "all";
  var selected = null;

  /* pins use tiny generated thumbnails (make-thumbs.ps1); fall back to the full photo */
  function pinSrc(img) {
    return img.indexOf(ASSETS) === 0 ? ASSETS + "thumbs/" + img.slice(ASSETS.length) : img;
  }
  function pinImgTag(img) {
    return '<img src="' + esc(pinSrc(img)) + '" alt="" loading="lazy" ' +
      'onerror="this.onerror=null;this.src=\'' + esc(img) + '\'">';
  }

  function makeIcon(poi, cat) {
    var isProv = poi.tier === "province";
    var labelCls = isProv ? "pin-label" : "pin-label city-label";
    if (poi.labelAbove) { labelCls += " label-above"; }
    var label = '<span class="' + labelCls + '">' + esc(poi.name) + "</span>";

    if (poi.photoPin && poi.img) {
      // ICONIC sites: a teardrop map-pin with the photo inside — a distinct
      // shape (not a plain circle) whose sharp tip marks the exact spot.
      return L.divIcon({
        className: "poi-wrap teardrop-wrap",
        html: '<span class="iconic-ping" style="--c:' + cat.color + '"></span>' +
          '<div class="teardrop" style="--c:' + cat.color + '">' +
          '<div class="teardrop-photo">' + pinImgTag(poi.img) + "</div>" +
          '<span class="cat-badge">' + svg(cat.icon) + "</span></div>" + label,
        iconSize: [54, 70],
        iconAnchor: [27, 66] // the tip touches the coordinate
      });
    }

    if (poi.img) {
      // secondary places: round photo pin (province a bit larger than city)
      var size = isProv ? 42 : 38;
      var sizeCls = isProv ? " photo-md" : " photo-sm";
      var wrapCls = "poi-wrap photo-wrap" + (isProv ? " photo-md-wrap" : " photo-sm-wrap");
      return L.divIcon({
        className: wrapCls,
        html: '<div class="photo-pin' + sizeCls + (poi.featured ? " pin-featured" : "") +
          '" style="--c:' + cat.color + '">' + pinImgTag(poi.img) +
          '<span class="cat-badge">' + svg(cat.icon) + "</span></div>" + label,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      });
    }

    var s = isProv ? 38 : 30;
    var html =
      '<div class="pin' + (isProv ? " pin-lg" : "") + (poi.featured ? " pin-featured" : "") +
      '" style="--c:' + cat.color + '">' + svg(cat.icon) + "</div>" + label;
    return L.divIcon({ className: "poi-wrap", html: html, iconSize: [s, s], iconAnchor: [s / 2, s / 2] });
  }

  POIS.forEach(function (poi) {
    var cat = CATEGORIES[poi.category];
    if (!cat) { return; }
    var marker = L.marker([poi.lat, poi.lng], {
      icon: makeIcon(poi, cat),
      keyboard: true,
      alt: poi.name
    });
    if (poi.zPriority) { marker.setZIndexOffset(poi.zPriority); } // hero pins win overlaps
    var rec = { poi: poi, cat: cat, marker: marker, onMap: false };
    marker.on("click", function () { selectPoi(rec, false); });
    records.push(rec);
  });

  /* City gateway — the provincial capital: a round photo of the city with a
     distinct GOLD ring + star badge (marks the capital), shown while zoomed out. */
  var gateway = L.marker(MAP_CONFIG.cityCenter, {
    icon: L.divIcon({
      className: "poi-wrap capital-wrap",
      html: '<div class="capital-pin">' +
        '<div class="capital-pin-photo">' + pinImgTag(MAP_CONFIG.cityPinImg) + "</div>" +
        '<span class="capital-badge">★</span></div>' +
        '<span class="pin-label capital-label">Cao Bằng City</span>',
      iconSize: [72, 72],
      iconAnchor: [36, 36]
    }),
    zIndexOffset: 900,
    alt: "Cao Bang City, provincial capital — tap to explore food, coffee and stay"
  }).on("click", function () { goCity(); });
  var gatewayOn = false;

  function flyTo(latlng, zoom) {
    if (REDUCED) { map.setView(latlng, zoom); }
    else { map.flyTo(latlng, zoom, { duration: 0.9 }); }
  }

  /* Center a point in the visible area above the bottom card */
  function flyToPoi(poi) {
    var zoom = poi.tier === "city"
      ? Math.max(16, (poi.minZoom || 0) + 1)
      : Math.max(13, (poi.minZoom || 0) + 1);
    var pt = map.project([poi.lat, poi.lng], zoom);
    var lift = window.innerWidth < 768 ? Math.min(130, window.innerHeight * 0.16) : 0;
    flyTo(map.unproject(pt.add([0, lift]), zoom), zoom);
  }

  /* ---------------- Visibility engine ---------------- */
  function refresh() {
    var zoom = map.getZoom();
    var cityVisible = zoom >= MAP_CONFIG.cityThreshold;

    records.forEach(function (r) {
      var ok;
      if (activeTrip) {
        // trip mode: show exactly the itinerary's stops, nothing else
        ok = !!activeTrip._set[r.poi.id];
      } else {
        ok = (activeCat === "all" || r.poi.category === activeCat) &&
          (r.poi.tier === "province" || cityVisible) &&
          zoom >= (r.poi.minZoom || 0);
      }
      if (ok && !r.onMap) { r.marker.addTo(map); r.onMap = true; applyActiveClass(r); }
      else if (!ok && r.onMap) { map.removeLayer(r.marker); r.onMap = false; }
    });

    var wantGateway = !cityVisible && !activeTrip;
    if (wantGateway && !gatewayOn) { gateway.addTo(map); gatewayOn = true; }
    else if (!wantGateway && gatewayOn) { map.removeLayer(gateway); gatewayOn = false; }

    // district town labels: shown at every zoom (orientation), hidden in trip
    var wantTowns = !activeTrip;
    if (wantTowns && !townsOn) { townLayer.addTo(map); townsOn = true; }
    else if (!wantTowns && townsOn) { map.removeLayer(townLayer); townsOn = false; }

    // highways: always visible when toggled on (except in trip mode),
    // but fade to subtle lines when zoomed into the city view
    var wantHw = highwaysToggle && !activeTrip;
    if (wantHw && !highwaysOn2) { highwayLayer.addTo(map); highwaysOn2 = true; }
    else if (!wantHw && highwaysOn2) { map.removeLayer(highwayLayer); highwaysOn2 = false; }
    if (highwaysOn2) {
      var hwFaded = cityVisible;
      var casingW = hwFaded ? 4 : 8;
      var casingO = hwFaded ? 0.25 : 0.9;
      var lineW   = hwFaded ? 2.5 : 4.5;
      var lineO   = hwFaded ? 0.4 : 0.95;
      highwayCasings.forEach(function (c) { c.setStyle({ weight: casingW, opacity: casingO }); });
      highwayLines.forEach(function (l) { l.setStyle({ weight: lineW, opacity: lineO }); });
    }

    document.body.classList.toggle("zl-mid", zoom >= MAP_CONFIG.cityThreshold && zoom < 15);
    document.body.classList.toggle("zl-max", zoom >= 17);
    // town-house icons: small on the wide province view (avoid overlap),
    // grow as you zoom into a district
    document.body.classList.toggle("tz-wide", zoom <= 9);   // whole-province overview
    document.body.classList.toggle("tz-near", zoom >= 12);  // zoomed into an area
  }
  map.on("zoomend", refresh);
  map.on("moveend", refresh);   // also fires after initial fitBounds → town zoom classes set from the start

  /* ---------------- Category chips ---------------- */
  var chipsEl = document.getElementById("chips");
  function buildChips() {
    var used = {};
    POIS.forEach(function (p) { used[p.category] = true; });
    var html = '<button class="chip" data-cat="all" aria-pressed="true">' + svg("all") + "All</button>";
    Object.keys(CATEGORIES).forEach(function (key) {
      if (!used[key]) { return; } // no places in this category — no chip
      var c = CATEGORIES[key];
      html += '<button class="chip" data-cat="' + key + '" aria-pressed="false" style="--chip-c:' + c.color + '">' +
        svg(c.icon) + esc(c.label) + "</button>";
    });
    chipsEl.innerHTML = html;
    chipsEl.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) { return; }
      exitTrip(); // filtering leaves itinerary mode
      activeCat = btn.dataset.cat;
      chipsEl.querySelectorAll(".chip").forEach(function (ch) {
        ch.setAttribute("aria-pressed", ch === btn ? "true" : "false");
      });
      if (selected && activeCat !== "all" && selected.poi.category !== activeCat) { closeCard(); }
      refresh();
    });
  }

  /* ---------------- Detail card ---------------- */
  var card = document.getElementById("card");
  var cardMedia = document.getElementById("card-media");
  var cardTitle = document.getElementById("card-title");
  var cardLocal = document.getElementById("card-local");
  var cardDesc = document.getElementById("card-desc");
  var cardDist = document.getElementById("card-dist");
  var cardActions = document.getElementById("card-actions");

  /* ---------------- Google Maps deep links ---------------- */
  // Build the best possible Google Maps URLs for a place:
  //   .directions — turn-by-turn from the user's current location to this place,
  //                 using the registered place name when we have it (so it lands
  //                 on the exact business, not a bare pin), else exact coords.
  //   .place      — the place's own Google Maps page (reviews / photos / hours),
  //                 the owner's original short link when present.
  // ?api=1 URLs are the documented cross-platform form: on phones they open the
  // native Google Maps app, on desktop the website.
  function gmapsLinks(poi) {
    var coords = poi.lat + "," + poi.lng;
    var dest, directions, place;
    if (poi.mapsName) {
      dest = encodeURIComponent(poi.mapsName + ", Cao Bằng, Vietnam");
      // pass coords too so it can't mis-resolve a same-named place elsewhere
      directions = "https://www.google.com/maps/dir/?api=1&destination=" + dest +
        "&destination_ll=" + coords + "&travelmode=driving";
    } else {
      directions = "https://www.google.com/maps/dir/?api=1&destination=" + coords + "&travelmode=driving";
    }
    if (poi.maps) {
      place = poi.maps; // owner's real place link (best: has reviews/photos)
    } else if (poi.mapsName) {
      place = "https://www.google.com/maps/search/?api=1&query=" + dest;
    } else {
      place = "https://www.google.com/maps/search/?api=1&query=" + coords;
    }
    return { directions: directions, place: place };
  }

  function applyActiveClass(rec) {
    var el = rec.marker.getElement();
    if (!el) { return; }
    var pin = el.querySelector(".pin, .photo-pin, .teardrop");
    if (pin) { pin.classList.toggle("pin-active", selected === rec); }
    rec.marker.setZIndexOffset(selected === rec ? 1000 : (rec.poi.zPriority || 0));
  }

  function selectPoi(rec, fly) {
    var prev = selected;
    selected = rec;
    if (prev) { applyActiveClass(prev); }
    applyActiveClass(rec);

    var poi = rec.poi, cat = rec.cat;

    var media = "";
    if (poi.img) {
      media = '<img src="' + esc(poi.img) + '" alt="' + esc(poi.name) + '" loading="lazy">';
    }
    media += '<div class="fallback" style="--c:' + cat.color + '"' + (poi.img ? ' hidden' : "") + ">" + svg(cat.icon) + "</div>";
    media += '<button class="card-close" id="card-close" aria-label="Close">' + svg("close") + "</button>";
    media += '<div class="card-tags" style="--c:' + cat.color + '"><span class="tag"><span class="swatch"></span>' + esc(cat.label) + "</span>" +
      (poi.pick ? '<span class="tag tag-pick">★ Sen&#39;s pick</span>' : "") +
      (poi.veg ? '<span class="tag tag-veg">Veg-friendly</span>' : "") +
      (poi.approx ? '<span class="tag">≈ approx. spot</span>' : "") + "</div>";
    cardMedia.innerHTML = media;
    var img = cardMedia.querySelector("img");
    if (img) {
      img.addEventListener("error", function () {
        img.remove();
        cardMedia.querySelector(".fallback").hidden = false;
      });
    }
    document.getElementById("card-close").addEventListener("click", closeCard);

    cardTitle.textContent = poi.name;
    cardLocal.textContent = poi.localName || "";
    cardLocal.style.display = (poi.localName && poi.localName !== poi.name) ? "" : "none";
    cardDesc.textContent = poi.desc;
    var meta = [];
    if (poi.distance) { meta.push(esc(poi.distance)); }
    if (poi.price) { meta.push(esc(poi.price)); }
    cardDist.innerHTML = meta.length ? svg("route") + meta.join(" · ") : "";
    cardDist.style.display = meta.length ? "" : "none";

    // Sen's Homestay — the host behind this map. Show a friendly promo block that
    // pitches it as the one-stop, most-welcoming base for the whole trip.
    var promo = document.getElementById("card-promo");
    var isHost = poi.id === "sens-homestay";
    if (isHost) {
      promo.innerHTML =
        '<div class="promo-head">' + svg("star") + 'Your friendly local host</div>' +
        '<p class="promo-text">This map is made by <strong>Sen’s Homestay</strong> — your one place in Cao Bằng for everything: ' +
        'cosy rooms, motorbike rental, tours, bus tickets and honest local tips. Stay with us and we’ll help you plan the whole trip.</p>';
      promo.hidden = false;
    } else {
      promo.hidden = true;
      promo.innerHTML = "";
    }

    var links = gmapsLinks(poi);
    var actions = "";
    // For Sen's, promote booking: make "Book your stay" the primary action (top,
    // full-width) so the map funnels travellers to the host behind it.
    if (isHost && poi.bookUrl) {
      actions += '<a class="btn btn-primary" href="' + esc(poi.bookUrl) + '" target="_blank" rel="noopener">' + svg("book") + "Book your stay</a>";
    }
    // primary (or secondary for the host): turn-by-turn directions in Google Maps
    actions += '<a class="btn ' + (isHost ? "btn-secondary" : "btn-primary") + '" href="' + esc(links.directions) +
      '" target="_blank" rel="noopener">' + svg("nav") + "Directions</a>";
    // secondary: open the real Google Maps place page (reviews, photos, hours)
    actions += '<a class="btn btn-secondary" href="' + esc(links.place) +
      '" target="_blank" rel="noopener">' + svg("gmaps") + "Google Maps</a>";
    if (poi.bookUrl && !isHost) {
      actions += '<a class="btn btn-secondary" href="' + esc(poi.bookUrl) + '" target="_blank" rel="noopener">' + svg("book") + "Book now</a>";
    }
    if (poi.guideUrl) {
      actions += '<a class="btn btn-secondary" href="' + esc(poi.guideUrl) + '" target="_blank" rel="noopener">' + svg("book") + esc(poi.guideLabel || "Guide") + "</a>";
    }
    if (poi.phone) {
      actions += '<a class="btn btn-secondary btn-icon" href="tel:' + esc(poi.phone) + '" aria-label="Call ' + esc(poi.name) + '">' + svg("phone") + "</a>";
    }
    cardActions.innerHTML = actions;

    card.classList.add("open");
    document.body.classList.add("card-open");
    if (fly) { flyToPoi(poi); }
  }

  function closeCard() {
    card.classList.remove("open");
    document.body.classList.remove("card-open");
    var prev = selected;
    selected = null;
    if (prev) { applyActiveClass(prev); }
  }

  /* ---------------- Search ---------------- */
  var searchCard = document.getElementById("search-card");
  var input = document.getElementById("search-input");
  var clearBtn = document.getElementById("search-clear");
  var resultsEl = document.getElementById("results");

  var index = records.map(function (r) {
    return { rec: r, text: norm(r.poi.name + " " + (r.poi.localName || "") + " " + r.cat.label + " " + r.poi.desc) };
  });

  function renderResults(q) {
    var query = norm(q.trim());
    if (!query) {
      resultsEl.classList.remove("has-items");
      resultsEl.innerHTML = "";
      return;
    }
    var words = query.split(/\s+/).filter(Boolean);
    var hits = index.filter(function (item) {
      return words.every(function (w) { return item.text.indexOf(w) !== -1; });
    }).slice(0, 8);
    var html = "";
    if (!hits.length) {
      html = '<div class="result none">No places found — try "waterfall", "coffee", "ATM"…</div>';
    } else {
      hits.forEach(function (item) {
        var p = item.rec.poi, c = item.rec.cat;
        html += '<button class="result" data-id="' + p.id + '" role="option">' +
          '<span class="dot" style="background:' + c.color + '">' + svg(c.icon) + "</span>" +
          '<span><span class="t">' + esc(p.name) + '</span><br><span class="s">' +
          esc(c.label) + " · " + (p.tier === "city" ? "Cao Bằng City" : "Province") + "</span></span></button>";
      });
    }
    resultsEl.innerHTML = html;
    resultsEl.classList.add("has-items");
  }

  var debounce;
  input.addEventListener("input", function () {
    searchCard.classList.toggle("search-open", input.value.length > 0);
    clearTimeout(debounce);
    debounce = setTimeout(function () { renderResults(input.value); }, 120);
  });
  input.addEventListener("focus", function () {
    if (input.value) { searchCard.classList.add("search-open"); renderResults(input.value); }
  });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      var first = resultsEl.querySelector(".result[data-id]");
      if (first) { first.click(); }
    } else if (e.key === "Escape") { clearSearch(); input.blur(); }
  });
  resultsEl.addEventListener("click", function (e) {
    var btn = e.target.closest(".result[data-id]");
    if (!btn) { return; }
    var rec = records.find(function (r) { return r.poi.id === btn.dataset.id; });
    if (!rec) { return; }
    clearSearch();
    input.blur(); // hide mobile keyboard
    if (activeTrip && !activeTrip._set[rec.poi.id]) { exitTrip(); }
    if (activeCat !== "all" && rec.poi.category !== activeCat) {
      activeCat = "all";
      chipsEl.querySelectorAll(".chip").forEach(function (ch) {
        ch.setAttribute("aria-pressed", ch.dataset.cat === "all" ? "true" : "false");
      });
    }
    selectPoi(rec, true);
    setTimeout(refresh, 0);
  });
  function clearSearch() {
    input.value = "";
    searchCard.classList.remove("search-open");
    resultsEl.classList.remove("has-items");
    resultsEl.innerHTML = "";
  }
  clearBtn.addEventListener("click", function () { clearSearch(); input.focus(); });

  /* ---------------- View helpers ---------------- */
  function goCity() {
    flyTo(MAP_CONFIG.cityCenter, MAP_CONFIG.cityZoom);
  }

  /* ---------------- Suggested itineraries (trips) ---------------- */
  var tripsSheet = document.getElementById("trips-sheet");
  var tripsList = document.getElementById("trips-list");
  var tripBar = document.getElementById("trip-bar");
  var tripTitle = document.getElementById("trip-title");
  var tripMeta = document.getElementById("trip-meta");
  var tripDaysEl = document.getElementById("trip-days");
  var tripPlanner = document.getElementById("trip-planner");
  var activeTrip = null;
  var tripLayer = null;
  var tripCasings = [];

  document.getElementById("trips-planner-link").href = ASSETS + "itinerary-v2/itinerary-v2.html";
  document.getElementById("trips-close").innerHTML = svg("close");
  document.getElementById("trip-close").innerHTML = svg("close");

  // Only these three itineraries are offered under "Suggested itineraries".
  var SUGGESTED_TRIP_IDS = ["1d-highlights", "2d-east-loop", "3d-nature-history"];
  var SUGGESTED_TRIPS = TRIPS.filter(function (t) { return SUGGESTED_TRIP_IDS.indexOf(t.id) !== -1; });

  function buildTripsSheet() {
    var html = "";
    SUGGESTED_TRIPS.forEach(function (t) {
      html += '<button class="trip-card" data-trip="' + t.id + '">' +
        '<img src="' + esc(pinSrc(t.cover)) + '" alt="" loading="lazy">' +
        '<span class="trip-card-body"><span class="trip-card-title">' + esc(t.title) + "</span>" +
        '<span class="trip-card-sub">' + esc(t.subtitle) + "</span>" +
        '<span class="trip-card-meta">' + t.days + (t.days > 1 ? " days" : " day") +
        " · ~" + t.km + " km · " + esc(t.pace) + "</span></span></button>";
    });
    tripsList.innerHTML = html;
  }
  function openTripsSheet() { tripsSheet.hidden = false; }
  function closeTripsSheet() { tripsSheet.hidden = true; }
  document.getElementById("trips-close").addEventListener("click", closeTripsSheet);
  tripsSheet.addEventListener("click", function (e) {
    if (e.target === tripsSheet) { closeTripsSheet(); }
  });
  tripsList.addEventListener("click", function (e) {
    var btn = e.target.closest(".trip-card");
    if (!btn) { return; }
    var trip = TRIPS.find(function (t) { return t.id === btn.dataset.trip; });
    closeTripsSheet();
    if (trip) { activateTrip(trip); }
  });

  function activateTrip(trip) {
    exitTrip();
    closeCard();
    clearSearch();
    activeTrip = trip;
    if (!trip._set) {
      trip._set = { "sens-homestay": true }; // route always starts at Sen's
      trip.stopsByDay.forEach(function (day) {
        day.forEach(function (id) { trip._set[id] = true; });
      });
    }

    var dark = document.body.classList.contains("dark");
    tripLayer = L.layerGroup();
    tripCasings = [];
    var allPts = [];

    trip.segsByDay.forEach(function (segs, di) {
      var color = DAY_COLORS[di % DAY_COLORS.length];
      segs.forEach(function (line) {
        allPts = allPts.concat(line);
        var casing = L.polyline(line, { color: dark ? "#0B1519" : "#FFFFFF", weight: 10, opacity: 0.95, lineJoin: "round", lineCap: "round", interactive: false });
        tripCasings.push(casing);
        tripLayer.addLayer(casing);
        tripLayer.addLayer(L.polyline(line, { color: color, weight: 6, opacity: 1, lineJoin: "round", lineCap: "round", interactive: false }));
      });
    });

    var n = 0;
    trip.stopsByDay.forEach(function (day, di) {
      var color = DAY_COLORS[di % DAY_COLORS.length];
      day.forEach(function (id) {
        var rec = records.find(function (r) { return r.poi.id === id; });
        if (!rec) { return; }
        var isHome = id === "sens-homestay";
        if (!isHome) { n++; }
        var badge = L.marker([rec.poi.lat, rec.poi.lng], {
          icon: L.divIcon({
            className: "trip-stop-wrap",
            html: '<div class="trip-stop' + (isHome ? " trip-stop-home" : "") +
              '" style="--dc:' + color + '">' + (isHome ? svg("home") : n) + "</div>",
            iconSize: [22, 22],
            iconAnchor: [28, 32] // sits at the pin's top-left shoulder
          }),
          zIndexOffset: 1500,
          alt: "Stop " + (isHome ? "Sen's" : n)
        }).on("click", function () { selectPoi(rec, true); });
        tripLayer.addLayer(badge);
      });
    });
    tripLayer.addTo(map);

    tripTitle.textContent = trip.title;
    tripMeta.textContent = trip.days + (trip.days > 1 ? " days" : " day") + " · ~" + trip.km + " km";

    // Each day becomes its own tappable Google Maps route (Sen's → that day's
    // stops → Sen's), so travellers can navigate the trip day by day.
    var chips = "";
    for (var d = 0; d < trip.days; d++) {
      var dc = DAY_COLORS[d % DAY_COLORS.length];
      chips += '<a class="day-chip" style="--dc:' + dc + '" target="_blank" rel="noopener" href="' +
        esc(tripGmapsRoute(trip, d)) + '">' + svg("gmaps") + "Day " + (d + 1) + "</a>";
    }
    tripDaysEl.innerHTML = chips;
    tripDaysEl.style.display = chips ? "" : "none";

    // The per-day chips carry the Google Maps links now, so hide the single
    // planner button to avoid duplication.
    tripPlanner.style.display = "none";

    tripBar.hidden = false;
    document.body.classList.add("trip-open");

    refresh();
    var b = L.latLngBounds(allPts).pad(0.08);
    if (REDUCED) { map.fitBounds(b); }
    else { map.flyToBounds(b, { duration: 0.9 }); }
  }

  // Build a Google Maps driving-directions URL for ONE day of a trip:
  // Sen's -> that day's stops -> Sen's. Uses place names where known so the
  // route lands on the real businesses. dayIndex defaults to 0 (day 1).
  function tripGmapsRoute(trip, dayIndex) {
    var byId = {};
    records.forEach(function (r) { byId[r.poi.id] = r.poi; });
    function term(id) {
      var p = byId[id];
      if (!p) { return null; }
      return p.mapsName ? encodeURIComponent(p.mapsName + ", Cao Bằng, Vietnam")
                        : (p.lat + "," + p.lng);
    }
    var home = term("sens-homestay");
    var stops = (trip.stopsByDay[dayIndex || 0] || [])
      .filter(function (id) { return id !== "sens-homestay"; })
      .map(term).filter(Boolean)
      .slice(0, 8); // Google Maps allows ~9 waypoints
    var url = "https://www.google.com/maps/dir/?api=1&travelmode=driving" +
      "&origin=" + home + "&destination=" + home;
    if (stops.length) { url += "&waypoints=" + stops.join("%7C"); } // %7C = |
    return url;
  }

  function exitTrip() {
    if (!activeTrip) { return; }
    activeTrip = null;
    if (tripLayer) { map.removeLayer(tripLayer); tripLayer = null; }
    tripCasings = [];
    tripBar.hidden = true;
    document.body.classList.remove("trip-open");
    refresh();
  }
  document.getElementById("trip-close").addEventListener("click", exitTrip);
  buildTripsSheet();

  /* ---------------- "What are you looking for?" menu ---------------- */
  var lookingBtn = document.getElementById("looking-btn");
  var askSheet = document.getElementById("ask-sheet");
  var listSheet = document.getElementById("list-sheet");
  var listItemsEl = document.getElementById("list-items");
  var listTitleEl = document.getElementById("list-title");

  document.getElementById("looking-ic").innerHTML = svg("compass");
  document.getElementById("ask-close").innerHTML = svg("close");
  document.getElementById("list-close").innerHTML = svg("close");
  document.getElementById("list-back").innerHTML = svg("arrow", 'style="transform:rotate(180deg)"');
  // fill the small icons inside the ask options + welcome options
  document.querySelectorAll("[data-ic]").forEach(function (el) {
    var name = el.getAttribute("data-ic");
    el.innerHTML = svg(name === "arrow" ? "arrow" : name);
  });

  function openAsk() { askSheet.hidden = false; }
  function closeAsk() { askSheet.hidden = true; }
  function openList() { listSheet.hidden = false; }
  function closeList() { listSheet.hidden = true; }

  // Build a scrollable list of places for a category, then let the user pick one.
  function showPlaceList(category, title) {
    var rows = records
      .filter(function (r) { return r.poi.category === category; })
      .sort(function (a, b) {
        // Sen's places first, then featured, then the rest
        var sa = (a.poi.id === "sens-homestay" ? 2 : 0) + (a.poi.featured ? 1 : 0);
        var sb = (b.poi.id === "sens-homestay" ? 2 : 0) + (b.poi.featured ? 1 : 0);
        return sb - sa;
      });
    listTitleEl.textContent = title;
    if (!rows.length) {
      listItemsEl.innerHTML = '<div class="list-empty">Nothing here yet.</div>';
    } else {
      listItemsEl.innerHTML = rows.map(function (r) {
        var p = r.poi, c = r.cat;
        var img = p.img ? '<img src="' + esc(pinSrc(p.img)) + '" alt="" loading="lazy">'
          : '<span class="list-row-img"></span>';
        var badges = "";
        if (p.pick) { badges += '<span class="list-badge" style="background:#B45309">★ Sen&#39;s pick</span>'; }
        if (p.veg) { badges += '<span class="list-badge" style="background:#15803D">Veg</span>'; }
        if (p.price) { badges += '<span class="list-badge" style="background:' + c.color + '">' + esc(p.price) + "</span>"; }
        return '<button class="list-row" data-id="' + p.id + '">' + img +
          '<span class="list-row-body">' +
          '<span class="list-row-title">' + esc(p.name) + "</span>" +
          '<span class="list-row-sub">' + esc(p.desc || "") + "</span>" +
          (badges ? '<span class="list-row-badges">' + badges + "</span>" : "") +
          "</span></button>";
      }).join("");
    }
    listItemsEl.scrollTop = 0;
    openList();
  }

  // the three top-level choices
  function pickAsk(kind) {
    closeAsk();
    if (kind === "trips") {
      openTripsSheet();
    } else if (kind === "food") {
      showPlaceList("food", "Food & Coffee");
    } else if (kind === "stay") {
      showPlaceList("stay", "Places to stay");
    }
  }

  lookingBtn.addEventListener("click", openAsk);

  // Sen's Homestay CTA pill (next to the "what are you looking for" button):
  // shows the host's photo and opens its card — promotes the host behind the map.
  var sensCtaPhoto = document.getElementById("sens-cta-photo");
  var sensCta = document.getElementById("sens-cta");
  if (sensCtaPhoto) { sensCtaPhoto.innerHTML = pinImgTag(ASSETS + "images/homestay.jpg"); }
  if (sensCta) {
    sensCta.addEventListener("click", function () {
      var rec = records.find(function (r) { return r.poi.id === "sens-homestay"; });
      if (rec) { selectPoi(rec, true); }
    });
  }

  document.getElementById("ask-close").addEventListener("click", closeAsk);
  askSheet.addEventListener("click", function (e) { if (e.target === askSheet) { closeAsk(); } });
  askSheet.addEventListener("click", function (e) {
    var opt = e.target.closest(".ask-opt");
    if (opt) { pickAsk(opt.dataset.ask); }
  });

  document.getElementById("list-close").addEventListener("click", closeList);
  document.getElementById("list-back").addEventListener("click", function () { closeList(); openAsk(); });
  listSheet.addEventListener("click", function (e) { if (e.target === listSheet) { closeList(); } });
  listItemsEl.addEventListener("click", function (e) {
    var row = e.target.closest(".list-row[data-id]");
    if (!row) { return; }
    var rec = records.find(function (r) { return r.poi.id === row.dataset.id; });
    if (!rec) { return; }
    closeList();
    if (activeTrip && !activeTrip._set[rec.poi.id]) { exitTrip(); }
    if (activeCat !== "all" && rec.poi.category !== activeCat) {
      activeCat = "all";
      chipsEl.querySelectorAll(".chip").forEach(function (ch) {
        ch.setAttribute("aria-pressed", ch.dataset.cat === "all" ? "true" : "false");
      });
    }
    selectPoi(rec, true);
    setTimeout(refresh, 0);
  });

  /* ---------------- Welcome overlay ---------------- */
  var welcome = document.getElementById("welcome");
  var seenKey = "cbmap-welcomed";
  var welcomeImg = document.getElementById("welcome-img");
  welcomeImg.addEventListener("error", function () { welcomeImg.remove(); });
  welcomeImg.src = MAP_CONFIG.cityImg;
  function dismissWelcome() {
    welcome.classList.add("hide");
    try { localStorage.setItem(seenKey, "1"); } catch (e) { /* private mode */ }
  }
  document.getElementById("welcome-skip").addEventListener("click", dismissWelcome);
  // the three welcome options mirror the "What are you looking for?" menu
  welcome.querySelectorAll(".wopt").forEach(function (opt) {
    opt.addEventListener("click", function () { dismissWelcome(); pickAsk(opt.dataset.ask); });
  });
  var seen = false;
  try { seen = !!localStorage.getItem(seenKey); } catch (e) { /* private mode */ }
  if (!seen) { welcome.classList.remove("hide"); }

  /* ---------------- Basemap styles (streets / satellite / terrain) ---------------- */
  var bmBtn = document.getElementById("basemap-btn");
  var bmMenu = document.getElementById("basemap-menu");
  var BASEMAPS = [
    { id: "streets", label: "Streets", icon: "map" },
    { id: "satellite", label: "Satellite", icon: "globe" },
    { id: "terrain", label: "Terrain", icon: "mountain" }
  ];
  var basemap = "streets";
  try { basemap = localStorage.getItem("cbmap-basemap") || "streets"; } catch (e) { /* private mode */ }
  if (!BASEMAPS.some(function (b) { return b.id === basemap; })) { basemap = "streets"; }

  bmMenu.innerHTML = BASEMAPS.map(function (b) {
    return '<button data-bm="' + b.id + '" aria-pressed="false">' + svg(b.icon) + esc(b.label) + "</button>";
  }).join("") +
    '<div class="bm-sep"></div>' +
    '<button data-toggle="highways" aria-pressed="true">' + svg("route") + "Main roads</button>";
  bmBtn.innerHTML = svg("all");

  function applyBasemap() {
    var dark = document.body.classList.contains("dark");
    ALL_BASE_LAYERS.forEach(function (l) { if (map.hasLayer(l)) { map.removeLayer(l); } });
    if (basemap === "satellite") {
      satTiles.addTo(map);
      satLabels.addTo(map); // white place names over the imagery
    } else if (basemap === "terrain") {
      topoTiles.addTo(map);
    } else {
      (dark ? darkTiles : lightTiles).addTo(map);
    }
    // boundary + outside-dim tuned per background
    var line, maskC, maskO;
    if (basemap === "satellite") { line = "#7DD3FC"; maskC = "#000000"; maskO = 0.62; }
    else if (basemap === "terrain") { line = "#0E7490"; maskC = "#0B2530"; maskO = dark ? 0.55 : 0.5; }
    else { line = dark ? "#38BDF8" : "#0E7490"; maskC = dark ? "#000000" : "#0B2530"; maskO = dark ? 0.58 : 0.46; }
    boundaryLine.setStyle({ color: line });
    outsideMask.setStyle({ fillColor: maskC, fillOpacity: maskO });
    // highway casing: subtle dark halo on satellite, bright white elsewhere
    var hwCasing = basemap === "satellite" ? "rgba(0,0,0,.55)" : "#FFFFFF";
    highwayCasings.forEach(function (c) { c.setStyle({ color: hwCasing }); });
    bmMenu.querySelectorAll("button[data-bm]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.bm === basemap ? "true" : "false");
    });
    try { localStorage.setItem("cbmap-basemap", basemap); } catch (e) { /* private mode */ }
    schedulePreload(); // quietly pre-download this style's tiles too
  }
  function closeBmMenu() { bmMenu.hidden = true; }
  bmBtn.addEventListener("click", function () { bmMenu.hidden = !bmMenu.hidden; });
  bmMenu.addEventListener("click", function (e) {
    var tog = e.target.closest("button[data-toggle='highways']");
    if (tog) {
      highwaysToggle = !highwaysToggle;
      tog.setAttribute("aria-pressed", highwaysToggle ? "true" : "false");
      try { localStorage.setItem("cbmap-highways", highwaysToggle ? "on" : "off"); } catch (er) { /* private */ }
      refresh();
      return;
    }
    var btn = e.target.closest("button[data-bm]");
    if (!btn) { return; }
    basemap = btn.dataset.bm;
    applyBasemap();
    closeBmMenu();
  });
  // reflect stored highway preference in the toggle button
  (function () {
    var tb = bmMenu.querySelector("button[data-toggle='highways']");
    if (tb) { tb.setAttribute("aria-pressed", highwaysToggle ? "true" : "false"); }
  })();

  /* ---------------- Theme (light / dark) ---------------- */
  var themeBtn = document.getElementById("theme-btn");
  var themeKey = "cbmap-theme";
  var metaTheme = document.querySelector('meta[name="theme-color"]');
  function applyTheme(dark) {
    document.body.classList.toggle("dark", dark);
    applyBasemap(); // streets variant + boundary/mask follow the theme
    tripCasings.forEach(function (c) { c.setStyle({ color: dark ? "#14262F" : "#FFFFFF" }); });
    themeBtn.innerHTML = svg(dark ? "sun" : "moon");
    themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    if (metaTheme) { metaTheme.content = dark ? "#0D1B22" : "#0B2530"; }
    try { localStorage.setItem(themeKey, dark ? "dark" : "light"); } catch (e) { /* private mode */ }
  }
  var storedTheme = null;
  try { storedTheme = localStorage.getItem(themeKey); } catch (e) { /* private mode */ }
  var isDark = storedTheme ? storedTheme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  themeBtn.addEventListener("click", function () { isDark = !isDark; applyTheme(isDark); });
  applyTheme(isDark);

  /* ---------------- Misc UI ---------------- */
  document.getElementById("brand").innerHTML =
    '<span class="brand-title">' + svg("pin") + "Cao Bằng Travel Map</span>" +
    '<span class="brand-tagline">Made by locals — the spots we’d take a friend</span>';
  document.getElementById("lead-icon").innerHTML = svg("search");
  document.getElementById("search-clear").innerHTML = svg("close");

  var toastEl = document.getElementById("toast");
  var toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }

  map.on("click", function (e) {
    closeCard();
    clearSearch();
    closeBmMenu();
    if (EDIT_MODE) {
      var coords = e.latlng.lat.toFixed(5) + ", " + e.latlng.lng.toFixed(5);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(coords).then(
          function () { toast("Copied: " + coords); },
          function () { toast(coords); }
        );
      } else { toast(coords); }
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (!welcome.classList.contains("hide")) { dismissWelcome(); }
      else if (!bmMenu.hidden) { closeBmMenu(); }
      else if (!listSheet.hidden) { closeList(); }
      else if (!askSheet.hidden) { closeAsk(); }
      else if (!tripsSheet.hidden) { closeTripsSheet(); }
      else if (card.classList.contains("open")) { closeCard(); }
      else if (activeTrip) { exitTrip(); }
    }
  });

  /* ---------------- Full-province tile preload ---------------- */
  // Cao Bang is small, so we can pre-download every tile a visitor will
  // realistically need: the whole province at z8–z12 plus the city block at
  // z13–z16 (~550 tiles). Combined with the service worker they're cached
  // permanently, so panning never shows grey tiles again.
  if ("serviceWorker" in navigator &&
      (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    navigator.serviceWorker.register("sw.js").catch(function () { /* ignore */ });
  }

  var PROVINCE_BBOX = [22.357, 105.267, 23.119, 106.838]; // S, W, N, E
  var CITY_BBOX = [22.62, 106.22, 22.70, 106.30];

  function lng2x(lng, z) { return Math.floor((lng + 180) / 360 * Math.pow(2, z)); }
  function lat2y(lat, z) {
    var r = lat * Math.PI / 180;
    return Math.floor((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * Math.pow(2, z));
  }

  function preloadTileUrl(z, x, y) {
    if (basemap === "satellite") {
      return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/" + z + "/" + y + "/" + x;
    }
    if (basemap === "terrain") {
      return "https://" + "abc"[(x + y) % 3] + ".tile.opentopomap.org/" + z + "/" + x + "/" + y + ".png";
    }
    var style = document.body.classList.contains("dark") ? "dark_all" : "rastertiles/voyager";
    var r = L.Browser.retina ? "@2x" : "";
    return "https://" + "abcd"[(x + y) % 4] + ".basemaps.cartocdn.com/" + style + "/" + z + "/" + x + "/" + y + r + ".png";
  }

  function bboxUrls(bbox, zFrom, zTo) {
    var urls = [];
    for (var z = zFrom; z <= zTo; z++) {
      var x0 = lng2x(bbox[1], z), x1 = lng2x(bbox[3], z);
      var y0 = lat2y(bbox[2], z), y1 = lat2y(bbox[0], z); // north has the smaller y
      for (var x = x0; x <= x1; x++) {
        for (var y = y0; y <= y1; y++) { urls.push(preloadTileUrl(z, x, y)); }
      }
    }
    return urls;
  }

  var preloadRunning = false;
  function preloadKey() {
    return "cbmap-preload-" + basemap +
      (document.body.classList.contains("dark") && basemap === "streets" ? "-dark" : "") +
      (L.Browser.retina ? "@2x" : "");
  }

  function runPreload() {
    if (preloadRunning || !navigator.onLine) { return; }
    if (navigator.connection && navigator.connection.saveData) { return; } // respect data saver
    var key = preloadKey();
    try { if (localStorage.getItem(key)) { return; } } catch (e) { /* private mode */ }

    var urls = bboxUrls(PROVINCE_BBOX, 8, 12).concat(bboxUrls(CITY_BBOX, 13, 16));
    preloadRunning = true;
    toast("Downloading the Cao Bằng map for smooth browsing…");

    var i = 0, active = 0, done = 0, MAX = 6;
    function finish() {
      preloadRunning = false;
      try { localStorage.setItem(key, "1"); } catch (e) { /* private mode */ }
      toast("Map ready — panning is smooth now");
    }
    function pump() {
      if (done >= urls.length) { return; }
      while (active < MAX && i < urls.length) {
        active++;
        fetch(urls[i++], { mode: "cors", credentials: "omit" })
          .catch(function () { /* a missed tile is fine */ })
          .then(function () {
            active--; done++;
            if (done >= urls.length) { finish(); } else { pump(); }
          });
      }
    }
    pump();
  }

  function schedulePreload() {
    clearTimeout(schedulePreload._t);
    schedulePreload._t = setTimeout(runPreload, 4000);
  }
  window.addEventListener("load", schedulePreload);

  /* ---------------- "Where am I" — live user location ---------------- */
  // A GPS button (bottom-right, above the zoom control). First tap starts
  // watching the device location and flies there; a blue dot + accuracy circle
  // track the user live. Tap again to re-centre.
  var locBtn = L.control({ position: "bottomright" });
  locBtn.onAdd = function () {
    var el = L.DomUtil.create("button", "locate-btn");
    el.setAttribute("aria-label", "Show my location");
    el.setAttribute("type", "button");
    el.innerHTML = svg("locate");
    L.DomEvent.disableClickPropagation(el);
    L.DomEvent.on(el, "click", toggleLocate);
    locBtnEl = el;
    return el;
  };
  locBtn.addTo(map);

  var locBtnEl = null;
  var locWatchId = null;
  var locMarker = null;
  var locCircle = null;
  var locFollowing = false;

  function setLocBtnState(state) { // "" | "active" | "loading"
    if (!locBtnEl) { return; }
    locBtnEl.classList.toggle("locate-active", state === "active");
    locBtnEl.classList.toggle("locate-loading", state === "loading");
  }

  function toggleLocate() {
    if (!("geolocation" in navigator)) {
      toast("This device can't share its location");
      return;
    }
    if (locWatchId !== null) {
      // already tracking — just recentre on the user
      if (locMarker) {
        locFollowing = true;
        flyTo(locMarker.getLatLng(), Math.max(map.getZoom(), 14));
      }
      return;
    }
    setLocBtnState("loading");
    toast("Finding your location…");
    locFollowing = true;
    locWatchId = navigator.geolocation.watchPosition(onLocation, onLocationError, {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 20000
    });
  }

  function onLocation(pos) {
    var ll = [pos.coords.latitude, pos.coords.longitude];
    var acc = pos.coords.accuracy || 0;
    setLocBtnState("active");

    if (!locMarker) {
      locMarker = L.marker(ll, {
        icon: L.divIcon({ className: "user-loc-wrap", html: '<div class="user-loc"></div>', iconSize: [22, 22], iconAnchor: [11, 11] }),
        zIndexOffset: 2000,
        interactive: false,
        keyboard: false
      }).addTo(map);
      locCircle = L.circle(ll, { radius: acc, stroke: false, fillColor: "#1D4ED8", fillOpacity: 0.12, interactive: false }).addTo(map);
    } else {
      locMarker.setLatLng(ll);
      locCircle.setLatLng(ll).setRadius(acc);
    }

    if (locFollowing) {
      locFollowing = false; // only auto-fly on the first fix / explicit recentre
      var inProvince = ll[0] > 21.9 && ll[0] < 23.4 && ll[1] > 104.9 && ll[1] < 107.4;
      flyTo(ll, inProvince ? Math.max(map.getZoom(), 14) : map.getZoom());
      toast(inProvince ? "You're here" : "You're outside Cao Bằng — showing your position");
    }
  }

  function onLocationError(err) {
    setLocBtnState("");
    if (locWatchId !== null) { navigator.geolocation.clearWatch(locWatchId); locWatchId = null; }
    var msg = "Couldn't get your location";
    if (err && err.code === 1) { msg = "Location permission denied — enable it in your browser"; }
    else if (err && err.code === 3) { msg = "Location timed out — try again outdoors"; }
    toast(msg);
  }

  buildChips();
  refresh();
  if (EDIT_MODE) { toast("Edit mode — tap the map to copy coordinates"); }
})();

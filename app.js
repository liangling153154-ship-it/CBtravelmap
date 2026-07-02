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
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>'
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
    maxZoom: 19
  };
  var lightTiles = L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", tileOpts);
  var darkTiles = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", tileOpts);

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
    fillOpacity: 0.14,
    interactive: false
  }).addTo(map);
  var boundaryLine = L.polygon(provinceRings, {
    fill: false,
    color: "#0E7490",
    weight: 2.5,
    opacity: 0.85,
    interactive: false
  }).addTo(map);

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

    if (poi.img) {
      // every place with a photo gets a round photo pin;
      // hero places (photoPin) are bigger, city pins smallest
      var size = poi.photoPin ? 56 : (isProv ? 42 : 38);
      var sizeCls = poi.photoPin ? "" : (isProv ? " photo-md" : " photo-sm");
      var wrapCls = "poi-wrap photo-wrap" + (poi.photoPin ? "" : (isProv ? " photo-md-wrap" : " photo-sm-wrap"));
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

  /* City gateway — capital photo pin (red ring + star badge) while zoomed out */
  var gateway = L.marker(MAP_CONFIG.cityCenter, {
    icon: L.divIcon({
      className: "poi-wrap photo-wrap capital-wrap",
      html: '<div class="photo-pin photo-pin-capital">' + pinImgTag(MAP_CONFIG.cityPinImg) + "</div>" +
        '<span class="pin-label">Cao Bằng City</span>',
      iconSize: [56, 56],
      iconAnchor: [28, 28]
    }),
    zIndexOffset: 900,
    alt: "Cao Bang City — tap to explore food, coffee and stay"
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

    document.body.classList.toggle("zl-mid", zoom >= MAP_CONFIG.cityThreshold && zoom < 15);
    document.body.classList.toggle("zl-max", zoom >= 17);
    segProvince.classList.toggle("on", !cityVisible);
    segCity.classList.toggle("on", cityVisible);
  }
  map.on("zoomend", refresh);

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

  function applyActiveClass(rec) {
    var el = rec.marker.getElement();
    if (!el) { return; }
    var pin = el.querySelector(".pin, .photo-pin");
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

    var gmaps = poi.maps || ("https://www.google.com/maps/dir/?api=1&destination=" + poi.lat + "," + poi.lng);
    var actions = '<a class="btn btn-primary" href="' + esc(gmaps) + '" target="_blank" rel="noopener">' + svg("nav") + "Directions</a>";
    if (poi.bookUrl) {
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

  /* ---------------- View toggle ---------------- */
  var segProvince = document.getElementById("seg-province");
  var segCity = document.getElementById("seg-city");
  segProvince.innerHTML = svg("mountain") + "Province";
  segCity.innerHTML = svg("city") + "City";
  function goProvince() {
    closeCard();
    if (REDUCED) { map.fitBounds(provinceBounds); }
    else { map.flyToBounds(provinceBounds, { duration: 0.9 }); }
  }
  function goCity() {
    flyTo(MAP_CONFIG.cityCenter, MAP_CONFIG.cityZoom);
  }
  segProvince.addEventListener("click", goProvince);
  segCity.addEventListener("click", goCity);

  /* ---------------- Suggested itineraries (trips) ---------------- */
  var tripsSheet = document.getElementById("trips-sheet");
  var tripsList = document.getElementById("trips-list");
  var tripBar = document.getElementById("trip-bar");
  var tripTitle = document.getElementById("trip-title");
  var tripMeta = document.getElementById("trip-meta");
  var tripDaysEl = document.getElementById("trip-days");
  var tripPlanner = document.getElementById("trip-planner");
  var segTrips = document.getElementById("seg-trips");
  var activeTrip = null;
  var tripLayer = null;
  var tripCasings = [];

  segTrips.innerHTML = svg("route") + "Trips";
  tripPlanner.href = ASSETS + "itinerary-v2/itinerary-v2.html";
  tripPlanner.innerHTML = svg("book") + "Planner";
  document.getElementById("trips-close").innerHTML = svg("close");
  document.getElementById("trip-close").innerHTML = svg("close");

  function buildTripsSheet() {
    var html = "";
    TRIPS.forEach(function (t) {
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
  segTrips.addEventListener("click", openTripsSheet);
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
        var casing = L.polyline(line, { color: dark ? "#14262F" : "#FFFFFF", weight: 7, opacity: 0.9, interactive: false });
        tripCasings.push(casing);
        tripLayer.addLayer(casing);
        tripLayer.addLayer(L.polyline(line, { color: color, weight: 4, opacity: 0.9, interactive: false }));
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
    var chips = "";
    if (trip.days > 1) {
      for (var d = 0; d < trip.days; d++) {
        chips += '<span class="day-chip" style="--dc:' + DAY_COLORS[d % DAY_COLORS.length] + '">Day ' + (d + 1) + "</span>";
      }
    }
    tripDaysEl.innerHTML = chips;
    tripDaysEl.style.display = chips ? "" : "none";
    tripBar.hidden = false;
    document.body.classList.add("trip-open");

    refresh();
    var b = L.latLngBounds(allPts).pad(0.08);
    if (REDUCED) { map.fitBounds(b); }
    else { map.flyToBounds(b, { duration: 0.9 }); }
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

  /* ---------------- Welcome overlay ---------------- */
  var welcome = document.getElementById("welcome");
  var seenKey = "cbmap-welcomed";
  var welcomeImg = document.getElementById("welcome-img");
  welcomeImg.addEventListener("error", function () { welcomeImg.remove(); });
  welcomeImg.src = MAP_CONFIG.cityImg;
  document.getElementById("welcome-province").innerHTML = svg("mountain") + "Explore the province";
  document.getElementById("welcome-city").innerHTML = svg("city") + "City food & coffee guide";
  function dismissWelcome() {
    welcome.classList.add("hide");
    try { localStorage.setItem(seenKey, "1"); } catch (e) { /* private mode */ }
  }
  document.getElementById("welcome-skip").addEventListener("click", dismissWelcome);
  document.getElementById("welcome-province").addEventListener("click", function () { dismissWelcome(); goProvince(); });
  document.getElementById("welcome-city").addEventListener("click", function () { dismissWelcome(); goCity(); });
  var seen = false;
  try { seen = !!localStorage.getItem(seenKey); } catch (e) { /* private mode */ }
  if (!seen) { welcome.classList.remove("hide"); }

  /* ---------------- Theme (light / dark) ---------------- */
  var themeBtn = document.getElementById("theme-btn");
  var themeKey = "cbmap-theme";
  var metaTheme = document.querySelector('meta[name="theme-color"]');
  function applyTheme(dark) {
    document.body.classList.toggle("dark", dark);
    if (dark) {
      if (map.hasLayer(lightTiles)) { map.removeLayer(lightTiles); }
      darkTiles.addTo(map);
    } else {
      if (map.hasLayer(darkTiles)) { map.removeLayer(darkTiles); }
      lightTiles.addTo(map);
    }
    boundaryLine.setStyle({ color: dark ? "#38BDF8" : "#0E7490" });
    outsideMask.setStyle({ fillColor: dark ? "#000000" : "#0B2530", fillOpacity: dark ? 0.35 : 0.14 });
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
  document.getElementById("brand").innerHTML = svg("pin") + "Cao Bằng Travel Map";
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
      else if (!tripsSheet.hidden) { closeTripsSheet(); }
      else if (card.classList.contains("open")) { closeCard(); }
      else if (activeTrip) { exitTrip(); }
    }
  });

  buildChips();
  refresh();
  if (EDIT_MODE) { toast("Edit mode — tap the map to copy coordinates"); }
})();

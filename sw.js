/* =====================================================================
   CAO BANG TRAVEL MAP — SERVICE WORKER
   ---------------------------------------------------------------------
   Makes the map feel instant on phones:
     • map tiles (CARTO / Esri / OpenTopoMap): cache-first, forever —
       once a tile has been seen (or preloaded by app.js) it never
       has to be downloaded again, even offline.
     • local photos/thumbs: cache-first (they never change in place).
     • local html/js (data.js, app.js, …): network-first with cache
       fallback — owner edits show up immediately when online, and the
       map still opens from cache when offline.
   Bump VERSION to invalidate everything after big changes.
   ===================================================================== */
"use strict";

var VERSION = "cbmap-v1";
var TILE_CACHE = VERSION + "-tiles";
var ASSET_CACHE = VERSION + "-assets";

var TILE_HOSTS = [
  "basemaps.cartocdn.com",
  "server.arcgisonline.com",
  "tile.opentopomap.org"
];

self.addEventListener("install", function (e) {
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k.indexOf(VERSION) !== 0) { return caches.delete(k); }
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

function cacheFirst(req, cacheName) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(req, { ignoreVary: true }).then(function (hit) {
      if (hit) { return hit; }
      return fetch(req).then(function (res) {
        if (res && res.status === 200) { cache.put(req, res.clone()); }
        return res;
      });
    });
  });
}

function networkFirst(req, cacheName) {
  return caches.open(cacheName).then(function (cache) {
    return fetch(req).then(function (res) {
      if (res && res.status === 200) { cache.put(req, res.clone()); }
      return res;
    }).catch(function () {
      return cache.match(req, { ignoreVary: true }).then(function (hit) {
        if (hit) { return hit; }
        throw new Error("offline and not cached: " + req.url);
      });
    });
  });
}

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") { return; }
  var url;
  try { url = new URL(e.request.url); } catch (err) { return; }

  // map tiles from known hosts — cache forever
  var isTile = TILE_HOSTS.some(function (h) { return url.hostname === h || url.hostname.endsWith("." + h); });
  if (isTile) {
    e.respondWith(cacheFirst(e.request, TILE_CACHE));
    return;
  }

  // everything else: only handle our own origin
  if (url.origin !== self.location.origin) { return; }

  if (/\.(jpe?g|png|webp|gif|svg|mp4)$/i.test(url.pathname)) {
    // photos & thumbs never change in place
    e.respondWith(cacheFirst(e.request, ASSET_CACHE));
  } else {
    // html / js / css / json — fresh when online, cached when offline
    e.respondWith(networkFirst(e.request, ASSET_CACHE));
  }
});

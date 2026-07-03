/* =====================================================================
   CAO BANG MAP — INTERNAL ADMIN SERVER
   ---------------------------------------------------------------------
   A tiny zero-dependency Node server for the map owner. It:
     • serves the map itself and the admin panel
     • reads / writes data.js (the POI list) safely, with backups
     • lets the AI-assist flow paste a new data.js back in

   Run:  node admin/server.js         (then open http://localhost:4173/admin/)
   Nothing is installed — only Node's built-in modules are used.
   The server binds to 127.0.0.1 only, so it is not reachable from outside.
   ===================================================================== */
"use strict";

var http = require("http");
var fs = require("fs");
var path = require("path");
var url = require("url");
var vm = require("vm");

var ROOT = path.join(__dirname, "..");          // project root
var DATA_FILE = path.join(ROOT, "data.js");
var BACKUP_DIR = path.join(__dirname, "backups");
var PORT = 4173;
var HOST = "127.0.0.1";

if (!fs.existsSync(BACKUP_DIR)) { fs.mkdirSync(BACKUP_DIR, { recursive: true }); }

var MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".JPG": "image/jpeg", ".JPEG": "image/jpeg",
  ".mp4": "video/mp4", ".svg": "image/svg+xml", ".ico": "image/x-icon"
};

/* ---------- read data.js by running it in a sandbox ---------- */
function loadData() {
  var code = fs.readFileSync(DATA_FILE, "utf8");
  var sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: "data.js" });
  return {
    ASSETS: sandbox.ASSETS,
    CATEGORIES: sandbox.CATEGORIES,
    MAP_CONFIG: sandbox.MAP_CONFIG,
    POIS: sandbox.POIS
  };
}

/* ---------- serialize a POI object back to nicely formatted JS ---------- */
// Field order kept stable & readable, matching the hand-written file style.
var FIELD_ORDER = [
  "id", "name", "localName", "category", "tier", "lat", "lng",
  "minZoom", "photoPin", "zPriority", "labelAbove", "featured",
  "approx", "pick", "veg",
  "desc", "distance", "price",
  "img", "maps", "mapsName", "bookUrl", "guideUrl", "guideLabel", "phone"
];

function jsStr(s) {
  return '"' + String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
}

function serializeValue(key, val) {
  if (typeof val === "boolean") { return String(val); }
  if (typeof val === "number") { return String(val); }
  // img paths are written with the ASSETS prefix concatenation to match the file
  if (key === "img" || key === "guideUrl") {
    var m = String(val);
    var idx = m.indexOf("SEN WEB OTA - main/");
    if (idx === 0) { return 'ASSETS + ' + jsStr(m.slice("SEN WEB OTA - main/".length)); }
  }
  return jsStr(val);
}

function serializePoi(poi) {
  var keys = FIELD_ORDER.filter(function (k) { return poi[k] !== undefined && poi[k] !== null && poi[k] !== ""; });
  // include any unknown keys too, so nothing is silently dropped
  Object.keys(poi).forEach(function (k) { if (keys.indexOf(k) === -1) { keys.push(k); } });
  var parts = keys.map(function (k) { return k + ": " + serializeValue(k, poi[k]); });
  return "  {\n    " + wrapFields(parts) + "\n  }";
}

// group short fields two-per-line-ish for readability, long ones alone
function wrapFields(parts) {
  return parts.join(",\n    ");
}

function serializeData(pois) {
  var header = fs.readFileSync(DATA_FILE, "utf8");
  // keep everything up to and including "var POIS = [" from the current file
  var marker = header.indexOf("var POIS = [");
  var preamble = marker >= 0 ? header.slice(0, marker) : "";
  var body = pois.map(serializePoi).join(",\n\n");
  return preamble + "var POIS = [\n\n" + body + "\n];\n";
}

/* ---------- write data.js with a timestamped backup ---------- */
function saveData(pois) {
  var stamp = new Date().toISOString().replace(/[:.]/g, "-");
  fs.copyFileSync(DATA_FILE, path.join(BACKUP_DIR, "data-" + stamp + ".js"));
  var out = serializeData(pois);
  // validate it parses before committing
  var sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(out, sandbox, { filename: "data.js(new)" });
  if (!Array.isArray(sandbox.POIS)) { throw new Error("Generated data.js did not produce a POIS array"); }
  fs.writeFileSync(DATA_FILE, out, "utf8");
  return sandbox.POIS.length;
}

/* ---------- validate a raw data.js string (for AI paste) ---------- */
function validateRaw(code) {
  var sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: "data.js(pasted)" });
  if (typeof sandbox.ASSETS !== "string") { throw new Error("Missing `var ASSETS`"); }
  if (!sandbox.CATEGORIES) { throw new Error("Missing `var CATEGORIES`"); }
  if (!sandbox.MAP_CONFIG) { throw new Error("Missing `var MAP_CONFIG`"); }
  if (!Array.isArray(sandbox.POIS)) { throw new Error("Missing `var POIS` array"); }
  var ids = {};
  sandbox.POIS.forEach(function (p, i) {
    if (!p.id) { throw new Error("POI #" + (i + 1) + " has no id"); }
    if (ids[p.id]) { throw new Error("Duplicate id: " + p.id); }
    ids[p.id] = true;
    if (typeof p.lat !== "number" || typeof p.lng !== "number") {
      throw new Error("POI '" + p.id + "' has invalid lat/lng");
    }
    if (!sandbox.CATEGORIES[p.category]) {
      throw new Error("POI '" + p.id + "' has unknown category: " + p.category);
    }
  });
  return sandbox.POIS.length;
}

/* ---------- request helpers ---------- */
function sendJson(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
}
function readBody(req, cb) {
  var chunks = [];
  req.on("data", function (c) { chunks.push(c); });
  req.on("end", function () { cb(Buffer.concat(chunks).toString("utf8")); });
}

/* ---------- static file serving (safe path) ---------- */
function serveStatic(req, res, pathname) {
  var rel = decodeURIComponent(pathname).replace(/^\/+/, "");
  if (rel === "") { rel = "index.html"; }
  if (rel === "admin/" || rel === "admin") { rel = "admin/index.html"; }
  var full = path.join(ROOT, rel);
  if (full.indexOf(ROOT) !== 0) { res.writeHead(403); res.end("Forbidden"); return; }
  fs.stat(full, function (err, st) {
    if (err || !st.isFile()) { res.writeHead(404); res.end("Not found: " + rel); return; }
    res.writeHead(200, { "Content-Type": MIME[path.extname(full)] || "application/octet-stream" });
    fs.createReadStream(full).pipe(res);
  });
}

/* ---------- server ---------- */
var server = http.createServer(function (req, res) {
  var parsed = url.parse(req.url, true);
  var p = parsed.pathname;

  // ---- API ----
  if (p === "/api/data" && req.method === "GET") {
    try {
      var d = loadData();
      return sendJson(res, 200, { ok: true, categories: d.CATEGORIES, pois: d.POIS });
    } catch (e) { return sendJson(res, 500, { ok: false, error: e.message }); }
  }

  if (p === "/api/data" && req.method === "PUT") {
    return readBody(req, function (body) {
      try {
        var payload = JSON.parse(body);
        if (!Array.isArray(payload.pois)) { throw new Error("payload.pois must be an array"); }
        var n = saveData(payload.pois);
        return sendJson(res, 200, { ok: true, count: n });
      } catch (e) { return sendJson(res, 400, { ok: false, error: e.message }); }
    });
  }

  if (p === "/api/raw" && req.method === "GET") {
    // full current data.js text (for the AI prompt)
    try {
      return sendJson(res, 200, { ok: true, code: fs.readFileSync(DATA_FILE, "utf8") });
    } catch (e) { return sendJson(res, 500, { ok: false, error: e.message }); }
  }

  if (p === "/api/raw" && req.method === "PUT") {
    // paste a whole new data.js (from the AI) — validate, back up, write
    return readBody(req, function (body) {
      try {
        var payload = JSON.parse(body);
        var code = payload.code || "";
        var n = validateRaw(code); // throws on any problem
        var stamp = new Date().toISOString().replace(/[:.]/g, "-");
        fs.copyFileSync(DATA_FILE, path.join(BACKUP_DIR, "data-" + stamp + ".js"));
        fs.writeFileSync(DATA_FILE, code, "utf8");
        return sendJson(res, 200, { ok: true, count: n });
      } catch (e) { return sendJson(res, 400, { ok: false, error: e.message }); }
    });
  }

  if (p === "/api/validate" && req.method === "POST") {
    return readBody(req, function (body) {
      try {
        var payload = JSON.parse(body);
        var n = validateRaw(payload.code || "");
        return sendJson(res, 200, { ok: true, count: n });
      } catch (e) { return sendJson(res, 200, { ok: false, error: e.message }); }
    });
  }

  if (p === "/api/backups" && req.method === "GET") {
    var files = fs.readdirSync(BACKUP_DIR).filter(function (f) { return f.endsWith(".js"); }).sort().reverse();
    return sendJson(res, 200, { ok: true, backups: files });
  }

  if (p === "/api/restore" && req.method === "POST") {
    return readBody(req, function (body) {
      try {
        var payload = JSON.parse(body);
        var f = path.basename(payload.file || "");
        var src = path.join(BACKUP_DIR, f);
        if (!fs.existsSync(src)) { throw new Error("backup not found"); }
        var code = fs.readFileSync(src, "utf8");
        validateRaw(code);
        var stamp = new Date().toISOString().replace(/[:.]/g, "-");
        fs.copyFileSync(DATA_FILE, path.join(BACKUP_DIR, "data-" + stamp + "-before-restore.js"));
        fs.writeFileSync(DATA_FILE, code, "utf8");
        return sendJson(res, 200, { ok: true });
      } catch (e) { return sendJson(res, 400, { ok: false, error: e.message }); }
    });
  }

  // ---- static ----
  serveStatic(req, res, p);
});

server.listen(PORT, HOST, function () {
  console.log("");
  console.log("  Cao Bang Map — admin server running");
  console.log("  ┌─────────────────────────────────────────────┐");
  console.log("  │  Map:    http://" + HOST + ":" + PORT + "/            │");
  console.log("  │  Admin:  http://" + HOST + ":" + PORT + "/admin/      │");
  console.log("  └─────────────────────────────────────────────┘");
  console.log("  Backups saved to admin/backups/  ·  Ctrl+C to stop");
  console.log("");
});

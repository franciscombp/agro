// Finca Mulalillo — service worker con alcance ./ (subdirectorio).
// Debe funcionar sin señal en el campo: shell precacheado, librerías y tiles en caché.
"use strict";

const VERSION = "mulalillo-v12";
const SHELL = "mulalillo-shell-" + VERSION;
const TILES = "mulalillo-tiles";
const MAX_TILES = 1200;   // ~el área de la finca a varios niveles de zoom

const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "../ds/mal/mal.css",
  "../ds/mal/iconos.svg",
  "../ds/fonts/inter.woff2",
  "../ds/fonts/jetbrains-mono.woff2",
  "./app.js",
  "./db.js",
  "./geo.js",
  "./map2d.js",
  "./water.js",
  "./clima.js",
  "./hydraulics.js",
  "./planting.js",
  "./view3d.js",
  "./manifest.webmanifest",
  "./diagnostico.html",
  "./lib/maplibre-gl.js",
  "./lib/maplibre-gl.css",
  "./lib/three.module.min.js",
  "./lib/OrbitControls.js"
];

const TILE_HOSTS = ["server.arcgisonline.com"];

self.addEventListener("install", e => {
  // Uno por uno, no con addAll: en el campo una descarga grande puede fallar y
  // addAll es atómico — perderíamos todo el caché por un solo archivo.
  e.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    await Promise.all(ASSETS.map(url =>
      cache.add(url).catch(err => console.warn("[sw] no se pudo cachear", url, err))
    ));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k.startsWith("mulalillo-shell-") && k !== SHELL).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Tiles satelitales: caché primero (no cambian) con tope de entradas.
  if (TILE_HOSTS.includes(url.hostname)) {
    e.respondWith(cacheFirst(req, TILES, MAX_TILES));
    return;
  }

  if (url.origin !== location.origin) return;

  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(SHELL).then(c => c.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Librerías versionadas por nombre: caché primero, no cambian nunca.
  if (url.pathname.includes("/lib/")) {
    e.respondWith(cacheFirst(req, SHELL));
    return;
  }

  // Código propio (app.js, view3d.js, …): RED PRIMERO, caché como respaldo.
  // Servir caché primero dejaba mezclar módulos viejos con archivos nuevos del
  // servidor, y esa combinación rompe los imports hasta borrar el caché a mano.
  e.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(SHELL).then(c => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then(cached => cached || Response.error()))
  );
});

async function cacheFirst(req, cacheName, limit) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  if (hit) return hit;
  try {
    const res = await fetch(req);
    if (res.ok) {
      await cache.put(req, res.clone());
      if (limit) trim(cache, limit);
    }
    return res;
  } catch (err) {
    return hit || Response.error();
  }
}

async function trim(cache, limit) {
  const keys = await cache.keys();
  if (keys.length <= limit) return;
  for (const key of keys.slice(0, keys.length - limit)) await cache.delete(key);
}

// Precarga de tiles del área de la finca, pedida desde la app.
self.addEventListener("message", e => {
  if (e.data?.type !== "prefetch-tiles" || !Array.isArray(e.data.urls)) return;
  e.waitUntil((async () => {
    const cache = await caches.open(TILES);
    let ok = 0;
    for (const url of e.data.urls) {
      try {
        if (await cache.match(url)) { ok++; continue; }
        const res = await fetch(url, { mode: "cors" });
        if (res.ok) { await cache.put(url, res); ok++; }
      } catch (err) { /* sin señal: se reintenta en la próxima precarga */ }
    }
    const clients = await self.clients.matchAll();
    clients.forEach(c => c.postMessage({ type: "prefetch-done", cached: ok, total: e.data.urls.length }));
  })());
});

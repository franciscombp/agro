// Mi Huerto — service worker: funciona sin conexión.
// Estrategia: shell precacheado (stale-while-revalidate), navegación network-first,
// APIs externas network-first con último dato guardado como respaldo.
"use strict";

const VERSION = "v2";
const CACHE_SHELL = "mihuerto-shell-" + VERSION;
const CACHE_RUNTIME = "mihuerto-runtime";

const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./data.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE_SHELL).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k.startsWith("mihuerto-shell-") && k !== CACHE_SHELL).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    if (req.mode === "navigate") {
      // Navegación: red primero para recibir actualizaciones; sin conexión, el shell cacheado.
      e.respondWith(
        fetch(req).then(res => {
          caches.open(CACHE_SHELL).then(c => c.put("./index.html", res.clone()));
          return res;
        }).catch(() => caches.match("./index.html"))
      );
    } else {
      // Recursos propios: respuesta inmediata desde caché y actualización en segundo plano.
      e.respondWith(
        caches.match(req).then(cached => {
          const update = fetch(req).then(res => {
            if (res.ok) caches.open(CACHE_SHELL).then(c => c.put(req, res.clone()));
            return res;
          }).catch(() => cached);
          return cached || update;
        })
      );
    }
    return;
  }

  // APIs externas (clima, geocodificación): red primero; sin conexión, el último dato guardado.
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) caches.open(CACHE_RUNTIME).then(c => c.put(req, res.clone()));
      return res;
    }).catch(() => caches.match(req))
  );
});

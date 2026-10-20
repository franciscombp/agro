// La finca ya no vive en /mulalillo/: este service worker reemplaza al viejo
// en los teléfonos que lo tenían instalado, borra su caché y se da de baja,
// para que mande el de la raíz. Los tiles (mulalillo-tiles) se quedan: los usa
// la app nueva y bajarlos otra vez cuesta datos en el campo.
"use strict";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith("mulalillo-shell-")).map(k => caches.delete(k)));
    await self.registration.unregister();
  })());
});

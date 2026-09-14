# PoC — App de gestión, Finca Mulalillo

Prueba de concepto **independiente** de la app principal (*Mi Huerto*). Vive en este
subdirectorio y se publica en `/agro/mulalillo/`. No comparte código, estado ni
service worker con la app de la raíz: se puede borrar esta carpeta y la app principal
sigue funcionando igual.

Gestión de una finca de ~9.000 m² en Mulalillo, Salcedo, Cotopaxi. Móvil primero
(uso parado en el terreno) y usable en escritorio para planificar.

## Cómo correrla

```bash
npm install
npm run dev     # http://localhost:5173/agro/mulalillo/
npm run build   # emite dist/mulalillo/
```

`npm run dev` y `npm run build` ejecutan antes `scripts/vendor-mulalillo.mjs`, que copia
MapLibre y Three.js desde `node_modules` a `mulalillo/vendor/` (carpeta ignorada por git).

## Qué hay implementado

| Prioridad del brief | Estado |
|---|---|
| 1. Mapa + polígono + sectores con área calculada | ✅ |
| 2. Plantas con ficha y GPS | ✅ |
| 3. Tareas e historial | ✅ |
| 4. Módulo de agua | ✅ |
| 5. Vista 3D | ✅ |
| 6. Offline/PWA | ✅ caché y cola local; sincronización con servidor pendiente (ver *Límites*) |

**Mapa (vista principal).** Imagen satelital de Esri World Imagery, zoom hasta nivel de
árbol. Límite del terreno con vértices arrastrables; sectores dibujables toque a toque
con área geodésica en m² recalculada en vivo; plantas, infraestructura y puntos de
elevación como puntos arrastrables (botón ✥); botón GPS para colocar un punto donde
estás parado; filtros por especie, estado y sector; coloreado por especie o por estado
sanitario.

**Ficha de planta.** Especie, variedad, fecha de siembra con edad calculada, estado,
elevación interpolada, fotos (reescaladas a 1024 px antes de guardarse) e historial de
tareas — incluidas las del sector al que pertenece.

**Sectores.** Área y perímetro geodésicos, conteo de plantas por especie, rango de
elevación, riego estimado y tareas a nivel de sector.

**Agua.** Volumen estimado del reservorio partiendo del último dato duro (nivel medido
o llenado) descontando la demanda diaria; calculadora de autonomía; alerta bajo X días
con el déficit en m³ hasta el próximo turno; demanda por sector y por especie; calendario
del ciclo de 15 días de la junta de agua.

**3D.** Terreno interpolado por distancia inversa ponderada (IDW) desde los puntos de
elevación medidos, con exageración vertical configurable (1×–12×). Sectores, plantas e
infraestructura se proyectan **desde los mismos registros del mapa 2D** — no hay un
segundo modelo. Las flechas azules marcan la dirección de máxima pendiente descendente:
hacia dónde corre el agua por gravedad.

**Offline.** Service worker con alcance `./`: shell y librerías precacheadas, tiles
satelitales en caché con tope de 1.200 entradas y precarga del área de la finca
(Ajustes → «Descargar mapa del terreno», zoom 15–19). Toda escritura entra además en una
cola local (`outbox`) para sincronizar después.

## Datos

Los datos medidos en campo se siembran una sola vez en IndexedDB (`db.js`): el polígono
de 11 vértices, las 5 elevaciones, los sectores existentes y planificados, los 4
aguacates y 3 perales, la infraestructura y eventos de agua de ejemplo.

Superficie calculada: **9.675 m²**, perímetro 439 m. Desnivel **16,1 m** entre 2.786,84 y
2.802,91 msnm → **1,58 bar** de presión estática en el punto bajo (sin descontar pérdidas
por fricción, que hay que verificar según diámetro y caudal de la tubería).

Las alturas del centro, el cuyero y las secciones bajas son reales, pero sus **coordenadas
son estimadas**: aparecen en gris en el mapa y con la nota «coordenada estimada». Parado
en el punto, «Fijar con mi GPS» las corrige y el modelo de terreno se recalcula solo.

## Decisiones que se apartan del brief

- **Sin Next.js.** El repositorio se publica como sitio estático en GitHub Pages con Vite.
  Meter Next.js habría cambiado el despliegue de la app principal, que debe seguir igual.
  La PoC son módulos ES servidos tal cual; la funcionalidad del brief no lo necesitaba.
- **IndexedDB en lugar de Turso/Supabase.** No hay backend en GitHub Pages. IndexedDB
  cumple el requisito real (nada de `localStorage`, los datos sobreviven), y el traspaso
  celular↔escritorio se hace hoy con exportar/importar JSON.
- **Sin CDN.** MapLibre y Three.js se sirven desde la propia app para que la primera carga
  también funcione sin señal.
- **Dibujo propio en vez de mapbox-gl-draw.** Unas 120 líneas sobre fuentes GeoJSON, sin
  el desfase de versiones entre `mapbox-gl-draw` y MapLibre 4.

## Límites de la PoC

- **La sincronización real falta.** La cola local está lista y `db.flushOutbox(endpoint)`
  hace el POST por lote, pero no hay servidor al otro lado: en Ajustes se configura el
  endpoint y, sin él, los cambios quedan encolados. Para un manejo remoto de verdad
  (varias personas, celular y escritorio a la vez) hace falta ese servicio con
  autenticación y resolución de conflictos.
- Las fotos se guardan como data URL dentro de IndexedDB. Sirve para decenas de fotos,
  no para cientos: con sincronización deberían ir a almacenamiento de objetos.
- La demanda de agua usa litros/planta/día fijos por especie (`SPECIES` en `db.js`), sin
  ajuste por clima, edad ni etapa fenológica.
- El modelo de terreno interpola desde 5 puntos, 4 con coordenada aproximada. Cada punto
  que se tome con GPS lo mejora.
- La calculadora de riego por gravedad da la presión estática; no calcula pérdidas por
  fricción ni dimensiona tubería.

## Archivos

| Archivo | Qué hace |
|---|---|
| `index.html` | Shell: barra, seis vistas, hoja modal |
| `app.js` | Estado, navegación, fichas, formularios, GPS, ajustes, respaldo |
| `db.js` | IndexedDB, cola de sincronización, datos medidos, catálogo de especies |
| `geo.js` | Área y perímetro geodésicos, IDW de elevación, presión estática |
| `map2d.js` | MapLibre: capas, dibujo, arrastre de vértices y puntos |
| `water.js` | Demanda, volumen estimado, autonomía, turnos |
| `view3d.js` | Three.js: terreno, sectores, plantas, flechas de escurrimiento |
| `sw.js` | Caché offline y precarga de tiles |

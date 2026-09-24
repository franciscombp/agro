# 🌱 Mi Huerto

App web para **agricultura de subsistencia rural y huertos urbanos** (escala máxima 1–2 hectáreas). A diferencia de apps como OneSoil, pensadas para grandes cultivos, Mi Huerto está diseñada para el pequeño agricultor y el huerto familiar.

**Demo:** https://franciscombp.github.io/agro/

## Enfoque

- **Una decisión por pantalla**: diseño tipo Airbnb, baja carga cognitiva, curva de aprendizaje mínima.
- **JS puro, sin frameworks**: los datos del usuario se guardan en `localStorage`; Vite solo empaqueta para el deploy.
- **Datos reales de tu zona**, todos de APIs abiertas y sin key:
  - Geolocalización → altitud y clima vía [Open-Meteo](https://open-meteo.com/), incluida la **evapotranspiración (ET0)** para el balance de agua.
  - Nombre del poblado vía BigDataCloud.
  - Precios internacionales de referencia vía la API abierta del [Banco Mundial](https://datahelpdesk.worldbank.org/knowledgebase/articles/889392) (serie mensual de commodities), con valores de respaldo si no hay conexión.
  - Selección manual de zona (costa, valle, sierra, páramo) como alternativa sin permisos.

## Funcionalidades

- 🌾 **Catálogo de ~45 cultivos y animales** (hortalizas, granos, frutales, hierbas y crianza: cuyes, gallinas, cerdos, abejas…) filtrado por **altitud**, espacio y mes
- 📍 Detección del **poblado/ciudad** por geolocalización (BigDataCloud, sin key)
- 📅 **Almanaque**: pronóstico de 10 días con luna + lluvia + alerta de heladas, y calendario de siembra mes a mes
- 🌡️ **Estado del agua y El Niño**: mide cuánto llovió de verdad en los últimos 90 días en ese punto, lo compara con la mediana de 10 años de las mismas fechas y resta lo que evapora el sol. Con eso reordena el calendario de siembra (en año seco, arriba lo que aguanta con menos) y anota cultivo por cultivo si conviene sembrarlo ahora. La fase de El Niño / La Niña se declara a mano y se interpreta por región: en la sierra El Niño trae sequía y en la costa lo contrario, así que el mismo año no aconseja igual en Salcedo que en Guayaquil
- 🌱 **Mi huerto**: agrega lo que ya tienes sembrado o tus animales y sigue su progreso hasta la cosecha
- 💰 **Mercado**: libreta de precios de feria con tendencias y mini-gráficas, meses de mejor precio por producto ("¿cuándo vender mejor?"), precios internacionales de referencia (maíz, arroz, café, cacao, banano, azúcar y urea, traducidos a quintal/saco) y consejos de venta que rotan a diario
- 🌦️ Clima actual con **balance de agua semanal** (lluvia vs. lo que evapora el sol) y alertas de helada / lluvia fuerte
- 🔔 **Notificaciones nativas**: cosecha próxima o lista, buen día de siembra y aviso de riego en días secos
- 🌒 Calendario lunar con consejos de siembra tradicionales
- 🧮 **Calculadora de ganancia** por m², por planta, por árbol o por animal, con tres modelos: ciclo único, producción anual y producción mensual — precios referenciales de mercados de Ecuador
- 🪴 Filtro por espacio: macetas/balcón, huerto familiar o parcela
- 👆 Navegación por **swipe** entre pestañas; en tablet (desde 700 px) y escritorio, rail lateral y dos columnas
- 📲 **PWA instalable**: se agrega a la pantalla de inicio como app nativa y **funciona sin internet** (clave para zonas rurales con mala señal); guarda el último clima y los últimos precios consultados como respaldo offline

## Estructura

Todos los archivos de la app viven en la raíz del proyecto:

- `index.html` — pantallas y barra de pestañas (Hoy · Almanaque · Mercado · Mi huerto · Explorar)
- `ds/` — [mal-ds](https://github.com/franciscombp/mal/tree/main/ds) vendorizado y fijado a una versión: el sistema de diseño del proyecto. Lo consume la app de la finca (`mulalillo/`). Se actualiza con `npm run vendor:ds` y se comprueba con `npm run verifica:ds`. `ds/NOTAS-PARA-EL-SISTEMA.md` recoge lo aprendido usándolo
- `styles/fonts.css` — tipografía del proyecto (Inter y JetBrains Mono) apuntando a los archivos de `ds/fonts/`, no a una segunda copia. Desaparece cuando esta app migre a `ds/`
- `styles/design-system.css` — tokens heredados que todavía usa esta app; pendiente de migrar a `ds/`
- `styles.css` — componentes de esta app, mobile-first con rail lateral en desktop
- `app.js` — navegación, geolocalización, clima, almanaque, mercado, seguimiento, calculadora
- `data.js` — catálogo con rangos de altitud, meses de siembra y de mejor precio, costos y precios locales (Ecuador)
- `clima.js` — estado hídrico medido, fases de El Niño / La Niña por región y el consejo por cultivo. Clasifica la demanda de agua leyendo el campo `riego` que ya trae el catálogo, para no mantener el mismo dato en dos sitios
- `notify.js` — lógica de luna y notificaciones
- `sw.js` — service worker: shell precacheado, APIs con respaldo offline
- `manifest.webmanifest` + `icons/` — instalación como app

## Desarrollo

```bash
npm install
npm run dev      # abre http://localhost:5173/agro/
npm run build    # genera dist/ listo para GitHub Pages
```

## Deploy

GitHub Pages sirve la rama `main` directamente desde la raíz, así que lo publicado es lo
que está commiteado (incluidas `ds/` y `mulalillo/lib/`), no el resultado de `npm run build`.
`npm run build` sigue existiendo para comprobar que todo se copia bien y para un despliegue
que sí use `dist/`.

## PoC aparte: Finca Mulalillo

En `mulalillo/` vive una prueba de concepto independiente para la gestión de una finca
concreta: mapa satelital con sectores, plantas, tareas, módulo de agua y relieve 3D.
Se publica en `/agro/mulalillo/` con su propio service worker y no comparte código ni
datos con esta app. Detalles en [`mulalillo/README.md`](mulalillo/README.md).

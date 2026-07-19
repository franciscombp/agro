# 🌱 Mi Huerto

App web para **agricultura de subsistencia rural y huertos urbanos** (escala máxima 1–2 hectáreas). A diferencia de apps como OneSoil, pensadas para grandes cultivos, Mi Huerto está diseñada para el pequeño agricultor y el huerto familiar.

**Demo:** https://franciscombp.github.io/agro/

## Enfoque

- **Una decisión por pantalla**: diseño tipo Airbnb, baja carga cognitiva, curva de aprendizaje mínima.
- **100 % estática**: HTML + CSS + JS puro, sin build ni frameworks. Los datos del usuario se guardan en `localStorage`.
- **Datos reales de tu zona**:
  - Geolocalización del dispositivo → altitud y clima vía [Open-Meteo](https://open-meteo.com/) (API gratuita, sin key).
  - Selección manual de zona (costa, valle, sierra, páramo) como alternativa sin permisos.

## Funcionalidades

- 🌾 **Catálogo de ~45 cultivos y animales** (hortalizas, granos, frutales, hierbas y crianza: cuyes, gallinas, cerdos, abejas…) filtrado por **altitud**, espacio y mes
- 📍 Detección del **poblado/ciudad** por geolocalización (BigDataCloud, sin key)
- 📅 **Almanaque**: pronóstico de 10 días con luna + lluvia + alerta de heladas, y calendario de siembra mes a mes
- 🌱 **Mi huerto**: agrega lo que ya tienes sembrado o tus animales y sigue su progreso hasta la cosecha
- 🌦️ Clima actual, lluvia de la semana y alertas de helada / lluvia fuerte
- 🌒 Calendario lunar con consejos de siembra tradicionales
- 💰 **Calculadora de ganancia** por m², por planta, por árbol o por animal, con tres modelos: ciclo único, producción anual y producción mensual — precios referenciales de mercados de Ecuador
- 🪴 Filtro por espacio: macetas/balcón, huerto familiar o parcela

## Estructura

- `public/index.html` — pantallas y barra de pestañas (Hoy · Almanaque · Mi huerto · Explorar)
- `public/styles.css` — estilos mobile-first
- `public/app.js` — navegación, geolocalización, clima, almanaque, seguimiento, calculadora
- `public/data.js` — catálogo con rangos de altitud, meses de siembra, costos y precios locales (Ecuador)

## Desarrollo

No hay dependencias. Para probar en local:

```bash
cd public
python3 -m http.server 8000
# abre http://localhost:8000
```

## Deploy

Cada push a `main` publica `public/` en GitHub Pages (rama `gh-pages`) vía GitHub Actions.

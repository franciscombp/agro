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

- 🌾 Cultivos recomendados según **altitud** y **mes actual**
- 📅 Fechas de siembra y cosecha por cultivo
- 🌦️ Clima actual y lluvia de la semana
- 🌒 Calendario lunar con consejos de siembra tradicionales
- 💰 Calculadora de inversión, cosecha estimada y ganancia según el área sembrada
- 🪴 Filtro por espacio disponible: macetas/balcón, huerto familiar o parcela

## Estructura

- `public/index.html` — las 7 pantallas de la app
- `public/styles.css` — estilos mobile-first
- `public/app.js` — navegación, geolocalización, clima, luna, calculadora
- `public/data.js` — catálogo de cultivos con rangos de altitud, meses de siembra y costos

## Desarrollo

No hay dependencias. Para probar en local:

```bash
cd public
python3 -m http.server 8000
# abre http://localhost:8000
```

## Deploy

Cada push a `main` publica `public/` en GitHub Pages (rama `gh-pages`) vía GitHub Actions.

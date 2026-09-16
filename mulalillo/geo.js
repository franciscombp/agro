// Geometría en coordenadas GPS. Todo en lat/lng (WGS84), sin dependencias.
"use strict";

const R = 6378137; // radio terrestre, metros

/** Área geodésica de un anillo [[lat,lng],...] en m². Fórmula de Chamberlain-Duquette. */
export function areaM2(ring) {
  if (!ring || ring.length < 3) return 0;
  let total = 0;
  for (let i = 0; i < ring.length; i++) {
    const [lat1, lng1] = ring[i];
    const [lat2, lng2] = ring[(i + 1) % ring.length];
    total += toRad(lng2 - lng1) * (2 + Math.sin(toRad(lat1)) + Math.sin(toRad(lat2)));
  }
  return Math.abs(total * R * R / 2);
}

/** Perímetro en metros de un anillo cerrado. */
export function perimeterM(ring) {
  if (!ring || ring.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < ring.length; i++) {
    total += distanceM(ring[i], ring[(i + 1) % ring.length]);
  }
  return total;
}

/** Distancia haversine en metros entre dos [lat,lng]. */
export function distanceM(a, b) {
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Centroide simple (promedio de vértices). Suficiente a esta escala. */
export function centroid(ring) {
  const lat = ring.reduce((s, p) => s + p[0], 0) / ring.length;
  const lng = ring.reduce((s, p) => s + p[1], 0) / ring.length;
  return [lat, lng];
}

/** Caja contenedora: {minLat, maxLat, minLng, maxLng}. */
export function bbox(ring) {
  const lats = ring.map(p => p[0]);
  const lngs = ring.map(p => p[1]);
  return {
    minLat: Math.min(...lats), maxLat: Math.max(...lats),
    minLng: Math.min(...lngs), maxLng: Math.max(...lngs)
  };
}

/** Punto dentro de polígono (ray casting) sobre [lat,lng]. */
export function pointInRing(point, ring) {
  const [y, x] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const yi = ring[i][0], xi = ring[i][1];
    const yj = ring[j][0], xj = ring[j][1];
    const intersects = (yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

/** Proyección local a metros con origen dado: {x: este, y: norte}. */
export function toLocalMeters([lat, lng], origin) {
  const mPerDegLat = 111320;
  const mPerDegLng = 111320 * Math.cos(toRad(origin[0]));
  return {
    x: (lng - origin[1]) * mPerDegLng,
    y: (lat - origin[0]) * mPerDegLat
  };
}

/**
 * Interpolación de elevación por distancia inversa ponderada (IDW).
 * points: [{lat, lng, elevationM}]. power 2 da transiciones suaves.
 */
export function interpolateElevation([lat, lng], points, power = 2) {
  if (!points.length) return null;
  let num = 0, den = 0;
  for (const p of points) {
    const d = distanceM([lat, lng], [p.lat, p.lng]);
    if (d < 0.5) return p.elevationM; // sobre el punto medido
    const w = 1 / Math.pow(d, power);
    num += w * p.elevationM;
    den += w;
  }
  return num / den;
}

/** Presión estática en bar por diferencia de altura en metros (1 m ≈ 0,0981 bar). */
export function staticPressureBar(deltaM) {
  return deltaM * 0.0980665;
}

/** Convierte [lat,lng][] a anillo GeoJSON [lng,lat][] cerrado. */
export function toGeoJSONRing(ring) {
  const out = ring.map(([lat, lng]) => [lng, lat]);
  if (out.length && (out[0][0] !== out[out.length - 1][0] || out[0][1] !== out[out.length - 1][1])) {
    out.push(out[0]);
  }
  return out;
}

function toRad(d) { return (d * Math.PI) / 180; }

export function fmtArea(m2) {
  if (m2 >= 10000) return (m2 / 10000).toFixed(2).replace('.', ',') + ' ha';
  return Math.round(m2).toLocaleString('es-EC') + ' m²';
}

export function fmtM(m) {
  return m >= 1000 ? (m / 1000).toFixed(2).replace('.', ',') + ' km' : Math.round(m) + ' m';
}

/** Inversa de toLocalMeters: de {x, y} en metros a [lat, lng]. */
export function fromLocalMeters({ x, y }, origin) {
  const mPerDegLat = 111320;
  const mPerDegLng = 111320 * Math.cos(toRad(origin[0]));
  return [origin[0] + y / mPerDegLat, origin[1] + x / mPerDegLng];
}

/** Distancia en metros de un punto local a un segmento local. */
export function distanceToSegment(p, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(p.x - a.x, p.y - a.y);
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

/** Distancia mínima en metros de un punto [lat,lng] al borde de un anillo. */
export function distanceToEdgeM(point, ring) {
  const origin = centroid(ring);
  const p = toLocalMeters(point, origin);
  const local = ring.map(v => toLocalMeters(v, origin));
  let min = Infinity;
  for (let i = 0; i < local.length; i++) {
    min = Math.min(min, distanceToSegment(p, local[i], local[(i + 1) % local.length]));
  }
  return min;
}

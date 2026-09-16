// Marco de siembra: genera las posiciones de las plantas dentro de un sector.
// Sembrar 380 arándanos tocando la pantalla una por una no es trabajo de campo.
"use strict";

import {
  centroid, toLocalMeters, fromLocalMeters, pointInRing,
  distanceToSegment, areaM2
} from './geo.js';

/** Marcos habituales; el usuario puede cambiar cualquier número. */
export const LAYOUTS = {
  rectangular: { label: 'Rectangular (calles rectas)' },
  tresbolillo: { label: 'Tresbolillo (filas alternadas)' }
};

/**
 * Posiciones de siembra dentro de un polígono.
 *
 * @param polygon      anillo [[lat,lng], …]
 * @param spacingM     distancia entre plantas dentro de la hilera
 * @param rowSpacingM  distancia entre hileras
 * @param angleDeg     orientación de las hileras (0 = este–oeste)
 * @param marginM      separación mínima al borde del sector
 * @param layout       'rectangular' | 'tresbolillo'
 * @returns [[lat,lng], …]
 */
export function layoutPoints({
  polygon, spacingM = 2.5, rowSpacingM = 2.5, angleDeg = 0,
  marginM = 1, layout = 'rectangular'
}) {
  if (!polygon || polygon.length < 3 || spacingM <= 0 || rowSpacingM <= 0) return [];

  const origin = centroid(polygon);
  const local = polygon.map(p => toLocalMeters(p, origin));
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(-rad);
  const sin = Math.sin(-rad);

  // Al girar el sector, las hileras quedan paralelas a un eje y la rejilla es trivial.
  const rot = ({ x, y }) => ({ x: x * cos - y * sin, y: x * sin + y * cos });
  const unrot = ({ x, y }) => ({ x: x * cos + y * sin, y: -x * sin + y * cos });

  const rotated = local.map(rot);
  const xs = rotated.map(p => p.x);
  const ys = rotated.map(p => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);

  const out = [];
  const staggered = layout === 'tresbolillo';
  let row = 0;

  for (let y = minY; y <= maxY + 1e-6; y += rowSpacingM, row++) {
    const offset = staggered && row % 2 === 1 ? spacingM / 2 : 0;
    for (let x = minX + offset; x <= maxX + 1e-6; x += spacingM) {
      const localPoint = unrot({ x, y });
      const latlng = fromLocalMeters(localPoint, origin);
      if (!pointInRing(latlng, polygon)) continue;
      if (marginM > 0 && edgeDistance(localPoint, local) < marginM) continue;
      out.push(latlng);
    }
  }
  return out;
}

function edgeDistance(p, localRing) {
  let min = Infinity;
  for (let i = 0; i < localRing.length; i++) {
    min = Math.min(min, distanceToSegment(p, localRing[i], localRing[(i + 1) % localRing.length]));
  }
  return min;
}

/**
 * Resumen previo a sembrar: cuántas plantas caben y qué densidad resulta.
 * Sirve para contrastar con el plan (por ejemplo, ~380 arándanos).
 */
export function preview(params) {
  const points = layoutPoints(params);
  const area = areaM2(params.polygon);
  return {
    points,
    count: points.length,
    areaM2: area,
    densityPerHa: area > 0 ? Math.round((points.length / area) * 10000) : 0,
    m2PerPlant: points.length ? area / points.length : 0
  };
}

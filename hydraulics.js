// Riego por gravedad: presión disponible en un punto y pérdidas por fricción.
// El brief deja esto abierto ("verificar pérdidas por fricción"); aquí está el cálculo.
"use strict";

import { staticPressureBar, distanceM } from './geo.js';

/** Diámetros comerciales de polietileno/PVC habituales en riego, en mm (interior aprox.). */
export const DIAMETERS_MM = [16, 20, 25, 32, 40, 50, 63];

/** Coeficiente de Hazen-Williams: 150 para PE y PVC lisos. */
export const C_PE = 150;

/**
 * Pérdida de carga por fricción en metros de columna de agua (Hazen-Williams).
 * hf = 10,67 · L · Q^1,852 / (C^1,852 · D^4,87)   [Q en m³/s, D en m]
 * Válida para agua a temperatura ambiente y régimen turbulento, que es el caso.
 */
export function frictionLossM({ flowLps, diameterMm, lengthM, C = C_PE }) {
  if (!flowLps || !diameterMm || !lengthM) return 0;
  const Q = flowLps / 1000;
  const D = diameterMm / 1000;
  return (10.67 * lengthM * Math.pow(Q, 1.852)) / (Math.pow(C, 1.852) * Math.pow(D, 4.87));
}

/** Velocidad del agua en m/s. Por encima de ~1,5 m/s conviene subir de diámetro. */
export function velocityMs({ flowLps, diameterMm }) {
  if (!flowLps || !diameterMm) return 0;
  const area = Math.PI * Math.pow(diameterMm / 2000, 2); // m²
  return flowLps / 1000 / area;
}

/**
 * Caudal de diseño a partir de la demanda diaria y las horas de riego.
 * Regar 200 L en 2 h no es lo mismo que en 30 min: el caudal manda en las pérdidas.
 */
export function designFlowLps(demandLitresPerDay, irrigationHours = 2) {
  if (!demandLitresPerDay || !irrigationHours) return 0;
  return demandLitresPerDay / (irrigationHours * 3600);
}

/** Rango de trabajo típico de un gotero autocompensado. */
export const DRIPPER_MIN_BAR = 1.0;
export const DRIPPER_MAX_BAR = 3.5;

/**
 * Balance completo entre el reservorio y un punto de riego.
 * `extraLengthFactor` cubre que la tubería no va en línea recta (1,25 = +25 %).
 */
export function pressureAt({
  sourceElevationM, targetElevationM, sourceLatLng, targetLatLng,
  demandLitresPerDay, irrigationHours = 2, diameterMm = 25,
  extraLengthFactor = 1.25, lengthM = null, C = C_PE
}) {
  const dropM = sourceElevationM - targetElevationM;
  const staticBar = staticPressureBar(dropM);
  const pipeLengthM = lengthM != null
    ? lengthM
    : distanceM(sourceLatLng, targetLatLng) * extraLengthFactor;

  const flowLps = designFlowLps(demandLitresPerDay, irrigationHours);
  const lossM = frictionLossM({ flowLps, diameterMm, lengthM: pipeLengthM, C });
  const netM = dropM - lossM;
  const netBar = staticPressureBar(netM);
  const velocity = velocityMs({ flowLps, diameterMm });

  return {
    dropM, staticBar, pipeLengthM, flowLps, lossM, netM, netBar, velocity,
    lossShare: dropM > 0 ? lossM / dropM : 0,
    ok: netBar >= DRIPPER_MIN_BAR && netBar <= DRIPPER_MAX_BAR,
    tooLow: netBar < DRIPPER_MIN_BAR,
    tooHigh: netBar > DRIPPER_MAX_BAR,
    fastFlow: velocity > 1.5
  };
}

/** El diámetro comercial más pequeño que deja la presión en rango y la velocidad sana. */
export function suggestDiameter(params) {
  for (const diameterMm of DIAMETERS_MM) {
    const r = pressureAt({ ...params, diameterMm });
    if (!r.tooLow && !r.fastFlow) return { diameterMm, result: r };
  }
  const diameterMm = DIAMETERS_MM[DIAMETERS_MM.length - 1];
  return { diameterMm, result: pressureAt({ ...params, diameterMm }), insufficient: true };
}

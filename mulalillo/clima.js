// Clima de la finca: lo que evapora el sol y lo que cae del cielo.
//
// Hasta ahora la demanda de agua eran litros/planta/día fijos por especie. Eso
// da el mismo número el día que llueve 20 mm y el día que hace sol de páramo a
// 2.800 m, y en una finca que depende de un turno de 5 horas cada 15 días esa
// diferencia ES la decisión: si el reservorio aguanta hasta el próximo turno o
// hay que llamar al tanquero.
//
// Dos números por día, los dos de Open-Meteo (sin clave):
//   · ET0 — evapotranspiración de referencia FAO-56, mm/día: cuánta agua pide
//     la atmósfera. Es la que convierte "hace calor" en un número regable.
//   · Lluvia, mm/día, que se descuenta de lo que hay que reponer.
//
// Se pide en una sola llamada el pasado reciente y el pronóstico, porque las
// dos preguntas de la finca son distintas: "¿cuánto gasté?" mira atrás y
// "¿me alcanza hasta el turno?" mira adelante.
//
// Todo se guarda en IndexedDB. Sin señal la app sigue calculando con lo último
// que bajó, y si nunca bajó nada, con el clima de referencia: ahí los números
// son exactamente los de antes de existir este archivo.
"use strict";

import * as db from './db.js';

/* Clima de referencia de la zona: sierra centro, ~2.800 m. Es el valor con el
   que se calibraron los litros/planta/día del catálogo, así que sirve de
   respaldo sin cambiar ningún número histórico. */
export const ET0_REF = 3.5;      // mm/día
export const PASADO = 14;
export const FUTURO = 7;

/* Agua que el suelo retiene en la zona de raíces y la planta puede ir sacando,
   en mm. Sin esto el modelo olvida la lluvia al día siguiente de caer: diría
   "no llegas al turno" el día después de un aguacero, que es justo cuando no
   hay que regar. 25 mm es prudente para el suelo volcánico de la zona, que
   retiene bastante; se queda corto antes que largo, que es el lado por el que
   conviene equivocarse cuando el error se paga quedándose sin agua. */
export const RESERVA_SUELO_MM = 25;

/* Kc medio de la finca, sólo para estimar cuánto se vacía el suelo en los días
   pasados. El Kc de cada planta se aplica planta por planta en water.js. */
const KC_MEDIO = 0.85;

const CACHE_ID = 'clima';
const FRESCO_H = 6;              // el pronóstico no cambia más rápido que esto

/**
 * Lluvia aprovechable de un día, en mm.
 *
 * No toda la que cae llega a la raíz: la llovizna se evapora de la hoja y del
 * polvo sin mojar el suelo, y el aguacero fuerte se va en escorrentía por una
 * loma con 16 m de desnivel. La regla es la simplificación habitual (FAO-56
 * para cálculo diario): los primeros 2 mm no cuentan y del resto se aprovecha
 * el 75 %.
 */
export function lluviaEfectiva(mm) {
  if (!(mm > 2)) return 0;
  return (mm - 2) * 0.75;
}

/**
 * Cuánta agua le queda al suelo hoy, siguiendo día a día los últimos datos.
 *
 * Arranca en cero a propósito: suponer el suelo lleno sería regalarle a la
 * finca agua que quizá no tiene. Dos semanas de serie bastan para que el
 * arranque deje de pesar — si llovió, la reserva sube sola.
 */
export function reservaSuelo(dias, { max = RESERVA_SUELO_MM, kc = KC_MEDIO } = {}) {
  let r = 0;
  for (const d of dias) {
    r = Math.min(max, r + lluviaEfectiva(d.lluvia));
    r = Math.max(0, r - (d.et0 ?? ET0_REF) * kc);
  }
  return r;
}

/** Los datos que se guardan, listos para calcular sin volver a pedir nada. */
function normaliza(json) {
  const t = json?.daily?.time || [];
  const et0 = json?.daily?.et0_fao_evapotranspiration || [];
  const lluvia = json?.daily?.precipitation_sum || [];
  if (!t.length) return null;

  const dias = t.map((date, i) => ({
    date,
    et0: typeof et0[i] === 'number' ? et0[i] : null,
    lluvia: typeof lluvia[i] === 'number' ? lluvia[i] : 0
  })).filter(d => d.et0 != null);

  return dias.length ? { dias, bajado: new Date().toISOString() } : null;
}

/**
 * Baja el clima del punto de la finca y lo guarda. Devuelve la serie, o la
 * guardada si la red falla. Nunca lanza: quedarse sin clima degrada el cálculo,
 * no rompe la pantalla.
 */
export async function refrescar([lat, lng], { forzar = false } = {}) {
  const guardado = await leerCache();
  if (!forzar && guardado && horasDesde(guardado.bajado) < FRESCO_H) return guardado;

  try {
    const url = 'https://api.open-meteo.com/v1/forecast' +
      `?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&timezone=auto` +
      `&past_days=${PASADO}&forecast_days=${FUTURO}` +
      '&daily=et0_fao_evapotranspiration,precipitation_sum';
    const json = await fetch(url).then(r => r.ok ? r.json() : Promise.reject(r.status));
    const serie = normaliza(json);
    if (!serie) return guardado;
    await db.saveMeta({ id: CACHE_ID, ...serie });
    return serie;
  } catch {
    return guardado;   // sin señal: lo último que bajó sigue sirviendo
  }
}

export async function leerCache() {
  const c = await db.get('meta', CACHE_ID);
  return c?.dias?.length ? c : null;
}

/**
 * Convierte la serie guardada en lo que el módulo de agua necesita: el día de
 * hoy, la media reciente y el pronóstico, más de dónde salió cada cosa para
 * poder decirlo en pantalla en vez de mostrar un número sin origen.
 */
export function contexto(serie) {
  const hoy = new Date().toISOString().slice(0, 10);
  if (!serie?.dias?.length) {
    return {
      conocido: false,
      et0Hoy: ET0_REF, lluviaHoy: 0,
      et0Medio: ET0_REF,
      reservaMm: 0,
      futuro: [],
      origen: 'clima de referencia de la zona'
    };
  }

  const dias = serie.dias;
  const hoyD = dias.find(d => d.date === hoy);
  const pasados = dias.filter(d => d.date < hoy).slice(-PASADO);
  const futuro = dias.filter(d => d.date >= hoy);

  const media = xs => xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : ET0_REF;

  return {
    conocido: true,
    et0Hoy: hoyD?.et0 ?? media(pasados.map(d => d.et0)),
    lluviaHoy: hoyD?.lluvia ?? 0,
    et0Medio: media(pasados.map(d => d.et0)),
    lluviaPasada: pasados.reduce((s, d) => s + d.lluvia, 0),
    lluviaEfectivaPasada: pasados.reduce((s, d) => s + lluviaEfectiva(d.lluvia), 0),
    reservaMm: reservaSuelo(pasados),
    reservaMaxMm: RESERVA_SUELO_MM,
    diasPasados: pasados.length,
    futuro,
    lluviaFutura: futuro.reduce((s, d) => s + d.lluvia, 0),
    bajado: serie.bajado,
    horas: horasDesde(serie.bajado),
    origen: 'Open-Meteo'
  };
}

function horasDesde(iso) {
  if (!iso) return Infinity;
  return (Date.now() - new Date(iso).getTime()) / 3600000;
}

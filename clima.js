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
import { diaLocal } from './fechas.js';

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

/* Cuánto se pide de una vez. La misma llamada sirve a tres preguntas, así
   que trae lo que necesita la más exigente de cada lado:
     · 92 días atrás: la lluvia de 90 días contra lo normal (El Niño) y las
       dos semanas que usa la reserva del suelo;
     · 10 días adelante: los 7 de la proyección del reservorio y los 10 del
       calendario de siembra;
     · el tiempo de ahora, para la pantalla Hoy.
   Antes la finca y el huerto pedían cada uno lo suyo por separado. */
const PEDIR_PASADO = 92;
const PEDIR_FUTURO = 10;

/** Los datos que se guardan, listos para calcular sin volver a pedir nada. */
export function normaliza(json) {
  const d = json?.daily || {};
  const t = d.time || [];
  if (!t.length) return null;
  const val = (arr, i) => (Array.isArray(arr) && typeof arr[i] === 'number' ? arr[i] : null);

  const dias = t.map((date, i) => ({
    date,
    et0: val(d.et0_fao_evapotranspiration, i),
    lluvia: val(d.precipitation_sum, i) ?? 0,
    tmax: val(d.temperature_2m_max, i),
    tmin: val(d.temperature_2m_min, i),
    code: val(d.weather_code, i),
    // Para el riesgo de hongos (hongos.js): humedad media y horas con lluvia.
    hr: val(d.relative_humidity_2m_mean, i),
    horasLluvia: val(d.precipitation_hours, i)
  })).filter(x => x.et0 != null);

  const c = json?.current;
  const actual = c && typeof c.temperature_2m === 'number'
    ? { temp: c.temperature_2m, humedad: c.relative_humidity_2m ?? null, code: c.weather_code ?? null }
    : null;

  return dias.length ? { dias, actual, bajado: new Date().toISOString() } : null;
}

/**
 * Baja el clima del punto de la finca y lo guarda. Devuelve la serie, o la
 * guardada si la red falla. Nunca lanza: quedarse sin clima degrada el cálculo,
 * no rompe la pantalla.
 */
export async function refrescar([lat, lng], { forzar = false } = {}) {
  const guardado = await leerCache();
  // Una caché de antes de juntar las llamadas no trae los 90 días, y una de
  // antes del aviso de hongos no trae la humedad: las dos se renuevan.
  const completa = guardado && guardado.dias.length > PASADO + FUTURO + 5 && guardado.dias.some(d => 'hr' in d);
  if (!forzar && completa && horasDesde(guardado.bajado) < FRESCO_H) return guardado;

  try {
    const url = extra => 'https://api.open-meteo.com/v1/forecast' +
      `?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&timezone=auto` +
      `&past_days=${PEDIR_PASADO}&forecast_days=${PEDIR_FUTURO}` +
      '&daily=et0_fao_evapotranspiration,precipitation_sum,temperature_2m_max,temperature_2m_min,weather_code' + extra +
      '&current=temperature_2m,relative_humidity_2m,weather_code';
    // La humedad es para el aviso de hongos, que es un extra: si la API la
    // rechaza (400), se pide lo de siempre y el agua sigue calculándose.
    let r = await fetch(url(',relative_humidity_2m_mean,precipitation_hours'));
    if (r.status === 400) r = await fetch(url(''));
    const json = await (r.ok ? r.json() : Promise.reject(r.status));
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
export function contexto(serie, { reservaMax = RESERVA_SUELO_MM, lluviaLocal = null, reservaMedida = null } = {}) {
  const hoy = diaLocal();
  if (!serie?.dias?.length) {
    return {
      conocido: false,
      et0Hoy: ET0_REF, lluviaHoy: 0,
      et0Medio: ET0_REF,
      reservaMm: reservaMedida != null ? Math.min(reservaMax, reservaMedida) : 0,
      reservaOrigen: reservaMedida != null ? 'sonda' : 'estimada',
      reservaMaxMm: reservaMax,
      futuro: [], pronostico: [], hoyD: null, actual: null,
      origen: 'clima de referencia de la zona'
    };
  }

  /* Lo medido en la finca manda sobre el modelo. Open-Meteo calcula la lluvia
     en una malla de kilómetros; un pluviómetro en la loma mide la que cayó
     ahí. Sólo se sustituyen los días que el pluviómetro reportó (sensores.js
     ya descarta los días en que estuvo caído). */
  const dias = lluviaLocal
    ? serie.dias.map(d => lluviaLocal[d.date] != null
        ? { ...d, lluvia: lluviaLocal[d.date], lluviaMedida: true } : d)
    : serie.dias;
  const hoyD = dias.find(d => d.date === hoy);
  const pasados = dias.filter(d => d.date < hoy).slice(-PASADO);
  // La proyección del reservorio usa 7 días; el calendario de siembra, todos.
  const pronostico = dias.filter(d => d.date >= hoy);
  const futuro = pronostico.slice(0, FUTURO);

  const media = xs => xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : ET0_REF;

  return {
    conocido: true,
    et0Hoy: hoyD?.et0 ?? media(pasados.map(d => d.et0)),
    lluviaHoy: hoyD?.lluvia ?? 0,
    et0Medio: media(pasados.map(d => d.et0)),
    lluviaPasada: pasados.reduce((s, d) => s + d.lluvia, 0),
    lluviaEfectivaPasada: pasados.reduce((s, d) => s + lluviaEfectiva(d.lluvia), 0),
    // Con sonda, la reserva es la medida; sin ella, la estimada con el
    // balance de los últimos días. La pantalla dice cuál de las dos es.
    pasados,
    reservaMm: reservaMedida != null ? Math.min(reservaMax, reservaMedida) : reservaSuelo(pasados, { max: reservaMax }),
    reservaOrigen: reservaMedida != null ? 'sonda' : 'estimada',
    reservaMaxMm: reservaMax,
    diasPluviometro: dias.filter(d => d.lluviaMedida && d.date < hoy).length,
    diasPasados: pasados.length,
    futuro,
    lluviaFutura: futuro.reduce((s, d) => s + d.lluvia, 0),
    pronostico,
    hoyD: hoyD || null,
    actual: serie.actual || null,
    bajado: serie.bajado,
    horas: horasDesde(serie.bajado),
    origen: 'Open-Meteo'
  };
}

function horasDesde(iso) {
  if (!iso) return Infinity;
  return (Date.now() - new Date(iso).getTime()) / 3600000;
}

/**
 * Lluvia y evaporación de los últimos 90 días, para comparar con lo normal
 * (El Niño). Sale de la misma serie que lo demás: no hace otra llamada.
 */
export function ultimos90(serie) {
  const hoy = diaLocal();
  const pasados = (serie?.dias || []).filter(d => d.date < hoy).slice(-90);
  if (pasados.length < 80) return null;
  return {
    lluvia90: pasados.reduce((s, d) => s + (d.lluvia || 0), 0),
    et090: pasados.reduce((s, d) => s + (d.et0 || 0), 0),
    dias: pasados.length
  };
}

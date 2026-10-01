// Lecturas de sensores: de lo que mande cada plataforma a una sola forma.
//
// Este archivo lo usan DOS programas: el receptor (receptor/worker.js), que
// guarda lo que llega de The Things Network o Home Assistant, y la app, que lo
// usa para el modo de prueba. Si cada uno tuviera su propia traducción, el día
// que discreparan un nivel de agua se leería distinto en el servidor y en el
// teléfono, y nadie sabría cuál creer. Por eso vive aquí, sin dependencias, y
// sin tocar nada del navegador ni del servidor.
//
// Una lectura normalizada es siempre:
//
//   { id, dispositivo, tipo, valor, unidad, fecha, fuente }
//
//   tipo: 'distancia'      m  — lo que mide un ultrasónico: del sensor al agua
//         'nivel'          m  — altura de agua sobre el fondo, si el sensor ya
//                              la entrega calculada
//         'lluvia'         mm — acumulada en el intervalo de la lectura
//         'humedad_suelo'  %  — contenido volumétrico de agua (VWC)
//         'caudal'         L  — volumen; según el aparato, lo pasado desde la
//                              lectura anterior o un total acumulado (lo dice
//                              la configuración del aparato en la app)
//         'pulsos'            — cuenta de un contador de pulsos; los litros
//                              por pulso los pone quien instaló el medidor
//         'bateria'        V o % según el aparato
//         'temperatura'    °C
"use strict";

export const TIPOS = {
  distancia: { unidad: 'm', etiqueta: 'Distancia al agua' },
  nivel: { unidad: 'm', etiqueta: 'Nivel de agua' },
  lluvia: { unidad: 'mm', etiqueta: 'Lluvia' },
  humedad_suelo: { unidad: '%', etiqueta: 'Humedad del suelo' },
  caudal: { unidad: 'L', etiqueta: 'Caudal' },
  pulsos: { unidad: '', etiqueta: 'Pulsos' },
  bateria: { unidad: '', etiqueta: 'Batería' },
  temperatura: { unidad: '°C', etiqueta: 'Temperatura' }
};

/* Nombres de campo que usan los fabricantes para lo mismo. No hay estándar:
   Dragino manda `distance` en mm, Milesight `distance` en mm o `level` en cm
   según el modelo, otros `water_level`. Cada entrada dice a qué tipo va y por
   cuánto multiplicar para llegar a la unidad de la app.

   El orden importa: si un mensaje trae `distance_mm` y `distance`, gana el
   primero que aparece aquí, que es el que dice su unidad en el nombre. */
const CAMPOS = [
  // distancia del sensor a la superficie del agua
  ['distance_mm', 'distancia', 0.001],
  ['distance_cm', 'distancia', 0.01],
  ['distance_m', 'distancia', 1],
  ['distance', 'distancia', 0.001],            // Dragino LDDS75 y la mayoría: mm
  ['Distance', 'distancia', 0.001],
  // nivel ya calculado
  ['water_level_m', 'nivel', 1],
  ['water_level_cm', 'nivel', 0.01],
  ['water_level', 'nivel', 0.01],              // suele venir en cm
  ['level_cm', 'nivel', 0.01],
  // lluvia
  ['rainfall_mm', 'lluvia', 1],
  ['rainfall', 'lluvia', 1],
  ['rain_mm', 'lluvia', 1],
  ['rain', 'lluvia', 1],
  ['precipitation', 'lluvia', 1],
  // humedad de suelo (VWC, %)
  ['soil_moisture', 'humedad_suelo', 1],
  ['water_SOIL', 'humedad_suelo', 1],          // Dragino LSE01
  ['vwc', 'humedad_suelo', 1],
  ['moisture', 'humedad_suelo', 1],
  // caudal
  ['water_liters', 'caudal', 1],
  ['volume_l', 'caudal', 1],
  ['flow_l', 'caudal', 1],
  ['total_l', 'caudal', 1],
  ['water_m3', 'caudal', 1000],
  // contadores de pulsos (nodos genéricos con entrada de pulsos)
  ['pulse_count', 'pulsos', 1],
  ['count', 'pulsos', 1],
  ['Count', 'pulsos', 1],
  // temperatura
  ['temperature', 'temperatura', 1],
  ['TempC_SHT', 'temperatura', 1],
  ['temp_SOIL', 'temperatura', 1],
  // batería
  ['battery_v', 'bateria', 1],
  ['BatV', 'bateria', 1],                      // Dragino: voltios
  ['Bat', 'bateria', 1],
  ['battery', 'bateria', 1]                    // Milesight: %
];

/* Home Assistant manda una entidad con su `device_class`. */
const CLASES_HA = {
  distance: 'distancia',
  precipitation: 'lluvia',
  moisture: 'humedad_suelo',
  water: 'caudal',
  volume: 'caudal',
  battery: 'bateria',
  temperature: 'temperatura'
};

/* Factores para pasar las unidades de HA a las de la app. */
const UNIDADES = {
  mm: { distancia: 0.001, nivel: 0.001, lluvia: 1 },
  cm: { distancia: 0.01, nivel: 0.01, lluvia: 10 },
  m: { distancia: 1, nivel: 1 },
  in: { lluvia: 25.4, distancia: 0.0254 },
  L: { caudal: 1 },
  'm³': { caudal: 1000 },
  m3: { caudal: 1000 },
  gal: { caudal: 3.785 }
};

function numero(v) {
  const n = typeof v === 'string' ? Number(v.replace(',', '.')) : v;
  return typeof n === 'number' && Number.isFinite(n) ? n : null;
}

function fechaIso(v) {
  const d = v ? new Date(v) : new Date();
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function lectura(dispositivo, tipo, valor, fecha, fuente, sufijo) {
  return {
    id: `${dispositivo}:${tipo}:${fecha}${sufijo ? ':' + sufijo : ''}`,
    dispositivo, tipo, valor,
    unidad: TIPOS[tipo]?.unidad ?? '',
    fecha, fuente
  };
}

/**
 * Mensaje de subida de The Things Network v3 (webhook "uplink message").
 * Necesita que la aplicación de TTN tenga un formateador de carga útil que
 * entregue `decoded_payload`: los de Dragino y Milesight vienen en el
 * repositorio de dispositivos de TTN y se activan al registrar el aparato.
 */
export function desdeTTN(msg) {
  const dispositivo = msg?.end_device_ids?.device_id;
  const up = msg?.uplink_message;
  const datos = up?.decoded_payload;
  if (!dispositivo || !datos || typeof datos !== 'object') return [];

  const fecha = fechaIso(msg.received_at || up.received_at);
  // f_cnt hace único el mensaje: TTN reintenta el webhook si no recibe un 200,
  // y sin esto un reintento duplicaría la lectura.
  const sufijo = up.f_cnt != null ? `f${up.f_cnt}` : '';
  const out = [];
  const vistos = new Set();

  for (const [campo, tipo, factor] of CAMPOS) {
    if (vistos.has(tipo) || !(campo in datos)) continue;
    const v = numero(datos[campo]);
    if (v == null) continue;
    vistos.add(tipo);
    out.push(lectura(dispositivo, tipo, round(v * factor), fecha, 'ttn', sufijo));
  }
  return out;
}

/**
 * Cambio de estado de una entidad de Home Assistant, tal como lo envía un
 * `rest_command` o una automatización con el estado y sus atributos.
 */
export function desdeHA(msg) {
  const entidad = msg?.entity_id;
  const attrs = msg?.attributes || {};
  const tipo = CLASES_HA[attrs.device_class] || msg?.tipo;
  const v = numero(msg?.state);
  if (!entidad || !tipo || v == null) return [];

  const unidadHA = attrs.unit_of_measurement;
  const factor = UNIDADES[unidadHA]?.[tipo] ?? 1;
  const fecha = fechaIso(msg.last_updated || msg.last_changed);
  return [lectura(entidad, tipo, round(v * factor), fecha, 'ha')];
}

/**
 * Formato propio, para cualquier cosa que no sea TTN ni HA: un ESP32 casero,
 * una hoja de cálculo, un script. Ya viene en las unidades de la app.
 *   { dispositivo, tipo, valor, fecha? }   o una lista de ellos
 */
export function desdeJSON(msg) {
  const lista = Array.isArray(msg) ? msg : [msg];
  const out = [];
  for (const m of lista) {
    if (!m?.dispositivo || !TIPOS[m.tipo]) continue;
    const v = numero(m.valor);
    if (v == null) continue;
    out.push(lectura(String(m.dispositivo), m.tipo, round(v), fechaIso(m.fecha), m.fuente || 'json'));
  }
  return out;
}

/** Elige el traductor según la forma del mensaje. */
export function normaliza(msg) {
  if (msg?.end_device_ids && msg?.uplink_message) return desdeTTN(msg);
  if (msg?.entity_id) return desdeHA(msg);
  return desdeJSON(msg);
}

function round(v) {
  return Math.round(v * 10000) / 10000;
}

// Sensores: lo que pasa entre el receptor y el modelo de agua.
//
// El modelo de agua no sabe nada de sensores, y así debe seguir. Este archivo
// traduce lecturas a cosas que el modelo YA entiende:
//
//   · el ultrasónico del reservorio → eventos `medición_nivel`, los mismos que
//     hoy se anotan a mano. El modelo ya reinicia el saldo con cada uno, así
//     que el sensor no cambia una línea del cálculo: sólo lo alimenta a diario
//     en vez de cuando alguien se acuerda de medir.
//   · el pluviómetro → lluvia por día, que sustituye a la del modelo de
//     Open-Meteo los días que el pluviómetro estuvo vivo.
//   · la sonda de suelo → la reserva del suelo MEDIDA, que sustituye a la
//     estimada mientras la lectura sea reciente.
//
// Todo lo derivado de un sensor queda marcado (`origen: 'sensor'`), para que la
// pantalla pueda decir de dónde sale cada número y para poder borrarlo sin
// tocar lo que alguien anotó a mano.
"use strict";

import * as db from './db.js';
import { normaliza, TIPOS } from './normaliza.js';

/* Para qué sirve cada aparato en la finca. Un mismo modelo de sensor puede
   estar en el reservorio o en un tanque de 200 L: lo que decide cómo se usa
   su lectura es dónde está puesto, y eso lo dice quien lo instaló. */
export const USOS = {
  reservorio: { label: 'Nivel del reservorio', tipos: ['distancia', 'nivel'] },
  suelo: { label: 'Humedad del suelo', tipos: ['humedad_suelo'] },
  pluviometro: { label: 'Pluviómetro', tipos: ['lluvia'] },
  caudal: { label: 'Caudalímetro de riego', tipos: ['caudal', 'pulsos'] },
  ignorar: { label: 'No usar', tipos: [] }
};

/* Un sensor LoRaWAN de campo manda cada 20–60 minutos. Seis horas sin
   noticias ya no es un retraso: es una pila, una antena o un gateway caído,
   y conviene saberlo ANTES de que el modelo pase días calculando con un
   nivel viejo creyendo que es fresco. */
export const CALLADO_H = 6;

/* Capacidad de campo y punto de marchitez, en % volumétrico. Son valores
   típicos de un andisol (suelo volcánico) de la sierra, que retiene mucho
   más que un suelo mineral: NO son una medición de esta finca. Un análisis
   de suelo da los de verdad, y se cambian en la pantalla de sensores. */
export const SUELO_CC = 40;
export const SUELO_PMP = 22;

/* ── Sincronizar ──────────────────────────────────────────────────────── */

/**
 * Trae del receptor lo nuevo desde la última vez. Nunca lanza: un fallo de
 * red devuelve `{ ok: false, motivo }` y la app sigue con lo que tenía.
 */
export async function sincronizar(cfg) {
  if (!cfg?.url || !cfg?.token) return { ok: false, motivo: 'sin configurar' };
  const desde = cfg.ultimaSync || new Date(Date.now() - 14 * 86400000).toISOString();
  try {
    const r = await fetch(`${cfg.url.replace(/\/$/, '')}/lecturas?desde=${encodeURIComponent(desde)}`, {
      headers: { authorization: `Bearer ${cfg.token}` }
    });
    if (r.status === 401) return { ok: false, motivo: 'token rechazado' };
    if (!r.ok) return { ok: false, motivo: `el receptor respondió ${r.status}` };
    const { lecturas = [], hasta } = await r.json();
    await db.saveLocal('lecturas', lecturas);
    return { ok: true, nuevas: lecturas.length, hasta };
  } catch (e) {
    return { ok: false, motivo: 'sin conexión con el receptor' };
  }
}

/** Comprueba la conexión sin guardar nada: para el botón «Probar». */
export async function probar(cfg) {
  if (!cfg?.url || !cfg?.token) return { ok: false, motivo: 'faltan la dirección o el token' };
  try {
    const r = await fetch(`${cfg.url.replace(/\/$/, '')}/estado`, {
      headers: { authorization: `Bearer ${cfg.token}` }
    });
    if (r.status === 401) return { ok: false, motivo: 'el receptor respondió, pero rechazó el token' };
    if (!r.ok) return { ok: false, motivo: `el receptor respondió ${r.status}` };
    const { aparatos = [] } = await r.json();
    const n = new Set(aparatos.map(a => a.dispositivo)).size;
    return { ok: true, aparatos: n };
  } catch {
    return { ok: false, motivo: 'no se pudo llegar a esa dirección' };
  }
}

/* ── De lecturas a lo que entiende el modelo ──────────────────────────── */

/**
 * Nivel de agua en metros sobre el fondo, a partir de la lectura de un
 * ultrasónico. El sensor mide la distancia hasta la superficie: cuanto más
 * lejos el agua, menos agua hay. Sin la altura de montaje no hay forma de
 * convertirla, y entonces no se inventa: devuelve null.
 */
export function nivelDesde(l, aparato) {
  if (l.tipo === 'nivel') return Math.max(0, l.valor);
  if (l.tipo === 'distancia' && aparato?.montajeM > 0) {
    return Math.max(0, aparato.montajeM - l.valor);
  }
  return null;
}

/**
 * Eventos `medición_nivel` a partir de las lecturas del reservorio: uno por
 * día, el último de ese día. El modelo de agua trabaja por días, y meterle
 * veinticuatro lecturas diarias sólo le haría reiniciar el saldo veinticuatro
 * veces para acabar en el mismo número.
 *
 * El id es fijo por aparato y día, así que volver a sincronizar sobrescribe en
 * vez de duplicar.
 */
export function eventosNivel(lecturas, aparatos) {
  const porDia = new Map();
  for (const l of lecturas) {
    const ap = aparatos[l.dispositivo];
    if (ap?.uso !== 'reservorio') continue;
    const nivel = nivelDesde(l, ap);
    if (nivel == null) continue;
    const dia = l.fecha.slice(0, 10);
    const clave = `${l.dispositivo}|${dia}`;
    const prev = porDia.get(clave);
    if (!prev || l.fecha > prev.fecha) porDia.set(clave, { ...l, nivel, dia });
  }
  return [...porDia.values()].map(l => ({
    id: `sensor-${l.dispositivo}-${l.dia}`,
    type: 'medición_nivel',
    date: l.dia,
    levelM: Math.round(l.nivel * 1000) / 1000,
    origen: 'sensor',
    dispositivo: l.dispositivo,
    medidoA: l.fecha,
    notes: `Sensor ${aparatos[l.dispositivo]?.nombre || l.dispositivo}`
  }));
}

/**
 * Lluvia por día según los pluviómetros. Un día sólo cuenta si el pluviómetro
 * mandó algo ese día —aunque sea un cero—: un pluviómetro caído no mide
 * "no llovió", no mide nada, y tratarlo como cero haría creer en una sequía
 * que no existe.
 */
export function lluviaPorDia(lecturas, aparatos) {
  const dias = new Map();
  for (const l of lecturas) {
    if (aparatos[l.dispositivo]?.uso !== 'pluviometro' || l.tipo !== 'lluvia') continue;
    const d = l.fecha.slice(0, 10);
    dias.set(d, (dias.get(d) || 0) + Math.max(0, l.valor));
  }
  return Object.fromEntries(dias);
}

/**
 * Litros por día que pasaron por cada caudalímetro.
 *
 * Los medidores mandan una de dos cosas, y confundirlas es catastrófico:
 *   · lo que pasó desde la lectura anterior (`acumulado: false`), que se suma;
 *   · un TOTAL que sólo crece (`acumulado: true`), del que lo regado es la
 *     diferencia entre una lectura y la siguiente. Sumar el total como si
 *     fuera lo del rato cuenta mil veces el mismo litro.
 * Casi todos los contadores de pulsos son del segundo tipo, y por eso es lo
 * que se asume si nadie dijo otra cosa.
 *
 * Un total que BAJA es un contador que volvió a cero —cambio de pila, reinicio
 * del nodo—: lo de ese tramo es el valor nuevo entero, no una resta negativa.
 *
 * El primer total de la serie no tiene con qué compararse, así que no aporta
 * nada: mejor perder la primera hora que inventar un riego del tamaño de todo
 * lo que el medidor contó en su vida.
 */
export function riegoPorDia(lecturas, aparatos) {
  const porAparato = new Map();
  for (const l of lecturas) {
    const ap = aparatos[l.dispositivo];
    if (ap?.uso !== 'caudal') continue;
    if (l.tipo !== 'caudal' && l.tipo !== 'pulsos') continue;
    if (!porAparato.has(l.dispositivo)) porAparato.set(l.dispositivo, []);
    porAparato.get(l.dispositivo).push(l);
  }

  const out = {};   // { dispositivo: { dia: litros } }
  for (const [disp, serie] of porAparato) {
    const ap = aparatos[disp];
    const litros = l => l.tipo === 'pulsos'
      ? (ap.litrosPorPulso > 0 ? l.valor * ap.litrosPorPulso : null)
      : l.valor;
    const acumulado = ap.acumulado !== false;
    serie.sort((a, b) => a.fecha.localeCompare(b.fecha));

    const dias = {};
    let prev = null;
    for (const l of serie) {
      const v = litros(l);
      if (v == null) continue;
      let tramo;
      if (!acumulado) tramo = v;
      else if (prev == null) tramo = 0;
      else tramo = v >= prev ? v - prev : v;
      prev = v;
      const d = l.fecha.slice(0, 10);
      dias[d] = (dias[d] || 0) + Math.max(0, tramo);
    }
    out[disp] = dias;
  }
  return out;
}

/**
 * Eventos `riego` a partir de los caudalímetros: uno por aparato y día. El
 * modelo de agua ya usa un riego registrado EN LUGAR de la demanda estimada
 * de ese día, así que con un caudalímetro el reservorio deja de restar lo que
 * el modelo cree que se regó y resta lo que de verdad pasó por la tubería.
 *
 * Los sectores que alimenta la línea se guardan con el evento, pero el
 * volumen no se reparte: un medidor en una línea compartida mide el total, y
 * cualquier reparto sería un supuesto vestido de medición.
 */
export function eventosRiego(lecturas, aparatos) {
  const out = [];
  for (const [disp, dias] of Object.entries(riegoPorDia(lecturas, aparatos))) {
    const ap = aparatos[disp];
    for (const [dia, litros] of Object.entries(dias)) {
      if (litros <= 0) continue;
      out.push({
        id: `sensor-riego-${disp}-${dia}`,
        type: 'riego',
        date: dia,
        volumeM3: Math.round(litros) / 1000,
        origen: 'sensor',
        dispositivo: disp,
        sectorIds: ap.sectorIds || [],
        notes: `Caudalímetro ${ap.nombre || disp}`
      });
    }
  }
  return out;
}

/**
 * La reserva del suelo MEDIDA, en mm, a partir de la humedad volumétrica.
 * Es la fracción de agua aprovechable que queda —entre el punto de marchitez
 * y la capacidad de campo— aplicada a la reserva máxima configurada.
 *
 * Sólo vale una lectura de las últimas 36 h. Si hay varias sondas se toma la
 * MÁS SECA: la reserva sirve para decidir si hace falta regar, y equivocarse
 * por el lado húmedo es dejar una planta sin agua.
 */
export function reservaMedida(lecturas, aparatos, { reservaMax, cc = SUELO_CC, pmp = SUELO_PMP }) {
  const limite = new Date(Date.now() - 36 * 3600000).toISOString();
  const ultimas = new Map();
  for (const l of lecturas) {
    if (aparatos[l.dispositivo]?.uso !== 'suelo' || l.tipo !== 'humedad_suelo') continue;
    if (l.fecha < limite) continue;
    const prev = ultimas.get(l.dispositivo);
    if (!prev || l.fecha > prev.fecha) ultimas.set(l.dispositivo, l);
  }
  if (!ultimas.size || !(cc > pmp)) return null;
  const masSeca = [...ultimas.values()].sort((a, b) => a.valor - b.valor)[0];
  const fraccion = Math.max(0, Math.min(1, (masSeca.valor - pmp) / (cc - pmp)));
  return {
    mm: Math.round(fraccion * reservaMax * 10) / 10,
    vwc: masSeca.valor,
    dispositivo: masSeca.dispositivo,
    fecha: masSeca.fecha
  };
}

/**
 * El estado de cada aparato que haya mandado algo: su última lectura de cada
 * tipo, hace cuánto, y si está callado. Incluye los que todavía no tienen uso
 * asignado — así el primer mensaje de un sensor recién instalado aparece en
 * la app aunque nadie lo haya configurado, que es justo cuando hace falta.
 */
export function estadoAparatos(lecturas, aparatos = {}) {
  const por = new Map();
  for (const l of lecturas) {
    if (!por.has(l.dispositivo)) por.set(l.dispositivo, { dispositivo: l.dispositivo, tipos: {}, ultima: null, fuente: l.fuente });
    const a = por.get(l.dispositivo);
    if (!a.tipos[l.tipo] || l.fecha > a.tipos[l.tipo].fecha) a.tipos[l.tipo] = l;
    if (!a.ultima || l.fecha > a.ultima) a.ultima = l.fecha;
  }
  const ahora = Date.now();
  const hoy = new Date().toISOString().slice(0, 10);
  const riegos = riegoPorDia(lecturas, aparatos);
  return [...por.values()].map(a => {
    const cfg = aparatos[a.dispositivo] || {};
    const litrosHoy = riegos[a.dispositivo]?.[hoy] ?? null;
    const horas = (ahora - new Date(a.ultima).getTime()) / 3600000;
    return {
      ...a,
      // Sin nombre puesto, el uso dice más que el identificador técnico.
      nombre: cfg.nombre || (cfg.uso && cfg.uso !== 'ignorar' ? USOS[cfg.uso].label : a.dispositivo),
      uso: cfg.uso || null,
      horas,
      callado: horas > CALLADO_H,
      bateria: a.tipos.bateria?.valor ?? null,
      bateriaTexto: a.tipos.bateria ? (a.tipos.bateria.valor <= 5
        ? `${fmt(a.tipos.bateria.valor, 2)} V` : `${fmt(a.tipos.bateria.valor, 0)} %`) : null,
      bateriaBaja: bateriaBaja(a.tipos.bateria?.valor),
      principal: principal(a.tipos, cfg, litrosHoy)
    };
  }).sort((x, y) => (x.uso ? 0 : 1) - (y.uso ? 0 : 1) || x.nombre.localeCompare(y.nombre));
}

/** La lectura que importa de un aparato según su uso, ya en palabras. */
function principal(tipos, cfg, litrosHoy = null) {
  if (cfg.uso === 'reservorio') {
    const l = tipos.nivel || tipos.distancia;
    if (!l) return null;
    const nivel = nivelDesde(l, cfg);
    return nivel == null
      ? { texto: `${fmt(l.valor, 2)} m al agua`, falta: 'altura de montaje' }
      : { texto: `${fmt(nivel, 2)} m de agua` };
  }
  if (cfg.uso === 'suelo' && tipos.humedad_suelo) return { texto: `${fmt(tipos.humedad_suelo.valor, 1)} % de humedad` };
  if (cfg.uso === 'pluviometro' && tipos.lluvia) return { texto: `${fmt(tipos.lluvia.valor, 1)} mm en la última lectura` };
  if (cfg.uso === 'caudal' && (tipos.caudal || tipos.pulsos)) {
    if (tipos.pulsos && !tipos.caudal && !(cfg.litrosPorPulso > 0)) {
      return { texto: `${fmt(tipos.pulsos.valor, 0)} pulsos`, falta: 'cantidad de litros por pulso' };
    }
    return { texto: `${fmt(litrosHoy ?? 0, 0)} L regados hoy` };
  }
  // Sin uso asignado: se enseña lo que mande, para que se pueda reconocer.
  const t = Object.values(tipos).find(x => x.tipo !== 'bateria');
  return t ? { texto: `${TIPOS[t.tipo]?.etiqueta || t.tipo}: ${fmt(t.valor, 2)} ${t.unidad}` } : null;
}

/* Las baterías llegan en voltios (Dragino, ~3,6 V llena) o en porcentaje
   (Milesight). Por debajo de 3,3 V una pila de litio de estos aparatos ya
   está en la parte final de su curva. */
function bateriaBaja(v) {
  if (v == null) return false;
  return v <= 5 ? v < 3.3 : v < 20;
}

function fmt(v, d) {
  return Number(v).toLocaleString('es-EC', { minimumFractionDigits: d, maximumFractionDigits: d });
}

/* ── Aplicar: guardar lo derivado ─────────────────────────────────────── */

/**
 * Recalcula los eventos de nivel a partir de TODAS las lecturas guardadas y
 * los guarda. Se hace completo y no incremental porque cambiar la altura de
 * montaje cambia todos los niveles pasados, y tienen que cambiar a la vez.
 */
export async function aplicar(aparatos) {
  const lecturas = await db.all('lecturas');
  const eventos = [...eventosNivel(lecturas, aparatos), ...eventosRiego(lecturas, aparatos)];
  // Los eventos de sensor que ya no corresponden (aparato reasignado o
  // borrado) se quitan; los anotados a mano no se tocan nunca.
  const actuales = (await db.all('water')).filter(w => w.origen === 'sensor');
  const vigentes = new Set(eventos.map(e => e.id));
  await db.removeLocal('water', actuales.filter(w => !vigentes.has(w.id)).map(w => w.id));
  await db.saveLocal('water', eventos);
  return { lecturas, eventos };
}

/* ── Datos de prueba ──────────────────────────────────────────────────── */

/**
 * Una semana de lecturas como las que mandarían los aparatos reales,
 * generadas con el MISMO traductor que usa el receptor. Así el modo de prueba
 * ejercita el camino de verdad y no uno paralelo.
 */
export function lecturasDePrueba({ dias = 7, montajeM = 2.3, consumoDiaM3 = 0.2,
                                  capacidadM3 = 80, alturaUtilM = 2, exceso = 1.3 } = {}) {
  /* El riego de prueba sale del consumo que da el propio modelo para las
     plantas registradas, con un exceso: así el reservorio baja lo que debe
     bajar y la comparación regado/pedido tiene algo que decir. Si se
     inventara aparte, un reservorio que pierde 3 m³ al día al lado de unas
     plantas que piden 0,15 diría "regaste 2.000 % de más", y la prueba
     enseñaría una incoherencia en vez del circuito. */
  const riegoDiaL = consumoDiaM3 * exceso * 1000;
  const bajaPorLitro = alturaUtilM / (capacidadM3 * 1000);
  const out = [];
  const ahora = Date.now();
  const inicio = ahora - dias * 86400000;
  let nivel = 1.2, humedad = 30, total = 18250, fR = 1, fS = 1, fC = 1;

  for (let t = inicio; t <= ahora; t += 3600000) {
    const f = new Date(t);
    const hora = (f.getUTCHours() + 19) % 24;      // hora de Ecuador
    const dia = Math.floor((t - inicio) / 86400000);
    let litros = 0;
    if (hora === 6 || hora === 7) {
      litros = riegoDiaL / 2 * (0.9 + Math.random() * 0.2);
      nivel -= litros * bajaPorLitro;
      humedad += 1.6;
      total += litros;
    }
    if (dia === Math.floor(dias / 2) && hora >= 8 && hora < 13) nivel = Math.min(alturaUtilM, nivel + 0.14);
    if (hora >= 10 && hora <= 16) humedad -= 0.35;
    const lluvia = dia === 2 && hora >= 15 && hora < 18 ? 6.5 : 0;
    if (lluvia) humedad += 2.2;
    humedad = Math.max(12, Math.min(44, humedad));
    const iso = f.toISOString();

    out.push(...normaliza({
      end_device_ids: { device_id: 'prueba-reservorio' },
      received_at: iso,
      uplink_message: { f_cnt: fR++, decoded_payload: {
        distance: Math.round((montajeM - nivel + (Math.random() - 0.5) * 0.004) * 1000), BatV: 3.61 } }
    }));
    if (hora % 2 === 0) {
      out.push(...normaliza({
        end_device_ids: { device_id: 'prueba-suelo' },
        received_at: iso,
        uplink_message: { f_cnt: fS++, decoded_payload: { water_SOIL: +humedad.toFixed(1), BatV: 3.55 } }
      }));
    }
    // Caudalímetro: total acumulado, como casi todos los reales.
    out.push(...normaliza({
      end_device_ids: { device_id: 'prueba-caudal' },
      received_at: iso,
      uplink_message: { f_cnt: fC++, decoded_payload: { water_liters: Math.round(total), BatV: 3.58 } }
    }));
    out.push(...normaliza({
      entity_id: 'sensor.prueba_pluviometro', state: String(lluvia),
      attributes: { device_class: 'precipitation', unit_of_measurement: 'mm' }, last_updated: iso
    }));
  }
  // Se marcan para poder borrarlas sin tocar nada real.
  return out.map(l => ({ ...l, fuente: 'prueba', id: 'prueba|' + l.id }));
}

export const APARATOS_DE_PRUEBA = {
  'prueba-reservorio': { uso: 'reservorio', nombre: 'Reservorio (prueba)', montajeM: 2.3 },
  'prueba-suelo': { uso: 'suelo', nombre: 'Suelo arándanos (prueba)' },
  'sensor.prueba_pluviometro': { uso: 'pluviometro', nombre: 'Pluviómetro (prueba)' },
  'prueba-caudal': { uso: 'caudal', nombre: 'Línea de riego (prueba)', acumulado: true, sectorIds: [] }
};

export async function borrarPrueba() {
  const l = await db.all('lecturas');
  await db.removeLocal('lecturas', l.filter(x => x.fuente === 'prueba').map(x => x.id));
}

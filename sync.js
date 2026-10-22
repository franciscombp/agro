// Compartir la finca entre teléfonos, a través del receptor.
//
// Cada cambio que se guarda ya entra en una cola local (db.js). Sincronizar
// es dos pasos, siempre en este orden:
//
//   1. Subir la cola. El receptor guarda, de cada registro, el cambio más
//      nuevo (receptor/finca.js).
//   2. Bajar lo que cambió en el receptor desde la última vez.
//
// Subir primero es lo que hace simple el segundo paso: lo que este teléfono
// tenía ya está arriba, así que lo que baja es la versión buena y se aplica
// sin más. La única excepción es lo que se haya anotado mientras tanto
// —sigue en la cola—: eso no se pisa, y sube en la próxima vuelta.
//
// Sin señal no pasa nada: la cola espera, y la próxima vez sube entera.
"use strict";

import * as db from './db.js';

/* Lo mismo que acepta el receptor (receptor/finca.js). Una prueba comprueba
   que las dos listas no se separen. */
export const COMPARTIDOS = ['parcels', 'sectors', 'plants', 'infra', 'tasks', 'water', 'elevations',
  'siembras', 'precios', 'cosechas', 'ventas', 'gastos'];

const LOTE = 200;
const META = 'sync-finca';

/**
 * De una tanda de la cola, el último cambio de cada registro: si una tarea se
 * editó cinco veces sin señal, sube una sola.
 */
export function compactar(filas) {
  const ultimo = new Map();
  for (const f of [...filas].sort((a, b) => (a.at || '').localeCompare(b.at || ''))) {
    ultimo.set(f.store + '|' + f.recordId, { op: f.op, store: f.store, recordId: f.recordId, payload: f.payload, at: f.at });
  }
  return [...ultimo.values()];
}

export async function estado() {
  return (await db.get('meta', META)) || { cursor: 0 };
}

/** Olvidar hasta dónde se bajó: la próxima vez se baja todo de nuevo. */
export async function olvidarCursor() {
  await db.saveMeta({ ...(await estado()), id: META, cursor: 0 });
}

/**
 * Sube y baja. Nunca lanza: devuelve `{ ok, motivo }` para decirlo en
 * pantalla, o lo que se subió y bajó.
 */
export async function sincronizar(cfg, { fetch: pedir = globalThis.fetch } = {}) {
  if (!cfg?.url || !cfg?.token) return { ok: false, motivo: 'sin configurar' };
  const base = cfg.url.trim().replace(/\/+$/, '');
  const headers = { authorization: `Bearer ${cfg.token.trim()}`, 'content-type': 'application/json' };
  const fallo = async r => r.status === 401 ? 'el receptor no reconoce la clave de la finca'
    : r.status === 503 ? 'al receptor le falta la base de la finca'
    : `el receptor respondió ${r.status}`;

  try {
    // 1. Subir.
    const cola = (await db.all('outbox')).filter(f => COMPARTIDOS.includes(f.store))
      .sort((a, b) => (a.at || '').localeCompare(b.at || ''));
    let subidos = 0;
    const rechazados = [];
    for (let i = 0; i < cola.length; i += LOTE) {
      const tanda = cola.slice(i, i + LOTE);
      const r = await pedir(base + '/finca/cambios', {
        method: 'POST', headers, body: JSON.stringify({ cambios: compactar(tanda) })
      });
      if (!r.ok) return { ok: false, motivo: await fallo(r), subidos };
      const j = await r.json();
      subidos += j.recibidos || 0;
      rechazados.push(...(j.rechazados || []));
      // Lo rechazado también sale de la cola: reintentarlo no lo va a arreglar.
      await db.removeLocal('outbox', tanda.map(f => f.id));
    }

    // 2. Bajar.
    let { cursor = 0 } = await estado();
    let bajados = 0, hayMas = true;
    while (hayMas) {
      const r = await pedir(`${base}/finca/cambios?desde=${cursor}`, { headers });
      if (!r.ok) return { ok: false, motivo: await fallo(r), subidos };
      const j = await r.json();
      // Lo anotado aquí mientras se sincronizaba no se pisa: sube la próxima vez.
      const enCola = new Set((await db.all('outbox')).map(f => f.store + '|' + f.recordId));
      const porAlmacen = new Map();
      for (const c of j.cambios || []) {
        if (!COMPARTIDOS.includes(c.store) || enCola.has(c.store + '|' + c.id)) continue;
        if (!porAlmacen.has(c.store)) porAlmacen.set(c.store, { poner: [], borrar: [] });
        const g = porAlmacen.get(c.store);
        if (c.borrado) g.borrar.push(c.id); else if (c.datos) g.poner.push(c.datos);
        bajados++;
      }
      for (const [store, g] of porAlmacen) {
        await db.guardarRemoto(store, g.poner);
        await db.removeLocal(store, g.borrar);
      }
      cursor = j.cursor ?? cursor;
      hayMas = !!j.hayMas && (j.cambios || []).length > 0;
      // Se guarda por página: si se corta la señal a medias, sigue desde aquí.
      await db.saveMeta({ id: META, cursor, ultima: new Date().toISOString() });
    }
    return { ok: true, subidos, bajados, rechazados };
  } catch {
    return { ok: false, motivo: 'no se pudo hablar con el receptor' };
  }
}

/* ── Invitar a otro teléfono ───────────────────────────────────────────
   Un enlace que lleva la dirección y la clave, para mandarlo por WhatsApp:
   copiar una clave larga a mano es donde esto se rompe para quien no vive
   entre aplicaciones. Va después del #, que el navegador no manda a ningún
   servidor. */

export function enlaceInvitacion(cfg, pagina) {
  const datos = btoa(unescape(encodeURIComponent(JSON.stringify({ url: cfg.url, token: cfg.token }))));
  return `${pagina}#unir=${encodeURIComponent(datos)}`;
}

export function leerInvitacion(hash) {
  const m = /^#unir=(.+)$/.exec(hash || '');
  if (!m) return null;
  try {
    const j = JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(m[1])))));
    return typeof j?.url === 'string' && typeof j?.token === 'string' && /^https?:\/\//.test(j.url) ? j : null;
  } catch { return null; }
}

// Los datos de la finca compartidos entre teléfonos: la otra mitad del receptor.
//
//   POST /finca/cambios   { cambios: [{ op, store, recordId, payload, at }] }
//                         lo que cada teléfono tiene en su cola local
//   GET  /finca/cambios?desde=123
//                         lo que cambió en el servidor después de ese número
//
// Cada registro (un sector, una planta, una tarea…) vive una sola vez en el
// servidor, con la hora en que se cambió por última vez y un número de orden
// que sólo sube. Un teléfono pide «lo que cambió después del 123» y recibe
// todo, en orden, sin tener que comparar nada.
//
// Si dos teléfonos cambian lo mismo, gana el cambio más nuevo, registro por
// registro: una tarea marcada como hecha en un teléfono no pisa una planta
// editada en otro. Un borrado es un cambio más (una «lápida»), para que los
// demás teléfonos se enteren de que tienen que borrarlo.
//
// Va en D1 (SQLite) y no en KV como las lecturas: aquí hace falta leer lo que
// se acaba de escribir, y KV tarda hasta un minuto en verlo en todas partes.
"use strict";

/* Lo que se comparte. `meta` (ajustes de cada teléfono, cachés) y `lecturas`
   (que ya vienen del receptor) no; `ajustes` es la parte de la configuración
   que es de la finca (db.js, AJUSTES_COMPARTIDOS). */
export const ALMACENES = ['parcels', 'sectors', 'plants', 'infra', 'tasks', 'water', 'elevations',
  'siembras', 'precios', 'cosechas', 'ventas', 'gastos', 'ajustes'];

const MAX_CAMBIOS = 500;           // por envío; el teléfono manda en lotes
const MAX_PAGINA = 500;            // por respuesta; el teléfono pide hasta que no hay más
// D1 no guarda filas de más de 2 MB. Una planta con muchas fotos puede pasar.
const MAX_BYTES = 1_900_000;

const ESQUEMA = [
  `CREATE TABLE IF NOT EXISTS registros (
     almacen TEXT NOT NULL, id TEXT NOT NULL, datos TEXT, actualizado TEXT NOT NULL,
     borrado INTEGER NOT NULL DEFAULT 0, seq INTEGER NOT NULL, PRIMARY KEY (almacen, id))`,
  'CREATE INDEX IF NOT EXISTS registros_seq ON registros (seq)'
];

const listas = new WeakMap();
/* La tabla se crea sola la primera vez: una migración a mano es un paso más
   que alguien olvida al desplegar. Es barato y no hace nada si ya existe. */
function asegurarEsquema(db) {
  if (!listas.has(db)) {
    listas.set(db, db.batch(ESQUEMA.map(s => db.prepare(s))).catch(e => { listas.delete(db); throw e; }));
  }
  return listas.get(db);
}

/* Gana lo más nuevo: si lo que llega es más viejo que lo guardado —un teléfono
   que estuvo semanas sin señal—, no pisa nada. */
const UPSERT = `INSERT INTO registros (almacen, id, datos, actualizado, borrado, seq)
  VALUES (?1, ?2, ?3, ?4, ?5, (SELECT COALESCE(MAX(seq), 0) + 1 FROM registros))
  ON CONFLICT (almacen, id) DO UPDATE SET
    datos = excluded.datos, actualizado = excluded.actualizado,
    borrado = excluded.borrado, seq = excluded.seq
  WHERE excluded.actualizado > registros.actualizado`;

export async function recibir(request, env) {
  let cuerpo;
  try { cuerpo = await request.json(); } catch { return { status: 400, cuerpo: { error: 'el cuerpo no es JSON' } }; }
  const cambios = Array.isArray(cuerpo?.cambios) ? cuerpo.cambios : null;
  if (!cambios) return { status: 400, cuerpo: { error: 'faltan los cambios' } };
  if (cambios.length > MAX_CAMBIOS) return { status: 413, cuerpo: { error: `más de ${MAX_CAMBIOS} cambios de una vez` } };

  await asegurarEsquema(env.FINCA);
  const rechazados = [];
  const sentencias = [];
  for (const c of cambios) {
    const id = c?.recordId ?? c?.payload?.id;
    const motivo = !ALMACENES.includes(c?.store) ? 'almacén desconocido'
      : typeof id !== 'string' || !id || id.length > 200 ? 'sin id'
      : c.op !== 'put' && c.op !== 'delete' ? 'operación desconocida'
      : null;
    if (motivo) { rechazados.push({ store: c?.store, id, motivo }); continue; }
    if (c.op === 'delete') {
      const cuando = typeof c.at === 'string' ? c.at : new Date().toISOString();
      sentencias.push(env.FINCA.prepare(UPSERT).bind(c.store, id, null, cuando, 1));
      continue;
    }
    const datos = JSON.stringify(c.payload ?? null);
    const cuando = c.payload?.updatedAt;
    if (typeof cuando !== 'string') { rechazados.push({ store: c.store, id, motivo: 'sin fecha de cambio' }); continue; }
    if (datos.length > MAX_BYTES) { rechazados.push({ store: c.store, id, motivo: 'muy grande (¿muchas fotos?)' }); continue; }
    sentencias.push(env.FINCA.prepare(UPSERT).bind(c.store, id, datos, cuando, 0));
  }
  // En un solo lote: D1 lo corre como una transacción, así que un envío entra
  // entero o no entra, y el teléfono puede reintentarlo sin duplicar nada.
  if (sentencias.length) await env.FINCA.batch(sentencias);
  return { status: 200, cuerpo: { recibidos: sentencias.length, rechazados } };
}

export async function entregar(url, env) {
  const desde = Number(url.searchParams.get('desde') || 0);
  if (!Number.isFinite(desde) || desde < 0) return { status: 400, cuerpo: { error: 'desde no es un número' } };
  await asegurarEsquema(env.FINCA);
  const { results = [] } = await env.FINCA
    .prepare('SELECT almacen, id, datos, borrado, seq FROM registros WHERE seq > ?1 ORDER BY seq LIMIT ?2')
    .bind(desde, MAX_PAGINA).all();
  const cambios = results.map(r => ({
    store: r.almacen, id: r.id, seq: r.seq, borrado: !!r.borrado,
    datos: r.borrado ? null : JSON.parse(r.datos)
  }));
  return {
    status: 200,
    cuerpo: { cambios, cursor: cambios.length ? cambios.at(-1).seq : desde, hayMas: cambios.length === MAX_PAGINA }
  };
}

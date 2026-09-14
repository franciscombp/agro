// Persistencia local en IndexedDB + cola de sincronización.
// No usamos localStorage: los datos deben sobrevivir y poder exportarse/sincronizarse.
"use strict";

const DB_NAME = 'mulalillo';
const DB_VERSION = 1;
const STORES = ['parcels', 'sectors', 'plants', 'infra', 'tasks', 'water', 'elevations', 'outbox', 'meta'];

let dbPromise = null;

function open() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const name of STORES) {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: 'id' });
        }
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx(store, mode, fn) {
  return open().then(db => new Promise((resolve, reject) => {
    const t = db.transaction(store, mode);
    const s = t.objectStore(store);
    let result;
    try { result = fn(s); } catch (err) { reject(err); return; }
    t.oncomplete = () => resolve(result && result.__req ? result.__req.result : result);
    t.onerror = () => reject(t.error);
  }));
}

export function all(store) {
  return tx(store, 'readonly', s => ({ __req: s.getAll() }));
}

export function get(store, id) {
  return tx(store, 'readonly', s => ({ __req: s.get(id) }));
}

/** Guarda un registro y lo encola para sincronizar. */
export async function put(store, record) {
  const rec = { ...record, updatedAt: new Date().toISOString() };
  if (!rec.id) rec.id = uid();
  await tx(store, 'readwrite', s => s.put(rec));
  await enqueue('put', store, rec);
  return rec;
}

export async function remove(store, id) {
  await tx(store, 'readwrite', s => s.delete(id));
  await enqueue('delete', store, { id });
}

export function clearStore(store) {
  return tx(store, 'readwrite', s => s.clear());
}

async function enqueue(op, store, record) {
  if (store === 'outbox' || store === 'meta') return;
  await tx('outbox', 'readwrite', s => s.put({
    id: uid(), op, store, recordId: record.id, payload: record, at: new Date().toISOString()
  }));
}

export function outboxCount() {
  return all('outbox').then(rows => rows.length);
}

/**
 * Vacía la cola. Sin backend configurado, marca los cambios como conciliados
 * localmente; con backend, aquí va el POST por lote.
 */
export async function flushOutbox(endpoint) {
  const rows = await all('outbox');
  if (!rows.length) return { sent: 0 };
  if (!endpoint) return { sent: 0, pending: rows.length, reason: 'sin-backend' };
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rows)
  });
  if (!res.ok) throw new Error('sync ' + res.status);
  await clearStore('outbox');
  return { sent: rows.length };
}

export function uid() {
  return (crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8));
}

/** Exporta todo a un objeto JSON (respaldo manual y traspaso celular↔escritorio). */
export async function exportAll() {
  const out = { version: 1, exportedAt: new Date().toISOString(), data: {} };
  for (const store of STORES) {
    if (store === 'outbox') continue;
    out.data[store] = await all(store);
  }
  return out;
}

export async function importAll(dump, { replace = true } = {}) {
  if (!dump || !dump.data) throw new Error('Archivo no válido');
  for (const [store, rows] of Object.entries(dump.data)) {
    if (!STORES.includes(store)) continue;
    if (replace) await clearStore(store);
    for (const row of rows) await tx(store, 'readwrite', s => s.put(row));
  }
}

// ---------------------------------------------------------------------------
// Datos iniciales: medidos en campo, se siembran una sola vez.
// ---------------------------------------------------------------------------

export const BOUNDARY = [
  [-1.0789219097180558, -78.62409287679763],
  [-1.0792719089470355, -78.62416822111970],
  [-1.0795013786183516, -78.62418328998413],
  [-1.0795152858705954, -78.62451132757106],
  [-1.0795106501198604, -78.62555571578952],
  [-1.0792371408135064, -78.62553369206460],
  [-1.0789949228055762, -78.62550123604893],
  [-1.0789508831656913, -78.62500164523632],
  [-1.0789462474140910, -78.62480922742915],
  [-1.0789265454696941, -78.62452987386573],
  [-1.0789080024630893, -78.62406737564245]
];

// Elevaciones medidas. `measured: false` = altura real pero coordenada estimada,
// pendiente de refinar con GPS en campo.
const SEED_ELEVATIONS = [
  { id: 'elev-reservorio', name: 'Reservorio (parte alta)', lat: -1.0795060, lng: -78.6255357, elevationM: 2802.91, measured: true },
  { id: 'elev-centro', name: 'Centro', lat: -1.0792200, lng: -78.6248000, elevationM: 2794.59, measured: false },
  { id: 'elev-cuyero', name: 'Cuyero', lat: -1.0791000, lng: -78.6244000, elevationM: 2790.13, measured: false },
  { id: 'elev-bajo-1', name: 'Sección baja norte (casa)', lat: -1.0789200, lng: -78.6241000, elevationM: 2786.87, measured: false },
  { id: 'elev-bajo-2', name: 'Sección baja sur', lat: -1.0792400, lng: -78.6241800, elevationM: 2786.84, measured: false }
];

const SEED_SECTORS = [
  {
    id: 'sec-arandanos', name: 'Bloque arándanos', color: '#4c6ef5', irrigationZone: 'Zona alta',
    polygon: [
      [-1.0794900, -78.6254200], [-1.0794950, -78.6250000],
      [-1.0790400, -78.6249700], [-1.0790300, -78.6253900]
    ]
  },
  {
    id: 'sec-aguacates', name: 'Aguacates nuevos', color: '#2f9e44', irrigationZone: 'Zona media',
    polygon: [
      [-1.0794900, -78.6249500], [-1.0794900, -78.6245500],
      [-1.0790200, -78.6245300], [-1.0790250, -78.6249400]
    ]
  },
  {
    id: 'sec-perales', name: 'Perales', color: '#f08c00', irrigationZone: 'Zona media',
    polygon: [
      [-1.0794900, -78.6245200], [-1.0794800, -78.6243000],
      [-1.0790200, -78.6242900], [-1.0790200, -78.6245100]
    ]
  },
  {
    id: 'sec-huerto', name: 'Huerto', color: '#e8590c', irrigationZone: 'Zona baja',
    polygon: [
      [-1.0793500, -78.6242800], [-1.0793400, -78.6241300],
      [-1.0790300, -78.6241200], [-1.0790400, -78.6242700]
    ]
  },
  {
    id: 'sec-pasto', name: 'Pasto', color: '#66a80f', irrigationZone: 'Zona baja',
    polygon: [
      [-1.0789400, -78.6249800], [-1.0789300, -78.6242000],
      [-1.0790200, -78.6242000], [-1.0790300, -78.6249900]
    ]
  }
];

const SEED_INFRA = [
  { id: 'inf-reservorio', type: 'reservorio', lat: -1.0795060, lng: -78.6255357, elevationM: 2802.91, props: { volumenM3: 80, material: 'bloque' } },
  { id: 'inf-casa', type: 'casa', lat: -1.0789400, lng: -78.6240900, elevationM: 2786.87, props: {} },
  { id: 'inf-cuyera', type: 'cuyera', lat: -1.0791000, lng: -78.6244000, elevationM: 2790.13, props: {} },
  { id: 'inf-establo', type: 'establo', lat: -1.0793000, lng: -78.6243200, elevationM: 2789.5, props: {} }
];

const SEED_PLANTS = [
  { id: 'pl-ag-1', sectorId: 'sec-aguacates', species: 'aguacate', variety: 'Hass', lat: -1.0793800, lng: -78.6248300, plantedAt: '2021-03-15', status: 'sano', notes: 'El que ya produce.' },
  { id: 'pl-ag-2', sectorId: 'sec-aguacates', species: 'aguacate', variety: 'Fuerte', lat: -1.0793100, lng: -78.6247600, plantedAt: '2023-11-10', status: 'sano' },
  { id: 'pl-ag-3', sectorId: 'sec-aguacates', species: 'aguacate', lat: -1.0792400, lng: -78.6247000, plantedAt: '2023-11-10', status: 'atención', notes: 'Crecimiento lento.' },
  { id: 'pl-ag-4', sectorId: 'sec-aguacates', species: 'aguacate', lat: -1.0791700, lng: -78.6246400, plantedAt: '2023-11-10', status: 'sano' },
  { id: 'pl-pe-1', sectorId: 'sec-perales', species: 'peral', lat: -1.0794000, lng: -78.6244400, plantedAt: '2015-01-01', status: 'sano' },
  { id: 'pl-pe-2', sectorId: 'sec-perales', species: 'peral', lat: -1.0793000, lng: -78.6244000, plantedAt: '2015-01-01', status: 'sano' },
  { id: 'pl-pe-3', sectorId: 'sec-perales', species: 'peral', lat: -1.0792000, lng: -78.6243600, plantedAt: '2015-01-01', status: 'atención', notes: 'Necesita poda de formación.' }
];

const SEED_WATER = [
  { id: 'w-1', date: isoDaysAgo(21), type: 'llenado_acequia', volumeM3: 62, notes: 'Turno de 5 h, no llenó completo.' },
  { id: 'w-2', date: isoDaysAgo(14), type: 'tanquero', volumeM3: 10, notes: 'Compra de emergencia.' },
  { id: 'w-3', date: isoDaysAgo(6), type: 'llenado_acequia', volumeM3: 70, notes: 'Turno completo.' },
  { id: 'w-4', date: isoDaysAgo(1), type: 'medición_nivel', levelM: 1.45, notes: 'Regla del reservorio.' }
];

const SEED_TASKS = [
  { id: 't-1', targetType: 'sector', targetId: 'sec-arandanos', type: 'siembra', dueAt: isoInDays(20), notes: 'Preparar sustrato para 380 arándanos, hileras a 2,5 m.' },
  { id: 't-2', targetType: 'sector', targetId: 'sec-perales', type: 'poda', dueAt: isoInDays(5), notes: 'Poda de formación.' },
  { id: 't-3', targetType: 'plant', targetId: 'pl-ag-3', type: 'fertilización', dueAt: isoInDays(-2), notes: 'Revisar por crecimiento lento.' },
  { id: 't-4', targetType: 'parcel', targetId: 'parcel-mulalillo', type: 'riego', doneAt: isoDaysAgo(3), notes: 'Riego por gravedad, 2 h.' }
];

/** Demanda de agua estimada por especie, litros/planta/día. Editable en la app. */
export const SPECIES = {
  aguacate: { label: 'Aguacate', lppd: 30, color: '#2f9e44' },
  peral: { label: 'Peral', lppd: 25, color: '#f08c00' },
  arandano: { label: 'Arándano', lppd: 4, color: '#4c6ef5' },
  mora: { label: 'Mora', lppd: 5, color: '#862e9c' },
  lavanda: { label: 'Lavanda', lppd: 1.5, color: '#7048e8' },
  hortaliza: { label: 'Hortaliza (huerto)', lppd: 3, color: '#e8590c' },
  pasto: { label: 'Pasto', lppd: 0, color: '#66a80f' },
  otro: { label: 'Otro', lppd: 5, color: '#868e96' }
};

export const STATUS_COLORS = {
  sano: '#2f9e44',
  'atención': '#f59f00',
  enfermo: '#e03131',
  muerto: '#495057'
};

/** Siembra los datos medidos si la base está vacía. Idempotente. */
export async function seedIfEmpty() {
  const parcels = await all('parcels');
  if (parcels.length) return false;

  await putRaw('parcels', { id: 'parcel-mulalillo', name: 'Finca Mulalillo', boundary: BOUNDARY });
  for (const e of SEED_ELEVATIONS) await putRaw('elevations', e);
  for (const s of SEED_SECTORS) await putRaw('sectors', { ...s, parcelId: 'parcel-mulalillo' });
  for (const i of SEED_INFRA) await putRaw('infra', i);
  for (const p of SEED_PLANTS) await putRaw('plants', p);
  for (const w of SEED_WATER) await putRaw('water', w);
  for (const t of SEED_TASKS) await putRaw('tasks', t);
  await putRaw('meta', {
    id: 'config',
    demandaDiariaM3: null,          // null = calculada desde las plantas
    reservorioVolumenM3: 80,
    reservorioAlturaUtilM: 2.0,
    alertaAutonomiaDias: 7,
    proximoTurno: isoInDays(9),     // ciclo de 15 días de la junta de agua
    cicloTurnoDias: 15,
    exageracion3D: 3,
    syncEndpoint: ''
  });
  return true;
}

function putRaw(store, record) {
  return tx(store, 'readwrite', s => s.put({ ...record, updatedAt: new Date().toISOString() }));
}

export async function config() {
  return (await get('meta', 'config')) || {};
}

export async function saveConfig(patch) {
  const current = await config();
  const next = { ...current, ...patch, id: 'config' };
  await putRaw('meta', next);
  return next;
}

function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function isoInDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

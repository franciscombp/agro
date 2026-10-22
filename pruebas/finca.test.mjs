// La finca compartida: el receptor guarda lo más nuevo de cada registro, y
// los teléfonos bajan lo que cambió después de su último número.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../receptor/worker.js';
import { d1EnMemoria, kvEnMemoria } from '../receptor/local.mjs';
import { ALMACENES } from '../receptor/finca.js';
import { COMPARTIDOS, compactar, enlaceInvitacion, leerInvitacion } from '../sync.js';

const nuevoEnv = () => ({ LECTURAS: kvEnMemoria(), FINCA: d1EnMemoria(), TOKEN_FINCA: 'f', TOKEN_LECTURA: 'r' });
const subir = (env, cambios, token = 'f') => worker.fetch(new Request('http://x/finca/cambios', {
  method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
  body: JSON.stringify({ cambios })
}), env);
const bajar = async (env, desde = 0, token = 'f') => {
  const r = await worker.fetch(new Request(`http://x/finca/cambios?desde=${desde}`, { headers: { authorization: `Bearer ${token}` } }), env);
  return { status: r.status, ...(await r.json()) };
};
const put = (store, id, updatedAt, extra = {}) => ({ op: 'put', store, recordId: id, payload: { id, updatedAt, ...extra }, at: updatedAt });

test('el teléfono y el receptor comparten la misma lista de almacenes', () => {
  assert.deepEqual(COMPARTIDOS, ALMACENES);
});

test('sin la clave de la finca no se lee ni se escribe; la de lectura de sensores no sirve', async () => {
  const env = nuevoEnv();
  assert.equal((await subir(env, [], 'r')).status, 401);
  assert.equal((await bajar(env, 0, 'r')).status, 401);
  assert.equal((await subir({ ...env, TOKEN_FINCA: undefined }, [])).status, 401);
});

test('lo subido se baja en orden, y desde un número sólo lo posterior', async () => {
  const env = nuevoEnv();
  await subir(env, [put('tasks', 't1', '2026-10-01T10:00:00Z', { type: 'poda' }), put('plants', 'p1', '2026-10-01T10:00:01Z')]);
  const a = await bajar(env);
  assert.deepEqual(a.cambios.map(c => c.id), ['t1', 'p1']);
  assert.equal(a.cambios[0].datos.type, 'poda');
  await subir(env, [put('tasks', 't2', '2026-10-02T10:00:00Z')]);
  const b = await bajar(env, a.cursor);
  assert.deepEqual(b.cambios.map(c => c.id), ['t2']);
});

test('gana el cambio más nuevo, aunque llegue antes', async () => {
  const env = nuevoEnv();
  await subir(env, [put('tasks', 't1', '2026-10-05T00:00:00Z', { notes: 'nuevo' })]);
  // Un teléfono que estuvo sin señal sube su versión vieja después.
  await subir(env, [put('tasks', 't1', '2026-10-01T00:00:00Z', { notes: 'viejo' })]);
  const { cambios } = await bajar(env);
  assert.equal(cambios.length, 1);
  assert.equal(cambios[0].datos.notes, 'nuevo');
});

test('un borrado baja como lápida y gana a una edición más vieja', async () => {
  const env = nuevoEnv();
  await subir(env, [put('plants', 'p1', '2026-10-01T00:00:00Z')]);
  const { cursor } = await bajar(env);
  await subir(env, [{ op: 'delete', store: 'plants', recordId: 'p1', payload: { id: 'p1' }, at: '2026-10-03T00:00:00Z' }]);
  await subir(env, [put('plants', 'p1', '2026-10-02T00:00:00Z')]);
  const { cambios } = await bajar(env, cursor);
  assert.equal(cambios.length, 1);
  assert.equal(cambios[0].borrado, true);
  assert.equal(cambios[0].datos, null);
});

test('lo que no se comparte o viene mal se rechaza sin tumbar el resto', async () => {
  const env = nuevoEnv();
  const r = await (await subir(env, [
    put('meta', 'config', '2026-10-01T00:00:00Z'),
    { op: 'put', store: 'tasks', recordId: 't9', payload: { id: 't9' } },            // sin fecha
    put('plants', 'grande', '2026-10-01T00:00:00Z', { photos: ['x'.repeat(2_000_000)] }),
    put('tasks', 'bien', '2026-10-01T00:00:00Z')
  ])).json();
  assert.equal(r.recibidos, 1);
  assert.deepEqual(r.rechazados.map(x => x.id), ['config', 't9', 'grande']);
  assert.deepEqual((await bajar(env)).cambios.map(c => c.id), ['bien']);
});

test('sin base de la finca configurada, lo dice', async () => {
  const env = { ...nuevoEnv(), FINCA: undefined };
  assert.equal((await subir(env, [])).status, 503);
});

test('la cola se compacta al último cambio de cada registro', () => {
  const filas = [
    { id: 'a', op: 'put', store: 'tasks', recordId: 't1', payload: { n: 1 }, at: '2026-10-01T00:00:01Z' },
    { id: 'c', op: 'put', store: 'tasks', recordId: 't1', payload: { n: 3 }, at: '2026-10-01T00:00:03Z' },
    { id: 'b', op: 'put', store: 'tasks', recordId: 't1', payload: { n: 2 }, at: '2026-10-01T00:00:02Z' },
    { id: 'd', op: 'delete', store: 'plants', recordId: 'p1', payload: { id: 'p1' }, at: '2026-10-01T00:00:04Z' }
  ];
  const c = compactar(filas);
  assert.equal(c.length, 2);
  assert.equal(c.find(x => x.recordId === 't1').payload.n, 3);
});

test('la invitación lleva la dirección y la clave, también con tildes', () => {
  const cfg = { url: 'https://receptor.workers.dev', token: 'clave-ñandú' };
  const enlace = enlaceInvitacion(cfg, 'https://franciscombp.github.io/agro/');
  assert.ok(enlace.startsWith('https://franciscombp.github.io/agro/#unir='));
  assert.deepEqual(leerInvitacion(new URL(enlace).hash), cfg);
  assert.equal(leerInvitacion('#unir=basura'), null);
  assert.equal(leerInvitacion('#agua'), null);
});

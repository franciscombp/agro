// Sensores: la traducción de cada plataforma y lo que la app deriva de las lecturas.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as N from '../normaliza.js';
import * as S from '../sensores.js';
import * as C from '../clima.js';
import { enDias } from '../fechas.js';

const hace = h => new Date(Date.now() - h * 3600000).toISOString();
const ttn = (id, fcnt, p, fecha = '2026-10-01T12:00:00Z') =>
  ({ end_device_ids: { device_id: id }, received_at: fecha, uplink_message: { f_cnt: fcnt, decoded_payload: p } });

test('TTN: un ultrasónico Dragino manda la distancia en mm y la batería en V', () => {
  const l = N.normaliza(ttn('res', 7, { distance: 880, BatV: 3.61 }));
  assert.equal(l.length, 2);
  assert.equal(l.find(x => x.tipo === 'distancia').valor, 0.88);
  assert.ok(l[0].id.endsWith(':f7'));
});

test('TTN: un reintento del webhook produce el mismo id (no duplica)', () => {
  const a = N.normaliza(ttn('res', 7, { distance: 880 }));
  const b = N.normaliza(ttn('res', 7, { distance: 880 }));
  assert.equal(a[0].id, b[0].id);
});

test('TTN: el campo que dice su unidad gana; sin carga decodificada, nada', () => {
  const cm = N.normaliza(ttn('x', 1, { distance_cm: 88, distance: 999 }));
  assert.equal(cm.length, 1);
  assert.equal(cm[0].valor, 0.88);
  assert.equal(N.normaliza({ end_device_ids: { device_id: 'z' }, uplink_message: {} }).length, 0);
  assert.equal(N.normaliza(ttn('s', 1, { water_SOIL: 31.4 }))[0].tipo, 'humedad_suelo');
  assert.equal(N.normaliza(ttn('p', 1, { count: 512 }))[0].tipo, 'pulsos');
});

test('Home Assistant y JSON propio', () => {
  const ha = N.normaliza({ entity_id: 'sensor.lluvia', state: '0.5', attributes: { device_class: 'precipitation', unit_of_measurement: 'in' } });
  assert.equal(ha[0].valor, 12.7);
  assert.equal(N.normaliza({ entity_id: 'sensor.x', state: 'unavailable', attributes: { device_class: 'moisture' } }).length, 0);
  const js = N.normaliza([{ dispositivo: 'esp32', tipo: 'nivel', valor: '1,25' }, { dispositivo: 'x', tipo: 'inventado', valor: 1 }]);
  assert.equal(js.length, 1);
  assert.equal(js[0].valor, 1.25);
});

test('nivel = altura de montaje − distancia; sin montaje no se inventa', () => {
  assert.equal(S.nivelDesde({ tipo: 'distancia', valor: 0.88 }, { montajeM: 2.3 }), 2.3 - 0.88);
  assert.equal(S.nivelDesde({ tipo: 'distancia', valor: 0.88 }, {}), null);
  assert.equal(S.nivelDesde({ tipo: 'distancia', valor: 3 }, { montajeM: 2.3 }), 0);
});

test('eventos de nivel: uno por día, el último, sólo de aparatos del reservorio', () => {
  const ap = { res: { uso: 'reservorio', montajeM: 2.3 } };
  const ev = S.eventosNivel([
    { dispositivo: 'res', tipo: 'distancia', valor: 0.80, fecha: '2026-10-01T13:00:00Z' },
    { dispositivo: 'res', tipo: 'distancia', valor: 0.90, fecha: '2026-10-01T20:00:00Z' },
    { dispositivo: 'res', tipo: 'distancia', valor: 1.00, fecha: '2026-10-02T14:00:00Z' },
    { dispositivo: 'otro', tipo: 'distancia', valor: 0.10, fecha: '2026-10-02T14:00:00Z' }
  ], ap);
  assert.equal(ev.length, 2);
  assert.equal(ev.find(e => e.date === '2026-10-01').levelM, 1.4);
  assert.ok(ev.every(e => e.type === 'medición_nivel' && e.origen === 'sensor'));
});

test('lluvia por día: un cero cuenta, un día sin reporte no existe', () => {
  const ll = S.lluviaPorDia([
    { dispositivo: 'p', tipo: 'lluvia', valor: 2, fecha: '2026-10-01T14:00:00Z' },
    { dispositivo: 'p', tipo: 'lluvia', valor: 3, fecha: '2026-10-01T15:00:00Z' },
    { dispositivo: 'p', tipo: 'lluvia', valor: 0, fecha: '2026-10-02T15:00:00Z' }
  ], { p: { uso: 'pluviometro' } });
  assert.equal(ll['2026-10-01'], 5);
  assert.equal(ll['2026-10-02'], 0);
  assert.ok(!('2026-10-03' in ll));
});

test('reserva medida: manda la sonda más seca, caduca a las 36 h, tope en la máxima', () => {
  const suelo = { a: { uso: 'suelo' }, b: { uso: 'suelo' } };
  const rm = S.reservaMedida([
    { dispositivo: 'a', tipo: 'humedad_suelo', valor: 31, fecha: hace(2) },
    { dispositivo: 'b', tipo: 'humedad_suelo', valor: 26, fecha: hace(1) }
  ], suelo, { reservaMax: 25 });
  assert.equal(rm.dispositivo, 'b');
  assert.equal(rm.mm, Math.round((26 - 22) / (40 - 22) * 25 * 10) / 10);
  assert.equal(S.reservaMedida([{ dispositivo: 'a', tipo: 'humedad_suelo', valor: 35, fecha: hace(40) }], suelo, { reservaMax: 25 }), null);
  assert.equal(S.reservaMedida([{ dispositivo: 'a', tipo: 'humedad_suelo', valor: 50, fecha: hace(1) }], suelo, { reservaMax: 25 }).mm, 25);
});

test('estado de aparatos: callados, batería baja y aparatos nuevos sin configurar', () => {
  const est = S.estadoAparatos([
    { dispositivo: 'res', tipo: 'distancia', valor: 0.9, fecha: hace(1) },
    { dispositivo: 'res', tipo: 'bateria', valor: 3.2, fecha: hace(1) },
    { dispositivo: 'viejo', tipo: 'lluvia', valor: 0, fecha: hace(10) },
    { dispositivo: 'nuevo', tipo: 'temperatura', valor: 14, fecha: hace(0.2) }
  ], { res: { uso: 'reservorio', montajeM: 2.3, nombre: 'Reservorio' }, viejo: { uso: 'pluviometro' } });
  const r = est.find(a => a.dispositivo === 'res');
  assert.match(r.principal.texto, /1,40 m de agua/);
  assert.ok(r.bateriaBaja);
  assert.ok(est.find(a => a.dispositivo === 'viejo').callado);
  assert.equal(est.find(a => a.dispositivo === 'nuevo').uso, null);
});

test('caudalímetro: total acumulado, contador que vuelve a cero, pulsos', () => {
  const L = (v, iso, tipo = 'caudal') => ({ dispositivo: 'c', tipo, valor: v, fecha: iso });
  const d = h => `2026-10-01T${String(h).padStart(2, '0')}:00:00Z`;
  const acu = { c: { uso: 'caudal' } };
  assert.equal(S.riegoPorDia([L(1000, d(12)), L(1150, d(13)), L(1300, d(14)), L(1300, d(15))], acu).c['2026-10-01'], 300);
  assert.equal(S.riegoPorDia([L(1000, d(12)), L(1100, d(13)), L(40, d(14)), L(90, d(15))], acu).c['2026-10-01'], 190);
  assert.equal(S.riegoPorDia([L(150, d(12)), L(150, d(13)), L(0, d(14))], { c: { uso: 'caudal', acumulado: false } }).c['2026-10-01'], 300);
  assert.deepEqual(S.riegoPorDia([L(100, d(12), 'pulsos'), L(130, d(13), 'pulsos')], acu).c, {});
  assert.equal(S.riegoPorDia([L(100, d(12), 'pulsos'), L(130, d(13), 'pulsos')], { c: { uso: 'caudal', litrosPorPulso: 10 } }).c['2026-10-01'], 300);
  const er = S.eventosRiego([L(1000, d(12)), L(1400, d(14))], { c: { uso: 'caudal', sectorIds: ['a', 'b'] } });
  assert.equal(er.length, 1);
  assert.equal(er[0].volumeM3, 0.4);
  assert.deepEqual(er[0].sectorIds, ['a', 'b']);
});

test('el clima medido en la finca manda sobre el modelo', () => {
  const serie = { bajado: new Date().toISOString(), dias: Array.from({ length: 21 }, (_, i) => ({ date: enDias(-14 + i), et0: 3.5, lluvia: 0 })) };
  const con = C.contexto(serie, { lluviaLocal: { [enDias(-2)]: 18 }, reservaMedida: 12 });
  assert.equal(con.lluviaPasada, 18);
  assert.equal(con.reservaMm, 12);
  assert.equal(con.reservaOrigen, 'sonda');
  assert.equal(C.contexto(serie).reservaOrigen, 'estimada');
  assert.equal(C.contexto(serie, { reservaMedida: 99, reservaMax: 25 }).reservaMm, 25);
});

test('datos de prueba: marcados para borrarlos y coherentes con el consumo del modelo', () => {
  const pr = S.lecturasDePrueba({ dias: 3, consumoDiaM3: 0.15 });
  assert.ok(pr.every(l => l.fuente === 'prueba' && l.id.startsWith('prueba|')));
  assert.ok(S.eventosNivel(pr, S.APARATOS_DE_PRUEBA).every(e => e.levelM > 0 && e.levelM <= 2));
  const riegos = Object.values(S.riegoPorDia(pr, S.APARATOS_DE_PRUEBA)['prueba-caudal']).filter(v => v > 0);
  assert.ok(riegos.every(v => v > 150 && v < 240), 'unos 195 L al día');
});

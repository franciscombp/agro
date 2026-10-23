// Aviso de hongos: varios días húmedos y templados, y sólo de lo que hay sembrado.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diaFavorable, riesgoHongos } from '../hongos.js';
import { normaliza } from '../clima.js';

const humedo = date => ({ date, hr: 92, lluvia: 6, horasLluvia: 5, tmax: 18, tmin: 8 });
const seco = date => ({ date, hr: 60, lluvia: 0, horasLluvia: 0, tmax: 22, tmin: 6 });
const dias = (...fs) => fs.map((f, i) => f(`2026-10-${String(20 + i).padStart(2, '0')}`));

test('un día húmedo y templado es bueno para el hongo; uno frío o seco, no', () => {
  assert.equal(diaFavorable(humedo('2026-10-22')), true);
  assert.equal(diaFavorable(seco('2026-10-22')), false);
  assert.equal(diaFavorable({ ...humedo('x'), tmax: 9, tmin: 1 }), false);   // media de 5 °C
  assert.equal(diaFavorable({ ...humedo('x'), lluvia: 0.5, horasLluvia: 1 }), false);
  assert.equal(diaFavorable({ ...humedo('x'), hr: null }), null);             // sin dato, no se adivina
});

test('tres días favorables con uno por venir avisan, de lo que hay sembrado', () => {
  // 20..25: hoy es el 22.
  const serie = dias(humedo, humedo, humedo, seco, seco, seco);
  const r = riesgoHongos(serie, '2026-10-22', ['arandano', 'aguacate']);
  assert.equal(r.favorables.length, 3);
  assert.deepEqual(r.enfermedades.map(e => e.id), ['botrytis']);
  assert.deepEqual(r.enfermedades[0].cultivos, ['arandano']);
});

test('sin cultivo sensible, sin días por venir o con dos días, no hay aviso', () => {
  const serie = dias(humedo, humedo, humedo, seco, seco, seco);
  assert.equal(riesgoHongos(serie, '2026-10-22', ['aguacate']), null);
  assert.equal(riesgoHongos(dias(humedo, humedo, seco, seco, seco, seco), '2026-10-22', ['papa']), null);
  // La humedad ya pasó: el 18 al 21, hoy 23.
  const pasada = dias(humedo, humedo, seco, seco, seco, seco).map((d, i) => ({ ...d, date: `2026-10-${18 + i}` }));
  pasada[2] = humedo('2026-10-20'); pasada[3] = humedo('2026-10-21');
  assert.equal(riesgoHongos(pasada, '2026-10-23', ['papa']), null);
});

test('el tomate entra en las dos enfermedades', () => {
  const r = riesgoHongos(dias(seco, seco, humedo, humedo, humedo, seco), '2026-10-22', ['tomate']);
  assert.deepEqual(r.enfermedades.map(e => e.id), ['botrytis', 'lancha']);
});

test('el clima bajado trae la humedad y las horas de lluvia', () => {
  const s = normaliza({ daily: { time: ['2026-10-22'], et0_fao_evapotranspiration: [3],
    precipitation_sum: [4], relative_humidity_2m_mean: [88], precipitation_hours: [6] } });
  assert.equal(s.dias[0].hr, 88);
  assert.equal(s.dias[0].horasLluvia, 6);
});

// El huerto: cuánta agua pide cada cultivo, el consejo en año seco, la luna
// y las fechas locales (el día de Ecuador, no el de Greenwich).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CULTIVOS } from '../huerto/catalogo.js';
import * as N from '../huerto/nino.js';
import { faseLunar, valorarDia } from '../huerto/luna.js';
import { diaLocal } from '../fechas.js';

const cultivo = id => CULTIVOS.find(c => c.id === id);
const seco = N.estadoHidrico({ lluvia90: 30, normal90: 140, et090: 300 });

test('demanda de agua: el texto de riego se lee con la precedencia correcta', () => {
  // "Frecuente y ligero" es mucha agua, no poca: manda "frecuente".
  assert.equal(N.demandaAgua(cultivo('rabano')).nivel, 3);
  // "Aprovecha lluvias; necesita humedad constante" tampoco es poca agua.
  assert.equal(N.demandaAgua(cultivo('cacao')).nivel, 3);
  assert.equal(N.demandaAgua(cultivo('quinua')).nivel, 0);
  assert.equal(N.demandaAgua(cultivo('papa')).nivel, 1);
});

test('los animales no entran en el análisis de agua', () => {
  const animal = CULTIVOS.find(c => c.cat === 'animal');
  assert.equal(N.demandaAgua(animal), null);
});

test('estado hídrico: 79 % menos lluvia que lo normal es sequía', () => {
  assert.equal(seco.nivel, 'sequia');
  assert.equal(seco.desvio, -79);
});

test('año seco: lo resistente sube y el consejo se lee bien en todo el catálogo', () => {
  const ctx = { estado: seco, fase: 'nino', altitud: 2790, tieneRiego: true };
  const orden = N.ordenaPorAgua(CULTIVOS.filter(c => c.cat !== 'animal'), ctx);
  assert.equal(N.demandaAgua(orden[0]).nivel, 0);
  for (const c of CULTIVOS) {
    const k = N.consejoCultivo(c, ctx);
    if (!k) continue;
    // Una etiqueta pegada a un verbo daba "Aguanta con resiste sequía".
    assert.doesNotMatch(k.texto, /Aguanta con|con resiste|undefined|NaN/, `${c.id}: ${k.texto}`);
  }
  assert.match(N.consejoCultivo(cultivo('quinua'), ctx).texto, /^Resiste la sequía/);
});

test('luna: fases en fechas conocidas', () => {
  assert.equal(faseLunar(new Date('2024-04-24T00:00:00Z')).ciclo, 'llena');
  assert.equal(faseLunar(new Date('2024-04-08T20:00:00Z')).ciclo, 'nueva');
});

test('un día con helada nunca es bueno para sembrar, sea cual sea la luna', () => {
  const d = valorarDia({ fecha: new Date('2024-04-12T12:00:00Z'), lluvia: 5, tmin: 1 });
  assert.equal(d.aviso, 'helada');
  assert.ok(d.puntos < 1);
});

test('fecha local: a las 22:00 en Ecuador sigue siendo el mismo día', () => {
  const antes = process.env.TZ;
  process.env.TZ = 'America/Guayaquil';
  try {
    // 03:00 UTC del 20 son las 22:00 del 19 en Ecuador.
    assert.equal(diaLocal(new Date('2026-10-20T03:00:00Z')), '2026-10-19');
    assert.equal(diaLocal(new Date('2026-10-20T15:00:00Z')), '2026-10-20');
  } finally {
    if (antes === undefined) delete process.env.TZ; else process.env.TZ = antes;
  }
});

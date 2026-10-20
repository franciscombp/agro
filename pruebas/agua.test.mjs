// El modelo de agua: demanda por clima, edad y etapa; reserva del suelo;
// proyección hasta el turno; y el volumen del reservorio con sensores.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as W from '../water.js';
import * as C from '../clima.js';
import { SPECIES } from '../db.js';
import { enDias, hoy } from '../fechas.js';

const r2 = x => Math.round(x * 100) / 100;
const serie = (n0, n1, et0, lluvia) => ({ bajado: new Date().toISOString(),
  dias: Array.from({ length: n1 - n0 }, (_, i) => ({ date: enDias(n0 + i), et0, lluvia })) });

const plantas = [
  { id: 'a1', species: 'aguacate', status: 'sano', plantedAt: '2010-01-01', sectorId: 's1' },
  { id: 'a2', species: 'aguacate', status: 'sano', sectorId: 's1' },
  { id: 'b1', species: 'arandano', status: 'sano', plantedAt: '2010-01-01', sectorId: 's2' },
  { id: 'm1', species: 'mora', status: 'muerto', plantedAt: '2010-01-01', sectorId: 's2' }
];
const sectores = [{ id: 's1', name: 'Aguacates', polygon: [] }, { id: 's2', name: 'Arándanos', polygon: [] }];
const finca = [
  ...Array.from({ length: 380 }, (_, i) => ({ id: 'b' + i, species: 'arandano', status: 'sano', plantedAt: '2010-01-01', sectorId: 's2' })),
  ...plantas
];
const refCtx = C.contexto(null);

test('compatibilidad: clima de referencia y plantas adultas dan los litros del catálogo', () => {
  const d = W.demand(plantas, sectores, refCtx);
  assert.equal(r2(d.totalL), 64);            // 30 + 30 + 4; la muerta no cuenta
  assert.equal(r2(d.totalRefL), 64);
  assert.equal(refCtx.conocido, false);
});

test('lluvia aprovechable: la llovizna no cuenta, del resto entra el 75 %', () => {
  assert.equal(C.lluviaEfectiva(0), 0);
  assert.equal(C.lluviaEfectiva(2), 0);
  assert.equal(r2(C.lluviaEfectiva(10)), 6);
});

test('un aguacero deja la demanda en casi nada; el sol fuerte la sube en proporción', () => {
  assert.ok(W.demand(plantas, sectores, C.contexto(serie(0, 7, 3.5, 20))).totalL < 64 * 0.2);
  assert.equal(r2(W.demand(plantas, sectores, C.contexto(serie(0, 7, 5.25, 0))).totalL), 96);
});

test('edad: una planta joven pide menos; sin fecha se asume adulta', () => {
  const joven = { species: 'arandano', status: 'sano', plantedAt: enDias(-30) };
  const viejo = { species: 'arandano', status: 'sano', plantedAt: '2010-01-01' };
  assert.ok(W.litrosPlantaDia(joven) < W.litrosPlantaDia(viejo));
  assert.equal(r2(W.litrosPlantaDia(viejo)), 4);
  assert.equal(W.fraccionEdad({}, { maduraAnios: 4 }), 1);
  assert.equal(r2(W.fraccionEdad({ plantedAt: enDias(-1) }, { maduraAnios: 4 })), 0.25);
});

test('proyección: la lluvia pronosticada alarga la autonomía', () => {
  const seco = W.proyeccion({ volumeM3: 3, plants: finca, clima: C.contexto(serie(0, 7, 3.5, 0)) });
  const mojado = W.proyeccion({ volumeM3: 3, plants: finca, clima: C.contexto(serie(0, 7, 3.5, 15)) });
  assert.ok(seco.diasHastaVacio != null);
  assert.ok(mojado.diasHastaVacio == null || mojado.diasHastaVacio > seco.diasHastaVacio);
  assert.equal(seco.curva.length, 21);
  assert.equal(seco.diasPronosticados, 7);
  assert.equal(seco.alMenosDias, null);
});

test('reserva del suelo: tras días de lluvia cubre la demanda; tras dos semanas secas, no', () => {
  const dias = [
    ...Array.from({ length: 10 }, (_, i) => ({ date: enDias(-14 + i), et0: 3.5, lluvia: 0 })),
    ...Array.from({ length: 4 }, (_, i) => ({ date: enDias(-4 + i), et0: 3.5, lluvia: 20 })),
    { date: hoy(), et0: 3.5, lluvia: 0 }
  ];
  const mojado = C.contexto({ bajado: new Date().toISOString(), dias });
  assert.ok(mojado.reservaMm > 10);
  assert.equal(W.demand(plantas, sectores, mojado).totalL, 0);
  const seco = C.contexto({ bajado: new Date().toISOString(),
    dias: Array.from({ length: 15 }, (_, i) => ({ date: enDias(-14 + i), et0: 3.5, lluvia: 0 })) });
  assert.equal(seco.reservaMm, 0);
  assert.equal(r2(W.demand(plantas, sectores, seco).totalL), 64);
  // y la reserva se agota: no tapa una sequía larga
  assert.ok(W.proyeccion({ volumeM3: 0.5, plants: finca, clima: mojado }).diasHastaVacio != null);
});

test('etapa del cultivo: llenado sube, reposo baja, sin declarar no toca nada', () => {
  const sec = [{ id: 's1', etapa: 'llenado' }, { id: 's2', etapa: 'reposo' }];
  assert.equal(r2(W.litrosPlantaDia(plantas[0], { sectors: sec })), r2(30 * 1.15));
  assert.equal(r2(W.litrosPlantaDia(plantas[2], { sectors: sec })), r2(4 * 0.35));
  assert.equal(W.factorEtapa(plantas[0], []), 1);
  assert.equal(W.factorEtapa({ sectorId: 's1' }, [{ id: 's1' }]), 1);
  const d = W.demand(plantas, sec, refCtx);
  assert.equal(r2(d.totalRefL), r2(d.totalL));   // la referencia incluye la etapa
});

test('¿llega al turno?: con poca agua no, y dice cuánto falta; lleno, sí', () => {
  const cfg = { reservorioVolumenM3: 80, reservorioAlturaUtilM: 2, cicloTurnoDias: 15, proximoTurno: enDias(10) };
  const poco = W.summary({ plants: finca, sectors: sectores, config: cfg, clima: serie(0, 7, 3.5, 0),
    water: [{ id: 'w', type: 'medición_nivel', date: enDias(-1), levelM: 0.15 }] });
  assert.equal(poco.llegaAlTurno, false);
  assert.ok(poco.deficitM3 > 0);
  const lleno = W.summary({ plants: finca, sectors: sectores, config: cfg, clima: serie(0, 7, 3.5, 0),
    water: [{ id: 'w', type: 'medición_nivel', date: enDias(-1), levelM: 2 }] });
  assert.equal(lleno.llegaAlTurno, true);
  assert.equal(lleno.deficitM3, 0);
});

test('sin clima, los números de siempre; la demanda manual manda', () => {
  const cfg = { reservorioVolumenM3: 80, reservorioAlturaUtilM: 2, cicloTurnoDias: 15, proximoTurno: enDias(10) };
  const water = [{ id: 'w', type: 'medición_nivel', date: enDias(-1), levelM: 2 }];
  const s = W.summary({ plants: plantas, sectors: sectores, water, config: cfg, clima: null });
  assert.equal(r2(s.demand.totalL), 64);
  assert.equal(s.clima.conocido, false);
  const m = W.summary({ plants: plantas, sectors: sectores, water, config: { ...cfg, demandaDiariaM3: 0.5 }, clima: serie(0, 7, 3.5, 20) });
  assert.equal(m.dailyM3, 0.5);
  assert.ok(m.dailyManual);
});

test('nivel del sensor de hoy es el volumen de hoy; uno a mano se toma como de la mañana', () => {
  const cfg = { reservorioVolumenM3: 80, reservorioAlturaUtilM: 2 };
  const sensor = W.currentVolumeM3([{ id: 's', type: 'medición_nivel', date: hoy(), levelM: 1.42, origen: 'sensor', medidoA: new Date().toISOString() }], cfg, 0.3);
  assert.equal(r2(sensor.volumeM3), 56.8);
  const mano = W.currentVolumeM3([{ id: 'm', type: 'medición_nivel', date: hoy(), levelM: 1.42 }], cfg, 0.3);
  assert.equal(r2(mano.volumeM3), 56.5);
  const ayer = W.currentVolumeM3([{ id: 's', type: 'medición_nivel', date: enDias(-1), levelM: 1.42, origen: 'sensor' }], cfg, 0.3);
  assert.equal(r2(ayer.volumeM3), 56.5);
});

test('catálogo: cada especie tiene Kc y edad de madurez, y su área es razonable', () => {
  for (const [id, sp] of Object.entries(SPECIES)) {
    assert.ok(sp.kc > 0 && sp.maduraAnios > 0, id);
    if (sp.lppd > 0) assert.ok(W.areaPlantaM2(sp) > 0.3 && W.areaPlantaM2(sp) < 15, id);
  }
});

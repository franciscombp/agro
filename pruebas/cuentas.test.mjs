// Fumigaciones con días de espera, y las cuentas de verdad frente a lo esperado.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sumarDias, carenciasActivas, carenciasPara } from '../carencia.js';
import { resumen, esperado, ultimoAnio } from '../huerto/cuentas.js';
import { CULTIVOS } from '../huerto/catalogo.js';

const getItem = id => CULTIVOS.find(c => c.id === id);
const unidadDe = id => (getItem(id)?.rendUnidad === 'kg' ? 'kg' : getItem(id)?.rendUnidad);

const plants = [
  { id: 'p1', sectorId: 'sA', species: 'arandano', plantedAt: '2020-01-01', status: 'sano' },
  { id: 'p2', sectorId: 'sA', species: 'arandano', plantedAt: '2020-01-01', status: 'sano' },
  { id: 'p3', sectorId: 'sB', species: 'aguacate', plantedAt: '2025-12-01', status: 'sano' }
];
const fumiga = (extra) => ({ id: 'f', type: 'fumigación', doneAt: '2026-10-20', carenciaDias: 7, ...extra });

test('sumar días cruza meses y años sin depender de la hora local', () => {
  assert.equal(sumarDias('2026-12-28', 7), '2027-01-04');
  assert.equal(sumarDias('2026-03-01', -1), '2026-02-28');
});

test('la espera corre desde que se fumiga y se cosecha el día en que termina', () => {
  const t = fumiga({ targetType: 'sector', targetId: 'sA' });
  assert.equal(carenciasActivas([t], '2026-10-26')[0].desde, '2026-10-27');
  assert.equal(carenciasActivas([t], '2026-10-27').length, 0);
});

test('una fumigación pendiente, sin días o de otro tipo no bloquea nada', () => {
  const tareas = [
    fumiga({ doneAt: undefined, dueAt: '2026-10-20' }),
    fumiga({ carenciaDias: 0 }),
    fumiga({ type: 'poda' })
  ];
  assert.equal(carenciasActivas(tareas, '2026-10-21').length, 0);
});

test('la espera de un sector toca a sus plantas; la de una planta, a parte de su sector', () => {
  const hoy = '2026-10-22';
  const delSector = carenciasActivas([fumiga({ targetType: 'sector', targetId: 'sA' })], hoy);
  assert.equal(carenciasPara({ plantId: 'p1' }, delSector, plants).length, 1);
  assert.equal(carenciasPara({ sectorId: 'sB' }, delSector, plants).length, 0);

  const deUna = carenciasActivas([fumiga({ targetType: 'plant', targetId: 'p1' })], hoy);
  assert.equal(carenciasPara({ plantId: 'p2' }, deUna, plants).length, 0);
  const [parte] = carenciasPara({ sectorId: 'sA' }, deUna, plants);
  assert.equal(parte.parcial, true);

  const finca = carenciasActivas([fumiga({ targetType: 'parcel', targetId: 'x' })], hoy);
  assert.equal(carenciasPara({ sectorId: 'sB' }, finca, plants)[0].parcial, false);
});

test('manda la espera entera que termina más tarde', () => {
  const activas = carenciasActivas([
    fumiga({ id: 'a', targetType: 'plant', targetId: 'p1', carenciaDias: 30 }),
    fumiga({ id: 'b', targetType: 'sector', targetId: 'sA', carenciaDias: 5 }),
    fumiga({ id: 'c', targetType: 'sector', targetId: 'sA', carenciaDias: 10 })
  ], '2026-10-21');
  assert.equal(carenciasPara({ sectorId: 'sA' }, activas, plants)[0].task.id, 'c');
});

test('lo esperado: un arándano adulto da un año entero; un aguacate joven todavía no da', () => {
  const periodo = ultimoAnio('2026-10-22');
  const e = esperado({ plants }, periodo, getItem, unidadDe);
  const arandano = e.filter(x => x.prod === 'arandano').reduce((n, x) => n + x.cantidad, 0);
  assert.ok(Math.abs(arandano - 2 * getItem('arandano').rendimiento) < 0.01, String(arandano));
  assert.equal(e.filter(x => x.prod === 'aguacate').length, 0);
});

test('lo esperado de un cultivo de un ciclo cuenta sólo si la cosecha cayó en el periodo', () => {
  const lechuga = getItem('lechuga');
  const periodo = { desde: '2026-01-01', hasta: '2026-10-22' };
  const dentro = { cropId: 'lechuga', cantidad: 10, fecha: sumarDias('2026-06-01', -lechuga.diasProduccion), sectorId: 'sH' };
  const fuera = { ...dentro, fecha: '2026-10-01' };
  const e = esperado({ siembras: [dentro, fuera] }, periodo, getItem, unidadDe);
  assert.equal(e.length, 1);
  assert.equal(e[0].cantidad, lechuga.rendimiento * 10);
});

test('las cuentas suman ventas, gastos y el costo de las tareas hechas, por sector', () => {
  const periodo = { desde: '2026-01-01', hasta: '2026-12-31' };
  const r = resumen({
    plants,
    cosechas: [{ fecha: '2026-05-01', sectorId: 'sA', prod: 'arandano', cantidad: 4, unidad: 'kg' }],
    ventas: [
      { fecha: '2026-05-02', sectorId: 'sA', prod: 'arandano', cantidad: 4, precio: 6 },
      { fecha: '2025-05-02', sectorId: 'sA', prod: 'arandano', cantidad: 100, precio: 6 }   // otro año
    ],
    gastos: [{ fecha: '2026-03-01', sectorId: 'sA', monto: 5 }, { fecha: '2026-03-01', monto: 2 }],
    tasks: [
      { type: 'fumigación', targetType: 'plant', targetId: 'p1', doneAt: '2026-04-01', costo: 3 },
      { type: 'poda', targetType: 'sector', targetId: 'sA', dueAt: '2026-04-01', costo: 50 }    // sin hacer
    ]
  }, periodo, getItem, unidadDe);
  assert.equal(r.vendido, 24);
  assert.equal(r.gastado, 10);
  assert.equal(r.queda, 14);
  const sA = r.sectores.find(s => s.sectorId === 'sA');
  assert.equal(sA.gastado, 8);
  assert.equal(sA.productos[0].cosechado, 4);
  assert.ok(sA.productos[0].esperado > 0);
  assert.equal(r.sectores.find(s => s.sectorId === '').gastado, 2);
});

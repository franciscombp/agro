// Las cuentas de verdad: lo que se cosechó, lo que se vendió y lo que se gastó.
//
// La calculadora de cada cultivo dice cuánto *debería* dar; esto suma lo que
// se anotó, por sector, y lo pone al lado de lo esperado para el mismo tiempo.
// Lógica pura, sin pantalla ni base de datos: recibe los registros y el
// catálogo, y devuelve números. Así se prueba con node.
"use strict";

import { sumarDias } from '../carencia.js';

/** Días de calendario de `a` a `b` (AAAA-MM-DD). */
function dias(a, b) {
  return Math.round((Date.parse(b.slice(0, 10) + 'T00:00:00Z') - Date.parse(a.slice(0, 10) + 'T00:00:00Z')) / 86400000);
}

/** Los últimos 12 meses hasta hoy, incluido. */
export function ultimoAnio(hoy) {
  return { desde: sumarDias(hoy, -364), hasta: hoy };
}

function dentro(fecha, { desde, hasta }) {
  return !!fecha && fecha.slice(0, 10) >= desde && fecha.slice(0, 10) <= hasta;
}

export function totalVenta(v) {
  return (Number(v.cantidad) || 0) * (Number(v.precio) || 0);
}

/**
 * Lo que cada sector debería haber dado en el periodo, según el catálogo.
 *
 * - Lo de una sola cosecha (lechuga, papa) cuenta si su cosecha cayó dentro.
 * - Lo que produce cada año o cada mes (arándano, aguacate, huevos) cuenta por
 *   la parte del periodo en que ya estaba produciendo: un arándano que empezó
 *   a dar hace tres meses no debe un año entero.
 * - Las plantas de la finca entran por su especie, si el catálogo la tiene.
 *
 * El catálogo da el rendimiento de una planta en plena producción, y una que
 * recién empieza da menos: lo esperado es un techo, no una promesa.
 */
export function esperado({ plants = [], siembras = [] }, periodo, getItem, unidadDe) {
  const largo = dias(periodo.desde, periodo.hasta) + 1;
  const out = [];
  const sumar = (sectorId, c, cantidad, inicioProduccion) => {
    if (!c || !(cantidad > 0)) return;
    let factor;
    if (c.modelo === 'ciclo') {
      factor = dentro(inicioProduccion, periodo) ? 1 : 0;
    } else {
      const desde = inicioProduccion > periodo.desde ? inicioProduccion : periodo.desde;
      const produciendo = Math.max(0, dias(desde, periodo.hasta) + 1);
      factor = Math.min(1, produciendo / largo) * (c.modelo === 'mensual' ? largo / 30.4 : largo / 365);
    }
    if (!(factor > 0)) return;
    out.push({ sectorId: sectorId || '', prod: c.id, unidad: unidadDe(c.id), cantidad: c.rendimiento * cantidad * factor });
  };
  for (const s of siembras) {
    const c = getItem(s.cropId);
    if (c) sumar(s.sectorId, c, Number(s.cantidad), sumarDias(s.fecha, c.diasProduccion));
  }
  for (const p of plants) {
    if (p.status === 'muerto') continue;
    const c = getItem(p.species);
    // Sin fecha de siembra se supone adulta: los árboles viejos casi nunca la tienen.
    if (c) sumar(p.sectorId, c, 1, p.plantedAt ? sumarDias(p.plantedAt, c.diasProduccion) : '0000-01-01');
  }
  return out;
}

/** De qué sector es un gasto anotado como costo de una tarea. */
function sectorDeTarea(t, plants) {
  if (t.targetType === 'sector') return t.targetId;
  if (t.targetType === 'plant') return plants.find(p => p.id === t.targetId)?.sectorId || '';
  return '';
}

/**
 * Las cuentas del periodo, en total y por sector. Los gastos son los anotados
 * como gasto y el costo de las tareas hechas (una fumigación, un abonado): el
 * mismo dinero no se anota dos veces.
 *
 * El sector `''` es lo que no tiene sector: toda la finca.
 */
export function resumen({ cosechas = [], ventas = [], gastos = [], tasks = [], plants = [], siembras = [] },
  periodo, getItem, unidadDe) {
  const sectores = new Map();
  const de = id => {
    const k = id || '';
    if (!sectores.has(k)) sectores.set(k, { sectorId: k, vendido: 0, gastado: 0, productos: new Map() });
    return sectores.get(k);
  };
  const producto = (sector, prod, unidad) => {
    const k = prod + '|' + unidad;
    if (!sector.productos.has(k)) sector.productos.set(k, { prod, unidad, cosechado: 0, esperado: 0 });
    return sector.productos.get(k);
  };

  for (const v of ventas) if (dentro(v.fecha, periodo)) de(v.sectorId).vendido += totalVenta(v);
  for (const g of gastos) if (dentro(g.fecha, periodo)) de(g.sectorId).gastado += Number(g.monto) || 0;
  for (const t of tasks) {
    if (t.costo > 0 && dentro(t.doneAt, periodo)) de(sectorDeTarea(t, plants)).gastado += Number(t.costo);
  }
  for (const c of cosechas) {
    if (dentro(c.fecha, periodo)) producto(de(c.sectorId), c.prod, c.unidad).cosechado += Number(c.cantidad) || 0;
  }
  for (const e of esperado({ plants, siembras }, periodo, getItem, unidadDe)) {
    producto(de(e.sectorId), e.prod, e.unidad).esperado += e.cantidad;
  }

  const lista = [...sectores.values()].map(s => ({
    ...s, queda: s.vendido - s.gastado,
    productos: [...s.productos.values()].sort((a, b) => b.cosechado - a.cosechado || b.esperado - a.esperado)
  }));
  const vendido = lista.reduce((n, s) => n + s.vendido, 0);
  const gastado = lista.reduce((n, s) => n + s.gastado, 0);
  return { vendido, gastado, queda: vendido - gastado, sectores: lista };
}

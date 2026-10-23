// La libreta de cuentas: anotar lo cosechado, lo vendido y lo gastado, y el
// panel «Cuentas» del huerto, que lo pone frente a lo que se esperaba.
//
// Los formularios siguen la regla de los de Hoy: pocas preguntas, en palabras
// del campo, lo opcional dicho como opcional. Las sumas están en cuentas.js.
"use strict";

import * as db from '../db.js';
import { SPECIES } from '../db.js';
import { state, avisarCambio } from '../estado.js';
import { carenciasActivas, carenciasPara } from '../carencia.js';
import { resumen, ultimoAnio, totalVenta } from './cuentas.js';
import { getItem, prodNombre, prodEmoji, prodUnidad, opcionesProducto, contar } from './huerto.js';
import { $, toast, openSheet, closeSheet, escapeHtml, attr, nf, dinero as centavos, fechaCorta, today } from '../ui.js';

/* ── Dónde se fumigó, en palabras ──────────────────────────────────────── */

export function lugarDeTarea(t) {
  if (t.targetType === 'parcel') return 'Toda la finca';
  if (t.targetType === 'sector') return state.sectors.find(s => s.id === t.targetId)?.name || 'Un sector';
  const p = state.plants.find(x => x.id === t.targetId);
  return p ? `${SPECIES[p.species]?.label || p.species}${p.variety ? ' ' + p.variety : ''}` : 'Una planta';
}

/** Las esperas que corren hoy, para quien pregunte. */
export function esperasDeHoy() {
  return carenciasActivas(state.tasks, today());
}

/** La espera que manda en un sitio, o nada. */
export function esperaEn(lugar) {
  return carenciasPara(lugar, esperasDeHoy(), state.plants)[0] || null;
}

/** «Se fumigó con Mancozeb el lun 20: se puede cosechar desde el jue 30.» */
export function fraseEspera(c) {
  const t = c.task;
  return `Se fumigó${t.producto ? ' con ' + escapeHtml(t.producto) : ''} el ${fechaCorta(t.doneAt)}: ` +
    `se puede cosechar desde el ${fechaCorta(c.desde)}.`;
}

/* ── Anotar una cosecha ────────────────────────────────────────────────── */

function opcionesSector(actual, vacio = 'Toda la finca') {
  return `<option value="">${vacio}</option>` + state.sectors.map(s =>
    `<option value="${s.id}" ${s.id === actual ? 'selected' : ''}>${escapeHtml(s.name)}</option>`).join('');
}

/**
 * Campo de producto con su «otro» y la unidad. Lo comparten la cosecha y la
 * venta: el mismo producto tiene que llamarse igual en las dos, o las cuentas
 * no lo juntan.
 */
function campoProducto(prod, sectorId) {
  return `<label>¿Qué? <select name="prod">${opcionesProducto(prod, { sectorId })}</select></label>
    <label data-otro hidden>¿Cuál? <input name="otro" placeholder="Ej.: queso fresco" /></label>`;
}

function leerProducto(f) {
  if (f.prod.value !== '__otro') return f.prod.value;
  const n = f.otro.value.trim().toLowerCase();
  return n ? 'otro:' + n : null;
}

/** Unidad del producto elegido; los productos fuera del catálogo la piden. */
function enlazarProducto(body, alCambiar) {
  const f = body.querySelector('form');
  const sync = () => {
    const otro = f.prod.value === '__otro';
    body.querySelector('[data-otro]').hidden = !otro;
    const u = otro || f.prod.value.startsWith('otro:') ? null : prodUnidad(f.prod.value);
    body.querySelector('[data-unidad-fija]').hidden = !u;
    body.querySelector('[data-unidad-libre]').hidden = !!u;
    // Lo escondido no puede ser obligatorio: el navegador no dejaría guardar.
    f.cantidad.required = !!u;
    f.cantidadLibre.required = !u;
    if (u) body.querySelector('[data-unidad-fija] i').textContent = u;
    alCambiar?.();
  };
  f.prod.addEventListener('change', sync);
  sync();
  return () => (f.prod.value === '__otro' || f.prod.value.startsWith('otro:')
    ? (f.unidad.value.trim() || 'kg') : prodUnidad(f.prod.value));
}

function campoCantidad(pregunta) {
  return `<label>${pregunta}
      <span class="con-unidad con-unidad--grande" data-unidad-fija><input type="number" name="cantidad" min="0.01" step="0.01" inputmode="decimal" required /><i>kg</i></span>
      <span class="field-grid-2" data-unidad-libre hidden>
        <input type="number" name="cantidadLibre" min="0.01" step="0.01" inputmode="decimal" aria-label="Cantidad" />
        <input name="unidad" placeholder="kg, unidades, atados" aria-label="Unidad" /></span></label>`;
}

function leerCantidad(f) {
  return Number(f.cantidad.required ? f.cantidad.value : f.cantidadLibre.value) || 0;
}

/**
 * Anotar lo cosechado. Si se viene de una siembra («Ya coseché»), el producto
 * y el sector ya están puestos y la siembra sale de la lista al guardar.
 *
 * Antes de guardar mira si en ese sitio corre una espera de fumigación: no
 * impide anotar —la app no está en el terreno y puede que la fruta ya esté
 * cortada—, pero pide confirmarlo con todas las letras.
 */
export function abrirCosecha({ prod, sectorId, siembraId } = {}) {
  const siembra = siembraId && state.siembras.find(s => s.id === siembraId);
  openSheet('Coseché', `
    <form id="f-cosecha">
      <label>¿Cuándo? <input type="date" name="fecha" value="${today()}" max="${today()}" required /></label>
      <label>¿De dónde? <select name="sectorId">${opcionesSector(sectorId)}</select></label>
      ${campoProducto(prod, sectorId)}
      ${campoCantidad('¿Cuánto?')}
      <div data-espera hidden></div>
      <label>Nota (opcional) <input name="nota" placeholder="Ej.: primera pasada, fruta pequeña" /></label>
      <button class="btn btn--rojo btn-block" type="submit">Guardar</button>
      ${siembra ? '<button class="btn btn-block" type="button" data-act="sin">Ya está cosechada, sin anotar cuánto</button>' : ''}
    </form>`, body => {
    const f = body.querySelector('#f-cosecha');
    const pintarEspera = () => {
      const c = esperaEn({ sectorId: f.sectorId.value || undefined });
      const cont = body.querySelector('[data-espera]');
      cont.hidden = !c;
      cont.innerHTML = c ? `<p class="aviso aviso--peligro"><span>🧴</span><span><b>${c.parcial ? 'Parte de este sector' : 'Aquí'} todavía no se cosecha.</b>
          ${fraseEspera(c)}</span></p>
        <label class="row confirma"><input type="checkbox" class="chk" name="igual" required /> Lo sé: anotar la cosecha igual</label>` : '';
    };
    const unidad = enlazarProducto(body);
    // Al cambiar de sector, lo primero de la lista pasa a ser lo que hay en
    // él, salvo que ya se haya elegido el producto a mano.
    let elegido = !!prod;
    f.prod.addEventListener('change', () => { elegido = true; });
    f.sectorId.addEventListener('change', () => {
      if (!elegido) {
        f.prod.innerHTML = opcionesProducto(undefined, { sectorId: f.sectorId.value || undefined });
        f.prod.dispatchEvent(new Event('change'));
        elegido = false;
      }
      pintarEspera();
    });
    pintarEspera();
    f.onsubmit = async ev => {
      ev.preventDefault();
      const p = leerProducto(f);
      if (!p) { f.otro.focus(); return; }
      const cantidad = leerCantidad(f);
      if (!(cantidad > 0)) return toast('¿Cuánto cosechaste?');
      await db.put('cosechas', {
        fecha: f.fecha.value, sectorId: f.sectorId.value || undefined, prod: p, cantidad, unidad: unidad(),
        nota: f.nota.value.trim() || undefined, siembraId: siembra?.id
      });
      if (siembra) await db.put('siembras', { ...siembra, cosechadaEl: f.fecha.value });
      closeSheet();
      toast(`¡Buena cosecha! ${contar(cantidad, unidad(), nf(cantidad, cantidad % 1 ? 1 : 0))} de ${prodNombre(p).toLowerCase()}.`);
      avisarCambio();
    };
    body.querySelector('[data-act="sin"]')?.addEventListener('click', async () => {
      await db.put('siembras', { ...siembra, cosechadaEl: f.fecha.value });
      closeSheet();
      toast('¡Buena cosecha!');
      avisarCambio();
    });
  });
}

/* ── Anotar una venta ──────────────────────────────────────────────────── */

/**
 * Anotar lo vendido. El precio de la venta entra solo a la libreta de precios
 * del mercado: es un precio de verdad, y anotarlo dos veces es la forma más
 * segura de que no se anote ninguna.
 */
export function abrirVenta({ prod, sectorId } = {}) {
  const ultimaCosecha = [...state.cosechas].sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''))[0];
  const p0 = prod || ultimaCosecha?.prod;
  const s0 = sectorId ?? (p0 && p0 === ultimaCosecha?.prod ? ultimaCosecha.sectorId : undefined);
  openSheet('Vendí', `
    <form id="f-venta">
      ${campoProducto(p0, s0)}
      ${campoCantidad('¿Cuánto vendiste?')}
      <label><span data-precio-label>¿A cuánto?</span>
        <span class="con-unidad"><input type="number" name="precio" min="0.01" step="0.01" inputmode="decimal" placeholder="0,50" required /><i>$</i></span></label>
      <p class="equivale" data-total>&nbsp;</p>
      <label>¿A quién o dónde? (opcional) <input name="comprador" placeholder="Ej.: feria de Salcedo, don Luis" /></label>
      <details class="mas-campos">
        <summary>Más datos (fecha, de qué sector)</summary>
        <label>¿Cuándo? <input type="date" name="fecha" value="${today()}" max="${today()}" required /></label>
        <label>¿De qué sector salió? <select name="sectorId">${opcionesSector(s0, 'No sé / de varios')}</select></label>
      </details>
      <button class="btn btn--rojo btn-block" type="submit">Guardar</button>
    </form>`, body => {
    const f = body.querySelector('#f-venta');
    let unidad;
    const total = () => {
      const t = leerCantidad(f) * (Number(f.precio.value) || 0);
      body.querySelector('[data-total]').innerHTML = t > 0 ? `= <b>$${centavos(t)}</b> en total` : '&nbsp;';
    };
    // El sector sigue al producto: de dónde salió la última cosecha de eso.
    const sectorDe = p => [...state.cosechas].filter(c => c.prod === p)
      .sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''))[0]?.sectorId || '';
    unidad = enlazarProducto(body, () => {
      if (!unidad) return;
      body.querySelector('[data-precio-label]').textContent = `¿A cuánto el ${unidad()}?`;
      f.sectorId.value = sectorDe(f.prod.value);
      total();
    });
    body.querySelector('[data-precio-label]').textContent = `¿A cuánto el ${unidad()}?`;
    f.addEventListener('input', total);
    f.onsubmit = async ev => {
      ev.preventDefault();
      const p = leerProducto(f);
      if (!p) { f.otro.focus(); return; }
      const cantidad = leerCantidad(f);
      if (!(cantidad > 0)) return toast('¿Cuánto vendiste?');
      const comprador = f.comprador.value.trim() || undefined;
      const venta = await db.put('ventas', {
        fecha: f.fecha.value, prod: p, cantidad, unidad: unidad(), precio: Number(f.precio.value),
        comprador, sectorId: f.sectorId.value || undefined
      });
      await db.put('precios', { prod: p, precio: venta.precio, lugar: comprador, fecha: venta.fecha, ventaId: venta.id });
      closeSheet();
      toast(`Venta anotada: $${centavos(totalVenta(venta))}`);
      avisarCambio();
    };
  });
}

/* ── Anotar un gasto ───────────────────────────────────────────────────── */

export const CONCEPTOS = [
  ['abono', '🧪', 'Abono'], ['fumigacion', '🧴', 'Fumigación'], ['semilla', '🌱', 'Semillas o plantas'],
  ['jornal', '👷', 'Jornales'], ['agua', '🚚', 'Agua o tanquero'], ['transporte', '🛻', 'Transporte'],
  ['herramienta', '🔧', 'Herramientas'], ['otro', '📝', 'Otro']
];
const concepto = id => CONCEPTOS.find(c => c[0] === id) || CONCEPTOS.at(-1);

export function abrirGasto() {
  openSheet('Un gasto', `
    <form id="f-gasto">
      <fieldset class="elige elige--3">
        <legend>¿En qué?</legend>
        ${CONCEPTOS.map(([id, emoji, txt], i) =>
          `<label><input type="radio" name="concepto" value="${id}" ${i === 0 ? 'checked' : ''} /><span>${emoji} ${txt}</span></label>`).join('')}
      </fieldset>
      <label>¿Cuánto? <span class="con-unidad con-unidad--grande"><input type="number" name="monto" min="0.01" step="0.01" inputmode="decimal" required /><i>$</i></span></label>
      <label>¿Para qué sector? <select name="sectorId">${opcionesSector('', 'Para toda la finca')}</select></label>
      <label>Detalle (opcional) <input name="nota" placeholder="Ej.: 4 sacos de gallinaza" /></label>
      <label>¿Cuándo? <input type="date" name="fecha" value="${today()}" max="${today()}" required /></label>
      <p class="hint">Lo que pongas como costo de una tarea (una fumigación, un abonado) ya cuenta: no hace falta anotarlo otra vez aquí.</p>
      <button class="btn btn--rojo btn-block" type="submit">Guardar</button>
    </form>`, body => {
    const f = body.querySelector('#f-gasto');
    f.onsubmit = async ev => {
      ev.preventDefault();
      await db.put('gastos', {
        fecha: f.fecha.value, concepto: f.concepto.value, monto: Number(f.monto.value),
        sectorId: f.sectorId.value || undefined, nota: f.nota.value.trim() || undefined
      });
      closeSheet();
      toast('Gasto anotado');
      avisarCambio();
    };
  });
}

/* ── Panel: cuentas ────────────────────────────────────────────────────── */

function cuentasDelAnio() {
  return resumen({
    cosechas: state.cosechas, ventas: state.ventas, gastos: state.gastos, tasks: state.tasks,
    plants: state.plants, siembras: [...state.siembras, ...state.siembrasHechas]
  }, ultimoAnio(today()), getItem, prodUnidad);
}

/** Lo que Hoy dice de las cuentas: nada si todavía no hay nada anotado. */
export function resumenCuentasHoy() {
  const r = cuentasDelAnio();
  return r.vendido || r.gastado ? r : null;
}

function dinero(n) {
  return (n < 0 ? '−$' : '$') + centavos(Math.abs(n));
}

function nombreSector(id) {
  return id ? state.sectors.find(s => s.id === id)?.name || 'Sector borrado' : 'Toda la finca';
}

/** Todo lo anotado, lo último primero: cosechas, ventas, gastos y costos de tareas. */
function movimientos() {
  const out = [];
  for (const c of state.cosechas) out.push({ store: 'cosechas', r: c, fecha: c.fecha, emoji: '🧺',
    txt: `${prodNombre(c.prod)}: ${contar(c.cantidad, c.unidad, nf(c.cantidad, c.cantidad % 1 ? 1 : 0))}`, sub: nombreSector(c.sectorId), monto: null });
  for (const v of state.ventas) out.push({ store: 'ventas', r: v, fecha: v.fecha, emoji: '💵',
    txt: `Vendí ${prodNombre(v.prod).toLowerCase()}: ${contar(v.cantidad, v.unidad, nf(v.cantidad, v.cantidad % 1 ? 1 : 0))} a $${centavos(v.precio)}`,
    sub: v.comprador || nombreSector(v.sectorId), monto: totalVenta(v) });
  for (const g of state.gastos) {
    const [, emoji, txt] = concepto(g.concepto);
    out.push({ store: 'gastos', r: g, fecha: g.fecha, emoji, txt: g.nota ? `${txt}: ${g.nota}` : txt,
      sub: nombreSector(g.sectorId), monto: -g.monto });
  }
  for (const t of state.tasks.filter(t => t.costo > 0 && t.doneAt)) {
    out.push({ store: null, r: t, fecha: t.doneAt, emoji: '✅',
      txt: `${t.type.charAt(0).toUpperCase() + t.type.slice(1)}${t.producto ? ' · ' + t.producto : ''}`,
      sub: `${lugarDeTarea(t)} · costo de la tarea`, monto: -t.costo });
  }
  return out.sort((a, b) => (b.fecha || '').localeCompare(a.fecha || '') || (b.r.updatedAt || '').localeCompare(a.r.updatedAt || ''));
}

export function renderCuentas() {
  const cont = $('#huerto-cuentas');
  if (!cont) return;
  const r = cuentasDelAnio();
  const movs = movimientos();
  const botones = `<div class="acciones-rapidas acciones-rapidas--3">
      <button data-cta="cosecha"><span class="tile t-hortaliza">🧺</span>Coseché</button>
      <button data-cta="venta"><span class="tile t-grano">💵</span>Vendí</button>
      <button data-cta="gasto"><span class="tile t-fruta">🧾</span>Un gasto</button>
    </div>`;

  if (!movs.length) {
    cont.innerHTML = `<div class="vacio"><div class="vacio__emoji">📒</div>
        <strong>Todavía no hay cuentas</strong>
        <p>Anota lo que cosechas, lo que vendes y lo que gastas. La app lo suma por sector y lo compara con lo que la calculadora esperaba.</p></div>
      ${botones}`;
  } else {
    const sectores = r.sectores
      .filter(s => s.vendido || s.gastado || s.productos.some(p => p.cosechado))
      .sort((a, b) => b.vendido - a.vendido || b.gastado - a.gastado);
    cont.innerHTML = `
      <h3>Últimos 12 meses</h3>
      <div class="cuentas-total">
        <div><small>Vendí</small><strong>${dinero(r.vendido)}</strong></div>
        <div><small>Gasté</small><strong>${dinero(r.gastado)}</strong></div>
        <div class="${r.queda < 0 ? 'neg' : 'pos'}"><small>${r.queda < 0 ? 'Perdí' : 'Me queda'}</small><strong>${dinero(Math.abs(r.queda))}</strong></div>
      </div>
      ${botones}
      <h3>Por sector</h3>
      <div class="cuentas-sectores">${sectores.map(tarjetaSector).join('') || '<p class="hint">Todavía nada con sector.</p>'}</div>
      <p class="hint">«Esperado» es lo que da el catálogo para ese tiempo, con las plantas en plena producción: una planta joven da menos.
        No incluye tu mano de obra si no la anotas como jornal.</p>
      <h3>Lo anotado</h3>
      <div class="card card--filas">${movs.slice(0, 40).map(filaMovimiento).join('')}</div>
      ${movs.length > 40 ? `<p class="hint">…y ${movs.length - 40} más antiguos.</p>` : ''}`;
  }

  cont.querySelector('[data-cta="cosecha"]').onclick = () => abrirCosecha();
  cont.querySelector('[data-cta="venta"]').onclick = () => abrirVenta();
  cont.querySelector('[data-cta="gasto"]').onclick = () => abrirGasto();
  cont.querySelectorAll('[data-borrar-mov]').forEach(b => b.onclick = async () => {
    const [store, id] = b.dataset.borrarMov.split(':');
    if (!confirm('¿Borrar esta anotación?')) return;
    await db.remove(store, id);
    // El precio que la venta dejó en la libreta del mercado se va con ella.
    if (store === 'ventas') for (const p of state.precios.filter(x => x.ventaId === id)) await db.remove('precios', p.id);
    // Una cosecha que sacó una siembra de la lista la devuelve.
    if (store === 'cosechas') {
      const c = state.cosechas.find(x => x.id === id);
      const s = c?.siembraId && state.siembrasHechas.find(x => x.id === c.siembraId);
      if (s) { const { cosechadaEl, ...resto } = s; await db.put('siembras', resto); }
    }
    toast('Borrado');
    avisarCambio();
  });
}

function tarjetaSector(s) {
  const productos = s.productos.filter(p => p.cosechado || p.esperado >= 0.5);
  return `<div class="tarjeta-cuenta">
    <div class="tarjeta-cuenta__cab">
      <strong>${escapeHtml(nombreSector(s.sectorId))}</strong>
      <span class="precio ${s.queda < 0 ? 'neg' : ''}">${dinero(s.queda)}</span>
    </div>
    <small class="muted">Vendí ${dinero(s.vendido)} · gasté ${dinero(s.gastado)}</small>
    ${productos.map(p => {
      const pct = p.esperado ? Math.min(100, Math.round(p.cosechado / p.esperado * 100)) : null;
      const dec = n => nf(n, n % 1 && n < 10 ? 1 : 0);
      return `<div class="cuenta-prod">
        <span>${prodEmoji(p.prod)} ${escapeHtml(prodNombre(p.prod))}</span>
        <small>${escapeHtml(contar(p.cosechado, p.unidad, dec(p.cosechado)))}${p.esperado ? ` de ~${dec(p.esperado)} esperados` : ' cosechados'}</small>
        ${pct != null ? `<span class="barra"><span style="width:${pct}%"></span></span>` : ''}
      </div>`;
    }).join('')}
  </div>`;
}

function filaMovimiento(m) {
  return `<div class="list-row fila-mov">
    <span class="tile tile--s">${m.emoji}</span>
    <span class="fila-main"><strong>${escapeHtml(m.txt)}</strong>
      <small>${fechaCorta(m.fecha)} · ${escapeHtml(m.sub)}</small></span>
    ${m.monto != null ? `<span class="monto ${m.monto < 0 ? 'neg' : 'pos'}">${m.monto < 0 ? '−' : '+'}$${centavos(Math.abs(m.monto))}</span>` : ''}
    ${m.store ? `<button class="btn btn--icono btn--fantasma" data-borrar-mov="${m.store}:${attr(m.r.id)}" aria-label="Borrar">
      <svg class="icono icono--s" aria-hidden="true"><use href="#i-papelera"/></svg></button>` : ''}
  </div>`;
}

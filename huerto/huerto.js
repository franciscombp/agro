// El huerto dentro de la app de la finca: qué sembrar, cómo van las siembras
// y a cuánto se vende.
//
// Esto era Mi Huerto, una app aparte con su propio estado en localStorage y su
// propia ubicación. Integrada, la ubicación es la de la finca (su altitud real,
// no la que alguien eligió en una lista), las siembras y los precios son datos
// de la finca en IndexedDB como los demás —se respaldan y se sincronizan igual—,
// y la lluvia de 90 días sale de la misma serie de clima que usa el agua.
//
// La lógica agronómica es la de Mi Huerto, sin cambios: catálogo, luna,
// calculadora, libreta de precios, épocas de buen precio y el consejo por
// cultivo según el agua del año.
"use strict";

import * as db from '../db.js';
import { state, avisarCambio } from '../estado.js';
import * as N from './nino.js';
import { ultimos90 } from '../clima.js';
import {
  CULTIVOS, CATEGORIAS, SISTEMAS, METODO_SIEMBRA, MESES, UNIDAD_INFO, ESPACIOS,
  PRECIOS_META, MERCADO_INTL, CONSEJOS_VENTA
} from './catalogo.js';
import { faseLunar, CONSEJO_LUNA, valorarDia, tiempo } from './luna.js';
import { $, toast, openSheet, closeSheet, escapeHtml, attr, num, formatDias, fechaCorta, today } from '../ui.js';
import { enDias } from '../fechas.js';

/* ── Ubicación: la de la finca ─────────────────────────────────────────── */

/** Altitud de la finca: el promedio de los puntos medidos. */
export function altitudFinca() {
  const el = state.elevations.filter(e => typeof e.elevationM === 'number');
  if (!el.length) return 2790;
  return Math.round(el.reduce((s, e) => s + e.elevationM, 0) / el.length);
}

function cfgHuerto() {
  return { fase: 'neutral', riego: true, espacio: 'parcela', ...(state.config.huerto || {}) };
}

async function guardarCfgHuerto(patch) {
  state.config = await db.saveConfig({ huerto: { ...cfgHuerto(), ...patch } });
}

export function aptoZona(c) {
  const alt = altitudFinca();
  return alt >= c.altMin && alt <= c.altMax && c.espacios.includes(cfgHuerto().espacio);
}
export function getItem(id) { return CULTIVOS.find(c => c.id === id); }
function catInfo(id) { return CATEGORIAS.find(c => c.id === id); }

const SINGULAR = {
  unidades: 'unidad', atados: 'atado', choclos: 'choclo', cuyes: 'cuy',
  pollos: 'pollo', cerdos: 'cerdo', conejos: 'conejo', ovejas: 'oveja',
  litros: 'litro', huevos: 'huevo', 'kg de miel': 'kg'
};
function unidadPrecio(rendUnidad) { return SINGULAR[rendUnidad] || rendUnidad; }

function proximaSiembra(c) {
  const mes = new Date().getMonth() + 1;
  for (let i = 1; i <= 12; i++) {
    const m = ((mes - 1 + i) % 12) + 1;
    if (c.mesesSiembra.includes(m)) return 'Desde ' + MESES[m - 1].slice(0, 3).toLowerCase();
  }
  return '';
}

/* ── Migración desde Mi Huerto ─────────────────────────────────────────── */

/**
 * Trae lo que la persona tenía en Mi Huerto —siembras, precios, la fase de El
 * Niño, si tiene riego— a la base de la finca. Se hace una vez y no borra el
 * original: si algo saliera mal, los datos siguen donde estaban.
 */
export async function migrarDesdeMiHuerto() {
  if (state.config.huertoMigrado) return 0;
  let viejo = null;
  try { viejo = JSON.parse(localStorage.getItem('mihuerto.v2') || 'null'); } catch { /* sin acceso */ }
  let n = 0;
  if (viejo) {
    const siembras = (viejo.siembras || []).filter(s => s.cropId && s.fecha).map(s => ({
      id: 'mh-' + s.id, cropId: s.cropId, fecha: s.fecha, cantidad: s.cantidad || 1,
      nota: s.nota || undefined, sectorId: huertoSectorId()
    }));
    const precios = (viejo.precios || []).filter(p => p.prod && p.precio).map(p => ({
      id: 'mh-' + p.id, prod: p.prod, precio: p.precio, lugar: p.lugar || undefined, fecha: p.fecha
    }));
    if (siembras.length) await db.putMany('siembras', siembras);
    if (precios.length) await db.putMany('precios', precios);
    n = siembras.length + precios.length;
    const patch = {};
    if (viejo.fase) patch.fase = viejo.fase;
    if (typeof viejo.riegoPropio === 'boolean') patch.riego = viejo.riegoPropio;
    if (Object.keys(patch).length) await guardarCfgHuerto(patch);
  }
  state.config = await db.saveConfig({ huertoMigrado: true });
  return n;
}

function huertoSectorId() {
  return state.sectors.find(s => /huerto/i.test(s.name))?.id;
}

/* ── El agua del año (El Niño) ─────────────────────────────────────────── */

const NORMALES_ID = 'normales-lluvia';

/**
 * Lo llovido en 90 días frente a la mediana de 10 años en esas mismas fechas.
 * Lo reciente sale de la serie de clima que ya bajó la app; las normales, del
 * archivo histórico, se guardan un mes porque no cambian de un día a otro.
 */
export async function cargarHidrico() {
  const u = ultimos90(state.clima);
  if (!u) return { conocido: false };

  let normal90 = null, anios = 0;
  const guardadas = await db.get('meta', NORMALES_ID);
  const clave = today().slice(5);     // mes-día: la ventana se corre con el calendario
  const fresca = guardadas && guardadas.clave === clave &&
    Date.now() - new Date(guardadas.bajado).getTime() < 30 * 86400000;
  if (fresca) {
    ({ normal90, anios } = guardadas);
  } else if (navigator.onLine !== false) {
    try {
      const [lat, lng] = centroideFinca();
      const iso = d => d.toISOString().slice(0, 10);
      const fin = new Date(Date.now() - 86400000);
      const ini = new Date(fin.getTime() - 89 * 86400000);
      const rangos = [];
      for (let k = 1; k <= 10; k++) {
        const a = new Date(ini); a.setFullYear(a.getFullYear() - k);
        const b = new Date(fin); b.setFullYear(b.getFullYear() - k);
        rangos.push([iso(a), iso(b)]);
      }
      const hist = await fetch('https://archive-api.open-meteo.com/v1/archive' +
        `?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&timezone=auto` +
        `&start_date=${rangos[9][0]}&end_date=${rangos[0][1]}&daily=precipitation_sum`).then(r => r.json());
      const t = hist?.daily?.time || [];
      const pp = hist?.daily?.precipitation_sum || [];
      const porAnio = rangos.map(([desde, hasta]) => {
        let acc = 0, dias = 0;
        for (let i = 0; i < t.length; i++) if (t[i] >= desde && t[i] <= hasta) { acc += pp[i] || 0; dias++; }
        return dias >= 81 ? acc : null;   // un año incompleto distorsiona la mediana
      }).filter(v => v != null);
      normal90 = N.mediana(porAnio);
      anios = porAnio.length;
      if (normal90 != null) await db.saveMeta({ id: NORMALES_ID, clave, normal90, anios, bajado: new Date().toISOString() });
    } catch { /* sin histórico: se informa la lluvia sin comparación */ }
  }

  const e = N.estadoHidrico({ lluvia90: u.lluvia90, et090: u.et090, normal90 });
  e.anios = anios;
  state.hidrico = e;
  return e;
}

function centroideFinca() {
  const b = state.parcel.boundary;
  return [b.reduce((s, p) => s + p[0], 0) / b.length, b.reduce((s, p) => s + p[1], 0) / b.length];
}

/**
 * La tarjeta "Cómo viene el año" para la pantalla de agua: lo medido primero,
 * la fase declarada después. Es lo que hace que el consejo de siembra no sea
 * el mismo un año seco que uno normal.
 */
export async function tarjetaAnio(cont) {
  if (!cont) return;
  const ch = cfgHuerto();
  const reg = N.region(altitudFinca());
  const fase = N.FASES[ch.fase] || N.FASES.neutral;
  const patron = fase[reg];
  const e = state.hidrico || await cargarHidrico();
  if (!cont.isConnected) return;

  const medido = e.conocido ? `
    <div class="cifras-lluvia">
      <div><small>Llovió en 90 días</small><strong>${e.lluvia90}<i>mm</i></strong></div>
      ${e.normal90 != null ? `<div><small>Lo normal</small><strong>${e.normal90}<i>mm</i></strong></div>` : ''}
    </div>
    ${e.desvio != null ? `<p class="lectura">${e.desvio < 0
      ? `Llovió <b>${Math.abs(e.desvio)} % menos</b> que lo habitual en estas fechas`
      : `Llovió <b>${e.desvio} % más</b> que lo habitual en estas fechas`}${e.anios ? `, comparado con los últimos ${e.anios} años aquí mismo` : ''}.</p>` : ''}`
    : `<p class="lectura">Todavía no hay datos de lluvia de este punto. Se completan solos cuando haya señal.</p>`;

  cont.innerHTML = `
    <div class="tarjeta-anio tono-${e.conocido ? e.color : 'neutro'}">
      <div class="tarjeta-anio__cab">
        <span class="tile tile--agua">${e.conocido ? ({ rojo: '🏜️', ambar: '🌤️', azul: '🌧️', verde: '🌱' }[e.color] || '💧') : '💧'}</span>
        <span><small>Cómo viene el año</small>
          <strong>${e.conocido ? e.etiqueta[0].toUpperCase() + e.etiqueta.slice(1) : 'Sin medir todavía'}</strong></span>
        <button class="pastilla" data-act="fase">${fase.nombre}</button>
      </div>
      ${medido}
      ${patron ? `<p class="patron">${patron.dice} <em>${patron.ojo}</em></p>` : ''}
    </div>`;
  cont.querySelector('[data-act="fase"]').onclick = abrirFase;
}

function abrirFase() {
  const ch = cfgHuerto();
  const reg = N.region(altitudFinca());
  openSheet('¿Cómo viene el año?', `
    <p class="hint">El Niño y La Niña cambian la temporada de lluvias, y no igual en todas partes:
    en la costa El Niño trae agua de sobra y en la sierra suele traer lo contrario. Lo anuncia
    el INAMHI; elegirlo aquí ajusta los consejos de siembra de los próximos meses.</p>
    <div class="opciones">${Object.entries(N.FASES).map(([id, f]) => `
      <button class="opcion ${ch.fase === id ? 'on' : ''}" data-fase="${id}">
        <strong>${f.nombre}</strong>
        <small>${f[reg] ? f[reg].dice : 'Año sin señal marcada: manda lo que midan los últimos 90 días.'}</small>
      </button>`).join('')}</div>`, body => {
    body.querySelectorAll('[data-fase]').forEach(b => b.onclick = async () => {
      await guardarCfgHuerto({ fase: b.dataset.fase });
      closeSheet();
      toast('Guardado');
      avisarCambio();
    });
  });
}

/* ── Tarjeta de cultivo ────────────────────────────────────────────────── */

export function tarjetaCultivo(c, badge, apagado) {
  const b = badge ? `<span class="pastilla ${apagado ? 'pastilla--off' : ''}">${badge}</span>` : '';
  const sub = c.cat === 'animal'
    ? `${c.modelo === 'mensual' ? 'Produce cada mes' : c.modelo === 'anual' ? 'Produce cada año' : 'Listo en ' + formatDias(c.diasProduccion)} · ${c.tipo}`
    : `Cosecha en ${formatDias(c.diasProduccion)} · ${c.tipo}`;
  return `
    <button class="fila-cultivo" data-cultivo="${c.id}">
      <span class="tile t-${c.cat}">${c.emoji}</span>
      <span class="fila-cultivo__txt"><strong>${c.nombre}</strong><small>${sub}</small></span>
      ${b}
    </button>`;
}

function enlazarCultivos(cont) {
  cont.querySelectorAll('[data-cultivo]').forEach(el => el.addEventListener('click', () => abrirCultivo(el.dataset.cultivo)));
}

/* ── Panel: qué sembrar ────────────────────────────────────────────────── */

const filtro = { mes: new Date().getMonth() + 1, cat: 'todos', q: '' };

export function renderSembrar() {
  const cont = $('#huerto-sembrar');
  if (!cont) return;
  if (!cont.dataset.armado) armarSembrar(cont);
  pintarChips();
  pintarListaSembrar();
  pintarDias();
}

function armarSembrar(cont) {
  cont.dataset.armado = '1';
  cont.innerHTML = `
    <div class="filtros-fijos">
      <input type="search" class="buscar" id="sembrar-q" placeholder="Buscar un cultivo o animal…" aria-label="Buscar cultivo" />
      <div class="chips" id="sembrar-cat"></div>
      <div class="chips" id="sembrar-mes"></div>
    </div>
    <details class="dias-buenos" id="sembrar-dias">
      <summary><span class="tile tile--luna" id="sembrar-luna"></span>
        <span><strong>Mejores días para sembrar</strong><small id="sembrar-luna-txt"></small></span></summary>
      <div class="dias" id="sembrar-dias-lista"></div>
    </details>
    <div id="sembrar-lista"></div>`;
  cont.querySelector('#sembrar-q').addEventListener('input', e => { filtro.q = e.target.value.trim(); pintarListaSembrar(); });
}

function pintarChips() {
  const cats = $('#sembrar-cat');
  cats.innerHTML = [`<button data-cat="todos" class="${filtro.cat === 'todos' ? 'on' : ''}">Todos</button>`]
    .concat(CATEGORIAS.map(c => `<button data-cat="${c.id}" class="${filtro.cat === c.id ? 'on' : ''}">${c.emoji} ${c.id === 'animal' ? 'Crianza' : c.nombre}</button>`)).join('');
  cats.querySelectorAll('button').forEach(b => b.onclick = () => { filtro.cat = b.dataset.cat; pintarChips(); pintarListaSembrar(); });

  const mes = new Date().getMonth() + 1;
  const meses = $('#sembrar-mes');
  meses.hidden = filtro.cat === 'animal';
  meses.innerHTML = MESES.map((m, i) =>
    `<button data-mes="${i + 1}" class="${i + 1 === filtro.mes ? 'on' : ''}">${i + 1 === mes ? 'Este mes' : m}</button>`).join('');
  meses.querySelectorAll('button').forEach(b => b.onclick = () => { filtro.mes = +b.dataset.mes; pintarChips(); pintarListaSembrar(); });
  meses.querySelector('.on')?.scrollIntoView({ inline: 'center', block: 'nearest' });
}

function contextoAgua() {
  return {
    estado: state.hidrico || { conocido: false },
    fase: cfgHuerto().fase,
    altitud: altitudFinca(),
    tieneRiego: cfgHuerto().riego === true
  };
}

function pintarListaSembrar() {
  const cont = $('#sembrar-lista');
  const q = filtro.q.toLowerCase();
  const mesActual = new Date().getMonth() + 1;
  const deCat = c => filtro.cat === 'todos' ? c.cat !== 'animal' || !!q : c.cat === filtro.cat;
  let lista;

  if (q || filtro.cat === 'animal') {
    // Buscando o viendo animales, el mes no filtra: se muestra todo lo que coincide.
    lista = CULTIVOS.filter(c => deCat(c) && c.nombre.toLowerCase().includes(q));
    const aptos = lista.filter(aptoZona);
    if (!lista.length) {
      cont.innerHTML = vacio('🔍', 'No encontramos nada', 'Prueba con otro nombre o cambia de grupo.');
      return;
    }
    cont.innerHTML = (aptos.length < lista.length ? `<p class="nota">A ${altitudFinca()} m no crecen bien ${lista.length - aptos.length} de estos: van al final.</p>` : '') +
      [...aptos, ...lista.filter(c => !aptoZona(c))].map(c => {
        if (!aptoZona(c)) return tarjetaCultivo(c, 'No apto aquí', true);
        if (c.cat === 'animal') return tarjetaCultivo(c, 'Todo el año');
        return c.mesesSiembra.includes(mesActual) ? tarjetaCultivo(c, 'Sembrar ya') : tarjetaCultivo(c, proximaSiembra(c), true);
      }).join('');
    enlazarCultivos(cont);
    return;
  }

  lista = CULTIVOS.filter(c => aptoZona(c) && deCat(c) && c.mesesSiembra.includes(filtro.mes));
  const ctx = contextoAgua();
  const orden = N.ordenaPorAgua(lista, ctx);
  const reordenado = orden[0] !== lista[0];
  lista = orden;
  const nota = reordenado
    ? `<p class="nota">↓ ${ctx.estado.nivel === 'exceso'
        ? 'Ordenado por el agua de este año: arriba lo que aprovecha la lluvia de sobra.'
        : 'Ordenado por el agua de este año: arriba lo que aguanta con menos.'}</p>` : '';

  cont.innerHTML = lista.length
    ? nota + lista.map(c => {
        const consejo = N.consejoCultivo(c, ctx);
        const badge = filtro.mes === mesActual ? 'Sembrar ya' : MESES[filtro.mes - 1].slice(0, 3);
        return `<div class="cultivo-con-consejo">${tarjetaCultivo(c, badge, filtro.mes !== mesActual)}${consejo
          ? `<p class="consejo t-${consejo.tono}"><b>${consejo.titulo}.</b> ${consejo.texto}</p>` : ''}</div>`;
      }).join('')
    : vacio('🗓️', `Nada para sembrar en ${MESES[filtro.mes - 1].toLowerCase()}`, 'Prueba otro mes o busca un cultivo por su nombre.');
  enlazarCultivos(cont);
}

function pintarDias() {
  const f = faseLunar();
  $('#sembrar-luna').textContent = f.emoji;
  $('#sembrar-luna-txt').textContent = `${f.nombre} · ${CONSEJO_LUNA[f.ciclo]}`;
  const pron = proximosDias();
  const corte = [...pron].sort((a, b) => b.puntos - a.puntos)[2]?.puntos ?? 3;
  $('#sembrar-dias-lista').innerHTML = pron.map((d, i) => {
    const bueno = d.puntos >= Math.max(corte, 3);
    return `<div class="dia ${bueno ? 'dia--bueno' : ''} ${d.aviso === 'helada' ? 'dia--helada' : ''}">
      <span class="dia__fecha"><small>${i === 0 ? 'Hoy' : fechaCorta(d.iso).split(' ')[0]}</small><strong>${d.fecha.getDate()}</strong></span>
      <span class="dia__icono">${d.fase.emoji}${d.icono ? ' ' + d.icono : ''}</span>
      <span class="dia__txt">${bueno ? '<b class="dia__tag">Buen día para sembrar</b>' : ''}<strong>${d.fase.nombre}</strong>${d.nota}</span>
    </div>`;
  }).join('');
}

/** Los próximos 10 días con su luna y su pronóstico, si lo hay. */
export function proximosDias(n = 10) {
  const pron = state.clima?.dias?.filter(d => d.date >= today()) || [];
  return Array.from({ length: n }, (_, i) => {
    const iso = enDias(i);
    const fecha = new Date(iso + 'T12:00:00');
    const p = pron.find(d => d.date === iso);
    const v = valorarDia({ fecha, lluvia: p?.lluvia ?? null, tmin: p?.tmin ?? null });
    return { ...v, iso, icono: p?.code != null ? tiempo(p.code)[0] : '' };
  });
}

function vacio(emoji, titulo, texto, boton = '') {
  return `<div class="vacio"><div class="vacio__emoji">${emoji}</div><strong>${titulo}</strong><p>${texto}</p>${boton}</div>`;
}

/* ── Ficha de un cultivo ───────────────────────────────────────────────── */

export function abrirCultivo(id) {
  const c = getItem(id);
  if (!c) return;
  const esAnimal = c.cat === 'animal';
  const mes = new Date().getMonth() + 1;
  const info = catInfo(c.cat);

  let cuando;
  if (esAnimal) {
    cuando = c.modelo === 'ciclo' ? `Listo para la venta en ${formatDias(c.diasProduccion)}.`
      : `Empieza a producir en ${formatDias(c.diasProduccion)}.${c.vida ? ' ' + c.vida + '.' : ''}`;
  } else if (c.modelo !== 'ciclo') {
    cuando = `Primera cosecha en ${formatDias(c.diasProduccion)}, luego produce cada ${c.modelo === 'anual' ? 'año' : 'mes'}.${c.vida ? ' ' + c.vida + '.' : ''}`;
  } else {
    const fc = new Date(Date.now() + c.diasProduccion * 86400000);
    cuando = c.mesesSiembra.includes(mes)
      ? `Si siembras hoy, cosechas hacia ${MESES[fc.getMonth()].toLowerCase()} (${formatDias(c.diasProduccion)}).`
      : `Mejor espera: ${proximaSiembra(c).toLowerCase()} es su época de siembra.`;
  }
  const consejo = esAnimal ? null : N.consejoCultivo(c, contextoAgua());
  const fila = (meses, cls) => `<div class="meses">${MESES.map((m, i) =>
    `<span class="${meses.includes(i + 1) ? cls : ''} ${i + 1 === mes ? 'hoy' : ''}">${m[0]}</span>`).join('')}</div>`;
  const rendTxt = c.modelo === 'mensual' ? `${num(c.rendimiento)} ${c.rendUnidad}/mes`
    : c.modelo === 'anual' ? `${num(c.rendimiento)} ${c.rendUnidad}/año` : `${num(c.rendimiento)} ${c.rendUnidad}`;
  const unidadBase = UNIDAD_INFO[c.unidad].singular;
  const noApto = !aptoZona(c);

  openSheet(c.nombre, `
    <div class="ficha-cab">
      <span class="tile tile--xl t-${c.cat}">${c.emoji}</span>
      <small>${info.nombre}</small>
      <p>${cuando}</p>
    </div>
    ${noApto ? `<p class="aviso-suave t-atencion">A ${altitudFinca()} m de altitud no crece bien: su rango es de ${c.altMin} a ${c.altMax} m.</p>` : ''}
    ${consejo ? `<p class="consejo t-${consejo.tono}"><b>${consejo.titulo}.</b> ${consejo.texto}</p>` : ''}
    <div class="acciones-2">
      <button class="btn btn--rojo" data-act="sembre">${esAnimal ? 'Anotar que empecé' : 'Anotar que lo sembré'}</button>
      <button class="btn" data-act="calc">¿Cuánto gano?</button>
    </div>
    <div class="tip">💡 ${c.tip}</div>
    <div class="econ">
      <div><small>Inversión por ${unidadBase}</small><strong>$${num(c.inversion)}</strong></div>
      <div><small>Produce por ${unidadBase}</small><strong>${rendTxt}</strong></div>
      <div><small>Precio local</small><strong>$${num(c.precio)}/${unidadPrecio(c.rendUnidad)}</strong></div>
    </div>
    ${esAnimal ? '' : `<h4>Meses de siembra</h4>${fila(c.mesesSiembra, 'on')}`}
    ${c.mesesPrecioAlto ? `<h4>Cuándo se vende mejor</h4>${fila(c.mesesPrecioAlto, 'venta')}
      <p class="hint">${c.mesesPrecioAlto.includes(mes) ? '¡Este mes suele pagarse mejor!' : 'En esos meses escasea y se paga mejor.'}</p>` : ''}
    <div class="datos-grid">
      <div><small>${esAnimal ? 'Manejo' : 'Cómo se siembra'}</small><strong>${esAnimal ? c.tipo : (METODO_SIEMBRA[c.metodo] || c.tipo)}</strong></div>
      <div><small>${esAnimal ? 'Espacio' : 'Distancia'}</small><strong>${c.distancia}</strong></div>
      <div><small>${esAnimal ? 'Alimentación' : 'Riego'}</small><strong>${c.riego}</strong></div>
      <div><small>${esAnimal ? 'Tiempo a producción' : 'Tiempo a cosecha'}</small><strong>${formatDias(c.diasProduccion)}</strong></div>
      ${c.luna ? `<div><small>Luna ideal</small><strong>${c.luna === 'creciente' ? '🌒 Creciente' : '🌘 Menguante'}</strong></div>` : ''}
      <div><small>Altitud</small><strong>${c.altMin} – ${c.altMax} m</strong></div>
    </div>
    ${c.pasos?.length ? `<h4>Cómo empezar</h4><ol class="pasos">${c.pasos.map(p => `<li>${p}</li>`).join('')}</ol>` : ''}
  `, body => {
    body.querySelector('[data-act="sembre"]').onclick = () => abrirNuevaSiembra(c.id);
    body.querySelector('[data-act="calc"]').onclick = () => abrirCalculadora(c.id);
  });
}

/* ── Calculadora de ganancia ───────────────────────────────────────────── */

function distribucion(area, marco, plantas) {
  if (!marco || !area || plantas < 1) return null;
  const entreHileras = marco[1] / 100;
  const hileras = Math.max(1, Math.round(Math.sqrt(area) / entreHileras));
  return { hileras, porHilera: Math.max(1, Math.round(plantas / hileras)) };
}
function fmtDist(cm) { return cm >= 100 ? String(cm / 100).replace('.', ',') + ' m' : cm + ' cm'; }
function sistemasDe(c) { return c.sistemas?.length ? c.sistemas : ['suelo']; }

export function abrirCalculadora(id) {
  const c = getItem(id);
  const u = UNIDAD_INFO[c.unidad];
  const esp = cfgHuerto().espacio;
  let sistema = sistemasDe(c)[0];
  let max, presets, def;
  if (c.unidad === 'm2') {
    max = { maceta: 20, huerto: 500, parcela: 20000 }[esp];
    presets = { maceta: [2, 5, 10, 20], huerto: [25, 50, 100, 250, 500], parcela: [100, 500, 1000, 5000, 10000] }[esp];
    def = Math.min(ESPACIOS.find(e => e.id === esp).areaDefault, max);
    // En la finca, el huerto tiene un tamaño real: se propone ese.
    const h = state.sectors.find(s => /huerto/i.test(s.name));
    if (h?.areaM2) def = Math.min(Math.round(h.areaM2), max);
  } else if (c.unidad === 'animal') {
    max = c.maxCalc || 100; presets = [1, 3, 5, 10, 25, 50]; def = Math.min(5, max);
  } else if (c.unidad === 'arbol') {
    max = 100; presets = [1, 3, 5, 10, 25, 50]; def = 5;
  } else {
    max = 300; presets = [5, 10, 25, 50, 100]; def = 10;
  }
  presets = presets.filter(p => p <= max);

  openSheet(`${c.emoji} ¿Cuánto gano con ${c.nombre.toLowerCase()}?`, `
    <p class="pregunta">${u.pregunta}</p>
    <div class="cantidad"><strong id="calc-n"></strong> <span id="calc-u"></span></div>
    <input type="range" id="calc-slider" min="1" max="${max}" value="${def}" aria-label="${u.pregunta}" />
    <div class="chips chips--centro" id="calc-presets">${presets.map(p =>
      `<button data-n="${p}">${c.unidad === 'm2' && p >= 10000 ? p / 10000 + ' ha' : num(p)}</button>`).join('')}</div>
    <div id="calc-sistemas"></div>
    <div id="calc-siembra"></div>
    <div id="calc-res"></div>
  `, body => {
    const slider = body.querySelector('#calc-slider');
    const pintarSistemas = () => {
      const disp = sistemasDe(c);
      const cont = body.querySelector('#calc-sistemas');
      if (disp.length < 2) { cont.innerHTML = ''; return; }
      cont.innerHTML = `<h4>¿Cómo lo vas a cultivar?</h4>
        <div class="chips">${disp.map(id => `<button data-sys="${id}" class="${id === sistema ? 'on' : ''}">${SISTEMAS[id].emoji} ${SISTEMAS[id].nombre}</button>`).join('')}</div>
        <p class="hint">${SISTEMAS[sistema].desc}</p>`;
      cont.querySelectorAll('[data-sys]').forEach(b => b.onclick = () => { sistema = b.dataset.sys; pintarSistemas(); calcular(); });
    };
    const calcular = () => {
      const n = +slider.value;
      body.querySelector('#calc-n').textContent = c.unidad === 'm2' && n >= 10000 ? (n / 10000).toFixed(1).replace('.0', '').replace('.', ',') + ' ha' : num(n);
      body.querySelector('#calc-u').textContent = c.unidad === 'm2' && n >= 10000 ? '' : (n === 1 ? u.singular : u.plural);
      body.querySelectorAll('#calc-presets button').forEach(b => b.classList.toggle('on', +b.dataset.n === n));
      body.querySelector('#calc-siembra').innerHTML = planSiembra(c, n, sistema);
      body.querySelector('#calc-res').innerHTML = resultados(c, n, sistema);
    };
    slider.addEventListener('input', calcular);
    body.querySelectorAll('#calc-presets button').forEach(b => b.onclick = () => { slider.value = b.dataset.n; calcular(); });
    pintarSistemas();
    calcular();
  });
}

function areaYPlantas(c, n) {
  const m2PorPlanta = c.marco ? (c.marco[0] / 100) * (c.marco[1] / 100) : null;
  const esArea = c.unidad === 'm2';
  return {
    area: esArea ? n : (m2PorPlanta ? n * m2PorPlanta : null),
    plantas: esArea ? (m2PorPlanta ? Math.max(1, Math.round(n / m2PorPlanta)) : n) : n
  };
}

function planSiembra(c, n, sistema) {
  if (!c.marco) return '';
  const { area, plantas } = areaYPlantas(c, n);
  const dist = distribucion(area, c.marco, plantas);
  const semilla = { directa: 'semillas', tuberculo: 'tubérculos-semilla', esqueje: 'esquejes', estaca: 'estacas',
    hijuelo: 'hijuelos', mata: 'matas', semillero: 'plantas de semillero', plantula: 'plántulas', planta: 'plantas',
    vivero: 'plantas de vivero' }[c.metodo] || 'plantas';
  const filas = [
    [c.metodo === 'directa' ? 'Semillas necesarias' : 'Plantas necesarias', `${num(plantas)} ${semilla}`],
    ['Distancia', `${fmtDist(c.marco[0])} entre plantas · ${fmtDist(c.marco[1])} entre hileras`]
  ];
  if (dist && dist.hileras > 1) filas.push(['Cómo repartirlas', `≈ ${num(dist.hileras)} hileras de ${num(dist.porHilera)} cada una`]);
  if (c.unidad !== 'm2' && area) filas.push(['Terreno que ocupa', area >= 10000 ? num(area / 10000) + ' ha' : num(area) + ' m²']);
  if (sistema === 'maceta') filas.push(['Macetas', `${num(plantas)} de 20 litros o más`]);
  const consejo = {
    suelo: 'En surcos (guachos) o camas, con un caminito cada 4-5 hileras para entrar a deshierbar y cosechar.',
    maceta: 'Una planta por maceta, agrupadas con pasillos para regar sin pisar.',
    invernadero: 'Deja un pasillo central de 60-80 cm para entrar con carretilla.',
    hidroponia: 'Un sitio de cultivo por planta en los canales o mesas, con la misma separación.'
  }[sistema];
  return `<h4>Cómo queda sembrado</h4>
    <div class="tabla">${filas.map(([a, b]) => `<div><span>${a}</span><strong>${b}</strong></div>`).join('')}</div>
    <p class="hint">${consejo}</p>`;
}

function resultados(c, n, sistema) {
  const S = SISTEMAS[sistema] || SISTEMAS.suelo;
  const { area } = areaYPlantas(c, n);
  const infra = area && S.infra ? area * S.infra : 0;
  const inversion = c.inversion * n + infra;
  const gasto = c.gastoCiclo * n * S.gasto;
  const prod = c.rendimiento * n * S.rend;
  const venta = prod * c.precio;
  const rU = c.rendUnidad;
  const diasPeriodo = c.modelo === 'ciclo' ? c.diasProduccion : c.modelo === 'anual' ? 365 : 30;
  // La instalación dura años: a cada ciclo le toca sólo su parte. Cargarla
  // entera a un ciclo haría ver como pérdida algo que sí es rentable.
  const infraPeriodo = infra > 0 ? infra * (diasPeriodo / (S.vidaInfra * 365)) : 0;
  const periodo = c.modelo === 'ciclo' ? 'este ciclo' : c.modelo === 'anual' ? 'el año' : 'el mes';
  const base = c.cat === 'animal' ? 'Compra de animales' : 'Semillas o plantas';
  const filas = [[base, `$${num(c.inversion * n)}`]];
  if (infraPeriodo > 0) filas.push([`${S.emoji} ${S.nombre} (parte de ${periodo})`, `$${num(infraPeriodo)}`]);
  let total, totalTxt, nota = '';
  if (c.modelo === 'ciclo') {
    filas.push([`Gastos del ciclo (${c.cat === 'animal' ? 'alimento' : 'insumos'})`, `$${num(gasto)}`]);
    filas.push([`${c.cat === 'animal' ? 'Producción' : 'Cosecha'} en ${formatDias(c.diasProduccion)}`, `${num(prod)} ${rU}`]);
    filas.push(['Venta estimada', `$${num(venta)}`]);
    total = venta - c.inversion * n - gasto - infraPeriodo; totalTxt = 'Ganancia del ciclo';
  } else {
    const anual = c.modelo === 'anual';
    filas.push([`Producción por ${anual ? 'año' : 'mes'}`, `${num(prod)} ${rU}`]);
    filas.push([`Gastos por ${anual ? 'año' : 'mes'}`, `$${num(gasto)}`]);
    filas.push([`Ingreso por ${anual ? 'año' : 'mes'}`, `$${num(venta)}`]);
    total = venta - gasto - infraPeriodo; totalTxt = `Ganancia por ${anual ? 'año' : 'mes'}`;
    const payback = total > 0 ? Math.ceil(inversion / total) : null;
    if (payback) nota = `Recuperas la inversión en unos ${payback} ${anual ? (payback === 1 ? 'año' : 'años') : (payback === 1 ? 'mes' : 'meses')}. `;
  }
  return `<h4>Lo que deja</h4>
    <div class="tabla">${filas.map(([a, b]) => `<div><span>${a}</span><strong>${b}</strong></div>`).join('')}
      <div class="tabla__total ${total < 0 ? 'neg' : ''}"><span>${totalTxt}</span><strong>$${num(total)}</strong></div></div>
    <p class="hint">${nota}${infra > 0 ? `La instalación cuesta $${num(infra)} una vez y dura unos ${S.vidaInfra} años. ` : ''}Precios de referencia de ${PRECIOS_META.pais} (${PRECIOS_META.actualizado}). No incluye tu mano de obra ni el transporte.</p>`;
}

/* ── Panel: mis siembras ───────────────────────────────────────────────── */

function diasTranscurridos(s) {
  return Math.max(0, Math.floor((Date.now() - new Date(s.fecha + 'T12:00:00').getTime()) / 86400000));
}
export function diasRestantes(s) {
  const c = getItem(s.cropId);
  return c ? Math.max(0, c.diasProduccion - diasTranscurridos(s)) : null;
}

export function renderSiembras() {
  const cont = $('#huerto-siembras');
  if (!cont) return;
  const lista = [...state.siembras].sort((a, b) => (diasRestantes(a) ?? 1e9) - (diasRestantes(b) ?? 1e9));
  const boton = `<button class="btn btn--rojo btn-block" data-act="nueva">+ Anotar una siembra</button>`;
  if (!lista.length) {
    cont.innerHTML = vacio('🌱', 'Todavía no anotas ninguna siembra',
      'Anota lo que siembras —o los animales que crías— y la app te dice cuándo cosechar.', boton);
  } else {
    cont.innerHTML = boton + lista.map(tarjetaSiembra).join('');
  }
  cont.querySelector('[data-act="nueva"]').onclick = () => abrirNuevaSiembra();
  cont.querySelectorAll('[data-ver]').forEach(b => b.onclick = () => abrirCultivo(b.dataset.ver));
  cont.querySelectorAll('[data-quitar]').forEach(b => b.onclick = async () => {
    const s = state.siembras.find(x => x.id === b.dataset.quitar);
    const listo = b.dataset.listo === '1';
    if (!listo && !confirm(`¿Quitar ${getItem(s.cropId)?.nombre.toLowerCase() || 'esta siembra'} del seguimiento?`)) return;
    await db.remove('siembras', s.id);
    toast(listo ? '¡Buena cosecha!' : 'Quitado');
    avisarCambio();
  });
}

function tarjetaSiembra(s) {
  const c = getItem(s.cropId);
  if (!c) return '';
  const trans = diasTranscurridos(s);
  const total = c.diasProduccion;
  const pct = Math.min(100, Math.round(trans / total * 100));
  const rest = Math.max(0, total - trans);
  const enProduccion = trans >= total && c.modelo !== 'ciclo';
  const listo = trans >= total && c.modelo === 'ciclo';
  const estado = enProduccion ? '<span class="pastilla pastilla--azul">Produciendo</span>'
    : listo ? '<span class="pastilla">¡Lista para cosechar!</span>'
    : '<span class="pastilla pastilla--ambar">Creciendo</span>';
  const fc = new Date(new Date(s.fecha + 'T12:00:00').getTime() + total * 86400000);
  const fcTxt = `${fc.getDate()} de ${MESES[fc.getMonth()].toLowerCase()}`;
  const meta = listo ? `Cumplió su ciclo de ${formatDias(total)}`
    : enProduccion ? `Produce desde el ${fcTxt}`
    : `Faltan ${formatDias(rest)} · ${c.cat === 'animal' ? 'produce' : 'cosecha'} hacia el ${fcTxt}`;
  const u = UNIDAD_INFO[c.unidad];
  const desde = trans === 0 ? 'hoy' : `hace ${formatDias(trans)}`;
  const sector = state.sectors.find(x => x.id === s.sectorId);
  return `
    <div class="tarjeta-siembra">
      <div class="tarjeta-siembra__cab">
        <span class="tile t-${c.cat}">${c.emoji}</span>
        <span class="tarjeta-siembra__txt"><strong>${c.nombre}</strong>
          <small>${num(s.cantidad)} ${s.cantidad === 1 ? u.singular : u.plural} · ${c.cat === 'animal' ? 'desde' : 'sembrado'} ${desde}${sector ? ' · ' + escapeHtml(sector.name) : ''}</small></span>
        ${estado}
      </div>
      <div class="barra"><span style="width:${pct}%"></span></div>
      <div class="tarjeta-siembra__meta"><span>${meta}</span><span>${pct} %</span></div>
      ${s.nota ? `<p class="nota-siembra">📝 ${escapeHtml(s.nota)}</p>` : ''}
      <div class="acciones-2">
        <button class="btn btn--sm" data-ver="${c.id}">Ver guía</button>
        <button class="btn btn--sm ${listo ? 'btn--rojo' : ''}" data-quitar="${s.id}" data-listo="${listo ? 1 : 0}">${listo ? '✓ Ya coseché' : 'Quitar'}</button>
      </div>
    </div>`;
}

/**
 * Anotar una siembra en dos pasos: qué (buscando en la lista) y luego cuánto y
 * dónde. Si se llega desde la ficha de un cultivo, el primer paso se salta.
 */
export function abrirNuevaSiembra(cropId) {
  if (!cropId) {
    openSheet('¿Qué sembraste?', `
      <input type="search" class="buscar" id="ns-q" placeholder="Buscar…" aria-label="Buscar cultivo" />
      <div id="ns-lista"></div>`, body => {
      const pintar = q => {
        const lista = CULTIVOS.filter(c => aptoZona(c) && c.nombre.toLowerCase().includes(q.toLowerCase()));
        const cont = body.querySelector('#ns-lista');
        cont.innerHTML = lista.map(c => tarjetaCultivo(c, catInfo(c.cat).nombre, true)).join('') ||
          '<p class="hint">Nada con ese nombre.</p>';
        cont.querySelectorAll('[data-cultivo]').forEach(el => el.onclick = () => abrirNuevaSiembra(el.dataset.cultivo));
      };
      body.querySelector('#ns-q').addEventListener('input', e => pintar(e.target.value));
      pintar('');
    });
    return;
  }
  const c = getItem(cropId);
  const u = UNIDAD_INFO[c.unidad];
  const def = c.unidad === 'm2' ? 10 : 5;
  openSheet(`${c.emoji} ${c.nombre}`, `
    <form id="f-siembra">
      <label>¿Cuándo? <input type="date" name="fecha" value="${today()}" max="${today()}" required /></label>
      <label>${c.unidad === 'm2' ? '¿Cuántos metros cuadrados?' : `¿Cuántos ${u.plural}?`}
        <input type="number" name="cantidad" min="1" step="1" value="${def}" inputmode="numeric" required /></label>
      <label>¿En qué sector?
        <select name="sectorId"><option value="">—</option>${state.sectors.map(s =>
          `<option value="${s.id}" ${s.id === huertoSectorId() ? 'selected' : ''}>${escapeHtml(s.name)}</option>`).join('')}</select></label>
      <label>Nota (opcional) <input name="nota" placeholder="Variedad, de dónde salió la semilla…" /></label>
      <button class="btn btn--rojo btn-block" type="submit">Guardar</button>
    </form>`, body => {
    body.querySelector('#f-siembra').onsubmit = async ev => {
      ev.preventDefault();
      const f = new FormData(ev.target);
      await db.put('siembras', {
        cropId, fecha: f.get('fecha'), cantidad: Math.max(1, +f.get('cantidad') || 1),
        sectorId: f.get('sectorId') || undefined, nota: (f.get('nota') || '').trim() || undefined
      });
      closeSheet();
      toast(`${c.nombre} anotado. Cosecha en ${formatDias(c.diasProduccion)}.`);
      avisarCambio();
    };
  });
}

/* ── Panel: mercado ────────────────────────────────────────────────────── */

function prodNombre(prod) {
  if (prod.startsWith('otro:')) { const n = prod.slice(5); return n.charAt(0).toUpperCase() + n.slice(1); }
  return getItem(prod)?.nombre || prod;
}
function prodEmoji(prod) { return getItem(prod)?.emoji || '🏷️'; }
function prodUnidad(prod) { const c = getItem(prod); return c ? unidadPrecio(c.rendUnidad) : null; }

function preciosOrdenados() {
  return [...state.precios].sort((a, b) => (b.fecha || '').localeCompare(a.fecha || '') || (b.updatedAt || '').localeCompare(a.updatedAt || ''));
}

export function renderMercado() {
  const cont = $('#huerto-mercado');
  if (!cont) return;
  const mes = new Date().getMonth() + 1;
  const dia = Math.floor(Date.now() / 86400000);
  cont.innerHTML = `
    <div class="seccion-cab"><h3>Mis precios de feria</h3><button class="enlace" data-act="precio">+ Anotar precio</button></div>
    <div id="precios"></div>
    <h3>¿Cuándo vender mejor?</h3>
    <p class="hint">Meses en que cada producto suele escasear y pagarse mejor.</p>
    <div id="ventas"></div>
    <h3>Precios internacionales</h3>
    <p class="hint" id="intl-nota">Cargando…</p>
    <div id="intl"></div>
    <div class="tip">💡 <b>Para vender mejor:</b> ${CONSEJOS_VENTA[dia % CONSEJOS_VENTA.length]}</div>`;
  cont.querySelector('[data-act="precio"]').onclick = abrirNuevoPrecio;
  pintarPrecios(cont.querySelector('#precios'));
  pintarVentas(cont.querySelector('#ventas'), mes);
  pintarIntl(cont.querySelector('#intl'), cont.querySelector('#intl-nota'));
}

function sparkline(vals) {
  if (vals.length < 2) return `<svg class="spark" viewBox="0 0 72 24"><line x1="4" y1="12" x2="68" y2="12" stroke-dasharray="2 4"/></svg>`;
  const s = vals.slice(-8), min = Math.min(...s), max = Math.max(...s), span = max - min || 1;
  const pts = s.map((v, i) => [(4 + i / (s.length - 1) * 64).toFixed(1), (20 - (v - min) / span * 16).toFixed(1)]);
  const dir = s.at(-1) > s[0] ? 'sube' : s.at(-1) < s[0] ? 'baja' : '';
  const fin = pts.at(-1);
  return `<svg class="spark ${dir}" viewBox="0 0 72 24"><polyline points="${pts.map(p => p.join(',')).join(' ')}"/>
    <circle cx="${fin[0]}" cy="${fin[1]}" r="2.4"/></svg>`;
}

function pintarPrecios(cont) {
  const precios = preciosOrdenados();
  if (!precios.length) {
    cont.innerHTML = `<div class="vacio vacio--borde">📒 Tu libreta está vacía. Cada vez que vayas a la feria anota a cuánto se vende lo tuyo: con el tiempo verás si sube o baja y cuándo conviene vender.</div>`;
    return;
  }
  const grupos = {};
  for (const p of precios) (grupos[p.prod] = grupos[p.prod] || []).push(p);
  cont.innerHTML = Object.entries(grupos).map(([prod, regs]) => {
    const ult = regs[0], prev = regs[1];
    let trend = '<span class="tendencia">primer registro</span>';
    if (prev) {
      const dif = ult.precio - prev.precio, pct = Math.abs(Math.round(dif / prev.precio * 100));
      trend = dif > 0.001 ? `<span class="tendencia sube">▲ subió ${pct} %</span>`
        : dif < -0.001 ? `<span class="tendencia baja">▼ bajó ${pct} %</span>` : '<span class="tendencia">= igual</span>';
    }
    const c = getItem(prod), u = prodUnidad(prod);
    const f = new Date(ult.fecha + 'T12:00:00');
    return `
      <div class="tarjeta-precio">
        <div class="tarjeta-precio__cab">
          <span class="tile t-${c ? c.cat : 'hierba'}">${prodEmoji(prod)}</span>
          <span class="tarjeta-precio__txt"><strong>${escapeHtml(prodNombre(prod))}</strong>
            <small>${f.getDate()} de ${MESES[f.getMonth()].toLowerCase()}${ult.lugar ? ' · ' + escapeHtml(ult.lugar) : ''} · ${regs.length} ${regs.length === 1 ? 'registro' : 'registros'}</small></span>
          <span class="precio">$${num(ult.precio)}${u ? `<small>/${u}</small>` : ''}</span>
        </div>
        <div class="tarjeta-precio__pie">
          ${sparkline([...regs].reverse().map(r => r.precio))}
          <span>${trend}${c ? `<small>Referencia: $${num(c.precio)}/${unidadPrecio(c.rendUnidad)}</small>` : ''}</span>
          <button class="btn btn--icono btn--fantasma" data-borrar="${attr(prod)}" aria-label="Borrar historial">
            <svg class="icono icono--s" aria-hidden="true"><use href="#i-papelera"/></svg></button>
        </div>
      </div>`;
  }).join('');
  cont.querySelectorAll('[data-borrar]').forEach(b => b.onclick = async () => {
    const prod = b.dataset.borrar;
    if (!confirm(`¿Borrar el historial de precios de ${prodNombre(prod).toLowerCase()}?`)) return;
    for (const p of state.precios.filter(x => x.prod === prod)) await db.remove('precios', p.id);
    avisarCambio();
  });
}

function pintarVentas(cont, mes) {
  const sigo = [...new Set(state.siembras.map(s => s.cropId))].map(getItem).filter(Boolean);
  const conDato = sigo.filter(c => c.mesesPrecioAlto);
  const otros = CULTIVOS.filter(c => aptoZona(c) && c.mesesPrecioAlto && !conDato.includes(c));
  const lista = conDato.concat(otros).slice(0, 6);
  cont.innerHTML = lista.map(c => {
    const ahora = c.mesesPrecioAlto.includes(mes);
    return `<button class="fila-venta ${ahora ? 'ahora' : ''}" data-cultivo="${c.id}">
      <span class="tile tile--s t-${c.cat}">${c.emoji}</span>
      <span class="fila-venta__txt"><strong>${c.nombre}${ahora ? ' <b class="etiqueta-ahora">buen precio ahora</b>' : ''}</strong>
        <span class="meses meses--mini">${MESES.map((m, i) => `<span class="${c.mesesPrecioAlto.includes(i + 1) ? 'venta' : ''} ${i + 1 === mes ? 'hoy' : ''}">${m[0]}</span>`).join('')}</span></span>
    </button>`;
  }).join('') || '<p class="hint">Lo de esta zona se paga parecido todo el año.</p>';
  enlazarCultivos(cont);
}

async function intlSeries() {
  const c = await db.get('meta', 'mercado-intl');
  if (c?.series && Date.now() - c.ts < 86400000) return c.series;
  try {
    const inds = MERCADO_INTL.map(m => m.ind).join(';');
    const j = await fetch(`https://api.worldbank.org/v2/country/wld/indicator/${inds}?source=15&format=json&per_page=300&mrv=8`).then(r => r.json());
    if (!Array.isArray(j) || !Array.isArray(j[1])) throw new Error('formato');
    const series = {};
    for (const row of j[1]) {
      if (row.value == null || !row.indicator) continue;
      (series[row.indicator.id] = series[row.indicator.id] || []).push({ fecha: row.date, valor: row.value });
    }
    for (const id in series) series[id].sort((a, b) => a.fecha.localeCompare(b.fecha));
    if (!Object.keys(series).length) throw new Error('vacío');
    await db.saveMeta({ id: 'mercado-intl', ts: Date.now(), series });
    return series;
  } catch {
    return c?.series || null;    // sin conexión: lo último guardado, aunque sea viejo
  }
}

async function pintarIntl(cont, nota) {
  const series = await intlSeries();
  if (!cont.isConnected) return;
  const fechaWB = s => { const m = /^(\d{4})M(\d{2})$/.exec(s); return m ? MESES[+m[2] - 1].slice(0, 3).toLowerCase() + ' ' + m[1] : s; };
  cont.innerHTML = MERCADO_INTL.map(m => {
    const s = series?.[m.ind];
    let valor = m.fallback, fecha = m.fallbackFecha, trend = '';
    if (s?.length) {
      valor = s.at(-1).valor; fecha = fechaWB(s.at(-1).fecha);
      const base = s.length >= 4 ? s.at(-4).valor : s.length >= 2 ? s[0].valor : null;
      if (base) {
        const pct = Math.round((valor - base) / base * 100);
        trend = pct > 1 ? `<span class="tendencia sube">▲ ${pct} %</span>` : pct < -1 ? `<span class="tendencia baja">▼ ${Math.abs(pct)} %</span>` : '<span class="tendencia">estable</span>';
      }
    }
    const mostrado = m.mostrar === 'qq' ? `$${num(valor * 0.04536)}<small>/quintal</small>`
      : m.mostrar === 'saco' ? `$${num(valor * 0.05)}<small>/saco 50 kg</small>` : `$${num(valor)}<small>/kg</small>`;
    return `<div class="fila-intl"><span class="tile tile--s">${m.emoji}</span>
      <span class="fila-intl__txt"><strong>${m.nombre}</strong><small>${fecha}</small></span>${trend}
      <span class="precio precio--s">${mostrado}</span></div>`;
  }).join('');
  nota.textContent = series
    ? 'Referencia mundial (Banco Mundial). El precio de tu feria es otro, pero sigue la misma corriente. Cambio de los últimos 3 meses.'
    : 'Sin conexión: valores de referencia guardados. Se actualizan solos cuando haya internet.';
}

export function abrirNuevoPrecio() {
  const sigo = [...new Set(state.siembras.map(s => s.cropId))];
  const anotados = [...new Set(state.precios.map(p => p.prod))].filter(p => !p.startsWith('otro:') && !sigo.includes(p) && getItem(p));
  const zona = CULTIVOS.filter(aptoZona).map(c => c.id).filter(id => !sigo.includes(id) && !anotados.includes(id));
  const grupo = (ids, label) => ids.length ? `<optgroup label="${label}">${ids.map(id => {
    const c = getItem(id); return c ? `<option value="${id}">${c.emoji} ${c.nombre}</option>` : '';
  }).join('')}</optgroup>` : '';
  openSheet('Anotar un precio', `
    <form id="f-precio">
      <label>¿De qué producto?
        <select name="prod">${grupo(sigo, 'Lo que siembro')}${grupo(anotados, 'Ya anotados')}${grupo(zona, 'De esta zona')}
          <option value="__otro">✏️ Otro producto…</option></select></label>
      <label id="otro-wrap" hidden>¿Cuál? <input name="otro" placeholder="Ej.: queso fresco" /></label>
      <label><span id="precio-label">Precio ($)</span>
        <span class="con-unidad con-unidad--grande"><input type="number" name="precio" step="0.01" min="0.01" inputmode="decimal" placeholder="0,50" required /><i>$</i></span></label>
      <label>¿Dónde? (opcional) <input name="lugar" placeholder="Feria de Salcedo" /></label>
      <button class="btn btn--rojo btn-block" type="submit">Guardar</button>
    </form>`, body => {
    const f = body.querySelector('#f-precio');
    const sync = () => {
      const v = f.prod.value;
      body.querySelector('#otro-wrap').hidden = v !== '__otro';
      const u = v && v !== '__otro' ? prodUnidad(v) : null;
      body.querySelector('#precio-label').textContent = u ? `Precio por ${u} ($)` : 'Precio que viste ($)';
    };
    f.prod.addEventListener('change', sync);
    sync();
    f.onsubmit = async ev => {
      ev.preventDefault();
      let prod = f.prod.value;
      if (prod === '__otro') {
        const n = f.otro.value.trim().toLowerCase();
        if (!n) { f.otro.focus(); return; }
        prod = 'otro:' + n;
      }
      await db.put('precios', { prod, precio: +f.precio.value, lugar: f.lugar.value.trim() || undefined, fecha: today() });
      closeSheet();
      toast('Precio anotado');
      avisarCambio();
    };
  });
}

/* ── Para la pantalla Hoy ──────────────────────────────────────────────── */

/** Lo que el huerto tiene que decir en la pantalla Hoy, ya en palabras. */
export function resumenHuerto() {
  const mes = new Date().getMonth() + 1;
  const siembras = state.siembras.map(s => ({ s, c: getItem(s.cropId), rest: diasRestantes(s) })).filter(x => x.c);
  const listas = siembras.filter(x => x.rest === 0 && x.c.modelo === 'ciclo');
  const proxima = siembras.filter(x => x.rest > 0).sort((a, b) => a.rest - b.rest)[0];
  const paraSembrar = CULTIVOS.filter(c => aptoZona(c) && c.cat !== 'animal' && c.mesesSiembra.includes(mes));
  const oportunos = siembras.map(x => x.c).filter(c => c.mesesPrecioAlto?.includes(mes));
  const ult = preciosOrdenados()[0];
  return { siembras, listas, proxima, paraSembrar, oportunos, ultimoPrecio: ult, prodNombre };
}

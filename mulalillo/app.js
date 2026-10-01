// Finca Mulalillo — controlador de la aplicación.
// Un solo estado en memoria, respaldado en IndexedDB, compartido por el mapa 2D y la vista 3D.
"use strict";

import * as db from './db.js';
import { SPECIES, STATUS_COLORS, BOUNDARY } from './db.js';
import { FarmMap } from './map2d.js';
import * as water from './water.js';
import { preview as plantingPreview, LAYOUTS } from './planting.js';
import * as hyd from './hydraulics.js';
import * as clima from './clima.js';
import * as sensores from './sensores.js';
import {
  areaM2, perimeterM, fmtArea, fmtM, centroid, pointInRing,
  interpolateElevation, staticPressureBar, bbox
} from './geo.js';

const INFRA_TYPES = ['reservorio', 'casa', 'establo', 'cuyera', 'bomba', 'filtro', 'válvula'];
const TASK_TYPES = ['riego', 'poda', 'fertilización', 'fumigación', 'cosecha', 'siembra', 'otro'];
const WATER_TYPES = ['llenado_acequia', 'tanquero', 'riego', 'medición_nivel'];
const STATUSES = ['sano', 'atención', 'enfermo', 'muerto'];
const BUILD = 'v16';

const state = {
  parcel: { id: 'parcel-mulalillo', name: 'Finca Mulalillo', boundary: BOUNDARY },
  sectors: [], plants: [], infra: [], tasks: [], water: [], elevations: [], config: {},
  clima: null,           // serie de ET0 y lluvia; null = todavía sin bajar
  lecturas: []           // lo que han mandado los sensores
};

let farmMap = null;
let terrain = null;       // vista 3D, se carga bajo demanda
let taskFilter = 'pendientes';
let pendingPlacement = null;  // {kind, data} esperando un toque en el mapa

const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];

// ---------------------------------------------------------------------------
// Arranque
// ---------------------------------------------------------------------------

async function boot() {
  cargarIconos();
  await db.seedIfEmpty();
  await reload();
  await initMap();
  wireChrome();
  renderAll();
  registerServiceWorker();
  watchConnectivity();
  refrescarClima();     // en segundo plano: la app ya está usable sin esto
  sincronizarSensores();
  // Mientras la app está abierta y a la vista, cada 15 minutos. Un sensor
  // LoRa manda cada 20–60: preguntar más seguido sólo gasta batería del
  // teléfono y datos móviles.
  setInterval(() => { if (document.visibilityState === 'visible') sincronizarSensores(); }, 15 * 60000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') sincronizarSensores();
  });
}

/** Configuración de sensores, con lo que falte rellenado. */
function cfgSensores() {
  return { aparatos: {}, ...(state.config.sensores || {}) };
}

/**
 * Trae lecturas nuevas del receptor y rehace lo que se deriva de ellas. En
 * silencio salvo que se pida: que el receptor no responda no es noticia cada
 * quince minutos, y el estado de cada aparato ya lo dice en pantalla.
 */
let sincronizando = null;
async function sincronizarSensores({ avisar = false } = {}) {
  const cfg = cfgSensores();
  if (!cfg.url) return null;
  if (sincronizando) return sincronizando;
  sincronizando = (async () => {
    const r = await sensores.sincronizar(cfg);
    if (r.ok) {
      state.config = await db.saveConfig({ sensores: { ...cfg, ultimaSync: r.hasta, ultimoError: null } });
      await sensores.aplicar(cfg.aparatos);
      await reload();
      renderAll();
    } else {
      state.config = await db.saveConfig({ sensores: { ...cfg, ultimoError: r.motivo } });
    }
    if (avisar) toast(r.ok ? `${r.nuevas} lecturas nuevas` : `Sensores: ${r.motivo}`);
    return r;
  })();
  try { return await sincronizando; } finally { sincronizando = null; }
}

/**
 * Lo que las pantallas necesitan de los sensores, calculado una vez. Lo que
 * no tiene aparato asignado no entra en el modelo: aparece en la lista para
 * poder reconocerlo, pero hasta que alguien diga qué mide, no decide nada.
 */
function resumenSensores() {
  const cfg = cfgSensores();
  if (!state.lecturas.length) return null;
  return {
    lluviaPorDia: sensores.lluviaPorDia(state.lecturas, cfg.aparatos),
    reserva: sensores.reservaMedida(state.lecturas, cfg.aparatos, {
      reservaMax: state.config.reservaSueloMm ?? clima.RESERVA_SUELO_MM,
      cc: cfg.sueloCC ?? sensores.SUELO_CC,
      pmp: cfg.sueloPMP ?? sensores.SUELO_PMP
    }),
    aparatos: sensores.estadoAparatos(state.lecturas, cfg.aparatos)
  };
}

/**
 * Baja ET0 y lluvia del punto de la finca. No bloquea el arranque y no avisa
 * si falla: sin clima la app calcula con el de referencia, que es lo que hacía
 * antes. Sólo repinta si llegó algo nuevo.
 */
async function refrescarClima({ forzar = false } = {}) {
  const serie = await clima.refrescar(centroid(state.parcel.boundary), { forzar });
  if (!serie) return null;
  state.clima = serie;
  renderWater();
  return serie;
}

/**
 * El sprite del sistema hay que meterlo en el documento: `<use href>` a un
 * archivo externo no lo resuelve ningún navegador de los que importan. No se
 * usa mal.js porque esta app ya trae su propia mecánica de pestañas y hoja, y
 * cargarlo duplicaría los manejadores.
 */
async function cargarIconos() {
  if (document.getElementById('mal-iconos')) return;
  try {
    const svg = await fetch('../ds/mal/iconos.svg').then(r => r.ok ? r.text() : null);
    if (!svg) return;
    const cont = document.createElement('div');
    cont.id = 'mal-iconos';
    cont.hidden = true;
    cont.innerHTML = svg;
    document.body.prepend(cont);
  } catch {
    /* Sin iconos la app se usa igual: los rótulos de texto siguen ahí. */
  }
}

/** El mapa es la vista principal, pero si falla el resto de la app sigue sirviendo. */
async function initMap() {
  try {
    await ensureMapLibre();
    farmMap = new FarmMap('map', {
      onSelectPoint: openPoint,
      onSelectSector: id => openSector(id),
      onSelectNothing: handleMapTap,
      onVertexMoved: saveVertex,
      onPointMoved: savePointPosition,
      onDraftChange: draft => updateDraftBanner(draft)
    });
    await farmMap.ready;
    farmMap.render(state);
    farmMap.fitToParcel();
  } catch (err) {
    farmMap = null;
    showMapError(err);
    console.error(err);
  }
}

/**
 * MapLibre entra como script clásico en el <head>. Si no está, casi siempre es que
 * la descarga de 800 kB se cortó por señal débil: vale la pena reintentar en vez
 * de dejar el mapa muerto hasta recargar la página.
 */
async function ensureMapLibre(attempts = 2) {
  if (typeof maplibregl !== 'undefined') return;
  const diag = window.__mapLib || {};
  if (diag.exec) throw new Error(`el navegador no pudo ejecutar la librería (${diag.exec})`);

  let reason = diag.network ? 'la descarga se cortó' : 'la librería no está disponible';
  for (let i = 0; i < attempts; i++) {
    try {
      await loadScript('./lib/maplibre-gl.js');
    } catch {
      reason = 'la descarga se cortó';
      continue;
    }
    if (typeof maplibregl !== 'undefined') return;
    reason = 'el archivo llegó pero el navegador no pudo ejecutarlo';
  }
  throw new Error(reason);
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.src = src;
    el.onload = resolve;
    el.onerror = () => reject(new Error('fallo de red en ' + src));
    document.head.appendChild(el);
  });
}

function showMapError(err) {
  const msg = String(err.message || err);
  const offline = !navigator.onLine;
  document.getElementById('map').innerHTML = `
    <div class="aviso aviso--atencion pad">
      <p><strong>No se pudo cargar el mapa:</strong> ${escapeHtml(msg)}.</p>
      <p>${offline
        ? 'El dispositivo está sin conexión. Con señal, toca «Reintentar»: al cargar una vez, el mapa queda guardado y ya funciona sin señal.'
        : 'Suele ser señal débil cortando la descarga de la librería (800 kB). Toca «Reintentar».'}</p>
      <p>Las listas de sectores, plantas, tareas y agua funcionan igual mientras tanto.</p>
      <button class="btn btn--rojo btn-block" id="btn-retry-map">Reintentar</button>
      <p class="hint">¿Sigue fallando? Abre el <a href="./diagnostico.html">diagnóstico</a>:
      dice exactamente qué no puede hacer este navegador.</p>
    </div>`;
  document.getElementById('btn-retry-map').onclick = async e => {
    e.target.disabled = true;
    e.target.textContent = 'Cargando…';
    document.getElementById('map').innerHTML = '';
    await initMap();
    if (farmMap) { renderAll(); farmMap.fitToParcel(); toast('Mapa cargado'); }
  };
}

async function reload() {
  const [sectors, plants, infra, tasks, waterEvents, elevations, parcels, config] = await Promise.all([
    db.all('sectors'), db.all('plants'), db.all('infra'), db.all('tasks'),
    db.all('water'), db.all('elevations'), db.all('parcels'), db.config()
  ]);
  state.sectors = sectors.sort((a, b) => a.name.localeCompare(b.name));
  state.plants = plants;
  state.infra = infra;
  state.tasks = tasks;
  state.water = waterEvents;
  state.elevations = elevations;
  state.config = config;
  if (parcels[0]) state.parcel = parcels[0];
  state.clima = await clima.leerCache();
  state.lecturas = await db.all('lecturas');
}

/** Recalcula todo lo derivado y repinta las vistas activas. */
function renderAll() {
  renderSectors();
  renderPlants();
  renderTasks();
  renderWater();
  renderFilterOptions();
  farmMap?.render(state);
  if (terrain) { terrain.render(state); renderThreeHint(); }
  updateOutboxChip();
}

async function persist(store, record) {
  const saved = await db.put(store, record);
  await reload();
  renderAll();
  return saved;
}

// ---------------------------------------------------------------------------
// Navegación y cromo
// ---------------------------------------------------------------------------

function wireChrome() {
  // Visible de un vistazo: así se sabe siempre qué build está cargado.
  $('#topbar-sub').textContent = `Salcedo · ${BUILD}` + (swDisabled() ? ' · sin SW' : '');
  $$('.nav-item').forEach(b => b.addEventListener('click', () => showView(b.dataset.view)));
  $('#btn-settings').addEventListener('click', openSettings);
  $('#sheet-close').addEventListener('click', closeSheet);
  // Cerrar tocando fuera y limpiar también cuando cierra el propio navegador.
  $('#sheet').addEventListener('click', e => { if (e.target === e.currentTarget) closeSheet(); });
  $('#sheet').addEventListener('close', () => { $('#sheet-body').innerHTML = ''; });

  $('#btn-fit').addEventListener('click', () => farmMap?.fitToParcel());
  $('#btn-gps').addEventListener('click', locateMe);
  $('#btn-layers').addEventListener('click', () => togglePanel('#panel-layers'));
  $('#btn-move').addEventListener('click', e => {
    if (!farmMap) return;
    const on = farmMap.mode !== 'move';
    farmMap.setMode(on ? 'move' : 'view');
    e.currentTarget.setAttribute('aria-pressed', String(on));
    banner(on ? 'Modo mover: arrastra plantas, infraestructura y puntos de elevación.' : null);
  });
  $$('[data-close-panel]').forEach(b => b.addEventListener('click', () => hidePanels()));
  $('#fab-add').addEventListener('click', openAddMenu);

  $('#sel-colorby').addEventListener('change', e => {
    farmMap?.setColorBy(e.target.value);
    terrain?.setColorBy(e.target.value);
  });
  $('#sel-filter-species').addEventListener('change', e => farmMap?.setFilters({ species: e.target.value }));
  $('#sel-filter-status').addEventListener('change', e => farmMap?.setFilters({ status: e.target.value }));
  $('#sel-filter-sector').addEventListener('change', e => farmMap?.setFilters({ sectorId: e.target.value }));

  $('#btn-new-sector').addEventListener('click', startDrawSector);
  $('#btn-new-plant').addEventListener('click', () => promptPlacement('plant'));
  $('#btn-new-task').addEventListener('click', () => openTaskForm({}));
  $('#btn-share-plan').addEventListener('click', sharePlan);
  $('#btn-new-water').addEventListener('click', () => openWaterForm({}));
  $('#plant-search').addEventListener('input', renderPlants);

  $$('#task-seg button').forEach(btn => btn.addEventListener('click', () => {
    $$('#task-seg button').forEach(b => b.setAttribute('aria-selected', String(b === btn)));
    taskFilter = btn.dataset.filter;
    renderTasks();
  }));

  $('#range-exag').addEventListener('input', async e => {
    const v = Number(e.target.value);
    $('#out-exag').textContent = v + '×';
    terrain?.setExaggeration(v);
    state.config = await db.saveConfig({ exageracion3D: v });
  });
  $('#chk-arrows').addEventListener('change', e => terrain?.toggleArrows(e.target.checked));
  $('#btn-recenter').addEventListener('click', () => terrain?.recentrar());
  $('#three-toggle').addEventListener('click', e => {
    const panel = $('#three-controls');
    const abierto = panel.classList.toggle('abierto');
    e.currentTarget.setAttribute('aria-expanded', String(abierto));
    setTimeout(() => { terrain?.resize(); medirOclusion3D(); }, 260);
  });
}

function showView(id) {
  $$('.view').forEach(v => v.classList.toggle('active', v.id === id));
  $$('.nav-item').forEach(b => {
    if (b.dataset.view === id) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });
  hidePanels();
  if (id === 'view-3d') init3D();
  if (id === 'view-map') setTimeout(() => farmMap?.map.resize(), 60);
}

function togglePanel(sel) {
  const el = $(sel);
  const wasHidden = el.hidden;
  hidePanels();
  el.hidden = !wasHidden;
}

function hidePanels() { $$('.panel').forEach(p => (p.hidden = true)); }

function toast(msg, ms = 2600) {
  const el = $('#toast');
  el.innerHTML = '<svg class="icono" aria-hidden="true"><use href="#i-info"/></svg>';
  el.append(msg);
  el.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => (el.hidden = true), ms);
}

function banner(html) {
  const el = $('#map-banner');
  if (!html) { el.hidden = true; el.innerHTML = ''; return; }
  el.innerHTML = html;
  el.hidden = false;
}

// ---------------------------------------------------------------------------
// Hoja modal
// ---------------------------------------------------------------------------

function openSheet(title, bodyHtml, onMount) {
  const dlg = $('#sheet');
  $('#sheet-title').textContent = title;
  $('#sheet-body').innerHTML = bodyHtml;
  if (!dlg.open) dlg.showModal();   // el navegador pone el foco y cierra con Escape
  onMount?.($('#sheet-body'));
}

function closeSheet() {
  const dlg = $('#sheet');
  if (dlg.open) dlg.close();
  $('#sheet-body').innerHTML = '';
}

// ---------------------------------------------------------------------------
// Mapa: colocación, edición, GPS
// ---------------------------------------------------------------------------

function openAddMenu() {
  openSheet('Agregar', `
    <div class="grid-actions">
      <button class="btn big-action" data-add="plant"><svg class="icono" aria-hidden="true"><use href="#i-hoja"/></svg>Planta</button>
      <button class="btn big-action" data-add="infra"><svg class="icono" aria-hidden="true"><use href="#i-casa"/></svg>Infraestructura</button>
      <button class="btn big-action" data-add="sector"><svg class="icono" aria-hidden="true"><use href="#i-cuadricula"/></svg>Sector</button>
      <button class="btn big-action" data-add="elevation"><svg class="icono" aria-hidden="true"><use href="#i-balanza"/></svg>Punto de elevación</button>
    </div>
    <p class="hint">Los puntos se pueden colocar con tu ubicación GPS o tocando el mapa.</p>
  `, body => {
    body.querySelectorAll('[data-add]').forEach(btn => btn.addEventListener('click', () => {
      const kind = btn.dataset.add;
      closeSheet();
      if (kind === 'sector') startDrawSector();
      else promptPlacement(kind);
    }));
  });
}

function promptPlacement(kind) {
  showView('view-map');
  pendingPlacement = { kind };
  const label = { plant: 'la planta', infra: 'la infraestructura', elevation: 'el punto de elevación' }[kind];
  banner(`Toca el mapa donde va ${label}, o <button class="link" id="banner-gps">usa mi GPS</button> · <button class="link" id="banner-cancel">cancelar</button>`);
  $('#banner-gps').onclick = () => locateMe(true);
  $('#banner-cancel').onclick = () => { pendingPlacement = null; banner(null); };
}

function handleMapTap(latlng) {
  if (!pendingPlacement) return;
  const kind = pendingPlacement.kind;
  pendingPlacement = null;
  banner(null);
  placeAt(kind, latlng);
}

function placeAt(kind, [lat, lng]) {
  const elevationM = round(interpolateElevation([lat, lng], measuredPoints()), 2);
  if (kind === 'plant') {
    const sectorId = state.sectors.find(s => pointInRing([lat, lng], s.polygon))?.id;
    openPlantForm({ lat, lng, elevationM, sectorId, status: 'sano', species: 'aguacate' });
  } else if (kind === 'infra') {
    openInfraForm({ lat, lng, elevationM, type: 'reservorio', props: {} });
  } else {
    openElevationForm({ lat, lng, elevationM, measured: true });
  }
}

function measuredPoints() {
  return state.elevations.filter(e => typeof e.elevationM === 'number');
}

function locateMe(place = false) {
  if (!navigator.geolocation) return toast('Este dispositivo no reporta ubicación.');
  toast('Buscando señal GPS…');
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude, accuracy } = pos.coords;
      farmMap?.showGps([latitude, longitude], accuracy);
      farmMap?.flyTo([latitude, longitude], 20);
      const inside = pointInRing([latitude, longitude], state.parcel.boundary);
      if (place && pendingPlacement) {
        const kind = pendingPlacement.kind;
        pendingPlacement = null;
        banner(null);
        placeAt(kind, [latitude, longitude]);
        return;
      }
      toast(`GPS ±${Math.round(accuracy)} m · ${inside ? 'dentro' : 'fuera'} de la finca`);
    },
    err => toast('No se pudo obtener el GPS: ' + err.message),
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
  );
}

function startDrawSector() {
  if (!farmMap) return toast('El mapa no está disponible.');
  showView('view-map');
  farmMap.setMode('draw');
  farmMap.setEditTarget(null);
  updateDraftBanner([]);
}

function updateDraftBanner(draft) {
  if (farmMap?.mode !== 'draw') return banner(null);
  const area = draft.length >= 3 ? fmtArea(areaM2(draft)) : '—';
  banner(`
    Dibujando: <strong>${draft.length}</strong> vértices · área <strong>${area}</strong>
    · <button class="link" id="draft-undo">deshacer</button>
    · <button class="link" id="draft-done">terminar</button>
    · <button class="link" id="draft-cancel">cancelar</button>
  `);
  $('#draft-undo').onclick = () => farmMap.undoDraft();
  $('#draft-cancel').onclick = () => { farmMap.setMode('view'); banner(null); };
  $('#draft-done').onclick = () => {
    const ring = farmMap.getDraft();
    if (ring.length < 3) return toast('Un sector necesita al menos 3 vértices.');
    farmMap.setMode('view');
    banner(null);
    openSectorForm({ polygon: ring, color: randomColor(), parcelId: state.parcel.id });
  };
}

async function saveVertex(target, index, latlng) {
  if (!target) return;
  if (target.kind === 'boundary') {
    const boundary = state.parcel.boundary.map(p => [...p]);
    boundary[index] = latlng;
    await persist('parcels', { ...state.parcel, boundary });
    toast('Límite actualizado · ' + fmtArea(areaM2(boundary)));
  } else {
    const sector = state.sectors.find(s => s.id === target.id);
    if (!sector) return;
    const polygon = sector.polygon.map(p => [...p]);
    polygon[index] = latlng;
    await persist('sectors', { ...sector, polygon, areaM2: round(areaM2(polygon), 1) });
    toast('Sector actualizado · ' + fmtArea(areaM2(polygon)));
  }
}

async function savePointPosition(kind, id, [lat, lng]) {
  const store = kind === 'plant' ? 'plants' : kind === 'infra' ? 'infra' : 'elevations';
  const rec = (kind === 'plant' ? state.plants : kind === 'infra' ? state.infra : state.elevations)
    .find(r => r.id === id);
  if (!rec) return;
  const patch = { ...rec, lat, lng };
  if (kind === 'plant') {
    patch.sectorId = state.sectors.find(s => pointInRing([lat, lng], s.polygon))?.id;
    patch.elevationM = round(interpolateElevation([lat, lng], measuredPoints()), 2);
  }
  await persist(store, patch);
  toast('Posición guardada');
}

// ---------------------------------------------------------------------------
// Fichas
// ---------------------------------------------------------------------------

function openPoint(kind, id) {
  if (kind === 'plant') return openPlant(id);
  if (kind === 'infra') return openInfra(id);
  return openElevation(id);
}

function openPlant(id) {
  const p = state.plants.find(x => x.id === id);
  if (!p) return;
  const sector = state.sectors.find(s => s.id === p.sectorId);
  const tasks = state.tasks
    .filter(t => (t.targetType === 'plant' && t.targetId === p.id) ||
                 (t.targetType === 'sector' && p.sectorId && t.targetId === p.sectorId))
    .sort(byDateDesc);

  openSheet(`${SPECIES[p.species]?.label || p.species}${p.variety ? ' · ' + p.variety : ''}`, `
    <div class="chips">
      <span class="badge" style="background:${STATUS_COLORS[p.status]};color:#fff">${p.status}</span>
      ${sector ? `<span class="badge">${escapeHtml(sector.name)}</span>` : '<span class="badge">Sin sector</span>'}
    </div>
    <dl class="hechos">
      <dt>Sembrada</dt><dd>${p.plantedAt ? fmtDate(p.plantedAt) + ' · ' + ageLabel(p.plantedAt) : '—'}</dd>
      <dt>Elevación</dt><dd>${p.elevationM ? nf(p.elevationM, 2) + ' msnm' : '—'}</dd>
      <dt>Coordenadas</dt><dd>${p.lat.toFixed(6)}, ${p.lng.toFixed(6)}</dd>
      <dt>Riego hoy</dt><dd>${nf(water.litrosPlantaDia(p, diaDeHoy()), 1)} L${
        SPECIES[p.species] ? ` <small class="muted">· adulta en día normal: ${SPECIES[p.species].lppd} L</small>` : ''}</dd>
    </dl>
    ${p.notes ? `<p class="aviso aviso--ok">${escapeHtml(p.notes)}</p>` : ''}
    ${p.photos?.length ? `<div class="photos">${p.photos.map(src => `<img src="${src}" alt="" />`).join('')}</div>` : ''}
    <h4>Historial y tareas (${tasks.length})</h4>
    ${tasks.length ? `<ul class="mini-list">${tasks.map(taskLine).join('')}</ul>` : '<p class="hint">Sin tareas registradas.</p>'}
    <div class="sheet-actions">
      <button class="btn btn--rojo btn-block" data-act="task">Nueva tarea</button>
      <button class="btn" data-act="edit">Editar</button>
      <button class="btn" data-act="center">Ver en mapa</button>
      <button class="btn btn-danger" data-act="del">Eliminar</button>
    </div>
  `, body => {
    body.querySelector('[data-act="edit"]').onclick = () => openPlantForm(p);
    body.querySelector('[data-act="task"]').onclick = () => openTaskForm({ targetType: 'plant', targetId: p.id });
    body.querySelector('[data-act="center"]').onclick = () => { closeSheet(); showView('view-map'); farmMap?.flyTo([p.lat, p.lng]); };
    body.querySelector('[data-act="del"]').onclick = async () => {
      if (!confirm('¿Eliminar esta planta?')) return;
      await db.remove('plants', p.id);
      await reload(); renderAll(); closeSheet(); toast('Planta eliminada');
    };
  });
}

function openPlantForm(p) {
  const isNew = !p.id;
  openSheet(isNew ? 'Nueva planta' : 'Editar planta', `
    <form id="f">
      <label>Especie
        <select name="species">${Object.entries(SPECIES).map(([k, v]) =>
          `<option value="${k}" ${p.species === k ? 'selected' : ''}>${v.label}</option>`).join('')}</select>
      </label>
      <label>Variedad <input name="variety" value="${attr(p.variety)}" placeholder="Hass, Fuerte…" /></label>
      <label>Sector
        <select name="sectorId"><option value="">Sin sector</option>${state.sectors.map(s =>
          `<option value="${s.id}" ${p.sectorId === s.id ? 'selected' : ''}>${escapeHtml(s.name)}</option>`).join('')}</select>
      </label>
      <label>Fecha de siembra <input type="date" name="plantedAt" value="${attr(p.plantedAt)}" /></label>
      <label>Estado
        <select name="status">${STATUSES.map(s =>
          `<option value="${s}" ${p.status === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
      </label>
      <div class="field-grid-2">
        <label>Latitud <input name="lat" type="number" step="0.0000001" value="${attr(p.lat)}" required /></label>
        <label>Longitud <input name="lng" type="number" step="0.0000001" value="${attr(p.lng)}" required /></label>
      </div>
      <label>Elevación (msnm) <input name="elevationM" type="number" step="0.01" value="${attr(p.elevationM)}" /></label>
      <label>Notas <textarea name="notes" rows="3">${escapeHtml(p.notes || '')}</textarea></label>
      <label>Fotos <input type="file" name="photo" accept="image/*" capture="environment" multiple /></label>
      <button class="btn btn--rojo btn-block" type="submit">Guardar</button>
    </form>
  `, body => {
    body.querySelector('#f').onsubmit = async ev => {
      ev.preventDefault();
      const f = new FormData(ev.target);
      const photos = await readPhotos(f.getAll('photo'));
      await persist('plants', {
        ...p,
        species: f.get('species'),
        variety: f.get('variety') || undefined,
        sectorId: f.get('sectorId') || undefined,
        plantedAt: f.get('plantedAt') || undefined,
        status: f.get('status'),
        lat: Number(f.get('lat')),
        lng: Number(f.get('lng')),
        elevationM: f.get('elevationM') ? Number(f.get('elevationM')) : undefined,
        notes: f.get('notes') || undefined,
        photos: [...(p.photos || []), ...photos]
      });
      closeSheet();
      toast(isNew ? 'Planta agregada' : 'Planta actualizada');
    };
  });
}

function openInfra(id) {
  const i = state.infra.find(x => x.id === id);
  if (!i) return;
  const low = Math.min(...measuredPoints().map(p => p.elevationM));
  const head = i.elevationM ? i.elevationM - low : null;
  openSheet(cap(i.type), `
    <dl class="hechos">
      <dt>Elevación</dt><dd>${i.elevationM ? nf(i.elevationM, 2) + ' msnm' : '—'}</dd>
      ${head != null ? `<dt>Carga al punto más bajo</dt><dd>${nf(head)} m · ${nf(staticPressureBar(head), 2)} bar</dd>` : ''}
      <dt>Coordenadas</dt><dd>${i.lat.toFixed(6)}, ${i.lng.toFixed(6)}</dd>
      ${Object.entries(i.props || {}).map(([k, v]) => `<dt>${escapeHtml(k)}</dt><dd>${escapeHtml(String(v))}</dd>`).join('')}
    </dl>
    <div class="sheet-actions">
      <button class="btn" data-act="edit">Editar</button>
      <button class="btn" data-act="center">Ver en mapa</button>
      <button class="btn btn-danger" data-act="del">Eliminar</button>
    </div>
  `, body => {
    body.querySelector('[data-act="edit"]').onclick = () => openInfraForm(i);
    body.querySelector('[data-act="center"]').onclick = () => { closeSheet(); showView('view-map'); farmMap?.flyTo([i.lat, i.lng]); };
    body.querySelector('[data-act="del"]').onclick = async () => {
      if (!confirm('¿Eliminar?')) return;
      await db.remove('infra', i.id);
      await reload(); renderAll(); closeSheet();
    };
  });
}

function openInfraForm(i) {
  openSheet(i.id ? 'Editar infraestructura' : 'Nueva infraestructura', `
    <form id="f">
      <label>Tipo
        <select name="type">${INFRA_TYPES.map(t =>
          `<option value="${t}" ${i.type === t ? 'selected' : ''}>${cap(t)}</option>`).join('')}</select>
      </label>
      <div class="field-grid-2">
        <label>Latitud <input name="lat" type="number" step="0.0000001" value="${attr(i.lat)}" required /></label>
        <label>Longitud <input name="lng" type="number" step="0.0000001" value="${attr(i.lng)}" required /></label>
      </div>
      <label>Elevación (msnm) <input name="elevationM" type="number" step="0.01" value="${attr(i.elevationM)}" /></label>
      <label>Volumen (m³) — sólo reservorio <input name="volumenM3" type="number" step="0.1" value="${attr(i.props?.volumenM3)}" /></label>
      <label>Material <input name="material" value="${attr(i.props?.material)}" /></label>
      <button class="btn btn--rojo btn-block" type="submit">Guardar</button>
    </form>
  `, body => {
    body.querySelector('#f').onsubmit = async ev => {
      ev.preventDefault();
      const f = new FormData(ev.target);
      const props = { ...(i.props || {}) };
      if (f.get('volumenM3')) props.volumenM3 = Number(f.get('volumenM3'));
      if (f.get('material')) props.material = f.get('material');
      await persist('infra', {
        ...i,
        type: f.get('type'),
        lat: Number(f.get('lat')),
        lng: Number(f.get('lng')),
        elevationM: f.get('elevationM') ? Number(f.get('elevationM')) : undefined,
        props
      });
      closeSheet();
      toast('Guardado');
    };
  });
}

function openElevation(id) {
  const e = state.elevations.find(x => x.id === id);
  if (!e) return;
  openSheet(e.name || 'Punto de elevación', `
    <dl class="hechos">
      <dt>Elevación</dt><dd>${nf(e.elevationM, 2)} msnm</dd>
      <dt>Coordenada</dt><dd>${e.lat.toFixed(6)}, ${e.lng.toFixed(6)} ${e.measured ? '' : '<em>(estimada)</em>'}</dd>
    </dl>
    ${e.measured ? '' : '<p class="aviso aviso--atencion">La altura es real pero la coordenada aún no se ha tomado con GPS. Párate en el punto y usa “Fijar con mi GPS”.</p>'}
    <div class="sheet-actions">
      <button class="btn btn--rojo btn-block" data-act="gps">Fijar con mi GPS</button>
      <button class="btn" data-act="edit">Editar</button>
      <button class="btn btn-danger" data-act="del">Eliminar</button>
    </div>
  `, body => {
    body.querySelector('[data-act="edit"]').onclick = () => openElevationForm(e);
    body.querySelector('[data-act="del"]').onclick = async () => {
      if (!confirm('¿Eliminar este punto? El modelo de terreno se recalcula sin él.')) return;
      await db.remove('elevations', e.id);
      await reload(); renderAll(); closeSheet();
    };
    body.querySelector('[data-act="gps"]').onclick = () => {
      if (!navigator.geolocation) return toast('Sin GPS disponible.');
      toast('Buscando señal GPS…');
      navigator.geolocation.getCurrentPosition(async pos => {
        await persist('elevations', {
          ...e, lat: pos.coords.latitude, lng: pos.coords.longitude, measured: true,
          gpsAccuracyM: round(pos.coords.accuracy, 1)
        });
        closeSheet();
        toast(`Coordenada fijada (±${Math.round(pos.coords.accuracy)} m)`);
      }, err => toast('GPS: ' + err.message), { enableHighAccuracy: true, timeout: 15000 });
    };
  });
}

function openElevationForm(e) {
  openSheet(e.id ? 'Editar punto de elevación' : 'Nuevo punto de elevación', `
    <form id="f">
      <label>Nombre <input name="name" value="${attr(e.name)}" placeholder="Cuyero, esquina norte…" required /></label>
      <label>Elevación (msnm) <input name="elevationM" type="number" step="0.01" value="${attr(e.elevationM)}" required /></label>
      <div class="field-grid-2">
        <label>Latitud <input name="lat" type="number" step="0.0000001" value="${attr(e.lat)}" required /></label>
        <label>Longitud <input name="lng" type="number" step="0.0000001" value="${attr(e.lng)}" required /></label>
      </div>
      <label class="row"><input type="checkbox" name="measured" ${e.measured ? 'checked' : ''} /> Coordenada tomada con GPS</label>
      <p class="hint">Cada punto nuevo afina el modelo del terreno y la vista 3D.</p>
      <button class="btn btn--rojo btn-block" type="submit">Guardar</button>
    </form>
  `, body => {
    body.querySelector('#f').onsubmit = async ev => {
      ev.preventDefault();
      const f = new FormData(ev.target);
      await persist('elevations', {
        ...e,
        name: f.get('name'),
        elevationM: Number(f.get('elevationM')),
        lat: Number(f.get('lat')),
        lng: Number(f.get('lng')),
        measured: f.get('measured') === 'on'
      });
      closeSheet();
      toast('Modelo de terreno actualizado');
    };
  });
}

// ---------------------------------------------------------------------------
// Sectores
// ---------------------------------------------------------------------------

function renderSectors() {
  const total = areaM2(state.parcel.boundary);
  const used = state.sectors.reduce((s, x) => s + areaM2(x.polygon), 0);
  const rows = state.sectors.map(s => {
    const area = areaM2(s.polygon);
    const plants = state.plants.filter(p => p.sectorId === s.id);
    return `
      <button class="list-row" data-sector="${s.id}">
        <span class="franja" style="background:${s.color}"></span>
        <span class="fila-main">
          <strong>${escapeHtml(s.name)}</strong>
          <small>${fmtArea(area)} · ${plants.length} plantas${s.irrigationZone ? ' · ' + escapeHtml(s.irrigationZone) : ''}</small>
          ${/* Lo que se hace con un sector depende del agua que pide y de en
                qué etapa va; el área y la zona no cambian nunca. */
            plants.length ? `<small class="muted">${
              Math.round(plants.reduce((sum, p) => sum + water.litrosPlantaDia(p, diaDeHoy()), 0))
            } L/día${s.etapa ? ` · ${water.ETAPAS[s.etapa].label.toLowerCase()}` : ''}${
              etapaVieja(s) ? ' ⚠︎' : ''}</small>` : ''}
        </span>
        <span class="fila-go"><svg class="icono icono--s" aria-hidden="true"><use href="#i-chevron-der"/></svg></span>
      </button>`;
  }).join('');

  $('#sectors-list').innerHTML = `
    <div class="card datos card--ancha">
      <div><span>Superficie total</span><strong>${fmtArea(total)}</strong></div>
      <div><span>Perímetro</span><strong>${fmtM(perimeterM(state.parcel.boundary))}</strong></div>
      <div><span>En sectores</span><strong>${fmtArea(used)} (${Math.round((used / total) * 100)}%)</strong></div>
    </div>
    <div class="card card--filas card--ancha">
      <button class="list-row" id="edit-boundary">
        <span class="franja" style="background:var(--mal-ambar)"></span>
        <span class="fila-main">
          <strong>Límite del terreno</strong>
          <small>${state.parcel.boundary.length} vértices · editar en el mapa</small>
        </span>
        <span class="fila-go"><svg class="icono icono--s" aria-hidden="true"><use href="#i-chevron-der"/></svg></span>
      </button>
      ${rows}
    </div>
    ${state.sectors.length ? '' : '<p class="hint">Aún no hay sectores. Usa “Dibujar sector”.</p>'}
  `;
  $('#sectors-list').querySelectorAll('[data-sector]').forEach(el =>
    el.addEventListener('click', () => openSector(el.dataset.sector)));
  $('#edit-boundary').addEventListener('click', () => {
    if (!farmMap) return toast('El mapa no está disponible.');
    showView('view-map');
    farmMap.setMode('view');
    farmMap.setEditTarget({ kind: 'boundary' });
    banner(`Arrastra los vértices amarillos del límite · <button class="link" id="edit-done">listo</button>`);
    $('#edit-done').onclick = () => { farmMap.setEditTarget(null); banner(null); };
  });
}

function openSector(id) {
  const s = state.sectors.find(x => x.id === id);
  if (!s) return;
  const area = areaM2(s.polygon);
  const plants = state.plants.filter(p => p.sectorId === s.id);
  const bySpecies = new Map();
  for (const p of plants) bySpecies.set(p.species, (bySpecies.get(p.species) || 0) + 1);
  const dia = diaDeHoy();
  const dailyL = plants.reduce((sum, p) => sum + water.litrosPlantaDia(p, dia), 0);
  const dailyAdultoL = plants.reduce((sum, p) => sum + (SPECIES[p.species]?.lppd ?? 0), 0);
  const tasks = state.tasks.filter(t => t.targetType === 'sector' && t.targetId === s.id).sort(byDateDesc);
  const elevs = s.polygon.map(p => interpolateElevation(p, measuredPoints()));

  openSheet(s.name, `
    <dl class="hechos">
      <dt>Área</dt><dd>${fmtArea(area)}</dd>
      <dt>Perímetro</dt><dd>${fmtM(perimeterM(s.polygon))}</dd>
      <dt>Plantas</dt><dd>${plants.length}</dd>
      <dt>Riego hoy</dt><dd>${Math.round(dailyL).toLocaleString('es-EC')} L/día${
        dailyAdultoL > dailyL * 1.05 ? ` <small class="muted">· ${Math.round(dailyAdultoL).toLocaleString('es-EC')} adultas</small>` : ''}</dd>
      <dt>Elevación</dt><dd>${nf(Math.min(...elevs))}–${nf(Math.max(...elevs))} msnm</dd>
      ${s.irrigationZone ? `<dt>Zona de riego</dt><dd>${escapeHtml(s.irrigationZone)}</dd>` : ''}
      <dt>Etapa</dt><dd>${s.etapa
        ? `${water.ETAPAS[s.etapa].label} <small class="muted">· riego ×${water.ETAPAS[s.etapa].kc}</small>`
        : '<span class="muted">sin declarar</span>'}</dd>
    </dl>
    ${s.etapa ? `<p class="hint">${water.ETAPAS[s.etapa].dice}</p>` : ''}
    ${etapaVieja(s) ? `<p class="aviso aviso--atencion">La etapa se declaró hace ${etapaVieja(s)} días.
      Si el bloque ya pasó a otra, el riego calculado se está quedando corto o largo.</p>` : ''}
    <h4>Plantas por especie</h4>
    ${bySpecies.size ? `<ul class="mini-list">${[...bySpecies].map(([sp, n]) =>
      `<li><span class="punto" style="background:${SPECIES[sp]?.color}"></span>${SPECIES[sp]?.label || sp}<b>${n}</b></li>`).join('')}</ul>`
      : '<p class="hint">Sin plantas registradas en este sector.</p>'}
    <h4>Tareas del sector (${tasks.length})</h4>
    ${tasks.length ? `<ul class="mini-list">${tasks.map(taskLine).join('')}</ul>` : '<p class="hint">Sin tareas.</p>'}
    <div class="sheet-actions">
      <button class="btn btn--rojo btn-block" data-act="plant">Sembrar en marco</button>
      <button class="btn" data-act="water">Riego por gravedad</button>
      <button class="btn" data-act="task">Tarea del sector</button>
      <button class="btn" data-act="edit">Editar datos</button>
      <button class="btn" data-act="shape">Editar forma</button>
      <button class="btn btn-danger" data-act="del">Eliminar</button>
    </div>
  `, body => {
    body.querySelector('[data-act="edit"]').onclick = () => openSectorForm(s);
    body.querySelector('[data-act="plant"]').onclick = () => openPlantingForm(s);
    body.querySelector('[data-act="water"]').onclick = () => openHydraulics(s);
    body.querySelector('[data-act="task"]').onclick = () => openTaskForm({ targetType: 'sector', targetId: s.id });
    body.querySelector('[data-act="shape"]').onclick = () => {
      if (!farmMap) return toast('El mapa no está disponible.');
      closeSheet();
      showView('view-map');
      farmMap.setEditTarget({ kind: 'sector', id: s.id });
      farmMap.flyTo(centroid(s.polygon), 19);
      banner(`Arrastra los vértices de <strong>${escapeHtml(s.name)}</strong> · <button class="link" id="edit-done">listo</button>`);
      $('#edit-done').onclick = () => { farmMap.setEditTarget(null); banner(null); };
    };
    body.querySelector('[data-act="del"]').onclick = async () => {
      if (!confirm(`¿Eliminar el sector "${s.name}"? Las plantas quedan sin sector.`)) return;
      for (const p of plants) await db.put('plants', { ...p, sectorId: undefined });
      await db.remove('sectors', s.id);
      await reload(); renderAll(); closeSheet(); toast('Sector eliminado');
    };
  });
}

/** Días desde que se declaró la etapa, si ya lleva demasiados. */
function etapaVieja(s) {
  if (!s.etapa || !s.etapaDesde) return 0;
  const d = water.daysBetween(s.etapaDesde, today());
  return d > 90 ? d : 0;
}

function openSectorForm(s) {
  const isNew = !s.id;
  openSheet(isNew ? 'Nuevo sector' : 'Editar sector', `
    <form id="f">
      <p class="hint">Área calculada: <strong>${fmtArea(areaM2(s.polygon))}</strong></p>
      <label>Nombre <input name="name" value="${attr(s.name)}" placeholder="Bloque arándanos" required /></label>
      <label>Color <input type="color" name="color" value="${s.color || '#2f9e44'}" /></label>
      <label>Zona de riego <input name="irrigationZone" value="${attr(s.irrigationZone)}" placeholder="Zona alta" /></label>
      <label>Etapa del cultivo
        <select name="etapa">
          <option value="">Sin declarar</option>
          ${Object.entries(water.ETAPAS).map(([id, e]) =>
            `<option value="${id}" ${s.etapa === id ? 'selected' : ''}>${e.label} (×${e.kc})</option>`).join('')}
        </select>
      </label>
      <p class="hint">Cambia cuánta agua pide el sector. Nadie puede deducirla de la fecha
      de siembra —en la sierra no hay una estación que la fije—, así que se declara aquí y
      la app avisa cuando lleva mucho sin tocarse.</p>
      <button class="btn btn--rojo btn-block" type="submit">Guardar</button>
    </form>
  `, body => {
    body.querySelector('#f').onsubmit = async ev => {
      ev.preventDefault();
      const f = new FormData(ev.target);
      await persist('sectors', {
        ...s,
        parcelId: state.parcel.id,
        name: f.get('name'),
        color: f.get('color'),
        irrigationZone: f.get('irrigationZone') || undefined,
        etapa: f.get('etapa') || undefined,
        // Se marca cuándo, porque una etapa de hace seis meses ya no es cierta.
        etapaDesde: f.get('etapa') && f.get('etapa') !== s.etapa ? today() : s.etapaDesde,
        areaM2: round(areaM2(s.polygon), 1)
      });
      closeSheet();
      toast(isNew ? 'Sector creado' : 'Sector actualizado');
    };
  });
}

// ---------------------------------------------------------------------------
// Marco de siembra
// ---------------------------------------------------------------------------

/** Genera las posiciones de un bloque entero y las siembra de una vez. */
function openPlantingForm(sector) {
  const defaults = { arandano: [2.5, 1.2], aguacate: [6, 6], mora: [3, 2], lavanda: [1, 0.6] };

  openSheet(`Sembrar en ${sector.name}`, `
    <form id="f">
      <label>Especie
        <select name="species">${Object.entries(SPECIES).map(([k, v]) =>
          `<option value="${k}" ${k === 'arandano' ? 'selected' : ''}>${v.label}</option>`).join('')}</select>
      </label>
      <label>Variedad <input name="variety" placeholder="opcional" /></label>
      <div class="field-grid-2">
        <label>Entre hileras (m) <input name="rowSpacingM" type="number" step="0.1" min="0.2" value="2.5" required /></label>
        <label>Entre plantas (m) <input name="spacingM" type="number" step="0.1" min="0.2" value="1.2" required /></label>
      </div>
      <div class="field-grid-2">
        <label>Margen al borde (m) <input name="marginM" type="number" step="0.1" min="0" value="1" /></label>
        <label>Giro de hileras (°) <input name="angleDeg" type="number" step="5" min="0" max="180" value="0" /></label>
      </div>
      <label>Disposición
        <select name="layout">${Object.entries(LAYOUTS).map(([k, v]) =>
          `<option value="${k}">${v.label}</option>`).join('')}</select>
      </label>
      <label>Fecha de siembra <input type="date" name="plantedAt" value="${today()}" /></label>
      <div id="planting-summary" class="card datos"></div>
      <p class="hint">Las posiciones naranjas en el mapa son la propuesta. Nada se guarda hasta confirmar.</p>
      <button class="btn btn--rojo btn-block" type="submit" id="btn-sow">Sembrar</button>
    </form>
  `, body => {
    const form = body.querySelector('#f');
    let points = [];

    const recompute = () => {
      const f = new FormData(form);
      const p = plantingPreview({
        polygon: sector.polygon,
        spacingM: Number(f.get('spacingM')) || 1,
        rowSpacingM: Number(f.get('rowSpacingM')) || 1,
        marginM: Number(f.get('marginM')) || 0,
        angleDeg: Number(f.get('angleDeg')) || 0,
        layout: f.get('layout')
      });
      points = p.points;
      const species = f.get('species');
      const lppd = SPECIES[species]?.lppd ?? 0;
      const existing = state.plants.filter(x => x.sectorId === sector.id).length;

      body.querySelector('#planting-summary').innerHTML = `
        <div><span>Caben</span><strong>${p.count.toLocaleString('es-EC')} plantas</strong></div>
        <div><span>Densidad</span><strong>${p.densityPerHa.toLocaleString('es-EC')}/ha · ${nf(p.m2PerPlant, 1)} m²/planta</strong></div>
        <div><span>Riego que suma (adultas)</span><strong>${nf((p.count * lppd) / 1000, 2)} m³/día</strong></div>
        ${existing ? `<div><span>Ya sembradas aquí</span><strong>${existing}</strong></div>` : ''}`;
      body.querySelector('#btn-sow').textContent = p.count ? `Sembrar ${p.count} plantas` : 'No cabe ninguna';
      body.querySelector('#btn-sow').disabled = p.count === 0;
      farmMap?.previewPoints(points);
    };

    form.querySelector('[name="species"]').addEventListener('change', e => {
      const d = defaults[e.target.value];
      if (d) {
        form.querySelector('[name="rowSpacingM"]').value = d[0];
        form.querySelector('[name="spacingM"]').value = d[1];
      }
      recompute();
    });
    form.addEventListener('input', recompute);
    recompute();

    form.onsubmit = async ev => {
      ev.preventDefault();
      if (!points.length) return;
      const f = new FormData(ev.target);
      if (!confirm(`Se crearán ${points.length} plantas en "${sector.name}". ¿Seguir?`)) return;

      const btn = body.querySelector('#btn-sow');
      btn.disabled = true;
      btn.textContent = 'Sembrando…';

      const elevPoints = measuredPoints();
      const records = points.map(([lat, lng]) => ({
        sectorId: sector.id,
        species: f.get('species'),
        variety: f.get('variety') || undefined,
        lat, lng,
        elevationM: round(interpolateElevation([lat, lng], elevPoints), 2),
        plantedAt: f.get('plantedAt') || undefined,
        status: 'sano'
      }));

      await db.putMany('plants', records);
      await reload();
      renderAll();
      farmMap?.previewPoints([]);
      closeSheet();
      toast(`${records.length} plantas sembradas en ${sector.name}`, 4000);
    };
  });

  // Al cerrar la hoja se limpia la propuesta del mapa.
  const observer = new MutationObserver(() => {
    if ($('#sheet').hidden) { farmMap?.previewPoints([]); observer.disconnect(); }
  });
  observer.observe($('#sheet'), { attributes: true, attributeFilter: ['hidden'] });
}

// ---------------------------------------------------------------------------
// Riego por gravedad
// ---------------------------------------------------------------------------

/** Presión real disponible en un sector: desnivel menos pérdidas por fricción. */
function openHydraulics(sector) {
  const source = state.infra.find(i => i.type === 'reservorio');
  if (!source) {
    return openSheet('Riego por gravedad',
      '<p class="aviso aviso--atencion">No hay ningún reservorio registrado. Agrégalo desde el mapa para calcular la presión.</p>');
  }

  const target = centroid(sector.polygon);
  const targetElev = interpolateElevation(target, measuredPoints());
  const plants = state.plants.filter(p => p.sectorId === sector.id);
  const demandL = plants.reduce((sum, p) => sum + (SPECIES[p.species]?.lppd ?? 0), 0);

  openSheet(`Riego por gravedad · ${sector.name}`, `
    <form id="f">
      <div class="field-grid-2">
        <label>Demanda del sector (L/día, a pico) <input name="demandLitresPerDay" type="number" step="1" value="${Math.round(demandL)}" /></label>
        <label>Horas de riego <input name="irrigationHours" type="number" step="0.5" min="0.5" value="2" /></label>
      </div>
      <div class="field-grid-2">
        <label>Diámetro de tubería
          <select name="diameterMm">${hyd.DIAMETERS_MM.map(d =>
            `<option value="${d}" ${d === 25 ? 'selected' : ''}>${d} mm</option>`).join('')}</select>
        </label>
        <label>Recorrido extra (%) <input name="extra" type="number" step="5" min="0" value="25" /></label>
      </div>
      <div id="hyd-result"></div>
    </form>
  `, body => {
    const form = body.querySelector('#f');

    const recompute = () => {
      const f = new FormData(form);
      const params = {
        sourceElevationM: source.elevationM,
        targetElevationM: targetElev,
        sourceLatLng: [source.lat, source.lng],
        targetLatLng: target,
        demandLitresPerDay: Number(f.get('demandLitresPerDay')) || 0,
        irrigationHours: Number(f.get('irrigationHours')) || 2,
        extraLengthFactor: 1 + (Number(f.get('extra')) || 0) / 100
      };
      const r = hyd.pressureAt({ ...params, diameterMm: Number(f.get('diameterMm')) });
      const sug = hyd.suggestDiameter(params);

      let veredicto;
      if (r.tooLow) {
        veredicto = `<p class="aviso aviso--atencion">Presión insuficiente para goteros autocompensados, que necesitan al menos
          ${nf(hyd.DRIPPER_MIN_BAR, 1)} bar.
          ${r.lossShare > 0.3
            ? 'La fricción se está comiendo ' + Math.round(r.lossShare * 100) + '% del desnivel: sube el diámetro.'
            : 'El desnivel hasta este sector no da para más, por mucho que engroses la tubería. Opciones: goteros no compensados (trabajan desde 0,5 bar), microaspersión de baja presión, o una bomba pequeña.'}</p>`;
      } else if (r.tooHigh) {
        veredicto = `<p class="aviso aviso--atencion">Presión por encima de ${nf(hyd.DRIPPER_MAX_BAR, 1)} bar: conviene un regulador
          para no forzar goteros y uniones.</p>`;
      } else {
        veredicto = `<p class="aviso aviso--ok">Presión dentro del rango de trabajo del goteo autocompensado
          (${nf(hyd.DRIPPER_MIN_BAR, 1)}–${nf(hyd.DRIPPER_MAX_BAR, 1)} bar).</p>`;
      }

      body.querySelector('#hyd-result').innerHTML = `
        <div class="card datos">
          <div><span>Desnivel reservorio → sector</span><strong>${nf(r.dropM)} m</strong></div>
          <div><span>Presión estática</span><strong>${nf(r.staticBar, 2)} bar</strong></div>
          <div><span>Tubería estimada</span><strong>${nf(r.pipeLengthM, 0)} m</strong></div>
          <div><span>Caudal de diseño</span><strong>${nf(r.flowLps, 2)} L/s</strong></div>
          <div><span>Pérdida por fricción</span><strong>${nf(r.lossM, 2)} m (${Math.round(r.lossShare * 100)}%)</strong></div>
          <div><span>Presión neta</span><strong class="${r.ok ? 'good' : 'bad'}">${nf(r.netBar, 2)} bar</strong></div>
          <div><span>Velocidad</span><strong class="${r.fastFlow ? 'bad' : ''}">${nf(r.velocity, 2)} m/s</strong></div>
        </div>
        ${veredicto}
        ${r.fastFlow ? '<p class="aviso aviso--atencion">Más de 1,5 m/s: golpe de ariete y desgaste. Sube de diámetro.</p>' : ''}
        <p class="hint">Diámetro mínimo que mantiene la presión y una velocidad sana:
          <strong>${sug.diameterMm} mm</strong>${sug.insufficient ? ' (aun así no alcanza: el límite es el desnivel, no la tubería)' : ''}.
          Cálculo por Hazen-Williams con C=${hyd.C_PE} (PE/PVC liso); no incluye pérdidas en filtros, válvulas ni codos.</p>`;
    };

    form.addEventListener('input', recompute);
    recompute();
  });
}

// ---------------------------------------------------------------------------
// Plantas (lista)
// ---------------------------------------------------------------------------

function renderPlants() {
  const q = ($('#plant-search')?.value || '').toLowerCase().trim();
  const rows = state.plants
    .filter(p => !q || [p.species, p.variety, p.notes, SPECIES[p.species]?.label]
      .some(v => v && v.toLowerCase().includes(q)))
    .sort((a, b) => (a.species + a.variety).localeCompare(b.species + b.variety));

  const counts = new Map();
  for (const p of state.plants) counts.set(p.species, (counts.get(p.species) || 0) + 1);

  $('#plants-list').innerHTML = `
    <div class="chips">
      ${[...counts].map(([sp, n]) =>
        `<span class="chip" style="border-color:${SPECIES[sp]?.color}">${SPECIES[sp]?.label || sp}: ${n}</span>`).join('')}
    </div>
    <div class="card card--filas">${rows.map(p => `
      <button class="list-row" data-plant="${p.id}">
        <span class="franja" style="background:${SPECIES[p.species]?.color}"></span>
        <span class="fila-main">
          <strong>${SPECIES[p.species]?.label || p.species}${p.variety ? ' · ' + escapeHtml(p.variety) : ''}</strong>
          <small>${state.sectors.find(s => s.id === p.sectorId)?.name || 'Sin sector'}${p.plantedAt ? ' · ' + ageLabel(p.plantedAt) : ''}</small>
        </span>
        <span class="badge" style="background:${STATUS_COLORS[p.status]};color:#fff">${p.status}</span>
      </button>`).join('')}</div>
    ${rows.length ? '' : '<p class="hint">Sin resultados.</p>'}
  `;
  $('#plants-list').querySelectorAll('[data-plant]').forEach(el =>
    el.addEventListener('click', () => openPlant(el.dataset.plant)));
}

// ---------------------------------------------------------------------------
// Tareas
// ---------------------------------------------------------------------------

/**
 * Cuándo toca una tarea, dicho como se piensa.
 *
 * «Para 22 sept 2026» obliga a restar mentalmente contra el calendario de hoy
 * cada vez. Lo que se quiere saber es si va tarde y cuánto, y eso es una resta
 * que la app puede hacer. La fecha exacta sigue estando, detrás.
 */
function cuando(iso) {
  const d = water.daysBetween(today(), iso);
  const atras = iso < today();
  const dd = water.daysBetween(iso, today());
  if (iso === today()) return { txt: 'hoy', tono: 'urgente' };
  if (atras) return { txt: dd === 1 ? 'atrasada 1 día' : `atrasada ${dd} días`, tono: 'atrasada' };
  if (d === 1) return { txt: 'mañana', tono: 'urgente' };
  if (d <= 7) return { txt: `en ${d} días`, tono: 'pronto' };
  return { txt: `en ${d} días`, tono: '' };
}

/* Los tres grupos son los tres momentos en que se decide algo distinto: lo que
   ya se pasó, lo de esta semana y lo que todavía no aprieta. Una sola lista
   ordenada por fecha obliga a leerla entera para encontrar lo urgente. */
const GRUPOS = [
  { id: 'atrasadas', titulo: 'Atrasadas', test: t => t.dueAt && t.dueAt < today() },
  { id: 'semana', titulo: 'Esta semana', test: t => t.dueAt && water.daysBetween(today(), t.dueAt) <= 7 },
  { id: 'despues', titulo: 'Más adelante', test: () => true }
];

function renderTasks() {
  const rows = state.tasks
    .filter(t => taskFilter === 'todas' || (taskFilter === 'hechas' ? t.doneAt : !t.doneAt))
    .sort((a, b) => (a.dueAt || a.doneAt || '').localeCompare(b.dueAt || b.doneAt || ''));

  const overdue = state.tasks.filter(t => !t.doneAt && t.dueAt && t.dueAt < today()).length;

  const fila = t => {
    const c = !t.doneAt && t.dueAt ? cuando(t.dueAt) : null;
    return `
      <div class="list-row ${c?.tono === 'atrasada' ? 'atrasada' : ''}">
        <input type="checkbox" class="chk" data-done="${t.id}" ${t.doneAt ? 'checked' : ''} />
        <button class="fila-main" data-task="${t.id}">
          <strong>${cap(t.type)} · ${escapeHtml(targetName(t))}</strong>
          <small>${t.doneAt
            ? 'Hecha ' + fmtDate(t.doneAt)
            : c
              ? `<b class="cuando cuando--${c.tono}">${c.txt}</b> <span class="muted">· ${fmtDate(t.dueAt)}</span>`
              : 'Sin fecha'}${t.quantity ? ` · ${t.quantity} ${escapeHtml(t.unit || '')}` : ''}</small>
          ${t.notes ? `<small class="muted">${escapeHtml(t.notes)}</small>` : ''}
        </button>
      </div>`;
  };

  // Agrupar sólo tiene sentido en la lista de pendientes: las hechas se leen
  // por fecha y «atrasada» ya no significa nada para ellas.
  let cuerpo;
  const agrupado = taskFilter === 'pendientes' && rows.length;
  if (agrupado) {
    const resto = [...rows];
    cuerpo = GRUPOS.map(g => {
      const suyas = [];
      for (let i = resto.length - 1; i >= 0; i--) {
        if (g.test(resto[i])) suyas.unshift(...resto.splice(i, 1));
      }
      if (!suyas.length) return '';
      return `<section class="col-tareas">
        <h4 class="grupo-tareas">${g.titulo} <span>${suyas.length}</span></h4>
        <div class="card card--filas">${suyas.map(fila).join('')}</div>
      </section>`;
    }).join('');
  } else {
    cuerpo = `<div class="card card--filas">${rows.map(fila).join('')}</div>`;
  }

  $('#tasks-list').innerHTML = `
    ${/* Con grupos, el título «Atrasadas · 1» ya lo dice: la cinta sería la
          misma frase dos veces seguidas. */
      overdue && taskFilter !== 'hechas' && !agrupado
      ? `<p class="aviso aviso--atencion">${overdue} tarea${overdue > 1 ? 's' : ''} atrasada${overdue > 1 ? 's' : ''}.</p>`
      : ''}
    ${cuerpo}
    ${rows.length ? '' : '<p class="hint">Nada por aquí.</p>'}
  `;
  $('#tasks-list').querySelectorAll('[data-done]').forEach(el => el.addEventListener('change', async () => {
    const t = state.tasks.find(x => x.id === el.dataset.done);
    await persist('tasks', { ...t, doneAt: el.checked ? today() : undefined });
    toast(el.checked ? 'Tarea completada' : 'Tarea reabierta');
  }));
  $('#tasks-list').querySelectorAll('[data-task]').forEach(el =>
    el.addEventListener('click', () => openTaskForm(state.tasks.find(x => x.id === el.dataset.task))));
}

function openTaskForm(t = {}) {
  const targets = [
    { type: 'parcel', id: state.parcel.id, label: 'Toda la finca' },
    ...state.sectors.map(s => ({ type: 'sector', id: s.id, label: 'Sector: ' + s.name })),
    ...state.plants.map(p => ({
      type: 'plant', id: p.id,
      label: `Planta: ${SPECIES[p.species]?.label || p.species}${p.variety ? ' ' + p.variety : ''} (${p.id.slice(-4)})`
    }))
  ];
  const current = t.targetId ? `${t.targetType}:${t.targetId}` : 'parcel:' + state.parcel.id;

  openSheet(t.id ? 'Editar tarea' : 'Nueva tarea', `
    <form id="f">
      <label>Tipo
        <select name="type">${TASK_TYPES.map(x =>
          `<option value="${x}" ${t.type === x ? 'selected' : ''}>${cap(x)}</option>`).join('')}</select>
      </label>
      <label>Aplica a
        <select name="target">${targets.map(x =>
          `<option value="${x.type}:${x.id}" ${current === x.type + ':' + x.id ? 'selected' : ''}>${escapeHtml(x.label)}</option>`).join('')}</select>
      </label>
      <label>Fecha prevista <input type="date" name="dueAt" value="${attr(t.dueAt)}" /></label>
      <label>Fecha realizada <input type="date" name="doneAt" value="${attr(t.doneAt)}" /></label>
      <div class="field-grid-2">
        <label>Cantidad <input type="number" step="0.01" name="quantity" value="${attr(t.quantity)}" /></label>
        <label>Unidad <input name="unit" value="${attr(t.unit)}" placeholder="kg, L, sacos" /></label>
      </div>
      <label>Notas <textarea name="notes" rows="3">${escapeHtml(t.notes || '')}</textarea></label>
      <button class="btn btn--rojo btn-block" type="submit">Guardar</button>
      ${t.id ? '<button class="btn btn-danger" type="button" data-act="del">Eliminar</button>' : ''}
    </form>
  `, body => {
    body.querySelector('#f').onsubmit = async ev => {
      ev.preventDefault();
      const f = new FormData(ev.target);
      const [targetType, targetId] = f.get('target').split(':');
      await persist('tasks', {
        ...t,
        type: f.get('type'),
        targetType, targetId,
        dueAt: f.get('dueAt') || undefined,
        doneAt: f.get('doneAt') || undefined,
        quantity: f.get('quantity') ? Number(f.get('quantity')) : undefined,
        unit: f.get('unit') || undefined,
        notes: f.get('notes') || undefined
      });
      closeSheet();
      toast('Tarea guardada');
    };
    body.querySelector('[data-act="del"]')?.addEventListener('click', async () => {
      if (!confirm('¿Eliminar la tarea?')) return;
      await db.remove('tasks', t.id);
      await reload(); renderAll(); closeSheet();
    });
  });
}

/**
 * Parte de trabajo en texto plano para mandar por WhatsApp a quien está en la
 * finca. El dueño maneja a distancia: la app tiene que servir para dar
 * instrucciones, no sólo para registrar.
 */
function buildPlan() {
  const pendientes = state.tasks
    .filter(t => !t.doneAt)
    .sort((a, b) => (a.dueAt || '9999').localeCompare(b.dueAt || '9999'));

  const lineas = [`FINCA MULALILLO — plan de trabajo`, fmtDate(today()), ''];

  if (!pendientes.length) {
    lineas.push('No hay tareas pendientes.');
  } else {
    const atrasadas = pendientes.filter(t => t.dueAt && t.dueAt < today());
    const resto = pendientes.filter(t => !atrasadas.includes(t));

    const escribir = (titulo, lista) => {
      if (!lista.length) return;
      lineas.push(titulo);
      for (const t of lista) {
        const cuando = t.dueAt ? fmtDate(t.dueAt) : 'sin fecha';
        lineas.push(`• ${cap(t.type)} — ${targetName(t)} (${cuando})`);
        if (t.quantity) lineas.push(`  cantidad: ${t.quantity} ${t.unit || ''}`.trimEnd());
        if (t.notes) lineas.push(`  ${t.notes}`);
      }
      lineas.push('');
    };

    escribir(`ATRASADAS (${atrasadas.length})`, atrasadas);
    escribir(`PRÓXIMAS (${resto.length})`, resto);
  }

  const w = water.summary({ ...state, clima: state.clima, sensores: resumenSensores() });
  lineas.push('AGUA');
  lineas.push(`• Reservorio estimado: ${nf(w.volume.volumeM3)} m³ de ${nf(state.config.reservorioVolumenM3 || 0, 0)} m³`);
  lineas.push(`• Alcanza para: ${w.proyeccion.diasHastaVacio != null
    ? nf(w.proyeccion.diasHastaVacio, 0) + ' días'
    : 'más de ' + w.proyeccion.alMenosDias + ' días'}`);
  // Quien está en la finca riega o no riega según esto, así que va el motivo,
  // no sólo el veredicto: "no riegues el lunes" sin decir que llueve no se
  // obedece igual.
  if (w.clima.conocido) {
    lineas.push(`• Clima: hoy evapora ${nf(w.clima.et0Hoy, 1)} mm` +
      (w.clima.lluviaHoy > 0.5 ? ` y llueve ${nf(w.clima.lluviaHoy, 1)} mm` : ', sin lluvia') +
      `. Pronóstico de 7 días: ${nf(w.clima.lluviaFutura, 0)} mm de lluvia.`);
  }
  if (w.turns[0]) {
    lineas.push(`• Próximo turno de la junta: ${fmtDate(w.turns[0].date)} (en ${w.turns[0].inDays} días)`);
  }
  if (!w.llegaAlTurno && w.turns[0]) {
    lineas.push(`• ATENCIÓN: con el pronóstico de esta semana el agua NO llega al turno. Faltarían ${nf(w.deficitM3)} m³.`);
  }

  const atencion = state.plants.filter(p => p.status === 'atención' || p.status === 'enfermo');
  if (atencion.length) {
    lineas.push('', `PLANTAS A REVISAR (${atencion.length})`);
    for (const p of atencion.slice(0, 20)) {
      const sector = state.sectors.find(s => s.id === p.sectorId)?.name || 'sin sector';
      lineas.push(`• ${SPECIES[p.species]?.label || p.species} en ${sector} — ${p.status}${p.notes ? ': ' + p.notes : ''}`);
    }
    if (atencion.length > 20) lineas.push(`• …y ${atencion.length - 20} más`);
  }

  return lineas.join('\n');
}

async function sharePlan() {
  const texto = buildPlan();
  try {
    if (navigator.share) {
      await navigator.share({ title: 'Plan de trabajo — Finca Mulalillo', text: texto });
      return;
    }
    await navigator.clipboard.writeText(texto);
    toast('Plan copiado al portapapeles', 3500);
  } catch (err) {
    if (err?.name === 'AbortError') return;   // el usuario cerró el diálogo de compartir
    openSheet('Plan de trabajo', `
      <p class="hint">Copia este texto y mándalo por WhatsApp.</p>
      <textarea id="plan-text" rows="16" readonly></textarea>`,
      body => { body.querySelector('#plan-text').value = texto; });
  }
}

function targetName(t) {
  if (t.targetType === 'parcel') return 'toda la finca';
  if (t.targetType === 'sector') return state.sectors.find(s => s.id === t.targetId)?.name || 'sector';
  const p = state.plants.find(p => p.id === t.targetId);
  return p ? (SPECIES[p.species]?.label || p.species) + (p.variety ? ' ' + p.variety : '') : 'planta';
}

function taskLine(t) {
  return `<li><span class="punto punto--${t.doneAt ? 'hecha' : 'pendiente'}"></span>
    ${cap(t.type)} — ${t.doneAt ? fmtDate(t.doneAt) : t.dueAt ? 'para ' + fmtDate(t.dueAt) : 'sin fecha'}
    ${t.notes ? `<em>${escapeHtml(t.notes)}</em>` : ''}</li>`;
}

// ---------------------------------------------------------------------------
// Agua
// ---------------------------------------------------------------------------

/**
 * De dónde sale la demanda de hoy. Sin esto el número de arriba cambia solo de
 * un día para otro y parece un error de la app; con esto se lee la causa.
 *
 * Cuando no hay clima bajado lo dice con todas las letras en vez de callarse:
 * un cálculo con supuestos disfrazado de medición es peor que ningún cálculo.
 */
/** El día de hoy según el clima bajado. Sin clima, el de referencia. */
function diaDeHoy() {
  const sen = resumenSensores();
  const c = clima.contexto(state.clima, {
    reservaMax: state.config.reservaSueloMm ?? clima.RESERVA_SUELO_MM,
    lluviaLocal: sen?.lluviaPorDia || null,
    reservaMedida: sen?.reserva?.mm ?? null
  });
  return { et0: c.et0Hoy, lluvia: c.lluviaHoy, reservaMm: c.reservaMm, sectors: state.sectors };
}

/** La barra de agua en el suelo, con de dónde sale el número. */
function bloqueReserva(c) {
  return `<div class="reserva">
      <span>Agua guardada en el suelo${c.reservaOrigen === 'sonda' ? ' · <b>medida por la sonda</b>' : ' · estimada'}</span>
      <div class="result-bar agua"><span style="width:${Math.min(100, (c.reservaMm / c.reservaMaxMm) * 100).toFixed(0)}%"></span></div>
      <small>${nf(c.reservaMm, 0)} de ${c.reservaMaxMm} mm · ${
        c.reservaMm >= c.reservaMaxMm * 0.8 ? 'el suelo está cargado, hoy no hace falta regar'
        : c.reservaMm > 3 ? 'todavía hay reserva, se puede estirar un día o dos'
        : 'el suelo está seco: lo que pidan las plantas sale del reservorio'}</small>
    </div>`;
}

function renderClimaAgua(s) {
  const c = s.clima;
  const d = s.demand;

  if (!c.conocido) {
    return `<div class="card">
      ${c.reservaOrigen === 'sonda' ? bloqueReserva(c) : ''}
      <p class="hint">Demanda calculada con el clima de referencia de la zona
      (ET0 ${clima.ET0_REF} mm/día, sin lluvia): todavía no se ha podido bajar el clima
      real de este punto.</p>
      <p class="pie-accion"><button class="btn btn--fantasma btn--sm" data-act="clima">Intentar ahora</button></p>
    </div>`;
  }

  const ref = d.totalRefL / 1000;
  const delta = ref > 0 ? Math.round((d.totalM3 / ref - 1) * 100) : 0;
  const lluviaHoy = c.lluviaHoy || 0;

  return `<div class="card">
    <div class="datos datos--fila">
      <div><span>Evapora hoy</span><strong>${nf(c.et0Hoy, 1)} mm</strong></div>
      <div><span>Llueve hoy</span><strong>${nf(lluviaHoy, 1)} mm</strong></div>
      <div><span>Lluvia 7 d</span><strong>${nf(c.lluviaFutura, 0)} mm</strong></div>
    </div>

    ${bloqueReserva(c)}

    <p class="hint">${
      d.totalL === 0
        ? 'Hoy la demanda es cero: entre la lluvia y lo que guarda el suelo está cubierta.'
        : Math.abs(delta) < 8
          ? 'La demanda de hoy está en lo normal de la zona.'
          : delta < 0
            ? `Hoy se pide <b>${Math.abs(delta)} % menos</b> que en un día normal de la zona, ${
                lluviaHoy > 2 ? 'porque está lloviendo'
                : c.reservaMm > 3 ? 'porque el suelo todavía tiene reserva'
                : 'porque evapora menos'}.`
            : `Hoy se pide <b>${delta} % más</b> que en un día normal: evapora más de lo habitual.`
    } ${c.diasPasados ? `En los últimos ${c.diasPasados} días llovieron ${nf(c.lluviaPasada, 0)} mm, de los que aprovechó la planta unos ${nf(c.lluviaEfectivaPasada, 0)} mm.` : ''}</p>
    <p class="pie-accion hint muted">
      <span>Open-Meteo · ${c.horas < 1 ? 'recién bajado' : 'hace ' + Math.round(c.horas) + ' h'}</span>
      <button class="btn btn--fantasma btn--sm" data-act="clima">Actualizar</button></p>
  </div>`;
}

function renderWater() {
  const s = water.summary({ ...state, clima: state.clima, sensores: resumenSensores() });
  const days = Number.isFinite(s.autonomyDays) ? s.autonomyDays : null;
  const capacityM3 = state.config.reservorioVolumenM3 || 0;
  const pct = capacityM3 ? Math.min(100, (s.volume.volumeM3 / capacityM3) * 100) : 0;
  const low = Math.min(...measuredPoints().map(p => p.elevationM));
  const high = Math.max(...measuredPoints().map(p => p.elevationM));

  $('#water-body').innerHTML = `
    ${!s.llegaAlTurno && s.turns[0]
      ? `<p class="aviso aviso--atencion">⚠︎ Con el pronóstico de esta semana el agua no llega al turno del ${fmtDate(s.turns[0].date)} (en ${s.turns[0].inDays} d): faltarían ${nf(s.deficitM3)} m³.</p>`
      : s.alert
        ? `<p class="aviso aviso--atencion">⚠︎ Quedan menos de ${s.alertDays} días de agua.</p>`
        : ''}

    <div class="card card--medidor">
      <div class="result-bar agua"><span style="width:${pct.toFixed(1)}%"></span></div>
      <div class="gauge-legend">
        <strong>${nf(s.volume.volumeM3)} m³</strong> de ${nf(capacityM3, 0)} m³
        <small>${s.volume.source === 'sensor del reservorio' && s.volume.medidoA
          // Del sensor sale una hora exacta: decir "estimado desde el 1 oct"
          // de una lectura de hace cinco minutos esconde lo único que importa,
          // que el dato es fresco.
          ? `medido por el sensor ${haceTexto((Date.now() - new Date(s.volume.medidoA)) / 3600000)}${
              s.volume.sinceDays ? `, descontando ${s.volume.sinceDays} d de consumo` : ''}`
          : `estimado desde ${s.volume.source}${s.volume.anchorDate ? ' del ' + fmtDate(s.volume.anchorDate) : ''}${s.volume.sinceDays ? ` (hace ${s.volume.sinceDays} d)` : ''}`}</small>
      </div>
    </div>

    <div class="card datos">
      <div><span>Demanda de hoy</span><strong>${nf(s.dailyM3, 2)} m³/día</strong></div>
      <div><span>Alcanza para</span><strong class="${s.alert ? 'bad' : 'good'}">${
        s.proyeccion.diasHastaVacio != null
          ? nf(s.proyeccion.diasHastaVacio, 0) + ' días'
          : 'más de ' + s.proyeccion.alMenosDias + ' días'}</strong></div>
      <div><span>Desnivel</span><strong>${nf(high - low)} m · ${nf(staticPressureBar(high - low), 2)} bar</strong></div>
    </div>

    ${renderProyeccion(s)}

    ${renderClimaAgua(s)}

    ${renderSensoresAgua()}

    ${renderComparacion(s)}


    <section class="bloque">
      <h4>Turno de la junta de agua</h4>
      <p class="hint">5 horas cada ${state.config.cicloTurnoDias || 15} días.</p>
      <ul class="mini-list">
        ${s.turns.map(t => `<li><span class="punto punto--agua"></span>${fmtDate(t.date)}<b>${t.inDays === 0 ? 'hoy' : 'en ' + t.inDays + ' d'}</b></li>`).join('')}
      </ul>
    </section>

    <section class="bloque">
    <h4>Demanda por sector</h4>
    <p class="hint">Calculada sobre las ${state.plants.length} plantas registradas. Al sembrar los arándanos y aguacates nuevos, súbelos a la app para que la autonomía refleje la demanda real.</p>
    <ul class="mini-list">
      ${s.demand.bySector.map(x => `<li>${escapeHtml(x.name)}<b>${Math.round(x.litres)} L/día</b></li>`).join('') || '<li>Sin plantas registradas</li>'}
    </ul>

    ${s.demand.totalAdultoL > s.demand.totalRefL * 1.08 ? `
      <p class="hint">Las plantas jóvenes todavía no beben como adultas: hoy la finca pide
      ${nf(s.demand.totalRefL / 1000, 2)} m³ en un día normal, y cuando todas estén crecidas pedirá
      <b>${nf(s.demand.totalAdultoL / 1000, 2)} m³</b>. Vale la pena mirar ese número antes de sembrar más.</p>` : ''}

    <h4>Demanda por especie</h4>
    <ul class="mini-list">
      ${s.demand.bySpecies.map(x => `<li><span class="punto" style="background:${SPECIES[x.species]?.color}"></span>${escapeHtml(x.label)}<b>${Math.round(x.litres)} L/día</b></li>`).join('') || '<li>—</li>'}
    </ul>
    </section>

    <section class="bloque bloque--ancho">
    <h4>Eventos registrados</h4>
    ${(() => {
      const niveles = state.water.filter(w => w.origen === 'sensor' && w.type === 'medición_nivel');
      const riegos = state.water.filter(w => w.origen === 'sensor' && w.type === 'riego');
      if (!niveles.length && !riegos.length) return '';
      const ult = [...niveles].sort(byDateDesc)[0];
      const partes = [];
      if (niveles.length) partes.push(`<b>${niveles.length} niveles del sensor</b> (el último, ${fmtDate(ult.date)}: ${nf(ult.levelM, 2)} m)`);
      if (riegos.length) partes.push(`<b>${riegos.length} riegos del caudalímetro</b> (${nf(riegos.reduce((s, r) => s + r.volumeM3, 0), 2)} m³)`);
      return `<p class="hint">Además, ${partes.join(' y ')}. No se listan: son uno por día y
        taparían lo anotado a mano.</p>`;
    })()}
    <div class="card card--filas">${[...state.water].filter(w => w.origen !== 'sensor').sort(byDateDesc).map(e => `
      <button class="list-row" data-water="${e.id}">
        <span class="franja franja--${e.type === 'tanquero' ? 'tanquero' : 'agua'}"></span>
        <span class="fila-main">
          <strong>${cap2(e.type)}</strong>
          <small>${fmtDate(e.date)}${e.volumeM3 != null ? ` · ${e.volumeM3} m³` : ''}${e.levelM != null ? ` · nivel ${e.levelM} m` : ''}</small>
          ${e.notes ? `<small class="muted">${escapeHtml(e.notes)}</small>` : ''}
        </span>
        <span class="fila-go"><svg class="icono icono--s" aria-hidden="true"><use href="#i-chevron-der"/></svg></span>
      </button>`).join('')}</div>
    ${state.water.some(w => w.origen !== 'sensor') ? '' : '<p class="hint">Sin eventos anotados a mano.</p>'}
    </section>
  `;
  $('#water-body').querySelectorAll('[data-water]').forEach(el =>
    el.addEventListener('click', () => openWaterForm(state.water.find(w => w.id === el.dataset.water))));
  $('#water-body').querySelectorAll('[data-act="sensores"]').forEach(el =>
    el.addEventListener('click', openSensores));
  $('#water-body').querySelectorAll('[data-act="clima"]').forEach(el =>
    el.addEventListener('click', async () => {
      el.disabled = true; el.textContent = 'Bajando…';
      const ok = await refrescarClima({ forzar: true });
      toast(ok ? 'Clima actualizado' : 'Sin señal: se sigue con lo guardado');
      if (!ok) renderWater();
    }));
}

function openWaterForm(e = {}) {
  openSheet(e.id ? 'Evento de agua' : 'Registrar evento', `
    <form id="f">
      <label>Tipo
        <select name="type">${WATER_TYPES.map(t =>
          `<option value="${t}" ${e.type === t ? 'selected' : ''}>${cap2(t)}</option>`).join('')}</select>
      </label>
      <label>Fecha <input type="date" name="date" value="${attr(e.date || today())}" required /></label>
      <label>Volumen (m³) <input type="number" step="0.1" name="volumeM3" value="${attr(e.volumeM3)}" /></label>
      <label>Nivel medido en el reservorio (m) <input type="number" step="0.01" name="levelM" value="${attr(e.levelM)}" /></label>
      <label>Notas <textarea name="notes" rows="2">${escapeHtml(e.notes || '')}</textarea></label>
      <button class="btn btn--rojo btn-block" type="submit">Guardar</button>
      ${e.id ? '<button class="btn btn-danger" type="button" data-act="del">Eliminar</button>' : ''}
    </form>
  `, body => {
    body.querySelector('#f').onsubmit = async ev => {
      ev.preventDefault();
      const f = new FormData(ev.target);
      await persist('water', {
        ...e,
        type: f.get('type'),
        date: f.get('date'),
        volumeM3: f.get('volumeM3') ? Number(f.get('volumeM3')) : undefined,
        levelM: f.get('levelM') ? Number(f.get('levelM')) : undefined,
        notes: f.get('notes') || undefined
      });
      closeSheet();
      toast('Evento guardado');
    };
    body.querySelector('[data-act="del"]')?.addEventListener('click', async () => {
      if (!confirm('¿Eliminar el evento?')) return;
      await db.remove('water', e.id);
      await reload(); renderAll(); closeSheet();
    });
  });
}

// ---------------------------------------------------------------------------
// Vista 3D
// ---------------------------------------------------------------------------

async function init3D() {
  if (terrain) { terrain.resize(); return; }
  const container = document.getElementById('three');
  container.innerHTML = '<p class="hint pad">Cargando terreno…</p>';
  try {
    const { Terrain3D } = await import('./view3d.js');
    container.innerHTML = '';
    terrain = new Terrain3D(container);
    const exag = state.config.exageracion3D || 3;
    $('#range-exag').value = exag;
    $('#out-exag').textContent = exag + '×';
    terrain.setExaggeration(exag);
    terrain.setColorBy($('#sel-colorby').value);
    terrain.render(state);
    terrain.resize();
    medirOclusion3D();
    renderThreeHint();
  } catch (err) {
    container.innerHTML = `
      <div class="aviso aviso--atencion pad">
        <p><strong>No se pudo cargar la vista 3D.</strong></p>
        <p>Si ya la abriste antes, casi siempre es un archivo viejo guardado en el
        teléfono. Entra en Ajustes ⚙︎ → <strong>«Reinstalar la app»</strong>: borra lo
        guardado y vuelve a bajar todo limpio. Tus datos no se tocan.</p>
        <p><small>Detalle técnico: ${escapeHtml(String(err.message || err))}</small></p>
        <button class="btn btn--rojo btn-block" id="btn-retry-3d">Reintentar</button>
        <p class="hint">¿Sigue fallando? Abre el <a href="./diagnostico.html">diagnóstico</a>.</p>
      </div>`;
    container.querySelector('#btn-retry-3d').onclick = () => { terrain = null; init3D(); };
  }
}

/** Le dice al relieve cuánto lienzo le tapa el panel de controles. */
function medirOclusion3D() {
  if (!terrain) return;
  const panel = $('#three-controls');
  const lienzo = $('#three');
  if (!panel || !lienzo || !lienzo.clientHeight) return;
  const tapado = panel.getBoundingClientRect().height + 28;
  terrain.setOclusion(tapado / lienzo.clientHeight);
}

function renderThreeHint() {
  const pts = measuredPoints();
  const low = Math.min(...pts.map(p => p.elevationM));
  const high = Math.max(...pts.map(p => p.elevationM));
  const pendingGps = pts.filter(p => !p.measured).length;
  $('#three-hint').innerHTML = `
    Desnivel ${nf(high - low)} m entre ${nf(low, 2)} y ${nf(high, 2)} msnm ·
    ${nf(staticPressureBar(high - low), 2)} bar de presión estática en el punto bajo.
    Terreno interpolado desde ${pts.length} puntos${pendingGps ? ` (${pendingGps} con coordenada estimada)` : ''}.
    Las flechas indican hacia dónde corre el agua por gravedad.
  `;
}

// ---------------------------------------------------------------------------
// Ajustes, respaldo y sincronización
// ---------------------------------------------------------------------------

function openSettings() {
  const c = state.config;
  openSheet('Ajustes', `
    <form id="f">
      <h4>Reservorio</h4>
      <div class="field-grid-2">
        <label>Capacidad (m³) <input type="number" step="0.1" name="reservorioVolumenM3" value="${attr(c.reservorioVolumenM3)}" /></label>
        <label>Altura útil (m) <input type="number" step="0.01" name="reservorioAlturaUtilM" value="${attr(c.reservorioAlturaUtilM)}" /></label>
      </div>
      <h4>Agua</h4>
      <label>Demanda diaria manual (m³/día) <input type="number" step="0.01" name="demandaDiariaM3" value="${attr(c.demandaDiariaM3)}" placeholder="vacío = calculada desde las plantas" /></label>
      <label>Alertar bajo (días de autonomía) <input type="number" name="alertaAutonomiaDias" value="${attr(c.alertaAutonomiaDias)}" /></label>
      <label>Agua que retiene el suelo (mm)
        <input type="number" step="1" min="0" max="120" name="reservaSueloMm"
               value="${attr(c.reservaSueloMm ?? clima.RESERVA_SUELO_MM)}" />
      </label>
      <p class="hint">Cuánta lluvia guarda la zona de raíces para los días siguientes. Los
      ${clima.RESERVA_SUELO_MM} mm de partida son un valor razonable para el suelo volcánico de
      la zona, no una medición: un análisis de suelo o un tensiómetro lo afinan. Subirlo hace
      que la app cuente con más agua de la que quizá hay, así que conviene quedarse corto.</p>
      <div class="field-grid-2">
        <label>Próximo turno <input type="date" name="proximoTurno" value="${attr(c.proximoTurno)}" /></label>
        <label>Ciclo (días) <input type="number" name="cicloTurnoDias" value="${attr(c.cicloTurnoDias)}" /></label>
      </div>
      <h4>Sensores</h4>
      <p class="hint">${(state.config.sensores?.url) ? 'Conectados a un receptor.' : 'Sin conectar.'}
        <button class="btn btn--fantasma btn--sm" type="button" data-act="sensores">Abrir sensores</button></p>
      <h4>Sincronización</h4>
      <label>Endpoint de sincronización <input name="syncEndpoint" value="${attr(c.syncEndpoint)}" placeholder="https://…/sync" /></label>
      <p class="hint">Sin endpoint, los cambios quedan en la cola local y se pueden trasladar con el respaldo JSON.</p>
      <button class="btn btn--rojo btn-block" type="submit">Guardar ajustes</button>
    </form>
    <div class="sheet-actions">
      <button class="btn" data-act="export">Exportar respaldo</button>
      <button class="btn" data-act="import">Importar respaldo</button>
      <button class="btn" data-act="sync">Sincronizar ahora</button>
      <button class="btn" data-act="tiles">Descargar mapa del terreno</button>
      <button class="btn" data-act="reinstall">Reinstalar la app</button>
      <button class="btn" data-act="diag">Diagnóstico</button>
      <button class="btn btn-danger" data-act="reset">Restaurar datos medidos</button>
    </div>
    <p class="hint">Versión instalada: <strong>${BUILD}</strong>. «Reinstalar la app» borra
    el código y los mapas guardados y los vuelve a bajar; tus sectores, plantas, tareas y
    registros de agua no se tocan.</p>
    <input type="file" id="import-file" accept="application/json" hidden />
  `, body => {
    body.querySelector('#f').onsubmit = async ev => {
      ev.preventDefault();
      const f = new FormData(ev.target);
      const num = k => (f.get(k) === '' ? null : Number(f.get(k)));
      state.config = await db.saveConfig({
        reservorioVolumenM3: num('reservorioVolumenM3'),
        reservorioAlturaUtilM: num('reservorioAlturaUtilM'),
        demandaDiariaM3: num('demandaDiariaM3'),
        alertaAutonomiaDias: num('alertaAutonomiaDias'),
        reservaSueloMm: num('reservaSueloMm'),
        proximoTurno: f.get('proximoTurno') || null,
        cicloTurnoDias: num('cicloTurnoDias'),
        syncEndpoint: f.get('syncEndpoint') || ''
      });
      renderAll();
      toast('Ajustes guardados');
    };

    body.querySelector('[data-act="export"]').onclick = async () => {
      const dump = await db.exportAll();
      const url = URL.createObjectURL(new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `mulalillo-${today()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    };

    const file = body.querySelector('#import-file');
    body.querySelector('[data-act="import"]').onclick = () => file.click();
    file.onchange = async () => {
      if (!file.files[0]) return;
      try {
        const dump = JSON.parse(await file.files[0].text());
        await db.importAll(dump);
        await reload(); renderAll(); closeSheet();
        toast('Respaldo importado');
      } catch (err) { toast('No se pudo importar: ' + err.message); }
    };

    body.querySelector('[data-act="sync"]').onclick = async () => {
      try {
        const res = await db.flushOutbox(state.config.syncEndpoint);
        updateOutboxChip();
        toast(res.reason === 'sin-backend'
          ? `${res.pending} cambios en cola (sin endpoint configurado)`
          : `${res.sent} cambios sincronizados`);
      } catch (err) { toast('Sincronización fallida: ' + err.message); }
    };

    body.querySelector('[data-act="tiles"]').onclick = () => prefetchTiles();
    body.querySelector('[data-act="sensores"]').onclick = () => openSensores();
    body.querySelector('[data-act="diag"]').onclick = () => { location.href = './diagnostico.html'; };

    body.querySelector('[data-act="reinstall"]').onclick = async () => {
      if (!confirm('Se borra el código y los mapas guardados, y se vuelven a bajar.\n\nTus datos (sectores, plantas, tareas, agua) NO se borran. ¿Seguir?')) return;
      toast('Reinstalando…', 6000);
      try {
        const regs = await navigator.serviceWorker?.getRegistrations?.() || [];
        await Promise.all(regs.map(r => r.unregister()));
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      } catch (err) {
        console.warn('reinstalación parcial', err);
      }
      // Sin caché por medio: recarga saltándose lo guardado.
      location.replace(location.pathname + '?nuevo=' + Date.now());
    };

    body.querySelector('[data-act="reset"]').onclick = async () => {
      if (!confirm('Esto borra los datos locales y vuelve a sembrar los datos medidos en campo. ¿Seguir?')) return;
      for (const store of ['parcels', 'sectors', 'plants', 'infra', 'tasks', 'water', 'elevations', 'outbox', 'meta']) {
        await db.clearStore(store);
      }
      await db.seedIfEmpty();
      await reload(); renderAll(); closeSheet();
      toast('Datos restaurados');
    };
  });
}

async function updateOutboxChip() {
  const n = await db.outboxCount();
  const chip = $('#chip-outbox');
  chip.hidden = n === 0;
  chip.textContent = `${n} sin sincronizar`;
}

function watchConnectivity() {
  const paint = () => { $('#chip-offline').hidden = navigator.onLine; };
  addEventListener('online', () => { paint(); toast('Conexión recuperada'); });
  addEventListener('offline', paint);
  paint();
}

/**
 * Modo sin service worker: `?sw=off` lo da de baja y no lo vuelve a registrar.
 * Safari en iOS ha tenido fallos sirviendo módulos ES a través de un service
 * worker; si la app funciona así, el culpable es ese intermediario y no el código.
 */
function swDisabled() {
  const params = new URLSearchParams(location.search);
  if (params.get('sw') === 'off') {
    try { localStorage.setItem('mulalillo-sw', 'off'); } catch {}
    return true;
  }
  if (params.get('sw') === 'on') {
    try { localStorage.removeItem('mulalillo-sw'); } catch {}
    return false;
  }
  try { return localStorage.getItem('mulalillo-sw') === 'off'; } catch { return false; }
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  if (swDisabled()) {
    navigator.serviceWorker.getRegistrations?.()
      .then(rs => Promise.all(rs.map(r => r.unregister())))
      .then(() => { document.body.classList.add('sin-sw'); })
      .catch(() => {});
    return;
  }

  navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(() => {});
  navigator.serviceWorker.addEventListener('message', e => {
    if (e.data?.type === 'prefetch-done') {
      toast(`Mapa guardado: ${e.data.cached} de ${e.data.total} tiles`, 4000);
    }
  });
}

/**
 * Guarda los tiles satelitales del área de la finca para trabajar sin señal.
 * Zoom 15–19: suficiente para llegar al detalle de árbol individual.
 */
async function prefetchTiles() {
  const reg = await navigator.serviceWorker?.ready;
  if (!reg?.active) return toast('El modo sin conexión aún se está preparando.');
  const b = bbox(state.parcel.boundary);
  const urls = [];
  for (let z = 15; z <= 19; z++) {
    const [x0, y0] = tileXY(b.maxLat, b.minLng, z);
    const [x1, y1] = tileXY(b.minLat, b.maxLng, z);
    for (let x = x0 - 1; x <= x1 + 1; x++) {
      for (let y = y0 - 1; y <= y1 + 1; y++) {
        urls.push(`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`);
      }
    }
  }
  toast(`Descargando ${urls.length} tiles…`, 4000);
  reg.active.postMessage({ type: 'prefetch-tiles', urls });
}

function tileXY(lat, lng, z) {
  const n = 2 ** z;
  const latRad = (lat * Math.PI) / 180;
  return [
    Math.floor(((lng + 180) / 360) * n),
    Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n)
  ];
}

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

function renderFilterOptions() {
  const sp = $('#sel-filter-species');
  const sec = $('#sel-filter-sector');
  const used = [...new Set(state.plants.map(p => p.species))];
  sp.innerHTML = '<option value="all">Todas</option>' +
    used.map(s => `<option value="${s}">${SPECIES[s]?.label || s}</option>`).join('');
  sec.innerHTML = '<option value="all">Todos</option>' +
    state.sectors.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('');
}

async function readPhotos(files) {
  const out = [];
  for (const file of files) {
    if (!file || !file.size) continue;
    out.push(await downscale(file, 1024));
  }
  return out;
}

/** Reduce la foto antes de guardarla: el celular en el campo no debe llenar la base. */
function downscale(file, max) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(img.src);
      resolve(canvas.toDataURL('image/jpeg', 0.72));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function today() { return new Date().toISOString().slice(0, 10); }
function byDateDesc(a, b) { return (b.date || b.dueAt || b.doneAt || '').localeCompare(a.date || a.dueAt || a.doneAt || ''); }
function round(n, d) { return n == null ? n : Math.round(n * 10 ** d) / 10 ** d; }
/** Número con coma decimal, como se escribe en Ecuador. */
function nf(n, d = 1) {
  return Number(n).toLocaleString('es-EC', { minimumFractionDigits: d, maximumFractionDigits: d });
}
function cap(s) { return String(s).charAt(0).toUpperCase() + String(s).slice(1); }
function cap2(s) { return cap(String(s).replace(/_/g, ' ')); }
function attr(v) { return v == null ? '' : escapeHtml(String(v)); }
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''));
  return d.toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' });
}
function ageLabel(iso) {
  const months = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 2629800000));
  if (months < 12) return `${months} meses`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return `${years} año${years > 1 ? 's' : ''}${rest ? ` y ${rest} mes${rest > 1 ? 'es' : ''}` : ''}`;
}
function randomColor() {
  const palette = ['#2f9e44', '#4c6ef5', '#f08c00', '#862e9c', '#e8590c', '#0ca678', '#c2255c'];
  return palette[state.sectors.length % palette.length];
}

boot().catch(err => {
  document.body.insertAdjacentHTML('afterbegin',
    `<p class="aviso aviso--atencion pad">No se pudo iniciar la aplicación: ${escapeHtml(String(err.message || err))}</p>`);
  console.error(err);
});

// ---------------------------------------------------------------------------
// Proyección del reservorio
// ---------------------------------------------------------------------------

/**
 * La curva de 21 días que el módulo de agua ya calculaba y que no se veía por
 * ningún lado: se mostraba un solo número sacado de ella. Puesta en pantalla
 * responde de un vistazo lo que el número no puede —cuándo se vacía, si la
 * lluvia de la semana lo endereza, y si la línea cruza el fondo ANTES o
 * DESPUÉS del turno de la junta, que es la decisión.
 *
 * Una sola serie, un solo tono: el volumen del reservorio. La lluvia NO va en
 * un segundo eje —dos escalas en un gráfico inventan una correlación que no
 * está en los datos—; los días con lluvia se marcan con una gota sobre el eje,
 * que dice "este día llueve" sin fingir una magnitud comparable.
 *
 * Los 7 días pronosticados van en línea llena y el resto, que es sólo el
 * promedio proyectado hacia adelante, en línea punteada. La diferencia entre
 * lo que se sabe y lo que se supone tiene que verse.
 */
function renderProyeccion(s) {
  const curva = s.proyeccion?.curva;
  if (!curva?.length) return '';
  const capacidad = state.config.reservorioVolumenM3 || 0;
  if (!capacidad) return '';

  const W = 320, H = 108, PL = 6, PR = 6, PT = 8, PB = 26;
  const n = curva.length;
  /* El eje llega hasta la CAPACIDAD del reservorio, no hasta el volumen de hoy.
     Escalar al volumen actual dibuja igual de lleno un reservorio al 20 % que
     uno al 90 %, y el hueco que queda arriba es justo la información que se
     necesita para decidir si conviene pedir tanquero. */
  const maxY = Math.max(capacidad, s.volume.volumeM3);
  const x = i => PL + (i / (n - 1)) * (W - PL - PR);
  const y = v => PT + (1 - v / maxY) * (H - PT - PB);

  // El punto de partida es hoy, antes de gastar: por eso va delante de la curva.
  const pts = [{ volumeM3: s.volume.volumeM3, pronosticado: true, lluvia: 0 }, ...curva];
  const px = i => PL + (i / pts.length) * (W - PL - PR);
  const linea = tramo => tramo.map(([i, p]) => `${px(i).toFixed(1)},${y(p.volumeM3).toFixed(1)}`).join(' ');

  const idx = pts.map((p, i) => [i, p]);
  const corte = pts.findIndex(p => !p.pronosticado);
  const firmes = corte < 0 ? idx : idx.slice(0, corte + 1);
  const supuestos = corte < 0 ? [] : idx.slice(corte - 1 < 0 ? 0 : corte - 1);

  const area = `${linea(firmes)} ${px(firmes.length - 1).toFixed(1)},${y(0).toFixed(1)} ${px(0).toFixed(1)},${y(0).toFixed(1)}`;

  const turno = s.turns[0];
  const xTurno = turno && turno.inDays <= n ? px(turno.inDays) : null;
  const vacio = s.proyeccion.diasHastaVacio;

  return `
    <div class="card proyeccion">
      <div class="proy-head">
        <strong>Cómo baja el reservorio</strong>
        <small>${vacio != null
          ? `se vacía en ${vacio} ${vacio === 1 ? 'día' : 'días'}`
          : `aguanta los ${n} días proyectados`}</small>
      </div>
      <svg viewBox="0 0 ${W} ${H}" class="proy-svg" role="img"
           aria-label="Volumen del reservorio proyectado a ${n} días${turno ? `, con el turno de la junta en ${turno.inDays} días` : ''}.">
        <line x1="${PL}" y1="${y(0)}" x2="${W - PR}" y2="${y(0)}" class="proy-eje" />
        ${/* El rótulo va BAJO el eje: arriba se montaba sobre la curva justo
              cuando el reservorio está lleno, que es cuando más plana va. */
          xTurno != null ? `
          <line x1="${xTurno.toFixed(1)}" y1="${PT}" x2="${xTurno.toFixed(1)}" y2="${y(0)}" class="proy-turno" />
          <text x="${Math.min(Math.max(xTurno, 16), W - 16).toFixed(1)}" y="${(y(0) + 19).toFixed(1)}"
                class="proy-turno-txt" text-anchor="middle">turno · ${turno.inDays} d</text>` : ''}
        ${/* Si se vacía antes del turno, los días sin agua son el déficit del
              aviso, dibujado: lo que hay que traer en tanquero. */
          vacio != null && xTurno != null && px(vacio) < xTurno ? `
          <rect x="${px(vacio).toFixed(1)}" y="${PT}" width="${(xTurno - px(vacio)).toFixed(1)}"
                height="${(y(0) - PT).toFixed(1)}" class="proy-hueco" />
          <text x="${((px(vacio) + xTurno) / 2).toFixed(1)}" y="${(y(0) - 5).toFixed(1)}"
                class="proy-hueco-txt" text-anchor="middle">sin agua</text>` : ''}
        <polygon points="${area}" class="proy-area" />
        <polyline points="${linea(firmes)}" class="proy-linea" />
        ${supuestos.length > 1 ? `<polyline points="${linea(supuestos)}" class="proy-linea proy-linea--supuesta" />` : ''}
        ${/* Sólo los días PRONOSTICADOS llevan gota. Los siguientes cargan la
              lluvia media, y marcarlos haría creer que está pronosticado que
              llueva veintiún días seguidos. */
          pts.map((p, i) => p.pronosticado && p.lluvia > 2
          ? `<circle cx="${px(i).toFixed(1)}" cy="${(y(0) + 6).toFixed(1)}" r="2.4" class="proy-gota" />` : '').join('')}
        <circle cx="${px(0).toFixed(1)}" cy="${y(pts[0].volumeM3).toFixed(1)}" r="4" class="proy-hoy" />
      </svg>
      <div class="proy-pie">
        <span><i class="proy-k proy-k--firme"></i>7 días pronosticados</span>
        <span><i class="proy-k proy-k--supuesta"></i>después, promedio</span>
        ${pts.some(p => p.lluvia > 2) ? '<span><i class="proy-k proy-k--gota"></i>días con lluvia</span>' : ''}
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Sensores
// ---------------------------------------------------------------------------

function haceTexto(h) {
  if (h < 1 / 60) return 'ahora';
  if (h < 1) return `hace ${Math.round(h * 60)} min`;
  if (h < 48) return `hace ${Math.round(h)} h`;
  return `hace ${Math.round(h / 24)} días`;
}

/**
 * La pantalla de sensores. Está pensada para el día que llegue el primer
 * aparato: se pega la dirección del receptor, se prueba, y el sensor aparece
 * solo en la lista en cuanto manda su primer mensaje. Ahí se le dice para qué
 * está —reservorio, suelo, lluvia— y, si es un ultrasónico, a qué altura del
 * fondo se montó. Nada más: lo demás lo resuelve el modelo.
 */
function openSensores() {
  const cfg = cfgSensores();
  const sen = resumenSensores();
  const aparatos = sen?.aparatos || [];
  const hayPrueba = state.lecturas.some(l => l.fuente === 'prueba');

  openSheet('Sensores', `
    <form id="f-sen">
      <p class="hint">Los sensores no hablan con la app: mandan sus lecturas a un
      <b>receptor</b> (un servidor pequeño), y la app las lee de ahí. Cómo montarlo, qué
      comprar y cómo registrar cada aparato está en <code>mulalillo/SENSORES.md</code>.</p>

      <label>Dirección del receptor
        <input name="url" type="url" value="${attr(cfg.url)}" placeholder="https://mulalillo-receptor.tu-cuenta.workers.dev" />
      </label>
      <label>Token de lectura
        <input name="token" type="password" value="${attr(cfg.token)}" autocomplete="off" placeholder="el TOKEN_LECTURA del receptor" />
      </label>
      <p class="hint">Es el de <b>lectura</b>, no el de escritura: si este teléfono se pierde,
      quien lo tenga podrá ver el nivel del reservorio, pero no inventar lecturas.</p>

      <div class="pie-accion">
        <span class="hint muted">${cfg.ultimoError
          ? `Último intento: ${escapeHtml(cfg.ultimoError)}`
          : cfg.ultimaSync ? `Al día ${haceTexto((Date.now() - new Date(cfg.ultimaSync)) / 3600000)}` : 'Sin conectar todavía'}</span>
        <span>
          <button class="btn btn--fantasma btn--sm" type="button" data-act="probar">Probar</button>
          <button class="btn btn--rojo btn--sm" type="submit">Guardar</button>
        </span>
      </div>
    </form>

    <h4>Aparatos</h4>
    ${aparatos.length ? `<div class="card card--filas">${aparatos.map(a => filaAparato(a, cfg)).join('')}</div>`
      : `<p class="hint">Todavía no ha llegado nada. Un sensor aparece aquí en cuanto manda su
         primer mensaje al receptor, aunque no esté configurado.</p>`}

    <h4>Suelo</h4>
    <div class="field-grid-2">
      <label>Capacidad de campo (%) <input form="f-sen" name="sueloCC" type="number" step="0.5" value="${attr(cfg.sueloCC ?? sensores.SUELO_CC)}" /></label>
      <label>Punto de marchitez (%) <input form="f-sen" name="sueloPMP" type="number" step="0.5" value="${attr(cfg.sueloPMP ?? sensores.SUELO_PMP)}" /></label>
    </div>
    <p class="hint">Convierten la humedad que mide la sonda en agua aprovechable. Los de partida
    son típicos de un suelo volcánico de la sierra, no una medición de esta finca: un análisis
    de suelo da los de verdad.</p>

    <h4>Probar sin hardware</h4>
    <p class="hint">Carga una semana de lecturas como las que mandarían un ultrasónico en el
    reservorio, una sonda en los arándanos y un pluviómetro, generadas con el mismo traductor
    que usa el receptor. Se borran con un toque y no tocan nada anotado a mano.</p>
    <div class="sheet-actions">
      <button class="btn" data-act="prueba">${hayPrueba ? 'Volver a generar' : 'Cargar datos de prueba'}</button>
      ${hayPrueba ? '<button class="btn btn-danger" data-act="borrar-prueba">Borrar datos de prueba</button>' : ''}
      ${cfg.url ? '<button class="btn" data-act="sync">Leer ahora</button>' : ''}
    </div>
  `, body => {
    const form = body.querySelector('#f-sen');
    const leerForm = () => {
      const f = new FormData(form);
      const num = k => (f.get(k) === '' || f.get(k) == null ? null : Number(f.get(k)));
      return { url: (f.get('url') || '').trim(), token: (f.get('token') || '').trim(),
        sueloCC: num('sueloCC'), sueloPMP: num('sueloPMP') };
    };

    form.onsubmit = async ev => {
      ev.preventDefault();
      const nuevo = { ...cfgSensores(), ...leerForm() };
      // Cambiar de receptor obliga a releer desde el principio.
      if (nuevo.url !== cfg.url) nuevo.ultimaSync = null;
      state.config = await db.saveConfig({ sensores: nuevo });
      toast('Sensores guardados');
      if (nuevo.url) await sincronizarSensores({ avisar: true });
      openSensores();
    };

    body.querySelector('[data-act="probar"]').onclick = async ev => {
      ev.target.disabled = true; ev.target.textContent = 'Probando…';
      const r = await sensores.probar(leerForm());
      toast(r.ok
        ? `Conectado. ${r.aparatos ? r.aparatos + ' aparato' + (r.aparatos > 1 ? 's' : '') + ' en el receptor' : 'El receptor todavía no tiene lecturas'}.`
        : `No conecta: ${r.motivo}`, 4500);
      ev.target.disabled = false; ev.target.textContent = 'Probar';
    };

    body.querySelectorAll('[data-aparato]').forEach(el => el.addEventListener('click', () =>
      openAparato(el.dataset.aparato)));

    body.querySelector('[data-act="prueba"]').onclick = async () => {
      await sensores.borrarPrueba();
      // El consumo de prueba sale del modelo, para que todo cuadre.
      const w = water.summary({ ...state, clima: state.clima });
      await db.saveLocal('lecturas', sensores.lecturasDePrueba({
        consumoDiaM3: Math.max(0.05, w.demand.totalRefL / 1000),
        capacidadM3: state.config.reservorioVolumenM3 || 80,
        alturaUtilM: state.config.reservorioAlturaUtilM || 2
      }));
      const c = cfgSensores();
      state.config = await db.saveConfig({ sensores: { ...c, aparatos: { ...sensores.APARATOS_DE_PRUEBA, ...c.aparatos } } });
      await sensores.aplicar(cfgSensores().aparatos);
      await reload(); renderAll();
      toast('Datos de prueba cargados');
      openSensores();
    };
    body.querySelector('[data-act="borrar-prueba"]')?.addEventListener('click', async () => {
      await sensores.borrarPrueba();
      const c = cfgSensores();
      const aparatos = Object.fromEntries(Object.entries(c.aparatos).filter(([id]) => !(id in sensores.APARATOS_DE_PRUEBA)));
      state.config = await db.saveConfig({ sensores: { ...c, aparatos } });
      await sensores.aplicar(aparatos);
      await reload(); renderAll();
      toast('Datos de prueba borrados');
      openSensores();
    });
    body.querySelector('[data-act="sync"]')?.addEventListener('click', async () => {
      await sincronizarSensores({ avisar: true });
      openSensores();
    });
  });
}

function filaAparato(a, cfg) {
  const p = a.principal;
  const sinUso = !a.uso;
  return `
    <button class="list-row" data-aparato="${attr(a.dispositivo)}">
      <span class="franja franja--${a.callado ? 'mal' : sinUso ? 'nuevo' : 'ok'}"></span>
      <span class="fila-main">
        <strong>${escapeHtml(a.nombre)}</strong>
        <small>${sinUso ? '<b class="cuando cuando--atrasada">sin asignar</b> · '
          : a.nombre === sensores.USOS[a.uso]?.label ? '' : `${sensores.USOS[a.uso]?.label} · `}${p ? escapeHtml(p.texto) : '—'}</small>
        <small class="muted">${a.callado ? `<b class="cuando cuando--atrasada">callado</b> · ` : ''}${haceTexto(a.horas)}${
          a.bateriaTexto ? ` · batería ${a.bateriaTexto}${a.bateriaBaja ? ' ⚠︎' : ''}` : ''}${
          p?.falta ? ` · falta la ${p.falta}` : ''}</small>
      </span>
      <span class="fila-go"><svg class="icono icono--s" aria-hidden="true"><use href="#i-chevron-der"/></svg></span>
    </button>`;
}

/** Ficha de un aparato: para qué está y, si hace falta, cómo calibrarlo. */
function openAparato(id) {
  const cfg = cfgSensores();
  const ap = cfg.aparatos[id] || {};
  const estado = sensores.estadoAparatos(state.lecturas, cfg.aparatos).find(a => a.dispositivo === id);
  const tipos = Object.keys(estado?.tipos || {});

  openSheet(ap.nombre || id, `
    <form id="f-ap">
      <p class="hint">Identificador en el receptor: <code>${escapeHtml(id)}</code><br>
      Manda: ${tipos.map(t => escapeHtml(TIPO_TEXTO(t))).join(', ') || '—'}</p>
      <label>Nombre <input name="nombre" value="${attr(ap.nombre || '')}" placeholder="Reservorio" /></label>
      <label>Para qué está
        <select name="uso">
          <option value="">Sin asignar</option>
          ${Object.entries(sensores.USOS).map(([k, u]) =>
            `<option value="${k}" ${ap.uso === k ? 'selected' : ''}>${u.label}</option>`).join('')}
        </select>
      </label>
      <div class="solo-reservorio">
        <label>Altura del sensor sobre el fondo (m)
          <input name="montajeM" type="number" step="0.01" min="0" value="${attr(ap.montajeM)}" placeholder="2,30" />
        </label>
        <p class="hint">Un ultrasónico mide la distancia hasta el agua, no el agua: para saber
        cuánta hay hay que restarla de la altura a la que está montado. Mídela con cinta del
        sensor al fondo, con el reservorio vacío o con una vara. Un error de 5 cm aquí es un
        error de ${nf((0.05 / (state.config.reservorioAlturaUtilM || 2)) * (state.config.reservorioVolumenM3 || 80), 1)} m³ en todas las lecturas.</p>
      </div>
      <div class="solo-caudal">
        <label>Qué manda el medidor
          <select name="acumulado">
            <option value="si" ${ap.acumulado !== false ? 'selected' : ''}>Un total que sólo crece (lo más común)</option>
            <option value="no" ${ap.acumulado === false ? 'selected' : ''}>Lo que pasó desde la lectura anterior</option>
          </select>
        </label>
        <p class="hint">Si no lo sabes, mira dos lecturas seguidas con el riego cerrado: si
        repiten el mismo número, es un total; si mandan cero, es lo del rato. Confundirlos
        cuenta mil veces el mismo litro.</p>
        ${tipos.includes('pulsos') ? `
        <label>Litros por pulso
          <input name="litrosPorPulso" type="number" step="0.001" min="0" value="${attr(ap.litrosPorPulso)}" placeholder="1" />
        </label>
        <p class="hint">Viene en la placa o el manual del medidor (1, 10 o 100 L por pulso
        son lo habitual). Sin este dato los pulsos no se pueden convertir en agua.</p>` : ''}
        <fieldset class="sectores-linea">
          <legend>Sectores que alimenta esta línea</legend>
          ${state.sectors.map(sc => `<label class="row"><input type="checkbox" name="sectorIds" value="${sc.id}"
            ${(ap.sectorIds || []).includes(sc.id) ? 'checked' : ''} /> ${escapeHtml(sc.name)}</label>`).join('')}
        </fieldset>
        <p class="hint">Sólo para saber de dónde sale el agua. El volumen no se reparte entre
        ellos: un medidor en una línea compartida mide el total, y cualquier reparto sería un
        supuesto disfrazado de medición.</p>
      </div>
      <label class="solo-suelo">Sector donde está la sonda
        <select name="sectorId">
          <option value="">—</option>
          ${state.sectors.map(s => `<option value="${s.id}" ${ap.sectorId === s.id ? 'selected' : ''}>${escapeHtml(s.name)}</option>`).join('')}
        </select>
      </label>
      <button class="btn btn--rojo btn-block" type="submit">Guardar</button>
    </form>
  `, body => {
    const form = body.querySelector('#f-ap');
    const mostrar = () => {
      const uso = form.uso.value;
      form.querySelector('.solo-reservorio').hidden = uso !== 'reservorio' || !tipos.includes('distancia');
      form.querySelector('.solo-suelo').hidden = uso !== 'suelo';
      form.querySelector('.solo-caudal').hidden = uso !== 'caudal';
    };
    form.uso.addEventListener('change', mostrar);
    mostrar();

    form.onsubmit = async ev => {
      ev.preventDefault();
      const f = new FormData(form);
      const c = cfgSensores();
      const nuevo = {
        nombre: (f.get('nombre') || '').trim() || undefined,
        uso: f.get('uso') || undefined,
        montajeM: f.get('montajeM') ? Number(f.get('montajeM')) : undefined,
        sectorId: f.get('sectorId') || undefined,
        acumulado: f.get('uso') === 'caudal' ? f.get('acumulado') !== 'no' : undefined,
        litrosPorPulso: f.get('litrosPorPulso') ? Number(f.get('litrosPorPulso')) : undefined,
        sectorIds: f.get('uso') === 'caudal' ? f.getAll('sectorIds') : undefined
      };
      state.config = await db.saveConfig({ sensores: { ...c, aparatos: { ...c.aparatos, [id]: nuevo } } });
      // Cambiar el uso o la altura cambia TODOS los niveles pasados de este
      // aparato, así que se rehace lo derivado entero.
      await sensores.aplicar(cfgSensores().aparatos);
      await reload(); renderAll();
      toast('Aparato guardado');
      openSensores();
    };
  });
}

const TIPO_TEXTO = t => ({
  distancia: 'distancia al agua', nivel: 'nivel', lluvia: 'lluvia', humedad_suelo: 'humedad de suelo',
  caudal: 'caudal', pulsos: 'pulsos', bateria: 'batería', temperatura: 'temperatura'
}[t] || t);

/**
 * La tarjeta de sensores en la pantalla de agua. Si no hay ninguno, una sola
 * línea que invita a conectarlos; si hay, su estado, con lo callado arriba:
 * un sensor caído es lo único de esta lista que exige hacer algo.
 */
function renderSensoresAgua() {
  const sen = resumenSensores();
  const enUso = (sen?.aparatos || []).filter(a => a.uso && a.uso !== 'ignorar');
  const nuevos = (sen?.aparatos || []).filter(a => !a.uso);

  if (!enUso.length && !nuevos.length) {
    return `<div class="card sensores-vacio">
      <p class="hint">Sin sensores conectados: el nivel del reservorio sale de las mediciones a mano
      y la lluvia, del modelo de Open-Meteo.</p>
      <p class="pie-accion"><span></span><button class="btn btn--fantasma btn--sm" data-act="sensores">Conectar sensores</button></p>
    </div>`;
  }

  const orden = [...enUso].sort((a, b) => (b.callado - a.callado));
  return `<div class="card card--filas sensores">
    <div class="sensores-cab">
      <strong>Sensores</strong>
      <button class="btn btn--fantasma btn--sm" data-act="sensores">Configurar</button>
    </div>
    ${nuevos.length ? `<p class="aviso aviso--atencion">${nuevos.length === 1 ? 'Hay un aparato nuevo' : `Hay ${nuevos.length} aparatos nuevos`} mandando datos sin asignar.</p>` : ''}
    ${orden.map(a => `
      <div class="list-row">
        <span class="franja franja--${a.callado ? 'mal' : 'ok'}"></span>
        <span class="fila-main">
          <strong>${escapeHtml(a.nombre)}</strong>
          <small>${a.principal ? escapeHtml(a.principal.texto) : '—'} · ${a.callado
            ? `<b class="cuando cuando--atrasada">callado, ${haceTexto(a.horas)}</b>`
            : haceTexto(a.horas)}${a.bateriaBaja ? ' · <b class="cuando cuando--atrasada">batería baja</b>' : ''}</small>
        </span>
      </div>`).join('')}
  </div>`;
}

/**
 * Regado frente a pedido. Sólo aparece con caudalímetro: es la única forma de
 * saber cuánto se regó de verdad. Lo primero es una frase con el veredicto de
 * la semana, que es lo que se decide —abrir menos la llave, o más—; los días
 * van debajo, para quien quiera ver si fue uno solo o todos.
 *
 * Dos barras por día en la MISMA escala (no dos ejes): lo regado, lleno; lo
 * pedido, en contorno. Se distinguen por forma además de por color, y cada
 * una lleva su número.
 */
function renderComparacion(s) {
  const c = s.comparacion;
  if (!c) return '';
  const max = Math.max(...c.filas.flatMap(f => [f.regadoM3, f.pedidoM3]), 0.001);
  const pct = v => Math.max(1.5, (v / max) * 100).toFixed(1);
  const dif = c.regadoM3 - c.pedidoM3;

  const veredicto = c.desvio == null
    ? `Las plantas casi no pedían agua (lluvia o reserva en el suelo) y se regaron ${nf(c.regadoM3, 2)} m³.`
    : Math.abs(c.desvio) < 15
      ? `El riego va acorde con lo que piden las plantas (${c.desvio > 0 ? '+' : ''}${c.desvio} %).`
      : c.desvio > 0
        ? `Se regó <b>${c.desvio} % más</b> de lo que pedían las plantas: ${nf(dif, 2)} m³ de más en ${c.filas.length} días.${
            c.sinNecesidad
              ? ` <b>${c.sinNecesidad === 1 ? 'Un día' : c.sinNecesidad + ' días'} se regó sin que hiciera falta</b> —llovió o el suelo estaba cargado—, ${nf(c.sinNecesidadM3, 2)} m³ en total: si el riego va con temporizador, conviene cortarlo después de una lluvia.`
              : ' Con el agua contada por turnos, es agua que falta al final del ciclo.'}`
        : `Se regó <b>${Math.abs(c.desvio)} % menos</b> de lo que pedían las plantas: faltaron ${nf(-dif, 2)} m³ en ${c.filas.length} días.`;

  return `<div class="card bloque--ancho comparacion">
    <div class="proy-head"><strong>Regado y pedido</strong><small>últimos ${c.filas.length} días con caudalímetro</small></div>
    <p class="hint">${veredicto}</p>
    <div class="cmp-filas">${c.filas.map(f => `
      <div class="cmp-fila">
        <span class="cmp-dia">${fmtDate(f.date).replace(/ \d{4}$/, '')}</span>
        <span class="cmp-barras" aria-label="Regado ${nf(f.regadoM3, 2)} m³, pedido ${nf(f.pedidoM3, 2)} m³">
          <i class="cmp-reg" style="width:${pct(f.regadoM3)}%"></i>
          <i class="cmp-ped" style="width:${pct(f.pedidoM3)}%"></i>
        </span>
        <span class="cmp-val">${nf(f.regadoM3, 2)} <small>/ ${nf(f.pedidoM3, 2)} m³</small></span>
      </div>`).join('')}
    </div>
    <div class="proy-pie">
      <span><i class="proy-k"></i>regado (caudalímetro)</span>
      <span><i class="proy-k proy-k--pedido"></i>pedido (modelo)</span>
    </div>
  </div>`;
}

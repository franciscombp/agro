// Finca Mulalillo — controlador de la aplicación.
// Un solo estado en memoria, respaldado en IndexedDB, compartido por el mapa 2D y la vista 3D.
"use strict";

import * as db from './db.js';
import { SPECIES, STATUS_COLORS, BOUNDARY } from './db.js';
import { FarmMap } from './map2d.js';
import * as water from './water.js';
import { preview as plantingPreview, LAYOUTS } from './planting.js';
import * as hyd from './hydraulics.js';
import {
  areaM2, perimeterM, fmtArea, fmtM, centroid, pointInRing,
  interpolateElevation, staticPressureBar, bbox
} from './geo.js';

const INFRA_TYPES = ['reservorio', 'casa', 'establo', 'cuyera', 'bomba', 'filtro', 'válvula'];
const TASK_TYPES = ['riego', 'poda', 'fertilización', 'fumigación', 'cosecha', 'siembra', 'otro'];
const WATER_TYPES = ['llenado_acequia', 'tanquero', 'riego', 'medición_nivel'];
const STATUSES = ['sano', 'atención', 'enfermo', 'muerto'];
const BUILD = 'v8 · 2026-09-17';

const state = {
  parcel: { id: 'parcel-mulalillo', name: 'Finca Mulalillo', boundary: BOUNDARY },
  sectors: [], plants: [], infra: [], tasks: [], water: [], elevations: [], config: {}
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
  await db.seedIfEmpty();
  await reload();
  await initMap();
  wireChrome();
  renderAll();
  registerServiceWorker();
  watchConnectivity();
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
    <div class="warn pad">
      <p><strong>No se pudo cargar el mapa:</strong> ${escapeHtml(msg)}.</p>
      <p>${offline
        ? 'El dispositivo está sin conexión. Con señal, toca «Reintentar»: al cargar una vez, el mapa queda guardado y ya funciona sin señal.'
        : 'Suele ser señal débil cortando la descarga de la librería (800 kB). Toca «Reintentar».'}</p>
      <p>Las listas de sectores, plantas, tareas y agua funcionan igual mientras tanto.</p>
      <button class="btn-primary" id="btn-retry-map">Reintentar</button>
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
  $('#topbar-sub').textContent = `Salcedo, Cotopaxi · ${BUILD}` + (swDisabled() ? ' · sin SW' : '');
  $$('.tab').forEach(tab => tab.addEventListener('click', () => showView(tab.dataset.view)));
  $('#btn-settings').addEventListener('click', openSettings);
  $('#sheet-close').addEventListener('click', closeSheet);
  $('#sheet-backdrop').addEventListener('click', closeSheet);

  $('#btn-fit').addEventListener('click', () => farmMap?.fitToParcel());
  $('#btn-gps').addEventListener('click', locateMe);
  $('#btn-layers').addEventListener('click', () => togglePanel('#panel-layers'));
  $('#btn-move').addEventListener('click', e => {
    if (!farmMap) return;
    const on = farmMap.mode !== 'move';
    farmMap.setMode(on ? 'move' : 'view');
    e.currentTarget.classList.toggle('on', on);
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

  $$('#task-seg .seg-btn').forEach(btn => btn.addEventListener('click', () => {
    $$('#task-seg .seg-btn').forEach(b => b.classList.toggle('active', b === btn));
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
}

function showView(id) {
  $$('.view').forEach(v => v.classList.toggle('active', v.id === id));
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.view === id));
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
  el.textContent = msg;
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
  $('#sheet-title').textContent = title;
  $('#sheet-body').innerHTML = bodyHtml;
  $('#sheet').hidden = false;
  $('#sheet-backdrop').hidden = false;
  onMount?.($('#sheet-body'));
}

function closeSheet() {
  $('#sheet').hidden = true;
  $('#sheet-backdrop').hidden = true;
  $('#sheet-body').innerHTML = '';
}

// ---------------------------------------------------------------------------
// Mapa: colocación, edición, GPS
// ---------------------------------------------------------------------------

function openAddMenu() {
  openSheet('Agregar', `
    <div class="grid-actions">
      <button class="big-action" data-add="plant"><span>🌿</span>Planta</button>
      <button class="big-action" data-add="infra"><span>🏠</span>Infraestructura</button>
      <button class="big-action" data-add="sector"><span>▦</span>Sector</button>
      <button class="big-action" data-add="elevation"><span>📐</span>Punto de elevación</button>
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
    <div class="pill-row">
      <span class="pill" style="background:${STATUS_COLORS[p.status]}">${p.status}</span>
      ${sector ? `<span class="pill ghost">${escapeHtml(sector.name)}</span>` : '<span class="pill ghost">Sin sector</span>'}
    </div>
    <dl class="facts">
      <dt>Sembrada</dt><dd>${p.plantedAt ? fmtDate(p.plantedAt) + ' · ' + ageLabel(p.plantedAt) : '—'}</dd>
      <dt>Elevación</dt><dd>${p.elevationM ? nf(p.elevationM, 2) + ' msnm' : '—'}</dd>
      <dt>Coordenadas</dt><dd>${p.lat.toFixed(6)}, ${p.lng.toFixed(6)}</dd>
      <dt>Riego estimado</dt><dd>${SPECIES[p.species]?.lppd ?? '—'} L/día</dd>
    </dl>
    ${p.notes ? `<p class="note">${escapeHtml(p.notes)}</p>` : ''}
    ${p.photos?.length ? `<div class="photos">${p.photos.map(src => `<img src="${src}" alt="" />`).join('')}</div>` : ''}
    <h4>Historial y tareas (${tasks.length})</h4>
    ${tasks.length ? `<ul class="mini-list">${tasks.map(taskLine).join('')}</ul>` : '<p class="hint">Sin tareas registradas.</p>'}
    <div class="sheet-actions">
      <button class="btn-primary" data-act="task">Nueva tarea</button>
      <button class="btn-ghost" data-act="edit">Editar</button>
      <button class="btn-ghost" data-act="center">Ver en mapa</button>
      <button class="btn-danger" data-act="del">Eliminar</button>
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
      <div class="two">
        <label>Latitud <input name="lat" type="number" step="0.0000001" value="${attr(p.lat)}" required /></label>
        <label>Longitud <input name="lng" type="number" step="0.0000001" value="${attr(p.lng)}" required /></label>
      </div>
      <label>Elevación (msnm) <input name="elevationM" type="number" step="0.01" value="${attr(p.elevationM)}" /></label>
      <label>Notas <textarea name="notes" rows="3">${escapeHtml(p.notes || '')}</textarea></label>
      <label>Fotos <input type="file" name="photo" accept="image/*" capture="environment" multiple /></label>
      <button class="btn-primary" type="submit">Guardar</button>
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
    <dl class="facts">
      <dt>Elevación</dt><dd>${i.elevationM ? nf(i.elevationM, 2) + ' msnm' : '—'}</dd>
      ${head != null ? `<dt>Carga al punto más bajo</dt><dd>${nf(head)} m · ${nf(staticPressureBar(head), 2)} bar</dd>` : ''}
      <dt>Coordenadas</dt><dd>${i.lat.toFixed(6)}, ${i.lng.toFixed(6)}</dd>
      ${Object.entries(i.props || {}).map(([k, v]) => `<dt>${escapeHtml(k)}</dt><dd>${escapeHtml(String(v))}</dd>`).join('')}
    </dl>
    <div class="sheet-actions">
      <button class="btn-ghost" data-act="edit">Editar</button>
      <button class="btn-ghost" data-act="center">Ver en mapa</button>
      <button class="btn-danger" data-act="del">Eliminar</button>
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
      <div class="two">
        <label>Latitud <input name="lat" type="number" step="0.0000001" value="${attr(i.lat)}" required /></label>
        <label>Longitud <input name="lng" type="number" step="0.0000001" value="${attr(i.lng)}" required /></label>
      </div>
      <label>Elevación (msnm) <input name="elevationM" type="number" step="0.01" value="${attr(i.elevationM)}" /></label>
      <label>Volumen (m³) — sólo reservorio <input name="volumenM3" type="number" step="0.1" value="${attr(i.props?.volumenM3)}" /></label>
      <label>Material <input name="material" value="${attr(i.props?.material)}" /></label>
      <button class="btn-primary" type="submit">Guardar</button>
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
    <dl class="facts">
      <dt>Elevación</dt><dd>${nf(e.elevationM, 2)} msnm</dd>
      <dt>Coordenada</dt><dd>${e.lat.toFixed(6)}, ${e.lng.toFixed(6)} ${e.measured ? '' : '<em>(estimada)</em>'}</dd>
    </dl>
    ${e.measured ? '' : '<p class="warn">La altura es real pero la coordenada aún no se ha tomado con GPS. Párate en el punto y usa “Fijar con mi GPS”.</p>'}
    <div class="sheet-actions">
      <button class="btn-primary" data-act="gps">Fijar con mi GPS</button>
      <button class="btn-ghost" data-act="edit">Editar</button>
      <button class="btn-danger" data-act="del">Eliminar</button>
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
      <div class="two">
        <label>Latitud <input name="lat" type="number" step="0.0000001" value="${attr(e.lat)}" required /></label>
        <label>Longitud <input name="lng" type="number" step="0.0000001" value="${attr(e.lng)}" required /></label>
      </div>
      <label class="row"><input type="checkbox" name="measured" ${e.measured ? 'checked' : ''} /> Coordenada tomada con GPS</label>
      <p class="hint">Cada punto nuevo afina el modelo del terreno y la vista 3D.</p>
      <button class="btn-primary" type="submit">Guardar</button>
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
      <button class="card" data-sector="${s.id}">
        <span class="swatch" style="background:${s.color}"></span>
        <span class="card-main">
          <strong>${escapeHtml(s.name)}</strong>
          <small>${fmtArea(area)} · ${plants.length} plantas${s.irrigationZone ? ' · ' + escapeHtml(s.irrigationZone) : ''}</small>
        </span>
        <span class="card-go">›</span>
      </button>`;
  }).join('');

  $('#sectors-list').innerHTML = `
    <div class="summary-card">
      <div><span>Superficie total</span><strong>${fmtArea(total)}</strong></div>
      <div><span>Perímetro</span><strong>${fmtM(perimeterM(state.parcel.boundary))}</strong></div>
      <div><span>En sectores</span><strong>${fmtArea(used)} (${Math.round((used / total) * 100)}%)</strong></div>
    </div>
    <button class="card" id="edit-boundary">
      <span class="swatch" style="background:#ffd43b"></span>
      <span class="card-main"><strong>Límite del terreno</strong><small>${state.parcel.boundary.length} vértices · editar en el mapa</small></span>
      <span class="card-go">›</span>
    </button>
    ${rows || '<p class="hint">Aún no hay sectores. Usa “Dibujar sector”.</p>'}
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
  const dailyL = plants.reduce((sum, p) => sum + (SPECIES[p.species]?.lppd ?? 0), 0);
  const tasks = state.tasks.filter(t => t.targetType === 'sector' && t.targetId === s.id).sort(byDateDesc);
  const elevs = s.polygon.map(p => interpolateElevation(p, measuredPoints()));

  openSheet(s.name, `
    <dl class="facts">
      <dt>Área</dt><dd>${fmtArea(area)}</dd>
      <dt>Perímetro</dt><dd>${fmtM(perimeterM(s.polygon))}</dd>
      <dt>Plantas</dt><dd>${plants.length}</dd>
      <dt>Riego estimado</dt><dd>${Math.round(dailyL).toLocaleString('es-EC')} L/día</dd>
      <dt>Elevación</dt><dd>${nf(Math.min(...elevs))}–${nf(Math.max(...elevs))} msnm</dd>
      ${s.irrigationZone ? `<dt>Zona de riego</dt><dd>${escapeHtml(s.irrigationZone)}</dd>` : ''}
    </dl>
    <h4>Plantas por especie</h4>
    ${bySpecies.size ? `<ul class="mini-list">${[...bySpecies].map(([sp, n]) =>
      `<li><span class="dot" style="background:${SPECIES[sp]?.color}"></span>${SPECIES[sp]?.label || sp}<b>${n}</b></li>`).join('')}</ul>`
      : '<p class="hint">Sin plantas registradas en este sector.</p>'}
    <h4>Tareas del sector (${tasks.length})</h4>
    ${tasks.length ? `<ul class="mini-list">${tasks.map(taskLine).join('')}</ul>` : '<p class="hint">Sin tareas.</p>'}
    <div class="sheet-actions">
      <button class="btn-primary" data-act="plant">Sembrar en marco</button>
      <button class="btn-ghost" data-act="water">Riego por gravedad</button>
      <button class="btn-ghost" data-act="task">Tarea del sector</button>
      <button class="btn-ghost" data-act="edit">Editar datos</button>
      <button class="btn-ghost" data-act="shape">Editar forma</button>
      <button class="btn-danger" data-act="del">Eliminar</button>
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

function openSectorForm(s) {
  const isNew = !s.id;
  openSheet(isNew ? 'Nuevo sector' : 'Editar sector', `
    <form id="f">
      <p class="hint">Área calculada: <strong>${fmtArea(areaM2(s.polygon))}</strong></p>
      <label>Nombre <input name="name" value="${attr(s.name)}" placeholder="Bloque arándanos" required /></label>
      <label>Color <input type="color" name="color" value="${s.color || '#2f9e44'}" /></label>
      <label>Zona de riego <input name="irrigationZone" value="${attr(s.irrigationZone)}" placeholder="Zona alta" /></label>
      <button class="btn-primary" type="submit">Guardar</button>
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
      <div class="two">
        <label>Entre hileras (m) <input name="rowSpacingM" type="number" step="0.1" min="0.2" value="2.5" required /></label>
        <label>Entre plantas (m) <input name="spacingM" type="number" step="0.1" min="0.2" value="1.2" required /></label>
      </div>
      <div class="two">
        <label>Margen al borde (m) <input name="marginM" type="number" step="0.1" min="0" value="1" /></label>
        <label>Giro de hileras (°) <input name="angleDeg" type="number" step="5" min="0" max="180" value="0" /></label>
      </div>
      <label>Disposición
        <select name="layout">${Object.entries(LAYOUTS).map(([k, v]) =>
          `<option value="${k}">${v.label}</option>`).join('')}</select>
      </label>
      <label>Fecha de siembra <input type="date" name="plantedAt" value="${today()}" /></label>
      <div id="planting-summary" class="summary-card"></div>
      <p class="hint">Las posiciones naranjas en el mapa son la propuesta. Nada se guarda hasta confirmar.</p>
      <button class="btn-primary" type="submit" id="btn-sow">Sembrar</button>
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
        <div><span>Riego que suma</span><strong>${nf((p.count * lppd) / 1000, 2)} m³/día</strong></div>
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
      '<p class="warn">No hay ningún reservorio registrado. Agrégalo desde el mapa para calcular la presión.</p>');
  }

  const target = centroid(sector.polygon);
  const targetElev = interpolateElevation(target, measuredPoints());
  const plants = state.plants.filter(p => p.sectorId === sector.id);
  const demandL = plants.reduce((sum, p) => sum + (SPECIES[p.species]?.lppd ?? 0), 0);

  openSheet(`Riego por gravedad · ${sector.name}`, `
    <form id="f">
      <div class="two">
        <label>Demanda del sector (L/día) <input name="demandLitresPerDay" type="number" step="1" value="${Math.round(demandL)}" /></label>
        <label>Horas de riego <input name="irrigationHours" type="number" step="0.5" min="0.5" value="2" /></label>
      </div>
      <div class="two">
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
        veredicto = `<p class="alarm">Presión insuficiente para goteros autocompensados, que necesitan al menos
          ${nf(hyd.DRIPPER_MIN_BAR, 1)} bar.
          ${r.lossShare > 0.3
            ? 'La fricción se está comiendo ' + Math.round(r.lossShare * 100) + '% del desnivel: sube el diámetro.'
            : 'El desnivel hasta este sector no da para más, por mucho que engroses la tubería. Opciones: goteros no compensados (trabajan desde 0,5 bar), microaspersión de baja presión, o una bomba pequeña.'}</p>`;
      } else if (r.tooHigh) {
        veredicto = `<p class="warn">Presión por encima de ${nf(hyd.DRIPPER_MAX_BAR, 1)} bar: conviene un regulador
          para no forzar goteros y uniones.</p>`;
      } else {
        veredicto = `<p class="note">Presión dentro del rango de trabajo del goteo autocompensado
          (${nf(hyd.DRIPPER_MIN_BAR, 1)}–${nf(hyd.DRIPPER_MAX_BAR, 1)} bar).</p>`;
      }

      body.querySelector('#hyd-result').innerHTML = `
        <div class="summary-card">
          <div><span>Desnivel reservorio → sector</span><strong>${nf(r.dropM)} m</strong></div>
          <div><span>Presión estática</span><strong>${nf(r.staticBar, 2)} bar</strong></div>
          <div><span>Tubería estimada</span><strong>${nf(r.pipeLengthM, 0)} m</strong></div>
          <div><span>Caudal de diseño</span><strong>${nf(r.flowLps, 2)} L/s</strong></div>
          <div><span>Pérdida por fricción</span><strong>${nf(r.lossM, 2)} m (${Math.round(r.lossShare * 100)}%)</strong></div>
          <div><span>Presión neta</span><strong class="${r.ok ? 'good' : 'bad'}">${nf(r.netBar, 2)} bar</strong></div>
          <div><span>Velocidad</span><strong class="${r.fastFlow ? 'bad' : ''}">${nf(r.velocity, 2)} m/s</strong></div>
        </div>
        ${veredicto}
        ${r.fastFlow ? '<p class="warn">Más de 1,5 m/s: golpe de ariete y desgaste. Sube de diámetro.</p>' : ''}
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
    ${rows.map(p => `
      <button class="card" data-plant="${p.id}">
        <span class="swatch" style="background:${SPECIES[p.species]?.color}"></span>
        <span class="card-main">
          <strong>${SPECIES[p.species]?.label || p.species}${p.variety ? ' · ' + escapeHtml(p.variety) : ''}</strong>
          <small>${state.sectors.find(s => s.id === p.sectorId)?.name || 'Sin sector'}${p.plantedAt ? ' · ' + ageLabel(p.plantedAt) : ''}</small>
        </span>
        <span class="pill sm" style="background:${STATUS_COLORS[p.status]}">${p.status}</span>
      </button>`).join('') || '<p class="hint">Sin resultados.</p>'}
  `;
  $('#plants-list').querySelectorAll('[data-plant]').forEach(el =>
    el.addEventListener('click', () => openPlant(el.dataset.plant)));
}

// ---------------------------------------------------------------------------
// Tareas
// ---------------------------------------------------------------------------

function renderTasks() {
  const rows = state.tasks
    .filter(t => taskFilter === 'todas' || (taskFilter === 'hechas' ? t.doneAt : !t.doneAt))
    .sort((a, b) => (a.dueAt || a.doneAt || '').localeCompare(b.dueAt || b.doneAt || ''));

  const overdue = state.tasks.filter(t => !t.doneAt && t.dueAt && t.dueAt < today()).length;

  $('#tasks-list').innerHTML = `
    ${overdue ? `<p class="warn">${overdue} tarea${overdue > 1 ? 's' : ''} atrasada${overdue > 1 ? 's' : ''}.</p>` : ''}
    ${rows.map(t => `
      <div class="card ${!t.doneAt && t.dueAt && t.dueAt < today() ? 'overdue' : ''}">
        <input type="checkbox" class="chk" data-done="${t.id}" ${t.doneAt ? 'checked' : ''} />
        <button class="card-main as-button" data-task="${t.id}">
          <strong>${cap(t.type)} · ${escapeHtml(targetName(t))}</strong>
          <small>${t.doneAt ? 'Hecha ' + fmtDate(t.doneAt) : t.dueAt ? 'Para ' + fmtDate(t.dueAt) : 'Sin fecha'}${t.quantity ? ` · ${t.quantity} ${escapeHtml(t.unit || '')}` : ''}</small>
          ${t.notes ? `<small class="muted">${escapeHtml(t.notes)}</small>` : ''}
        </button>
      </div>`).join('') || '<p class="hint">Nada por aquí.</p>'}
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
      <div class="two">
        <label>Cantidad <input type="number" step="0.01" name="quantity" value="${attr(t.quantity)}" /></label>
        <label>Unidad <input name="unit" value="${attr(t.unit)}" placeholder="kg, L, sacos" /></label>
      </div>
      <label>Notas <textarea name="notes" rows="3">${escapeHtml(t.notes || '')}</textarea></label>
      <button class="btn-primary" type="submit">Guardar</button>
      ${t.id ? '<button class="btn-danger" type="button" data-act="del">Eliminar</button>' : ''}
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

  const w = water.summary(state);
  lineas.push('AGUA');
  lineas.push(`• Reservorio estimado: ${nf(w.volume.volumeM3)} m³ de ${nf(state.config.reservorioVolumenM3 || 0, 0)} m³`);
  lineas.push(`• Autonomía: ${Number.isFinite(w.autonomyDays) ? nf(w.autonomyDays) + ' días' : 'sin consumo registrado'}`);
  if (w.turns[0]) {
    lineas.push(`• Próximo turno de la junta: ${fmtDate(w.turns[0].date)} (en ${w.turns[0].inDays} días)`);
  }
  if (w.alert) {
    lineas.push(`• ATENCIÓN: faltarían ${nf(w.deficitM3)} m³ para llegar al próximo turno.`);
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
  return `<li><span class="dot" style="background:${t.doneAt ? '#2f9e44' : '#f59f00'}"></span>
    ${cap(t.type)} — ${t.doneAt ? fmtDate(t.doneAt) : t.dueAt ? 'para ' + fmtDate(t.dueAt) : 'sin fecha'}
    ${t.notes ? `<em>${escapeHtml(t.notes)}</em>` : ''}</li>`;
}

// ---------------------------------------------------------------------------
// Agua
// ---------------------------------------------------------------------------

function renderWater() {
  const s = water.summary(state);
  const days = Number.isFinite(s.autonomyDays) ? s.autonomyDays : null;
  const capacityM3 = state.config.reservorioVolumenM3 || 0;
  const pct = capacityM3 ? Math.min(100, (s.volume.volumeM3 / capacityM3) * 100) : 0;
  const low = Math.min(...measuredPoints().map(p => p.elevationM));
  const high = Math.max(...measuredPoints().map(p => p.elevationM));

  $('#water-body').innerHTML = `
    ${s.alert ? `<p class="alarm">⚠︎ Autonomía por debajo de ${s.alertDays} días. El próximo turno es en ${s.turns[0]?.inDays ?? '—'} días: faltarían ${nf(s.deficitM3)} m³.</p>` : ''}

    <div class="gauge">
      <div class="gauge-bar"><span style="width:${pct.toFixed(1)}%"></span></div>
      <div class="gauge-legend">
        <strong>${nf(s.volume.volumeM3)} m³</strong> de ${nf(capacityM3, 0)} m³
        <small>estimado desde ${s.volume.source}${s.volume.anchorDate ? ' del ' + fmtDate(s.volume.anchorDate) : ''}${s.volume.sinceDays ? ` (hace ${s.volume.sinceDays} d)` : ''}</small>
      </div>
    </div>

    <div class="summary-card">
      <div><span>Demanda diaria</span><strong>${nf(s.dailyM3, 2)} m³/día</strong></div>
      <div><span>Autonomía</span><strong class="${s.alert ? 'bad' : 'good'}">${days == null ? '∞' : nf(days) + ' días'}</strong></div>
      <div><span>Desnivel</span><strong>${nf(high - low)} m · ${nf(staticPressureBar(high - low), 2)} bar</strong></div>
    </div>

    <h4>Turno de la junta de agua</h4>
    <p class="hint">5 horas cada ${state.config.cicloTurnoDias || 15} días.</p>
    <ul class="mini-list">
      ${s.turns.map(t => `<li><span class="dot" style="background:#1c7ed6"></span>${fmtDate(t.date)}<b>${t.inDays === 0 ? 'hoy' : 'en ' + t.inDays + ' d'}</b></li>`).join('')}
    </ul>

    <h4>Demanda por sector</h4>
    <p class="hint">Calculada sobre las ${state.plants.length} plantas registradas. Al sembrar los arándanos y aguacates nuevos, súbelos a la app para que la autonomía refleje la demanda real.</p>
    <ul class="mini-list">
      ${s.demand.bySector.map(x => `<li>${escapeHtml(x.name)}<b>${Math.round(x.litres)} L/día</b></li>`).join('') || '<li>Sin plantas registradas</li>'}
    </ul>

    <h4>Demanda por especie</h4>
    <ul class="mini-list">
      ${s.demand.bySpecies.map(x => `<li><span class="dot" style="background:${SPECIES[x.species]?.color}"></span>${escapeHtml(x.label)}<b>${Math.round(x.litres)} L/día</b></li>`).join('') || '<li>—</li>'}
    </ul>

    <h4>Eventos registrados</h4>
    ${[...state.water].sort(byDateDesc).map(e => `
      <button class="card" data-water="${e.id}">
        <span class="swatch" style="background:${e.type === 'tanquero' ? '#e8590c' : '#1c7ed6'}"></span>
        <span class="card-main">
          <strong>${cap2(e.type)}</strong>
          <small>${fmtDate(e.date)}${e.volumeM3 != null ? ` · ${e.volumeM3} m³` : ''}${e.levelM != null ? ` · nivel ${e.levelM} m` : ''}</small>
          ${e.notes ? `<small class="muted">${escapeHtml(e.notes)}</small>` : ''}
        </span>
        <span class="card-go">›</span>
      </button>`).join('') || '<p class="hint">Sin eventos.</p>'}
  `;
  $('#water-body').querySelectorAll('[data-water]').forEach(el =>
    el.addEventListener('click', () => openWaterForm(state.water.find(w => w.id === el.dataset.water))));
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
      <button class="btn-primary" type="submit">Guardar</button>
      ${e.id ? '<button class="btn-danger" type="button" data-act="del">Eliminar</button>' : ''}
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
    renderThreeHint();
  } catch (err) {
    container.innerHTML = `
      <div class="warn pad">
        <p><strong>No se pudo cargar la vista 3D.</strong></p>
        <p>Si ya la abriste antes, casi siempre es un archivo viejo guardado en el
        teléfono. Entra en Ajustes ⚙︎ → <strong>«Reinstalar la app»</strong>: borra lo
        guardado y vuelve a bajar todo limpio. Tus datos no se tocan.</p>
        <p><small>Detalle técnico: ${escapeHtml(String(err.message || err))}</small></p>
        <button class="btn-primary" id="btn-retry-3d">Reintentar</button>
        <p class="hint">¿Sigue fallando? Abre el <a href="./diagnostico.html">diagnóstico</a>.</p>
      </div>`;
    container.querySelector('#btn-retry-3d').onclick = () => { terrain = null; init3D(); };
  }
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
      <div class="two">
        <label>Capacidad (m³) <input type="number" step="0.1" name="reservorioVolumenM3" value="${attr(c.reservorioVolumenM3)}" /></label>
        <label>Altura útil (m) <input type="number" step="0.01" name="reservorioAlturaUtilM" value="${attr(c.reservorioAlturaUtilM)}" /></label>
      </div>
      <h4>Agua</h4>
      <label>Demanda diaria manual (m³/día) <input type="number" step="0.01" name="demandaDiariaM3" value="${attr(c.demandaDiariaM3)}" placeholder="vacío = calculada desde las plantas" /></label>
      <label>Alertar bajo (días de autonomía) <input type="number" name="alertaAutonomiaDias" value="${attr(c.alertaAutonomiaDias)}" /></label>
      <div class="two">
        <label>Próximo turno <input type="date" name="proximoTurno" value="${attr(c.proximoTurno)}" /></label>
        <label>Ciclo (días) <input type="number" name="cicloTurnoDias" value="${attr(c.cicloTurnoDias)}" /></label>
      </div>
      <h4>Sincronización</h4>
      <label>Endpoint de sincronización <input name="syncEndpoint" value="${attr(c.syncEndpoint)}" placeholder="https://…/sync" /></label>
      <p class="hint">Sin endpoint, los cambios quedan en la cola local y se pueden trasladar con el respaldo JSON.</p>
      <button class="btn-primary" type="submit">Guardar ajustes</button>
    </form>
    <div class="sheet-actions">
      <button class="btn-ghost" data-act="export">Exportar respaldo</button>
      <button class="btn-ghost" data-act="import">Importar respaldo</button>
      <button class="btn-ghost" data-act="sync">Sincronizar ahora</button>
      <button class="btn-ghost" data-act="tiles">Descargar mapa del terreno</button>
      <button class="btn-ghost" data-act="reinstall">Reinstalar la app</button>
      <button class="btn-ghost" data-act="diag">Diagnóstico</button>
      <button class="btn-danger" data-act="reset">Restaurar datos medidos</button>
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
  return `${years} año${years > 1 ? 's' : ''}${rest ? ' ' + rest + ' m' : ''}`;
}
function randomColor() {
  const palette = ['#2f9e44', '#4c6ef5', '#f08c00', '#862e9c', '#e8590c', '#0ca678', '#c2255c'];
  return palette[state.sectors.length % palette.length];
}

boot().catch(err => {
  document.body.insertAdjacentHTML('afterbegin',
    `<p class="warn pad">No se pudo iniciar la aplicación: ${escapeHtml(String(err.message || err))}</p>`);
  console.error(err);
});

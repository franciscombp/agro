// Mapa 2D sobre imagen satelital. MapLibre GL (global `maplibregl`, servido desde ./vendor/).
// Fuente única de verdad: el estado que entrega app.js. Aquí sólo se dibuja y se editan geometrías.
"use strict";

import { toGeoJSONRing, bbox, areaM2, centroid } from './geo.js';
import { SPECIES, STATUS_COLORS } from './db.js';

const ESRI_IMAGERY = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

const INFRA_ICON = {
  reservorio: '💧', casa: '🏠', establo: '🐄', cuyera: '🐹',
  bomba: '⚙️', filtro: '🧽', 'válvula': '🔧'
};

export class FarmMap {
  constructor(container, handlers = {}) {
    this.handlers = handlers;
    this.mode = 'view';          // view | draw | move
    this.draft = [];             // vértices del polígono en dibujo
    this.editTarget = null;      // {kind:'boundary'|'sector', id}
    this.colorBy = 'species';    // species | status
    this.filters = { species: 'all', status: 'all', sectorId: 'all' };
    this.state = null;
    this.gpsMarker = null;

    this.map = new maplibregl.Map({
      container,
      style: {
        version: 8,
        sources: {
          satellite: {
            type: 'raster',
            tiles: [ESRI_IMAGERY],
            tileSize: 256,
            maxzoom: 19,
            attribution: 'Imagery © Esri, Maxar, Earthstar Geographics'
          }
        },
        layers: [{ id: 'satellite', type: 'raster', source: 'satellite' }]
      },
      center: [-78.62481, -1.07921],
      zoom: 17.5,
      maxZoom: 22,
      attributionControl: { compact: true }
    });

    this.map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    this.map.addControl(new maplibregl.ScaleControl({ maxWidth: 120, unit: 'metric' }), 'bottom-left');

    this.ready = new Promise(resolve => {
      this.map.on('load', () => { this._addLayers(); resolve(this); });
    });

    this.map.on('click', e => this._onClick(e));
  }

  _emptyFC() { return { type: 'FeatureCollection', features: [] }; }

  _addLayers() {
    const m = this.map;
    for (const id of ['boundary', 'sectors', 'draft', 'handles', 'points']) {
      m.addSource(id, { type: 'geojson', data: this._emptyFC() });
    }

    m.addLayer({
      id: 'boundary-fill', type: 'fill', source: 'boundary',
      paint: { 'fill-color': '#ffd43b', 'fill-opacity': 0.06 }
    });
    m.addLayer({
      id: 'boundary-line', type: 'line', source: 'boundary',
      paint: { 'line-color': '#ffd43b', 'line-width': 2.5 }
    });

    m.addLayer({
      id: 'sectors-fill', type: 'fill', source: 'sectors',
      paint: { 'fill-color': ['get', 'color'], 'fill-opacity': 0.32 }
    });
    m.addLayer({
      id: 'sectors-line', type: 'line', source: 'sectors',
      paint: { 'line-color': ['get', 'color'], 'line-width': 2 }
    });
    m.addLayer({
      id: 'draft-fill', type: 'fill', source: 'draft',
      paint: { 'fill-color': '#ff922b', 'fill-opacity': 0.25 }
    });
    m.addLayer({
      id: 'draft-line', type: 'line', source: 'draft',
      paint: { 'line-color': '#ff922b', 'line-width': 2, 'line-dasharray': [2, 1] }
    });

    m.addLayer({
      id: 'points-circle', type: 'circle', source: 'points',
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 16, 4, 20, 9],
        'circle-color': ['get', 'color'],
        'circle-stroke-color': '#fff',
        'circle-stroke-width': 1.5
      }
    });
    m.addLayer({
      id: 'handles', type: 'circle', source: 'handles',
      paint: {
        'circle-radius': 7,
        'circle-color': '#fff',
        'circle-stroke-color': '#e8590c',
        'circle-stroke-width': 2.5
      }
    });

    this._wireDragging();
    for (const layer of ['points-circle', 'sectors-fill', 'handles']) {
      m.on('mouseenter', layer, () => { m.getCanvas().style.cursor = 'pointer'; });
      m.on('mouseleave', layer, () => { m.getCanvas().style.cursor = ''; });
    }
  }

  // --- Arrastre de vértices y de puntos ---------------------------------
  _wireDragging() {
    const m = this.map;
    let dragging = null;

    const start = (e, layer) => {
      const feats = m.queryRenderedFeatures(e.point, { layers: [layer] });
      if (!feats.length) return false;
      dragging = { layer, props: feats[0].properties };
      e.preventDefault();
      m.dragPan.disable();
      return true;
    };

    const onDown = e => {
      if (this.mode === 'draw') return;
      if (start(e, 'handles')) return;
      if (this.mode === 'move') start(e, 'points-circle');
    };

    const onMove = e => {
      if (!dragging) return;
      const { lat, lng } = e.lngLat;
      if (dragging.layer === 'handles') {
        this._moveHandle(Number(dragging.props.index), [lat, lng]);
      } else {
        this._previewPoint(dragging.props.id, [lat, lng]);
      }
    };

    const onUp = e => {
      if (!dragging) return;
      const { lat, lng } = e.lngLat;
      const d = dragging;
      dragging = null;
      m.dragPan.enable();
      if (d.layer === 'handles') {
        this.handlers.onVertexMoved?.(this.editTarget, Number(d.props.index), [lat, lng]);
      } else {
        this.handlers.onPointMoved?.(d.props.kind, d.props.id, [lat, lng]);
      }
    };

    m.on('mousedown', onDown);
    m.on('touchstart', onDown);
    m.on('mousemove', onMove);
    m.on('touchmove', onMove);
    m.on('mouseup', onUp);
    m.on('touchend', onUp);
  }

  _moveHandle(index, latlng) {
    const ring = this._editRing();
    if (!ring) return;
    ring[index] = latlng;
    this._renderHandles(ring);
    if (this.editTarget.kind === 'boundary') this._renderBoundary(ring);
    else this._renderSectorsPreview(this.editTarget.id, ring);
  }

  _previewPoint(id, latlng) {
    const f = this._pointsData?.features.find(f => f.properties.id === id);
    if (!f) return;
    f.geometry.coordinates = [latlng[1], latlng[0]];
    this.map.getSource('points').setData(this._pointsData);
  }

  _editRing() {
    if (!this.editTarget) return null;
    return this.editTarget.kind === 'boundary' ? this._workingBoundary : this._workingSector;
  }

  // --- Click: dibujar o seleccionar -------------------------------------
  _onClick(e) {
    const { lat, lng } = e.lngLat;
    if (this.mode === 'draw') {
      this.draft.push([lat, lng]);
      this._renderDraft();
      this.handlers.onDraftChange?.(this.draft);
      return;
    }
    const feats = this.map.queryRenderedFeatures(e.point, { layers: ['points-circle'] });
    if (feats.length) {
      const p = feats[0].properties;
      this.handlers.onSelectPoint?.(p.kind, p.id);
      return;
    }
    const sec = this.map.queryRenderedFeatures(e.point, { layers: ['sectors-fill'] });
    if (sec.length) {
      this.handlers.onSelectSector?.(sec[0].properties.id);
      return;
    }
    this.handlers.onSelectNothing?.([lat, lng]);
  }

  // --- API pública -------------------------------------------------------
  setMode(mode) {
    this.mode = mode;
    if (mode !== 'draw') { this.draft = []; this._renderDraft(); }
    this.map.getCanvas().style.cursor = mode === 'draw' ? 'crosshair' : '';
    if (this.state) this._renderInfraMarkers();
  }

  undoDraft() {
    this.draft.pop();
    this._renderDraft();
    this.handlers.onDraftChange?.(this.draft);
  }

  getDraft() { return this.draft.map(p => [...p]); }

  setEditTarget(target) {
    this.editTarget = target;
    this._workingSector = null;
    if (!target) { this.map.getSource('handles').setData(this._emptyFC()); return; }
    if (target.kind === 'boundary') {
      this._workingBoundary = this.state.parcel.boundary.map(p => [...p]);
      this._renderHandles(this._workingBoundary);
    } else {
      const sector = this.state.sectors.find(s => s.id === target.id);
      if (!sector) return;
      this._workingSector = sector.polygon.map(p => [...p]);
      this._renderHandles(this._workingSector);
    }
  }

  setColorBy(mode) { this.colorBy = mode; this._renderPoints(); }
  setFilters(filters) { this.filters = { ...this.filters, ...filters }; this._renderPoints(); }

  render(state) {
    this.state = state;
    this._workingBoundary = state.parcel.boundary.map(p => [...p]);
    if (this._workingSector && this.editTarget?.kind === 'sector') {
      const s = state.sectors.find(s => s.id === this.editTarget.id);
      this._workingSector = s ? s.polygon.map(p => [...p]) : null;
    }
    this._renderBoundary(state.parcel.boundary);
    this._renderSectors();
    this._renderPoints();
    if (this.editTarget) this.setEditTarget(this.editTarget);
  }

  fitToParcel() {
    const b = bbox(this.state.parcel.boundary);
    this.map.fitBounds([[b.minLng, b.minLat], [b.maxLng, b.maxLat]], { padding: 40, duration: 600 });
  }

  flyTo([lat, lng], zoom = 20) {
    this.map.flyTo({ center: [lng, lat], zoom, duration: 800 });
  }

  showGps([lat, lng], accuracy) {
    if (!this.gpsMarker) {
      const el = document.createElement('div');
      el.className = 'gps-dot';
      this.gpsMarker = new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(this.map);
    } else {
      this.gpsMarker.setLngLat([lng, lat]);
    }
    this.gpsMarker.getElement().title = accuracy ? `Precisión ±${Math.round(accuracy)} m` : '';
  }

  // --- Render interno ----------------------------------------------------
  _renderBoundary(ring) {
    this.map.getSource('boundary').setData({
      type: 'Feature',
      properties: {},
      geometry: { type: 'Polygon', coordinates: [toGeoJSONRing(ring)] }
    });
  }

  _renderSectors() {
    const features = this.state.sectors.map(s => this._sectorFeature(s, s.polygon));
    this.map.getSource('sectors').setData({ type: 'FeatureCollection', features });
    this._renderSectorLabels();
  }

  /** Etiquetas como marcadores DOM: nombre y área en m², sin depender de glifos remotos. */
  _renderSectorLabels() {
    this._labels ||= new Map();
    const seen = new Set();

    for (const s of this.state.sectors) {
      seen.add(s.id);
      let marker = this._labels.get(s.id);
      if (!marker) {
        const el = document.createElement('div');
        el.className = 'sector-label';
        marker = new maplibregl.Marker({ element: el }).setLngLat([0, 0]).addTo(this.map);
        this._labels.set(s.id, marker);
      }
      const c = centroid(s.polygon);
      marker.setLngLat([c[1], c[0]]);
      marker.getElement().innerHTML =
        `<strong></strong><span>${Math.round(areaM2(s.polygon))} m²</span>`;
      marker.getElement().querySelector('strong').textContent = s.name;
    }

    for (const [id, marker] of this._labels) {
      if (!seen.has(id)) { marker.remove(); this._labels.delete(id); }
    }
  }

  _renderSectorsPreview(id, ring) {
    const features = this.state.sectors.map(s => this._sectorFeature(s, s.id === id ? ring : s.polygon));
    this.map.getSource('sectors').setData({ type: 'FeatureCollection', features });
  }

  _sectorFeature(s, ring) {
    return {
      type: 'Feature',
      properties: { id: s.id, color: s.color },
      geometry: { type: 'Polygon', coordinates: [toGeoJSONRing(ring)] }
    };
  }

  _renderDraft() {
    if (this.draft.length < 2) {
      this.map.getSource('draft').setData(this._emptyFC());
      return;
    }
    const geometry = this.draft.length < 3
      ? { type: 'LineString', coordinates: this.draft.map(([lat, lng]) => [lng, lat]) }
      : { type: 'Polygon', coordinates: [toGeoJSONRing(this.draft)] };
    this.map.getSource('draft').setData({ type: 'Feature', properties: {}, geometry });
  }

  _renderHandles(ring) {
    this.map.getSource('handles').setData({
      type: 'FeatureCollection',
      features: ring.map((p, index) => ({
        type: 'Feature',
        properties: { index },
        geometry: { type: 'Point', coordinates: [p[1], p[0]] }
      }))
    });
  }

  _renderPoints() {
    if (!this.state) return;
    const { species, status, sectorId } = this.filters;
    const features = [];

    for (const p of this.state.plants) {
      if (species !== 'all' && p.species !== species) continue;
      if (status !== 'all' && p.status !== status) continue;
      if (sectorId !== 'all' && p.sectorId !== sectorId) continue;
      const color = this.colorBy === 'status'
        ? (STATUS_COLORS[p.status] || '#868e96')
        : (SPECIES[p.species]?.color || '#868e96');
      features.push({
        type: 'Feature',
        properties: { id: p.id, kind: 'plant', color },
        geometry: { type: 'Point', coordinates: [p.lng, p.lat] }
      });
    }

    for (const e of this.state.elevations) {
      features.push({
        type: 'Feature',
        properties: { id: e.id, kind: 'elevation', color: e.measured ? '#1c7ed6' : '#adb5bd' },
        geometry: { type: 'Point', coordinates: [e.lng, e.lat] }
      });
    }

    this._pointsData = { type: 'FeatureCollection', features };
    this.map.getSource('points').setData(this._pointsData);
    this._renderInfraMarkers();
  }

  /** La infraestructura va como marcadores DOM: emoji legible y arrastrable. */
  _renderInfraMarkers() {
    this._infraMarkers ||= new Map();
    const seen = new Set();

    for (const i of this.state.infra) {
      seen.add(i.id);
      let marker = this._infraMarkers.get(i.id);
      if (!marker) {
        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'infra-pin';
        el.addEventListener('click', ev => {
          ev.stopPropagation();
          this.handlers.onSelectPoint?.('infra', i.id);
        });
        marker = new maplibregl.Marker({ element: el, draggable: true }).setLngLat([i.lng, i.lat]).addTo(this.map);
        marker.on('dragend', () => {
          const { lat, lng } = marker.getLngLat();
          this.handlers.onPointMoved?.('infra', i.id, [lat, lng]);
        });
        this._infraMarkers.set(i.id, marker);
      }
      marker.setLngLat([i.lng, i.lat]);
      marker.setDraggable(this.mode === 'move');
      const el = marker.getElement();
      el.textContent = INFRA_ICON[i.type] || '📍';
      el.title = i.type;
      el.classList.toggle('draggable', this.mode === 'move');
    }

    for (const [id, marker] of this._infraMarkers) {
      if (!seen.has(id)) { marker.remove(); this._infraMarkers.delete(id); }
    }
  }
}

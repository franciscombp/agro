// Vista 3D del terreno. Three.js + OrbitControls servidos desde ./lib/.
// Lee exactamente los mismos datos que el mapa 2D: una sola fuente de verdad.
"use strict";

import * as THREE from './lib/three.module.min.js';
import { OrbitControls } from './lib/OrbitControls.js';
import { bbox, centroid, toLocalMeters, interpolateElevation, pointInRing } from './geo.js';
import { SPECIES, STATUS_COLORS } from './db.js';

const GRID = 72; // subdivisiones por lado del terreno

export class Terrain3D {
  constructor(container) {
    this.container = container;
    this.exaggeration = 3;
    this.showArrows = true;
    this.colorBy = 'species';

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0b1a12');

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.5, 4000);
    this.camera.position.set(-140, 110, 110);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.maxPolarAngle = Math.PI / 2.05;

    this.scene.add(new THREE.HemisphereLight('#cfe8ff', '#2b3a2b', 1.0));
    const sun = new THREE.DirectionalLight('#fff6e0', 1.5);
    sun.position.set(-120, 160, 80);
    this.scene.add(sun);

    this.group = new THREE.Group();
    this.scene.add(this.group);

    this._onResize = () => this.resize();
    addEventListener('resize', this._onResize);
    this._animate();
  }

  resize() {
    const w = this.container.clientWidth || 1;
    const h = this.container.clientHeight || 1;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  setExaggeration(v) {
    this.exaggeration = v;
    if (this.state) this.render(this.state);
  }

  setColorBy(mode) {
    this.colorBy = mode;
    if (this.state) this.render(this.state);
  }

  toggleArrows(on) {
    this.showArrows = on;
    if (this.state) this.render(this.state);
  }

  /** state: {parcel, sectors, plants, infra, elevations} */
  render(state) {
    this.state = state;
    this.group.clear();

    const ring = state.parcel.boundary;
    const origin = centroid(ring);
    const b = bbox(ring);
    const sw = toLocalMeters([b.minLat, b.minLng], origin);
    const ne = toLocalMeters([b.maxLat, b.maxLng], origin);
    const pad = 12;
    const minX = sw.x - pad, maxX = ne.x + pad;
    const minY = sw.y - pad, maxY = ne.y + pad;

    const points = state.elevations.filter(e => typeof e.elevationM === 'number');
    if (!points.length) return;
    const elevs = points.map(p => p.elevationM);
    this.minElev = Math.min(...elevs);
    this.maxElev = Math.max(...elevs);
    this.origin = origin;

    const height = (lat, lng) => (interpolateElevation([lat, lng], points) - this.minElev) * this.exaggeration;
    const toLatLng = (x, y) => {
      const mPerDegLat = 111320;
      const mPerDegLng = 111320 * Math.cos((origin[0] * Math.PI) / 180);
      return [origin[0] + y / mPerDegLat, origin[1] + x / mPerDegLng];
    };
    this._height = height;
    this._toLatLng = toLatLng;

    this.group.add(this._buildTerrain(minX, maxX, minY, maxY, ring, height, toLatLng));
    this.group.add(this._buildRing(ring, origin, height, '#ffd43b', 1.2));
    for (const s of state.sectors) {
      this.group.add(this._buildRing(s.polygon, origin, height, s.color, 0.8));
    }
    this.group.add(this._buildPlants(state.plants, origin, height));
    this.group.add(this._buildInfra(state.infra, origin, height));
    if (this.showArrows) this.group.add(this._buildFlowArrows(ring, origin, points));

    this._frame(minX, maxX, minY, maxY, height(origin[0], origin[1]));
    this.resize();
  }

  /** Encuadra la finca completa; sólo la primera vez, para no pelear con el usuario. */
  _frame(minX, maxX, minY, maxY, centerHeight) {
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    this.controls.target.set(cx, centerHeight, cy);
    if (this._framed) { this.controls.update(); return; }
    const size = Math.max(maxX - minX, maxY - minY);
    // Desde el sureste y arriba: se ve la pendiente cayendo hacia la casa (este).
    this.camera.position.set(cx + size * 1.0, centerHeight + size * 0.7, cy + size * 0.95);
    this.camera.updateProjectionMatrix();
    this.controls.update();
    this._framed = true;
  }

  _buildTerrain(minX, maxX, minY, maxY, ring, height, toLatLng) {
    const geo = new THREE.PlaneGeometry(maxX - minX, maxY - minY, GRID, GRID);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const colors = [];
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    const low = new THREE.Color('#2f5d3a');
    const high = new THREE.Color('#c9b88a');
    const outside = new THREE.Color('#20302a');

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i) + cx;
      const z = pos.getZ(i) + cy;
      const [lat, lng] = toLatLng(x, z);
      const h = height(lat, lng);
      pos.setY(i, h);
      const t = (this.maxElev - this.minElev) > 0
        ? (h / this.exaggeration) / (this.maxElev - this.minElev)
        : 0;
      const inside = pointInRing([lat, lng], ring);
      const c = inside ? low.clone().lerp(high, t) : outside;
      colors.push(c.r, c.g, c.b);
    }
    // El plano se construye centrado en el origen local; lo movemos al bbox real.
    geo.translate(cx, 0, cy);
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();

    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      vertexColors: true, roughness: 0.95, metalness: 0, side: THREE.DoubleSide
    }));
    return mesh;
  }

  _buildRing(ring, origin, height, color, lift) {
    const pts = ring.map(([lat, lng]) => {
      const { x, y } = toLocalMeters([lat, lng], origin);
      return new THREE.Vector3(x, height(lat, lng) + lift, y);
    });
    pts.push(pts[0].clone());
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    return new THREE.Line(geo, new THREE.LineBasicMaterial({ color }));
  }

  _buildPlants(plants, origin, height) {
    const group = new THREE.Group();
    const geo = new THREE.ConeGeometry(1.1, 3.2, 7);
    const mats = new Map();
    for (const p of plants) {
      const key = this.colorBy === 'status'
        ? (STATUS_COLORS[p.status] || '#868e96')
        : (SPECIES[p.species]?.color || '#868e96');
      if (!mats.has(key)) mats.set(key, new THREE.MeshStandardMaterial({ color: key, roughness: 0.7 }));
      const mesh = new THREE.Mesh(geo, mats.get(key));
      const { x, y } = toLocalMeters([p.lat, p.lng], origin);
      mesh.position.set(x, height(p.lat, p.lng) + 1.6, y);
      group.add(mesh);
    }
    return group;
  }

  _buildInfra(infra, origin, height) {
    const group = new THREE.Group();
    for (const i of infra) {
      const isWater = i.type === 'reservorio';
      const geo = isWater
        ? new THREE.CylinderGeometry(4, 4, 2.5, 20)
        : new THREE.BoxGeometry(4, 3, 4);
      const mat = new THREE.MeshStandardMaterial({
        color: isWater ? '#4dabf7' : '#adb5bd',
        roughness: 0.5,
        transparent: isWater,
        opacity: isWater ? 0.85 : 1
      });
      const mesh = new THREE.Mesh(geo, mat);
      const { x, y } = toLocalMeters([i.lat, i.lng], origin);
      mesh.position.set(x, height(i.lat, i.lng) + 1.5, y);
      group.add(mesh);
    }
    return group;
  }

  /** Flechas de escurrimiento: dirección de máxima pendiente descendente. */
  _buildFlowArrows(ring, origin, points) {
    const group = new THREE.Group();
    const b = bbox(ring);
    const steps = 9;
    for (let i = 1; i < steps; i++) {
      for (let j = 1; j < steps; j++) {
        const lat = b.minLat + ((b.maxLat - b.minLat) * i) / steps;
        const lng = b.minLng + ((b.maxLng - b.minLng) * j) / steps;
        if (!pointInRing([lat, lng], ring)) continue;

        const d = 0.00004;
        const eC = interpolateElevation([lat, lng], points);
        const dzdx = interpolateElevation([lat, lng + d], points) - eC;
        const dzdy = interpolateElevation([lat + d, lng], points) - eC;
        const dir = new THREE.Vector3(-dzdx, 0, -dzdy);
        if (dir.lengthSq() === 0) continue;
        dir.normalize();

        const { x, y } = toLocalMeters([lat, lng], origin);
        const from = new THREE.Vector3(x, this._height(lat, lng) + 1.0, y);
        const arrow = new THREE.ArrowHelper(dir, from, 7, '#74c0fc', 2.2, 1.4);
        group.add(arrow);
      }
    }
    return group;
  }

  _animate() {
    this._raf = requestAnimationFrame(() => this._animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    cancelAnimationFrame(this._raf);
    removeEventListener('resize', this._onResize);
    this.renderer.dispose();
  }
}

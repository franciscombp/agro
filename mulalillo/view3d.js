// Vista 3D del terreno. Three.js + OrbitControls servidos desde ./lib/.
// Lee exactamente los mismos datos que el mapa 2D: una sola fuente de verdad.
"use strict";

import * as THREE from './lib/three.module.min.js';
import { OrbitControls } from './lib/OrbitControls.js';
import { bbox, centroid, toLocalMeters, interpolateElevation, pointInRing } from './geo.js';
import { SPECIES, STATUS_COLORS } from './db.js';

const GRID = 96;        // subdivisiones por lado del terreno
const SKIRT_DEPTH = 14; // metros de "tierra" bajo la superficie, para que sea un bloque
const CIELO = '#aecfe6';

/** Porte de cada especie en metros: tronco, copa y color del follaje. */
const PORTE = {
  aguacate: { trunk: 2.2, radius: 2.4, foliage: '#2b6e3a', shape: 'arbol' },
  peral:    { trunk: 2.0, radius: 1.9, foliage: '#3c7d45', shape: 'arbol' },
  mora:     { trunk: 0.6, radius: 1.1, foliage: '#4a7c3f', shape: 'arbusto' },
  arandano: { trunk: 0.3, radius: 0.75, foliage: '#5a8f5a', shape: 'arbusto' },
  lavanda:  { trunk: 0.2, radius: 0.45, foliage: '#8b7cc8', shape: 'arbusto' },
  hortaliza:{ trunk: 0.15, radius: 0.4, foliage: '#6aa84f', shape: 'arbusto' },
  pasto:    { trunk: 0.1, radius: 0.3, foliage: '#7cb342', shape: 'arbusto' },
  otro:     { trunk: 1.0, radius: 1.0, foliage: '#5f8f52', shape: 'arbusto' }
};

export class Terrain3D {
  constructor(container) {
    this.container = container;
    this.exaggeration = 3;
    this.showArrows = true;
    this.colorBy = 'species';

    this.scene = new THREE.Scene();
    // Cielo sólido + niebla del mismo tono: el horizonte se funde sin trucos.
    this.scene.background = new THREE.Color(CIELO);
    this.scene.fog = new THREE.Fog(CIELO, 200, 560);

    this.camera = new THREE.PerspectiveCamera(46, 1, 0.5, 2000);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.maxPolarAngle = Math.PI / 2.15;
    this.controls.minDistance = 25;
    this.controls.maxDistance = 600;

    // Luz de cielo suave + sol que proyecta sombras: sin sombras el relieve se aplana.
    this.scene.add(new THREE.HemisphereLight('#dff0ff', '#6b6048', 0.85));
    const sun = new THREE.DirectionalLight('#fff4de', 2.0);
    sun.position.set(-90, 120, 60);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 10;
    sun.shadow.camera.far = 400;
    const s = 130;
    Object.assign(sun.shadow.camera, { left: -s, right: s, top: s, bottom: -s });
    sun.shadow.bias = -0.0008;
    this.sun = sun;
    this.scene.add(sun);
    this.scene.add(sun.target);

    this.group = new THREE.Group();
    this.scene.add(this.group);

    this._disposables = [];
    this._onResize = () => this.resize();
    addEventListener('resize', this._onResize);
    this._animate();
  }

  resize() {
    const w = this.container.clientWidth || 1;
    const h = this.container.clientHeight || 1;
    // Con updateStyle en false el canvas conservaba su tamaño CSS anterior y, con
    // pixel ratio 2, se dibujaba al doble: sólo se veía la esquina del terreno.
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  setExaggeration(v) { this.exaggeration = v; if (this.state) this.render(this.state); }
  setColorBy(mode) { this.colorBy = mode; if (this.state) this.render(this.state); }
  toggleArrows(on) { this.showArrows = on; if (this.state) this.render(this.state); }

  /** state: {parcel, sectors, plants, infra, elevations} */
  render(state) {
    this.state = state;
    this._limpiar();

    const ring = state.parcel.boundary;
    const origin = centroid(ring);
    const b = bbox(ring);
    const sw = toLocalMeters([b.minLat, b.minLng], origin);
    const ne = toLocalMeters([b.maxLat, b.maxLng], origin);
    const pad = 10;
    const minX = sw.x - pad, maxX = ne.x + pad;
    const minY = sw.y - pad, maxY = ne.y + pad;

    const points = state.elevations.filter(e => typeof e.elevationM === 'number');
    if (!points.length) return;
    this.minElev = Math.min(...points.map(p => p.elevationM));
    this.maxElev = Math.max(...points.map(p => p.elevationM));

    // Todo se construye centrado en el medio del terreno: así la escena queda
    // encuadrada sola y la órbita gira alrededor de la finca, no de una esquina.
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const local = ([lat, lng]) => {
      const p = toLocalMeters([lat, lng], origin);
      return { x: p.x - cx, z: p.y - cy };
    };
    const height = (lat, lng) =>
      (interpolateElevation([lat, lng], points) - this.minElev) * this.exaggeration;
    const toLatLng = (x, z) => {
      const mPerDegLat = 111320;
      const mPerDegLng = 111320 * Math.cos((origin[0] * Math.PI) / 180);
      return [origin[0] + (z + cy) / mPerDegLat, origin[1] + (x + cx) / mPerDegLng];
    };
    this._local = local;
    this._height = height;

    const ancho = maxX - minX;
    const fondo = maxY - minY;

    this.group.add(this._terreno(ancho, fondo, ring, height, toLatLng));
    this.group.add(this._borde(ring, local, height, '#ffd84d', 1.0, 3));
    for (const sec of state.sectors) {
      this.group.add(this._borde(sec.polygon, local, height, sec.color, 0.6, 2));
    }
    this.group.add(this._plantas(state.plants, local, height));
    this.group.add(this._infra(state.infra, local, height));
    if (this.showArrows) this.group.add(this._flechas(ring, local, points));

    // El sol apunta al centro para que la sombra caiga sobre el terreno.
    this.sun.target.position.set(0, 0, 0);
    this.sun.target.updateMatrixWorld();

    // El encuadre depende de la relación de aspecto: hay que medirla antes.
    this.resize();
    this._encuadrar(ancho, fondo, height(origin[0], origin[1]));
  }

  /**
   * Encuadre inicial calculado, no a ojo: distancia que mete la esfera que
   * envuelve al terreno dentro del campo de visión, también en pantalla angosta.
   * Después manda el usuario y no se le vuelve a mover la cámara.
   */
  _encuadrar(ancho, fondo, alturaCentro) {
    this.controls.target.set(0, alturaCentro * 0.4, 0);
    if (!this._encuadrado) {
      const radio = Math.hypot(ancho, fondo) / 2;
      const vFov = (this.camera.fov * Math.PI) / 180;
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * this.camera.aspect);
      // En vertical manda el campo horizontal: si no, el terreno se sale por los lados.
      const dist = (radio / Math.tan(Math.min(vFov, hFov) / 2)) * 1.02;
      const dir = new THREE.Vector3(0.62, 0.52, 0.58).normalize();
      this.camera.position.copy(dir.multiplyScalar(dist)).add(this.controls.target);
      this.camera.updateProjectionMatrix();
      // La niebla se ata a la distancia de encuadre; fija, lavaba toda la escena.
      this.scene.fog.near = dist * 0.85;
      this.scene.fog.far = dist * 2.6;
      this._encuadrado = true;
    }
    this.controls.update();
  }

  /** Vuelve al encuadre inicial: en 3D es fácil perderse orbitando. */
  recentrar() {
    this._encuadrado = false;
    if (this.state) this.render(this.state);
  }

  // --- Terreno --------------------------------------------------------------

  /** Superficie + faldón lateral + base: un bloque de tierra, no una sábana. */
  _terreno(ancho, fondo, ring, height, toLatLng) {
    const grupo = new THREE.Group();

    const geo = new THREE.PlaneGeometry(ancho, fondo, GRID, GRID);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const colores = [];

    const bajo = new THREE.Color('#3f7a45');
    const medio = new THREE.Color('#7e9b52');
    const alto = new THREE.Color('#c4b184');
    const fuera = new THREE.Color('#6e7a63');
    const rango = this.maxElev - this.minElev;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const [lat, lng] = toLatLng(x, z);
      const h = height(lat, lng);
      pos.setY(i, h);

      const t = rango > 0 ? (h / this.exaggeration) / rango : 0;
      const c = t < 0.5
        ? bajo.clone().lerp(medio, t * 2)
        : medio.clone().lerp(alto, (t - 0.5) * 2);
      if (!pointInRing([lat, lng], ring)) c.lerp(fuera, 0.55);
      colores.push(c.r, c.g, c.b);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colores, 3));
    geo.computeVertexNormals();

    const matSuelo = new THREE.MeshStandardMaterial({
      vertexColors: true, roughness: 0.95, metalness: 0
    });
    const suelo = new THREE.Mesh(geo, matSuelo);
    suelo.receiveShadow = true;
    grupo.add(suelo);
    this._disposables.push(geo, matSuelo);

    const faldon = this._faldon(geo, ancho, fondo);
    grupo.add(faldon);
    return grupo;
  }

  /** Paredes laterales de tierra, tomadas del borde de la malla de superficie. */
  _faldon(geoSuperficie, ancho, fondo) {
    const pos = geoSuperficie.attributes.position;
    const n = GRID + 1;
    const idx = (col, fila) => fila * n + col;
    const base = -SKIRT_DEPTH;
    const vertices = [];

    const pared = (a, b) => {
      const ax = pos.getX(a), ay = pos.getY(a), az = pos.getZ(a);
      const bx = pos.getX(b), by = pos.getY(b), bz = pos.getZ(b);
      vertices.push(ax, ay, az, bx, by, bz, bx, base, bz);
      vertices.push(ax, ay, az, bx, base, bz, ax, base, az);
    };

    for (let c = 0; c < GRID; c++) {
      pared(idx(c + 1, 0), idx(c, 0));              // norte
      pared(idx(c, GRID), idx(c + 1, GRID));        // sur
    }
    for (let f = 0; f < GRID; f++) {
      pared(idx(0, f), idx(0, f + 1));              // oeste
      pared(idx(GRID, f + 1), idx(GRID, f));        // este
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      color: '#6b5842', roughness: 1, metalness: 0, side: THREE.DoubleSide
    });
    this._disposables.push(geo, mat);
    return new THREE.Mesh(geo, mat);
  }

  _borde(ring, local, height, color, lift, grosor) {
    const pts = ring.map(([lat, lng]) => {
      const { x, z } = local([lat, lng]);
      return new THREE.Vector3(x, height(lat, lng) + lift, z);
    });
    pts.push(pts[0].clone());
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color, linewidth: grosor });
    this._disposables.push(geo, mat);
    return new THREE.Line(geo, mat);
  }

  // --- Plantas --------------------------------------------------------------

  /**
   * Un tronco y una copa por planta, en malla instanciada: con cientos de
   * plantas sembradas, un objeto por pieza haría caer los fotogramas.
   */
  _plantas(plants, local, height) {
    const grupo = new THREE.Group();
    if (!plants.length) return grupo;

    const porEspecie = new Map();
    for (const p of plants) {
      if (p.status === 'muerto') continue;
      if (!porEspecie.has(p.species)) porEspecie.set(p.species, []);
      porEspecie.get(p.species).push(p);
    }

    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const escala = new THREE.Vector3();
    const posicion = new THREE.Vector3();
    const color = new THREE.Color();

    for (const [especie, lista] of porEspecie) {
      const porte = PORTE[especie] || PORTE.otro;
      const esArbol = porte.shape === 'arbol';

      const troncoGeo = new THREE.CylinderGeometry(
        porte.radius * 0.09, porte.radius * 0.14, porte.trunk, 6
      );
      troncoGeo.translate(0, porte.trunk / 2, 0);
      const troncoMat = new THREE.MeshStandardMaterial({ color: '#6b4f33', roughness: 0.9 });

      // Copa facetada: se lee como vegetación sin costar triángulos.
      const copaGeo = new THREE.IcosahedronGeometry(porte.radius, esArbol ? 1 : 0);
      copaGeo.scale(1, esArbol ? 1.15 : 0.8, 1);
      copaGeo.translate(0, porte.trunk + porte.radius * (esArbol ? 0.75 : 0.35), 0);
      const copaMat = new THREE.MeshStandardMaterial({ roughness: 0.85, flatShading: true });

      const troncos = new THREE.InstancedMesh(troncoGeo, troncoMat, lista.length);
      const copas = new THREE.InstancedMesh(copaGeo, copaMat, lista.length);
      troncos.castShadow = copas.castShadow = true;
      copas.receiveShadow = true;

      lista.forEach((p, i) => {
        const { x, z } = local([p.lat, p.lng]);
        posicion.set(x, height(p.lat, p.lng), z);
        // Variación determinista de porte y giro: un bloque clonado se ve falso.
        const semilla = hash(p.id);
        const f = 0.85 + (semilla % 30) / 100;
        escala.set(f, f, f);
        q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), (semilla % 360) * Math.PI / 180);
        m.compose(posicion, q, escala);
        troncos.setMatrixAt(i, m);
        copas.setMatrixAt(i, m);

        const hex = this.colorBy === 'status'
          ? (STATUS_COLORS[p.status] || '#868e96')
          : porte.foliage;
        color.set(hex);
        if (this.colorBy === 'species') {
          // Tinte propio por planta para que la masa no sea un bloque plano.
          const v = 1 + (((semilla >> 3) % 16) - 8) / 100;
          color.multiplyScalar(v);
        }
        copas.setColorAt(i, color);
      });

      troncos.instanceMatrix.needsUpdate = true;
      copas.instanceMatrix.needsUpdate = true;
      if (copas.instanceColor) copas.instanceColor.needsUpdate = true;

      if (porte.trunk > 0.25) grupo.add(troncos);
      grupo.add(copas);
      this._disposables.push(troncoGeo, troncoMat, copaGeo, copaMat);
    }
    return grupo;
  }

  // --- Infraestructura ------------------------------------------------------

  _infra(infra, local, height) {
    const grupo = new THREE.Group();
    for (const i of infra) {
      const { x, z } = local([i.lat, i.lng]);
      const y = height(i.lat, i.lng);
      const pieza = i.type === 'reservorio' ? this._reservorio(i) : this._construccion(i.type);
      pieza.position.set(x, y, z);
      grupo.add(pieza);
    }
    return grupo;
  }

  _reservorio(infra) {
    const grupo = new THREE.Group();
    const r = Math.max(2.5, Math.cbrt((infra.props?.volumenM3 || 80) * 0.35));
    const alto = 2.6;

    const muroGeo = new THREE.CylinderGeometry(r, r, alto, 24, 1, true);
    const muroMat = new THREE.MeshStandardMaterial({
      color: '#b9b3a6', roughness: 0.9, side: THREE.DoubleSide
    });
    const muro = new THREE.Mesh(muroGeo, muroMat);
    muro.position.y = alto / 2;
    muro.castShadow = muro.receiveShadow = true;
    grupo.add(muro);

    const aguaGeo = new THREE.CircleGeometry(r * 0.96, 24);
    aguaGeo.rotateX(-Math.PI / 2);
    const aguaMat = new THREE.MeshStandardMaterial({
      color: '#2f86c9', roughness: 0.15, metalness: 0.35,
      transparent: true, opacity: 0.9
    });
    const agua = new THREE.Mesh(aguaGeo, aguaMat);
    agua.position.y = alto * 0.78;
    grupo.add(agua);

    this._disposables.push(muroGeo, muroMat, aguaGeo, aguaMat);
    return grupo;
  }

  /** Caja con techo a dos aguas: casa, establo y cuyera se distinguen por tamaño. */
  _construccion(tipo) {
    const medidas = {
      casa:    { w: 7, d: 6, h: 3.2, techo: '#9c4a3c' },
      establo: { w: 8, d: 5, h: 2.8, techo: '#7d6b52' },
      cuyera:  { w: 4, d: 3, h: 2.0, techo: '#8a7f6a' },
      bomba:   { w: 1.4, d: 1.4, h: 1.2, techo: '#5a6570' },
      filtro:  { w: 1.2, d: 1.2, h: 1.6, techo: '#5a6570' },
      'válvula': { w: 0.8, d: 0.8, h: 0.8, techo: '#5a6570' }
    }[tipo] || { w: 3, d: 3, h: 2.4, techo: '#7d6b52' };

    const grupo = new THREE.Group();

    const muroGeo = new THREE.BoxGeometry(medidas.w, medidas.h, medidas.d);
    const muroMat = new THREE.MeshStandardMaterial({ color: '#e6ded0', roughness: 0.85 });
    const muro = new THREE.Mesh(muroGeo, muroMat);
    muro.position.y = medidas.h / 2;
    muro.castShadow = muro.receiveShadow = true;
    grupo.add(muro);

    // Prisma de 4 lados girado 45°: un techo a dos aguas bien barato.
    const techoGeo = new THREE.ConeGeometry(Math.max(medidas.w, medidas.d) * 0.78, medidas.h * 0.62, 4);
    const techoMat = new THREE.MeshStandardMaterial({ color: medidas.techo, roughness: 0.8 });
    const techo = new THREE.Mesh(techoGeo, techoMat);
    techo.position.y = medidas.h + medidas.h * 0.31;
    techo.rotation.y = Math.PI / 4;
    techo.castShadow = true;
    grupo.add(techo);

    this._disposables.push(muroGeo, muroMat, techoGeo, techoMat);
    return grupo;
  }

  // --- Escurrimiento --------------------------------------------------------

  _flechas(ring, local, points) {
    const grupo = new THREE.Group();
    const b = bbox(ring);
    const pasos = 10;

    for (let i = 1; i < pasos; i++) {
      for (let j = 1; j < pasos; j++) {
        const lat = b.minLat + ((b.maxLat - b.minLat) * i) / pasos;
        const lng = b.minLng + ((b.maxLng - b.minLng) * j) / pasos;
        if (!pointInRing([lat, lng], ring)) continue;

        const d = 0.00004;
        const eC = interpolateElevation([lat, lng], points);
        const dir = new THREE.Vector3(
          -(interpolateElevation([lat, lng + d], points) - eC), 0,
          -(interpolateElevation([lat + d, lng], points) - eC)
        );
        if (dir.lengthSq() === 0) continue;
        dir.normalize();

        const { x, z } = local([lat, lng]);
        const desde = new THREE.Vector3(x, this._height(lat, lng) + 1.2, z);
        const flecha = new THREE.ArrowHelper(dir, desde, 6.5, '#2f86c9', 2.4, 1.6);
        flecha.line.material.transparent = true;
        flecha.line.material.opacity = 0.75;
        grupo.add(flecha);
      }
    }
    return grupo;
  }

  // --- Ciclo de vida --------------------------------------------------------

  _limpiar() {
    for (const d of this._disposables) d.dispose?.();
    this._disposables = [];
    this.group.clear();
  }

  _animate() {
    this._raf = requestAnimationFrame(() => this._animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    cancelAnimationFrame(this._raf);
    removeEventListener('resize', this._onResize);
    this._limpiar();
    this.renderer.dispose();
  }
}

/** Hash estable del id: la misma planta se ve igual entre recargas. */
function hash(id) {
  let h = 0;
  for (let i = 0; i < String(id).length; i++) h = (h * 31 + String(id).charCodeAt(i)) >>> 0;
  return h;
}

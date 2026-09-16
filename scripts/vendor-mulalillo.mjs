// Copia las librerías del mapa y del 3D a mulalillo/lib/.
// La PoC no carga nada de un CDN: debe abrir sin señal desde la primera visita.
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const dest = path.join(root, 'mulalillo', 'lib');

const FILES = [
  ['node_modules/maplibre-gl/dist/maplibre-gl.js', 'maplibre-gl.js'],
  ['node_modules/maplibre-gl/dist/maplibre-gl.css', 'maplibre-gl.css'],
  ['node_modules/three/build/three.module.min.js', 'three.module.min.js'],
  // Mismo contenido bajo el nombre anterior: un caché viejo que aún pida
  // three.module.js encuentra el archivo en vez de romperse con un 404.
  ['node_modules/three/build/three.module.min.js', 'three.module.js'],
  ['node_modules/three/examples/jsm/controls/OrbitControls.js', 'OrbitControls.js']
];

fs.mkdirSync(dest, { recursive: true });

let missing = 0;
for (const [src, name] of FILES) {
  const from = path.join(root, src);
  if (!fs.existsSync(from)) {
    console.error(`[vendor-mulalillo] falta ${src} — ejecuta npm install`);
    missing++;
    continue;
  }
  let content = fs.readFileSync(from, 'utf-8');
  if (name === 'OrbitControls.js') {
    // Sin importmap: el módulo resuelve three por ruta relativa.
    content = content.replace(/from ['"]three['"]/g, "from './three.module.min.js'");
  }
  fs.writeFileSync(path.join(dest, name), content);
}

if (missing) process.exit(1);
console.log(`[vendor-mulalillo] ${FILES.length} archivos copiados a mulalillo/lib/`);

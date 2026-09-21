// Copia mal-ds desde un clon de franciscombp/mal a ds/ de este repositorio.
//
// Por qué una copia y no el CDN ni un submódulo:
//   · La app de la finca tiene que abrir sin señal DESDE LA PRIMERA VISITA,
//     así que no puede depender de jsdelivr en el primer arranque.
//   · GitHub Pages sirve la rama `main` tal cual: lo que no esté commiteado
//     devuelve 404, y los submódulos no se resuelven.
// Es el tercer camino que ofrece el propio README del sistema.
//
//   node scripts/vendor-ds.mjs [ruta-al-clon]    actualiza ds/
//   node scripts/vendor-ds.mjs --verifica        falla si ds/ no coincide
//
// Tras actualizar hay que COMMITEAR ds/ y subir la versión del service worker
// de cada app, o los navegadores seguirán sirviendo la copia vieja.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const verifica = args.includes('--verifica');
const clon = args.find(a => !a.startsWith('--')) || '/home/user/franciscombp/mal';

/* El tema `apps` declara --ref-display:var(--ref-texto), o sea que no usa Syne;
   PT Serif y Montserrat son del tema del periódico. Copiar las once fuentes
   metería 360 kB en el repositorio para no usar ocho de ellas. Las @font-face
   de las familias ausentes no se descargan nunca: el navegador sólo pide la
   fuente de una familia que algún elemento use. */
const ARCHIVOS = [
  ['ds/mal/mal.css', 'ds/mal/mal.css'],
  ['ds/mal/iconos.svg', 'ds/mal/iconos.svg'],
  ['ds/version.json', 'ds/version.json'],
  ['ds/fonts/inter.woff2', 'ds/fonts/inter.woff2'],
  ['ds/fonts/inter-italic.woff2', 'ds/fonts/inter-italic.woff2'],
  ['ds/fonts/jetbrains-mono.woff2', 'ds/fonts/jetbrains-mono.woff2']
];

const sha = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 12);

if (!existsSync(join(clon, 'ds/mal/mal.css'))) {
  console.error(`[vendor-ds] no encuentro el sistema en ${clon}`);
  console.error('            clónalo: git clone --depth 1 https://github.com/franciscombp/mal <ruta>');
  process.exit(1);
}

const version = JSON.parse(readFileSync(join(clon, 'ds/version.json'), 'utf8'));
let desviados = 0;

for (const [origen, destino] of ARCHIVOS) {
  const contenido = readFileSync(join(clon, origen));
  const ruta = join(raiz, destino);

  if (verifica) {
    if (!existsSync(ruta) || sha(readFileSync(ruta)) !== sha(contenido)) {
      console.error(`[vendor-ds] desviado: ${destino}`);
      desviados++;
    }
    continue;
  }
  mkdirSync(dirname(ruta), { recursive: true });
  writeFileSync(ruta, contenido);
}

if (verifica) {
  if (desviados) {
    console.error(`[vendor-ds] ${desviados} archivo(s) fuera de sincronía con mal-ds ${version.version}`);
    process.exit(1);
  }
  console.log(`[vendor-ds] ds/ coincide con mal-ds ${version.version}`);
} else {
  // Deja constancia de qué versión es esta copia y de dónde salió.
  writeFileSync(join(raiz, 'ds/PROCEDENCIA.json'), JSON.stringify({
    paquete: 'mal-ds',
    version: version.version,
    origen: 'https://github.com/franciscombp/mal',
    directorio: 'ds/',
    copiado: new Date().toISOString().slice(0, 10),
    fuentes: 'sólo las del tema apps (Inter, Inter cursiva, JetBrains Mono)',
    actualizar: 'node scripts/vendor-ds.mjs <ruta-al-clon> && commitear ds/'
  }, null, 2) + '\n');
  console.log(`[vendor-ds] ds/ actualizado a mal-ds ${version.version} (${ARCHIVOS.length} archivos)`);
}

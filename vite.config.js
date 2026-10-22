import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name)
    const to = path.join(dest, entry.name)
    if (entry.isDirectory()) copyDir(from, to)
    else fs.copyFileSync(from, to)
  }
}

export default defineConfig({
  base: '/agro/',
  build: {
    outDir: 'dist'
  },
  plugins: [
    {
      name: 'copy-assets',
      apply: 'build',
      generateBundle() {
        // La app son módulos ES sin empaquetar: se copian tal cual.
        const filesToCopy = ['index.html', 'styles.css', 'app.js', 'estado.js', 'ui.js', 'fechas.js',
          'db.js', 'carencia.js', 'hongos.js', 'geo.js', 'map2d.js', 'water.js', 'clima.js', 'sensores.js', 'normaliza.js',
          'hydraulics.js', 'planting.js', 'view3d.js', 'sw.js', 'manifest.webmanifest', 'diagnostico.html'];
        filesToCopy.forEach(file => {
          const src = path.join(process.cwd(), file);
          if (fs.existsSync(src)) {
            const content = fs.readFileSync(src, 'utf-8');
            this.emitFile({
              type: 'asset',
              fileName: file,
              source: content
            });
          }
        });
      }
    },
    {
      name: 'copy-dirs',
      apply: 'build',
      writeBundle() {
        // mal-ds vendorizado, librerías del mapa y del 3D, el huerto, las vistas,
        // y la redirección de la dirección vieja de la finca.
        for (const dir of ['ds', 'lib', 'huerto', 'vistas', 'mulalillo']) {
          const src = path.join(process.cwd(), dir)
          if (fs.existsSync(src)) copyDir(src, path.join(process.cwd(), 'dist', dir))
        }
      }
    },
    {
      name: 'nojekyll',
      apply: 'build',
      writeBundle() {
        // Sin este archivo, GitHub Pages pasa el sitio por Jekyll, que descarta
        // directorios de su lista de exclusión (vendor/, node_modules/…). Por eso
        // lib/ o vendor/ podían devolver 404 aunque estuvieran en la rama publicada.
        fs.writeFileSync(path.join(process.cwd(), 'dist', '.nojekyll'), '')
      }
    },
    {
      name: 'copy-icons',
      apply: 'build',
      writeBundle() {
        const src = path.join(process.cwd(), 'icons');
        const dist = path.join(process.cwd(), 'dist', 'icons');
        if (fs.existsSync(src)) {
          if (!fs.existsSync(dist)) fs.mkdirSync(dist, { recursive: true });
          fs.readdirSync(src).forEach(file => {
            fs.copyFileSync(path.join(src, file), path.join(dist, file));
          });
        }
      }
    },
    {
      name: 'fix-paths',
      apply: 'build',
      writeBundle() {
        const indexPath = path.join('dist', 'index.html')
        if (fs.existsSync(indexPath)) {
          let html = fs.readFileSync(indexPath, 'utf-8')
          html = html.replace(/href="\.\//g, 'href="/agro/')
          html = html.replace(/src="\.\//g, 'src="/agro/')
          fs.writeFileSync(indexPath, html, 'utf-8')
        }
      }
    }
  ]
})

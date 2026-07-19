import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

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
        const filesToCopy = ['index.html', 'styles.css', 'app.js', 'data.js', 'notify.js', 'sw.js', 'manifest.webmanifest'];
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

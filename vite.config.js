import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  base: '/agro/',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    copyPublicDir: true
  },
  plugins: [
    {
      name: 'fix-public-paths',
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

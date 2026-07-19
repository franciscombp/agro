import { defineConfig } from 'vite'

export default defineConfig({
  base: '/agro/',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    copyPublicDir: true
  }
})

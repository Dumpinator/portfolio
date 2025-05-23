import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/portfolio/',
  publicDir: 'public',
  build: {
    assetsDir: ''
  }
})
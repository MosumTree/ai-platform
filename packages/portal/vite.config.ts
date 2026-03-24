// Spec: specs/portal/home.spec.md
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5175,
    proxy: {
      '/rest/cbc/aiplatform': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})

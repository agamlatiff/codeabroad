import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-router')) {
            return 'react-router'
          }
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'tanstack-query'
          }
          if (id.includes('node_modules/@phosphor-icons')) {
            return 'phosphor-icons'
          }
        },
      },
    },
  },
})

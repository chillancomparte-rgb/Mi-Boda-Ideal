import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; // Importar 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: { // Añadir configuración de resolución
    alias: {
      '@services': path.resolve(__dirname, './services'),
      '@types': path.resolve(__dirname, './types'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})
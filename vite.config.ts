import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  appType: 'spa',
  define: {
    'process.env': {}
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  server: {
    port: 3000,
    strictPort: false,
    hmr: {
      host: 'localhost',
      port: 3000
    }
  },
  preview: {
    port: 4173,
    host: '127.0.0.1'
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: ['@prisma/client'],
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'vuex'],
          ui: ['vuetify', '@mdi/js'],
          api: ['axios']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'vuex', 'axios', 'vuetify']
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use /ts-viz/ only on GitHub Pages, otherwise use absolute root /
  base: process.env.GITHUB_ACTIONS === 'true' ? '/ts-viz/' : '/',
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-ui': ['recharts', 'framer-motion', 'lucide-react'],
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'models-data': ['./src/data/models.js'],
        },
      },
    },
  },
})

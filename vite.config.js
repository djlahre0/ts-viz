import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use /ts-viz/ only on GitHub Pages, otherwise use absolute root /
  base: process.env.GITHUB_ACTIONS === 'true' ? '/ts-viz/' : '/',
})

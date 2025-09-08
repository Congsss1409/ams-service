import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This is the proxy configuration
    proxy: {
      // Any request starting with /api will be forwarded to the Laravel backend
      '/api': {
        target: 'https://331225b6a1e3.ngrok-free.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

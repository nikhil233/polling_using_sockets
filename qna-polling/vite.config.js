import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    watch: {
      usePolling: true,
      exclude: "node_modules/**",
    },
  },
})

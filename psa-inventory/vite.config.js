import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,      // This forces it to use your IP address
    port: 3000,      // This forces it to use port 3000
    strictPort: true, // This makes it crash if the port is blocked (so we know!)
    watch: {
      usePolling: true, // This fixes the "hanging" on some Windows computers
    }
  }
})
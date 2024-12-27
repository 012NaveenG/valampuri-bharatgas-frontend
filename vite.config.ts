import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },


  server: {
    proxy: {
      '/api': {
        // target: 'http://localhost:4000'
        target: 'https://valampuri-bharatgas-backend.onrender.com'
      }
    },
    host: true, // Or specify the IP address like '192.168.x.x'
    port: 5173, // Optional: Customize the port
  },


})

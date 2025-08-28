import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  // Ensure environment variables are properly loaded
  envPrefix: 'VITE_',
  server: {
    host: true,
    port: 5173
  }
})

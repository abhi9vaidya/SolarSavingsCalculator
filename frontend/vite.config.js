import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for our Solar Calculator
// This tells Vite how to build and serve our React app
export default defineConfig({
  plugins: [react()],

  // Development server settings
  server: {
    port: 5173, // The port where our React app will run during development

    // Proxy setup - this forwards API calls to our backend server
    // When we call /api/solar in our React app, it goes to http://localhost:3000/api/solar
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Our backend server
        changeOrigin: true,
      }
    }
  },

  // Build settings for production
  build: {
    outDir: 'dist', // Where the final built files will go
    sourcemap: false, // Don't create source maps for production
  }
})

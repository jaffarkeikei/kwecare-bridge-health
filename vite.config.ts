import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// Temporarily commented out to prevent ESM issues
// import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "localhost", // Changed from :: to localhost to avoid IPv6 issues
    port: 5173, // Standard Vite port
    strictPort: false, // Allow fallback to another port if 5173 is in use
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  plugins: [
    react(),
    // Temporarily disabled to prevent ESM errors
    // mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

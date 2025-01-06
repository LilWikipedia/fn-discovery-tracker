import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Proxy /api requests to the target website
      '/api': {
        target: 'https://fortnite.gg',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Removes /api prefix
      },
    },
  },
  plugins: [
    react(),
  ].filter(Boolean),
  base: '/fn-discovery-tracker/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

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
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
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

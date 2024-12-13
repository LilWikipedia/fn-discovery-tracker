import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  plugins: [react()].filter(Boolean),
  base: '/fn-discovery-tracker/',
  server: {
    host: "::",
    port: 8080, 
    proxy: {
      '/api': {target: 'http://localhost:3001', changeOrigin: true}
      
    
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
}}));

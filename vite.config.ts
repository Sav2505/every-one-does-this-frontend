import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['every-one-does-this-frontend.onrender.com'],
  },
});

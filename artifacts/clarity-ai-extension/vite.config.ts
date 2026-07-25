import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Builds only the popup as a standalone React SPA.
// Content script and background are bundled separately by esbuild in build.mjs.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  root: path.resolve(__dirname, "src/popup"),
  // Use relative base so asset URLs work when Chrome loads the popup
  base: "./",
  build: {
    outDir: path.resolve(__dirname, "dist/popup"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "src/popup/index.html"),
    },
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const r = (p) => fileURLToPath(new URL(p, import.meta.url));

// Source lives in web/ and builds OUT to the repo root, because GitHub Pages
// for this repo serves the `main` branch root directly (no Actions build).
// base must match the project-page path: https://acgitprojects.github.io/CNCE-ESG-LED-WALL/
export default defineConfig({
  root: r('web'),
  base: '/CNCE-ESG-LED-WALL/',
  plugins: [react()],
  build: {
    outDir: r('.'),
    emptyOutDir: false, // outDir is the repo root — never wipe it
    rollupOptions: {
      input: {
        main: r('web/index.html'),
        dashboard: r('web/dashboard.html'),
      },
    },
  },
});

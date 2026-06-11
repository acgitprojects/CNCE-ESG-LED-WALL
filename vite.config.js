import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Project page lives at https://acgitprojects.github.io/CNCE-ESG-LED-WALL/
// so every asset/script must be prefixed with the repo name.
export default defineConfig({
  base: '/CNCE-ESG-LED-WALL/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        dashboard: 'dashboard.html',
      },
    },
  },
});

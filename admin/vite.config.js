import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// This is a SEPARATE admin panel app. It runs on its own port and talks
// to the SAME backend API as the main reader-facing site (inews/client).
// Anything uploaded here (news/video/e-paper) is saved by the shared
// backend and instantly shows up on the main website, because both
// apps hit the same /api endpoints.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
});

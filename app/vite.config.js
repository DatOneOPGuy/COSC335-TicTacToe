import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/save-game': {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
        },
      },
      watch: {
        usePolling: true,
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./tests/setup.js'],
      deps: {
        inline: ['firebase']
      },
      testTimeout: 5000, // Reduce from 10000 to 5000
      mockReset: true,
      poolOptions: {
        threads: false  // Disable threading here instead
      }
    },
  });
};
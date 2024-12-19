import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { cwd } from 'node:process';

export default defineConfig(({ mode }) => {
  console.info(`Running in "${mode}" mode`);

  return {
    publicDir: 'public',
    envPrefix: 'EASY_GEN_',
    outDir: 'dist',
    envDir: cwd(),
    server: {
      port: 4096,
      host: '0.0.0.0',
      open: '/sign-in',
    },
    resolve: {
      alias: {
        '@src': cwd() + '/src',
      },
    },
    base: './',
    build: {
      chunkSizeWarningLimit: 700,
      reportCompressedSize: true,
      sourcemap: true,
      assetsDir: '.',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          index: 'index.html',
        },
      },
    },
    plugins: [react()],
    test: {
      clearMocks: true,
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./tests/setup.ts'],
      alias: {
        '@src': cwd() + '/src',
      },
    },
  };
});

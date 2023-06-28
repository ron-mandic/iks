import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/iks/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        doaa: resolve(__dirname, 'doaa/index.html'),
        playground: resolve(__dirname, 'playground/index.html'),
      },
    },
  },
});

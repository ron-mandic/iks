import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/iks/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        overview: resolve(__dirname, 'overview/index.html'),
        doaa: resolve(__dirname, 'doaa/index.html'),
        gallery: resolve(__dirname, 'gallery/index.html'),
        // ... and so on
        playground: resolve(__dirname, 'playground/index.html'),
        alt: resolve(__dirname, 'alt/index.html'),
      },
    },
  },
});

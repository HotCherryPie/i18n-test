import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import macros from 'unplugin-macros/vite';

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [macros(), vue()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}));

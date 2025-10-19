import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import ViteFonts from 'unplugin-fonts/vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    Vuetify(),
    ViteFonts({
      google: {
        families: [
          {
            name: 'Roboto',
            styles: 'wght@100;300;400;500;700;900',
          },
        ],
      },
    }),
  ],
  base: '/hollowknight-app/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
      '@map': fileURLToPath(new URL('./src/services/HKMap', import.meta.url)),
      '@elements': fileURLToPath(new URL('./src/services/Elements', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@images': fileURLToPath(new URL('./src/assets/images', import.meta.url)),
      '@charms': fileURLToPath(new URL('./src/assets/charms', import.meta.url)),
      '@pins': fileURLToPath(new URL('./src/assets/pins', import.meta.url)),
    },
  },
});

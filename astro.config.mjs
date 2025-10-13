import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import createSitemap from './src/utils/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://appfun.fun',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    createSitemap(),
  ],
  output: 'static',
  server: {
    port: 3000,
    host: true
  },
  build: {
    assets: 'assets'
  },
  vite: {
    optimizeDeps: {
      include: ['react', 'react-dom']
    }
  }
});

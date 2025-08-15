import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
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

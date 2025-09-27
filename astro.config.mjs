import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// 检查环境是否为Vercel
const isVercel = process.env.VERCEL === '1';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],
  output: isVercel ? 'hybrid' : 'server',
  adapter: isVercel ? undefined : (await import('@astrojs/node')).default({
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

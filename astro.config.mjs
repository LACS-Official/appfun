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
  // 使用 Vercel 适配器在 Vercel 环境运行，其他环境使用 Node 适配器
  output: 'hybrid',
  adapter: isVercel
    ? (await import('@astrojs/vercel/serverless')).default()
    : (await import('@astrojs/node')).default({
        mode: 'standalone',
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

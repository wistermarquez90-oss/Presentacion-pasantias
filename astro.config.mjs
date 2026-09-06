import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  base: './',
  integrations: [tailwind()],
  build: { format: 'file' },
  vite: {
    build: { chunkSizeWarningLimit: 3000 }
  }
});

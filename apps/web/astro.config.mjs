// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://ujg.specs.openuji.org',
  outDir: process.env.UJG_ASTRO_OUT_DIR || 'dist',
  publicDir: process.env.UJG_ASTRO_PUBLIC_DIR || 'public',
  vite: {
    optimizeDeps: {
      include: ['@radix-ui/react-select', 'lucide-react', 'mermaid'],
    },
    plugins: [tailwindcss()],
    server: {
      watch: {
        // Watch the speculator package dist so HMR works during development
        ignored: ['!**/speculator/packages/speculator/dist/**'],
      },
    },
  },

  integrations: [react()],
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
});

// @ts-check
import { existsSync } from 'node:fs';
import { extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

const WEB_ROOT = fileURLToPath(new URL('.', import.meta.url));
const REPO_ROOT = resolve(WEB_ROOT, '../..');
const DEFAULT_SPEC_WATCH_FOLDERS = ['case-studies', 'ed'];
const SPEC_WATCH_EXTENSIONS = new Set([
  '.gif',
  '.jpeg',
  '.jpg',
  '.json',
  '.jsonld',
  '.md',
  '.png',
  '.svg',
  '.ttl',
  '.webp',
  '.yml',
  '.yaml',
]);

function getSpecWatchRoots() {
  const configuredFolders = process.env.UJG_DEV_SPEC_WATCH
    ? process.env.UJG_DEV_SPEC_WATCH.split(/[, ]+/).filter(Boolean)
    : DEFAULT_SPEC_WATCH_FOLDERS;

  return configuredFolders
    .map((folder) => {
      if (folder.startsWith('/')) return folder;
      return resolve(REPO_ROOT, folder.startsWith('specs/') ? folder : `specs/${folder}`);
    })
    .filter((folder) => existsSync(folder));
}

function invalidateDevServer(server) {
  server.moduleGraph.invalidateAll();

  for (const environment of Object.values(server.environments || {})) {
    environment.moduleGraph.invalidateAll();
  }
}

function watchSpecContentPlugin() {
  return {
    name: 'ujg-spec-content-watch',
    configureServer(server) {
      const roots = getSpecWatchRoots();
      if (roots.length === 0) return;

      server.watcher.add(roots);
      const rootPrefixes = roots.map((root) => `${resolve(root)}${sep}`);

      let invalidationTimer;
      const handleSpecContentChange = (path) => {
        const absolutePath = resolve(path);
        if (!rootPrefixes.some((rootPrefix) => absolutePath.startsWith(rootPrefix))) return;
        if (!SPEC_WATCH_EXTENSIONS.has(extname(absolutePath))) return;

        clearTimeout(invalidationTimer);
        invalidationTimer = setTimeout(() => {
          invalidateDevServer(server);
          server.ws.send({ type: 'full-reload' });
          server.config.logger.info(
            `[ujg] reloaded spec content after ${relative(REPO_ROOT, absolutePath)}`,
            { timestamp: true }
          );
        }, 50);
      };

      server.watcher.on('add', handleSpecContentChange);
      server.watcher.on('change', handleSpecContentChange);
      server.watcher.on('unlink', handleSpecContentChange);
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://ujg.specs.openuji.org',
  outDir: process.env.UJG_ASTRO_OUT_DIR || 'dist',
  publicDir: process.env.UJG_ASTRO_PUBLIC_DIR || 'public',
  vite: {
    optimizeDeps: {
      include: ['@radix-ui/react-select', 'lucide-react', 'mermaid'],
    },
    plugins: [tailwindcss(), watchSpecContentPlugin()],
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

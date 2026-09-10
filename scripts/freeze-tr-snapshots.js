import { spawn } from 'node:child_process';
import {
  access,
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(SCRIPT_DIR, '..');
const WEB_ROOT = join(REPO_ROOT, 'apps', 'web');
const PUBLIC_ROOT = join(WEB_ROOT, 'public');
const SNAPSHOT_ROOT = join(PUBLIC_ROOT, 'tr');
const TEMP_PUBLIC_ROOT = join(WEB_ROOT, '.tr-snapshot-public');
const TEMP_DIST_ROOT = join(WEB_ROOT, '.tr-snapshot-dist');
const TEMP_TR_ROOT = join(TEMP_DIST_ROOT, 'tr');
const TEMP_ASTRO_ROOT = join(TEMP_DIST_ROOT, '_astro');
const SNAPSHOT_ASTRO_ROOT = join(SNAPSHOT_ROOT, '_astro');
const LEGACY_TEMP_ROOT = join(WEB_ROOT, '.tr-snapshot-build');
const ASTRO_ASSET_PATTERN = /\/_astro\/([^"'\s)]+)/g;

async function pathExists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function copyPublicWithoutTr() {
  await mkdir(TEMP_PUBLIC_ROOT, { recursive: true });

  for (const entry of await readdir(PUBLIC_ROOT, { withFileTypes: true })) {
    if (entry.name === 'tr') continue;

    await cp(join(PUBLIC_ROOT, entry.name), join(TEMP_PUBLIC_ROOT, entry.name), {
      recursive: true,
    });
  }
}

async function walkFiles(directory) {
  const files = [];

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walkFiles(path)));
    else if (entry.isFile()) files.push(path);
  }

  return files;
}

function run(command, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      ...options,
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} exited with ${code}`));
    });
  });
}

async function rewriteAstroAssetReferences() {
  const htmlFiles = (await walkFiles(SNAPSHOT_ROOT)).filter((file) => file.endsWith('.html'));
  const assetNames = new Set();

  for (const file of htmlFiles) {
    const source = await readFile(file, 'utf8');
    const rewritten = source.replace(ASTRO_ASSET_PATTERN, (_match, assetName) => {
      assetNames.add(assetName);
      return `/tr/_astro/${assetName}`;
    });

    if (rewritten !== source) {
      await writeFile(file, rewritten, 'utf8');
    }
  }

  if (assetNames.size === 0) return;

  for (const assetName of [...assetNames].sort()) {
    const source = join(TEMP_ASTRO_ROOT, assetName);

    if (!(await pathExists(source))) {
      throw new Error(`Frozen TR snapshot references missing Astro asset: ${assetName}`);
    }
  }

  await rm(SNAPSHOT_ASTRO_ROOT, { recursive: true, force: true });
  await cp(TEMP_ASTRO_ROOT, SNAPSHOT_ASTRO_ROOT, { recursive: true });
}

async function main() {
  await rm(LEGACY_TEMP_ROOT, { recursive: true, force: true });
  await rm(TEMP_PUBLIC_ROOT, { recursive: true, force: true });
  await rm(TEMP_DIST_ROOT, { recursive: true, force: true });
  await copyPublicWithoutTr();

  await run('pnpm', ['--dir', WEB_ROOT, 'exec', 'astro', 'build'], {
    cwd: REPO_ROOT,
    env: {
      ...process.env,
      UJG_RENDER_TR_ROUTES: '1',
      UJG_ASTRO_OUT_DIR: TEMP_DIST_ROOT,
      UJG_ASTRO_PUBLIC_DIR: TEMP_PUBLIC_ROOT,
    },
  });

  if (!(await pathExists(TEMP_TR_ROOT))) {
    throw new Error('Astro build did not produce a tr snapshot directory');
  }

  await rm(SNAPSHOT_ROOT, { recursive: true, force: true });
  await cp(TEMP_TR_ROOT, SNAPSHOT_ROOT, { recursive: true });
  await rewriteAstroAssetReferences();

  const writtenFiles = await walkFiles(SNAPSHOT_ROOT);
  await rm(TEMP_PUBLIC_ROOT, { recursive: true, force: true });
  await rm(TEMP_DIST_ROOT, { recursive: true, force: true });

  console.log(
    `Frozen TR snapshots written to ${relative(REPO_ROOT, SNAPSHOT_ROOT)} (${writtenFiles.length} files).`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

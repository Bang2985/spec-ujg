import type { APIRoute } from 'astro';
import fs from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { getCaseStudies } from '@/lib/case-studies';
import { getDocuments } from '@/lib/load';
import { CANONICAL_SPEC_BASE_URL } from '@/lib/spec-artifacts';
import { TOP_LEVEL_CONTENT_PAGES } from '@/lib/static-pages';

const staticAstroPageModules = import.meta.glob('./**/*.astro', { eager: true });
const DEFAULT_PUBLIC_DIR = fileURLToPath(new URL('../../public/', import.meta.url));

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function canonicalUrl(pathname: string): string {
  return new URL(pathname, CANONICAL_SPEC_BASE_URL).toString();
}

function routePathFromStaticAstroPage(filePath: string): string | undefined {
  if (filePath.includes('[')) return undefined;

  const routePath = filePath
    .replace(/^\.\//, '/')
    .replace(/\.astro$/, '')
    .replace(/\/index$/, '');

  if (routePath === '/404') return undefined;
  return routePath || '/';
}

function uniquePaths(paths: string[]): string[] {
  return [...new Set(paths)];
}

function sortPaths(paths: string[]): string[] {
  return [...paths].sort((left, right) => {
    if (left === '/') return -1;
    if (right === '/') return 1;
    return left.localeCompare(right);
  });
}

function walkFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];

  const files: string[] = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '_astro') continue;

    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(path));
    else if (entry.isFile()) files.push(path);
  }

  return files;
}

function getCommittedTechnicalReportPaths(): string[] {
  const publicDir = process.env.UJG_ASTRO_PUBLIC_DIR || DEFAULT_PUBLIC_DIR;
  const trDir = join(publicDir, 'tr');

  return walkFiles(trDir)
    .filter((file) => file.endsWith('.html'))
    .map((file) => {
      const relativePath = relative(publicDir, file).split(sep).join('/');
      return `/${relativePath.replace(/\.html$/, '')}`;
    });
}

export const GET: APIRoute = async () => {
  const caseStudies = await getCaseStudies();
  const documents = await getDocuments('ed');
  const reportPaths = getCommittedTechnicalReportPaths();
  const staticAstroPaths = Object.keys(staticAstroPageModules)
    .map(routePathFromStaticAstroPage)
    .filter((pathname): pathname is string => pathname !== undefined);
  const topLevelContentPaths = TOP_LEVEL_CONTENT_PAGES.map((page) => `/${page.slug}`);
  const paths = sortPaths(
    uniquePaths([
      ...staticAstroPaths,
      ...topLevelContentPaths,
      ...caseStudies.map((study) => `/case-studies/${study.slug}`),
      ...documents.map((document) => `/ed/${document.id}`),
      ...reportPaths,
    ])
  );

  const urls = paths
    .map((pathname) => `  <url><loc>${escapeXml(canonicalUrl(pathname))}</loc></url>`)
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    }
  );
};

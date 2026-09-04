import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { MarkdownInstance } from 'astro';

export interface CaseStudyFrontmatter {
  title?: unknown;
  summary?: unknown;
  teaser?: unknown;
  tags?: unknown;
  heroImage?: unknown;
  cardImage?: unknown;
}

export interface CaseStudyManifest {
  publishedAt: string;
  updatedAt: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  summary: string;
  teaser?: string;
  tags: string[];
  heroImage?: string;
  cardImage?: string;
  publishedAt: string;
  updatedAt: string;
  entryPath: string;
  post: MarkdownInstance<CaseStudyFrontmatter>;
}

const caseStudyModules = import.meta.glob<MarkdownInstance<CaseStudyFrontmatter>>(
  '../../../../specs/case-studies/*/index.md'
);

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string' && item.trim() !== '');
}

function readManifest(entryPath: string): CaseStudyManifest {
  const directory = dirname(entryPath);
  const manifestUrl = new URL(`${directory}/content-manifest.json`, import.meta.url);
  const manifest = JSON.parse(readFileSync(fileURLToPath(manifestUrl), 'utf8')) as {
    publishedAt?: unknown;
    updatedAt?: unknown;
  };

  if (typeof manifest.publishedAt !== 'string' || typeof manifest.updatedAt !== 'string') {
    throw new Error(`${directory}/content-manifest.json must define publishedAt and updatedAt`);
  }

  return {
    publishedAt: manifest.publishedAt,
    updatedAt: manifest.updatedAt,
  };
}

function getSlug(entryPath: string): string {
  const match = entryPath.match(/\/case-studies\/([^/]+)\/index\.md$/);
  if (!match) {
    throw new Error(`Cannot derive case study slug from ${entryPath}`);
  }
  return match[1];
}

function buildCaseStudy(
  entryPath: string,
  post: MarkdownInstance<CaseStudyFrontmatter>
): CaseStudy {
  const slug = getSlug(entryPath);
  const { frontmatter } = post;
  const title = asOptionalString(frontmatter.title);
  const summary = asOptionalString(frontmatter.summary);

  if (!title) throw new Error(`Case study "${slug}" must define a title`);
  if (!summary) throw new Error(`Case study "${slug}" must define a summary`);

  const manifest = readManifest(entryPath);

  return {
    slug,
    title,
    summary,
    teaser: asOptionalString(frontmatter.teaser),
    tags: asStringArray(frontmatter.tags),
    heroImage: asOptionalString(frontmatter.heroImage),
    cardImage: asOptionalString(frontmatter.cardImage),
    publishedAt: manifest.publishedAt,
    updatedAt: manifest.updatedAt,
    entryPath,
    post,
  };
}

function compareCaseStudies(left: CaseStudy, right: CaseStudy): number {
  const dateDiff = Date.parse(right.updatedAt) - Date.parse(left.updatedAt);
  if (Number.isFinite(dateDiff) && dateDiff !== 0) return dateDiff;
  return left.title.localeCompare(right.title);
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const studies = await Promise.all(
    Object.entries(caseStudyModules)
      .filter(([entryPath]) => !getSlug(entryPath).startsWith('_'))
      .map(async ([entryPath, loader]) => buildCaseStudy(entryPath, await loader()))
  );

  return studies.sort(compareCaseStudies);
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | undefined> {
  const studies = await getCaseStudies();
  return studies.find((study) => study.slug === slug);
}

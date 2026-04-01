import {
  createArtifactHandler,
  getSpecBaseUrl,
  rewriteCanonicalSpecBaseUrl,
} from '../../../lib/spec-artifacts';

const SPEC_BASE_URL = getSpecBaseUrl(import.meta.env.SPEC_BASE_URL);

export const GET = createArtifactHandler(
  import.meta.url,
  '../../../../../../specs/ed/core/core.context.jsonld',
  'application/ld+json; charset=utf-8',
  (fileContent) => rewriteCanonicalSpecBaseUrl(fileContent, SPEC_BASE_URL)
);

import { createArtifactHandler } from '../../../lib/spec-artifacts';

export const GET = createArtifactHandler(
  import.meta.url,
  '../../../../../../specs/ed/mapping/mapping.ttl',
  'text/turtle; charset=utf-8'
);

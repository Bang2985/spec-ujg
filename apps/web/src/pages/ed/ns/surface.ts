import { createArtifactHandler } from '../../../lib/spec-artifacts';

export const GET = createArtifactHandler(
  import.meta.url,
  '../../../../../../specs/ed/surface/surface.ttl',
  'text/turtle; charset=utf-8'
);

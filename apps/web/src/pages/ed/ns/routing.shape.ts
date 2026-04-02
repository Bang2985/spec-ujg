import { createArtifactHandler } from '../../../lib/spec-artifacts';

export const GET = createArtifactHandler(
  import.meta.url,
  '../../../../../../specs/ed/modules/routing/routing.shape.ttl',
  'text/turtle; charset=utf-8'
);

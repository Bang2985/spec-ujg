import { createArtifactHandler } from '../../../lib/spec-artifacts';

export const GET = createArtifactHandler(
  import.meta.url,
  '../../../../../../specs/ed/modules/observability/observability.shape.ttl',
  'text/turtle; charset=utf-8'
);

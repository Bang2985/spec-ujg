import { createArtifactHandler } from '../../../lib/spec-artifacts';

export const GET = createArtifactHandler(
  import.meta.url,
  '../../../../../../specs/ed/modules/action/action.shape.ttl',
  'text/turtle; charset=utf-8'
);

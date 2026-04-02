import { createArtifactHandler } from '../../../lib/spec-artifacts';

export const GET = createArtifactHandler(
  import.meta.url,
  '../../../../../../specs/ed/modules/design-system/design-system.ttl',
  'text/turtle; charset=utf-8'
);

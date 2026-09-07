import { createArtifactHandler } from '../../../lib/spec-artifacts';

export const GET = createArtifactHandler(
  import.meta.url,
  '../../../../../../specs/ed/modules/data-contract/data-contract.ttl',
  'text/turtle; charset=utf-8'
);

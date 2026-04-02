import { createArtifactHandler } from '../../../lib/spec-artifacts';

export const GET = createArtifactHandler(
  import.meta.url,
  '../../../../../../specs/ed/modules/l10n/l10n.shape.ttl',
  'text/turtle; charset=utf-8'
);

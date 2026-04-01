import type { APIRoute } from 'astro';

import { createJsonResponse, getSpecBaseUrl } from '../../../lib/spec-artifacts';

const SPEC_BASE_URL = getSpecBaseUrl(import.meta.env.SPEC_BASE_URL);

export const GET: APIRoute = async () => {
  return createJsonResponse({
    '@context': [
      `${SPEC_BASE_URL}/ed/ns/core.context.jsonld`,
      `${SPEC_BASE_URL}/ed/ns/graph.context.jsonld`,
      `${SPEC_BASE_URL}/ed/ns/runtime.context.jsonld`,
      `${SPEC_BASE_URL}/ed/ns/experience.context.jsonld`,
    ],
  });
};

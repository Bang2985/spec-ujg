import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

export const GET: APIRoute = async () => {
  try {
    // Read the file from public/ed/ns/ns.ttl (where vocab-build outputs it)
    // Note: in dev, public files are served directly, but for explicit content type control/aliasing we use this endpoint.
    // The vocab-build output structure is: public/ns/ns.ttl (based on our script)
    // Wait, vocab-build outputs to {OUTPUT_DIR}/{prefix}/{prefix}.ttl -> public/ns/ns.ttl for core?
    // Let's check the script output again.
    // Script output was: public/ns/ns.ttl

    // We want to serve it at /ed/ns/core (no extension)

    const filePath = path.resolve('public/ns/ns.ttl');
    const fileContent = await fs.readFile(filePath, 'utf-8');

    return new Response(fileContent, {
      headers: {
        'Content-Type': 'text/turtle',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
};

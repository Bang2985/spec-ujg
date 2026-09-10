# UJG Web

## Frozen TR Snapshots

Technical Report snapshots under `/tr/...` are committed static output in `public/tr`.
Normal Astro builds do not render the TR routes; they copy the frozen files as-is.

To intentionally regenerate the frozen TR files, run this from the repository root:

```sh
pnpm tr-snapshots:freeze
```

That command temporarily enables the TR Astro routes, builds them into an isolated output
directory, rewrites their Astro asset references to `/tr/_astro/...`, and replaces
`apps/web/public/tr` with the generated snapshot files and snapshot-local Astro assets.

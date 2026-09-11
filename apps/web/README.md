# UJG Web

## Dev Content Watching

The dev server watches selected repository-level `specs` folders and invalidates Vite's
module cache when content files change. By default it watches:

- `specs/case-studies`
- `specs/ed`

To watch another folder under `specs`, set `UJG_DEV_SPEC_WATCH` to a comma-separated list:

```sh
UJG_DEV_SPEC_WATCH=case-studies,ed,tr/1.0-rc1 pnpm --filter @openuji/web run dev
```

Technical Report source routes are still disabled by default; use `UJG_RENDER_TR_ROUTES=1`
when intentionally previewing TR source content instead of the committed frozen files.

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

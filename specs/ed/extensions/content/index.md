**Title:** `org.openuji.specs.ujg.content.v1`

**Status:** incubating implementation extension for editorial and structured-content binding beyond L10n.

## Namespace

- Canonical namespace string: `org.openuji.specs.ujg.content.v1`
- Payload location: `extensions["org.openuji.specs.ujg.content.v1"]`
- Published JSON Schema: `https://ujg.specs.openuji.org/ed/ns/content.schema.json`

## Purpose

This extension describes editorial and structured-content relationships that localization alone does
not cover.

It exists to tell generators:

- which content types are bound to a node,
- which regions are editable,
- who owns the content lifecycle,
- which publication mode applies,
- which structured content entities are bound to the node.

L10n already covers translated copy through `copyRef` and `MessageBundle`. This extension covers the
editorial and structured-content relationship beyond localization.

## Scope

This extension covers:

- content types,
- editable regions,
- ownership mode,
- publication mode,
- structured content entity bindings.

The extension is self-contained. It may refer to scaffold region names when the host also uses
Templates or surface-like realization semantics, but it does not require private IDs from other
extensions for correctness.

## Non-goals

This extension does not standardize:

- CMS internals,
- rich-text storage formats,
- workflow engines,
- vendor entity APIs,
- localization bundles,
- WYSIWYG configuration.

## Primary Attachment Targets

- `Template`
- `State`
- `CompositeState`

`Template` is the preferred reusable host for content-capable shells. `State` is the preferred host
for effective content binding. `CompositeState` is the preferred host for subflow-wide content
defaults.

## Secondary Attachment Targets

- `Journey` for broad ownership or publication defaults
- `MessageBundle` only for very narrow editorial metadata on the bundle itself

## Discouraged Or Disallowed Attachment Targets

- `Transition` is discouraged except for sparse publish or save hints attached to a specific action.
- `OutgoingTransitionGroup` is discouraged because it is not a content host.
- `Route` is discouraged because addressability belongs in Routing.
- `UJGDocument` is disallowed because Core extensions are node-scoped.

## Inheritance Model

For state-level content binding, generators should apply inheritance in this order:

1. `Journey`
2. each enclosing `CompositeState`, from outermost to innermost
3. resolved `Template`, if `templateRef` is present
4. the local `State`

Narrow bundle-level metadata on `MessageBundle` does not override state or template content binding.
It only supplements the bundle resource itself.

## Precedence And Override Rules

Use this precedence order:

1. `State`
2. `Template`
3. innermost `CompositeState`
4. outer `CompositeState`
5. `Journey`

Merge and replacement rules:

- `ownershipMode` and `publicationMode` are singular values. The more specific value replaces the
  inherited one.
- `contentTypes` combines across inheritance with duplicate removal.
- `editableRegions` merges by `name`.
- `entityBindings` merges by `role`.
- a more specific region or binding may suppress an inherited one by repeating the same identity and
  setting `disabled: true`.

## Property Vocabulary

- `contentTypes`: content types associated with the host. Expected shape: array of strings. Allowed
  categories: published content-type IDs, model IDs, or opaque external identifiers. Implementation
  intent: tells generators what type of structured content is involved.
- `editableRegions`: editable regions on the host. Expected shape: array of region objects with
  `name` and optional `kind`, `repeatable`, and `disabled`. Implementation intent: tells generators
  which parts of a node are editorially managed.
- `ownershipMode`: who owns the content lifecycle. Expected shape: string. Allowed categories:
  `editorial`, `application`, `mixed`, `external`. Implementation intent: distinguishes CMS-owned,
  app-owned, and externally owned content.
- `publicationMode`: editorial publication posture. Expected shape: string. Allowed categories:
  `runtime-only`, `draft`, `review`, `publish`, `scheduled`. Implementation intent: tells generators
  whether the content participates in publication workflows.
- `entityBindings`: structured content bindings. Expected shape: array of objects with `role`,
  `entityRef`, and optional `cardinality`, `region`, and `disabled`. Allowed categories for
  `cardinality`: `one`, `many`. Implementation intent: binds content entities to semantic roles or
  regions without vendor-specific content APIs.

## Recommended Controlled Values

Recommended `ownershipMode` values:

- `editorial`
- `application`
- `mixed`
- `external`

Recommended `publicationMode` values:

- `runtime-only`
- `draft`
- `review`
- `publish`
- `scheduled`

Recommended editable region `kind` values:

- `rich-text`
- `media`
- `summary`
- `promo`
- `legal`

## Processing Model

A generator implementing this extension should:

1. Resolve the effective content payload using the inheritance and precedence rules above.
2. Normalize content types, editable regions, ownership mode, publication mode, and entity bindings.
3. Combine the result with Templates for shared shells, with Routing for addressable entry where
   relevant, and with L10n for localized copy carried separately through `copyRef`.
4. Materialize target-specific editorial or content bindings without standardizing vendor internals.

This extension should be sufficient for generators to distinguish editorial regions from ordinary
localized copy, even when no CMS-specific adapter is chosen yet.

## Cross-Stack Interpretation Notes

- Web: map to editable campaign regions, structured content pages, and preview-aware shells.
- Native: map to synced content sections, read-mostly editorial surfaces, or limited inline editing.
- CMS: map to content types, editable regions, previews, and publish-state-aware page shells.
- Commerce: map to merchandising slots, promo regions, legal content regions, and catalog-support
  content.
- CLI or headless or background: map to managed help text, report templates, message templates, or
  structured generated notices.

## Published JSON Schema

The published schema for this extension is defined below and is published at
`https://ujg.specs.openuji.org/ed/ns/content.schema.json`.

:::include ./content.schema.json :::

## Minimal Example Payload

```json
{
  "@id": "urn:template:checkout-shell",
  "@type": "Template",
  "extensions": {
    "org.openuji.specs.ujg.content.v1": {
      "contentTypes": ["urn:content-type:checkout-page"],
      "editableRegions": [
        { "name": "aside", "kind": "promo" },
        { "name": "footer", "kind": "legal" }
      ],
      "ownershipMode": "mixed",
      "publicationMode": "publish",
      "entityBindings": [
        { "role": "campaign", "entityRef": "urn:entity:promo-card", "cardinality": "many", "region": "aside" },
        { "role": "legal", "entityRef": "urn:entity:legal-copy", "cardinality": "one", "region": "footer" }
      ]
    }
  }
}
```

## Graduation Guidance

Thin parts that may later graduate into optional modules or shared references include:

- a content-type reference,
- an editable-region reference,
- an entity-binding reference.

The following should remain extension-only:

- ownership and publication overlays,
- combined region and entity binding detail,
- editor-facing content realization hints.

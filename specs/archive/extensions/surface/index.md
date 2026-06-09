**Title:** `org.openuji.specs.ujg.surface.v1`

**Status:** incubating implementation extension for generator-facing surface materialization carried in UJG Core `extensions`.

## Namespace

- Canonical namespace string: `org.openuji.specs.ujg.surface.v1`
- Payload location: `extensions["org.openuji.specs.ujg.surface.v1"]`
- Published JSON Schema: `https://ujg.specs.openuji.org/ed/ns/surface.schema.json`

## Purpose

This extension is the main generator-facing materialization payload for surface realization.

It exists to answer, in one self-contained place, the questions a generator needs answered before it
can materialize a state or shared template:

- what kind of surface is this,
- which slots or regions matter,
- which semantic blocks belong on the surface,
- which structural variants are expected,
- which token or theme sources influence it,
- which presentation modes matter,
- which component-family placeholder or shared library family it expects,
- which recipes or semantic render roles should be used.

This extension intentionally merges structural, visual, and component-family placeholder concerns so
that a generator can understand the surface without first resolving separate scaffold, design, and
library extensions.

## Scope

This extension covers:

- surface kind,
- composition pattern,
- slots or regions,
- semantic blocks assigned to slots,
- structural variants,
- grouped theme description including token sources and supported modes,
- semantic surface and block recipes,
- library family placeholder identity,
- platform adaptation posture.

The extension is self-contained. A generator may combine it with Templates, Routing, and L10n, but
it does not need private IDs from any other extension to understand the surface payload.

## Non-goals

This extension does not standardize:

- full component trees,
- DOM trees,
- raw CSS,
- utility-class mappings,
- framework component files,
- platform theme code,
- exact breakpoints,
- pixel-perfect cross-platform parity.

## Primary Attachment Targets

- `Template`
- `State`
- `CompositeState`

`Template` is the preferred reusable host for shared surface identity. `State` is the preferred host
for effective realized surfaces. `CompositeState` is the preferred host for subflow-wide defaults.

## Secondary Attachment Targets

- `Journey` for broad surface defaults such as theme posture or common slot names
- `Transition` when a transition needs lightweight presentation hints for its invocation or result
  affordance

## Discouraged Or Disallowed Attachment Targets

- `OutgoingTransitionGroup` is discouraged because it groups reusable outgoing edges rather than
  realized surfaces.
- `Route` is discouraged because addressability belongs in Routing and should not become a surrogate
  surface host.
- `MessageBundle` is disallowed in normal use because localization resources are not surface
  resources.
- `UJGDocument` is disallowed because Core extensions are node-scoped.

## Inheritance Model

For a realized state, generators should apply surface inheritance in this order:

1. `Journey`
2. each enclosing `CompositeState`, from outermost to innermost
3. resolved `Template`, if `templateRef` is present
4. the local `State`

For transition-attached surface hints, generators should use:

1. `Journey`
2. enclosing `CompositeState`
3. source `State`
4. local `Transition`

Template inheritance is the main reusable mechanism for shared surfaces. State attachment is the
main override mechanism.

## Precedence And Override Rules

When the same surface concern appears in more than one host, use this precedence order:

1. `State`
2. `Template`
3. innermost `CompositeState`
4. outer `CompositeState`
5. `Journey`

For transition-local hints, use:

1. `Transition`
2. source `State`
3. innermost `CompositeState`
4. outer `CompositeState`
5. `Journey`

Merge and replacement rules:

- `surfaceKind`, `composition`, `library`, and `adaptation` are singular values or objects. The
  more specific value replaces the inherited one, except where object members merge as described
  below.
- `theme.defaultMode`, `theme.defaultContrastMode`, and `theme.defaultDensityMode` are singular. The
  more specific value replaces the inherited one.
- `theme.tokenSources`, `theme.supportedModes`, `theme.supportedContrastModes`, and
  `theme.supportedDensityModes` combine across inheritance with duplicate removal.
- `slots` merges by `name`.
- `blocks` merges by `id`.
- `variants` merges by `name`.
- `recipes` merges by semantic key.
- a more specific `slot`, `block`, or `variant` may suppress an inherited one by repeating the same
  identity and setting `disabled: true`.

## Property Vocabulary

- `surfaceKind`: the semantic kind of materialized surface. Expected shape: string. Recommended
  values are listed below. Implementation intent: lets a generator choose a page, screen, dialog,
  prompt, stream, or comparable container without defining platform code.
- `composition`: the high-level structural arrangement of the surface. Expected shape: string.
  Allowed categories are generic composition patterns such as stepped, split, stacked, or streaming.
  Implementation intent: gives generators enough structure to lay out major regions.
- `slots`: the named surface regions. Expected shape: array of strings or array of objects with
  `name` and optional `role`, `required`, `multiple`, and `disabled`. A string value is shorthand
  for a slot object whose `name` is that string. Implementation intent: names the regions a
  generator must account for while allowing a compact form when slot metadata is not needed.
- `blocks`: the semantic content or interaction blocks that belong on the surface. Expected shape:
  array of objects with `id`, `kind`, `slot`, and optional `recipe`, `appearanceRole`, `importance`,
  `variant`, and `disabled`. Implementation intent: gives generators a flat block plan without
  requiring a full component tree.
- `variants`: named structural overlays. Expected shape: array of objects with `name`, `when`, and
  optional `overrides`. Implementation intent: lets a producer declare compact, modal, native, or
  CLI-oriented surface variants without hard-coding framework conditions.
- `theme`: grouped theme description. Expected shape: object with optional `tokenSources`,
  `themeRef`, `defaultMode`, `supportedModes`, `defaultContrastMode`, `supportedContrastModes`,
  `defaultDensityMode`, and `supportedDensityModes`. Allowed categories for `defaultMode` and
  `supportedModes`: `light`, `dark`, `system`. Allowed categories for
  `defaultContrastMode` and `supportedContrastModes`: `normal`, `high`, `system`. Allowed
  categories for `defaultDensityMode` and `supportedDensityModes`: `compact`, `comfortable`,
  `spacious`. Implementation intent: keeps token sources and mode support in one object so the
  generator can see both the available modes and the preferred defaults.
- `recipes`: semantic recipe bindings. Expected shape: object whose keys are semantic roles such as
  `surface`, `primaryAction`, `summary`, or `dangerNotice` and whose values are recipe names.
  Implementation intent: gives generators stable semantic presentation names instead of raw classes.
- `library`: grouped library placeholder. Expected shape: object with `family` and optional
  `version`. Allowed categories: generic family IDs, published library identifiers, or registry or
  catalog family identifiers. A value such as `shadcn-ui` is valid when the target adapter knows how
  to resolve that family, and a published registry or catalog identifier is also valid when the
  producer wants to point to a more explicit source. Implementation intent: lets adapters choose the
  right component inventory without relying on file paths, install commands, or framework internals.
- `adaptation`: posture for cross-platform adaptation. Expected shape: string or object keyed by
  platform family. Allowed categories: `strict`, `balanced`, `platform-native`. Implementation
  intent: tells generators how tightly to preserve shared surface intent.

## Recommended Controlled Values

Recommended `surfaceKind` values:

- `page`
- `screen`
- `dialog`
- `sheet`
- `panel`
- `wizard-step`
- `prompt`
- `stream`
- `job`

Recommended `composition` values:

- `single`
- `split`
- `stacked`
- `stepped`
- `streaming`
- `background`

Recommended `theme.defaultMode` and `theme.supportedModes` values:

- `light`
- `dark`
- `system`

Recommended `theme.defaultContrastMode` and `theme.supportedContrastModes` values:

- `normal`
- `high`
- `system`

Recommended `theme.defaultDensityMode` and `theme.supportedDensityModes` values:

- `compact`
- `comfortable`
- `spacious`

Recommended `adaptation` values:

- `strict`
- `balanced`
- `platform-native`

## Processing Model

A generator implementing this extension should:

1. Resolve the effective graph host and, if present, resolve `templateRef`.
2. Compute the inherited surface payload using the inheritance and precedence rules above.
3. Normalize slot shorthand strings to slot objects.
4. Resolve the effective `surfaceKind`, `composition`, grouped `theme`, grouped `library`, and
   recipe map.
5. Merge and normalize `slots`, `blocks`, and active `variants`.
6. Combine the resulting surface plan with Routing if the node has `routeRef`.
7. Combine the resulting surface plan with L10n if the node has `copyRef`.
8. Materialize a target-specific surface while preserving graph behavior as the source of truth.

Graph remains the source of truth for state and transition behavior. This extension only describes
implementation-facing realization intent.

## Cross-Stack Interpretation Notes

- Web: map to pages, dialogs, drawers, shells, and block layouts in frameworks such as Next.js or
  Astro without standardizing file structure.
- Native: map to screens, sheets, dialogs, and cards in React Native, Compose, or Flutter while
  preserving semantic slots and recipes.
- CMS: map to page templates, editorial regions, and render recipes while leaving vendor internals
  outside the spec.
- Commerce: map to storefront shells, checkout steps, side summaries, and action areas.
- CLI or headless or background: map to prompts, streams, diagnostics sections, or job-status
  surfaces while reusing the same high-level slot and block semantics.

## Published JSON Schema

The published schema for this extension is defined below and is published at
`https://ujg.specs.openuji.org/ed/ns/surface.schema.json`.

:::include ./surface.schema.json :::

## Minimal Example Payload

```json
{
  "@id": "urn:state:payment",
  "@type": "State",
  "extensions": {
    "org.openuji.specs.ujg.surface.v1": {
      "surfaceKind": "page",
      "composition": "split",
      "slots": ["header", "main", "aside", "footer"],
      "blocks": [
        { "id": "summary", "kind": "summary", "slot": "aside", "recipe": "card.summary" },
        { "id": "form", "kind": "form", "slot": "main", "recipe": "form.default" }
      ],
      "theme": {
        "tokenSources": [
          "https://example.com/tokens/base.json",
          "https://example.com/tokens/brand.json"
        ],
        "defaultMode": "light",
        "supportedModes": ["light", "dark"],
        "defaultContrastMode": "high",
        "defaultDensityMode": "comfortable"
      },
      "recipes": {
        "surface": "checkout-shell",
        "primaryAction": "cta-emphasis"
      },
      "library": {
        "family": "shadcn-ui",
        "version": "1"
      },
      "adaptation": "balanced"
    }
  }
}
```

## Graduation Guidance

Thin parts that may later graduate into optional modules or shared references include:

- a surface reference,
- a slot reference,
- a theme or token-source reference,
- a recipe reference.

The following should remain extension-only:

- block plans,
- structural variants,
- component-family placeholders,
- adaptation posture,
- merged structural and visual realization detail.

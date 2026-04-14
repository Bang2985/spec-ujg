**Title:** `org.openuji.specs.ujg.record.v1`

**Status:** incubating implementation extension for self-contained single-record or detail projections carried in UJG Core `extensions`.

## Namespace

- Canonical namespace string: `org.openuji.specs.ujg.record.v1`
- Payload location: `extensions["org.openuji.specs.ujg.record.v1"]`
- Published JSON Schema: `https://ujg.specs.openuji.org/ed/ns/record.schema.json`

## Purpose

This extension describes how a node presents one record, entity, or detail view.

It exists so that generators can implement detail projections directly from a self-contained payload
that answers:

- what record is being projected,
- what the read contract posture is,
- which sections and properties are visible,
- how loading, empty, and error cases should feel,
- how refresh behaves,
- which local action placeholders should appear,
- which appearance roles matter.

It is intentionally separate from `org.openuji.specs.ujg.collection.v1` so that record-style detail views stay
small and instantly understandable.

## Scope

This extension covers:

- record identity and source intent,
- read timing and blocking posture,
- sections and visible properties,
- empty, loading, and error posture,
- refresh posture,
- local action placeholders,
- appearance roles needed for generation.

The extension is self-contained. It may refer to UJG node IDs for follow-up transitions, but it
does not depend on private IDs from other extensions.

## Non-goals

This extension does not standardize:

- API endpoints,
- GraphQL documents,
- SQL queries,
- ORM relations,
- framework detail-view components,
- analytics schemas.

## Primary Attachment Targets

- `State`
- `Template`
- `CompositeState`

`State` is the preferred host for effective record views. `Template` is the preferred reusable host
for shared detail layouts. `CompositeState` is the preferred host for subflow-wide defaults.

## Secondary Attachment Targets

- `Journey` for broad defaults such as loading posture or common appearance roles

## Discouraged Or Disallowed Attachment Targets

- `Transition` is discouraged because transitions normally invoke actions rather than define record
  projections.
- `OutgoingTransitionGroup` is discouraged because it is not a record host.
- `Route` is discouraged because routing metadata belongs in Routing.
- `MessageBundle` is disallowed in normal use.
- `UJGDocument` is disallowed because Core extensions are node-scoped.

## Inheritance Model

For a state-level record projection, generators should apply inheritance in this order:

1. `Journey`
2. each enclosing `CompositeState`, from outermost to innermost
3. resolved `Template`, if `templateRef` is present
4. the local `State`

Template inheritance is the main mechanism for reusable record layouts. State attachment is the main
mechanism for effective record specialization.

## Precedence And Override Rules

Use this precedence order:

1. `State`
2. `Template`
3. innermost `CompositeState`
4. outer `CompositeState`
5. `Journey`

Merge and replacement rules:

- `recordTypeRef`, `source`, `loadingPosture`, `emptyPosture`, `errorPosture`, and `refresh` are
  singular values or objects. The more specific value replaces the inherited one.
- `sections` merges by `name`.
- within a merged section, `properties` merges by `name`.
- `actions` merges by `name`.
- `appearanceRoles` merges by key.
- a more specific section, property, or action may suppress an inherited one by repeating the same
  identity and setting `disabled: true`.

## Property Vocabulary

- `recordTypeRef`: identity of the projected record type. Expected shape: string. Allowed
  categories: published schema IDs, model IDs, or opaque external identifiers. Implementation
  intent: tells generators what kind of detail view this is.
- `source`: read contract posture. Expected shape: object with `contractRef` and optional `timing`,
  `blocking`, and `cacheHint`. Allowed categories for `timing`: `startup`, `on-enter`, `on-visible`,
  `on-demand`. Allowed categories for `blocking`: `required`, `deferred`, `non-blocking`. Allowed
  categories for `cacheHint`: `none`, `request`, `session`, `stable`, `revalidate`. Implementation
  intent: gives generators a transport-neutral read posture.
- `sections`: the visible sections of the record. Expected shape: array of section objects with
  `name` and optional `titleRole`, `properties`, `actions`, and `disabled`. Implementation intent:
  lets generators produce understandable detail layouts.
- `loadingPosture`: posture for loading presentation. Expected shape: string. Allowed categories:
  `skeleton`, `spinner`, `placeholder`, `silent`. Implementation intent: gives generators a generic
  loading presentation posture.
- `emptyPosture`: posture when no record can be shown. Expected shape: string. Allowed categories:
  `blank`, `message`, `fallback`, `error`. Implementation intent: distinguishes normal absence from
  failure.
- `errorPosture`: posture for read failure. Expected shape: string. Allowed categories: `inline`,
  `banner`, `full-state`, `fallback`. Implementation intent: helps generators present errors
  consistently.
- `refresh`: refresh posture. Expected shape: object with optional `mode` and `trigger`. Allowed
  categories for `mode`: `none`, `manual`, `automatic`, `manual-and-automatic`. Allowed categories
  for `trigger`: `pull`, `button`, `interval`, `visible`. Implementation intent: describes whether
  and how the record can be refreshed.
- `actions`: local action placeholders. Expected shape: array of objects with `name` and optional
  `kind`, `transitionRef`, `appearanceRole`, and `disabled`. Implementation intent: reserves space
  for node-local actions without defining their command contracts.
- `appearanceRoles`: semantic appearance bindings. Expected shape: object keyed by roles such as
  `surface`, `header`, `value`, `meta`, or `emptyState`. Implementation intent: gives generators
  stable presentation role names without raw CSS.

## Recommended Controlled Values

Recommended section property `kind` values:

- `text`
- `number`
- `money`
- `date`
- `status`
- `badge`
- `link`
- `media`

Recommended `loadingPosture` values:

- `skeleton`
- `spinner`
- `placeholder`
- `silent`

Recommended `emptyPosture` values:

- `blank`
- `message`
- `fallback`
- `error`

## Processing Model

A generator implementing this extension should:

1. Resolve the effective record payload using the inheritance and precedence rules above.
2. Resolve the effective `source` posture and the normalized section and property structure.
3. Apply loading, empty, error, refresh, action, and appearance posture.
4. Combine the resulting record projection with Templates for shared shells, with Routing for route
   entry, and with L10n when the node also has `copyRef`.
5. Materialize a target-specific detail view without changing graph behavior.

The graph remains the source of truth for navigation. This extension only describes the record
projection and its local read posture.

## Cross-Stack Interpretation Notes

- Web: map to account pages, order detail pages, dashboards, or admin detail views.
- Native: map to detail screens, cards, or expandable sections.
- CMS: map to read-focused content detail or editorial preview surfaces.
- Commerce: map to order detail, product detail, customer detail, or return detail views.
- CLI or headless or background: map to structured terminal output, detail reports, or job detail
  projections.

## Published JSON Schema

The published schema for this extension is defined below and is published at
`https://ujg.specs.openuji.org/ed/ns/record.schema.json`.

:::include ./record.schema.json :::

## Minimal Example Payload

```json
{
  "@id": "urn:state:order-detail",
  "@type": "State",
  "extensions": {
    "org.openuji.specs.ujg.record.v1": {
      "recordTypeRef": "urn:model:order",
      "source": {
        "contractRef": "urn:contract:order-read",
        "timing": "on-enter",
        "blocking": "required",
        "cacheHint": "revalidate"
      },
      "sections": [
        {
          "name": "summary",
          "properties": [
            { "name": "orderNumber", "kind": "text" },
            { "name": "total", "kind": "money" },
            { "name": "status", "kind": "status" }
          ]
        }
      ],
      "loadingPosture": "skeleton",
      "emptyPosture": "message",
      "errorPosture": "banner",
      "refresh": { "mode": "manual", "trigger": "button" },
      "actions": [
        { "name": "download-receipt", "kind": "secondary", "transitionRef": "urn:transition:receipt-download" }
      ],
      "appearanceRoles": {
        "surface": "record-shell",
        "header": "record-header"
      }
    }
  }
}
```

## Graduation Guidance

Thin parts that may later graduate into optional modules or shared references include:

- a record type reference,
- a read contract reference,
- a refresh-mode reference.

The following should remain extension-only:

- section and property projection layout,
- empty and error posture,
- local action placeholders,
- appearance role maps.

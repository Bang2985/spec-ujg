**Title:** `org.openuji.specs.ujg.collection.v1`

**Status:** incubating implementation extension for self-contained multi-item collection projections carried in UJG Core `extensions`.

## Namespace

- Canonical namespace string: `org.openuji.specs.ujg.collection.v1`
- Payload location: `extensions["org.openuji.specs.ujg.collection.v1"]`
- Published JSON Schema: `https://ujg.specs.openuji.org/ed/ns/collection.schema.json`

## Purpose

This extension describes how a node presents a list, search result, queue, table, gallery, or other
collection-style projection.

It exists so that generators can implement a collection directly from one self-contained payload
that answers:

- what the collection reads,
- how each item is projected,
- which filters, sorts, and search affordances exist,
- how selection works,
- how pagination works,
- which bulk or item actions appear,
- what loading, empty, and error posture apply,
- which appearance roles matter.

It is intentionally separate from `org.openuji.specs.ujg.record.v1` so that collection surfaces remain small
and easy to overview.

## Scope

This extension covers:

- collection source and read posture,
- item projection,
- filters,
- sort options,
- search posture,
- selection mode,
- pagination mode,
- bulk and item action placeholders,
- loading, empty, and error posture,
- appearance roles needed for generation.

The extension is self-contained and may refer to UJG node IDs for follow-up transitions, but it
does not require private objects from other extensions.

## Non-goals

This extension does not standardize:

- SQL queries,
- API query strings,
- GraphQL documents,
- vendor table components,
- virtualization engines,
- index backends.

## Primary Attachment Targets

- `State`
- `Template`
- `CompositeState`

`State` is the preferred host for effective collection views. `Template` is the preferred reusable
host for shared list or grid shells. `CompositeState` is the preferred host for subflow-wide
defaults.

## Secondary Attachment Targets

- `Journey` for broad defaults such as pagination posture or common search affordances

## Discouraged Or Disallowed Attachment Targets

- `Transition` is discouraged because transitions normally act on a collection rather than define it.
- `OutgoingTransitionGroup` is discouraged because it is not a collection host.
- `Route` is discouraged because routing metadata belongs in Routing.
- `MessageBundle` is disallowed in normal use.
- `UJGDocument` is disallowed because Core extensions are node-scoped.

## Inheritance Model

For a state-level collection projection, generators should apply inheritance in this order:

1. `Journey`
2. each enclosing `CompositeState`, from outermost to innermost
3. resolved `Template`, if `templateRef` is present
4. the local `State`

Template inheritance is the main mechanism for reusable collection shells. State attachment is the
main mechanism for effective collection specialization.

## Precedence And Override Rules

Use this precedence order:

1. `State`
2. `Template`
3. innermost `CompositeState`
4. outer `CompositeState`
5. `Journey`

Merge and replacement rules:

- `itemTypeRef`, `source`, `search`, `selectionMode`, `pagination`, `loadingPosture`,
  `emptyPosture`, and `errorPosture` are singular values or objects. The more specific value
  replaces the inherited one.
- `filters`, `sorts`, `itemActions`, and `bulkActions` merge by `name`.
- `itemProjection` merges by `name` for sections or displayed properties.
- `appearanceRoles` merges by key.
- a more specific filter, sort, action, or projected property may suppress an inherited one by
  repeating the same identity and setting `disabled: true`.

## Property Vocabulary

- `itemTypeRef`: identity of the item type projected by the collection. Expected shape: string.
  Allowed categories: published schema IDs, model IDs, or opaque external identifiers.
  Implementation intent: tells generators what the collection contains.
- `source`: read contract posture. Expected shape: object with `contractRef` and optional `timing`,
  `blocking`, and `cacheHint`. Allowed categories are the same generic categories used for record
  reads. Implementation intent: gives generators a transport-neutral collection read posture.
- `itemProjection`: how a single item is summarized. Expected shape: object with optional `layout`,
  `properties`, and `appearanceRole`. Implementation intent: lets generators render list items,
  table rows, cards, or terminal rows without inventing a separate record model.
- `filters`: available filters. Expected shape: array of filter objects with `name`, `kind`, and
  optional `options`, `multiple`, and `disabled`. Implementation intent: declares available filter
  affordances in a portable way.
- `sorts`: available sort modes. Expected shape: array of sort objects with `name` and optional
  `direction` and `default`. Implementation intent: declares the available sort choices.
- `search`: search posture. Expected shape: object with optional `enabled`, `mode`, and
  `placeholderRole`. Allowed categories for `mode`: `prefix`, `contains`, `full-text`. Implementation
  intent: tells generators whether to render search and how to frame it.
- `selectionMode`: item selection posture. Expected shape: string. Allowed categories: `none`,
  `single`, `multiple`. Implementation intent: distinguishes browse-only collections from selectable
  collections.
- `pagination`: pagination posture. Expected shape: object with `mode` and optional `sizeHint`.
  Allowed categories for `mode`: `none`, `page`, `cursor`, `infinite`. Implementation intent:
  communicates the collection paging model without defining transport details.
- `itemActions`: item-scoped action placeholders. Expected shape: array of objects with `name` and
  optional `transitionRef`, `kind`, `appearanceRole`, and `disabled`. Implementation intent:
  reserves item action affordances without defining the command payload here.
- `bulkActions`: collection-scoped action placeholders. Expected shape: array of objects with `name`
  and optional `transitionRef`, `kind`, `appearanceRole`, and `disabled`. Implementation intent:
  reserves bulk action affordances when selection is enabled.
- `loadingPosture`: loading presentation posture. Expected shape: string. Allowed categories:
  `skeleton`, `spinner`, `placeholder`, `silent`.
- `emptyPosture`: empty presentation posture. Expected shape: string. Allowed categories: `blank`,
  `message`, `suggest-search`, `fallback`.
- `errorPosture`: error presentation posture. Expected shape: string. Allowed categories: `inline`,
  `banner`, `full-state`, `fallback`.
- `appearanceRoles`: semantic appearance bindings. Expected shape: object keyed by roles such as
  `surface`, `item`, `filterBar`, `emptyState`, or `bulkActionBar`. Implementation intent: gives
  generators stable semantic render roles.

## Recommended Controlled Values

Recommended `itemProjection.layout` values:

- `list`
- `table`
- `cards`
- `grid`
- `stream`

Recommended filter `kind` values:

- `choice`
- `multichoice`
- `range`
- `date`
- `toggle`

Recommended `pagination.mode` values:

- `none`
- `page`
- `cursor`
- `infinite`

## Processing Model

A generator implementing this extension should:

1. Resolve the effective collection payload using the inheritance and precedence rules above.
2. Resolve the `source` posture and normalized item projection.
3. Apply filters, sorts, search, selection, pagination, and action posture.
4. Apply loading, empty, error, and appearance posture.
5. Combine the resulting collection projection with Templates for shared shells, with Routing for
   route entry, and with L10n when the node also has `copyRef`.
6. Materialize a target-specific collection implementation while leaving graph navigation under Graph
   control.

## Cross-Stack Interpretation Notes

- Web: map to search pages, index pages, dashboards, list views, tables, and galleries.
- Native: map to lists, grouped lists, cards, picker surfaces, and infinite feeds.
- CMS: map to content indexes, editorial queues, media browsers, and review lists.
- Commerce: map to catalog grids, order lists, inventory lists, and return queues.
- CLI or headless or background: map to tabular terminal output, search results, or paged reports.

## Published JSON Schema

The published schema for this extension is defined below and is published at
`https://ujg.specs.openuji.org/ed/ns/collection.schema.json`.

:::include ./collection.schema.json :::

## Minimal Example Payload

```json
{
  "@id": "urn:state:orders",
  "@type": "State",
  "extensions": {
    "org.openuji.specs.ujg.collection.v1": {
      "itemTypeRef": "urn:model:order",
      "source": {
        "contractRef": "urn:contract:orders-search",
        "timing": "on-enter",
        "blocking": "required",
        "cacheHint": "revalidate"
      },
      "itemProjection": {
        "layout": "table",
        "properties": [
          { "name": "orderNumber" },
          { "name": "customer" },
          { "name": "total" },
          { "name": "status" }
        ]
      },
      "filters": [
        { "name": "status", "kind": "multichoice", "options": ["open", "paid", "cancelled"] }
      ],
      "sorts": [
        { "name": "createdAt", "direction": "desc", "default": true }
      ],
      "search": { "enabled": true, "mode": "contains" },
      "selectionMode": "multiple",
      "pagination": { "mode": "page", "sizeHint": 25 },
      "bulkActions": [
        { "name": "export", "transitionRef": "urn:transition:orders-export" }
      ],
      "loadingPosture": "skeleton",
      "emptyPosture": "suggest-search",
      "errorPosture": "banner",
      "appearanceRoles": {
        "surface": "orders-index",
        "filterBar": "search-toolbar"
      }
    }
  }
}
```

## Graduation Guidance

Thin parts that may later graduate into optional modules or shared references include:

- a collection type reference,
- a pagination-mode reference,
- a filter-definition reference.

The following should remain extension-only:

- item projection layout,
- action placeholders,
- search and selection posture,
- loading and empty-state presentation posture.

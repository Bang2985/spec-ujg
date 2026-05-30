## Overview

This optional module defines a graph-native vocabulary for assigning a Graph `State` to its own
addressable `Surface`.

A `Surface` identifies the materialized interface boundary for one state: for example a page,
screen, dialog, prompt, or other user-facing surface. The relation is intentionally one-to-one. A
single `Surface` is not a reusable scaffold shared by many states.

This module is optional. It annotates the shared graph with surface identity, but it does not change
graph topology, traversal rules, import resolution, rendering behavior, or runtime semantics.

## Normative Artifacts

This module is published through the following artifacts:

- `surface.ttl`: ontology, published at `https://ujg.specs.openuji.org/ed/ns/surface`
- `surface.context.jsonld`: JSON-LD term mappings, published at `https://ujg.specs.openuji.org/ed/ns/surface.context.jsonld`
- `surface.shape.ttl`: SHACL validation rules, published at `https://ujg.specs.openuji.org/ed/ns/surface.shape`

Examples in this page compose the shared baseline context `https://ujg.specs.openuji.org/ed/ns/context.jsonld`
with the Surface context.

Non-goals:

- This module does not define rendering engines, widget libraries, styling systems, hydration
  behavior, component trees, region trees, layout semantics, or presentation semantics.
- This module does not introduce new traversal semantics beyond UJG Graph.
- This module does not replace opaque vendor-private hints carried in UJG Core `extensions`.

## Terminology

- <dfn>Surface</dfn>: An addressable materialized interface boundary for exactly one Graph `State`.
- <dfn>Surface attachment</dfn>: The relation that assigns a state to its surface.

## Attachment Model

The module introduces one canonical interoperable attachment:

- `surface:surfaceRef` links a Graph `State` to a `Surface`.

The module also allows a secondary reverse pointer for overlay documents:

- `surface:surfaceStateRef` links a `Surface` to its Graph `State`.

`surfaceRef` is the canonical assignment form.

`surfaceStateRef` is an overlay-oriented reverse form for cases where the base graph is externally
owned, read-only, or published separately from a surface pack.

A state without `surfaceRef` remains fully valid and traversable. Consumers MAY ignore this module
and still process the graph.

A `Surface` MUST NOT be assigned to more than one state. Producers SHOULD use one `Surface` resource
per realized Graph `State`.

If `surfaceRef` and `surfaceStateRef` are both present across the same document set, they MUST
resolve to the same state-surface assignment. A mismatch is invalid.

## Ontology {data-cop-concept="ontology"}

The normative Surface ontology is defined below and is published at
`https://ujg.specs.openuji.org/ed/ns/surface`. It is the authoritative structural definition for
`Surface`, `surfaceRef`, and `surfaceStateRef`.

:::include ./surface.ttl :::

## JSON-LD Context {data-cop-concept="jsonld-context"}

The normative Surface JSON-LD context is defined below and is published at
`https://ujg.specs.openuji.org/ed/ns/surface.context.jsonld`. It provides the compact JSON-LD term
mappings and coercions for Surface-specific properties and classes.

:::include ./surface.context.jsonld :::

## Validation {data-cop-concept="validation"}

The normative Surface SHACL shape is defined below and is published at
`https://ujg.specs.openuji.org/ed/ns/surface.shape`. It is the authoritative validation artifact for
Surface structural constraints.

:::include ./surface.shape.ttl :::

The rules below define the remaining module semantics beyond the structural constraints captured by
the SHACL shape.

1. **Attachment only:** Surface properties MUST NOT change Graph validity, graph traversal behavior,
   import resolution, or core node identity.
2. **One-to-one surface identity:** A `Surface` MUST identify at most one Graph `State`.
3. **Canonical direction:** `surfaceRef` is the canonical assignment from state to surface.
4. **Graceful degradation:** A consumer that does not implement this module MAY ignore Surface
   semantics, but it SHOULD preserve recognized JSON-LD data during read-transform-write when
   possible.
5. **Private realization hints:** Platform-specific layout, component, or rendering detail SHOULD
   remain in Core `extensions` unless a future optional module defines it as interoperable
   vocabulary.

## Minimal Example

```json
{
  "@context": [
    "https://ujg.specs.openuji.org/ed/ns/context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/surface.context.jsonld"
  ],
  "@id": "https://example.com/ujg/surface/checkout.jsonld",
  "@type": "UJGDocument",
  "specVersion": "1.0",
  "nodes": [
    {
      "@id": "urn:state:cart",
      "@type": "State",
      "label": "Cart",
      "surfaceRef": "urn:surface:cart"
    },
    {
      "@id": "urn:surface:cart",
      "@type": "Surface",
      "surfaceStateRef": "urn:state:cart"
    }
  ]
}
```

This example means:

- `cart` has its own addressable surface identity.
- `urn:surface:cart` is not a reusable template for other states.
- the graph remains the only source of truth for state and transition behavior.

## Appendix: Opaque Runtime Hints {.unnumbered}

```json
{
  "@id": "urn:surface:cart",
  "@type": "Surface",
  "extensions": {
    "com.acme.renderer": {
      "component": "CartScreen",
      "hydration": "eager"
    }
  }
}
```

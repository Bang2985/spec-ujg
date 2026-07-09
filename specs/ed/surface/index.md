## Overview

This core-family layer defines a graph-successor vocabulary for assigning an addressable `Surface`
to a Graph subject and, when needed, to the `Touchpoint` that presents that surface.

A `Surface` identifies a design-system-agnostic visible occurrence of one graph subject. Supported
graph subjects are `State`, `CompositeState`, `Transition`, `OutgoingTransition`, and
`OutgoingTransitionGroup`. A surface may represent a page, screen, dialog, prompt, frame,
application shell, transition affordance, action bar, reusable choice group, repeated card, repeated
slide, or other user-facing boundary. A single `Surface` is not a reusable template shared by many
graph subjects, but many `Surface` nodes may expose the same graph subject in different visible
occurrences.

A `Touchpoint` identifies the system, channel, origin, or service boundary through which a surface is
presented to a human. Touchpoints are optional: a surface can be addressable without declaring its
touchpoint, and a document can model graph topology without using Surface at all.

`GraphNodeInstance` identifies a concrete visible occurrence of a graph node. It is useful when the
same graph node is repeated with different content or under different parent occurrences, such as
slides inside one image slider occurrence inside one blog post occurrence.

Surface annotates the shared graph with materialized boundary identity from the Surface layer. Graph
subjects do not carry Surface references and do not depend on this module. Surface does not change
graph topology, traversal rules, import resolution, rendering behavior, or runtime semantics. It also
does not define how a surface is realized by a design system.

## Normative Artifacts

Surface is published through the following artifacts:

- `surface.ttl`: ontology, published at `https://ujg.specs.openuji.org/ed/ns/surface`
- `surface.context.jsonld`: JSON-LD term mappings, published at `https://ujg.specs.openuji.org/ed/ns/surface.context.jsonld`
- `surface.shape.ttl`: SHACL validation rules, published at `https://ujg.specs.openuji.org/ed/ns/surface.shape`

Examples in this page compose the shared baseline context `https://ujg.specs.openuji.org/ed/ns/context.jsonld`
with the Surface context.

Non-goals:

- Surface does not define rendering engines, widget libraries, styling systems, hydration
  behavior, component trees, region trees, layout semantics, or presentation semantics.
- Surface does not define references from `Surface` to `DesignSystem`, `Component`, `Template`,
  `Slot`, `SlotBinding`, `TokenSource`, or `SurfaceRealization` resources.
- Surface does not introduce new traversal semantics beyond UJG Graph.
- `Touchpoint` does not define actor responsibility, authorization, runtime attribution, server
  truth, queue state, or protocol state.
- Surface does not replace opaque vendor-private hints carried in UJG Core `extensions`.

## Terminology

- <dfn>Surface</dfn>: An addressable, design-system-agnostic materialized boundary for exactly one
  Graph subject occurrence.
- <dfn>Touchpoint</dfn>: An addressable system, channel, origin, or service boundary through which a
  surface is presented to a human.
- <dfn>GraphNodeInstance</dfn>: An addressable concrete occurrence of one supported Graph node.
- <dfn>Surface attachment</dfn>: The relation that assigns a surface to the graph node it exposes.
- <dfn>Touchpoint attachment</dfn>: The relation that assigns a surface to its presenting
  touchpoint.
- <dfn>Instance attachment</dfn>: The relation that assigns a surface to the graph-node occurrence it
  materializes.

## Attachment Model

Surface introduces two canonical interoperable attachments:

- `surface:graphNodeRef` links a `Surface` to a Graph subject.
- `surface:touchpointRef` links a `Surface` to a `Touchpoint`.
- `surface:graphNodeInstanceRef` links a `Surface` to a `GraphNodeInstance`.

Allowed graph subjects are:

- `State`
- `CompositeState`
- `Transition`
- `OutgoingTransition`
- `OutgoingTransitionGroup`

`graphNodeRef` is the canonical assignment form from Surface to Graph subject. To resolve surfaces
for a graph subject, consumers find `Surface` nodes whose `graphNodeRef` value is that graph
subject.

A graph subject without a referencing `Surface` remains fully valid and traversable. Consumers MAY
ignore this module and still process the graph.

A `Surface` MUST reference exactly one Graph subject in the validated document set using
`graphNodeRef`. A graph subject MAY be referenced by more than one `Surface` when it has multiple
visible occurrences.

A `Surface` MAY reference at most one `Touchpoint` using `touchpointRef`. The touchpoint identifies
the presenting system, channel, origin, or service boundary for that surface. `touchpointRef` MUST
NOT be interpreted as graph traversal, actor responsibility, runtime attribution, or ownership truth.
A `Touchpoint` MAY be referenced by many surfaces.

A `Surface` MAY reference at most one `GraphNodeInstance` using `graphNodeInstanceRef`.
`GraphNodeInstance.graphNodeRef` MUST reference exactly one supported Graph node. Producers SHOULD
use matching `graphNodeRef` values on the `Surface` and its referenced `GraphNodeInstance` when the
surface is a direct visible occurrence of that graph node. A `GraphNodeInstance` MAY reference a
parent `GraphNodeInstance` using `parentInstanceRef`, allowing consumers to derive occurrence trees.

A `CompositeState` MAY have its own `Surface` when the composite state has a user-facing material
boundary as a whole, such as a shell, frame, scaffold, wizard frame, dashboard region, checkout
shell, kiosk session frame, or settings layout. A composite-state surface does not replace child
state surfaces and does not define containment beyond Graph semantics.

Transition and outgoing-transition surfaces represent user-facing transition affordances or
invocation boundaries. They MUST NOT imply transition execution, transition availability, traversal,
state activation, ordering, or lifecycle semantics.

An `OutgoingTransitionGroup` MAY have its own `Surface`. Each child `OutgoingTransition` MAY also
have its own `Surface`. These surfaces are independent: the group surface represents the group-level
presentation boundary, while each outgoing-transition surface represents that outgoing transition's
own affordance. A group surface does not override, inherit into, or replace child outgoing-transition
surfaces. If both are present, consumers MAY materialize the group surface as a container and child
outgoing-transition surfaces as individual affordances, but this remains presentation only and MUST
NOT change outgoing-transition injection, traversal, transition availability, state activation, or
Graph validity.

Multi-platform, multi-renderer, or multi-design-system output SHOULD NOT be represented by assigning
multiple surfaces to the same graph subject merely to select implementations. Such alternatives
belong in realization resources defined by modules that depend on Surface. Multiple surfaces are for
distinct visible occurrences, not component or renderer variants.

## Ontology {data-cop-concept="ontology"}

The normative Surface ontology is defined below and is published at
`https://ujg.specs.openuji.org/ed/ns/surface`. It is the authoritative structural definition for
`Surface`, `Touchpoint`, `GraphNodeInstance`, `graphNodeRef`, `touchpointRef`, and
`graphNodeInstanceRef`.

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
2. **Single exposed graph node:** A `Surface` MUST identify exactly one Graph subject. A graph subject
   MAY be referenced by more than one `Surface`.
3. **Canonical direction:** `graphNodeRef` is the canonical assignment from `Surface` to Graph subject.
4. **Optional instance:** `graphNodeInstanceRef` MAY identify the concrete graph-node occurrence that
   a surface materializes.
5. **Optional touchpoint:** `touchpointRef` MAY identify the touchpoint that presents a surface.
   Missing `touchpointRef` means the presenting touchpoint is not stated.
6. **Touchpoint boundary only:** `Touchpoint` MUST NOT be interpreted as an Actor, as authorization
   data, as runtime evidence, or as server-internal truth.
7. **Graceful degradation:** A consumer that does not implement Surface semantics MAY ignore Surface
   data, but it SHOULD preserve recognized JSON-LD data during read-transform-write when possible.
8. **Design-system agnostic:** Surface properties MUST NOT define or imply design-system
   realization, component selection, template selection, slot binding, token-source selection, or
   rendering behavior.
9. **Interoperable realization:** Component, template, slot, slot-binding, token-source, and
   surface-realization relationships intended for interoperability SHOULD be expressed by an optional
   module that depends on Surface.

## State Surface Example

```json
{
  "@context": [
    "https://ujg.specs.openuji.org/ed/ns/context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/surface.context.jsonld"
  ],
  "@id": "https://example.com/ujg/surface/checkout.jsonld",
  "@type": "UJGDocument",
  "nodes": [
    {
      "@id": "urn:state:cart",
      "@type": "State",
      "label": "Cart"
    },
    {
      "@id": "urn:surface:cart",
      "@type": "Surface",
      "graphNodeRef": "urn:state:cart",
      "touchpointRef": "urn:touchpoint:web"
    },
    {
      "@id": "urn:touchpoint:web",
      "@type": "Touchpoint",
      "label": "Web",
      "channel": "web",
      "origin": "https://shop.example"
    }
  ]
}
```

This example means:

- `urn:surface:cart` identifies the addressable surface for `cart`.
- `urn:surface:cart` is not a reusable template for other states.
- `urn:touchpoint:web` identifies the system/channel boundary that presents the cart surface.
- the graph remains the only source of truth for state and transition behavior.

## Transition Surface Example

```json
{
  "@context": [
    "https://ujg.specs.openuji.org/ed/ns/context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/surface.context.jsonld"
  ],
  "@id": "https://example.com/ujg/surface/transition.jsonld",
  "@type": "UJGDocument",
  "nodes": [
    {
      "@id": "urn:state:cart",
      "@type": "State",
      "label": "Cart"
    },
    {
      "@id": "urn:state:checkout",
      "@type": "State",
      "label": "Checkout"
    },
    {
      "@id": "urn:transition:checkout",
      "@type": "Transition",
      "from": "urn:state:cart",
      "to": "urn:state:checkout"
    },
    {
      "@id": "urn:surface:checkout-action",
      "@type": "Surface",
      "graphNodeRef": "urn:transition:checkout"
    }
  ]
}
```

This example assigns a surface to the user-facing affordance for a transition. It does not execute
the transition or change traversal semantics.

## Outgoing Transition Group Surface Example

```json
{
  "@context": [
    "https://ujg.specs.openuji.org/ed/ns/context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/surface.context.jsonld"
  ],
  "@id": "https://example.com/ujg/surface/outgoing-group.jsonld",
  "@type": "UJGDocument",
  "nodes": [
    {
      "@id": "urn:outgoing:home",
      "@type": "OutgoingTransition",
      "to": "urn:state:home"
    },
    {
      "@id": "urn:outgoing:profile",
      "@type": "OutgoingTransition",
      "to": "urn:state:profile"
    },
    {
      "@id": "urn:outgoing-group:global-nav",
      "@type": "OutgoingTransitionGroup",
      "outgoingTransitionRefs": ["urn:outgoing:home", "urn:outgoing:profile"]
    },
    {
      "@id": "urn:surface:global-nav",
      "@type": "Surface",
      "graphNodeRef": "urn:outgoing-group:global-nav"
    },
    {
      "@id": "urn:surface:home-action",
      "@type": "Surface",
      "graphNodeRef": "urn:outgoing:home"
    }
  ]
}
```

The group surface represents the shared navigation boundary. The child outgoing-transition surface
represents that outgoing transition's own affordance. Neither surface overrides the other.

## Graph Node Instance Example

```json
{
  "@context": [
    "https://ujg.specs.openuji.org/ed/ns/context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/surface.context.jsonld"
  ],
  "@id": "https://example.com/ujg/surface/repeated-slide.jsonld",
  "@type": "UJGDocument",
  "nodes": [
    {
      "@id": "urn:state:blog-post",
      "@type": "CompositeState",
      "label": "Blog post",
      "subjourneyId": "urn:journey:blog-post"
    },
    {
      "@id": "urn:state:image-slide",
      "@type": "State",
      "label": "Image slide"
    },
    {
      "@id": "urn:graph-node-instance:blog-post:123",
      "@type": "GraphNodeInstance",
      "graphNodeRef": "urn:state:blog-post"
    },
    {
      "@id": "urn:graph-node-instance:blog-post:123:slide-1",
      "@type": "GraphNodeInstance",
      "graphNodeRef": "urn:state:image-slide",
      "parentInstanceRef": "urn:graph-node-instance:blog-post:123"
    },
    {
      "@id": "urn:surface:image-slide:post-123:slide-1",
      "@type": "Surface",
      "graphNodeRef": "urn:state:image-slide",
      "graphNodeInstanceRef": "urn:graph-node-instance:blog-post:123:slide-1"
    }
  ]
}
```

This example models one concrete image-slide occurrence inside one concrete blog-post occurrence.
The graph still defines the reusable state semantics; the instance nodes identify visible
occurrences of those graph nodes.

## Appendix: Private Extension Payloads {.unnumbered}

Core `extensions` remains available for private data that is not intended to participate in
interoperable Surface semantics.

```json
{
  "@id": "urn:surface:cart",
  "@type": "Surface",
  "graphNodeRef": "urn:state:cart",
  "extensions": {
    "com.acme.audit": {
      "reviewTicket": "ACME-1234"
    }
  }
}
```

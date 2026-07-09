## Overview

This optional module defines a vocabulary for **experience semantics** traditionally found in User
Journey Maps, such as steps, phases, and pain points. It adds UXR-oriented annotations over
[[UJG Surface]] without changing graph topology, runtime ordering, mapping behavior, or the core
journey mechanics.

## Normative Artifacts

This module is published through the following artifacts:

- `experience.ttl`: ontology, published at `https://ujg.specs.openuji.org/ed/ns/experience`
- `experience.context.jsonld`: JSON-LD term mappings, published at `https://ujg.specs.openuji.org/ed/ns/experience.context.jsonld`
- `experience.shape.ttl`: SHACL validation rules, published at `https://ujg.specs.openuji.org/ed/ns/experience.shape`

Examples in this page use an explicit context array composed from the published module contexts.
Documents that use Experience terms must include `https://ujg.specs.openuji.org/ed/ns/experience.context.jsonld`
explicitly; the aggregate ED context does not include this optional module.

**Non-goals:**

* This module does **not** define new traversal rules.
* This module does **not** affect Graph validity.

---

## Terminology

* <dfn>ExperienceStep</dfn>: A semantic grouping representing a “step” in a journey map. Not necessarily 1:1 with [=Surface=] or [=State=].
* <dfn>Phase</dfn>: A high-level stage used for grouping (e.g., awareness, checkout).
* <dfn>PainPoint</dfn>: A named issue or friction hypothesis attached to part of the intended experience.

---

## Annotation Model

Experience annotations add semantic grouping and interpretation to surfaces without changing
traversal behavior. The normative structural definition is provided by the ontology below; graph
meaning is derived through the referenced [=Surface=] and its `graphNodeRef`.

`surfaceRefs` records the surfaces that participate in an `ExperienceStep`. A step's touchpoints are
derived from the referenced surfaces' `touchpointRef` values when those references are present. The
referenced `Surface` nodes point back to their Graph subjects through Surface `graphNodeRef`.
`experienceRefs` records the journey steps a `PainPoint` annotates. None of these references define
new graph topology.

**Notes:**

* A Step **MUST NOT** imply traversal order. Order is defined only by [[UJG Graph]] transitions.
* A Step **MAY** include multiple surfaces; multiple steps **MAY** reference the same surface (e.g., when a surface serves multiple intents).

## Ontology {data-cop-concept="ontology"}

The normative Experience ontology is defined below and is published at `https://ujg.specs.openuji.org/ed/ns/experience`. It is the authoritative structural definition for `ExperienceStep`, `Phase`, `PainPoint`, and the Experience-specific properties declared by this module.

:::include ./experience.ttl :::

## JSON-LD Context {data-cop-concept="jsonld-context"}

The normative Experience JSON-LD context is defined below and is published at `https://ujg.specs.openuji.org/ed/ns/experience.context.jsonld`. It provides the compact JSON-LD term mappings for the Experience vocabulary.

:::include ./experience.context.jsonld :::

---

## Validation {data-cop-concept="validation"}

The normative Experience SHACL shape is defined below and is published at `https://ujg.specs.openuji.org/ed/ns/experience.shape`. It is the authoritative validation artifact for Experience structural constraints and shared-term usage.

:::include ./experience.shape.ttl :::

The rules below define the remaining resolution and non-structural constraints for Experience annotations.

1. **Resolution:** Every ID in `surfaceRefs` **MUST** resolve to a [=Surface=]; every ID in `experienceRefs` **MUST** resolve to an [=ExperienceStep=]; and `phaseRef` **MUST** resolve to a [=Phase=]. All referenced IDs **MUST** be within the current scope or imported modules.
2. **Non-Structural:** Experience objects **MUST NOT** introduce additional traversal semantics beyond [[UJG Graph]].

---

## Appendix: Combined JSON Example {.unnumbered}

```json
{
  "@context": [
    "https://ujg.specs.openuji.org/ed/ns/core.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/graph.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/surface.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/runtime.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/experience.context.jsonld"
  ],
  "@id": "https://example.com/ujg/experience/checkout.jsonld",
  "@type": "UJGDocument",
  "nodes": [
    {
      "@type": "State",
      "@id": "urn:ujg:state:shipping-form",
      "label": "Shipping"
    },

    {
      "@type": "State",
      "@id": "urn:ujg:state:payment",
      "label": "Payment"
    },

    { "@type": "Phase", "@id": "urn:ujg:phase:checkout", "label": "Checkout", "order": 2 },

    {
      "@type": "Touchpoint",
      "@id": "urn:ujg:touchpoint:web",
      "label": "Web",
      "channel": "web",
      "origin": "https://shop.example"
    },

    {
      "@type": "Surface",
      "@id": "urn:ujg:surface:shipping-form",
      "graphNodeRef": "urn:ujg:state:shipping-form",
      "touchpointRef": "urn:ujg:touchpoint:web"
    },

    {
      "@type": "Surface",
      "@id": "urn:ujg:surface:payment",
      "graphNodeRef": "urn:ujg:state:payment",
      "touchpointRef": "urn:ujg:touchpoint:web"
    },

    {
      "@type": "ExperienceStep",
      "@id": "urn:ujg:step:enter-shipping",
      "label": "Enter shipping details",
      "surfaceRefs": ["urn:ujg:surface:shipping-form"],
      "phaseRef": "urn:ujg:phase:checkout"
    },

    {
      "@type": "ExperienceStep",
      "@id": "urn:ujg:step:enter-payment",
      "label": "Enter payment details",
      "surfaceRefs": ["urn:ujg:surface:payment"],
      "phaseRef": "urn:ujg:phase:checkout"
    },

    {
      "@type": "PainPoint",
      "@id": "urn:ujg:pain:address-validation",
      "label": "Address validation friction",
      "severity": 0.7,
      "experienceRefs": [
        "urn:ujg:step:enter-shipping",
        "urn:ujg:step:enter-payment"
      ]
    },

    {
      "@type": "JourneyExecution",
      "@id": "urn:ujg:execution:12345"
    },

    {
      "@type": "SurfaceInstance",
      "@id": "urn:ujg:surface-instance:shipping-form",
      "surfaceRef": "urn:ujg:surface:shipping-form"
    },

    {
      "@type": "RuntimeEvent",
      "@id": "urn:ujg:event:12345:100",
      "executionId": "urn:ujg:execution:12345",
      "surfaceInstanceRef": "urn:ujg:surface-instance:shipping-form"
    }
  ]
}
```

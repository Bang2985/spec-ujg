## Overview

This optional module defines a graph-native vocabulary for attaching design-system and UI composition
metadata to [[UJG Graph]] nodes. It lets a producer bind a [=State=] to an addressable `UIView`
resource through `ds:viewRef` without hiding the relationship inside opaque Core `extensions`.

This module is optional. It annotates the shared graph with UI-facing resources, but it does **not**
change graph topology, traversal rules, or import resolution.

## Normative Artifacts

This module is published through the following artifacts:

- `design-system.ttl`: ontology, published at `https://ujg.specs.openuji.org/ed/ns/design-system`
- `design-system.context.jsonld`: JSON-LD term mappings, published at `https://ujg.specs.openuji.org/ed/ns/design-system.context.jsonld`
- `design-system.shape.ttl`: SHACL validation rules, published at `https://ujg.specs.openuji.org/ed/ns/design-system.shape`

Examples in this page compose the shared baseline context `https://ujg.specs.openuji.org/ed/ns/context.jsonld`
with the Design System context.

**Non-goals:**

* This module does **not** define rendering behavior, layout engines, or runtime hydration rules.
* This module does **not** introduce new traversal semantics beyond [[UJG Graph]].
* This module does **not** replace opaque vendor-private hints carried in [[UJG Core]] `extensions`.

## Terminology

* <dfn>UIView</dfn>: An addressable UI resource associated with a graph state.
* <dfn>UITheme</dfn>: A reusable theme or design-token bundle that can be applied to a `UIView`.
* <dfn>UIAction</dfn>: An addressable interaction affordance that binds UI intent to an existing Graph transition.

---

## Attachment Model

The module introduces real JSON-LD terms and RDF edges for UI attachment:

* `ds:viewRef` links a [=State=] to a `UIView`.
* `ds:themeRef` links a `UIView` to a reusable `UITheme`.
* `ds:actionRefs` links a `UIView` to one or more `UIAction` nodes.
* `ds:transitionRef` links a `UIAction` to an existing [=Transition=].

The module also defines non-reference properties such as `ds:profile`, `ds:registryItem`, `ds:variant`,
and JSON-valued `ds:slots` / `ds:tokenRefs` for structured but non-topological UI metadata.

## Ontology {data-cop-concept="ontology"}

The normative Design System ontology is defined below and is published at
`https://ujg.specs.openuji.org/ed/ns/design-system`. It is the authoritative structural definition
for `UIView`, `UITheme`, `UIAction`, and the properties declared by this module.

:::include ./design-system.ttl :::

## JSON-LD Context {data-cop-concept="jsonld-context"}

The normative Design System JSON-LD context is defined below and is published at
`https://ujg.specs.openuji.org/ed/ns/design-system.context.jsonld`. It provides the compact
JSON-LD term mappings and coercions for Design System-specific properties and classes.

:::include ./design-system.context.jsonld :::

---

## Validation {data-cop-concept="validation"}

The normative Design System SHACL shape is defined below and is published at
`https://ujg.specs.openuji.org/ed/ns/design-system.shape`. It is the authoritative validation
artifact for Design System structural constraints.

:::include ./design-system.shape.ttl :::

The rules below define the remaining module semantics beyond the structural constraints captured by
the SHACL shape.

1. **Attachment only:** `ds:viewRef` and related Design System properties **MUST NOT** change Graph
   validity, graph traversal behavior, import resolution, or core node identity.
2. **Transition binding:** Every `ds:transitionRef` **MUST** resolve to a [=Transition=] within the
   current scope or imported modules.
3. **Graceful degradation:** A consumer that does not implement this module **MAY** ignore Design
   System semantics, but it **SHOULD** preserve recognized JSON-LD data during read-transform-write
   when possible.
4. **Private runtime hints:** Renderer-private or deployment-private hints that are not intended for
   shared queryability or validation **SHOULD** remain in Core `extensions`.

---

## Appendix: Combined JSON Example {.unnumbered}

```json
{
  "@context": [
    "https://ujg.specs.openuji.org/ed/ns/context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/design-system.context.jsonld"
  ],
  "@id": "https://example.com/ujg/design-system/checkout.jsonld",
  "@type": "UJGDocument",
  "specVersion": "1.0",
  "nodes": [
    {
      "@type": "Journey",
      "@id": "urn:ujg:journey:checkout",
      "label": "Checkout",
      "startState": "urn:ujg:state:checkout.shipping",
      "stateRefs": [
        "urn:ujg:state:checkout.shipping",
        "urn:ujg:state:checkout.payment"
      ],
      "transitionRefs": [
        "urn:ujg:transition:shipping-to-payment"
      ]
    },
    {
      "@type": "State",
      "@id": "urn:ujg:state:checkout.shipping",
      "label": "Shipping",
      "ds:viewRef": "urn:ds:view:checkout-shipping"
    },
    {
      "@type": "State",
      "@id": "urn:ujg:state:checkout.payment",
      "label": "Payment"
    },
    {
      "@type": "Transition",
      "@id": "urn:ujg:transition:shipping-to-payment",
      "from": "urn:ujg:state:checkout.shipping",
      "to": "urn:ujg:state:checkout.payment",
      "label": "Shipping to Payment"
    },
    {
      "@type": "ds:UIView",
      "@id": "urn:ds:view:checkout-shipping",
      "label": "Checkout shipping page",
      "ds:profile": "shadcn",
      "ds:registryItem": "@acme/checkout-shipping-page",
      "ds:slots": {
        "header": "@acme/checkout-header",
        "form": "@acme/shipping-form"
      },
      "ds:actionRefs": [
        "urn:ds:action:continue"
      ],
      "ds:themeRef": "urn:ds:theme:acme-default"
    },
    {
      "@type": "ds:UIAction",
      "@id": "urn:ds:action:continue",
      "label": "Continue",
      "ds:transitionRef": "urn:ujg:transition:shipping-to-payment"
    },
    {
      "@type": "ds:UITheme",
      "@id": "urn:ds:theme:acme-default",
      "label": "Acme Default"
    }
  ]
}
```

## Appendix: Opaque Runtime Hints {.unnumbered}

```json
{
  "@id": "urn:ds:view:checkout-shipping",
  "@type": "ds:UIView",
  "ds:registryItem": "@acme/checkout-shipping-page",
  "extensions": {
    "com.acme.ui-runtime": {
      "hydrationStrategy": "client",
      "featureFlags": ["new-address-validation"]
    }
  }
}
```

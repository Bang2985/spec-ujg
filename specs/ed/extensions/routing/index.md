**Status:** incubating supported extension for routing metadata on UJG nodes.

This page provides an exploratory payload shape for routing concerns such as route names, path
templates, deep links, and fallback navigation hints. The schema and examples below are informative
brainstorming material, not normative conformance artifacts.

## Namespace

- Canonical namespace string: `https://ujg.specs.openuji.org/ed/extensions/routing`
- Payload location: `extensions["https://ujg.specs.openuji.org/ed/extensions/routing"]`

## Scope

- Applicable UJG objects: `Node`
- Likely attachment points: `ExperienceStep`, `State`, `Touchpoint`

## Exploratory JSON Schema

The current exploratory schema is defined below and is published at `https://ujg.specs.openuji.org/ed/ns/routing.schema.json`.

:::include ./routing.schema.json :::

## Example

```json
{
  "@id": "https://example.com/steps/shipping",
  "@type": "ExperienceStep",
  "extensions": {
    "https://ujg.specs.openuji.org/ed/extensions/routing": {
      "version": "0.1.0",
      "routeName": "checkout-shipping",
      "path": "/checkout/shipping",
      "deepLink": "myapp://checkout/shipping",
      "guards": ["cart-not-empty", "user-authenticated"],
      "params": {
        "market": ":market",
        "locale": ":locale"
      },
      "fallbackNodeRef": "https://example.com/steps/cart"
    }
  }
}
```

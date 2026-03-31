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

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ujg.specs.openuji.org/ed/extensions/routing/schema",
  "title": "UJG Routing Extension Payload",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "version": { "type": "string" },
    "routeName": { "type": "string" },
    "path": { "type": "string" },
    "deepLink": { "type": "string", "format": "uri-reference" },
    "guards": {
      "type": "array",
      "items": { "type": "string" }
    },
    "params": {
      "type": "object",
      "additionalProperties": { "type": "string" }
    },
    "fallbackNodeRef": { "type": "string", "format": "uri-reference" }
  },
  "required": ["routeName", "path"]
}
```

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

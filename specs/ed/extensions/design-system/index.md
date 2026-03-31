**Status:** incubating supported extension for design system metadata on UJG nodes.

This page provides an exploratory payload shape for design-system concerns such as component
selection, variants, token references, and slot-level rendering hints. The schema and examples below
are informative brainstorming material, not normative conformance artifacts.

## Namespace

- Canonical namespace string: `https://ujg.specs.openuji.org/ed/extensions/design-system`
- Payload location: `extensions["https://ujg.specs.openuji.org/ed/extensions/design-system"]`

## Scope

- Applicable UJG objects: `Node`
- Likely attachment points: `ExperienceStep`, `Touchpoint`, `State`

## Exploratory JSON Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ujg.specs.openuji.org/ed/extensions/design-system/schema",
  "title": "UJG Design System Extension Payload",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "version": { "type": "string" },
    "component": { "type": "string" },
    "variant": { "type": "string" },
    "themeRef": { "type": "string", "format": "uri-reference" },
    "tokenRefs": {
      "type": "object",
      "additionalProperties": { "type": "string" }
    },
    "slots": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "component": { "type": "string" },
          "contentKey": { "type": "string" },
          "visible": { "type": "boolean" }
        }
      }
    }
  },
  "required": ["component"]
}
```

## Example

```json
{
  "@id": "https://example.com/steps/cart-review",
  "@type": "ExperienceStep",
  "extensions": {
    "https://ujg.specs.openuji.org/ed/extensions/design-system": {
      "version": "0.1.0",
      "component": "checkout.summary-card",
      "variant": "compact",
      "themeRef": "https://example.com/themes/commerce/light",
      "tokenRefs": {
        "surface": "surface/subtle",
        "accent": "brand/primary",
        "spacing": "space/300"
      },
      "slots": {
        "header": {
          "contentKey": "cart.review.title",
          "visible": true
        },
        "footer": {
          "component": "checkout.summary-actions",
          "visible": true
        }
      }
    }
  }
}
```

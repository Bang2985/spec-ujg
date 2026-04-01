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

The current exploratory schema is defined below and is published at `https://ujg.specs.openuji.org/ed/ns/design-system.schema.json`.

:::include ./design-system.schema.json :::

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

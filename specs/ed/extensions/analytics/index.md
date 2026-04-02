**Status:** incubating opaque extension payload convention for analytics metadata on UJG nodes.

This page provides an exploratory payload shape for analytics concerns such as event names, tags,
dimensions, metrics, and consent flags. The schema and examples below are informative brainstorming
material, not normative conformance artifacts.

## Namespace

- Canonical namespace string: `https://ujg.specs.openuji.org/ed/extensions/analytics`
- Payload location: `extensions["https://ujg.specs.openuji.org/ed/extensions/analytics"]`

## Scope

- Applicable UJG objects: `Node`
- Likely attachment points: `ExperienceStep`, `Touchpoint`, `RuntimeEvent`

## Exploratory JSON Schema

The current exploratory schema is defined below and is published at `https://ujg.specs.openuji.org/ed/ns/analytics.schema.json`.

:::include ./analytics.schema.json :::

## Example

```json
{
  "@id": "https://example.com/runtime/events/checkout-submit",
  "@type": "RuntimeEvent",
  "extensions": {
    "https://ujg.specs.openuji.org/ed/extensions/analytics": {
      "version": "0.1.0",
      "eventName": "checkout_submit",
      "category": "conversion",
      "tags": ["checkout", "payment", "primary-cta"],
      "dimensions": {
        "market": "de",
        "deviceClass": "mobile"
      },
      "metrics": {
        "cartValue": 129.99
      },
      "consentRequired": true,
      "piiLevel": "low"
    }
  }
}
```

**Status:** incubating supported extension for analytics metadata on UJG nodes.

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

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ujg.specs.openuji.org/ed/extensions/analytics/schema",
  "title": "UJG Analytics Extension Payload",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "version": { "type": "string" },
    "eventName": { "type": "string" },
    "category": { "type": "string" },
    "tags": {
      "type": "array",
      "items": { "type": "string" }
    },
    "dimensions": {
      "type": "object",
      "additionalProperties": {
        "type": ["string", "number", "boolean"]
      }
    },
    "metrics": {
      "type": "object",
      "additionalProperties": { "type": "number" }
    },
    "consentRequired": { "type": "boolean" },
    "piiLevel": {
      "type": "string",
      "enum": ["none", "low", "high"]
    }
  },
  "required": ["eventName"]
}
```

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

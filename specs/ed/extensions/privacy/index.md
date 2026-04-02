**Status:** incubating opaque extension payload convention for privacy metadata on UJG nodes.

This page provides an exploratory payload shape for privacy concerns such as data classification,
consent purposes, retention windows, and redaction rules. The schema and examples below are
informative brainstorming material, not normative conformance artifacts.

## Namespace

- Canonical namespace string: `https://ujg.specs.openuji.org/ed/extensions/privacy`
- Payload location: `extensions["https://ujg.specs.openuji.org/ed/extensions/privacy"]`

## Scope

- Applicable UJG objects: `Node`
- Likely attachment points: `Touchpoint`, `RuntimeEvent`, `ExperienceStep`

## Exploratory JSON Schema

The current exploratory schema is defined below and is published at `https://ujg.specs.openuji.org/ed/ns/privacy.schema.json`.

:::include ./privacy.schema.json :::

## Example

```json
{
  "@id": "https://example.com/runtime/events/payment-authorized",
  "@type": "RuntimeEvent",
  "extensions": {
    "https://ujg.specs.openuji.org/ed/extensions/privacy": {
      "version": "0.1.0",
      "dataClassification": "personal",
      "legalBasis": "contract",
      "consentPurposes": ["analytics-basic", "fraud-prevention"],
      "retentionDays": 365,
      "redaction": {
        "email": true,
        "cardLast4": false
      },
      "sharing": {
        "processors": ["payments.vendor-a", "fraud.vendor-b"],
        "transferRegion": "eu"
      }
    }
  }
}
```

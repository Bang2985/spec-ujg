**Status:** incubating supported extension for privacy metadata on UJG nodes.

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

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ujg.specs.openuji.org/ed/extensions/privacy/schema",
  "title": "UJG Privacy Extension Payload",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "version": { "type": "string" },
    "dataClassification": {
      "type": "string",
      "enum": ["public", "internal", "personal", "sensitive"]
    },
    "legalBasis": { "type": "string" },
    "consentPurposes": {
      "type": "array",
      "items": { "type": "string" }
    },
    "retentionDays": { "type": "integer", "minimum": 0 },
    "redaction": {
      "type": "object",
      "additionalProperties": { "type": "boolean" }
    },
    "sharing": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "processors": {
          "type": "array",
          "items": { "type": "string" }
        },
        "transferRegion": { "type": "string" }
      }
    }
  },
  "required": ["dataClassification"]
}
```

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

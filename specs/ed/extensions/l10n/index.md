**Status:** incubating supported extension for localization metadata on UJG nodes.

This page provides an exploratory payload shape for localization concerns such as message keys,
locale overrides, and fallback behavior. The schema and examples below are informative brainstorming
material, not normative conformance artifacts.

## Namespace

- Canonical namespace string: `https://ujg.specs.openuji.org/ed/extensions/l10n`
- Payload location: `extensions["https://ujg.specs.openuji.org/ed/extensions/l10n"]`

## Scope

- Applicable UJG objects: `Node`
- Likely attachment points: `ExperienceStep`, `Touchpoint`, `PainPoint`

## Exploratory JSON Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ujg.specs.openuji.org/ed/extensions/l10n/schema",
  "title": "UJG Localization Extension Payload",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "version": { "type": "string" },
    "namespace": { "type": "string" },
    "messageKey": { "type": "string" },
    "defaultLocale": { "type": "string" },
    "fallbackLocales": {
      "type": "array",
      "items": { "type": "string" }
    },
    "rtl": { "type": "boolean" },
    "locales": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "additionalProperties": { "type": "string" }
      }
    }
  },
  "required": ["messageKey"]
}
```

## Example

```json
{
  "@id": "https://example.com/steps/order-confirmation",
  "@type": "ExperienceStep",
  "extensions": {
    "https://ujg.specs.openuji.org/ed/extensions/l10n": {
      "version": "0.1.0",
      "namespace": "checkout.confirmation",
      "messageKey": "order.confirmation.title",
      "defaultLocale": "en",
      "fallbackLocales": ["en", "de"],
      "rtl": false,
      "locales": {
        "en": {
          "title": "Order confirmed",
          "subtitle": "Your receipt is on the way."
        },
        "de": {
          "title": "Bestellung bestaetigt",
          "subtitle": "Ihre Quittung ist unterwegs."
        }
      }
    }
  }
}
```

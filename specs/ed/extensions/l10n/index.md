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

The current exploratory schema is defined below and is published at `https://ujg.specs.openuji.org/ed/ns/l10n.schema.json`.

:::include ./l10n.schema.json :::

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

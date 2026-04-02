**Status:** incubating opaque extension payload convention for accessibility metadata on UJG nodes.

This page provides an exploratory payload shape for accessibility concerns such as labels, focus
behavior, live-region announcements, and ARIA-style hints. The schema and examples below are
informative brainstorming material, not normative conformance artifacts.

## Namespace

- Canonical namespace string: `https://ujg.specs.openuji.org/ed/extensions/a11y`
- Payload location: `extensions["https://ujg.specs.openuji.org/ed/extensions/a11y"]`

## Scope

- Applicable UJG objects: `Node`
- Likely attachment points: `ExperienceStep`, `Touchpoint`, `PainPoint`

## Exploratory JSON Schema

The current exploratory schema is defined below and is published at `https://ujg.specs.openuji.org/ed/ns/a11y.schema.json`.

:::include ./a11y.schema.json :::

## Example

```json
{
  "@id": "https://example.com/steps/payment",
  "@type": "ExperienceStep",
  "extensions": {
    "https://ujg.specs.openuji.org/ed/extensions/a11y": {
      "version": "0.1.0",
      "label": "Payment details",
      "description": "Enter card details and review the secure-payment summary.",
      "role": "form",
      "focusOrder": 3,
      "reducedMotion": true,
      "highContrast": true,
      "keyboardShortcuts": ["Alt+P"],
      "liveRegion": {
        "politeness": "polite",
        "messageKey": "payment.status.update"
      },
      "aria": {
        "aria-describedby": "payment-help",
        "aria-busy": false
      }
    }
  }
}
```

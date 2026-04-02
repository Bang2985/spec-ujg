**Status:** incubating opaque extension payload convention for experimentation metadata on UJG nodes.

This page provides an exploratory payload shape for experimentation concerns such as experiment keys,
variant assignment, activation windows, and kill-switch behavior. The schema and examples below are
informative brainstorming material, not normative conformance artifacts.

## Namespace

- Canonical namespace string: `https://ujg.specs.openuji.org/ed/extensions/experimentation`
- Payload location: `extensions["https://ujg.specs.openuji.org/ed/extensions/experimentation"]`

## Scope

- Applicable UJG objects: `Node`
- Likely attachment points: `ExperienceStep`, `Touchpoint`, `State`

## Exploratory JSON Schema

The current exploratory schema is defined below and is published at `https://ujg.specs.openuji.org/ed/ns/experimentation.schema.json`.

:::include ./experimentation.schema.json :::

## Example

```json
{
  "@id": "https://example.com/steps/upsell",
  "@type": "ExperienceStep",
  "extensions": {
    "https://ujg.specs.openuji.org/ed/extensions/experimentation": {
      "version": "0.1.0",
      "experimentKey": "upsell-layout-2026-q2",
      "variantKey": "card-grid-b",
      "audiences": ["returning-user", "cart-value-high"],
      "exposureEvent": "upsell_impression",
      "fallbackVariant": "control",
      "stickyAssignment": "session",
      "activation": {
        "startAt": "2026-04-01T00:00:00Z",
        "endAt": "2026-06-30T23:59:59Z",
        "killSwitch": false
      }
    }
  }
}
```

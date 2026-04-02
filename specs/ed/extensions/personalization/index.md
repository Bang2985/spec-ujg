**Status:** incubating opaque extension payload convention for personalization metadata on UJG nodes.

This page provides an exploratory payload shape for personalization concerns such as audiences,
ranking strategy, variant references, and session stickiness. The schema and examples below are
informative brainstorming material, not normative conformance artifacts.

## Namespace

- Canonical namespace string: `https://ujg.specs.openuji.org/ed/extensions/personalization`
- Payload location: `extensions["https://ujg.specs.openuji.org/ed/extensions/personalization"]`

## Scope

- Applicable UJG objects: `Node`
- Likely attachment points: `ExperienceStep`, `Touchpoint`, `State`

## Exploratory JSON Schema

The current exploratory schema is defined below and is published at `https://ujg.specs.openuji.org/ed/ns/personalization.schema.json`.

:::include ./personalization.schema.json :::

## Example

```json
{
  "@id": "https://example.com/steps/home-hero",
  "@type": "ExperienceStep",
  "extensions": {
    "https://ujg.specs.openuji.org/ed/extensions/personalization": {
      "version": "0.1.0",
      "audiences": ["returning-user", "premium-tier"],
      "rankingStrategy": "score-desc",
      "sessionSticky": true,
      "fallbackNodeRef": "https://example.com/steps/home-hero-default",
      "variantRefs": {
        "hero": "https://example.com/content/hero-premium",
        "cta": "https://example.com/content/cta-upsell"
      },
      "eligibility": {
        "cartValueMin": 50,
        "loyaltyMember": true
      }
    }
  }
}
```

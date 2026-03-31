**Status:** incubating supported extension for personalization metadata on UJG nodes.

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

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ujg.specs.openuji.org/ed/extensions/personalization/schema",
  "title": "UJG Personalization Extension Payload",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "version": { "type": "string" },
    "audiences": {
      "type": "array",
      "items": { "type": "string" }
    },
    "rankingStrategy": { "type": "string" },
    "sessionSticky": { "type": "boolean" },
    "fallbackNodeRef": { "type": "string", "format": "uri-reference" },
    "variantRefs": {
      "type": "object",
      "additionalProperties": { "type": "string", "format": "uri-reference" }
    },
    "eligibility": {
      "type": "object",
      "additionalProperties": {
        "type": ["string", "number", "boolean"]
      }
    }
  }
}
```

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

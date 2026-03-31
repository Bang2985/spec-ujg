**Status:** incubating supported extension for AI runtime metadata on UJG nodes.

This page provides an exploratory payload shape for AI-runtime concerns such as prompt references,
memory policy, tool preferences, and guardrail hints. The schema and examples below are informative
brainstorming material, not normative conformance artifacts.

## Namespace

- Canonical namespace string: `https://ujg.specs.openuji.org/ed/extensions/ai-runtime`
- Payload location: `extensions["https://ujg.specs.openuji.org/ed/extensions/ai-runtime"]`

## Scope

- Applicable UJG objects: `Node`
- Likely attachment points: `ExperienceStep`, `Touchpoint`, `RuntimeEvent`

## Exploratory JSON Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ujg.specs.openuji.org/ed/extensions/ai-runtime/schema",
  "title": "UJG AI Runtime Extension Payload",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "version": { "type": "string" },
    "promptTemplateRef": { "type": "string", "format": "uri-reference" },
    "systemPolicyRef": { "type": "string", "format": "uri-reference" },
    "memoryPolicy": {
      "type": "string",
      "enum": ["none", "session", "user"]
    },
    "toolRefs": {
      "type": "array",
      "items": { "type": "string", "format": "uri-reference" }
    },
    "fallbackMessageKey": { "type": "string" },
    "maxTokens": { "type": "integer", "minimum": 1 },
    "guardrails": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "blockPII": { "type": "boolean" },
        "requireCitation": { "type": "boolean" },
        "escalateNodeRef": { "type": "string", "format": "uri-reference" }
      }
    }
  },
  "required": ["promptTemplateRef"]
}
```

## Example

```json
{
  "@id": "https://example.com/steps/support-chat",
  "@type": "ExperienceStep",
  "extensions": {
    "https://ujg.specs.openuji.org/ed/extensions/ai-runtime": {
      "version": "0.1.0",
      "promptTemplateRef": "https://example.com/prompts/support-triage/v3",
      "systemPolicyRef": "https://example.com/policies/agent-support",
      "memoryPolicy": "session",
      "toolRefs": [
        "https://example.com/tools/order-lookup",
        "https://example.com/tools/refund-policy"
      ],
      "fallbackMessageKey": "support.chat.fallback",
      "maxTokens": 1200,
      "guardrails": {
        "blockPII": true,
        "requireCitation": true,
        "escalateNodeRef": "https://example.com/steps/human-handoff"
      }
    }
  }
}
```

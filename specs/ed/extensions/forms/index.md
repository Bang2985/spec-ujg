**Status:** incubating supported extension for form metadata on UJG nodes.

This page provides an exploratory payload shape for forms concerns such as action endpoints, methods,
field definitions, validation hints, and success or error routing. The schema and examples below are
informative brainstorming material, not normative conformance artifacts.

## Namespace

- Canonical namespace string: `https://ujg.specs.openuji.org/ed/extensions/forms`
- Payload location: `extensions["https://ujg.specs.openuji.org/ed/extensions/forms"]`

## Scope

- Applicable UJG objects: `Node`
- Likely attachment points: `ExperienceStep`, `Touchpoint`

## Exploratory JSON Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ujg.specs.openuji.org/ed/extensions/forms/schema",
  "title": "UJG Forms Extension Payload",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "version": { "type": "string" },
    "formId": { "type": "string" },
    "method": {
      "type": "string",
      "enum": ["GET", "POST", "PUT", "PATCH"]
    },
    "action": { "type": "string", "format": "uri-reference" },
    "schemaRef": { "type": "string", "format": "uri-reference" },
    "autosave": { "type": "boolean" },
    "fields": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "id": { "type": "string" },
          "type": { "type": "string" },
          "labelKey": { "type": "string" },
          "required": { "type": "boolean" },
          "validationRef": { "type": "string", "format": "uri-reference" }
        },
        "required": ["id", "type"]
      }
    },
    "successNodeRef": { "type": "string", "format": "uri-reference" },
    "errorNodeRef": { "type": "string", "format": "uri-reference" }
  },
  "required": ["formId", "method"]
}
```

## Example

```json
{
  "@id": "https://example.com/steps/address-form",
  "@type": "ExperienceStep",
  "extensions": {
    "https://ujg.specs.openuji.org/ed/extensions/forms": {
      "version": "0.1.0",
      "formId": "shipping-address",
      "method": "POST",
      "action": "https://api.example.com/forms/shipping-address",
      "schemaRef": "https://api.example.com/forms/shipping-address/schema",
      "autosave": true,
      "fields": [
        {
          "id": "postalCode",
          "type": "text",
          "labelKey": "address.postalCode",
          "required": true,
          "validationRef": "https://example.com/validation/postal-code"
        },
        {
          "id": "city",
          "type": "text",
          "labelKey": "address.city",
          "required": true
        }
      ],
      "successNodeRef": "https://example.com/steps/payment",
      "errorNodeRef": "https://example.com/steps/address-error"
    }
  }
}
```

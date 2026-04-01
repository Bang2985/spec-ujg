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

The current exploratory schema is defined below and is published at `https://ujg.specs.openuji.org/ed/ns/forms.schema.json`.

:::include ./forms.schema.json :::

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

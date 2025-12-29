# Module: Serialization & Data Format (`/ed/serialization/`)

## Abstract

This module defines the JSON representation for User Journey Graph (UJG) data. It specifies shared conventions (identifiers, timestamps, referencing rules, extensibility, and forward compatibility) used by all other modules, including Core Journey Graph (design-time) and Runtime Execution (runtime traces).

This module is written so producers can emit UJG data and consumers can reliably validate, store, and exchange it across tools.

## What this module covers

This module defines:

- the required JSON shape conventions used across UJG objects,
- rules for identifiers and references,
- timestamp formats,
- how to add extensions without breaking interoperability,
- an optional JSON-LD mode for linked-data environments.

This module does **not** define conformance classification logic (see Conformance & Validation).

## Serialization format (normative)

### JSON

- UJG data MUST be serialized as JSON values as defined by RFC 8259.
- Text MUST be encoded as UTF-8.
- Objects MUST use string keys.
- Arrays MUST preserve element order.
- A UJG document MAY contain a single top-level object (common), or a bundle of objects (see "Bundling" below).

## Common fields and conventions (normative)

### type

- Every UJG object MUST include a `type` property whose value is a string.
- Examples:
  - `JourneyDefinition`
  - `State`
  - `Transition`
  - `JourneyExecution`
  - `Event`
- Consumers MUST use `type` to determine how to interpret an object.

### id

- Objects that are intended to be referenced MUST have an `id` property.
- `id` MUST be a string.
- `id` SHOULD be globally unique in the publisher's context.
- `id` SHOULD be stable across time.
- **Recommended forms:**
  - absolute URLs/URIs (best for sharing across systems),
  - URNs,
  - or namespaced strings when operating within a single system.

### version

- Objects that define a stable contract over time MUST include a `version`.
- `JourneyDefinition` MUST include `version`.
- `JourneyExecution` SHOULD include a reference to the definition version (via `definitionRef`, see below).

### Reserved keys

The following keys are reserved across UJG objects:

`type`, `id`, `version`, `name`, `description`, `createdAt`, `updatedAt`, `extensions`, `@context`

- Producers MUST NOT change the meaning of reserved keys.
- Consumers MUST ignore unknown non-reserved keys (see Forward compatibility), but MUST treat reserved-key misuse as an error.

## Timestamps (normative)

Whenever timestamps are used (e.g., `startedAt`, `endedAt`, `at`):

- They MUST be strings in RFC 3339 / ISO 8601 format (e.g., `2025-12-29T10:12:00Z`).
- They SHOULD include a timezone offset or `Z` (UTC).

If a Consumer requires ordering:

- it MUST order by timestamp value,
- and MUST document how ties are handled (e.g., stable ordering by array position).

## References (normative)

### Referencing by identifier

When one object references another, it MUST do so using the target object's identifier (a string), unless explicitly stated otherwise.

**Example:**

A Transition references `from` and `to` states by state ID string.

### definitionRef

Runtime objects SHOULD reference the design-time definition they relate to.

`definitionRef` MUST be an object with:

- `id` (JourneyDefinition id)
- `version` (JourneyDefinition version)

**Example:**

```json
"definitionRef": {
  "id": "https://ujg.example/TR/2026.01/journeys/checkout",
  "version": "2026.01"
}
```

If `definitionRef` is present:

- any `stateRef` / `transitionRef` values MUST resolve against that definition version.

## Extensibility (normative + readable)

UJG is designed to be extended without breaking interoperability.

### The extensions container (recommended)

Any UJG object MAY include an `extensions` object to hold additional properties.

**Rules:**

- `extensions` MUST be a JSON object.
- Keys inside `extensions` SHOULD be namespaced to avoid collisions.
- **Recommended key styles:**
  - URI-like: `"https://vendor.example/metrics#rageClicks": 3`
  - compact namespace: `"vendor:rageClicks": 3`

**Consumers:**

- MUST ignore unknown extension keys they do not understand,
- MUST preserve extension content when round-tripping (if acting as a proxy or store), when practical.

### Top-level extra keys (allowed, with caution)

Producers MAY include additional top-level keys outside `extensions` as long as:

- they do not collide with reserved keys,
- and they do not change the meaning of normative fields.

(For interoperability, `extensions` is preferred.)

## Forward compatibility (normative)

Consumers MUST be forward compatible by default:

- Consumers MUST ignore unknown keys that are not reserved.
- Consumers MUST ignore unknown values in extensible enums when those values appear only in non-normative fields (e.g., `tags`, `metadata`).
- Consumers MUST fail validation if required fields are missing or invalid.

Producers SHOULD:

- avoid breaking changes within the same TR snapshot,
- bump `JourneyDefinition.version` when identifiers or normative meanings change.

## Bundling multiple objects (informative, common in practice)

Some systems want to ship a definition plus related runtime data together.

A bundling format MAY be used like:

```json
{
  "type": "UJGDocument",
  "items": [
    { "type": "JourneyDefinition", "...": "..." },
    { "type": "JourneyExecution", "...": "..." }
  ]
}
```

If bundling is used:

- `items` SHOULD be an array of UJG objects,
- each object MUST still follow its own serialization rules.

Bundling is optional; consumers MAY accept single-object payloads.

## Required JSON shapes (normative cross-check)

This module does not re-define the full models, but it pins down serialization expectations that apply across modules:

### JourneyDefinition (design-time)

A `JourneyDefinition` JSON object MUST include:

- `type: "JourneyDefinition"`
- `id`
- `version`
- `startState` (string)
- `states` (array of State objects)
- `transitions` (array of Transition objects)

### State

A `State` JSON object MUST include:

- `type: "State"` (recommended) OR be a state object within `states` (allowed to omit type if the parent context is explicit)
- `id`
- `label`

### Transition

A `Transition` JSON object MUST include:

- `id`
- `from` (state id string)
- `to` (state id string)
- `on` (array of event type strings)

### JourneyExecution (runtime)

A `JourneyExecution` JSON object MUST include:

- `type: "JourneyExecution"`
- `id`
- `startedAt`
- `events` (array of Event objects)

### Event

An `Event` JSON object MUST include:

- `id` (unique within the execution)
- `type` (event type string)
- `at` (timestamp)

Event MAY include:

- `stateRef` (string)
- `transitionRef` (string)
- `properties` (object)
- `extensions` (object)

## Optional JSON-LD mode (informative, for linked-data users)

UJG can be used as plain JSON. If a publisher wants JSON-LD:

- The document MAY include `@context`.
- When `@context` is present, the document SHOULD remain valid, readable JSON even for consumers that ignore JSON-LD.

**Example (minimal pattern):**

```json
{
  "@context": "https://ujg.example/ns/context.jsonld",
  "type": "JourneyDefinition",
  "id": "https://ujg.example/TR/2026.01/journeys/checkout",
  "version": "2026.01",
  "...": "..."
}
```

Consumers that do not support JSON-LD MUST treat `@context` as an ignorable unknown key (it is reserved but ignorable by non-LD consumers when used correctly).

## Examples

### Example: compact JourneyDefinition (JSON)

```json
{
  "type": "JourneyDefinition",
  "id": "https://ujg.example/TR/2026.01/journeys/checkout",
  "version": "2026.01",
  "name": "Checkout Journey",
  "startState": "browse",
  "states": [
    { "id": "browse", "label": "Browse" },
    { "id": "cart", "label": "Cart" },
    { "id": "complete", "label": "Complete", "kind": "end" }
  ],
  "transitions": [
    { "id": "t1", "from": "browse", "to": "cart", "on": ["add_to_cart"] },
    { "id": "t2", "from": "cart", "to": "complete", "on": ["pay_success"] }
  ],
  "extensions": {
    "vendor:domain": "ecommerce"
  }
}
```

### Example: runtime Event with extension metrics

```json
{
  "id": "e17",
  "type": "pay_fail",
  "at": "2025-12-29T10:15:02Z",
  "stateRef": "payment",
  "properties": { "reason": "insufficient_funds" },
  "extensions": { "vendor:retryCount": 2 }
}
```
# Module: Runtime Execution (`/ed/runtime/`)

## Abstract

This module defines the runtime representation of journeys: executions (instances of a journey), composed of events and/or state transitions over time. Runtime data can reference a Journey version to enable conformance checking and comparable metrics.

## What runtime data is for

Runtime data answers questions like:

- What path did users actually take?
- How long did they spend in each state?
- Where did they drop off?
- Which transitions occur that aren't allowed by the definition?

## Core concepts

- **JourneyExecution**: one run (usually per user session, task attempt, or workflow instance)
- **Event**: a timestamped occurrence (user action or system signal)
- **Observation**: optional derived facts like "entered state X" or "took transition T"
- **Link to definition**: optional but recommended for conformance

## Runtime entities (normative)

### JourneyExecution

A `JourneyExecution` MUST include:

- `id` (unique identifier of this execution)
- `startedAt` (timestamp)
- `events` (ordered collection or a collection with timestamps)

A `JourneyExecution` SHOULD include:

- `JourneyRef` (reference to Journey `id` + `version`)
- `endedAt` (timestamp) when known
- `subject` (an anonymized/session identifier; avoid PII)

### Event

An `Event` MUST include:

- `id` (unique within the execution)
- `type` (Event Type string)
- `at` (timestamp)

An `Event` MAY include:

- `stateRef` (if the emitter knows which state it occurred in)
- `transitionRef` (if the emitter knows which transition it represents)
- `properties` (key/value bag; extensible)
- `result` (e.g., success/failure)
- `duration` (if the event represents a timed action)

## Ordering rules (normative)

- If `events` are provided as a list, they MUST be in non-decreasing timestamp order.
- If ordering is not guaranteed, each Event MUST have a timestamp and consumers MUST sort.

## Linking to design-time (normative recommendation)

- A `JourneyExecution` SHOULD reference a Journey (`JourneyRef`) to enable conformance checks.
- If `JourneyRef` is present, `stateRef` and `transitionRef` (when used) MUST resolve to IDs defined by that referenced Journey version.

## Runtime example (informative)

```json
{
  "type": "JourneyExecution",
  "id": "exec_9f2a",
  "JourneyRef": {
    "id": "https://ujg.example/TR/2026.01/journeys/checkout",
    "version": "2026.01"
  },
  "startedAt": "2025-12-29T10:12:00Z",
  "events": [
    { "id": "e1", "type": "view_product", "at": "2025-12-29T10:12:05Z", "stateRef": "browse" },
    { "id": "e2", "type": "add_to_cart", "at": "2025-12-29T10:12:40Z", "stateRef": "product" },
    { "id": "e3", "type": "checkout", "at": "2025-12-29T10:13:10Z", "stateRef": "cart" },
    { "id": "e4", "type": "timeout", "at": "2025-12-29T10:18:10Z", "stateRef": "login" }
  ],
  "endedAt": "2025-12-29T10:18:10Z"
}
```

## Optional "automata-friendly" enhancement (informative)

Some systems can emit transition observations directly:

```json
{ "type": "TransitionTaken", "transitionRef": "t3", "at": "..." }
```

That makes conformance and aggregation cheaper, but it's optional: consumers can also derive transitions from events + the journey definition.
# Module: Conformance & Validation (`/ed/conformance/`)

## Abstract

This module defines how to determine whether a Journey Definition and a Journey Execution are well-formed, and how to classify runtime behavior relative to a design-time model. It introduces conformance classes for implementations and defines the terms **conformant**, **optional**, **violation**, and **drop-off** in a way that supports consistent analytics across tools.

## Why conformance matters (plain English)

Teams often track journeys with event logs, but disagree on what those events mean. Conformance gives you a shared rulebook:

- "Was this user path expected by the design?"
- "Did we observe something impossible (likely a bug or instrumentation drift)?"
- "Where do users abandon the journey?"
- "Did a release change the journey in a meaningful way?"

Conformance turns "a pile of events" into "a journey you can reason about".

## Conformance classes (normative)

UJG defines conformance in terms of roles an implementation may play.

### UJG Producer

A Producer creates Journey Definitions.

A Producer MUST:

- produce well-formed Journey Definitions as defined by the Core module,
- produce stable identifiers within a published version.

A Producer SHOULD:

- include at least one end state,
- avoid orphan/unreachable states.

### UJG Runtime Emitter

A Runtime Emitter produces Journey Executions (runtime traces).

A Runtime Emitter MUST:

- produce well-formed Journey Executions as defined by the Runtime module,
- include timestamps for all events.

A Runtime Emitter SHOULD:

- reference the Journey Definition (`JourneyRef`) when one is known,
- emit stable `type` values for events.

### UJG Consumer

A Consumer validates and/or analyzes Journey Definitions and Journey Executions.

A Consumer MUST:

- be able to validate well-formedness of the data it consumes,
- apply classification rules consistently when a `JourneyRef` is present.

A Consumer MAY:

- derive states/transitions from raw events,
- compute observed graphs and metrics.

## Validation: well-formedness (normative)

### Validate a Journey Definition

A Consumer MUST treat a Journey Definition as invalid if any of the Core well-formedness rules are violated (missing start state, broken references, duplicate IDs, etc.).

### Validate a Journey Execution

A Consumer MUST treat a Journey Execution as invalid if:

- required fields are missing (`id`, `startedAt`, `events`, timestamps),
- event timestamps are missing,
- event IDs are not unique within the execution.

If `JourneyRef` is present, then:

- `stateRef` and `transitionRef` values (when provided) MUST resolve to existing identifiers in that referenced Journey version.
- If they do not resolve, the Consumer MUST flag a `referenceError`.

## Conformance classification (normative)

### Key terms

- **Conformance checking** compares a Journey Execution to a Journey Definition.
- **Observed path** is the ordered set of states/transitions implied by the execution.
- **Expected transition** is a transition defined in the Journey Definition.

### Classification results

A Consumer MUST classify runtime behavior into these categories when `JourneyRef` is present:

- **Conformant**: The observed transition exists in the Journey.
- **Optional**: The observed transition exists in the Journey and is marked optional, or belongs to a non-primary path (see "Optionality" below).
- **Violation**: The observed transition does not exist in the Journey.
- **Drop-off**: The execution ends (or becomes inactive beyond a threshold) in a non-end state where an expected next step exists.

> **Note:** "Drop-off" is about missing continuation, not about an invalid transition.

## How to compute "observed transitions" (normative-friendly, implementation-neutral)

Consumers may receive runtime data in different levels of detail:

- Event-only executions (common)
- State entry observations
- Transition taken observations

This spec defines a general approach without requiring a single instrumentation strategy.

### Case A: transitionRef is provided

If the execution includes `transitionRef` entries (or equivalent transition observations), a Consumer MUST treat each referenced transition as an observed transition (subject to reference validation).

### Case B: only stateRef is provided

If the execution includes events with `stateRef`, a Consumer MAY derive an observed transition when it sees movement from one state to another over time.

**Derivation rule (recommended):**

- When an event indicates a different `stateRef` than the prior known `stateRef`, the Consumer may infer a transition between those states.
- If multiple transitions exist between the same states, the Consumer MUST use one of:
  - a matching event type (`on`) rule,
  - a declared priority,
  - or mark the result as ambiguous.

### Case C: neither stateRef nor transitionRef is provided

If the execution contains only event types, a Consumer MAY attempt to align events to transitions using the Journey Definition's transition triggers (`on`) plus any known context.

If alignment cannot be determined, the Consumer MUST treat conformance as **undetermined** rather than falsely labeling a violation.

## Optionality and primary paths (normative mechanism, simple)

A Journey Definition MAY label transitions or states to support "primary journey" vs alternatives.

**Recommended (minimal) mechanism:**

A Transition MAY have `classification` with one of:

- `primary`
- `optional`
- `exception` (error/recovery paths)

**Conformance rule:**

If a transition exists in the definition:

- `primary` → classify as **conformant**
- `optional`/`exception` → classify as **optional** (still valid, but non-primary)

If no classification is provided, Consumers SHOULD treat transitions as `primary` by default.

## Defining drop-off (normative + practical)

### Ended vs inactive

A Consumer MUST treat an execution as ended if:

- it has `endedAt`, or
- the last event time is older than an inactivity threshold chosen by the Consumer.

The inactivity threshold MUST be documented by the Consumer when reporting drop-off metrics.

### Drop-off rule

If an execution ends in a state that is not an end state, and the Journey Definition defines at least one outgoing transition from that state, the Consumer SHOULD classify the outcome as **drop-off**.

If the definition indicates an explicit "exit" transition (e.g., `cancel`, `timeout`) and the execution contains that event, the Consumer SHOULD classify the outcome as **conformant end** rather than drop-off.

## Ambiguity handling (normative)

Conformance checking may be ambiguous when:

- multiple transitions share the same trigger,
- state changes are missing,
- events are incomplete or sampled.

In ambiguous cases, a Consumer MUST NOT label behavior as a violation unless it can show that no valid path exists.

**Recommended result statuses:**

- `conformant`
- `optional`
- `violation`
- `dropOff`
- `undetermined`
- `referenceError`
- `ambiguous`

## Reporting conformance results (informative, but very useful)

Consumers often produce a "conformance report" per execution and/or aggregated.

**Example per execution summary:**

```
finalState: login
result: dropOff
violations: 0
optionalTransitionsTaken: 1
duration: 6m10s
```

**Example aggregated summary:**

- drop-off rate by state
- violation rate by transition
- top unexpected event types

## Examples

### Example 1: Violation

Definition does not allow `Payment → Dashboard`, but runtime shows it.

- **Observed:** `Payment --pay_success--> Dashboard`
- **Result:** `violation`

### Example 2: Optional (exception path)

Definition allows `Payment --pay_fail--> Payment` marked as `exception`.

- **Observed:** `Payment --pay_fail--> Payment`
- **Result:** `optional` (valid but non-primary)

### Example 3: Drop-off

Execution ends in `Login`, which is not an end state, and `Login` has outgoing transitions.

- **Last known state:** `Login`
- **No explicit exit event**
- **Result:** `drop-off`
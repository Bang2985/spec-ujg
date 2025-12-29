# Module: Observed Journey & Aggregation (`/ed/observed/`)

## Abstract

This module defines how to derive an **Observed Journey Graph** from runtime data. An Observed Journey Graph summarizes many Journey Executions into a graph where states and transitions are annotated with counts, probabilities/weights, and timing statistics. This supports funnels, drop-off analysis, and comparisons across releases, variants, or segments.

This module is compatible with automata thinking: the design-time model is the "intended automaton," and the observed model is an "empirical automaton" estimated from data.

## What this module is for (plain English)

Runtime traces are individual stories. Aggregation builds the "big picture":

- "From Cart, what percentage of users reach Complete?"
- "Which transitions are most common?"
- "Where do users spend time?"
- "Which states are frequent drop-off points?"
- "How did behavior change after a release?"

The output is still a graph—just with numbers on it.

## Key terms

- **Journey Execution**: one runtime instance (see Runtime Execution).
- **Observed Journey Graph**: aggregated graph derived from many executions.
- **State metrics**: numbers attached to a state (entries, time spent, drop-off count).
- **Transition metrics**: numbers attached to a transition (counts, probabilities, timing).
- **Cohort / segment**: subset of executions (e.g., mobile users, country=DE).
- **Window**: time range for aggregation (e.g., last 7 days).

## Observed Journey Graph model (normative)

### ObservedJourneyGraph

An `ObservedJourneyGraph` MUST include:

- `type: "ObservedJourneyGraph"`
- `id` (identifier for this observed artifact)
- `source` (what it was derived from)
- `window` (time range of data)
- `states` (array of ObservedState)
- `transitions` (array of ObservedTransition)

It SHOULD include:

- `definitionRef` when the observed graph is aligned to a JourneyDefinition version
- `cohort` when it represents a specific segment

### source

`source` MUST identify the inputs at least at a high level (e.g., dataset name, system, or query hash).

This is to make observed graphs reproducible.

### window

`window` MUST specify:

- `from` (timestamp)
- `to` (timestamp)

### ObservedState

An `ObservedState` MUST include:

- `stateRef` (state id string)
- `metrics` (object)

It MAY include:

- `label` (for convenience)
- `extensions`

### ObservedTransition

An `ObservedTransition` MUST include:

- either `transitionRef` (if aligned to a definition), OR (`from`, `to`, `on`)
- `metrics` (object)

It MAY include:

- `label`
- `extensions`

## Alignment to a Journey Definition (normative)

Observed graphs can be built in two modes:

### Mode A: aligned (recommended)

If the input executions have `definitionRef`, the observed graph SHOULD include the same `definitionRef`.

In aligned mode:

- States SHOULD be identified by `stateRef`.
- Transitions SHOULD be identified by `transitionRef` when available or derivable.

### Mode B: unaligned

If no definition is available, the observed graph MAY still be computed. In this case:

- states MAY be derived from emitter-provided state names, URLs, or other grouping keys,
- transitions are derived from observed sequences.

Consumers MUST clearly indicate unaligned mode (e.g., omit `definitionRef`).

## Core metrics (normative minimal set)

This module defines a minimal core so different tools can exchange observed graphs consistently.

### State metrics (core)

For each observed state, `metrics` SHOULD include:

- `entries` (integer): number of times the state was entered across executions
- `uniqueExecutions` (integer): number of distinct executions that reached the state
- `avgTimeInStateMs` (number, optional): average time spent in the state
- `p95TimeInStateMs` (number, optional): 95th percentile time in state
- `dropOffs` (integer, optional): number of executions that ended/inactivated in this state (see conformance module)

### Transition metrics (core)

For each observed transition, `metrics` SHOULD include:

- `count` (integer): number of times the transition occurred
- `probability` (number between 0 and 1, optional): probability of taking this transition given its source state
- `avgLatencyMs` (number, optional): average time between leaving source state and entering target state (if measurable)
- `errorRate` (number between 0 and 1, optional): fraction of transition attempts that failed (if attempts are modeled)

If a metric is not available, it MAY be omitted.

## Probability definition (normative)

If `probability` is reported for a transition `t` from a source state `s`:

```
P(t|s) = count(t) / sum(count(tᵢ)) for all outgoing transitions tᵢ from s
```

In plain terms:

"Of all observed departures from this state, what fraction used this transition?"

If loops exist, they are counted like any other transition.

Consumers MUST document whether they count:

- all occurrences (including repeats within one execution), or
- at most one per execution (unique-per-execution).

Both are valid; they mean different things. The chosen approach MUST be stated in `source` or `extensions`.

## Time-in-state measurement (informative but important)

Time-in-state can be derived when:

- explicit state entry events exist, or
- transitions can be inferred with timestamps.

**Recommended approach:**

```
time in state = timestamp(next state entry) − timestamp(current state entry)
```

if no next state exists (drop-off), optionally compute "time until inactivity threshold"

Consumers MUST document:

- inactivity threshold used (if relevant),
- whether backgrounding/suspension is included (e.g., mobile apps).

## Handling violations and ambiguity (normative expectations)

If conformance classification is available:

Observed graphs SHOULD include separate metrics for:

- `violations` (count)
- `undetermined / ambiguous` (count)

**Recommended:**

keep "violation transitions" in a separate section or mark them clearly, rather than mixing them into aligned transitions.

## Cohorts and comparisons (informative)

Observed graphs become especially useful when computed per cohort:

- device type (web/mobile)
- geography
- traffic source
- experiment variant
- version of the JourneyDefinition

You can compare observed graphs as graph deltas:

- transition probabilities changed
- drop-off concentrated in new states
- loops increased (friction)

This can be more informative than a single KPI delta.

## Serialization example (informative)

```json
{
  "type": "ObservedJourneyGraph",
  "id": "obs_checkout_2025w52_web",
  "definitionRef": {
    "id": "https://ujg.example/TR/2026.01/journeys/checkout",
    "version": "2026.01"
  },
  "window": {
    "from": "2025-12-22T00:00:00Z",
    "to": "2025-12-29T00:00:00Z"
  },
  "source": {
    "system": "analytics-pipeline",
    "dataset": "checkout_events",
    "mode": "aligned",
    "counting": "all-occurrences"
  },
  "cohort": {
    "device": "web"
  },
  "states": [
    {
      "stateRef": "cart",
      "metrics": {
        "entries": 120340,
        "uniqueExecutions": 98210,
        "avgTimeInStateMs": 34000,
        "p95TimeInStateMs": 120000,
        "dropOffs": 18450
      }
    }
  ],
  "transitions": [
    {
      "transitionRef": "t3",
      "metrics": {
        "count": 41230,
        "probability": 0.42,
        "avgLatencyMs": 900
      }
    }
  ]
}
```
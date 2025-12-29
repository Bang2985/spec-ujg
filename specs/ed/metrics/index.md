# Module: Metrics (`/ed/metrics/`)

## Abstract

This module defines a **small shared vocabulary** for reporting journey metrics on states, transitions, executions, and observed graphs. It focuses on metrics that are broadly useful and easy to implement, while providing a clear extension mechanism so tools can add specialized metrics without breaking interoperability.

This module does not prescribe which metrics you must collect. It defines how to name and represent them consistently when you do.

## Design goals (plain English)

Metrics should be:

* **Comparable** across tools and teams
* **Readable** (you can understand them without a data science degree)
* **Extensible** (vendors/teams can add more)
* **Stable** across TR snapshots and implementations

UJG therefore standardizes:

* a minimal "core" set,
* naming conventions,
* types and units,
* where metrics attach in the model.

## Where metrics can appear

Metrics MAY be attached to:

* **ObservedState.metrics** (observed graphs)
* **ObservedTransition.metrics**
* **JourneyExecution.summary** (optional, per-execution rollups)
* **Conformance reports** (optional outputs from consumers)

This module standardizes the metric names and shapes; other modules define the objects.

## Metric naming rules (normative)

A metric name MUST be a string key.

Core metric keys defined by this module:

* MUST be used exactly as specified (same spelling and meaning).
* MUST NOT be redefined to mean something else.

Extension metric keys:

* MUST be namespaced to avoid collisions.

Recommended namespacing styles:

* URI-like: `"https://vendor.example/metrics#rageClicks"`
* compact namespace: `"vendor:rageClicks"`

## Metric value types (normative)

Metric values MUST be one of:

* integer
* number
* boolean
* string
* object (for structured metrics, e.g., distributions)

Arrays SHOULD be avoided for metrics unless explicitly defined, because arrays are hard to merge during aggregation.

## Units and suffix conventions (normative)

To keep metrics readable and consistent:

* Time durations MUST be expressed in milliseconds and use the suffix `Ms`
  
  Examples: `avgTimeInStateMs`, `p95LatencyMs`

* Rates and probabilities MUST be expressed as numbers between `0` and `1`
  
  Examples: `dropOffRate`, `errorRate`, `probability`

* Counts MUST be integers
  
  Examples: `count`, `entries`, `uniqueExecutions`

If a producer uses a different unit, it MUST use a different metric key name that clearly indicates the unit.

## Core metric set (normative minimal vocabulary)

### Execution-level (optional but standardized if used)

These metrics summarize a single JourneyExecution.

* `durationMs` (number): `endedAt - startedAt` when available
* `finalStateRef` (string): last known state (if known)
* `result` (string): one of `conformantEnd`, `dropOff`, `violationEnd`, `undeterminedEnd`
* `violations` (integer): number of violations observed in the execution
* `optionalTransitions` (integer): number of optional/exception transitions taken

> **Note:** These are optional fields; many emitters won't compute them. Consumers often do.

### State-level (for ObservedState.metrics)

* `entries` (integer): total number of entries into the state
* `uniqueExecutions` (integer): number of distinct executions that reached the state
* `avgTimeInStateMs` (number, optional)
* `p50TimeInStateMs` (number, optional)
* `p95TimeInStateMs` (number, optional)
* `dropOffs` (integer, optional): number of executions ending/inactivating here
* `dropOffRate` (number, optional): fraction of executions reaching the state that drop off here

If `dropOffRate` is reported, the producer MUST document the denominator it uses (recommended denominator: `uniqueExecutions`).

### Transition-level (for ObservedTransition.metrics)

* `count` (integer): number of times the transition occurred
* `uniqueExecutions` (integer, optional): number of distinct executions that used the transition
* `probability` (number, optional): probability of this transition among outgoing transitions of its source state
* `avgLatencyMs` (number, optional): average time between source and target (if measurable)
* `p95LatencyMs` (number, optional)
* `errorRate` (number, optional): fraction of failed attempts (if attempts are modeled)
* `violations` (integer, optional): count of occurrences flagged as violations (usually used for unaligned or unexpected transitions)

If `probability` is reported, it MUST be computed consistently with the Observed module's definition (and the counting mode MUST be documented).

## Distributions (optional structured metrics)

Some metrics are better represented as distributions (e.g., latency buckets).

A producer MAY use an object value with a standard shape:

```json
"latencyMsDistribution": {
  "type": "histogram",
  "buckets": [
    { "le": 100, "count": 1200 },
    { "le": 500, "count": 4800 },
    { "le": 2000, "count": 9000 }
  ]
}
```

Rules:

* histogram bucket boundaries MUST be in the unit implied by the metric name (`Ms` here).
* counts MUST be integers.

This is optional; simple percentiles are often enough.

## Aggregation rules (informative, but practical)

When combining observed graphs from multiple partitions:

* counts are summed (`entries`, `count`, `dropOffs`)
* rates SHOULD be recomputed from underlying counts rather than averaged
* percentiles SHOULD be recomputed from raw data or approximate sketches (if available)

If a producer reports a rate without its underlying counts, consumers may not be able to recompute it accurately.

**Recommended:** when reporting a rate, also report the counts that define it.

## Extension metrics (how to add more safely)

Examples of extension metrics:

* `vendor:rageClicks`
* `vendor:scrollDepthP95`
* `vendor:retries`
* `vendor:cpuTimeMs`

Rules:

* extension metrics MUST be namespaced
* extension metrics MUST NOT change the meaning of core metrics
* consumers MUST ignore unknown extension metrics by default

## Example: ObservedState with core + extension metrics

```json
{
  "stateRef": "payment",
  "metrics": {
    "entries": 50320,
    "uniqueExecutions": 48110,
    "avgTimeInStateMs": 42000,
    "p95TimeInStateMs": 180000,
    "dropOffs": 6200,
    "dropOffRate": 0.129
  },
  "extensions": {
    "vendor:rageClicks": 3110
  }
}
```

## Next steps (where this fits)

* Metrics attach most commonly to **Observed Journey Graphs** (see Observed module).
* Conformance classifications influence metrics like `violations` and `dropOffRate` (see Conformance module).
* Serialization rules for extensions and namespacing are defined in **Serialization**.


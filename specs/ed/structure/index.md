# Module: Structuring Journeys (`/ed/structure/`)

## Abstract

This module defines optional structures for organizing a Journey Definition into meaningful chunks without changing the underlying journey graph. It introduces **Phases** and **Sessions**, plus the idea of multiple **views** of the same journey (e.g., a storytelling view vs an instrumentation view).

This module is primarily informative. It only becomes normative where it affects identifiers, references, or interoperability.

## Why structure matters (plain English)

A journey graph can be technically correct and still hard to talk about.

People naturally think in chunks:

* "Onboarding"
* "Evaluation"
* "Checkout"
* "After purchase"

Structure helps teams:

* communicate the journey to humans,
* align analytics to business questions,
* keep large graphs navigable,
* share "the same journey" at different levels of detail.

## Core idea: one graph, many ways to organize it

Phases and sessions are **labels and groupings** layered over the same states and transitions.

* The **Core** module defines the graph.
* This module defines ways to **group** and **slice** the graph for different audiences.

A well-designed journey can be:

* simple for storytelling,
* precise for instrumentation,
* measurable at runtime,

without becoming multiple incompatible models.

## Concepts

### Phase

A **Phase** is a named grouping used to communicate intent and progression.

Examples:

* Discovery → Consideration → Conversion
* Setup → Use → Maintain

Phases are usually stable and used in presentations, documentation, and reporting.

### Session

A **Session** is a runtime-oriented grouping representing a continuous period of interaction.

Examples:

* "Web session"
* "App session"
* "Checkout attempt"
* "Support call"

Sessions often align with instrumentation and analytics boundaries.

### View

A **View** is a defined way of presenting or selecting parts of a journey.

Examples:

* **Story view**: high-level states, fewer edges
* **Instrumentation view**: fine-grained states and technical events
* **KPI view**: only states/edges relevant to a funnel

Views prevent "one diagram to rule them all."

## Phase model (normative where needed)

### Phase

A `Phase` MUST include:

* `id` (string, unique within the Journey Definition)
* `label` (human readable)

A `Phase` MAY include:

* `description`
* `tags`
* `color` (purely presentational; non-normative)
* `extensions`

### Assigning phases

A Journey Definition MAY assign phases to states using either:

* `state.phaseRef = "<phaseId>"`, or
* `phases[].states = ["stateId", ...]`

**Interoperability rule (normative):**

* If phases are used, the Journey Definition MUST use **one** assignment strategy consistently within a version (to keep consumers simple).
* `phaseRef` values MUST reference existing phases.

### Multiple phases per state

A state MAY belong to multiple phases, but if so it MUST be explicit (array form). If a single string is used, it implies at most one phase per state.

**Recommended:**

* Start with one phase per state.
* Use multiple phases only when you have a clear reporting reason.

## Session model (lightly normative)

### SessionDefinition (design-time)

A Journey Definition MAY define session boundaries so runtime data can be interpreted consistently.

A `SessionDefinition` MAY include:

* `id`
* `label`
* `startEvents` (array of event types)
* `endEvents` (array of event types)
* `timeoutMs` (number)

This does not force all emitters to implement sessionization, but it creates a shared understanding if they do.

### Runtime alignment (informative)

At runtime, many systems already have session IDs. UJG can:

* use existing session IDs directly, or
* derive sessions from `SessionDefinition` rules.

If sessionization differs across tools, metrics comparisons become unreliable. This module gives you a place to define it.

## Views (informative with a small normative hook)

A Journey Definition MAY declare views to help consumers present or analyze the journey consistently.

### View

A `View` SHOULD include:

* `id`
* `label`
* `purpose` (e.g., `story`, `instrumentation`, `kpi`, `debug`)
* selection rules (see below)

### Selection rules (recommended patterns)

Views can be defined in approachable ways:

* **Include lists**
  * include states: `["cart", "payment", "complete"]`
  * include transitions: `["t3", "t4"]`

* **Tag-based**
  * include states where `tags` contains `"kpi"`

* **Phase-based**
  * include all states in phases `["conversion"]`

**Normative rule (small but important):**

* If views reference states/transitions by ID, those IDs MUST exist in the same Journey Definition version.

## Example: adding phases to a Journey Definition (informative)

```json
{
  "type": "Journey",
  "id": "https://ujg.example/TR/2026.01/journeys/checkout",
  "version": "2026.01",
  "startState": "browse",
  "phases": [
    { "id": "discover", "label": "Discovery" },
    { "id": "convert", "label": "Conversion" }
  ],
  "states": [
    { "id": "browse", "label": "Browse", "phaseRef": "discover" },
    { "id": "product", "label": "Product", "phaseRef": "discover" },
    { "id": "cart", "label": "Cart", "phaseRef": "convert" },
    { "id": "payment", "label": "Payment", "phaseRef": "convert" },
    { "id": "complete", "label": "Complete", "kind": "end", "phaseRef": "convert" }
  ],
  "transitions": [
    { "id": "t1", "from": "browse", "to": "product", "on": ["view_product"] },
    { "id": "t2", "from": "product", "to": "cart", "on": ["add_to_cart"] },
    { "id": "t3", "from": "cart", "to": "payment", "on": ["checkout"] },
    { "id": "t4", "from": "payment", "to": "complete", "on": ["pay_success"] }
  ],
  "views": [
    {
      "id": "story",
      "label": "Story view",
      "purpose": "story",
      "includePhases": ["discover", "convert"]
    },
    {
      "id": "kpi",
      "label": "Checkout KPI view",
      "purpose": "kpi",
      "includeStates": ["cart", "payment", "complete"]
    }
  ]
}
```

## Guidance: keeping this module readable

* Use phases to explain *why* steps exist ("Conversion"), not just where they happen ("/checkout").
* Use sessions only if your metrics depend on consistent "attempt" boundaries.
* Use views to avoid one giant diagram that nobody reads.

## How this relates to automata (informative)

Phases, sessions, and views do not change the automaton itself:

* states and transitions remain the same,
* conformance remains the same,
* runtime alignment remains the same.

They change how humans and tools *organize* the automaton.

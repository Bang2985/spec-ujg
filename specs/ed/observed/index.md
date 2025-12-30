**Goal:** define an exchangeable aggregated graph derived from many executions.

### This module SHOULD define (normative)

* `ObservedJourneyGraph` minimal required fields
* Aligned vs unaligned mode:
  * aligned mode uses `journeyRef` and `stateRef` / `transitionRef` where possible
* Probability definition and counting modes (and how to declare the mode)

### This module SHOULD define (informative)

* Time-in-state measurement approaches and limitations
* How to represent unexpected transitions (violations) cleanly

### Decisions to make

* Do observed graphs require raw counts always (recommended) or allow only rates?
* Do you allow both "all-occurrences" and "unique-per-execution" counting modes? (If yes, require explicit labeling.)

### Must-align with

* Runtime + Conformance (drop-off/violation semantics)
* Metrics vocabulary

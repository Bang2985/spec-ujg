**Goal:** make "compare runtime to intent" consistent across tools.

### This module SHOULD define (normative)

* Well-formedness validation rules for:
  * Journey (delegates to Core)
  * JourneyExecution (delegates to Runtime)
* Conformance classification outputs:
  * `conformant`, `optional`, `violation`, `dropOff`, `undetermined`, `referenceError`, `ambiguous`
* Drop-off rules:
  * explicit `endedAt` vs inactivity threshold
  * required documentation of thresholds in reports
* Ambiguity rules:
  * must not label violations when a valid path cannot be ruled out

### This module SHOULD define (informative)

* Recommended "primary path" mechanism (e.g., transition classification) *or* defer it to a profile.
* Report shapes (per-execution, aggregate).

### Decisions to make

* Do you want "primary/optional/exception" in Core transitions as an extension/profile feature, or native conformance metadata?
* Where do conformance reports live (separate object type vs embedded summary)?

### Must-align with

* Runtime alignment (`journeyRef`, `stateRef`, `transitionRef`)
* Profiles module (profile conformance)

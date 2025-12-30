**Goal:** define runtime traces in a way that can be aligned to Core Journeys.

### This module MUST resolve (normative)

* The runtime object model:
  * `JourneyExecution` required fields
  * `Event` required fields
* Event field naming to avoid collisions with Serialization `type`:
  * **Recommendation:** `Event.type = "Event"` and `Event.eventType = "<string>"`
* Ordering rules (timestamp order, tie-break behavior).
* Reference rules:
  * `journeyRef` (required for "aligned" conformance modes)
  * `stateRef` / `transitionRef` resolution

### This module SHOULD address (informative)

* Guidance for privacy (PII avoidance).
* Minimal emitter levels (raw events only vs stateRef vs transitionRef).
* Optional transition-observation events (cheap conformance).

### Must-align with

* Core `journeyRef` concept (versioned references)
* Serialization timestamp and forward-compat rules

**Goal:** optional structures (phases, sessions, views) that improve communication without changing Core semantics.

### This module SHOULD define (normative)

* A consistent way to attach **phases** to states (pick one strategy; avoid dual schemas).
* A minimal, version-stable schema for **views** that reference states/transitions by ID.
* A minimal schema for **session definitions** (if any) that can be used consistently by emitters/consumers.

### This module SHOULD define (informative)

* Guidance on keeping structure human-friendly.
* Recommended patterns for large journeys (multi-view publishing).

### Decisions to make

* Are phases *single* per state or multi-valued by default?
* Do views allow only include-lists, or also queries (tag/phase-based selectors)?
* Do session definitions belong here or in Runtime?

### Must-align with

* Core identifiers (`State.id`, `Transition.id`)
* Serialization forward compatibility rules

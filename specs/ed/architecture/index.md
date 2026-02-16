## Abstract

The **User Journey Graph (UJG)** standardizes user experience as **computable data**. It decouples the **Definition of Intent** (Design) from the **Observation of Reality** (Telemetry). This separation creates a single source of truth for Designers, Developers, and Analysts. As a deterministic protocol, it supports automation by AI agents across these roles, ensuring structural consistency.

## Conceptual Stack

The standard is organized into four logical layers:

1. **The Core (Transport):** The universal JSON-LD envelope. Ensures any tool—human or AI—can parse the file structure without ambiguity.
2. **The Graph (Definition):** Defines the "Happy Path." It is the vocabulary for States, Transitions, and Composition (sub-journey referencing).
3. **The Runtime (Execution):** Captures the "Actual Path." It records events as a causal chain, not just timestamped logs.
4. **The Mapping (Conformance):** Closes the loop. It overlays Reality onto Intent to calculate conversion and detect friction.

## Guiding Principles

1. **Graph First:** User experience is an automata, not a list of URLs.
2. **Stable Identity:** Entities must be named with URIs to survive refactors.
3. **Separation of Concerns:** A "Journey" (the plan) is immutable; a "Session" (the instance) is ephemeral.
4. **Vendor Neutrality:** The spec defines _data shapes_, not visualization rules.

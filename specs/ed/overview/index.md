# User Journey Graph (UJG) Specification - Overview

## Abstract

The User Journey Graph (UJG) specification family defines a vocabulary and data model for describing user journeys as automata-like graphs: a set of states (moments in the journey) connected by transitions (ways to move between moments), triggered by events (user actions or system signals). The family separates design-time journey definitions from runtime journey executions and observations to support both experience design and measurement.

## What this is

UJG standardizes the structure of journeys so teams can:

- describe an intended experience (design-time),
- emit runtime traces from apps/services (runtime),
- compare reality to intent (conformance),
- compute funnels and metrics without re-inventing semantics per tool.

UJG is about the model, not about a specific visualization.

## Quick mental model (plain English)

- A **journey definition** is like a map of what's allowed: "from Browse you can go to Product, from Product you can go to Cart…"
- A **journey execution** is what actually happened for one user/session: "Browse → Product → Cart → Abandoned"
- **Conformance** is how you compare the two:
  - conformant path (expected),
  - optional path (allowed but not primary),
  - violation (unexpected),
  - drop-off (expected next step didn't happen).

## Why "automata"

Most journeys behave like a finite-state machine:

- you are "in" a state (a page, step, mode, or moment),
- you do something (event),
- you move to another state (transition).

If you need memory (cart size, login state), UJG supports guards (conditions) and can be used as an "extended" state machine.

## Design-time vs runtime (core distinction)

### Design-time Journey Definition

- normative ("this is the intended model")
- stable identifiers
- used by design, engineering, QA, docs

### Runtime Journey Execution

- descriptive ("this is what happened")
- timestamped events/traces
- used for metrics, debugging, analysis

UJG makes both first-class so teams don't mix "what we planned" with "what we observed".

## Example (end-to-end story)

A checkout journey may define states:

- `Browse`, `Product`, `Cart`, `Login`, `Address`, `Payment`, `Complete`, `Abandoned`

and transitions like:

- `Product --add_to_cart--> Cart`
- `Cart --checkout [isLoggedIn]--> Address`
- `Cart --checkout [!isLoggedIn]--> Login`

A runtime trace might show:

- `Browse → Product → Cart → Login → Cart → Abandoned`

This allows you to ask:

- Where do users drop off?
- Which transitions violate the intended model?
- Does a new release change transition probabilities?

## Reading guidance

- **New readers**: start here (Overview), then Core.
- **Implementers**: Core → Runtime → Conformance → Serialization.
- **Analysts**: Runtime → Conformance → Observed → Metrics.
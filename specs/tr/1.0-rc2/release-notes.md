# UJG 1.0 Release Candidate 2

UJG 1.0 RC2 is the second release-candidate snapshot for the UJG 1.0 line. It is published under `/tr/1.0-rc2/` and supersedes [`1.0-rc1`](../1.0-rc1/) as the current basis for implementation trials, compatibility checks, and vocabulary review before UJG 1.0 Final.

Compared with [`1.0-rc1`](../1.0-rc1/), RC2 reworks core Graph and Mapping semantics around a new `Command` vocabulary, allows a `CompositeState` to contain multiple child Journeys, reintroduces document-level `extensions` on Core, and graduates two capabilities — Data Contract and the Domain Model Document Extension — from Editor's-Draft-only status into the `tr` line for the first time.

## Release Status

- Release tag: `v1.0-rc2`
- Snapshot path: `/tr/1.0-rc2/`
- Vocabulary namespace line: `/tr/1.0/ns/`
- Release maturity: release candidate
- Intended status: pre-release until UJG 1.0 Final is published

The `https://ujg.specs.openuji.org/tr/1.0/ns/` namespace identifies the UJG 1.0 vocabulary line. Until UJG 1.0 Final is published, release-candidate snapshots may update artifacts in this namespace. After UJG 1.0 Final, incompatible vocabulary changes require a new major-version namespace.

## Highlights Since 1.0-rc1

- Reintroduced `Command` as a first-class Graph vocabulary term identifying the stable semantic identity of an intentional invocation, separate from `Transition` and `OutgoingTransition` topology.
- Allowed a `CompositeState` to contain more than one child Journey (a **composite scope**), replacing the single `subjourneyId` reference with plural `subjourneyRefs`.
- Made a Journey's `defaultEntryRef` optional; entry selection can now be left unresolved by Graph and deferred to execution or materialization context.
- Reworked Mapping's affordance-observation and jump-derivation rules around `Command`/`commandRef` and around per-composite-occurrence local journey scope, to support the new multi-child-journey composite model.
- Re-enabled document-level `extensions` on Core (JSON-typed, single-valued), reversing RC1's restriction of `extensions` to `Node` instances only.
- Renamed the Conditions module's `ConditionSet` class to `ConditionalTransitionSet`.
- Renamed the Design System module's `DesignSystem` class to `Theme`, and restructured its component/template/surface-realization references around a new required `source` property on `TokenSource`.
- Moved Surface's touchpoint scope from CompositeState-based (`compositeStateRefs`) to Journey-based (`journeyRefs`), and replaced direct `Transition`/`OutgoingTransition` surface materialization with `Command` materialization.
- Added the Effect module's `CommandNoEffectShape` constraint: a `Command` must not declare `effectRef` directly; effects remain attached to `Transition` or `OutgoingTransition`.
- Graduated the **Data Contract** module into the `tr` line for the first time.
- Graduated the **Domain Model Document Extension** into the `tr` line for the first time; it was Editor's-Draft-only through RC1.
- Regenerated JSON-LD contexts, Turtle ontologies, SHACL shapes, content manifests, and agent-pack skill outputs for the RC2 snapshot, including new agent-pack skills for Domain Model Evaluation and Domain Model Implementation Conformance.

## Module Changes

### Graph

`Command` is a new class: a stable semantic identity for an intentional invocation, referenced from `Transition` and `OutgoingTransition` through `commandRef`. A Command is not a transition endpoint and carries no branching, execution, or effect semantics of its own — it exists so multiple transitions can share one invocation identity.

`CompositeState` now supports a composite scope of one or more child Journeys through `subjourneyRefs`, replacing the single-valued `subjourneyId`. Multiple child Journeys define independent local flows within the same composite occurrence; their presence does not create implicit transitions between them.

`State` gains an optional `multiInstance` flag declaring that multiple concrete occurrences of the same canonical State may coexist within one active Journey, without Graph assigning occurrence counts, identities, or data sourcing.

A Journey's `defaultEntryRef` is now optional. When absent, entry selection is unresolved by Graph unless execution or materialization context selects exactly one listed `JourneyEntry`.

### Mapping

Mapping's affordance-observation model moves from `Transition`/`OutgoingTransition` surface resolution to `Command` surface resolution: `observedAffordanceEventRef` and `explainedByTransitionRef` now reason about Runtime events whose surfaces resolve to a `Command`.

Mapping adds explicit **local journey scope** and **composite occurrence scope** concepts to support CompositeStates with multiple child Journeys: each `MappedStep` derives its local Journey scope from the mapped state's containment path rooted at `mappedJourneyRef`, and each occurrence of a repeated CompositeState is treated as a separate containing scope for predecessor lookup. New rules cover local origins within a child journey and child-exit handling for one composite occurrence.

### Core

Document-level `extensions` are allowed again: a `UJGDocument` may carry a single JSON-typed `extensions` value alongside `Node`-level `extensions`, reversing the RC1 restriction that forbade `extensions` on `UJGDocument`. First-level and second-level optional module dependency rules were also tightened and clarified.

### Conditions

`ConditionSet` is renamed to `ConditionalTransitionSet`, including its SHACL shape and validation messages.

### Design System

`DesignSystem` is renamed to `Theme`. `TokenSource` gains a required `source` property referencing the token source, package, manifest, or token set location; the `componentRefs`, `templateRefs`, and `surfaceRealizationRefs` properties are no longer declared directly on the renamed root class.

### Surface

Touchpoint scope moves from `compositeStateRefs` (targeting `CompositeState`) to `journeyRefs` (targeting `Journey`). The set of Graph node types eligible for Surface materialization drops direct `Transition`/`OutgoingTransition` materialization in favor of `Command` materialization.

### Effect

Adds `CommandNoEffectShape`: a `Command` must not declare `effectRef`; effects remain attached only to `Transition` or `OutgoingTransition`.

### Data Contract

New in RC2. An optional module giving stable UJG identity to an external JSON Schema Draft 2020-12 document and binding it to one `Surface` through a `DataSchema`/`DataBinding` pair. The binding does not change Graph topology, Surface attachment, Runtime event shape, or Domain Model meaning; consumers derive the contract's role from the bound surface's existing `graphNodeRef`.

### Domain Model

Graduated into the `tr` line in RC2 (present in `specs/ed` since before RC1, but excluded from that snapshot). The Domain Model Document Extension attaches an optional, technology-neutral application domain model to a `UJGDocument` through the opaque `extensions["org.openuji.domain-model"]` key. It is governed by JSON Schema, not RDF vocabulary or SHACL, and does not itself define JSON-LD terms.

## Draft Status

Every RC2 specification, module, and extension remains at `draft` maturity, matching the Editor's Draft. No `incubating` maturity labels remain under `specs/ed` or `specs/tr/1.0-rc2`.

## Generated Artifacts

RC2 includes refreshed generated artifacts for the updated module set:

- Content manifests for changed specifications.
- JSON-LD contexts for vocabulary-bearing modules, including the new Data Contract module.
- Turtle ontologies for vocabulary-bearing modules.
- SHACL shapes for validation-bearing modules.
- Agent-pack outputs and accepted generated skill reviews for changed root targets, including new Domain Model Evaluation and Domain Model Implementation Conformance skills for RC2.

## Validation

The RC2 work was checked with:

```sh
pnpm content-manifests:check
pnpm --filter @openuji/web lint
pnpm --filter @openuji/web build
pnpm agent-pack:update
pnpm agent-pack:check
pnpm agent-pack:validate
pnpm agent-pack:test
```

## Notes For Implementers

This is a release candidate, not UJG 1.0 Final. Implementers integrating against `1.0-rc1` should expect breaking changes when moving to RC2: `subjourneyId` becomes `subjourneyRefs`, `ConditionSet` becomes `ConditionalTransitionSet`, `DesignSystem` becomes `Theme`, Surface touchpoint scope changes from `compositeStateRefs` to `journeyRefs`, and any direct Surface materialization of `Transition`/`OutgoingTransition` must move to `Command` materialization instead. Treat RC2 as stable enough for integration trials, compatibility checks, vocabulary review, and feedback, while allowing for final adjustments before the 1.0 Final snapshot.

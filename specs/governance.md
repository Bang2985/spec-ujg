# Governance

## Purpose

This page defines how the User Journey Graph (UJG) specification family is developed, reviewed, and published. It exists so contributors and implementers can trust:

- how decisions are made,
- how changes are accepted,
- how versions become stable,
- how disagreements are handled.

## Scope of governance

This governance covers:

- the UJG spec-family repository (all modules and shared assets),
- the Editor’s Draft workspace (`/ed/…`),
- Technical Report snapshots (`/TR/<version>/…`),
- issue triage, review, and publication rules,
- community conduct and project administration.

It does not govern third-party extensions unless they are proposed for inclusion.

## Roles

### Participants

Anyone who joins discussions, files issues, or submits pull requests.

### Contributors

Participants who submit changes (text, examples, schemas, tests, tooling, or documentation).

### Editors

People responsible for:

- maintaining coherence across modules,
- merging accepted contributions,
- preparing TR snapshots,
- ensuring conformance/serialization stay consistent.

Editors do not “own” the spec; they steward the process.

### Maintainers

People with repository administration permissions (CI settings, release tags, publishing, security settings). Maintainers may also be Editors.

### Chairs (optional)

If the community prefers, one or more Chairs may coordinate meetings and process. If absent, Editors coordinate.

## Where work happens

- **Issue tracker:** source of truth for proposals, bugs, and questions.
- **Pull requests (PRs):** required for normative changes and recommended for all changes.
- **Discussions/notes:** meeting notes and design rationale are recorded and linked from issues.

## Decision-making

### Default: rough consensus

The project aims for rough consensus:

- Editors seek agreement among active participants.
- Lack of unanimous agreement does not block progress if concerns are addressed and recorded.

### When consensus is unclear

If consensus cannot be reached:

1. Editors summarize options and tradeoffs in the issue.
2. A time-boxed call for objections is made (e.g., “object by `<date>`”).
3. Editors decide, documenting:
   - the decision,
   - why alternatives were rejected,
   - any follow-up actions.

### Appeals

Participants may appeal a decision by requesting a formal re-review in the issue tracker. Maintainers/Chairs (if any) facilitate, and the outcome is documented.

## Change classes

### Editorial changes

Typos, clarifications, examples, formatting, non-normative text.

- May be merged with lightweight review.
- Should still reference an issue if non-trivial.

### Normative changes

Anything that changes requirements, definitions, algorithms, required fields, conformance, serialization, or interoperability rules.

- **MUST** be tracked by an issue.
- **SHOULD** include:
  - rationale,
  - migration notes (if breaking),
  - updated examples,
  - updated schema/tests where applicable.

### Breaking changes

A change is “breaking” if it makes previously conforming data invalid or changes the meaning of existing fields.

- Breaking changes **MUST NOT** land in an existing TR snapshot.
- Breaking changes **MAY** occur in Editor’s Draft.
- Breaking changes require explicit callout in release notes when snapshotting.

### Stability labels

Every module and major feature uses a stability label:

- **Stable:** intended for implementation; changes are expected to be backward compatible within a TR line.
- **Draft:** actively refined; may still change meaning/shape.
- **Incubating:** placeholder or exploratory; may be incomplete; may be replaced entirely.

A module’s stability is shown prominently near its title.

## Publication model

### Editor’s Draft (ED)

- `/ed/…` is the live workspace.
- ED may change at any time.
- ED may contain incubating modules (including “incubation prompts”).

### Technical Report snapshots (TR)

- `/TR/<version>/…` is a frozen snapshot.
- A TR version contains a coherent set of modules at specific revisions.
- Once published, a TR snapshot is immutable.

### Snapshot criteria

A module is eligible to be included as **Stable** in a TR when:

- its core terms are defined,
- it has at least one end-to-end example,
- it has at least one independent implementation interest (or a clear implementation plan),
- it has consistent serialization and reference rules with Core/Serialization,
- open issues are triaged (must-fix vs follow-up).

## Review expectations

Normative PRs should receive review from:

- at least one Editor, and
- at least one additional reviewer when available (preferably from a different stakeholder group: product, engineering, analytics, tooling).

If review bandwidth is low, Editors may merge with documented rationale and a request for post-merge review.

## Interoperability-first rule

When two modules conflict, the priority is:

1. Core Journey Graph
2. Serialization (JSON/JSON-LD rules)
3. Profile / Conformance mechanisms
4. Other modules

This prevents subtle schema drift.

## Security and privacy posture

- UJG is designed to model journeys without requiring personally identifying information.
- Runtime modules **SHOULD** discourage PII by default.
- Any example data **MUST** be synthetic or anonymized.
- Features that risk leaking identity or sensitive attributes require explicit review and documentation.

## Code of conduct

- Participants are expected to be respectful and constructive.
- Disagreements are normal; personal attacks are not.
- Harassment or abuse results in moderation by Maintainers/Chairs.

## Administrative notes

- The repository may include tooling that generates the combined ED view.
- Editors maintain a “decisions log” (or link decisions from issues) for major design choices.
- If a formal community group is formed, the group’s participation and IP terms apply in addition to this page.

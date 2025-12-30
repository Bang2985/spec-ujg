# Contributing

## What you can contribute

You’re welcome to contribute:

- spec text (definitions, requirements, guidance),
- examples and diagrams,
- schemas and validators,
- test vectors (good and bad payloads),
- tooling (generators, linters, CI),
- implementation notes (how to adopt UJG),
- issue triage and editorial improvements.

## Before you start

### 1) Pick the right target: ED vs TR

- Contribute to Editor’s Draft (`/ed/…`) unless explicitly working on a TR erratum.
- TR snapshots are frozen; changes land in ED and may be snapshotted later.

### 2) Check module stability

- **Stable modules:** avoid breaking changes; favor additive improvements.
- **Draft modules:** refine, but keep backward compatibility in mind.
- **Incubating modules:** it’s okay to restructure heavily—just document why.

## How to propose a change

### Step A: File or find an issue

Create an issue that includes:

- problem statement (“what’s broken/confusing/missing”),
- proposed direction (“what should happen instead”),
- affected modules,
- compatibility notes (breaking or not),
- example payloads if relevant.

### Step B: Submit a pull request

A PR should:

- reference the issue (e.g., “Closes #123”),
- change only what it claims to change,
- update examples/schemas/tests as needed,
- include clear commit messages.

## Spec writing rules

### Normative vs informative text

Use these words carefully:

- **MUST / MUST NOT / REQUIRED:** hard requirements.
- **SHOULD / SHOULD NOT:** strong recommendations (deviation allowed with reason).
- **MAY / OPTIONAL:** allowed but not required.

Everything else is informative guidance.

### Keep Core small

Core should stay readable and minimal:

- required fields only,
- simple well-formedness rules,
- composition and transition reuse are allowed,
- everything else should be layered via modules/profiles.

### One name for one concept

Avoid introducing synonyms across modules. If you must rename:

- keep one canonical term,
- document aliases and deprecation.

### Examples policy

Examples are treated as test fixtures, not marketing diagrams.

A good example:

- is internally consistent (references resolve),
- uses the same field names as the spec,
- demonstrates one concept at a time,
- includes both “valid” and “invalid” cases when helpful.

Avoid examples that quietly violate Core/Serialization rules.

## Serialization and schema contributions

If you modify any of these, update the related artifacts:

- identifier/reference shapes (`journeyRef`, `stateRef`, etc.),
- JSON/JSON-LD conventions,
- reserved keys,
- forward-compat behavior.

If your repo contains JSON Schema or validation tooling, keep it aligned with normative text. If a mismatch exists, the spec text wins until updated.

## Profiles and extensions

If your change adds new optional fields:

- prefer placing vendor/experimental data in extensions,
- consider proposing a profile that standardizes the feature,
- document interoperability expectations (what must consumers ignore/preserve).

## Review checklist (for contributors)

Before requesting review, confirm:

- Terms are defined the first time they appear.
- Requirements use RFC 2119 language consistently.
- Examples are consistent with the rules.
- Reference shapes match Core + Serialization.
- Any breaking changes are clearly called out.
- Any new feature has at least one end-to-end example.

## How reviews work

Reviewers look for:

- consistency across modules,
- interoperability impact,
- migration risk,
- clarity for Product/UX readers and implementers.

Editors may request changes, split PRs, or ask for additional examples.

## Attribution

Contributions are credited through the repository history (issues and PRs). If you want explicit acknowledgment in a credits file, propose it via issue.

## Security and privacy notes for runtime proposals

If your contribution touches runtime data:

- avoid requiring PII,
- explain how identifiers should be anonymized,
- document any sensitive fields as discouraged or profile-gated,
- ensure examples contain no real user data.

## Where to ask questions

- Open an issue labeled `question` or `needs-discussion`.
- If meetings exist, add it to the agenda via the issue tracker.

**Goal** Define how to map runtime events `stateRef` to journeys states and classify steps against the graph transition model.

### Normatives to evaluate

- Map each `RuntimeEvent.stateRef` to its Graph owner (Journey / Composite path).
- Decide how to mark a step as “in-model” vs “jump” (based on Graph `Transition` + injected `OutgoingTransitionGroup`).
- Support nested/parallel UI via an optional `scopeId` (so multiple journeys can be “active” at once).

### Informatives to evaluate

- Cross-journey jumps can be legit (menu/deeplink/CTA) or issues (tracking gap/model drift); binding should surface the pattern, not assume intent.
- If state IDs are globally unique, mapping is trivial; if not, you need extra disambiguation.

### Decisions to make

- Enforce global uniqueness of Designed `State.id` (preferred) vs adopt an ID convention vs add a runtime hint (journey id/scope).
- What happens on “jump”: split into segments vs keep one trace with flags.
- Track only leaf “state appears” vs also track composite/container boundaries.

### Must-align with

- [[UJG Core]] (document envelope, IDs, JSON-LD rules)
- [[UJG Graph]] (State/Transition/Composite, OutgoingTransitionGroup injection)
- [[UJG Runtime]] (event chain ordering + required `stateRef`)

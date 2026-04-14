**Title:** `org.openuji.specs.ujg.command.v1`

**Status:** incubating implementation extension for self-contained command, mutation, and action contracts carried in UJG Core `extensions`.

## Namespace

- Canonical namespace string: `org.openuji.specs.ujg.command.v1`
- Payload location: `extensions["org.openuji.specs.ujg.command.v1"]`
- Published JSON Schema: `https://ujg.specs.openuji.org/ed/ns/command.schema.json`

## Purpose

This extension describes the action or mutation side of implementation generation.

It exists so that a generator can understand a command directly from one self-contained payload:

- what command is being invoked,
- which parameters it expects,
- which preconditions apply,
- how results and errors behave,
- whether retry or idempotency matter,
- which trigger kinds are meaningful,
- where outputs or result payloads should land,
- which follow-up outcomes such as navigation or emitted events should occur.

This extension is the action counterpart to form, record, and collection payloads. It intentionally
absorbs trigger and outcome semantics instead of requiring a separate generic exec model.

## Scope

This extension covers:

- command identity,
- parameters,
- preconditions,
- result and error semantics,
- retry posture,
- idempotency hints,
- trigger kinds,
- output destinations,
- follow-up outcomes.

The extension is self-contained. It may refer to UJG node IDs for navigation outcomes, but it does
not depend on private objects from form, record, collection, or access payloads.

## Non-goals

This extension does not standardize:

- transport protocols,
- API endpoints,
- queue names,
- cron syntax,
- framework event handlers,
- backend worker code,
- build or deployment pipelines.

## Primary Attachment Targets

- `Transition`

`Transition` is the preferred host because commands most often correspond to explicit graph actions.

## Secondary Attachment Targets

- `State` for command surfaces that do not map one-to-one to a specific transition
- `OutgoingTransitionGroup` for reusable command defaults shared across many outgoing transitions

## Discouraged Or Disallowed Attachment Targets

- `Template` is discouraged because command contracts are behavioral rather than structural.
- `CompositeState` is discouraged except for sparse defaults inherited by nested transitions.
- `Route` is discouraged because routing metadata belongs in Routing.
- `MessageBundle` is disallowed in normal use.
- `UJGDocument` is disallowed because Core extensions are node-scoped.

## Inheritance Model

For a transition-level command, generators should apply inheritance in this order:

1. `Journey`
2. each enclosing `CompositeState`, from outermost to innermost
3. source `State`
4. any applicable `OutgoingTransitionGroup`
5. the local `Transition`

For a state-level command surface that has no explicit transition host, generators should use:

1. `Journey`
2. enclosing `CompositeState`
3. local `State`

## Precedence And Override Rules

For transition-level commands, use this precedence order:

1. `Transition`
2. `OutgoingTransitionGroup`
3. source `State`
4. innermost `CompositeState`
5. outer `CompositeState`
6. `Journey`

For state-level command surfaces, use:

1. `State`
2. innermost `CompositeState`
3. outer `CompositeState`
4. `Journey`

Merge and replacement rules:

- `commandRef`, `result`, `error`, `retry`, and `idempotency` are singular values or objects. The
  more specific value replaces the inherited one.
- `parameters`, `preconditions`, `triggerKinds`, `outputDestinations`, and `emitEvents` combine by
  identity or duplicate removal.
- `outcomes` merges by key, with the more specific value winning on collision.

## Property Vocabulary

- `commandRef`: identity of the command or mutation. Expected shape: string. Allowed categories:
  published contract IDs, operation IDs, or opaque external identifiers. Implementation intent:
  tells generators which action is being performed.
- `parameters`: expected command parameters. Expected shape: array of parameter objects with `name`,
  `kind`, and optional `required`, `source`, and `defaultValueHint`. Allowed categories for `kind`:
  `scalar`, `structured`, `entity-ref`, `selection`, `file`, `secret`. Allowed categories for
  `source`: `user`, `form`, `record`, `collection`, `route`, `context`, `argv`, `stdin`, `event`.
  Implementation intent: lets generators gather parameters without transport-specific code.
- `preconditions`: command preconditions. Expected shape: array of objects with `kind` and optional
  `ref` or `value`. Allowed categories: `selection-required`, `non-empty`, `confirmed`,
  `validated`, `reachable`, `custom`. Implementation intent: gives generators a portable way to gate
  execution.
- `result`: result semantics. Expected shape: object with optional `mode` and `destination`. Allowed
  categories for `mode`: `none`, `replace`, `append`, `emit`, `download`, `preview`. Allowed
  categories for `destination`: `current-node`, `next-node`, `stdout`, `stderr`, `artifact`, `event`.
  Implementation intent: tells generators what kind of successful effect to expect.
- `error`: error semantics. Expected shape: object with optional `mode` and `destination`. Allowed
  categories for `mode`: `inline`, `summary`, `global`, `retry`, `fallback`. Allowed categories for
  `destination`: same generic destination categories as `result`. Implementation intent: tells
  generators how to surface failure.
- `retry`: retry posture. Expected shape: string. Allowed categories: `none`, `manual`,
  `automatic`. Implementation intent: tells generators whether to surface retry affordances or
  automatic re-invocation.
- `idempotency`: idempotency hint. Expected shape: string. Allowed categories: `unknown`,
  `idempotent`, `non-idempotent`. Implementation intent: helps generators choose safe retry or
  duplicate-submission behavior.
- `triggerKinds`: supported trigger kinds. Expected shape: array of strings. Allowed categories:
  `submit`, `tap`, `shortcut`, `deep-link`, `timer`, `webhook`, `cli-argv`, `stdin-line`,
  `background`, `job`, `auto`. Implementation intent: tells generators which trigger channels are
  meaningful.
- `outputDestinations`: expected output destinations. Expected shape: array of strings. Allowed
  categories: `current-node`, `next-node`, `stdout`, `stderr`, `artifact`, `event`, `download`.
  Implementation intent: declares where result material should go.
- `outcomes`: follow-up outcomes. Expected shape: object with optional `successNodeRef`,
  `errorNodeRef`, and `emitEvents`. Allowed references: UJG node IDs for `successNodeRef` and
  `errorNodeRef`; strings for event names. Implementation intent: gives generators a portable
  post-command outcome model.

## Recommended Controlled Values

Recommended parameter `kind` values:

- `scalar`
- `structured`
- `entity-ref`
- `selection`
- `file`
- `secret`

Recommended `triggerKinds` values:

- `submit`
- `tap`
- `shortcut`
- `deep-link`
- `timer`
- `webhook`
- `cli-argv`
- `stdin-line`
- `background`
- `job`
- `auto`

Recommended `retry` values:

- `none`
- `manual`
- `automatic`

## Processing Model

A generator implementing this extension should:

1. Resolve the effective command payload using the inheritance and precedence rules above.
2. Normalize parameters, preconditions, result and error posture, retry, idempotency, and trigger
   kinds.
3. Resolve any UJG node outcome references contained in `outcomes`.
4. Combine the resulting command contract with Graph transitions, with Routing when deep links are
   relevant, and with L10n when result or error messaging is localized through the host node.
5. Materialize target-specific action handlers without changing graph semantics.

When attached to a `Transition`, this extension describes how that transition is invoked and what
implementation-facing outcomes it produces. It does not redefine the graph edge itself.

## Cross-Stack Interpretation Notes

- Web: map to button clicks, submits, route arrivals, timer callbacks, or webhook handlers.
- Native: map to taps, gestures, shortcuts, deep links, and background actions.
- CMS: map to save, publish, review, or approve actions without standardizing editorial engine code.
- Commerce: map to add-to-cart, recalculate, authorize payment, capture, refund, or export actions.
- CLI or headless or background: map to argv commands, stdin-driven commands, cron-like invocations,
  service webhooks, and long-running jobs.

## Published JSON Schema

The published schema for this extension is defined below and is published at
`https://ujg.specs.openuji.org/ed/ns/command.schema.json`.

:::include ./command.schema.json :::

## Minimal Example Payload

```json
{
  "@id": "urn:transition:submit-payment",
  "@type": "Transition",
  "extensions": {
    "org.openuji.specs.ujg.command.v1": {
      "commandRef": "urn:command:payment-authorize",
      "parameters": [
        { "name": "paymentMethod", "kind": "structured", "required": true, "source": "form" }
      ],
      "preconditions": [
        { "kind": "validated" },
        { "kind": "confirmed" }
      ],
      "result": { "mode": "replace", "destination": "next-node" },
      "error": { "mode": "summary", "destination": "current-node" },
      "retry": "manual",
      "idempotency": "non-idempotent",
      "triggerKinds": ["submit", "tap", "shortcut", "cli-argv"],
      "outputDestinations": ["next-node", "event"],
      "outcomes": {
        "successNodeRef": "urn:state:confirmation",
        "errorNodeRef": "urn:state:payment",
        "emitEvents": ["payment.authorized"]
      }
    }
  }
}
```

## Graduation Guidance

Thin parts that may later graduate into optional modules or shared references include:

- a command reference,
- a parameter-kind reference,
- a trigger-kind reference.

The following should remain extension-only:

- parameter collection posture,
- result and error handling semantics,
- retry and idempotency hints,
- follow-up outcome wiring.

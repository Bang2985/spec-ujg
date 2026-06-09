**Title:** `org.openuji.specs.ujg.access.v1`

**Status:** incubating implementation extension for narrow node-level access and privacy intent carried in UJG Core `extensions`.

## Namespace

- Canonical namespace string: `org.openuji.specs.ujg.access.v1`
- Payload location: `extensions["org.openuji.specs.ujg.access.v1"]`
- Published JSON Schema: `https://ujg.specs.openuji.org/ed/ns/access.schema.json`

## Purpose

This extension carries node-level access and privacy intent in a deliberately narrow form.

It exists to tell generators, for a node as a whole:

- whether authentication is required,
- which audiences, roles, or capabilities are required,
- which privacy posture applies,
- which deny or fallback behavior should occur,
- which redaction defaults should be assumed.

This extension is intentionally narrow. It governs the host node as a whole and does not target
internal objects inside form, record, collection, command, or other extension payloads.

## Scope

This extension covers:

- authentication requirement,
- audience requirements,
- role requirements,
- capability requirements,
- privacy posture,
- deny behavior,
- fallback node,
- redaction defaults.

The extension may coexist with Routing guards, but it does not replace Routing. Route guards stay in
Routing. This extension provides broader node-level access posture.

## Non-goals

This extension does not standardize:

- auth-provider configuration,
- token formats,
- policy engines,
- RBAC or ABAC storage,
- secrets management,
- field-level privacy rules inside other extension payloads.

## Primary Attachment Targets

- `Journey`
- `State`
- `CompositeState`
- `Transition`

`Journey` is the inheritance root for broad access posture. `State` and `CompositeState` are the
main hosts for node-level access. `Transition` is the main host for action-level access.

## Secondary Attachment Targets

- `OutgoingTransitionGroup` for sparse reuse when several grouped outgoing transitions share the same
  access posture
- `Template` only for coarse shared privacy posture tied to a reusable shell

## Discouraged Or Disallowed Attachment Targets

- `Route` is discouraged because route-scoped guard metadata belongs in Routing.
- `MessageBundle` is disallowed in normal use.
- `UJGDocument` is disallowed because Core extensions are node-scoped.

## Inheritance Model

For state- or composite-state-level access posture, generators should apply inheritance in this
order:

1. `Journey`
2. each enclosing `CompositeState`, from outermost to innermost
3. resolved `Template`, if access posture is deliberately attached there
4. the local `State`

For transition-level access posture, generators should use:

1. `Journey`
2. enclosing `CompositeState`
3. source `State`
4. applicable `OutgoingTransitionGroup`
5. local `Transition`

## Precedence And Override Rules

For node-level access, use this precedence order:

1. `State`
2. `Template`
3. innermost `CompositeState`
4. outer `CompositeState`
5. `Journey`

For transition-level access, use:

1. `Transition`
2. `OutgoingTransitionGroup`
3. source `State`
4. innermost `CompositeState`
5. outer `CompositeState`
6. `Journey`

Merge and replacement rules:

- `authRequirement`, `privacyPosture`, `denyBehavior`, and `fallbackNodeRef` are singular values.
  The more specific value replaces the inherited one.
- `audiences`, `roles`, `capabilityRefs`, and `redactionDefaults` combine across inheritance with
  duplicate removal.
- explicit denial posture is stronger than availability preference.
- if both Routing guards and this extension apply, both must pass.

## Property Vocabulary

- `authRequirement`: authentication posture for the host node. Expected shape: string. Allowed
  categories: `none`, `required`, `elevated`. Implementation intent: tells generators whether the
  node is public, authenticated, or requires stronger assurance.
- `audiences`: audience requirements. Expected shape: array of strings. Allowed categories:
  producer-defined audience names such as market, channel, tenant, or segment. Implementation
  intent: lets generators apply broad audience gating.
- `roles`: role requirements. Expected shape: array of strings. Allowed categories: producer-defined
  role names such as `customer`, `editor`, `admin`, or `operator`. Implementation intent: gives a
  portable role gate without defining a role system.
- `capabilityRefs`: capability requirements. Expected shape: array of strings. Allowed categories:
  published capability IDs or opaque external identifiers. Implementation intent: lets generators
  express permission requirements without embedding policy-engine syntax.
- `privacyPosture`: privacy posture for the host node. Expected shape: string. Allowed categories:
  `public`, `internal`, `restricted`, `sensitive`. Implementation intent: influences logging,
  preview, export, and presentation defaults.
- `denyBehavior`: preferred behavior on access failure. Expected shape: string. Allowed categories:
  `hide`, `disable`, `redirect`, `message`, `error`. Implementation intent: tells generators what to
  do when access is denied.
- `fallbackNodeRef`: fallback UJG node ID when deny behavior requires redirection or fallback.
  Expected shape: string. Implementation intent: lets generators preserve denial flow without route
  internals.
- `redactionDefaults`: default redaction posture for the node. Expected shape: array of strings.
  Allowed categories: `mask-secrets`, `mask-identifiers`, `omit-sensitive-fields`, `no-logs`,
  `summary-only`. Implementation intent: gives generators privacy-safe defaults.

## Recommended Controlled Values

Recommended `authRequirement` values:

- `none`
- `required`
- `elevated`

Recommended `privacyPosture` values:

- `public`
- `internal`
- `restricted`
- `sensitive`

Recommended `denyBehavior` values:

- `hide`
- `disable`
- `redirect`
- `message`
- `error`

## Processing Model

A generator implementing this extension should:

1. Resolve the effective node-level access payload using the inheritance and precedence rules above.
2. Apply authentication, audience, role, and capability posture at the node level.
3. Apply privacy posture and redaction defaults to logging, preview, export, and error handling.
4. Apply deny behavior and resolve any `fallbackNodeRef`.
5. Combine the resulting access posture with Graph behavior, Routing guards, and any localized
   messaging supplied through L10n.

This extension never grants permission to target internal objects inside other extension payloads.
It applies to the host node as a whole.

## Cross-Stack Interpretation Notes

- Web: map to route guards, page gating, action disabling, and privacy-aware error presentation.
- Native: map to screen gating, action gating, and privacy-aware diagnostics.
- CMS: map to authoring permissions, preview restrictions, and publish-entry gating.
- Commerce: map to customer-group access, staff roles, and privacy-aware order or payment surfaces.
- CLI or headless or background: map to command access, environment gating, and redacted output.

## Published JSON Schema

The published schema for this extension is defined below and is published at
`https://ujg.specs.openuji.org/ed/ns/access.schema.json`.

:::include ./access.schema.json :::

## Minimal Example Payload

```json
{
  "@id": "urn:state:payment",
  "@type": "State",
  "extensions": {
    "org.openuji.specs.ujg.access.v1": {
      "authRequirement": "required",
      "audiences": ["customer"],
      "roles": ["customer"],
      "capabilityRefs": ["urn:capability:checkout:pay"],
      "privacyPosture": "sensitive",
      "denyBehavior": "redirect",
      "fallbackNodeRef": "urn:state:cart",
      "redactionDefaults": ["mask-secrets", "no-logs"]
    }
  }
}
```

## Graduation Guidance

Thin parts that may later graduate into optional modules or shared references include:

- a capability reference,
- a role or audience reference vocabulary,
- a fallback or guard reference.

The following should remain extension-only:

- node-level deny posture,
- redaction defaults,
- privacy overlays,
- combined access inheritance behavior.

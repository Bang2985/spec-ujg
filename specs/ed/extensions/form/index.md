**Title:** `org.openuji.specs.ujg.form.v1`

**Status:** incubating implementation extension for self-contained form contracts carried in UJG Core `extensions`.

## Namespace

- Canonical namespace string: `org.openuji.specs.ujg.form.v1`
- Payload location: `extensions["org.openuji.specs.ujg.form.v1"]`
- Published JSON Schema: `https://ujg.specs.openuji.org/ed/ns/form.schema.json`

## Purpose

This extension describes forms in a way that generators can implement directly without first
resolving a separate access or command model.

It exists to make a form understandable as a self-contained payload:

- what model or draft it edits,
- how the form is structured,
- which fields, groups, and steps it contains,
- how options are presented,
- whether prefill, resume, or autosave are expected,
- how submit, reset, and draft-save should behave,
- which local validations apply,
- which field and block presentation hints matter.

This extension is intended to be sufficient for common single-step and multistep flows such as
checkout, account registration, profile update, or CLI prompting.

## Scope

This extension covers:

- model bindings,
- one or more forms,
- fields, groups, and steps,
- option sets,
- prefill, resume, and autosave intent,
- submit, reset, and draft-save semantics,
- local validation,
- generic presentation hints for fields and groups.

The extension is self-contained. It may refer to UJG node IDs for follow-up transitions, but it does
not require private objects from access or command payloads to be correct.

## Non-goals

This extension does not standardize:

- HTML forms,
- framework form libraries,
- backend validation engines,
- REST endpoints,
- GraphQL documents,
- ORM models,
- vendor-specific form builder files.

## Primary Attachment Targets

- `State`
- `CompositeState`
- `Template`

`State` is the preferred host for effective forms. `CompositeState` is the preferred host for
subflow-wide form defaults. `Template` is the preferred reusable host for shared form shells.

## Secondary Attachment Targets

- `Journey` for broad defaults such as autosave posture or shared model bindings

## Discouraged Or Disallowed Attachment Targets

- `Transition` is discouraged because transitions normally act on a form rather than define it.
- `OutgoingTransitionGroup` is discouraged because it is not a form host.
- `Route` is discouraged because routing metadata should stay in Routing.
- `MessageBundle` is disallowed in normal use because translated copy belongs in L10n.
- `UJGDocument` is disallowed because Core extensions are node-scoped.

## Inheritance Model

For a state-level form, generators should apply inheritance in this order:

1. `Journey`
2. each enclosing `CompositeState`, from outermost to innermost
3. resolved `Template`, if `templateRef` is present
4. the local `State`

Template inheritance is useful when many states share the same form shell. State attachment is the
main mechanism for local field and step overrides.

## Precedence And Override Rules

Use this precedence order:

1. `State`
2. `Template`
3. innermost `CompositeState`
4. outer `CompositeState`
5. `Journey`

Merge and replacement rules:

- `modelRefs`, `prefill`, `resume`, `autosave`, `submit`, `reset`, and `draftSave` are top-level
  singular or map-like values. The more specific value replaces the inherited one, except where a
  map merges by key.
- `forms` merges by `name`.
- within a merged form, `steps` merge by `name`, `groups` merge by `name`, and `fields` merge by
  `name`.
- a more specific step, group, or field may suppress an inherited one by repeating the same identity
  and setting `disabled: true`.

## Property Vocabulary

- `modelRefs`: the models or drafts edited by the form host. Expected shape: array of strings.
  Allowed categories: published schema identifiers, model identifiers, or opaque external IDs.
  Implementation intent: tells generators what the form edits.
- `forms`: the form definitions on the host. Expected shape: array of form objects. Each form object
  contains `name`, optional `mode`, optional `steps`, optional `groups`, optional `fields`, and
  optional `presentation`. Implementation intent: keeps form structure self-contained and readable.
- `prefill`: prefill intent. Expected shape: object with optional `mode` and `sourceRefs`. Allowed
  categories for `mode`: `none`, `default`, `read`, `resume`. Implementation intent: tells a
  generator whether to start blank, from defaults, or from a recoverable draft.
- `resume`: resume posture. Expected shape: object with optional `enabled` and `scope`. Allowed
  categories for `scope`: `session`, `user`, `device`. Implementation intent: tells generators
  whether partially completed form state should be restorable.
- `autosave`: autosave posture. Expected shape: object with optional `enabled`, `mode`, and
  `intervalHint`. Allowed categories for `mode`: `none`, `local`, `draft`, `remote`. Implementation
  intent: lets generators decide whether to persist partial work.
- `submit`: submit semantics. Expected shape: object with optional `enabled`, `transitionRef`,
  `result`, and `error`. Allowed categories for `result`: `advance`, `stay`, `replace`. Allowed
  categories for `error`: `inline`, `summary`, `global`. Implementation intent: tells generators how
  primary form submission should behave.
- `reset`: reset semantics. Expected shape: object with optional `enabled` and `mode`. Allowed
  categories for `mode`: `clear`, `restore-initial`, `restore-prefill`. Implementation intent:
  communicates how reset should work.
- `draftSave`: draft-save semantics. Expected shape: object with optional `enabled`, `transitionRef`,
  and `mode`. Allowed categories for `mode`: `local`, `remote`, `both`. Implementation intent:
  distinguishes draft-save from final submit.
- `validation`: local validation posture. Expected shape: object with optional `mode`, `timing`, and
  `rules`. Allowed categories for `mode`: `field`, `group`, `form`, `mixed`. Allowed categories for
  `timing`: `change`, `blur`, `submit`, `mixed`. `rules` is an array of simple rule objects with
  `kind` and optional bounds or references. Implementation intent: keeps form-local validation
  portable in this iteration.

## Recommended Controlled Values

Recommended form `mode` values:

- `single-step`
- `multi-step`
- `wizard`

Recommended field `kind` values:

- `text`
- `textarea`
- `email`
- `number`
- `money`
- `date`
- `choice`
- `multichoice`
- `toggle`
- `file`
- `secret`

Recommended validation `kind` values:

- `required`
- `pattern`
- `min-length`
- `max-length`
- `min`
- `max`
- `equals-field`
- `custom`

## Processing Model

A generator implementing this extension should:

1. Resolve the effective form payload using the inheritance rules above.
2. Normalize the form structure, including steps, groups, and fields.
3. Apply prefill, resume, autosave, submit, reset, draft-save, and validation posture.
4. Combine the form with Templates for shared shells, with Routing for route-aware entry or resume,
   and with L10n for field labels and help text when the node also has `copyRef`.
5. Materialize a target-appropriate form implementation while leaving graph behavior and transitions
   under Graph control.

If a submit or draft-save entry uses `transitionRef`, the referenced UJG node ID identifies the
follow-up graph transition. The form payload remains valid even when such references are absent.

## Cross-Stack Interpretation Notes

- Web: map to pages, panels, or dialogs with multistep progress and validation summaries.
- Native: map to screens, paged forms, wizards, or stacked groups with platform-native field
  affordances.
- CMS: map to editorial or administrative form surfaces while leaving vendor form-builder internals
  unspecified.
- Commerce: map to checkout forms, address forms, payment forms, and account forms.
- CLI or headless or background: map to interactive prompts, staged question sets, or structured
  parameter intake while preserving step and validation semantics.

## Published JSON Schema

The published schema for this extension is defined below and is published at
`https://ujg.specs.openuji.org/ed/ns/form.schema.json`.

:::include ./form.schema.json :::

## Minimal Example Payload

```json
{
  "@id": "urn:state:shipping",
  "@type": "State",
  "extensions": {
    "org.openuji.specs.ujg.form.v1": {
      "modelRefs": ["urn:model:checkout-draft"],
      "forms": [
        {
          "name": "shipping",
          "mode": "multi-step",
          "steps": [
            {
              "name": "address",
              "groups": [
                {
                  "name": "shipping-address",
                  "fields": [
                    { "name": "fullName", "kind": "text", "required": true, "presentation": "primary" },
                    { "name": "postalCode", "kind": "text", "required": true }
                  ]
                }
              ]
            }
          ]
        }
      ],
      "prefill": { "mode": "resume" },
      "resume": { "enabled": true, "scope": "user" },
      "autosave": { "enabled": true, "mode": "draft" },
      "submit": { "enabled": true, "transitionRef": "urn:transition:shipping-next", "result": "advance", "error": "summary" },
      "draftSave": { "enabled": true, "mode": "remote" },
      "validation": {
        "mode": "mixed",
        "timing": "mixed",
        "rules": [
          { "kind": "required", "field": "fullName" },
          { "kind": "pattern", "field": "postalCode", "pattern": "^[A-Z0-9 -]{4,10}$" }
        ]
      }
    }
  }
}
```

## Graduation Guidance

Thin parts that may later graduate into optional modules or shared references include:

- a form reference,
- a model reference,
- a reusable validation-rule reference.

The following should remain extension-only:

- nested step, group, and field structure,
- autosave and resume posture,
- submit and draft-save semantics,
- presentation hints for fields and groups.

**Title:** `org.openuji.specs.ujg.artifact.v1`

**Status:** incubating implementation extension for file, media, and document flow handling carried in UJG Core `extensions`.

## Namespace

- Canonical namespace string: `org.openuji.specs.ujg.artifact.v1`
- Payload location: `extensions["org.openuji.specs.ujg.artifact.v1"]`
- Published JSON Schema: `https://ujg.specs.openuji.org/ed/ns/artifact.schema.json`

## Purpose

This extension describes file, media, and document flow in a generator-friendly way.

It exists so that generators can understand:

- whether a node uploads, downloads, previews, or captures artifacts,
- which media kinds are accepted,
- which capture sources are available,
- what result posture should be used after artifact handling.

The extension is optional but practical for flows that involve receipts, uploads, document review,
image capture, or generated files.

## Scope

This extension covers:

- upload posture,
- download posture,
- preview posture,
- accepted media kinds,
- capture sources,
- artifact result posture.

The extension is self-contained and may refer to UJG node IDs for follow-up transitions, but it does
not depend on private objects from other extensions.

## Non-goals

This extension does not standardize:

- storage backends,
- CDN configuration,
- media processing pipelines,
- vendor upload widgets,
- file-system implementation details,
- MIME parsing rules beyond generic media-kind signaling.

## Primary Attachment Targets

- `State`
- `Transition`
- `Template`

`State` is the preferred host for artifact surfaces such as upload or preview pages. `Transition` is
the preferred host for action-time artifact handling such as download or capture submission.
`Template` is the preferred reusable host for shared artifact shells.

## Secondary Attachment Targets

- `CompositeState` for subflow-wide artifact defaults
- `Journey` for broad artifact posture such as accepted media kinds

## Discouraged Or Disallowed Attachment Targets

- `OutgoingTransitionGroup` is discouraged because artifact handling usually needs more node-local
  context than reusable outgoing edges provide.
- `Route` is discouraged because routing metadata belongs in Routing.
- `MessageBundle` is disallowed in normal use.
- `UJGDocument` is disallowed because Core extensions are node-scoped.

## Inheritance Model

For state-level artifact handling, generators should apply inheritance in this order:

1. `Journey`
2. each enclosing `CompositeState`, from outermost to innermost
3. resolved `Template`, if `templateRef` is present
4. the local `State`

For transition-level artifact handling, use:

1. `Journey`
2. enclosing `CompositeState`
3. source `State`
4. local `Transition`

## Precedence And Override Rules

For state-level artifact handling, use this precedence order:

1. `State`
2. `Template`
3. innermost `CompositeState`
4. outer `CompositeState`
5. `Journey`

For transition-level artifact handling, use:

1. `Transition`
2. source `State`
3. innermost `CompositeState`
4. outer `CompositeState`
5. `Journey`

Merge and replacement rules:

- `upload`, `download`, `preview`, and `resultPosture` are singular values or objects. The more
  specific value replaces the inherited one.
- `acceptedMediaKinds` and `captureSources` combine across inheritance with duplicate removal.
- a more specific host may narrow accepted media kinds but should not silently widen inherited
  restrictions without explicit local declaration.

## Property Vocabulary

- `upload`: upload posture. Expected shape: object with optional `enabled`, `multiple`,
  `destinationHint`, and `transitionRef`. Allowed categories for `destinationHint`: `replace`,
  `append`, `draft`, `submission`. Implementation intent: tells generators whether upload is part of
  the node and how uploaded artifacts conceptually attach.
- `download`: download posture. Expected shape: object with optional `enabled`, `kind`, and
  `transitionRef`. Allowed categories for `kind`: `direct`, `generated`, `linked`. Implementation
  intent: tells generators whether the node offers artifact download and what kind.
- `preview`: preview posture. Expected shape: object with optional `enabled`, `mode`, and
  `inlinePreferred`. Allowed categories for `mode`: `inline`, `modal`, `separate`, `external`.
  Implementation intent: tells generators how preview should be surfaced.
- `acceptedMediaKinds`: accepted artifact media kinds. Expected shape: array of strings. Allowed
  categories: generic kinds such as `image`, `video`, `audio`, `pdf`, `document`, `archive`, `data`.
  Implementation intent: gives generators portable intake constraints.
- `captureSources`: available capture sources. Expected shape: array of strings. Allowed categories:
  `file-picker`, `camera`, `gallery`, `scanner`, `clipboard`, `generated`, `remote`. Implementation
  intent: tells generators how artifacts may enter the flow.
- `resultPosture`: artifact result posture. Expected shape: object with optional `success`,
  `error`, and `successNodeRef`. Allowed categories for `success`: `stay`, `advance`, `append`,
  `replace`, `download`, `preview`. Allowed categories for `error`: `inline`, `banner`, `fallback`.
  Implementation intent: tells generators what happens after artifact work succeeds or fails.

## Recommended Controlled Values

Recommended `acceptedMediaKinds` values:

- `image`
- `video`
- `audio`
- `pdf`
- `document`
- `archive`
- `data`

Recommended `captureSources` values:

- `file-picker`
- `camera`
- `gallery`
- `scanner`
- `clipboard`
- `generated`
- `remote`

## Processing Model

A generator implementing this extension should:

1. Resolve the effective artifact payload using the inheritance and precedence rules above.
2. Normalize upload, download, preview, accepted media kinds, capture sources, and result posture.
3. Combine the result with Templates for shared shells, with Routing for addressable entry when
   relevant, and with L10n for localized labels or status messaging when the node also has `copyRef`.
4. Materialize target-specific upload, preview, download, or capture behavior without standardizing
   storage or media-processing internals.

If `transitionRef` or `successNodeRef` appears, the reference is a UJG node ID and must be resolved
using normal graph processing.

## Cross-Stack Interpretation Notes

- Web: map to upload pages, inline media preview, generated downloads, and receipt flows.
- Native: map to camera capture, gallery import, file preview, and native share or download flows.
- CMS: map to asset upload, preview, document review, and media-library entry flows.
- Commerce: map to invoice downloads, attachment upload, proof preview, or return-label generation.
- CLI or headless or background: map to file input, artifact generation, streamed downloads, or
  background artifact processing.

## Published JSON Schema

The published schema for this extension is defined below and is published at
`https://ujg.specs.openuji.org/ed/ns/artifact.schema.json`.

:::include ./artifact.schema.json :::

## Minimal Example Payload

```json
{
  "@id": "urn:state:receipt",
  "@type": "State",
  "extensions": {
    "org.openuji.specs.ujg.artifact.v1": {
      "download": {
        "enabled": true,
        "kind": "generated",
        "transitionRef": "urn:transition:receipt-download"
      },
      "preview": {
        "enabled": true,
        "mode": "inline",
        "inlinePreferred": true
      },
      "acceptedMediaKinds": ["pdf"],
      "captureSources": ["generated"],
      "resultPosture": {
        "success": "download",
        "error": "banner",
        "successNodeRef": "urn:state:receipt"
      }
    }
  }
}
```

## Graduation Guidance

Thin parts that may later graduate into optional modules or shared references include:

- a media-kind reference,
- a capture-source reference,
- an artifact action reference.

The following should remain extension-only:

- upload, download, and preview posture,
- combined artifact result behavior,
- generator-facing artifact flow detail.

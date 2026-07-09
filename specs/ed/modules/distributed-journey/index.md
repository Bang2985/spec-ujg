## Overview

This module defines a vocabulary for human-facing journeys whose visible states, actions, artifacts,
or outcomes depend on more than one independently operated touchpoint.

Distributed Journey does not model internal server truth.
Protocol messages and API responses are evidence, not the primary journey.

This module is intentionally second-level. It composes first-level bridge modules instead of adding
distributed systems semantics directly to Core, Graph, or Runtime:

- Actor identifies participants and eligible actors when a distributed journey also models them.
- Surface identifies the machine-presented boundary a human sees or acts through.
- Action identifies side effects associated with Graph transitions or outgoing transitions.
- Artifact identifies files, archives, reports, invites, media, or other resources involved in the
  journey.

State Data is not a dependency of this module unless a distributed-journey document also needs
state-like data binding identity. Distributed Journey uses Surface touchpoints for human-facing
boundaries and Artifact for portable resources that cross those boundaries.

Simple single-site forms, checkouts, dashboards, and app flows do not need this module.

## Normative Artifacts

This module is published through the following artifacts:

- `distributed-journey.ttl`: ontology, published at `https://ujg.specs.openuji.org/ed/ns/distributed-journey`
- `distributed-journey.context.jsonld`: JSON-LD term mappings, published at `https://ujg.specs.openuji.org/ed/ns/distributed-journey.context.jsonld`
- `distributed-journey.shape.ttl`: SHACL validation rules, published at `https://ujg.specs.openuji.org/ed/ns/distributed-journey.shape`

Examples in this page compose the Core, Graph, Actor, Surface, Action, Artifact, and
Distributed Journey contexts as needed. Companion Runtime Evidence examples compose Core, Runtime,
and Runtime Evidence contexts and import the distributed graph document they describe.

## Terminology

- <dfn>DistributedArtifact</dfn>: An [=Artifact=] that is visible to, handled by, produced by, or
  consumed by a human-facing journey that crosses touchpoints.
- <dfn>Presented touchpoint</dfn>: The [=Touchpoint=] that presents or controls a [=Surface=].

## Model

Surface defines `Touchpoint` and `touchpointRef`. `touchpointRef` links a `Surface` to the
touchpoint that presents or controls it. This is Distributed Journey's main human-facing attachment:
it lets a journey cross multiple systems while keeping the graph surface-oriented. Surface
`graphNodeRef` points from each `Surface` back to its Graph subject; Graph states do not depend on
Distributed Journey or Surface.

An `Action` may identify source and target touchpoints when the action itself crosses touchpoint
boundaries and no more specific produced or consumed artifact carries that relationship.

`DistributedArtifact` specializes Artifact. It may identify source and target touchpoints when a
file, archive, report, invite, media object, or similar resource crosses touchpoint boundaries.

Examples use the most-specific distributed type. `DistributedArtifact` inherits its Artifact meaning
through the ontology. Touchpoints remain Surface nodes, not Actors.

Pending, failed, partial, unavailable, accepted, revoked, and blocked are ordinary human-visible
`State` nodes when a person sees or experiences them. This module does not define value objects for
those statuses.

Protocol messages, server logs, API responses, queues, and synchronization state are Runtime facts,
Runtime Evidence metadata, artifacts, or private extension data unless they are directly exposed to
a human as a visible status, confirmation, error, affordance, unavailable action, recovery path, or
outcome.

## Non-Goals

Distributed Journey does not define:

- a new journey class
- graph traversal semantics
- runtime causal ordering
- mapping conformance semantics
- protocol vocabulary
- queue, retry, delivery, or synchronization semantics
- status, claim, gap, propagation, portability, or consistency taxonomies
- server truth, database state, or internal protocol state

## Ontology {data-cop-concept="ontology"}

The normative Distributed Journey ontology is defined below and is published at
`https://ujg.specs.openuji.org/ed/ns/distributed-journey`.

:::include ./distributed-journey.ttl :::

## JSON-LD Context {data-cop-concept="jsonld-context"}

The normative Distributed Journey JSON-LD context is defined below and is published at
`https://ujg.specs.openuji.org/ed/ns/distributed-journey.context.jsonld`.

:::include ./distributed-journey.context.jsonld :::

## Validation {data-cop-concept="validation"}

The normative Distributed Journey SHACL shape is defined below and is published at
`https://ujg.specs.openuji.org/ed/ns/distributed-journey.shape`.

:::include ./distributed-journey.shape.ttl :::

The rules below define the remaining module semantics beyond the structural constraints captured by
the SHACL shape.

1. **Human-facing graph:** Distributed Journey terms MUST NOT replace the human-facing UJG Journey
   graph. A UJG Journey remains a model of human interaction with machine-presented surfaces,
   affordances, responses, statuses, errors, and outcomes.
2. **Touchpoint meaning:** `Touchpoint` identifies a system, channel, origin, or service boundary
   responsible for presenting or controlling a human-facing surface, action, artifact, or outcome.
   It MUST NOT be interpreted as an Actor, runtime observer, authorization subject, or statement of
   what a server internally believes.
3. **Action touchpoint metadata:** `sourceTouchpointRef` and `targetTouchpointRefs` MAY be attached to
   an `Action` when the human-facing action crosses touchpoint boundaries directly. They MUST NOT be
   interpreted as graph edges, runtime causality, or server-internal state.
4. **Visible statuses:** Pending, failed, partial, unavailable, accepted, revoked, and blocked
   outcomes SHOULD be modeled as ordinary Graph states when they are visible or meaningful to a
   human.
5. **Machine details stay outside graph:** Protocol messages, logs, API responses, queues, and sync
   state SHOULD remain Runtime, Runtime Evidence, Artifact, or private extension data unless
   directly exposed to a human.
6. **No hidden graph behavior:** Distributed terms MUST NOT create hidden graph edges or change
   transition endpoint semantics.
7. **Graceful degradation:** Consumers that do not implement this module MAY ignore Distributed
   Journey semantics, but SHOULD preserve recognized JSON-LD data during read-transform-write when
   possible.

## Nextcloud Federated File Sharing Example

```json
{
  "@context": [
    "https://ujg.specs.openuji.org/ed/ns/core.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/graph.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/actor.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/surface.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/action.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/artifact.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/distributed-journey.context.jsonld"
  ],
  "@id": "https://example.com/ujg/distributed/nextcloud-share.jsonld",
  "@type": "UJGDocument",
  "nodes": [
    {
      "@id": "urn:touchpoint:cloud-a",
      "@type": "Touchpoint",
      "label": "Cloud A",
      "origin": "https://cloud-a.example"
    },
    {
      "@id": "urn:touchpoint:cloud-b",
      "@type": "Touchpoint",
      "label": "Cloud B",
      "origin": "https://cloud-b.example"
    },
    {
      "@id": "urn:actor:alice",
      "@type": "Actor"
    },
    {
      "@id": "urn:actor:bob",
      "@type": "Actor"
    },
    {
      "@id": "urn:index:nextcloud-federated-sharing",
      "@type": "JourneyEntryIndex",
      "label": "Nextcloud federated sharing entries",
      "stateRefs": [
        "urn:composite:alice-federated-sharing",
        "urn:composite:bob-remote-share-acceptance"
      ]
    },
    {
      "@id": "urn:composite:alice-federated-sharing",
      "@type": "CompositeState",
      "label": "Alice federated sharing journey",
      "subjourneyId": "urn:journey:alice-federated-sharing"
    },
    {
      "@id": "urn:composite:bob-remote-share-acceptance",
      "@type": "CompositeState",
      "label": "Bob remote-share acceptance journey",
      "subjourneyId": "urn:journey:bob-remote-share-acceptance"
    },
    {
      "@id": "urn:journey:alice-federated-sharing",
      "@type": "Journey",
      "label": "Alice federated sharing",
      "defaultEntryRef": "urn:entry:alice-federated-sharing-default",
      "entryRefs": [
        "urn:entry:alice-federated-sharing-default"
      ],
      "stateRefs": [
        "urn:state:alice-share-panel",
        "urn:state:alice-recipient-recognized",
        "urn:state:alice-share-confirmed",
        "urn:state:alice-share-revoked"
      ],
      "transitionRefs": [
        "urn:transition:alice-recognize-recipient",
        "urn:transition:alice-confirm-share",
        "urn:transition:alice-revoke-share"
      ]
    },
    {
      "@type": "JourneyEntry",
      "@id": "urn:entry:alice-federated-sharing-default",
      "stateRef": "urn:state:alice-share-panel"
    },
    {
      "@id": "urn:journey:bob-remote-share-acceptance",
      "@type": "Journey",
      "label": "Bob remote-share acceptance",
      "defaultEntryRef": "urn:entry:bob-remote-share-acceptance-default",
      "entryRefs": [
        "urn:entry:bob-remote-share-acceptance-default"
      ],
      "stateRefs": [
        "urn:state:bob-incoming-share",
        "urn:state:bob-file-available",
        "urn:state:bob-access-removed"
      ],
      "transitionRefs": [
        "urn:transition:bob-accepts-share",
        "urn:transition:bob-observes-access-removed"
      ]
    },
    {
      "@type": "JourneyEntry",
      "@id": "urn:entry:bob-remote-share-acceptance-default",
      "stateRef": "urn:state:bob-incoming-share"
    },
    {
      "@id": "urn:state:alice-share-panel",
      "@type": "State",
      "label": "Alice sees the share panel",
      "eligibleActorRefs": [
        "urn:actor:alice"
      ]
    },
    {
      "@id": "urn:state:alice-recipient-recognized",
      "@type": "State",
      "label": "Alice sees Bob recognized as a remote recipient",
      "eligibleActorRefs": [
        "urn:actor:alice"
      ]
    },
    {
      "@id": "urn:state:alice-share-confirmed",
      "@type": "State",
      "label": "Alice sees shared with Bob",
      "eligibleActorRefs": [
        "urn:actor:alice"
      ]
    },
    {
      "@id": "urn:state:alice-share-revoked",
      "@type": "State",
      "label": "Alice sees the share revoked",
      "eligibleActorRefs": [
        "urn:actor:alice"
      ]
    },
    {
      "@id": "urn:state:bob-incoming-share",
      "@type": "State",
      "label": "Bob sees an incoming remote share",
      "eligibleActorRefs": [
        "urn:actor:bob"
      ]
    },
    {
      "@id": "urn:state:bob-file-available",
      "@type": "State",
      "label": "Bob can open the shared folder",
      "eligibleActorRefs": [
        "urn:actor:bob"
      ]
    },
    {
      "@id": "urn:state:bob-access-removed",
      "@type": "State",
      "label": "Bob sees access removed",
      "eligibleActorRefs": [
        "urn:actor:bob"
      ]
    },
    {
      "@id": "urn:surface:alice-share-panel",
      "@type": "Surface",
      "graphNodeRef": "urn:state:alice-share-panel",
      "touchpointRef": "urn:touchpoint:cloud-a"
    },
    {
      "@id": "urn:surface:alice-recipient-recognized",
      "@type": "Surface",
      "graphNodeRef": "urn:state:alice-recipient-recognized",
      "touchpointRef": "urn:touchpoint:cloud-a"
    },
    {
      "@id": "urn:surface:alice-share-confirmed",
      "@type": "Surface",
      "graphNodeRef": "urn:state:alice-share-confirmed",
      "touchpointRef": "urn:touchpoint:cloud-a"
    },
    {
      "@id": "urn:surface:alice-share-revoked",
      "@type": "Surface",
      "graphNodeRef": "urn:state:alice-share-revoked",
      "touchpointRef": "urn:touchpoint:cloud-a"
    },
    {
      "@id": "urn:surface:bob-incoming-share",
      "@type": "Surface",
      "graphNodeRef": "urn:state:bob-incoming-share",
      "touchpointRef": "urn:touchpoint:cloud-b"
    },
    {
      "@id": "urn:surface:bob-file-available",
      "@type": "Surface",
      "graphNodeRef": "urn:state:bob-file-available",
      "touchpointRef": "urn:touchpoint:cloud-b"
    },
    {
      "@id": "urn:surface:bob-access-removed",
      "@type": "Surface",
      "graphNodeRef": "urn:state:bob-access-removed",
      "touchpointRef": "urn:touchpoint:cloud-b"
    },
    {
      "@id": "urn:transition:alice-recognize-recipient",
      "@type": "Transition",
      "from": "urn:state:alice-share-panel",
      "to": "urn:state:alice-recipient-recognized"
    },
    {
      "@id": "urn:transition:alice-confirm-share",
      "@type": "Transition",
      "from": "urn:state:alice-recipient-recognized",
      "to": "urn:state:alice-share-confirmed",
      "actionRef": "urn:action:share-with-bob"
    },
    {
      "@id": "urn:transition:alice-revoke-share",
      "@type": "Transition",
      "from": "urn:state:alice-share-confirmed",
      "to": "urn:state:alice-share-revoked",
      "actionRef": "urn:action:alice-revoke-share"
    },
    {
      "@id": "urn:transition:bob-accepts-share",
      "@type": "Transition",
      "from": "urn:state:bob-incoming-share",
      "to": "urn:state:bob-file-available",
      "actionRef": "urn:action:bob-accepts-share"
    },
    {
      "@id": "urn:transition:bob-observes-access-removed",
      "@type": "Transition",
      "from": "urn:state:bob-file-available",
      "to": "urn:state:bob-access-removed"
    },
    {
      "@id": "urn:action:share-with-bob",
      "@type": "Action",
      "producedArtifactRefs": [
        "urn:artifact:remote-share"
      ],
      "sourceTouchpointRef": "urn:touchpoint:cloud-a",
      "targetTouchpointRefs": [
        "urn:touchpoint:cloud-b"
      ]
    },
    {
      "@id": "urn:action:bob-accepts-share",
      "@type": "Action",
      "consumedArtifactRefs": [
        "urn:artifact:remote-share"
      ]
    },
    {
      "@id": "urn:action:alice-revoke-share",
      "@type": "Action",
      "consumedArtifactRefs": [
        "urn:artifact:remote-share"
      ],
      "sourceTouchpointRef": "urn:touchpoint:cloud-a",
      "targetTouchpointRefs": [
        "urn:touchpoint:cloud-b"
      ]
    },
    {
      "@id": "urn:artifact:remote-share",
      "@type": "DistributedArtifact",
      "sourceTouchpointRef": "urn:touchpoint:cloud-a",
      "targetTouchpointRefs": [
        "urn:touchpoint:cloud-b"
      ]
    }
  ]
}
```

This example intentionally uses separate journeys for Alice and Bob. The distributed artifact links
the journeys semantically, but it does not create Graph transitions between Alice's states and Bob's
states. Runtime Evidence can record that one execution observed Alice sharing before Bob accepted,
and Alice revoking before Bob observed removal.

> **Note:** Do not use Distributed Journey to model an artifact lifecycle as a single Journey. If
> the scenario involves multiple human actors on different surfaces, model each actor's local
> journey separately and use Runtime Evidence to record execution interleaving.

A companion Runtime Evidence document can record observed ordering across the separate journey
instances without adding evidence nodes to the distributed graph itself:

```json
{
  "@context": [
    "https://ujg.specs.openuji.org/ed/ns/core.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/surface.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/runtime.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/runtime-evidence.context.jsonld"
  ],
  "@id": "https://example.com/ujg/runtime-evidence/execution-12345.jsonld",
  "@type": "UJGDocument",
  "imports": [
    "https://example.com/ujg/distributed/nextcloud-share.jsonld"
  ],
  "nodes": [
    {
      "@id": "urn:execution:nextcloud-share-12345",
      "@type": "JourneyExecution"
    },
    {
      "@id": "urn:surface-instance:alice-share-confirmed",
      "@type": "SurfaceInstance",
      "surfaceRef": "urn:surface:alice-share-confirmed"
    },
    {
      "@id": "urn:surface-instance:bob-incoming-share",
      "@type": "SurfaceInstance",
      "surfaceRef": "urn:surface:bob-incoming-share"
    },
    {
      "@id": "urn:surface-instance:bob-file-available",
      "@type": "SurfaceInstance",
      "surfaceRef": "urn:surface:bob-file-available"
    },
    {
      "@id": "urn:surface-instance:alice-share-revoked",
      "@type": "SurfaceInstance",
      "surfaceRef": "urn:surface:alice-share-revoked"
    },
    {
      "@id": "urn:surface-instance:bob-access-removed",
      "@type": "SurfaceInstance",
      "surfaceRef": "urn:surface:bob-access-removed"
    },
    {
      "@id": "urn:event:nextcloud-share-12345:alice-share-confirmed",
      "@type": "RuntimeEvent",
      "executionId": "urn:execution:nextcloud-share-12345",
      "surfaceInstanceRef": "urn:surface-instance:alice-share-confirmed",
      "payload": {
        "action": "surface.visible"
      }
    },
    {
      "@id": "urn:event:nextcloud-share-12345:bob-incoming-share",
      "@type": "RuntimeEvent",
      "executionId": "urn:execution:nextcloud-share-12345",
      "previousId": "urn:event:nextcloud-share-12345:alice-share-confirmed",
      "surfaceInstanceRef": "urn:surface-instance:bob-incoming-share",
      "payload": {
        "action": "surface.visible"
      }
    },
    {
      "@id": "urn:event:nextcloud-share-12345:bob-file-available",
      "@type": "RuntimeEvent",
      "executionId": "urn:execution:nextcloud-share-12345",
      "previousId": "urn:event:nextcloud-share-12345:bob-incoming-share",
      "surfaceInstanceRef": "urn:surface-instance:bob-file-available",
      "payload": {
        "action": "surface.visible"
      }
    },
    {
      "@id": "urn:event:nextcloud-share-12345:alice-share-revoked",
      "@type": "RuntimeEvent",
      "executionId": "urn:execution:nextcloud-share-12345",
      "previousId": "urn:event:nextcloud-share-12345:bob-file-available",
      "surfaceInstanceRef": "urn:surface-instance:alice-share-revoked",
      "payload": {
        "action": "surface.visible"
      }
    },
    {
      "@id": "urn:event:nextcloud-share-12345:bob-access-removed",
      "@type": "RuntimeEvent",
      "executionId": "urn:execution:nextcloud-share-12345",
      "previousId": "urn:event:nextcloud-share-12345:alice-share-revoked",
      "surfaceInstanceRef": "urn:surface-instance:bob-access-removed",
      "payload": {
        "action": "surface.visible"
      }
    },
    {
      "@id": "urn:runtime-evidence:nextcloud-share:alice-share-confirmed",
      "@type": "RuntimeEvidenceRecord",
      "journeyExecutionRef": "urn:execution:nextcloud-share-12345",
      "runtimeEventRef": "urn:event:nextcloud-share-12345:alice-share-confirmed",
      "evidencePayload": {
        "source": "cloud-a-runtime",
        "record": "state-observed"
      }
    },
    {
      "@id": "urn:runtime-evidence:nextcloud-share:bob-file-available",
      "@type": "RuntimeEvidenceRecord",
      "journeyExecutionRef": "urn:execution:nextcloud-share-12345",
      "runtimeEventRef": "urn:event:nextcloud-share-12345:bob-file-available",
      "evidencePayload": {
        "source": "cloud-b-runtime",
        "record": "state-observed"
      }
    },
    {
      "@id": "urn:runtime-evidence:nextcloud-share:alice-share-revoked",
      "@type": "RuntimeEvidenceRecord",
      "journeyExecutionRef": "urn:execution:nextcloud-share-12345",
      "runtimeEventRef": "urn:event:nextcloud-share-12345:alice-share-revoked",
      "evidencePayload": {
        "source": "cloud-a-runtime",
        "record": "state-observed"
      }
    },
    {
      "@id": "urn:runtime-evidence:nextcloud-share:bob-access-removed",
      "@type": "RuntimeEvidenceRecord",
      "journeyExecutionRef": "urn:execution:nextcloud-share-12345",
      "runtimeEventRef": "urn:event:nextcloud-share-12345:bob-access-removed",
      "evidencePayload": {
        "source": "cloud-b-runtime",
        "record": "state-observed"
      }
    }
  ]
}
```

## Federated Account Migration Example

```json
{
  "@context": [
    "https://ujg.specs.openuji.org/ed/ns/core.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/graph.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/surface.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/action.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/artifact.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/distributed-journey.context.jsonld"
  ],
  "@id": "https://example.com/ujg/distributed/account-migration.jsonld",
  "@type": "UJGDocument",
  "nodes": [
    {
      "@id": "urn:touchpoint:old",
      "@type": "Touchpoint",
      "label": "Old server",
      "origin": "https://old.example"
    },
    {
      "@id": "urn:touchpoint:new",
      "@type": "Touchpoint",
      "label": "New server",
      "origin": "https://new.example"
    },
    {
      "@id": "urn:journey:account-migration",
      "@type": "Journey",
      "label": "Account migration",
      "defaultEntryRef": "urn:entry:account-migration-default",
      "entryRefs": [
        "urn:entry:account-migration-default"
      ],
      "stateRefs": [
        "urn:state:export-settings",
        "urn:state:archive-ready",
        "urn:state:import-settings",
        "urn:state:partial-import-confirmed",
        "urn:state:non-portable-warning"
      ],
      "transitionRefs": [
        "urn:transition:request-export",
        "urn:transition:open-import-settings",
        "urn:transition:import-archive",
        "urn:transition:show-warning"
      ]
    },
    {
      "@type": "JourneyEntry",
      "@id": "urn:entry:account-migration-default",
      "stateRef": "urn:state:export-settings"
    },
    {
      "@id": "urn:state:export-settings",
      "@type": "State",
      "label": "Alice sees export settings on the old server"
    },
    {
      "@id": "urn:state:archive-ready",
      "@type": "State",
      "label": "Alice sees export archive ready"
    },
    {
      "@id": "urn:state:import-settings",
      "@type": "State",
      "label": "Alice sees import settings on the new server"
    },
    {
      "@id": "urn:state:partial-import-confirmed",
      "@type": "State",
      "label": "Alice sees partial import confirmation"
    },
    {
      "@id": "urn:state:non-portable-warning",
      "@type": "State",
      "label": "Alice sees warnings about content that cannot be imported"
    },
    {
      "@id": "urn:surface:export-settings",
      "@type": "Surface",
      "graphNodeRef": "urn:state:export-settings",
      "touchpointRef": "urn:touchpoint:old"
    },
    {
      "@id": "urn:surface:archive-ready",
      "@type": "Surface",
      "graphNodeRef": "urn:state:archive-ready",
      "touchpointRef": "urn:touchpoint:old"
    },
    {
      "@id": "urn:surface:import-settings",
      "@type": "Surface",
      "graphNodeRef": "urn:state:import-settings",
      "touchpointRef": "urn:touchpoint:new"
    },
    {
      "@id": "urn:surface:partial-import-confirmed",
      "@type": "Surface",
      "graphNodeRef": "urn:state:partial-import-confirmed",
      "touchpointRef": "urn:touchpoint:new"
    },
    {
      "@id": "urn:surface:non-portable-warning",
      "@type": "Surface",
      "graphNodeRef": "urn:state:non-portable-warning",
      "touchpointRef": "urn:touchpoint:new"
    },
    {
      "@id": "urn:transition:request-export",
      "@type": "Transition",
      "from": "urn:state:export-settings",
      "to": "urn:state:archive-ready",
      "actionRef": "urn:action:request-export"
    },
    {
      "@id": "urn:transition:import-archive",
      "@type": "Transition",
      "from": "urn:state:import-settings",
      "to": "urn:state:partial-import-confirmed",
      "actionRef": "urn:action:import-archive"
    },
    {
      "@id": "urn:transition:open-import-settings",
      "@type": "Transition",
      "from": "urn:state:archive-ready",
      "to": "urn:state:import-settings"
    },
    {
      "@id": "urn:transition:show-warning",
      "@type": "Transition",
      "from": "urn:state:partial-import-confirmed",
      "to": "urn:state:non-portable-warning"
    },
    {
      "@id": "urn:action:request-export",
      "@type": "Action",
      "producedArtifactRefs": [
        "urn:artifact:account-archive"
      ]
    },
    {
      "@id": "urn:action:import-archive",
      "@type": "Action",
      "consumedArtifactRefs": [
        "urn:artifact:account-archive"
      ]
    },
    {
      "@id": "urn:artifact:account-archive",
      "@type": "DistributedArtifact",
      "sourceTouchpointRef": "urn:touchpoint:old",
      "targetTouchpointRefs": [
        "urn:touchpoint:new"
      ]
    }
  ]
}
```

This is one user's migration journey across two touchpoints, not an artifact-only lifecycle. The
same actor continues from the old server's export surface to the new server's import surface, and
the exported archive connects the touchpoints semantically without becoming the journey path.

The non-portable content warning is an ordinary visible state. The module does not need a
portability taxonomy to represent partial success.

A companion Runtime Evidence document can describe the runtime observation of the partial import
confirmation as metadata attached to a runtime event:

```json
{
  "@context": [
    "https://ujg.specs.openuji.org/ed/ns/core.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/surface.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/runtime.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/runtime-evidence.context.jsonld"
  ],
  "@id": "https://example.com/ujg/runtime-evidence/execution-23456.jsonld",
  "@type": "UJGDocument",
  "imports": [
    "https://example.com/ujg/distributed/account-migration.jsonld"
  ],
  "nodes": [
    {
      "@id": "urn:execution:account-migration-23456",
      "@type": "JourneyExecution"
    },
    {
      "@id": "urn:surface-instance:partial-import-confirmed",
      "@type": "SurfaceInstance",
      "surfaceRef": "urn:surface:partial-import-confirmed"
    },
    {
      "@id": "urn:event:account-migration-23456:partial-import-confirmed",
      "@type": "RuntimeEvent",
      "executionId": "urn:execution:account-migration-23456",
      "surfaceInstanceRef": "urn:surface-instance:partial-import-confirmed",
      "payload": {
        "action": "surface.visible"
      }
    },
    {
      "@id": "urn:runtime-evidence:account-migration:partial-import-confirmed",
      "@type": "RuntimeEvidenceRecord",
      "journeyExecutionRef": "urn:execution:account-migration-23456",
      "runtimeEventRef": "urn:event:account-migration-23456:partial-import-confirmed",
      "evidencePayload": {
        "source": "new-server-runtime",
        "record": "state-observed"
      }
    }
  ]
}
```

## Remote Follow Or Subscription Example

```json
{
  "@context": [
    "https://ujg.specs.openuji.org/ed/ns/core.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/graph.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/surface.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/action.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/distributed-journey.context.jsonld"
  ],
  "@id": "https://example.com/ujg/distributed/remote-follow.jsonld",
  "@type": "UJGDocument",
  "nodes": [
    {
      "@id": "urn:touchpoint:local",
      "@type": "Touchpoint",
      "label": "Local server",
      "origin": "https://local.example"
    },
    {
      "@id": "urn:touchpoint:remote",
      "@type": "Touchpoint",
      "label": "Remote server",
      "origin": "https://remote.example"
    },
    {
      "@id": "urn:journey:remote-follow",
      "@type": "Journey",
      "label": "Remote follow",
      "defaultEntryRef": "urn:entry:remote-follow-default",
      "entryRefs": [
        "urn:entry:remote-follow-default"
      ],
      "stateRefs": [
        "urn:state:remote-search",
        "urn:state:remote-result-visible",
        "urn:state:follow-pending",
        "urn:state:following-visible",
        "urn:state:follow-rejected",
        "urn:state:remote-unavailable",
        "urn:state:remote-feed-visible"
      ],
      "transitionRefs": [
        "urn:transition:open-result",
        "urn:transition:click-follow",
        "urn:transition:follow-accepted",
        "urn:transition:follow-rejected",
        "urn:transition:remote-unavailable",
        "urn:transition:updates-visible"
      ]
    },
    {
      "@type": "JourneyEntry",
      "@id": "urn:entry:remote-follow-default",
      "stateRef": "urn:state:remote-search"
    },
    {
      "@id": "urn:state:remote-search",
      "@type": "State",
      "label": "Alice searches for a remote account"
    },
    {
      "@id": "urn:state:remote-result-visible",
      "@type": "State",
      "label": "Alice sees the remote account result"
    },
    {
      "@id": "urn:state:follow-pending",
      "@type": "State",
      "label": "Alice sees follow request pending"
    },
    {
      "@id": "urn:state:following-visible",
      "@type": "State",
      "label": "Alice sees following"
    },
    {
      "@id": "urn:state:follow-rejected",
      "@type": "State",
      "label": "Alice sees the follow request rejected"
    },
    {
      "@id": "urn:state:remote-unavailable",
      "@type": "State",
      "label": "Alice sees the remote account unavailable"
    },
    {
      "@id": "urn:state:remote-feed-visible",
      "@type": "State",
      "label": "Alice sees remote updates in her local feed"
    },
    {
      "@id": "urn:surface:remote-search",
      "@type": "Surface",
      "graphNodeRef": "urn:state:remote-search",
      "touchpointRef": "urn:touchpoint:local"
    },
    {
      "@id": "urn:surface:remote-result-visible",
      "@type": "Surface",
      "graphNodeRef": "urn:state:remote-result-visible",
      "touchpointRef": "urn:touchpoint:local"
    },
    {
      "@id": "urn:surface:follow-pending",
      "@type": "Surface",
      "graphNodeRef": "urn:state:follow-pending",
      "touchpointRef": "urn:touchpoint:local"
    },
    {
      "@id": "urn:surface:following-visible",
      "@type": "Surface",
      "graphNodeRef": "urn:state:following-visible",
      "touchpointRef": "urn:touchpoint:local"
    },
    {
      "@id": "urn:surface:follow-rejected",
      "@type": "Surface",
      "graphNodeRef": "urn:state:follow-rejected",
      "touchpointRef": "urn:touchpoint:local"
    },
    {
      "@id": "urn:surface:remote-unavailable",
      "@type": "Surface",
      "graphNodeRef": "urn:state:remote-unavailable",
      "touchpointRef": "urn:touchpoint:local"
    },
    {
      "@id": "urn:surface:remote-feed-visible",
      "@type": "Surface",
      "graphNodeRef": "urn:state:remote-feed-visible",
      "touchpointRef": "urn:touchpoint:local"
    },
    {
      "@id": "urn:transition:open-result",
      "@type": "Transition",
      "from": "urn:state:remote-search",
      "to": "urn:state:remote-result-visible"
    },
    {
      "@id": "urn:transition:click-follow",
      "@type": "Transition",
      "from": "urn:state:remote-result-visible",
      "to": "urn:state:follow-pending",
      "actionRef": "urn:action:click-follow"
    },
    {
      "@id": "urn:transition:updates-visible",
      "@type": "Transition",
      "from": "urn:state:following-visible",
      "to": "urn:state:remote-feed-visible"
    },
    {
      "@id": "urn:transition:follow-accepted",
      "@type": "Transition",
      "from": "urn:state:follow-pending",
      "to": "urn:state:following-visible"
    },
    {
      "@id": "urn:transition:follow-rejected",
      "@type": "Transition",
      "from": "urn:state:follow-pending",
      "to": "urn:state:follow-rejected"
    },
    {
      "@id": "urn:transition:remote-unavailable",
      "@type": "Transition",
      "from": "urn:state:remote-result-visible",
      "to": "urn:state:remote-unavailable"
    },
    {
      "@id": "urn:action:click-follow",
      "@type": "Action",
      "sourceTouchpointRef": "urn:touchpoint:local",
      "targetTouchpointRefs": [
        "urn:touchpoint:remote"
      ]
    }
  ]
}
```

The invisible federation request is not modeled as a journey state. The visible pending state and
later feed visibility are Alice's local user-facing graph. Remote approval, delivery,
moderation, queueing, or acceptance belongs in Runtime Evidence, or in a separate remote
touchpoint journey only when another actor sees and acts on those states through their own UI.

A companion Runtime Evidence document can describe the runtime observation of the remote feed
becoming visible while leaving the invisible federation request outside the graph:

```json
{
  "@context": [
    "https://ujg.specs.openuji.org/ed/ns/core.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/surface.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/runtime.context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/runtime-evidence.context.jsonld"
  ],
  "@id": "https://example.com/ujg/runtime-evidence/execution-34567.jsonld",
  "@type": "UJGDocument",
  "imports": [
    "https://example.com/ujg/distributed/remote-follow.jsonld"
  ],
  "nodes": [
    {
      "@id": "urn:execution:remote-follow-34567",
      "@type": "JourneyExecution"
    },
    {
      "@id": "urn:surface-instance:remote-feed-visible",
      "@type": "SurfaceInstance",
      "surfaceRef": "urn:surface:remote-feed-visible"
    },
    {
      "@id": "urn:event:remote-follow-34567:remote-feed-visible",
      "@type": "RuntimeEvent",
      "executionId": "urn:execution:remote-follow-34567",
      "surfaceInstanceRef": "urn:surface-instance:remote-feed-visible",
      "payload": {
        "action": "surface.visible"
      }
    },
    {
      "@id": "urn:runtime-evidence:remote-follow:remote-feed-visible",
      "@type": "RuntimeEvidenceRecord",
      "journeyExecutionRef": "urn:execution:remote-follow-34567",
      "runtimeEventRef": "urn:event:remote-follow-34567:remote-feed-visible",
      "evidencePayload": {
        "source": "local-runtime",
        "record": "state-observed"
      }
    }
  ]
}
```

## Overview

This module defines the basic vocabulary and processing model for mapping causally ordered Runtime
events back to the intended Graph journey they belong to.

Runtime records what happened. Graph defines the intended journey topology. Mapping connects the two
by resolving each `RuntimeEvent.stateRef` in a causal chain and associating that resolved chain with
an explicit Graph `Journey`.

Mapping surfaces model drift, tracking gaps, deep links, menu jumps, and other out-of-model
movement. It does not assume every jump is an error.

## Normative Artifacts

This module is published through the following artifacts:

- `mapping.ttl`: ontology, published at `https://ujg.specs.openuji.org/ed/ns/mapping`
- `mapping.context.jsonld`: JSON-LD term mappings, published at `https://ujg.specs.openuji.org/ed/ns/mapping.context.jsonld`
- `mapping.shape.ttl`: SHACL validation rules, published at `https://ujg.specs.openuji.org/ed/ns/mapping.shape`

Examples in this page compose the shared baseline context `https://ujg.specs.openuji.org/ed/ns/context.jsonld`
with the Mapping context.

## Terminology

- <dfn>JourneyMapping</dfn>: An addressable mapping record that binds one Runtime execution chain to
  the Graph `Journey` it belongs to.
- <dfn>MappedStep</dfn>: An addressable mapping record for one `RuntimeEvent` in the mapped chain.
- <dfn>Mapped runtime</dfn>: The `JourneyExecution` whose causal `RuntimeEvent` chain is being
  resolved.
- <dfn>Mapped state</dfn>: A Graph `State` or `CompositeState` resolved from a
  `RuntimeEvent.stateRef`.
- <dfn>Mapped scope</dfn>: The Graph `Journey` used to interpret one mapped step when nested or
  composite journeys require explicit disambiguation.
- <dfn>In-model step</dfn>: A mapped step whose movement follows an effective Graph transition.
- <dfn>Jump</dfn>: A mapped step where no effective Graph transition explains the observed movement.

## Mapping Model

A `JourneyMapping` links:

- `mapping:mappedRuntimeRef` to the Runtime `JourneyExecution` being mapped.
- `mapping:mappedJourneyRef` to the Graph `Journey` that owns the interpreted chain.
- `mapping:mappedStepRef` to the `MappedStep` records for events in the runtime chain.
- `mapping:mappingStatus` to a compact status summary such as `in-model`, `jump`, or `mixed`.

Each `MappedStep` links:

- `mapping:mappedEventRef` to the Runtime `RuntimeEvent` being interpreted.
- `mapping:mappedStateRef` to the resolved Graph `State` or `CompositeState`.
- `mapping:stepStatus` to `origin`, `in-model`, or `jump`.
- `mapping:mappedScopeRef`, when needed, to the active Graph `Journey` scope for that step.
- `mapping:explainedByTransitionRef`, when present, to the effective `Transition` or
  `OutgoingTransition` that explains the movement.

The Runtime event order remains defined by Runtime's causal chain: a root event followed by the
unique successor sequence obtained through `previousId`. `mappedStepRef` is a set of step records;
its JSON order is not normative.

## Ontology {data-cop-concept="ontology"}

The normative Mapping ontology is defined below and is published at
`https://ujg.specs.openuji.org/ed/ns/mapping`.

:::include ./mapping.ttl :::

## JSON-LD Context {data-cop-concept="jsonld-context"}

The normative Mapping JSON-LD context is defined below and is published at
`https://ujg.specs.openuji.org/ed/ns/mapping.context.jsonld`.

:::include ./mapping.context.jsonld :::

## Validation {data-cop-concept="validation"}

The normative Mapping SHACL shape is defined below and is published at
`https://ujg.specs.openuji.org/ed/ns/mapping.shape`.

:::include ./mapping.shape.ttl :::

The rules below define the remaining module semantics beyond the structural constraints captured by
the SHACL shape.

1. **Runtime chain source:** A consumer mapping runtime behavior MUST reconstruct event order using
   the Runtime causal chain model.
2. **Step correspondence:** Each `MappedStep` MUST identify one `RuntimeEvent` in the mapped
   runtime chain through `mappedEventRef`.
3. **State resolution:** Each `MappedStep.mappedStateRef` MUST be the Graph `State` or
   `CompositeState` resolved from its `RuntimeEvent.stateRef` in the current scope or imported
   documents.
4. **Journey ownership:** The resolved event chain MUST be associated with the Graph `Journey`
   identified by `mappedJourneyRef`.
5. **Step order:** Mapping does not define a separate step order. Consumers MUST order mapped steps
   by applying Runtime chain reconstruction to each step's `mappedEventRef`.
6. **Origin classification:** The root event step is `origin`. It records the starting resolved
   state and is not considered a movement when computing aggregate `mappingStatus`.
7. **In-model classification:** A mapped step is `in-model` when the observed movement follows a
   Graph `Transition` in the mapped journey, including effective outgoing transitions contributed by
   `OutgoingTransitionGroup`.
8. **Jump classification:** A mapped step is `jump` when no effective Graph transition explains the
   observed movement.
9. **Composite and nested scope:** Composite or nested journeys MAY require explicit
   `mappedScopeRef` disambiguation when the same state identity could be interpreted in more than
   one active journey context. If `mappedScopeRef` is absent, it defaults to the `mappedJourneyRef`
   of the containing `JourneyMapping`.
10. **No intent assumption:** A jump classification reports that the observed movement is not
   explained by the mapped graph. It does not by itself decide whether the movement is legitimate or
   erroneous.

## Minimal Example

```json
{
  "@context": [
    "https://ujg.specs.openuji.org/ed/ns/context.jsonld",
    "https://ujg.specs.openuji.org/ed/ns/mapping.context.jsonld"
  ],
  "@id": "https://example.com/ujg/mapping/execution-12345.jsonld",
  "@type": "UJGDocument",
  "specVersion": "1.0",
  "nodes": [
    {
      "@id": "urn:mapping:execution-12345",
      "@type": "JourneyMapping",
      "mappedRuntimeRef": "urn:ujg:execution:12345",
      "mappedJourneyRef": "urn:ujg:journey:checkout",
      "mappedStepRef": [
        "urn:mapping:execution-12345:100",
        "urn:mapping:execution-12345:200",
        "urn:mapping:execution-12345:300"
      ],
      "mappingStatus": "in-model"
    },
    {
      "@id": "urn:mapping:execution-12345:100",
      "@type": "MappedStep",
      "mappedEventRef": "urn:ujg:event:12345:100",
      "mappedStateRef": "urn:ujg:state:cart",
      "stepStatus": "origin"
    },
    {
      "@id": "urn:mapping:execution-12345:200",
      "@type": "MappedStep",
      "mappedEventRef": "urn:ujg:event:12345:200",
      "mappedStateRef": "urn:ujg:state:payment",
      "stepStatus": "in-model",
      "explainedByTransitionRef": "urn:ujg:transition:cart-to-payment"
    },
    {
      "@id": "urn:mapping:execution-12345:300",
      "@type": "MappedStep",
      "mappedEventRef": "urn:ujg:event:12345:300",
      "mappedStateRef": "urn:ujg:state:confirmation",
      "stepStatus": "in-model",
      "explainedByTransitionRef": "urn:ujg:transition:payment-to-confirmation"
    }
  ]
}
```

This example states that the causal event chain for `urn:ujg:execution:12345` has been resolved
against the checkout journey and that each observed state movement follows the effective Graph model.

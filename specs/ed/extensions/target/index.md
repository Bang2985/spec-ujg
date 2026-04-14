**Title:** `org.openuji.specs.ujg.target.v1`

**Status:** incubating implementation extension for practical generator targeting carried in UJG Core `extensions`.

## Namespace

- Canonical namespace string: `org.openuji.specs.ujg.target.v1`
- Payload location: `extensions["org.openuji.specs.ujg.target.v1"]`
- Published JSON Schema: `https://ujg.specs.openuji.org/ed/ns/target.schema.json`

## Purpose

This extension tells generators what kinds of implementations should be produced without turning UJG
into a build, deployment, or infrastructure specification.

It exists to let producers state:

- which platform families are in scope,
- which stacks are preferred,
- which stacks are excluded,
- which deploy modes are intended,
- which capabilities are required.

The extension stays intentionally small and generator-practical.

## Scope

This extension covers:

- platform families,
- preferred stacks,
- excluded stacks,
- deploy modes,
- capability requirements.

It does not attempt to capture pipeline, packaging, or cloud configuration details.

## Non-goals

This extension does not standardize:

- build pipelines,
- Dockerfiles,
- CI workflows,
- repo structure,
- cloud-provider configuration,
- package-manager configuration.

## Primary Attachment Targets

- `Journey`
- `Template`
- `State`

`Journey` is the main host for application-wide generation intent. `Template` is useful when a
reusable shell only makes sense on particular target families. `State` is the main host for local
target narrowing or overrides.

## Secondary Attachment Targets

- `CompositeState` for subflow-specific target narrowing
- `Transition` for action-specific deployment or capability constraints

## Discouraged Or Disallowed Attachment Targets

- `OutgoingTransitionGroup` is discouraged because targeting usually applies to broader surfaces or
  flows than reusable outgoing edges.
- `Route` is discouraged because route data belongs in Routing.
- `MessageBundle` is disallowed in normal use.
- `UJGDocument` is disallowed because Core extensions are node-scoped.

## Inheritance Model

For state-level targeting, generators should apply inheritance in this order:

1. `Journey`
2. each enclosing `CompositeState`, from outermost to innermost
3. resolved `Template`, if target posture is deliberately attached there
4. the local `State`

For transition-level targeting, use:

1. `Journey`
2. enclosing `CompositeState`
3. source `State`
4. local `Transition`

## Precedence And Override Rules

For node-level targeting, use this precedence order:

1. `State`
2. `Template`
3. innermost `CompositeState`
4. outer `CompositeState`
5. `Journey`

For transition-level targeting, use:

1. `Transition`
2. source `State`
3. innermost `CompositeState`
4. outer `CompositeState`
5. `Journey`

Merge and replacement rules:

- `platformFamilies` and `preferredStacks` combine across inheritance with duplicate removal.
- `excludedStacks` combines cumulatively and always wins over `preferredStacks`.
- `deployModes` combines across inheritance with duplicate removal.
- `capabilityRequirements` combines cumulatively.
- a more specific host may narrow the inherited target space but should not widen it by silently
  ignoring inherited exclusions.

## Property Vocabulary

- `platformFamilies`: target platform families to consider. Expected shape: array of strings.
  Allowed categories: `web`, `native`, `cms`, `commerce`, `cli`, `headless`. Implementation intent:
  lets generators choose the broad output families that matter.
- `preferredStacks`: preferred implementation stacks. Expected shape: array of strings. Allowed
  categories: stack identifiers such as `nextjs`, `astro`, `drupal`, `typo3`, `magnolia`,
  `spryker`, `magento`, `expo`, `compose`, `flutter`, `docker-service`. Implementation intent:
  expresses preference without turning stack names into core semantics.
- `excludedStacks`: implementation stacks that should not be generated. Expected shape: array of
  strings. Allowed categories: the same generic stack identifier style as `preferredStacks`.
  Implementation intent: lets producers block unsuitable generators or deployment targets.
- `deployModes`: intended deploy modes. Expected shape: array of strings. Allowed categories:
  `local`, `hosted`, `hybrid`, `embedded`, `container`. Implementation intent: tells generators
  whether local CLI, hosted app, embedded shell, or container-friendly output is desired.
- `capabilityRequirements`: required generator or runtime capabilities. Expected shape: array of
  strings. Allowed categories: producer-defined capability names such as `offline-first`,
  `rich-authoring`, `background-jobs`, `payment-capture`, `server-rendering`. Implementation intent:
  filters target choices by capability instead of by stack name alone.

## Recommended Controlled Values

Recommended `platformFamilies` values:

- `web`
- `native`
- `cms`
- `commerce`
- `cli`
- `headless`

Recommended `deployModes` values:

- `local`
- `hosted`
- `hybrid`
- `embedded`
- `container`

## Processing Model

A generator implementing this extension should:

1. Resolve the effective target payload using the inheritance and precedence rules above.
2. Select the candidate platform families from `platformFamilies`.
3. Filter candidates using `excludedStacks` and `capabilityRequirements`.
4. Rank remaining candidates using `preferredStacks` and supported `deployModes`.
5. Combine the resulting target posture with Graph behavior, Templates, Routing, and L10n when
   materializing the final implementation.

This extension should help generators decide what to generate. It should not become a substitute for
pipeline or infrastructure configuration.

## Cross-Stack Interpretation Notes

- Web: steer output toward Next.js, Astro, or comparable web stacks.
- Native: steer output toward Expo, Compose, Flutter, or comparable native stacks.
- CMS: steer output toward Drupal, TYPO3, Magnolia, or comparable editorial stacks.
- Commerce: steer output toward Spryker, Magento-like, or comparable commerce adapters.
- CLI or headless or background: steer output toward command-line tools, local services, or
  containerized headless runtimes.

## Published JSON Schema

The published schema for this extension is defined below and is published at
`https://ujg.specs.openuji.org/ed/ns/target.schema.json`.

:::include ./target.schema.json :::

## Minimal Example Payload

```json
{
  "@id": "urn:journey:checkout",
  "@type": "Journey",
  "extensions": {
    "org.openuji.specs.ujg.target.v1": {
      "platformFamilies": ["web", "native", "commerce", "cli"],
      "preferredStacks": ["nextjs", "expo", "spryker", "docker-service"],
      "excludedStacks": ["typo3"],
      "deployModes": ["hosted", "hybrid", "container"],
      "capabilityRequirements": ["payment-capture", "background-jobs"]
    }
  }
}
```

## Graduation Guidance

Thin parts that may later graduate into optional modules or shared references include:

- a target-family reference,
- a deploy-mode reference,
- a capability reference.

The following should remain extension-only:

- stack preference and exclusion lists,
- combined target narrowing logic,
- generator-facing capability filtering.

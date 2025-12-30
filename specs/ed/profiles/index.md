**Goal:** define *interoperability* when not everyone implements everything, and make extensions safe across tools.

### This module SHOULD define (normative)

* **Profiles**: named capability sets (e.g., `design-core`, `design-composition`, `runtime-basic`, `runtime-aligned`, `observed-aligned`).
* **Profile declaration**: how a producer/emitter/consumer declares supported profiles (document-level field vs out-of-band).
* **Extension interoperability rules**:
  * what "namespaced" means (URI-like vs compact prefix registry),
  * collision handling,
  * versioning expectations for extension vocabularies,
  * pass-through requirements for stores/proxies.
* **Profile conformance** rules:
  * what it means to "conform to profile X",
  * required keys/behaviors per profile,
  * how a consumer should degrade gracefully when profile data is missing.

### This module SHOULD define (informative)

* Recommended starter profile set for TR v1.
* Patterns for vendor modules (e.g., UI presentation, experimentation, privacy).
* Examples: same Journey expressed with/without optional profile features.

### Decisions to make

* Do profiles live **inside** the JSON payload (e.g., `profiles: ["..."]`) or **outside** (HTTP header, metadata)?
* Do you want a formal prefix registry for compact namespaces, or just "SHOULD be URI-like"?

### Must-align with

* Serialization (`extensions` mechanics)
* Conformance module (profile conformance hooks)

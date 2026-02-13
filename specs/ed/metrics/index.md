**Goal:** define a minimal shared vocabulary for metrics keys, units, and attachment points.

### Normatives to evaluate

* Core metric keys and meanings (counts, probabilities, durations)
* Units conventions (e.g., `Ms` suffix, rates 0..1)
* Extension metric naming (namespaced keys)

### Informatives to evaluate

* Aggregation guidance (sum counts, recompute rates, percentile strategies)
* Example metric payloads on observed state/transition objects

### Decisions to make

* Which metrics are core vs profile-defined?
* Do you standardize histograms/sketches now or defer?

### Must-align with
* [[UJG Mapping]] aggregation
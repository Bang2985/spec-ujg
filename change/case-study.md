# Case Study Boilerplate Spec

## Target

Create a new case study page at:

`/case-studies/generative-software-development`

Title:

# Guiding and Evaluating Generative Software with User Journey Semantics: A Cross-Model Case Study

Subtitle / lead:

> This case study explores whether the same explicit User Journey Graph semantics can guide different generative AI models toward an intended interaction scope and subsequently provide a common semantic reference for evaluating the resulting implementations.

Mark the page clearly as:

**Exploratory case study — non-normative**

The page should be designed so that experimental results can be added incrementally without restructuring the document.

---

# 1. Motivation

Introduce UJG independently of generative AI.

Core statement:

> User Journey Graph aims to provide a shared semantic source of truth for intended user journeys across product, design, engineering, testing, and related disciplines.

Explain that generative software development provides a useful test case because different AI systems may materialize the same product intent differently.

Introduce the central experiment:

> If several generative models receive the same intended journey, can UJG preserve a common interaction scope across those implementations and later provide a shared reference for evaluating them?

---

# 2. Research Questions

Create three research questions.

## RQ1 — Guidance

**Can UJG semantics guide different generative models toward the same intended interaction scope?**

## RQ2 — Conformance

**How closely do the resulting implementations conform to the specified user journey?**

## RQ3 — Model Independence

**Are the effects of UJG grounding observable across different model families and generated implementations?**

---

# 3. Case Study Scenario

Create placeholders for the concrete application being generated.

Include:

* Product / application description
* Target user
* User goal
* Intended outcome
* Starting state
* Expected journey
* Required interaction behavior
* Intentionally unspecified implementation details

Explicitly distinguish:

### Specified by UJG

Examples:

* journey structure
* relevant states
* transitions
* actions
* conditions
* outcomes
* semantic identifiers

### Left open to the generative model

Examples:

* visual design
* layout
* component selection
* framework-specific implementation
* internal architecture
* styling
* interaction details not constrained by the journey

Include the statement:

> The experiment does not expect different models to produce identical interfaces. The hypothesis is that different materializations can still preserve the same intended journey semantics.

---

# 4. UJG Journey Model

Provide an area for displaying the journey used in the experiment.

Include:

## 4.1 Journey Overview

Placeholder for visual journey graph.

## 4.2 States

Placeholder table.

Suggested columns:

| ID | State | Purpose | Required |
| -- | ----- | ------- | -------- |

## 4.3 Transitions

Placeholder table.

Suggested columns:

| ID | From | Action / Condition | To | Required |
| -- | ---- | ------------------ | -- | -------- |

## 4.4 Outcomes

Placeholder for expected journey outcome or outcomes.

## 4.5 Semantic Identity

Explain that UJG identifiers are intended to provide stable references across:

`journey definition → generation → implementation → execution → evaluation`

---

# 5. Experimental Setup

## 5.1 Models

Create a configurable table.

Initial candidate models:

| Model                      | Exact Version | Provider / Environment | Date |
| -------------------------- | ------------- | ---------------------- | ---- |
| Codex                      | TBD           | OpenAI                 | TBD  |
| Claude                     | TBD           | Anthropic              | TBD  |
| Qwen                       | TBD           | TBD                    | TBD  |
| Gemini Flash / Antigravity | TBD           | Google                 | TBD  |

Do not hard-code the list so additional models can be added.

Exact model versions should be recorded whenever available.

---

## 5.2 Experimental Conditions

Support two primary conditions.

### Condition A — Prompt-Based Baseline

The model receives:

* application brief
* natural-language description of expected behavior
* development environment

It does not receive the structured UJG journey model as generation context.

### Condition B — UJG-Grounded Generation

The model receives the same application task together with the explicit UJG journey semantics.

The intention is to test whether structured journey grounding changes the generated interaction.

No iterative correction or validation feedback loop is part of this case study.

---

## 5.3 Controlled Inputs

Document which elements should remain as consistent as practically possible across runs:

* application brief
* expected user outcome
* source repository / starting state
* development environment
* supporting assets
* generation task
* available tools
* generation time / iteration limits where applicable

---

# 6. Evaluation Method

State clearly that evaluation is currently:

**LLM-assisted semantic evaluation**

The evaluator should assess each implementation using the same UJG journey model as semantic reference.

The evaluator is not considered ground truth.

Its purpose is to produce consistent, inspectable metrics and observations that can later be complemented by human evaluation.

Document:

* evaluator model
* evaluator version
* evaluator skill / prompt version
* evaluation date
* input artifacts
* output schema

---

# 7. Evaluation Metrics

Implement a reusable result schema for the following metrics.

## 7.1 Journey Coverage

Measures how much of the expected journey is represented by the implementation.

Potential values:

* required states covered
* total required states
* required transitions covered
* total required transitions
* normalized coverage score

---

## 7.2 Outcome Reachability

Whether the intended user outcome can be reached through the generated interaction.

Possible representation:

* `reachable`
* `partially-reachable`
* `not-reachable`
* `uncertain`

---

## 7.3 Interaction Conformance

Measures whether the implementation follows the intended journey topology and semantics.

Allow:

* numeric score
* structured findings
* explanation

---

## 7.4 Semantic Traceability

Measures whether implementation elements, behaviors, or observations can be associated with UJG semantic identifiers.

Potential outputs:

* referenced IDs
* missing IDs
* invalid references
* traceability score

---

## 7.5 Unexpected Interaction

Identify meaningful states, transitions, or paths introduced outside the specified interaction scope.

Record:

* unexpected behavior
* severity
* affected journey state
* evaluator explanation

---

## 7.6 Evaluation Confidence

Allow the evaluator to explicitly represent uncertainty.

Suggested values:

* high
* medium
* low

Do not force uncertain observations into definitive pass/fail results.

---

# 8. Results

Prepare result components but populate them initially with `TBD`.

## 8.1 Cross-Model Summary

Create a comparison table:

| Model | Condition | Journey Coverage | Outcome Reachable | Conformance | Traceability | Unexpected Paths |
| ----- | --------- | ---------------: | ----------------- | ----------: | -----------: | ---------------: |
| TBD   | TBD       |              TBD | TBD               |         TBD |          TBD |              TBD |

---

## 8.2 Per-Model Results

Create one reusable section per model.

Structure:

### Model Name

**Condition:**
**Model version:**
**Generation date:**
**Generated implementation:** link / artifact

#### Evaluation Summary

#### Journey Coverage

#### Outcome Reachability

#### Conformance Findings

#### Semantic Traceability

#### Unexpected Behavior

#### Evaluator Confidence

#### Notes

---

# 9. Cross-Model Observations

Create placeholders for qualitative findings.

Use these subsections:

## 9.1 Common Behavior Across Models

## 9.2 Differences Between Implementations

## 9.3 Effects Observed with UJG Grounding

## 9.4 Interaction Decisions Left Open by UJG

## 9.5 Cases Where UJG Was Insufficient

Avoid ranking models unless the evidence genuinely supports such a conclusion.

The goal is not to create a model leaderboard.

---

# 10. Prompt-Based vs UJG-Grounded Comparison

If both conditions are available, provide a direct comparison.

Suggested structure:

| Dimension                  | Prompt-Based            | UJG-Grounded              |
| -------------------------- | ----------------------- | ------------------------- |
| Interaction intent         | Mostly natural language | Explicit semantic journey |
| Journey structure          | Inferred                | Explicit                  |
| Stable semantic references | None / ad hoc           | UJG identifiers           |
| Evaluation reference       | Reconstructed afterward | Same journey model        |
| Journey traceability       | TBD                     | TBD                       |
| Conformance                | TBD                     | TBD                       |

Do not pre-fill claims about superior performance.

Results must come from the experiment.

---

# 11. Findings for the UJG Specification

This section should focus on what the experiment teaches about UJG itself.

Create subsections:

## 11.1 Missing Semantics

## 11.2 Ambiguous Semantics

## 11.3 Over-Specified Interaction

## 11.4 Under-Specified Interaction

## 11.5 Identity Propagation

## 11.6 Generation-Specific Requirements

## 11.7 Evaluation-Specific Requirements

Findings in this section may later result in UJG specification changes or extensions.

---

# 12. Limitations

Pre-populate the section with the following limitations:

* This is an exploratory case study.
* The study uses a limited number of application scenarios.
* The number of generation runs is limited.
* Model behavior may change between versions.
* The evaluator is itself LLM-based.
* Evaluator output should not be treated as objective ground truth.
* No independent human usability study is currently included.
* No statistical claim of general superiority is made.
* No iterative generation–validation–repair loop is included in this first study.

---

# 13. Future Work

Include the following primary follow-up experiment:

## Closed-Loop Generation

Future work may explore:

`UJG → Generate → Evaluate → Repair → Re-evaluate`

The evaluation output could become structured feedback for the generative system.

Possible research question:

> Can UJG provide not only generation context and evaluation semantics, but also support iterative correction toward journey conformance?

Additional future work:

* repeated runs per model
* more application domains
* independent human evaluation
* evaluator comparison
* larger journey graphs
* agentic interaction
* runtime evidence integration
* statistical evaluation

---

# 14. Reproducibility Artifacts

Prepare links/placeholders for:

* UJG journey source
* application brief
* baseline prompt
* UJG-grounded prompt
* model-specific instructions
* generated repositories
* deployed applications
* evaluator skill
* evaluator prompts
* raw evaluation output
* normalized metrics
* screenshots / recordings
* experiment metadata

---

# 15. Central Diagram

Add a placeholder for a diagram expressing:

```text
                    UJG Journey
                         │
              shared interaction scope
                         │
        ┌────────────────┼────────────────┐
        │                │                │
      Codex           Claude           Qwen        ...
        │                │                │
        ▼                ▼                ▼
   Implementation   Implementation   Implementation
        │                │                │
        └────────────────┼────────────────┘
                         │
                  UJG-based evaluator
                         │
                         ▼
                Comparable findings
```

The central message should be:

> One semantic journey can have multiple valid materializations while still providing a common basis for evaluation.

---

# 16. Status

Add visible experiment status metadata near the top of the page.

Suggested values:

* `Planned`
* `Running`
* `Partial Results`
* `Completed`

Initial status:

**Running**

Also display:

* Last updated
* Case study version
* UJG version
* Experiment repository if available

---

# Implementation Requirements

The page should:

* follow the existing UJG specification visual language
* clearly distinguish normative specification content from non-normative case-study material
* support tables and diagrams
* support expandable raw experiment artifacts where appropriate
* allow new models and experiment runs to be added without restructuring the page
* avoid hard-coded result claims before experiments are complete
* use `TBD` or explicit placeholders instead of invented values
* link semantic IDs back to relevant UJG concepts where practical
* remain readable as both a research case study and technical implementation report

Do not implement a generation–validation–repair loop in this first case study.

The first milestone is the complete page structure, experiment metadata schema, result placeholders, and reusable per-model evaluation sections.

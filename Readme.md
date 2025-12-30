# User Journey Graph (UJG) Specification

The User Journey Graph (UJG) specification family defines a vocabulary and data model for describing user journeys as automata-like graphs. It separates design-time journey definitions from runtime journey executions and observations to support both experience design and measurement.

**This is the monorepo for the UJG specification and its associated documentation tools.**

## 📚 Documentation

- **[Editor's Draft (ED)](./specs/ed/overview/index.md)**: The current working draft of the specification.
- **[Governance](./specs/governance.md)**: How decisions are made and how the project is managed.
- **[Contributing](./specs/contribution.md)**: Guidelines for contributing code, examples, or spec text.

## 📂 Repository Structure

- **[`specs/`](./specs/)**: Contains the source markdown files for the specifications.
  - **[`ed/`](./specs/ed/)**: The Editor's Draft workspace.
  - **[`v1/`](./specs/v1/)**: (Future) Stable version snapshots.
- **[`apps/web/`](./apps/web/)**: The Astro-based documentation website that renders the specifications.

## 🚀 Getting Started

To run the documentation site locally:

1.  **Install dependencies**:
    ```bash
    pnpm install
    ```

2.  **Run the development server**:
    ```bash
    pnpm dev
    ```
    This will start the website at `http://localhost:4321` (or similar).

## 🧩 Modules Overview

The specification is modularized as follows:

```
Overview
  (no normative deps)

Serialization
├─ Core
│  ├─ Structure            (adds organization metadata over Core ids)
│  └─ Runtime              (uses Core ids; follows Serialization timestamps/refs)
│     ├─ Conformance        (compares Runtime ↔ Core; uses Runtime rules)
│     └─ Observed           (aggregates Runtime; optionally aligns to Core)
│        └─ Metrics         (metric keys/units used in Observed artifacts)
└─ Profiles & Extensibility (uses Serialization extension mechanics; defines interoperability profiles)
```



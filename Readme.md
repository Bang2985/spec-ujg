# User Journey Graph (UJG) Specification

The User Journey Graph (UJG) specification family defines a vocabulary and data model for describing user journeys as automata-like graphs. It separates design-time journey definitions from runtime journey executions and observations to support both experience design and measurement.

## Community Group

The [UJG Community Group](https://www.w3.org/community/ujg/) is a forum for discussing the User Journey Graph specification and related topics. It is open to all interested parties and is a place for discussion and collaboration on the specification and related topics. Join the Community Group to get involved in the specification development process.

**This is the monorepo for the UJG specification and its associated documentation tools.**

## 📚 Documentation

- **[Editor's Draft (ED)](./specs/ed/overview/index.md)**: The current working draft of the specification.
- **[Governance](./specs/governance.md)**: How decisions are made and how the project is managed.
- **[Contributing](./specs/contribution.md)**: Guidelines for contributing code, examples, or spec text.

## 📂 Repository Structure

- **[`specs/`](./specs/)**: Contains the source markdown files for the specifications.
  - **[`ed/`](./specs/ed/)**: The Editor's Draft workspace.
  - **`tr/`**: (Future) immutable Technical Report snapshots for community experimentation.
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
├─ Designed
│  ├─ Structure            (adds organization metadata over Designed ids)
│  └─ Runtime              (uses Designed ids; follows Serialization timestamps/refs)
│     └─ Observed           (aggregates Runtime; optionally aligns to Designed)
│        └─ Metrics         (metric keys/units used in Observed artifacts)
└─ Profiles & Extensibility (uses Serialization extension mechanics; defines interoperability profiles)
```

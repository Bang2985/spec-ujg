# Contribution Essentials

We welcome spec text, examples, schemas, and tooling. Focus your efforts on the **Editor’s Draft (`/ed/`)** rather than frozen snapshots.

### The Workflow

1. **Issue First:** File a "Problem Statement" before coding.
2. **Pull Request:** Reference the issue, update schemas/examples, and keep commits clean.
3. **Stability Check:** Avoid breaking changes in **Stable** modules; feel free to iterate heavily in **Incubating** ones.

### Writing Rules

* **RFC 2119 Language:** Use **MUST**, **SHOULD**, and **MAY** strictly for normative requirements.
* **Keep Core Lean:** Only include essential fields; layer everything else via modules.
* **Consistency:** Use one name per concept. If you rename something, document the alias.

### Quality Standards

* **Examples:** Treat them as test fixtures. They must be internally consistent and PII-free.
* **Schema Alignment:** If spec text and schema disagree, the **text wins**.
* **Privacy:** No real user data. Always prefer synthetic, anonymized identifiers.

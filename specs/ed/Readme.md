```
Overview
  (no normative deps)

Serialization
├─ Designed
│  ├─ Structure            (adds organization metadata over Designed ids)
│  └─ Runtime              (uses Designed ids; follows Serialization timestamps/refs)
│     ├─ Conformance        (compares Runtime ↔ Designed; uses Runtime rules)
│     └─ Observed           (aggregates Runtime; optionally aligns to Designed)
│        └─ Metrics         (metric keys/units used in Observed artifacts)
└─ Profiles & Extensibility (uses Serialization extension mechanics; defines interoperability profiles)
```


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
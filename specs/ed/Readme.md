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
└─ Profiles & Optional Modules (includes `modules/*` optional vocabularies; opaque extensions stay private)
```

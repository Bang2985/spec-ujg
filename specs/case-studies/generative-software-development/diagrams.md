```txt
                    workshop detail entry
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
 already registered   already waitlisted   no participation
          │                 │                 │
          ▼                 ▼                 ▼
 workshop-already-   workshop-already-      availability
    registered          waitlisted             │
          │                 │             ┌────┼────┐
          │                 │             ▼    ▼    ▼
          │                 │           reg   wait closed
          │                 │           open  open
          │                 │
      no CTA            no CTA

```


registration review:
```txt
registration-review
       │
       │ confirm
       ▼
  evaluate current state
       │
       ├─ already registered
       │      ↓
       │ registration-already-confirmed
       │      no Effect
       │
       └─ not registered + place available
              ↓
         registration-confirmed
              +
         confirm-registration Effect
```


composition:
txt```
Journey
   │
   └── CompositeState
           │
           ├── Child Journey A
           │       ├── states...
           │       └── transitions...
           │
           └── Child Journey B
                   ├── states...
                   └── transitions...
```

graphql intrgration topic:

ujg 
txt```
Purchase Journey

├── Cart
│
├── Checkout [CompositeState]
│     │
│     ├── Shipping Journey
│     │      ├── Address
│     │      └── Delivery Method
│     │
│     └── Payment Journey
│            ├── Payment Method
│            └── Authorization
│
└── Receipt
````

query
txt```
query {
  journey(id: "urn:ujg:journey:purchase") {
    id
    label

    states {
      id
      label
      __typename

      ... on CompositeState {
        subjourneys {
          id
          label

          states {
            id
            label
            __typename
          }
        }
      }
    }
  }
}
```
# CR-73 Biblical Timeline Architecture Design

## Purpose and Scope

The Biblical Timeline is a Scripture-first chronology layer for Word Covenant Ministry. Its purpose is to help readers place passages, people, events, kingdoms, and historical references in context without replacing the biblical text or collapsing Scripture into generic chronology.

It should eventually connect:

- Scripture passages
- Major Biblical People
- Major Biblical Events
- Covenantal periods
- Kingdoms and empires
- World history references
- Cross references
- Gospel harmony events
- Scripture Research Workspace context

CR-73 is design only. It does not authorize schema, API, import, database, migration, frontend component, backend, or runtime work.

## Authority and Interpretation Order

The timeline must preserve a clear authority order:

```txt
Scripture Anchor
-> Internal Biblical Sequence
-> Curated Biblical Event
-> Traditional / Scholarly Dating
-> External Historical Synchronism
-> World History Overlay
```

Interpretation rules:

- Scripture is primary.
- World history is supplementary.
- Historical chronology must not override biblical textual logic.
- Timeline presentation must not force certainty where Scripture or history requires caution.

## Conceptual Entity Model

This phase describes conceptual entities only. It does not define final database fields.

Potential conceptual entities:

- Timeline Event
- Timeline Period
- Biblical Person
- Biblical Event
- Historical Event
- Kingdom / Empire
- Location
- Scripture Anchor
- Historical Anchor
- Confidence / Dating Note
- Source / Research Note
- Harmony Link
- Cross Reference Link

Entity distinctions:

- Biblical Event: an event identified from Scripture.
- Historical Event: an external historical reference, synchronism, reign, empire movement, or world-history marker.

## Dating Model

The timeline should support safe dating modes:

- Exact date
- Approximate date
- Date range
- Relative sequence
- Before / after relationship
- Unknown date
- Traditional dating
- Scholarly dating
- Internal biblical sequence

To avoid overclaiming certainty, every timeline item should keep these layers separate:

- biblical anchor
- proposed chronology
- confidence level
- source basis
- dating note

This lets the UI show uncertainty instead of hiding it behind a single date field.

## Scripture-First Anchoring

Timeline items should be born from passages or passage clusters. External chronology may enrich an event, but it must not create the biblical event identity.

Working principles:

- Timeline items should be born from passages or passage clusters.
- External chronology may enrich but must not create biblical event identity.
- Dating uncertainty must remain visible.
- Events should attach to Scripture before attaching to world history.

## Relationship With Cross Reference

Cross Reference remains a separate reference-only system.

Rules:

- Cross Reference rows must not be overloaded as timeline events.
- Cross Reference relationships may suggest study connections, echoes, quotations, fulfillment, themes, or related passages.
- Automatic event generation from Cross Reference data is not approved.

Timeline may later consume Cross Reference data as one signal, but Cross Reference should remain a passage-relationship layer.

## Relationship With Gospel Harmony

Gospel Harmony remains event/pericope-based and reference-only.

Rules:

- Harmony units may later become timeline event candidates.
- Timeline must link to Harmony units without taking over Gospel Harmony modeling.
- No harmony schema, API, or import change is authorized by CR-73.

Gospel Harmony should stay focused on Gospel parallel study while the timeline layer uses Harmony as one possible event bridge.

## Relationship With Scripture Research Workspace

Timeline should eventually fit the Reader-centered Scripture Research Workspace.

Possible future context types:

- active timeline event
- selected biblical period
- selected person
- selected kingdom/empire
- selected historical layer
- scripture-linked event cluster

CR-73 does not implement context provider changes. It only reserves the design space for future workspace integration.

## UI/UX Conceptual Direction

Design only.

Possible future views:

- Scripture timeline
- Person timeline
- Event timeline
- Kingdom / Empire timeline
- Gospel timeline
- World-history overlay
- Research workspace side-panel integration

Design rules:

- Scripture timeline is the default.
- Gospel timeline is a focused view.
- World-history overlay is optional.
- Bible text remains primary.
- Mobile should use stepwise drill-down instead of dense multi-column chronology.
- The UI should feel like study tooling, not a decorative history chart.

### Recommended First Page Layout Concept

Biblical Timeline Page

```txt
Header
Biblical Timeline
Scripture-first chronology

Tabs
Scripture Timeline | Person Timeline | Event Timeline | Gospel Timeline | Kingdoms / Empires

Main layout
Left: vertical timeline
Right: selected event Scripture Context panel
```

Selected event panel should include:

- event title
- Scripture Anchor
- internal biblical sequence
- related passages
- dating note
- confidence
- Open in Reader
- possible Harmony / Cross Reference links

Mobile layout should be:

- Event list -> event detail drawer

No UI components are created in this phase.

## Data Source and Import Boundaries

CR-73 imports no data.

Future source categories:

- Internal Scripture data
- Manually curated biblical events
- Gospel harmony data
- Cross-reference data
- Public-domain historical chronology
- Later verified source packages

Every future source class must require:

- provenance
- review status
- confidence

## Phased Roadmap

Recommended sequence:

```txt
CR-73: Biblical Timeline Architecture Design
CR-74: Biblical Timeline Architecture Approval Review
CR-75: Biblical Timeline Conceptual Data Model Design
CR-76: Scripture-Anchored Timeline MVP Design
CR-77: Timeline MVP Implementation Approval Review
CR-78: Scripture-Anchored Timeline MVP Implementation
CR-79: Gospel Harmony Timeline Integration Design
CR-80: Kingdoms / Empires Layer Design
CR-81: World History Overlay Design
CR-82: Research Workspace Timeline Integration Design
```

If later roadmap numbering conflicts with an existing CR sequence, keep the numbering flexible while preserving the conceptual order.

## Risks and Constraints

Key risks:

- Chronology uncertainty
- Over-systematizing Scripture
- Mixing biblical and secular authority
- Premature schema design
- Importing unverified data
- UI complexity
- Theological interpretation boundaries
- Scope creep
- Performance risk
- Confusing curated biblical events with external historical claims

## Non-Scope

CR-73 does not authorize:

- schema
- migrations
- API
- database writes
- imports
- frontend components
- backend code
- Cross Reference behavior changes
- Gospel Harmony behavior changes
- Research Workspace context provider changes
- world history dataset acquisition
- generated timeline data

## Recommended Next Step

Proceed to CR-74 Biblical Timeline Architecture Approval Review before any conceptual data model or implementation work.

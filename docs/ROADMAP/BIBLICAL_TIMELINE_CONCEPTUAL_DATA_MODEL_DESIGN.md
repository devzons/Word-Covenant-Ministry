# CR-75 Biblical Timeline Conceptual Data Model Design

## Purpose

CR-75 translates the approved CR-73 Biblical Timeline architecture into a conceptual model that can guide later design phases.

This model is not a schema and does not authorize implementation.

## Authority Order

The conceptual model preserves the approved authority order:

```txt
Scripture Anchor
-> Internal Biblical Sequence
-> Curated Biblical Event
-> Traditional / Scholarly Dating
-> External Historical Synchronism
-> World History Overlay
```

All conceptual entities must preserve Scripture-first authority.

## Conceptual Model Overview

This model is a set of reviewed, Scripture-anchored concepts rather than an implementation-ready database design.

Primary conceptual groups:

- Scripture Anchors
- Timeline Events
- Timeline Periods
- Biblical People
- Biblical Events
- Historical Events
- Kingdoms / Empires
- Locations
- Dating Claims
- Confidence Notes
- Source / Research Notes
- Harmony Links
- Cross Reference Links

## Core Conceptual Entities

### Scripture Anchor

Purpose:
Grounds every timeline item in one or more Bible references.

Rules:

- Must be primary.
- Must not store copied Bible text.
- Should point to canonical references.
- Bible text should be loaded later from existing Bible APIs if needed.

### Timeline Event

Purpose:
A timeline-facing event unit.

Rules:

- Must be grounded in Scripture Anchor.
- May connect to Biblical Event, Person, Period, Location, Kingdom/Empire, Harmony Link, or Cross Reference Link.
- Must not be automatically generated from Cross Reference rows.
- Must not be defined by external chronology alone.

### Biblical Event

Purpose:
An event identified from Scripture.

Rules:

- Scripture creates the event identity.
- External history may enrich but not define it.
- Can have multiple Scripture Anchors.

### Historical Event

Purpose:
An external historical reference, synchronism, reign, empire movement, or world-history marker.

Rules:

- Supplementary only.
- Must not override Scripture.
- Must carry source and confidence notes.
- Should be visually separated from Biblical Events in later UI.

### Timeline Period

Purpose:
A broader span for grouping events.

Examples:

- Creation / Primeval History
- Patriarchal Period
- Exodus / Wilderness
- Conquest
- Judges
- United Monarchy
- Divided Kingdom
- Exile
- Return / Second Temple
- Gospel Period
- Apostolic Period

Rules:

- May be ordered by biblical sequence even when exact dates are uncertain.
- Should not force disputed dates.

### Biblical Person

Purpose:
A curated identity for a person in Scripture.

Rules:

- Not just a name string.
- May connect to events, passages, locations, periods, and related people.
- Should distinguish ambiguous names later through curation.

### Kingdom / Empire

Purpose:
A political-historical layer.

Examples:

- Egypt
- Assyria
- Babylon
- Persia
- Greece
- Rome

Rules:

- Supplementary to Scripture.
- May provide context for biblical periods/events.
- Must not dominate the default timeline view.

### Location

Purpose:
A place associated with passages, people, or events.

Rules:

- May be approximate.
- Must support uncertainty.
- Should not require modern geopolitical precision.

### Dating Claim

Purpose:
A conceptual representation of proposed chronology.

Modes:

- exact date
- approximate date
- date range
- relative sequence
- before / after relationship
- unknown date
- traditional dating
- scholarly dating
- internal biblical sequence

Rules:

- Dating claim must be separate from event identity.
- A biblical event may exist without a precise date.
- Multiple dating claims may exist for one event if clearly labeled.

### Confidence / Dating Note

Purpose:
Explains certainty and caution.

Rules:

- Must distinguish confidence in the biblical event from confidence in external dating.
- Should allow “Scripture anchor high / external date approximate” style language.
- Must avoid overclaiming.

### Source / Research Note

Purpose:
Records provenance and curation basis.

Rules:

- Required before any future external history layer.
- Should identify whether the basis is Scripture, internal curation, public-domain source, scholarly reference, or later approved package.
- Must not include raw copyrighted data.

### Harmony Link

Purpose:
Links timeline concepts to Gospel Harmony units.

Rules:

- Harmony remains event/pericope-based and reference-only.
- Harmony units may become event candidates later.
- Timeline must not take over Gospel Harmony modeling.

### Cross Reference Link

Purpose:
Links timeline concepts to related passages or study relationships.

Rules:

- Cross Reference remains reference-only.
- Cross Reference rows must not become timeline events.
- Automatic event generation from Cross Reference data is not approved.

## Conceptual Relationships

The model supports these conceptual relationships:

- Scripture Anchor grounds Timeline Event.
- Timeline Event may represent or point to Biblical Event.
- Timeline Event may belong to Timeline Period.
- Biblical Person may participate in Timeline Event.
- Location may be associated with Timeline Event.
- Kingdom / Empire may provide historical context for Timeline Period or Event.
- Historical Event may synchronize with Timeline Event but must remain supplementary.
- Harmony Link may connect a Gospel event to a Timeline Event candidate.
- Cross Reference Link may show related passages but must not create events automatically.
- Dating Claim describes proposed chronology but does not define event identity.

These are conceptual relationships only and do not imply implementation cardinality.

## Dating and Confidence Model

The model keeps separate:

- event identity
- Scripture anchor
- internal biblical sequence
- proposed date
- dating mode
- confidence
- source basis
- dating note

Examples:

Example 1:

- Biblical Event: Abraham called
- Scripture Anchor: Genesis 12:1-9
- Dating: approximate / traditional
- Confidence: Scripture event high, external date approximate

Example 2:

- Biblical Event: Crucifixion
- Scripture Anchor: Gospel passion passages
- Dating: historically discussed exact-year proposals
- Confidence: Scripture event high, exact external date requires dating note

Example 3:

- Historical Event: Babylonian conquest background
- Scripture Anchor: related prophetic/historical passages
- Dating: external historical synchronism
- Confidence: external source dependent

## Boundary Between Biblical Event and Historical Event

Biblical Event:

- Identified from Scripture.
- Carries Scripture Anchor.
- Belongs to biblical narrative and theological context.

Historical Event:

- Identified from external historical chronology.
- May help explain context.
- Does not create or control biblical meaning.

This distinction should remain visible in later design and UI work.

## Cross Reference and Gospel Harmony Boundaries

- Cross Reference does not generate events automatically.
- Gospel Harmony does not become Timeline schema.
- Timeline can link to them later, but only through curated concepts.

## Research Workspace Compatibility

The conceptual model supports future workspace context.

Future context may include:

- activeTimelineEvent
- selectedTimelinePeriod
- selectedBiblicalPerson
- selectedKingdomEmpire
- selectedHistoricalLayer
- selectedEventCluster

CR-75 does not implement context provider changes.

## UI Implications From The Model

The model supports future UI such as:

- Vertical Scripture-first event list
- Selected event detail panel
- Scripture Anchor first
- Dating Note visible
- Confidence visible
- World History Overlay optional
- Biblical Event and Historical Event visually distinguished
- Open in Reader link based on Scripture Anchor
- Harmony and Cross Reference links as secondary study aids

No components are created in this phase.

## Data Source Boundaries

CR-75 imports no data.

No world history dataset acquisition is authorized.

No generated timeline data is authorized.

Future source packages must be reviewed separately.

Source provenance and confidence are mandatory for future historical layers.

## Non-Scope

CR-75 does not authorize:

- schema
- final DB fields
- migrations
- API
- DB writes
- imports
- seeders
- frontend components
- backend code
- runtime behavior
- generated timeline data
- automatic entity extraction
- automatic event generation from Cross Reference
- automatic people/place extraction
- external chronology source acquisition

## Recommended Next Step

Recommend:

CR-76 — Biblical Timeline Conceptual Data Model Approval Review

If the project wants an additional approval gate before MVP design, keep this step first. Otherwise, the safest follow-on design phase is the MVP design sequence after review.

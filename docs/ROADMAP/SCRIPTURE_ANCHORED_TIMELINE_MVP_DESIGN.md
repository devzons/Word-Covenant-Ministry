# CR-77 Scripture-Anchored Timeline MVP Design

## Purpose

CR-77 defines the first safe MVP shape for a Scripture-anchored Biblical Timeline.

The MVP should answer:

- What does the first timeline page show?
- What does it not show yet?
- How does it keep Scripture primary?
- How does it avoid premature schema, API, or import work?

This is design only. It does not authorize implementation.

## MVP Principle

The first MVP should be a manually curated, Scripture-anchored design target, not an automated chronology engine.

It should prioritize:

- Scripture Anchor first
- event title second
- internal biblical sequence third
- dating note and confidence visible
- external or world-history context hidden or deferred by default

## Authority Order

The MVP preserves this authority order:

```txt
Scripture Anchor
-> Internal Biblical Sequence
-> Curated Biblical Event
-> Traditional / Scholarly Dating
-> External Historical Synchronism
-> World History Overlay
```

This order controls the MVP UI and future data rules.

## MVP Entry Route Concept

Possible future route:

- `/[locale]/timeline`
- `/[locale]/biblical-timeline`

Safer default:

`/[locale]/timeline`

Reason:

- Short
- locale-aware
- broad enough for future subviews

Do not implement the route in CR-77.

## MVP Default View

The default view is:

Scripture Timeline

It should show a vertical Scripture-first timeline.

Default timeline item display:

- period label
- event title
- Scripture Anchor
- internal sequence note if needed
- confidence badge
- dating note summary
- Open in Reader action

World History Overlay should be off by default.

## First MVP Scope

The initial scope should stay small and manual:

- Static/manual curated design target
- Limited number of sample event concepts for design planning only
- Scripture Anchors only
- No external chronology required
- No world history overlay
- No automated entity extraction
- No automatic Cross Reference event creation
- No Gospel Harmony import
- No generated timeline dataset

Suggested first biblical period for eventual MVP:

- Genesis 1-11
- Matthew Passion Week

Evaluation:

Genesis 1-11 advantages:

- foundational biblical sequence
- avoids external dating claims
- tests Scripture-first design well

Genesis 1-11 risks:

- theological and chronology debates
- creation/flood dating sensitivity

Matthew Passion Week advantages:

- strong Scripture Anchors
- clear event sequence
- later Gospel Harmony compatibility

Matthew Passion Week risks:

- requires careful Gospel parallel handling
- can be confused with Gospel Harmony

Recommended first MVP target:

Matthew Passion Week

Reason:

It can use clear Gospel passage anchors and prepare for later Gospel Harmony integration while avoiding broad primeval chronology debates.

## MVP Page Layout

Design only.

Conceptual wireframe:

```txt
Header:
Biblical Timeline
Scripture-first chronology

Tabs:
Scripture Timeline | Person Timeline | Event Timeline | Gospel Timeline | Kingdoms / Empires

Filter bar:
Period | Book | Event Type | Confidence | Overlay

Main:
Left column:
Vertical timeline event list

Right column:
Selected Event Scripture Context Panel

Selected Event Panel:
event title
Scripture Anchor
internal biblical sequence
related passages placeholder
dating note
confidence note
Open in Reader action
future Harmony Link placeholder only if available later
future Cross Reference Link placeholder only if available later

Mobile:
Event list -> detail drawer / stacked detail panel
```

## MVP Event Card Design

Event card content:

- title
- primary Scripture Anchor
- period
- event type
- confidence
- dating mode
- optional sequence label

Example only:

- Title: Jesus enters Jerusalem
- Scripture Anchor: Matthew 21:1-11
- Period: Passion Week
- Sequence: before temple cleansing
- Confidence: Scripture anchor high
- Dating: internal biblical sequence

Do not create real fixture data.

## MVP Selected Event Panel Design

Event detail panel sections:

- Scripture Anchor
- Event Summary
- Internal Biblical Sequence
- Dating and Confidence
- Related Study Links
- Open in Reader

Rules:

- Scripture Anchor appears first.
- Dating note must be visible.
- External historical synchronism is hidden unless explicitly enabled in a later phase.
- Related passages must not imply automatic Cross Reference approval.

## MVP Interaction Model

Design only.

Interactions:

- select event
- open Scripture Anchor in Reader
- filter by period/book
- switch view tab
- toggle world-history overlay later, disabled or hidden in MVP
- mobile detail drawer

Do not implement interactions.

## Relationship With Existing Systems

### Bible Reader

- Open in Reader is the primary action.
- Timeline should not duplicate Bible text.
- Bible text should load from existing Bible APIs later.

### Cross Reference

- Related links may later use Cross Reference.
- No automatic event generation.
- No visibility or review behavior change.

### Gospel Harmony

- Passion Week target prepares for later Gospel Harmony integration.
- Harmony remains separate.
- No Gospel Harmony schema, API, or import changes.

### Scripture Research Workspace

- Timeline can later become a research panel or connected route.
- No context provider changes in CR-77.

## MVP Non-Scope

CR-77 does not authorize:

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
- world history overlay implementation
- external chronology source acquisition
- automated entity extraction
- automatic event generation from Cross Reference
- automatic people/place extraction
- Gospel Harmony data import

## MVP Risks

Key risks:

- Confusing design target with approved data
- Overstating Passion Week chronology
- Mixing Gospel Harmony and Timeline responsibilities
- Making world-history overlay too prominent
- Duplicating Bible text
- Overloading Cross Reference rows
- Creating schema too early
- UI complexity on mobile

## MVP Validation Plan For Future Implementation

Future implementation should validate:

- Timeline page renders without duplicating Bible text
- Open in Reader links work
- Mobile layout remains usable
- Scripture Anchor remains first in event panel
- Dating note visible
- Confidence visible
- No external chronology shown by default
- No Cross Reference auto-event generation
- No Gospel Harmony behavior regression

Do not run implementation validation now beyond docs validation.

## Recommended Next Step

Recommend:

CR-78 — Scripture-Anchored Timeline MVP Design Approval Review

After approval, a future phase may design implementation readiness, but not implement unless separately approved.

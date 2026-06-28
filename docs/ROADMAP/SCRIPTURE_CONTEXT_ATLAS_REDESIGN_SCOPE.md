# Scripture Context Atlas Redesign Scope

## Date

2026-06-28

## Purpose

This document defines the product-direction scope for repositioning the current Timeline Workspace toward a Scripture-reading-first `Scripture Context Atlas`.

This is a docs-only design and scope note.

It does not authorize:

- frontend implementation
- backend implementation
- data package row changes
- DB changes
- API or schema changes
- real map integration
- coordinates or geocoding
- production deployment work

## Problem Statement

The current Timeline page has grown around multiple data-oriented views:

- Overview
- Events
- Books / Psalms
- Kings / Kingdoms
- Genealogy
- Places / Schematic Map

That work produced a strong metadata baseline, but the page now behaves more like a data-tab workspace than a Scripture-reading companion.

The desired direction is different:

- the user is reading Scripture first
- the user notices a person, place, nation, king, name, or era cue in the text
- the user clicks that item
- the right-side context surface explains the biblical context and supporting reference layers

The core product question is no longer "how many Timeline tabs can be shown?" but "how can existing Timeline data become a Scripture-context atlas that serves reading?"

## Product Direction

The target direction is closer to `Scripture Context Atlas / 성경 맥락 지도` than to a standalone Timeline data showcase.

Primary product principles:

- Scripture reading remains primary
- selected biblical context remains primary
- the right context panel becomes the main explanatory workspace
- existing Timeline data is reused as context supply, not discarded
- Timeline-specific views may remain as advanced mode or internal data surfaces rather than the default user mental model

This direction keeps the project Scripture-first while preserving the already-built metadata packages and preview layers.

## Proposed Layout

Recommended default layout direction:

### Left: Scripture Reader

- chapter-level or passage-level reading surface
- user clicks text-linked entities while reading
- Bible text remains the first-class surface

### Right: Context Panel

- displays contextual evidence for the currently selected entity
- keeps Scripture anchors as first-class evidence
- layers related people, places, kingdoms, events, and supporting reference metadata below the anchors

### Optional Center / Schematic Surface

- only when helpful
- may show a schematic map, flow summary, or relation summary
- remains optional and secondary
- should not dominate the reading experience

### Existing Timeline Views

Current Timeline views may remain available as:

- advanced mode
- supporting data surfaces
- internal data-source views for QA and authoring review

They should no longer define the primary product identity by themselves.

## Entity Types

The redesigned context atlas should support these entity families as reusable right-panel cards or sections:

- Person
- Place
- Nation / Kingdom
- King
- Event
- Book / Psalm context
- Genealogy
- Korean / world-history reference layer

Not every entity family needs full implementation in v1, but the scope should anticipate them.

## Right Panel Minimum Structure

The minimum context-panel structure for any supported entity should include:

- Title
- Type / category
- Scripture anchors
- Related people
- Related places
- Related kingdoms / nations
- Related events
- Basis label
- Confidence label
- Caution note

Recommended policy:

- Scripture anchors come first
- metadata labels come before supporting external references
- caution or confidence labels must remain visible
- the panel stays metadata-only unless the main Reader is the one rendering Bible text

## Map Policy

Map policy remains intentionally narrow.

v1 map policy:

- schematic-only
- no latitude / longitude
- no geocoding
- no map-provider
- no exact route reconstruction

This means the atlas may expose conceptual place relationships or conceptual-region summaries, but not a real map stack.

Future real map work requires separate approval.

## Original Language / Paja Policy

Original-language and name-analysis work must stay Scripture-serving and Christ-centered rather than curiosity-driven.

Required order of emphasis:

1. original-language meaning
2. biblical usage
3. immediate context and redemptive flow
4. supporting observations such as paja
5. Christ-centered summary where appropriate

Required policy:

- Strong / lemma / transliteration linkage may support the card
- original language is for contextual study, not lexical speculation
- paja is a supporting observation only
- paja is not a doctrine-generation source
- paja must not outrank Scripture usage or canonical context

## Kings / Kingdoms / Reign Policy

Kings and kingdoms remain useful context surfaces, but chronology claims must remain cautious.

Required policy:

- reign-period labels are caution-labeled reference only
- exact chronology overclaim remains prohibited
- surrounding empires remain supporting reference only
- world and Korean history remain era-reference layers, not interpretive authority
- prophetic-context expansion remains subject to separate approval and row-level review

## Data Reuse Plan

The redesign should reuse the current Timeline data foundation rather than replacing it.

Primary reuse sources:

- `docs/data-packages/timeline/events.core-biblical-skeleton.json`
- `docs/data-packages/timeline/books.66-canonical-skeleton.json`
- `docs/data-packages/timeline/kings-kingdoms.skeleton.json`
- `frontend/src/components/scripture/timeline/timelinePreviewData.ts`
- schematic place rows
- genealogy runtime rows
- Korean pilot references
- future original-language / person / name packages when separately approved

Current practical reuse model:

- Events package supplies Scripture-first event anchors
- Books package supplies canonical book-context metadata
- Kings package supplies kingdom and reign-context metadata
- runtime preview rows continue to cover genealogy, places, and selective supporting comparisons until later approved package work exists
- Korean pilot references remain supporting-only and secondary

## Implementation Phases

Recommended implementation order:

### Phase A: Right Panel Completeness Audit

- audit current Context Inspector completeness by view and entity type
- separate rendering gaps from source-data gaps

### Phase B: Reader + Context Panel Layout Prototype

- prototype left-reader / right-context structure
- keep existing Timeline views available as secondary or advanced surfaces

### Phase C: Entity Extraction / Linking From Selected Chapter

- connect selected Scripture reading context to entity selections
- preserve Scripture-first interaction order

### Phase D: Person / Place / King / Kingdom Cards

- build entity-card patterns on top of existing metadata
- keep Scripture anchors primary

### Phase E: Schematic Map Integration

- add optional schematic place visualization only
- no coordinates or provider integration

### Phase F: Original-Language / Paja Card Policy and Prototype

- reuse Strong / lemma / transliteration foundations
- keep paja subordinate and non-doctrinal

### Phase G: World / Korean Reference Layer

- keep this layer supporting-only
- keep Korean and world history below Scripture authority

## Explicitly Deferred

The following are explicitly deferred from this scope note:

- real map provider
- geocoding
- exact coordinates
- new DB schema
- API changes
- production deployment
- automatic AI-generated theological explanation
- unapproved prophet-context expansion
- unapproved Korean / world-history expansion

## Guardrails

The redesign must preserve these guardrails:

- Bible text remains primary
- Scripture anchors are first-class evidence
- external history is reference-only
- Korean / world history is not interpretive authority
- paja is not an independent doctrine source
- no Bible text is stored in Timeline packages
- no exact chronology overclaim
- no coordinates or map-provider without separate approval

## Current Relationship To Existing Timeline Workspace

This scope note does not delete or invalidate the current Timeline workspace.

Instead, it reinterprets the current Timeline system as:

- a validated metadata and package baseline
- a reusable context-data layer
- a likely future advanced surface

The primary redesign move is to make Scripture reading the main surface and let the current Timeline assets serve that reading flow.

## Required Next Step

Before implementation starts, the next required step should be:

- `Scripture Evidence Panel Completeness Audit`

That audit should determine:

- what existing right-panel sections are already sufficient
- which gaps are rendering-only
- which gaps require additional approved data work
- which entity types are ready for a reader-first context-panel prototype

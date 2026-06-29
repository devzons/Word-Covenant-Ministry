# Scripture Context Atlas Data Readiness Plan

## Date

2026-06-28

## Purpose

This document records the post-v1 data-readiness planning result for the Reader-first `Scripture Context Atlas`.

This is a docs-only planning step.

It does not authorize:

- frontend implementation
- backend implementation
- API / DB / schema changes
- Timeline data package row changes
- verse-level tagging implementation
- reader-side entity resolver behavior
- person / paja / original-language name atlas implementation
- place deep-link expansion
- genealogy deep-link expansion
- Korean-reference deep-link expansion
- real map / coordinates / geocoding / provider work
- Timeline Kingdom extraction

## Reader Context Panel v1 Closure

The current Reader Context Panel v1 scope is accepted as complete.

Accepted capability:

- `Context / 문맥` tab in the Reader research panel
- book-level metadata only
- book-level related metadata preview only
- supported advanced Timeline secondary links for:
  - `event`
  - `book`
  - `kingdom`
- `place` remains intentionally non-linked
- selected verse remains a reader-state hint only
- user-reported local browser QA accepted

Current data sources:

- canonical books package
- core events package
- kings / kingdoms package
- runtime schematic places
- existing Timeline deep-link restore behavior

Current boundary:

- no chapter-level real atlas yet
- no verse-level entity interpretation
- no reader-side entity resolution
- no supporting-reference promotion into primary Reader context

## Data Readiness By Area

### A. Book-Level Context

Readiness:

- high

Current state:

- enough data exists for book-level context
- basis / confidence / caution fields already exist
- related metadata preview is already working
- supported Timeline link escape hatch is already working

Assessment:

- additional source / basis / confidence refinement is possible as a small polish step
- it is safe because it does not require new data
- however, it is incremental polish rather than the next strategic expansion

Verdict:

- usable now
- optional refinement only

### B. Chapter-Level Context

Readiness:

- low for implementation
- moderate for design

Current state:

- current canonical book package is book-level
- current event anchors often carry passage labels, but the current Reader adapter intentionally collapses them into reference-only link targets
- current packages do not provide a dedicated chapter-level atlas layer
- current Reader Context Panel cannot safely claim `this chapter's context`

Risks:

- interpreting current event anchors as chapter-level context would overclaim beyond reviewed data
- even when a label includes a chapter range, it is not yet a chapter-context contract

Assessment:

- placeholder-only copy is possible
- placeholder-only copy has low user value
- the real missing step is chapter-level data design, not chapter-level UI

Verdict:

- chapter-level implementation: not ready
- chapter-level placeholder copy: safe but low priority
- chapter-level package design: appropriate next design step

### C. Verse-Level Tagging

Readiness:

- not ready

Minimum future data requirements:

- verse reference range
- entity type
- entity id
- confidence
- basis / source
- review status
- ambiguity handling
- selection / restoration policy

Minimum future review requirements:

- reviewer workflow
- approved source policy
- conflict resolution rules
- fallback rules for ambiguous entities
- UI policy for unreviewed vs reviewed tags

Impact risk:

- likely API changes
- likely schema / storage design work
- likely new package / review workflow design
- strong theological / interpretive risk if under-reviewed

Verdict:

- too early
- design-only work may happen later, but not as the next immediate CR

### D. Person Entity Package

Readiness:

- low

Current state:

- some Timeline rows contain people labels
- labels are not the same as reviewed person entities
- no shared person identity model exists yet

Required future distinction:

- display label
- stable entity id
- aliases / name forms
- Scripture anchors
- basis / confidence / caution

Verdict:

- person labels are not enough
- a future person package requires separate design
- not the next step before chapter-level atlas planning

### E. Place Entity / Map Package

Readiness:

- low

Current state:

- current place rows are schematic
- no coordinates
- no geocoding
- no provider integration
- no safe place deep-link restore from Reader

Reason for deferment:

- real place/entity/map work is materially different from current schematic places
- provider/coordinate work would enlarge architecture and review scope
- direct Reader place links would imply stronger entity behavior than currently supported

Verdict:

- schematic place preview remains acceptable
- place entity/map package remains deferred

### F. Kingdom / King Package

Readiness:

- moderate inside Timeline
- low for additional Reader-first expansion

Current state:

- package-backed kingdom preview exists
- Reader can safely link to supported kingdom targets in advanced Timeline
- deeper kingdom expansion remains tied to broader Timeline caution policies

Reason for deferment:

- kingdom extraction and deeper runtime-to-package promotion remain separate Timeline-track concerns
- Reader-first value is already served by secondary advanced Timeline links

Verdict:

- current Reader usage is enough for now
- no further Reader expansion should depend on Kingdom extraction

### G. Original-Language Name / Paja Package

Readiness:

- low

Current state:

- original-language reader data exists
- that data supports reading and word-study
- it does not yet define a reviewed name-atlas or paja-atlas contract

Required guardrail order:

1. original-language meaning
2. biblical usage
3. immediate context
4. supporting name/paja observations
5. Christ-centered significance where appropriate

Risk:

- paja can easily drift into doctrine generation or speculative meaning inflation
- name-atlas work can look more authoritative than the underlying review basis

Verdict:

- separate guardrail-first design later
- not the next Context Atlas expansion step

### H. Korean / World-History References

Readiness:

- supporting-only inside Timeline
- not ready for Reader Context Panel

Current state:

- Korean pilot references remain collapsed and supporting-only
- they are intentionally outside Reader Context Panel

Reason for deferment:

- direct Reader integration risks elevating supporting history above Scripture context
- inspector participation still requires policy work

Verdict:

- keep out of Reader Context Panel
- future integration needs separate inspector-policy approval

## Candidate Comparison

### A. Source / Basis / Confidence UI Refinement

- user value: medium
- implementation risk: low
- data readiness: high
- UX / theological risk: low
- API / DB / schema impact: none
- verdict: safe but not the strongest next strategic step

### B. Chapter-Level Placeholder Copy

- user value: low
- implementation risk: low
- data readiness: high for copy only
- UX / theological risk: moderate if wording overpromises
- API / DB / schema impact: none
- verdict: not recommended as the next primary CR

### C. Chapter-Level Atlas Data Package Design

- user value: high as the next enabling design step
- implementation risk: low if docs-only
- data readiness: moderate for planning
- UX / theological risk: low if it stays design-only and caution-labeled
- API / DB / schema impact: none in planning phase
- verdict: recommended

### D. Verse-Level Tagging Readiness Design

- user value: high long-term
- implementation risk: high even at the design boundary because it can sprawl into entity/review/system work
- data readiness: low
- UX / theological risk: high
- API / DB / schema impact: likely future impact
- verdict: too early

### E. Person Entity Package Design

- user value: medium to high long-term
- implementation risk: moderate to high
- data readiness: low
- UX / theological risk: moderate
- API / DB / schema impact: likely future impact
- verdict: not recommended before chapter-level atlas planning

### F. Paja / Name Atlas Guardrail Design

- user value: medium for a niche study audience
- implementation risk: moderate
- data readiness: low
- UX / theological risk: high without strict guardrails
- API / DB / schema impact: possible later impact
- verdict: not recommended as the immediate next step

### G. Close Context Panel Track And Move To Another Reader Feature

- user value: medium
- implementation risk: low
- data readiness: n/a
- UX / theological risk: low
- API / DB / schema impact: none
- verdict: valid option, but the Context Atlas track still benefits from one more planning step before full closure

## Recommended Next CR

Recommended next CR:

```txt
CR-BR-CTX-22 Scripture Context Atlas Chapter-Level Data Package Design
```

Objective:

- define the smallest future-safe chapter-level atlas data contract without claiming that chapter-level context already exists

Scope:

- docs-only
- define a chapter-level context package concept
- define required fields
- define source / basis / confidence / caution policy
- define how chapter-level rows must remain distinct from verse-level tagging

Files likely touched:

- `docs/ROADMAP/PROJECT_STATUS.md`
- `docs/ROADMAP/NEXT_TASKS.md`
- a dedicated chapter-level design note if needed

Explicitly not included:

- no code
- no package rows
- no API / backend / DB / schema work
- no verse-level tagging
- no person / paja / name / map implementation
- no place deep links
- no Korean/world-history Reader integration

Validation plan:

- `git diff --check`
- `git diff --stat`
- `git status --short`

Risk level:

- low

Browser QA needed:

- no

## Required Guardrails For Later Work

The following must remain deferred:

- verse-level tagging implementation
- selected verse-driven metadata filtering
- reader-side entity resolver
- person package implementation
- paja package implementation
- original-language name atlas implementation
- place deep links
- genealogy deep links
- Korean reference links
- real map / coordinates / geocoding / provider
- Korean/world-history inspector integration
- Timeline Kingdom extraction
- Bible API / backend / DB / schema changes
- Timeline data package row changes

## Overall Verdict

The current Reader Context Panel v1 should remain closed as an accepted book-level surface.

The next useful movement is not more placeholder UI and not verse-level semantics.

The next useful movement is a docs-only chapter-level atlas data design step that preserves current guardrails and clarifies what must exist before any future chapter-context or entity-context claims are made.

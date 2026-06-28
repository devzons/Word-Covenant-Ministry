# Korean History Inspector Policy Design

## Date

2026-06-27

## Purpose

`CR-92E` defines the policy boundary for any future Korean-history participation in the Timeline Workspace Context Inspector / right panel.

This is a docs-only policy and design note.

It does not authorize:

- frontend implementation
- inspector integration
- deep-link support
- package-row changes
- API, DB, backend, or schema changes
- runtime import/export changes

The goal is to decide whether Korean-history pilot references may ever appear in the right panel and, if so, under what strict authority and UI limits.

## Current Baseline

Current implementation baseline:

- Korean-history pilot rows render only inside the collapsed supporting-reference section in the Events view.
- Korean-history rows do not drive the Scripture Evidence Panel.
- Korean-history rows do not participate in search, filter, count, or result-set logic.
- Korean-history rows do not have a first-pass Context Inspector deep-link type.
- One post-biblical pilot row remains intentionally outside direct biblical-period linkage.

Current source-of-truth references:

- `docs/ROADMAP/KOREAN_HISTORY_REFERENCE_LAYER_DESIGN.md`
- `docs/ROADMAP/KOREAN_HISTORY_SOURCE_REVIEW_GATE.md`
- `docs/ROADMAP/KOREAN_HISTORY_SOURCE_POLICY.md`
- `docs/ROADMAP/KOREAN_HISTORY_APPROVED_SOURCE_SET.md`
- `docs/ROADMAP/CONTEXT_INSPECTOR_DEEP_LINKS_DESIGN.md`
- `docs/ROADMAP/SCHEMATIC_FLOW_HIGHLIGHTS_DESIGN.md`

## Authority Position

Korean history remains a supporting-only reference layer.

Authority order remains:

1. Scripture Anchor
2. Internal Biblical Sequence
3. Biblical Event / Book / Kingdom / Place Context
4. Biblical supporting date or relative year
5. World history reference
6. Korean history reference

Binding rules:

- Korean history is not interpretive authority over Scripture.
- Korean history must never override biblical sequence.
- Korean history must never be displayed as equal to Scripture anchors.
- Korean history must never be promoted as primary evidence for biblical interpretation.

Required fixed wording in any future inspector surface:

- `성경 해석 근거 아님`
- `Not a basis for biblical interpretation`

## Inspector Participation Policy

Korean-history inspector participation is allowed only as a future optional secondary surface.

It must not appear as:

- a primary inspector selection state
- a replacement for the selected biblical item
- a stronger evidence surface than existing biblical metadata

If a later implementation CR introduces Korean-history content into the right panel, it must appear only in a dedicated secondary section under an already selected biblical item.

Recommended section characteristics:

- collapsed or visually subordinate by default
- muted secondary styling
- explicit supporting-only badges
- explicit non-interpretive wording
- clear separation from Scripture anchors and biblical metadata sections

The right panel must continue to treat the biblical row selection as the primary inspector state.

## Deep-Link Policy

`CR-92E` sets a strict v1 deep-link boundary:

- no Korean-history deep-link support in v1
- no new `inspectType` for Korean history in v1
- no Korean-history-first URL restore path in v1

Reasoning:

- the current Context Inspector deep-link baseline is intentionally limited to metadata-first biblical Timeline datasets
- Korean-history references remain external supporting context rather than primary Timeline evidence
- a shareable Korean-history-first inspector URL would risk overstating authority

Future expansion, if ever approved, must be handled in a separate design and implementation CR.

## Search / Filter / Count Policy

Korean-history references must remain outside default Timeline query surfaces.

By default they must not participate in:

- event counts
- search result sets
- filter result sets
- view-level row counts
- primary Timeline list ordering

Reasoning:

- they are not biblical events
- they are not canonical Timeline rows
- their role is secondary contextual support only

## Source / Citation / Provenance Requirements

Any future inspector-visible Korean-history surface must show source metadata clearly.

Required visible fields:

- source provider
- source title
- source approval level
- source-basis label
- date-basis label
- confidence label
- caution note

Required policy:

- source/citation/provenance visibility is mandatory, not optional
- copied prose remains prohibited
- citation metadata must identify the source basis rather than reproduce protected text
- inspector display must not hide caution or confidence labels behind an extra interaction layer by default

## Post-biblical Row Policy

The current post-biblical pilot row must not be forced into direct biblical-period assignment.

If a future inspector surface ever renders it, it must be labeled as:

- `post-biblical supporting reference`
- `not directly linked to biblical periods`

Required policy:

- no forced biblical-period assignment
- no exact synchronism claim
- no implication that post-biblical Korean history proves biblical chronology

The current post-biblical row should remain available only as secondary context, not as a period-match correction target.

## UI Copy Requirements

If a future implementation adds a Korean-history section to the right panel, the section must include:

- supporting-only wording
- explicit non-interpretive wording
- visible source/citation/provenance
- visible date-basis / confidence / caution labels

Recommended English copy:

- `Supporting reference only`
- `Not a basis for biblical interpretation`
- `Post-biblical supporting reference`
- `Not directly linked to biblical periods`

Recommended Korean copy:

- `보조 참조 전용`
- `성경 해석 근거 아님`
- `post-biblical 보조 참조`
- `현재 biblical period에 직접 연결되지 않음`

## Guardrails

The following guardrails remain mandatory:

- no Bible text
- no coordinates
- no map-provider state
- no geocoding
- no exact synchronism
- no primary-evidence promotion
- no Korean-history-first inspector state in v1
- no Korean-history deep-link type in v1
- no search/filter/count/result-set participation by default
- no forced biblical-period assignment for post-biblical rows

## Deferred Implementation Boundary

`CR-92E` is design-only.

Implementation must be deferred to a later CR.

Any future implementation CR must separately decide:

- whether a secondary Korean-history inspector section is worth adding at all
- which active biblical selection types may expose it
- whether the section stays collapsed by default
- how post-biblical rows are visually separated from current biblical-period matches
- what QA scope is required for authority wording and regression safety

This document does not approve frontend integration by itself.

## Acceptance Criteria

`CR-92E` is complete when:

- the design explicitly keeps Korean history below Scripture authority
- v1 no-deep-link policy is explicit
- v1 no-primary-inspector-selection policy is explicit
- source/citation/provenance visibility requirements are explicit
- post-biblical handling is explicit
- implementation is clearly deferred to a later CR

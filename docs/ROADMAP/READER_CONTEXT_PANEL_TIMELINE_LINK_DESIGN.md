# Reader Context Panel Advanced Timeline Link Design

## Date

2026-06-28

## Purpose

This document records the readiness audit for adding advanced Timeline links from the Bible Reader `Context / 문맥` panel.

This is a docs-only design step.

It does not authorize:

- verse-level tagging
- reader-side entity resolver behavior
- Bible API changes
- backend / DB / schema changes
- Timeline data package row changes
- Timeline Kingdom extraction

## Current Reader Related Metadata Shape

The current Reader Context Panel receives a reader-only preview adapter shape:

```ts
type BibleReaderRelatedMetadataPreview = {
  books: Array<{ id: string; label: TimelineText }>;
  events: Array<{ id: string; label: TimelineText }>;
  kingdoms: Array<{ id: string; label: TimelineText }>;
  places: Array<{ id: string; label: TimelineText }>;
};
```

Current properties:

- item data is label-only
- chips are non-interactive
- the panel remains book-level metadata only
- selected verse remains a reader-state hint only

The current page loader builds this preview through read-only adapters:

- canonical books package
- core events package
- kings / kingdoms package
- runtime schematic place rows

## Current Timeline Deep-Link Support

The current Timeline route already supports metadata-only inspector restore through query params.

Supported query structure:

```txt
/[locale]/timeline?view=<view>&inspectType=<type>&inspectId=<id>
```

Supported `view` values for inspect restore:

- `events`
- `books`
- `kingdoms`

Supported `inspectType` values:

- `event`
- `book`
- `kingdom`

Current restore behavior:

- `event` restore uses the Timeline event row `id`
- `book` restore uses `bookId`, which is mapped through `bookContextByBookId`
- `kingdom` restore uses the current kingdom preview row `id`
- invalid or mismatched query state safely falls back to no selection

Currently unsupported or unsafe from the Reader:

- `place`
- `genealogy`
- Korean history reference rows
- reader-internal panel switching that behaves like an entity resolver

## Safe Link Target Policy

The Reader Context Panel may safely open only the currently supported advanced Timeline inspector targets.

Safe target patterns:

```txt
event   -> /[locale]/timeline?view=events&inspectType=event&inspectId=<event row id>
book    -> /[locale]/timeline?view=books&inspectType=book&inspectId=<bookId>
kingdom -> /[locale]/timeline?view=kingdoms&inspectType=kingdom&inspectId=<kingdom row id>
```

Unsafe or deferred targets:

- place deep links from the Reader
- genealogy deep links from the Reader
- Korean history reference deep links
- any link that implies verse-level tagging or entity inference

## UX Policy

Timeline must remain clearly framed as an advanced study / validation surface rather than a normal inline Reader resolver.

Recommended policy:

- keep related metadata chips non-interactive
- render Timeline navigation as a secondary action
- do not turn the chip itself into the primary click target
- do not imply that the selected verse has been resolved into an entity graph

Recommended Korean copy:

- `고급 Timeline에서 보기`
- `이 링크는 현재 책 기준 preview metadata를 Timeline 검증 화면에서 엽니다.`
- `선택 절에 사람/장소/왕국 태그가 붙었다는 뜻은 아닙니다.`
- `Timeline은 고급 연구/검증 화면입니다.`

Recommended English copy:

- `Open in advanced Timeline`
- `This opens current book-level preview metadata in the Timeline validation view.`
- `This does not mean the selected verse has been entity-tagged.`
- `Timeline remains an advanced study and validation surface.`

## Implementation Options

### Option A: Item-Level Secondary Timeline Links

Recommended.

Approach:

- keep current chips as non-interactive labels
- add optional `timelineHref` only for supported related metadata items
- render a small secondary link near each supported item or item group

Benefits:

- highest user value
- uses existing Timeline deep-link support
- keeps Reader entity-resolution claims out of scope

Risks:

- requires careful copy so Timeline feels advanced rather than required
- supported types must stay limited to `event`, `book`, and `kingdom`

### Option B: Category-Level Timeline Link Only

Not recommended as the first implementation.

Approach:

- one secondary link per category instead of per item

Benefits:

- lower implementation complexity

Risks:

- lower user value
- target precision is weaker
- may feel arbitrary when a category contains multiple items

### Option C: No Implementation Yet

Not recommended.

Reason:

- current deep-link mapping for `event`, `book`, and `kingdom` is already clear enough
- the main remaining work is UX-copy and scope discipline, not data readiness

## Recommended Next Implementation Scope

Recommended next CR:

```txt
CR-BR-CTX-18 Reader Context Panel Advanced Timeline Link Implementation
```

Objective:

- add secondary advanced-Timeline links for supported related metadata targets in the Reader Context Panel

Recommended scope:

- reader-only UI changes
- supported targets only:
  - event
  - book
  - kingdom
- optional `timelineHref` or equivalent link-ready field in the reader adapter
- explicit advanced-surface copy
- chips remain non-interactive

Likely files:

- `frontend/src/app/[locale]/bible/[version]/[book]/[chapter]/page.tsx`
- `frontend/src/components/scripture/BibleReaderContextPanel.tsx`
- `frontend/src/components/scripture/BibleReader.tsx`

## Explicitly Deferred

The following remain deferred:

- chapter-level real context
- selected verse-driven metadata filtering
- reader-side entity resolver behavior
- verse-level entity tagging
- place links from Reader until Timeline supports place deep-link restore
- genealogy links from Reader until Timeline supports genealogy deep-link restore
- Korean history reference links from Reader
- person package
- paja package
- original-language name atlas
- real map
- coordinates
- geocoding
- map-provider integration
- Korean/world-history inspector integration
- Timeline Kingdom extraction
- Bible API / backend / DB / schema changes
- Timeline data package row changes

## Risk Level

Current readiness verdict:

- data readiness: moderate and acceptable
- implementation risk: low to moderate if scoped to supported inspect types only
- UX risk: moderate unless advanced-surface copy remains explicit

Overall verdict:

```txt
Ready for a small frontend-only implementation CR if the scope stays limited to secondary advanced-Timeline links for event, book, and kingdom related metadata only.
```

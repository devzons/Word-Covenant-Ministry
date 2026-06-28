# Scripture Evidence Panel Modular Triage Plan

## Date

2026-06-28

## Purpose

This document records the triage plan that follows the current `Scripture Evidence Panel Completeness Audit`.

The goal is to safely divide:

- frontend-only completeness improvements
- normalizer carry-through fixes
- intentional preview limitations
- approval-gated data or editorial expansion

This is a planning document only.

It does not authorize implementation.

## Current Problem

The current right-side Scripture Evidence Panel is useful, but it is not yet consistent enough to serve as the default modular context panel for the future `Scripture Context Atlas`.

Current issues:

- completeness differs noticeably across Events, Books, Kings, Genealogy, and Places
- some values exist in package source data but disappear in normalizers or the panel renderer
- some missing sections are intentional preview limitations rather than defects
- some missing areas would require separate approval before any expansion begins
- the panel structure is not yet consistent enough to function as a unified reading-side context surface

## Future Modular Panel Direction

The future right-side panel should be reorganized around reusable modules.

Recommended module families:

- Summary module
- Scripture Anchors module
- Related People module
- Related Places / Map module
- Related Kingdoms / Nations module
- Related Events module
- Original Language / Name / Paja module
- Kings / Reign / Chronology Reference module
- World / Korean History Reference module
- Media module: images / map images / diagrams / videos
- Caution / Confidence / Basis module

Policy:

- not every entity needs every module
- only render modules that have real data
- missing data must not look like silent failure
- if a module is intentionally absent, the UI should eventually use explicit wording such as `preview limitation`, `not currently linked`, or `coming later`

## Minimum Panel Contract

Every right-panel entity should aim to provide this minimum structure when data exists:

- Title
- Type / category
- Scripture anchors
- Basis label
- Confidence label
- Caution note
- Related entity chips, if available

If the data is missing, the future panel should avoid blank silence and use explicit status messaging such as:

- `준비 중 / In preparation`
- `현재 연결 없음 / Not currently linked`
- `preview limitation`

## Safe Frontend-Only Fix Candidates

The following items are candidates for a future implementation CR that stays frontend-only or normalizer-only and does not add new rows.

These are candidates only. This document does not implement them.

### Events Panel Candidates

- show normalized `confidenceLabel` in the event panel
- review whether package-backed `relatedKingdomIds` and `relatedEventIds` are being dropped in `timelineEventsPackage.ts`
- review whether `scriptureReferencesOnly` currently hides package-backed date/basis/confidence metadata too aggressively

### Books Panel Candidates

- carry `basisLabel` through the books normalizer
- carry `confidenceLabel` through the books normalizer
- review carry-through for `relatedKingdomIds`
- review carry-through for `relatedBookIds`
- render existing `relatedBookIds` in the book panel where useful

### Kings Package Panel Candidates

- render existing `basisLabel`
- keep chronology labels visible while preserving current caution-only policy

### Places Panel Candidates

- present location basis and confidence using clearer label/value rows
- improve clarity without implying coordinates or exact geography

## Source-Data Expansion Items Requiring Approval

The following remain outside safe frontend-only scope and require separate approval before implementation:

- person entity type
- person package
- original-language / name / paja package
- fuller prophet-context expansion
- Korean / world-history inspector integration
- place package creation
- real map integration
- coordinates
- geocoding
- map-provider integration
- Luke genealogy expansion
- broader Old Testament genealogy expansion
- fuller Kings sequence package expansion
- runtime-to-package promotion
- media editorial layer implementation
- Cloudflare upload endpoint implementation

## Rendering Gap vs Normalizer Gap vs Source-Data Gap

This section restates the audit using implementation-focused categories.

### Rendering Gap

Rendering gap means:

- source data exists
- normalized data exists
- panel does not display it

Current likely rendering gaps:

- Events panel does not show normalized `confidenceLabel`
- Books panel does not show existing `relatedBookIds`
- Kings package panel does not show existing `basisLabel`
- Places panel presents basis/confidence less explicitly than it could

### Normalizer Gap

Normalizer gap means:

- source package contains the field
- the normalizer does not carry it into the UI row model

Current likely normalizer gaps:

- `timelineEventsPackage.ts` does not carry `relatedKingdomIds`
- `timelineEventsPackage.ts` does not carry `relatedEventIds`
- `timelineBooksPackage.ts` does not carry `basisLabel`
- `timelineBooksPackage.ts` does not carry `confidenceLabel`
- `timelineBooksPackage.ts` effectively discards `relatedKingdomIds`

### Source-Data Gap

Source-data gap means:

- the runtime row or package row itself does not contain the field needed for the desired module

Current likely source-data gaps:

- richer people metadata for canonical book rows
- richer event/place/people relations for Kings package rows
- explicit confidence/caution structure for genealogy rows
- package-backed place dataset
- person entity model and person package

### Intentional Preview Limitation

Intentional preview limitation means:

- the current product scope intentionally leaves this area partial
- the gap is not automatically a bug

Current intentional preview limitations:

- Genealogy remains Matthew-centered only
- Luke genealogy is deferred
- broader OT genealogy is deferred
- Places remain schematic-only
- Korean references remain outside the inspector
- prophet tags remain secondary context labels rather than primary entities
- no original-language / paja module is active in Timeline yet

### Requires Approval

Requires approval means:

- the next step would introduce new rows, new packages, new entity types, new external layers, or new editorial infrastructure

Current approval-gated areas:

- new data package rows
- prophet-context package expansion
- runtime-to-package promotion
- Korean / world-history right-panel integration
- original-language / name / paja package work
- media editorial layer
- Cloudflare delivery/editorial integration
- any real map work

## Suggested Implementation Order

Recommended implementation order should stay modular and small.

### A. Events / Books / Kings Existing Field Carry-Through And Rendering Fixes

- fix obvious rendering gaps
- fix safe normalizer carry-through gaps
- do not add rows

### B. Places / Genealogy Panel Clarity Hardening

- clarify basis/confidence/caution presentation
- improve explicit preview-limitation wording where needed

### C. Modular Panel Component Structure Design

- define reusable module shells
- avoid duplicating per-entity layout logic indefinitely

### D. Reader + Context Panel Prototype

- connect the future reader-first layout to the modular right panel

### E. Editorial Layer Design For Admin-Managed Media / Content

- separate content/editorial cards from core metadata cards

### F. Cloudflare Media Upload Design

- future-only design phase
- no implementation in this step

### G. Person / Name / Paja Package Policy Design

- define authority and data boundaries before implementation

### H. Data Expansion Approval Gates

- package-row additions
- prophet-context expansion
- Korean/world-history panel expansion
- richer entity package growth

## Cloudflare / Media Editorial Layer Note

Media support belongs to a later editorial layer, not to the current metadata-only panel baseline.

Future policy direction:

- Cloudflare Images / Stream belongs to a future editorial media layer
- API tokens must never be exposed to the frontend
- uploaded images and videos are supporting reference media only
- media should be lazy-loaded
- map image markers should use relative x/y percentages rather than latitude/longitude
- any actual Cloudflare implementation requires a separate design / approval CR

## Guardrails

The following guardrails remain mandatory:

- Bible text remains primary
- Scripture anchors stay first
- no Bible text stored in Timeline or context packages
- no coordinates
- no geocoding
- no map-provider
- no exact chronology overclaim
- Korean / world history remains reference-only
- paja remains supporting observation only
- no AI-generated theology as authoritative content
- no new data package rows in this CR
- no frontend or backend implementation in this CR
- no DB, API, schema, or runtime import/export changes
- no Cloudflare credentials or uploads in this CR
- no SQL dump / uploads archive / credentials commit
- no `frontend/vendor/`
- no `composer.lock` change

## Required Next Step

The next implementation-facing step should be a narrow, safe, frontend-only plan, not a broad redesign implementation.

Recommended next CR:

- `Scripture Evidence Panel Safe Completeness Fix Plan`

That CR should explicitly decide:

- which rendering gaps are safe to fix immediately
- which normalizer gaps are safe to carry through immediately
- which missing modules stay deferred
- which missing modules require approval before any code work begins

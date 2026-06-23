# CR-79 Scripture-Anchored Timeline MVP Implementation Readiness Design

## Purpose

CR-79 prepares a future implementation plan for the Scripture-Anchored Timeline MVP without implementing it.

It answers:

- What would need to be built later?
- Where would it likely belong?
- What existing patterns should be reused?
- What validation would be required?
- What remains blocked until explicit implementation approval?

This is readiness design only.

## Approved MVP Scope From CR-77 / CR-78

The approved MVP direction remains:

- Future conceptual route: `/[locale]/timeline`
- Default view: Scripture Timeline
- First MVP target: Matthew Passion Week
- Vertical Scripture-first timeline
- Selected Event Scripture Context Panel
- Scripture Anchor first
- Open in Reader primary action
- Dating note and confidence visible
- World-history overlay off or deferred
- No generated timeline data
- No schema, API, import, or DB work

## Readiness Boundary

CR-79 does not approve implementation.

CR-79 does not authorize:

- route creation
- component creation
- static data fixture creation
- generated data
- API
- schema
- DB
- migration
- import
- runtime behavior

## Future Route Readiness

Future route concept:

- `/[locale]/timeline`

Candidate future file path, design only:

- `frontend/src/app/[locale]/timeline/page.tsx`

Rules:

- Do not create this file in CR-79.
- Route must remain locale-aware.
- Route should use existing layout/shell patterns.
- Route should not load Bible text directly from static copied data.
- Future implementation must preserve `/ko` and `/en` localization strategy.

## Future Component Readiness

Possible future component responsibilities:

- `TimelinePageShell`
- `TimelineViewTabs`
- `TimelineFilterBar`
- `ScriptureTimelineList`
- `TimelineEventCard`
- `TimelineEventDetailPanel`
- `TimelineConfidenceBadge`
- `TimelineDatingNote`
- `TimelineMobileEventDrawer`

Candidate future location, design only:

- `frontend/src/components/scripture/timeline/`

Rules:

- Do not create this directory or files in CR-79.
- Reuse existing UI primitives where possible.
- Reuse existing Reader link patterns.
- Avoid duplicate layout systems.
- Keep Bible text out of event data.

## Future Data Shape Readiness

Temporary frontend planning shape if implementation is approved later:

- `id`
- `title`
- `period`
- `scriptureAnchor`
- `sequenceLabel`
- `confidenceLabel`
- `datingMode`
- `datingNote`
- `eventType`
- `readerHref`

Clarifications:

- This is not a final database field list.
- This is not approved generated data.
- This is only a future frontend MVP planning shape.
- Future DB/data model must go through separate approval.

## Matthew Passion Week Readiness

The future manual MVP target is Matthew Passion Week.

Design-only event candidates may include:

- Triumphal Entry
- Temple Cleansing
- Last Supper
- Gethsemane
- Trial
- Crucifixion
- Burial
- Resurrection

Rules:

- Do not create actual fixture data.
- Do not decide the final event list in CR-79.
- Each future event must have Scripture Anchor first.
- Gospel Harmony links are future/deferred.
- Related Passages are future/deferred.

## Bible Reader Integration Readiness

Future implementation should:

- generate Open in Reader links from Scripture Anchor
- not duplicate Bible text
- rely on existing Bible Reader route patterns
- preserve current Reader behavior
- not require Bible API changes

Candidate link pattern:

- `/[locale]/bible/[version]/[book]/[chapter]#v[verse]`

Design only.

## Cross Reference Readiness

Future implementation should:

- not auto-generate events from Cross Reference data
- not change Cross Reference API
- not change review visibility behavior
- not imply unreviewed related passages are approved WCM conclusions

Related Passages may be added only in a later approved phase.

## Gospel Harmony Readiness

Future implementation should:

- keep Gospel Harmony separate
- not import Gospel Harmony data
- not change Gospel Harmony schema/API
- prepare for later Harmony Link concepts
- avoid collapsing Timeline into Harmony

## Scripture Research Workspace Readiness

Future implementation should:

- be compatible with Reader-centered research workspace
- not change `ScriptureResearchWorkspaceProvider` in this phase
- reserve future context integration only after separate approval

## UI Readiness

Future layout expectations:

Desktop:

- Header
- View tabs
- Filter bar
- Left vertical timeline
- Right selected event detail panel

Mobile:

- Header
- Filters
- Event list
- Event detail drawer or stacked detail panel

Rules:

- Scripture Anchor first.
- Dating note visible.
- Confidence visible.
- World-history overlay hidden or deferred.
- Open in Reader visible.

## Accessibility Readiness

Future implementation should plan for:

- semantic headings
- keyboard-selectable event cards
- visible focus states
- aria-labels for event selection
- non-color-only confidence indication
- mobile drawer focus management if drawer is used

## Localization Readiness

Future implementation should support:

- Korean and English UI labels
- locale-aware routes
- KRV default for Korean
- WEB only if data-backed and approved for English
- no fake English Bible text

## Future Validation Plan

Future implementation validation should include:

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- route availability for `/ko/timeline` and `/en/timeline` if implemented later
- Open in Reader link behavior
- mobile layout
- keyboard navigation
- no Bible text duplication
- no API, schema, or import change
- no Cross Reference behavior regression
- no Gospel Harmony behavior regression

Do not run implementation validation now beyond docs validation.

## Non-Scope

CR-79 does not authorize:

- route files
- frontend components
- backend code
- API
- schema
- final DB fields
- migrations
- DB writes
- imports
- seeders
- generated timeline data
- static fixture data
- world-history overlay implementation
- source acquisition
- automated entity extraction
- automatic Cross Reference event generation
- Gospel Harmony import
- Research Workspace provider changes

## Recommended Next Step

Recommend:

CR-80 — Scripture-Anchored Timeline MVP Implementation Readiness Approval Review

After CR-80 approval, a later phase may request explicit implementation approval.

# Scripture-First Timeline Workspace Design

## Purpose

The Scripture Timeline is not a secular chronology tool.

Its purpose is to help readers see Scripture’s own order, relationships, settings, textual anchors, book backgrounds, authorship notes, covenant flow, people, places, kingdoms, surrounding empires, genealogy, and map connections more clearly.

It must help resolve confusion readers commonly experience when reading Scripture, such as:

- where a person fits in the biblical storyline
- where a book fits canonically versus historically
- what event background a book or Psalm may have
- which kings reigned at the same time
- how Kings and Chronicles compare
- which Judean kings are omitted in Matthew’s genealogy
- why some people, places, or kings have different names
- how Israel relates to surrounding empires
- how places and journeys connect to the biblical text

## Governing Authority Rule

The Timeline must never become an authority over Scripture.

Scripture is the standard.

Chronology, geography, reign dates, external history, maps, coordinates, authorship tradition, and scholarly reconstruction are supporting layers only.

When Scripture does not explicitly define a date, author, location, relationship, or sequence, the Timeline must mark that item as:

- explicit
- Scripture-connected
- superscription-based
- traditional
- inferred
- debated
- approximate
- uncertain

성경 타임라인은 성경 위에 서는 권위가 아니다.

그 목적은 성경 자체의 순서, 관계, 배경, 본문 근거를 더 분명히 보게 돕는 것이다.

연대, 지리, 왕의 통치 연수, 외부 역사, 지도 좌표는 보조 계층일 뿐이다.

성경이 날짜, 저자, 위치, 관계를 명시하지 않는 경우, 타임라인은 그것을 명시, 성경 연결, 표제 근거, 전통적 견해, 추정, 논의 중, 근사치, 불확실로 표시해야 한다.

## Canonical Order vs Historical Setting

Scripture has more than one kind of “time”:

1. Canonical location
   The book’s position in the biblical canon.
2. Event or historical setting
   The period in which the book’s content or event background belongs.
3. Authorship / composition note
   Who wrote it, when it may have been written, and whether the basis is explicit, superscription-based, traditional, inferred, debated, or unknown.
4. Redemptive / revelatory theme flow
   Covenant, seed, kingdom, temple, remnant, suffering righteous one, wisdom, exile, return, new creation, and Christ-centered fulfillment.

Examples:

- Job
  - Canonical location: Wisdom / Poetry
  - Historical setting: may fit near the patriarchal period
  - Authorship: uncertain
  - Timeline behavior: show near the patriarchal setting as a background-setting connection, not as an absolute chronological claim
- Psalms
  - Canonical location: Psalms
  - Individual Psalm setting may differ
  - Psalm 3 links to David fleeing from Absalom
  - Psalm 90 links to Moses / wilderness setting
  - Psalm 137 links to Babylonian exile setting

## Main Timeline Page Concept

Define the main page as:

**Scripture Timeline Overview**

The default view should be a top-down biblical overview centered on major people.

It should show at a glance:

- major biblical people
- major biblical events
- approximate year or period labels where appropriate
- covenant flow
- books connected to each period
- confirmed or inferred authorship notes
- Israel’s kingdoms
- surrounding empires
- prophets
- places
- map-ready location connections
- Scripture anchors
- confidence / uncertainty labels

Suggested top-down overview flow:

- Adam
- Noah
- Abraham
- Isaac
- Jacob / Israel
- Joseph / Egypt
- Moses / Exodus
- Joshua / Canaan
- Judges
- Samuel / Saul / David
- Solomon / Temple
- Divided Kingdom
- Assyria / Fall of Northern Kingdom
- Babylon / Fall of Jerusalem
- Exile
- Return
- Second Temple background
- John the Baptist
- Jesus Christ
- Cross / Resurrection / Ascension
- Pentecost
- Gospel expansion
- Early Church

The overview should be Scripture-first, not date-first.

## Workspace Layout

The preferred layout is a multi-panel workspace.

### Left Sidebar Navigator

The left sidebar must function as a primary navigation and filtering system.

It should support:

- search
- period
- book
- people
- covenant
- kingdom
- empire
- prophets
- places
- themes
- authorship / book-context filters where appropriate

The sidebar should eventually work as an accordion/filter navigator.

It should help users narrow a large amount of Timeline content without leaving the page.

It should be able to show counts where useful, such as:

- events by period
- books by period
- places by period
- kings by kingdom
- Psalms connected to historical settings
- people connected to events

### Main Timeline Overview

The default main page must be **Scripture Timeline Overview**.

It should show a top-down biblical overview centered on major biblical people and redemptive-historical flow.

The overview should help the reader see at a glance:

- major biblical people
- major events
- approximate period/year labels where appropriate
- covenants
- books connected to periods
- authorship notes where explicit, superscription-based, traditional, inferred, debated, or unknown
- Israel’s kingdoms
- surrounding empires
- prophets
- places
- Scripture anchors
- confidence and uncertainty labels

The overview should not be date-first.

It should be Scripture-first.

Suggested default top-down flow:

- Adam
- Noah
- Abraham
- Isaac
- Jacob / Israel
- Joseph / Egypt
- Moses / Exodus
- Joshua / Canaan
- Judges
- Samuel / Saul / David
- Solomon / Temple
- Divided Kingdom
- Assyria / Fall of Northern Kingdom
- Babylon / Fall of Jerusalem
- Exile
- Return
- Second Temple background
- John the Baptist
- Jesus Christ
- Cross / Resurrection / Ascension
- Pentecost
- Gospel expansion
- Early Church

### Main Workspace Views

The main content area must support multiple views inside the same Timeline page.

Required future views:

- Overview
- Events
- Books
- Kings & Kingdoms
- Genealogy
- Places / Map
- Themes

These should be treated as internal workspace modes, not separate disconnected pages.

The URL may preserve state with query parameters later, for example:

`/ko/timeline?view=kings&period=divided-kingdom`

### Right Detail Panel

The right panel must show the selected item’s Scripture-first context.

It should support:

- Scripture Anchor
- explanation
- canonical location
- historical/background setting
- authorship note
- people
- places
- name variants
- covenant/theme connection
- kingdom/empire context
- dating/confidence note
- map preview
- Reader Peek / Open in Reader

The reader should be able to understand the selected event, book, king, Psalm, genealogy node, or place without leaving the Timeline page.

### Page-Stay Principle

The Timeline Workspace should avoid forcing users to move from page to page.

The main exploration should happen inside the same page.

Examples:

- selecting a period updates the timeline stream
- selecting a book updates the visible events/book context
- selecting a place filters related items and updates the map/detail panel
- selecting a king opens king details in the right panel
- selecting a genealogy item opens comparison details in the right panel
- Reader Peek may eventually show Scripture in-panel without storing Bible text in Timeline data

Open in Reader should still exist as a full Reader action.

### Mobile Layout

The same concept must work on mobile.

Mobile layout should use:

- top view tabs
- filter drawer
- timeline cards or comparison tables
- bottom detail drawer
- optional map/reader drawer

The mobile version must preserve the same Scripture-first logic without requiring a separate mobile-only concept.

### Large Content Handling

The design must explicitly address large content volume.

The Timeline must eventually handle:

- many events
- many people
- all biblical periods
- all Bible books
- author and book-context notes
- Psalms with different historical settings
- Job-like books with canonical location and background-setting distinction
- kings of Judah and Northern Israel
- surrounding empires
- prophets
- Matthew genealogy comparison
- name variants
- places and map-ready data

The layout must therefore use:

- sidebar filters
- view modes
- grouped sections
- collapsible blocks
- selected-item detail panel
- progressive disclosure
- Scripture-first summaries
- confidence labels

### Explicit User Design Direction

The Timeline main page should function as a Scripture overview workspace.

It should help readers resolve confusion that happens while reading Scripture, such as:

- where a person fits
- where a book fits canonically versus historically
- when a Psalm belongs to a known event
- how Job can be shown near the patriarchal background while still remaining canonically in Wisdom/Poetry
- which kings overlap
- how Kings and Chronicles compare
- how Matthew’s 14 / 14 / 14 genealogy relates to omitted Judean kings
- why some names differ
- how Israel relates to surrounding empires
- how places connect to biblical events

The Timeline must serve Scripture and help the reader see Scripture more clearly. It must not become a controlling authority over Scripture.

## Major Views

### 1. Overview View

Default top-down biblical storyline overview.

Shows major people, major events, covenant flow, books, authorship notes, kingdoms, surrounding empires, prophets, places, and confidence labels.

### 2. Events View

Scripture-anchored event list.

Each event must show Scripture anchors first.

### 3. Books View

Shows canonical order and historical/background setting.

Useful for books such as Job, Psalms, Kings, Chronicles, Prophets, and Acts.

### 4. Kings & Kingdoms View

Parallel reign view.

Should compare:

- Judah kings
- Northern Israel kings
- Assyria
- Babylon
- Persia
- Egypt when relevant
- prophets
- major biblical events
- Scripture references

### 5. Genealogy View

Shows biblical genealogy comparisons.

Must include:

- Matthew’s 14 / 14 / 14 structure
- omitted Judean kings
- Kings / Chronicles comparison
- name variants
- Scripture references
- explanation notes

### 6. Places / Map View

Shows places as a supporting layer.

Must not treat coordinates as authoritative over Scripture.

### 7. Themes View

Shows covenant, seed, kingdom, temple, remnant, exile/return, suffering righteous one, wisdom, new creation, and Christ-centered fulfillment as Scripture-based theme layers.

## Authorship Notes

Authors must be included when explicit or reasonably traceable.

Authorship must be classified.

Suggested author basis types:

- explicit
- superscription
- traditional
- internalInference
- debated
- unknown

Examples:

- Psalm 3
  - Author: David
  - Basis: Psalm superscription
  - Related event: David fleeing from Absalom
  - Linked passage: 2 Samuel 15–18
- Job
  - Author: unknown / debated
  - Basis: no explicit author in the book
  - Historical setting: patriarchal background may be inferred, but not asserted as certain
- Pentateuch
  - Author note may reflect Mosaic traditional attribution while distinguishing explicit textual basis and tradition where needed

Do not overstate authorship where Scripture does not explicitly state it.

## Data Source Strategy

Timeline content should be supplemented from multiple layers, but always with Scripture as the top authority.

### A. Existing Internal Project Data

Classify current internal evidence as follows:

| Source | Classification | Timeline Use |
| --- | --- | --- |
| `docs/data-sources/KRV/krv.generated.json` | usable now | Scripture references, Reader links, Korean verse labels, preview support |
| Bible Reader routes and reader state | usable now | Open in Reader behavior and passage navigation |
| `frontend/src/components/scripture/timeline/timelinePreviewData.ts` | usable now | Manual preview fixture demonstrating content shape |
| `frontend/src/components/scripture/timeline/passionWeekTimeline.ts` | usable now | Compatibility export for the preview fixture |
| `docs/data-sources/STEPBible-Data/` | usable later after adaptation | lexical, morphology, versification, proper noun, and reference support |
| `docs/data-sources/STEP/TAGNT/` | usable later after adaptation | Greek source reference and original-language support |
| `docs/data-sources/STEP/TAHOT/` | usable later after adaptation | Hebrew source reference and original-language support |
| `docs/data-sources/개역개정.mdb` | usable later after review | Korean Bible source support candidate |
| `docs/data-sources/개역한글.mdb` | usable later after review | Korean Bible source support candidate |
| `docs/data-sources/바른성경.mdb` | usable later after review | Korean Bible source support candidate |
| `docs/ROADMAP/CROSS_REFERENCE_PLAN.md` | planned only | Future relationship layer, not auto-generated timeline events |
| `docs/ROADMAP/GOSPEL_HARMONY_PLAN.md` | planned only | Future event/pericope layer, not timeline authority |
| `docs/ROADMAP/SCRIPTURE_RESEARCH_WORKSPACE_ARCHITECTURE_DESIGN.md` | planned only | Future workspace layout context |
| `docs/ROADMAP/SCRIPTURE_RESEARCH_WORKSPACE_CONTEXT_MODEL_DESIGN.md` | planned only | Future shared context model |

### B. Manually Curated Scripture-First Data

The first authoritative Timeline content should be manually curated from Scripture anchors.

This includes:

- major biblical people
- major biblical events
- covenant moments
- book background settings
- authorship notes
- Psalm background links
- Job background-setting placement
- kings of Judah and Northern Israel
- Kings / Chronicles parallel comparison
- Matthew genealogy comparison
- omitted Judean kings in Matthew 1
- name variants
- prophets and their historical settings
- surrounding empires
- places and map-ready place relations

This curated data must always include Scripture references and confidence labels.

### C. External Data Candidates

External sources may be used only as supporting layers after source/license review.

Candidate categories:

- biblical place / geocoding data
- ancient Near East chronology references
- surrounding empire ruler lists
- map base data
- modern coordinate data
- historical atlas references
- Bible dictionary / encyclopedia references, only if license permits

External data must never become the authority over Scripture.

For every external source, document:

- source name
- source URL
- license
- attribution requirement
- allowed use
- limitations
- whether it can be imported, manually referenced, or only used for review

### D. Place / Map Data Candidates

Place and map data should be treated as incomplete unless separately proven otherwise.

Potential future sources may include:

- manually curated biblical place list first
- OpenBible.info Bible geocoding after license/source review
- Natural Earth for base map data if appropriate
- OpenStreetMap only with proper attribution/licensing and without relying on public OSM tile servers for production
- future self-hosted or paid tile provider if interactive maps are approved

Do not import any external map data in this task.

### E. Authorship Data Sources

Authorship information must be classified by basis:

- explicit Scripture
- superscription
- traditional attribution
- internal inference
- debated
- unknown

Document that authorship notes should be supplemented from:

- Scripture text itself
- book superscriptions where present, such as Psalms
- internal biblical references
- established traditional attribution, marked as traditional
- carefully reviewed Bible introduction/reference material, only as secondary support

Do not state uncertain authorship as fact.

### F. Kings / Kingdoms Data Sources

Kings and kingdoms data should be built first from Scripture references in:

- 1–2 Samuel
- 1–2 Kings
- 1–2 Chronicles
- relevant prophetic books
- Matthew 1 for genealogy comparison

External ancient Near East chronology may be used only as a supporting comparison layer and must be marked as external/traditional/scholarly where applicable.

### G. Data Governance

All Timeline content should eventually have:

- Scripture anchors
- source type
- source note
- confidence level
- review status
- last reviewed date
- explanation note
- uncertainty note where needed

Suggested review states:

- draft
- needs_review
- reviewed
- approved
- deprecated

### H. Recommended Data Build Order

Recommended order:

Phase 1:

Manual Scripture-first preview fixture

- major periods
- major people
- major events
- covenant markers
- books connected to periods
- basic authorship notes
- basic place chips

Phase 2:

Kings / Kingdoms curated dataset

- Judah kings
- Northern Israel kings
- parallel prophets
- surrounding empires as supporting layer
- name variants
- simple achievements / failures / biblical evaluations

Phase 3:

Book and Psalm context dataset

- Job background-setting example
- selected Psalms linked to historical settings
- authorship/superscription notes
- prophetic book settings

Phase 4:

Matthew genealogy comparison dataset

- 14 / 14 / 14 structure
- omitted Judean kings
- Kings / Chronicles comparison
- name variants
- explanation notes

Phase 5:

Place / Map dataset

- curated place list
- source/license-reviewed geocoding
- approximate/uncertain location labels
- map-ready relations

Phase 6:

Future backend/data package

- after preview data model is approved
- no generated/imported data until source/license and schema strategy are approved

## Data Model Concepts

Conceptual data structures only. Do not create schema.

### TimelineItem

- `id`
- `type`:
  - `event`
  - `bookContext`
  - `psalmContext`
  - `reign`
  - `genealogyNode`
  - `genealogyComparison`
  - `place`
  - `theme`
- `title`
- `scriptureAnchors`
- `period`
- `confidenceLevel`
- `explanationNote`

### TimelineOverviewPeriod

- `id`
- `localizedNameKo`
- `localizedNameEn`
- `majorPeople`
- `majorEvents`
- `covenants`
- `books`
- `authorshipNotes`
- `kingdoms`
- `empires`
- `prophets`
- `places`
- `scriptureAnchors`
- `chronologyNote`
- `confidenceLevel`

### BibleBookContext

- `bookId`
- `canonicalLocation`
- `historicalSetting`
- `eventSetting`
- `authorInfo`
- `compositionNote`
- `confidenceLevel`
- `scriptureBasis`
- `explanationNote`

### AuthorInfo

- `authorName`
- `authorBasis`:
  - `explicit`
  - `superscription`
  - `traditional`
  - `internalInference`
  - `debated`
  - `unknown`
- `scriptureBasis`
- `traditionNote`
- `uncertaintyNote`

### PsalmTimelineContext

- `psalmNumber`
- `superscription`
- `linkedEvent`
- `linkedPassage`
- `linkedPerson`
- `linkedPlace`
- `linkedPeriod`
- `confidenceLevel`
- `explanationNote`

### ReignContext

- `kingId`
- `kingdom`
- `reignOrder`
- `parallelKings`
- `surroundingEmpires`
- `prophets`
- `relatedEvents`
- `scriptureReferences`
- `evaluation`
- `achievements`
- `failures`
- `nameVariants`
- `chronologyNote`
- `confidenceLevel`

### GenealogyComparison

- `sourceText`
- `includedNames`
- `omittedNames`
- `linkedOldTestamentLineage`
- `explanationNote`
- `scriptureReferences`
- `confidenceLevel`

### NameVariant

- `personId` or `placeId`
- `primaryName`
- `variantName`
- `language`
- `scriptureReferences`
- `explanationNote`

### PlaceContext

- `placeId`
- `biblicalName`
- `modernName`
- `latitude`
- `longitude`
- `source`
- `sourceLicense`
- `locationConfidence`
- `isApproximate`
- `explanationNote`

## Kings, Chronicles, and Kingdoms

Kings and Chronicles require a dedicated comparison system.

The Timeline should help users compare:

- 1–2 Kings and 1–2 Chronicles
- Judah and Northern Israel
- surrounding empires
- prophets active during each reign
- major covenant violations or reforms
- temple-related events
- exile and return

A selected king should show:

- kingdom
- name variants
- father / successor where known
- Scripture references
- related prophets
- related foreign rulers
- key events
- simple achievements
- failures
- biblical evaluation
- places
- confidence / chronology note

Do not make external chronology the authority.

## Matthew Genealogy Comparison

Matthew’s genealogy must be visualized carefully.

The view should show:

- 14 generations from Abraham to David
- 14 from David to Babylonian exile
- 14 from exile to Christ
- omitted Judean kings where Kings/Chronicles shows more names
- name variants
- Scripture references
- explanation notes

Example:

- Matthew 1:8:
  - Joram → Uzziah
  - Kings/Chronicles lineage includes:
    - Joram → Ahaziah → Joash → Amaziah → Uzziah

The omitted kings should be visible and explained without treating Matthew as erroneous.

The purpose is to show Matthew’s theological and literary arrangement while preserving Scripture’s own witness.

## Places and Map Support Layer

Maps are necessary but supporting only.

The first implementation should not depend on a full interactive map.

Recommended phases:

1. Place chips
2. Place detail section
3. Map-ready data fields
4. Static map preview or placeholder
5. Interactive map
6. Route/path overlays, such as Exodus journey, Jesus’ ministry movements, Paul’s missionary journeys

Map data must include uncertainty and source.

Uncertain locations must be marked clearly.

Do not import external map data until a separate source/license review approves it.

## Confidence and Uncertainty Rules

Every item that is not directly explicit from Scripture should be marked.

Suggested labels:

- Explicit Scripture
- Scripture-connected
- Superscription-based
- Traditional
- Inferred
- Approximate
- Debated
- Uncertain

Use these for:

- dates
- authorship
- book setting
- psalm setting
- place location
- king chronology
- external empire synchronisms
- genealogy omissions
- name identification

## Scripture-First Card Order

For any card or detail panel, the order should generally be:

1. Scripture Anchor
2. Title / selected item
3. Summary or explanation
4. Canonical location / historical setting
5. People / kings / authorship / places
6. Covenant / theme connection
7. Dating / confidence / uncertainty note
8. Map / geography support
9. Reader Peek / Open in Reader

Do not show modern date or external chronology first.

## Non-Scope

This design does not authorize:

- backend schema creation
- DB migration
- external dataset import
- generated timeline data
- map dependency installation
- production deployment
- beta tag creation
- Cross Reference merging
- Gospel Harmony merging
- treating timeline chronology as authority over Scripture
- storing copied Bible text inside timeline data

## Recommended Implementation Phases

Recommended next phases:

- **CR-90B — Timeline Workspace Layout Expansion**
  - left sidebar
  - top view tabs
  - main overview layout
  - right detail panel
  - placeholder support for Reader Peek and map preview
- **CR-90C — Expanded Scripture-First Content Fixture**
  - representative overview periods
  - major people
  - major events
  - covenants
  - books
  - authorship notes
  - empires
  - places
- **CR-90D — Kings & Kingdoms Preview**
  - Judah / Israel / empires / prophets parallel comparison
  - king detail cards
  - name variant support
- **CR-90E — Psalms and Book Context Preview**
  - Job background-setting example
  - selected Psalms linked to historical settings
  - authorship/superscription notes
- **CR-90F — Matthew Genealogy Comparison Preview**
  - 14 / 14 / 14 structure
  - omitted Judean kings
  - name variants
  - Scripture references
- **CR-91 — Place / Map Preview**
  - place chips
  - map-ready data
  - map preview placeholder
  - source/license-safe map strategy

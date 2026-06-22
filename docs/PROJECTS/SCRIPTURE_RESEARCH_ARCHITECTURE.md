# Scripture Research Architecture

## Purpose

This document defines the long-term Scripture research architecture for Word Covenant Ministry.

The goal is to keep Bible reading central while connecting search, original-language study, cross references, gospel harmony, English Bible support, Hebrew-Greek bridge study, and future commentary into one coherent research flow.

This is an architecture document only. It does not approve schema changes, migrations, imports, new APIs, or production data changes.

## Bible Study Workspace Vision

The Bible Study Workspace is the primary study surface.

On desktop, the intended pattern is:

- left side: the selected Bible chapter and verse-level study modes
- right side: research tools such as Bible search, term study, cross references, or future commentary

On mobile, the same tools should stack below the Bible text so Scripture remains the first reading surface.

The workspace should support repeated study workflows:

- read a chapter
- search across the selected Bible version
- open original text or interlinear mode
- inspect a word
- follow related terms, references, or harmony units
- return to the Bible text without losing orientation

The workspace must not bundle large Bible datasets into the frontend. All Scripture text should remain API-backed and reference-driven.

## Research Hub Architecture

The research hub is not a separate data silo. It is a connected set of UI surfaces around Bible references and original-language terms.

Primary hub:

- `BibleReader`
- route shape: `/{locale}/bible/{version}/{book}/{chapter}`

Supporting surfaces:

- Bible Search panel
- Original Text mode
- Interlinear mode
- Original Word Panel
- Strong Study Panel
- Term Study Panel
- Gospel Harmony workspace
- future Cross Reference panel
- future English parallel Bible view
- future Commentary panel

Core rules:

- Bible references remain the stable navigation anchor.
- Original-language terms remain the stable lexical anchor.
- Study layers should reference Scripture; they should not duplicate Scripture storage.
- UI panels may compose existing API responses, but should not invent derived doctrine or unsupported relationships.

## Search Integration

Search belongs inside the Bible Study Workspace and also remains available through the dedicated Bible search route.

Current intended behavior:

- search uses the selected Bible version, such as KRV
- search is across the whole Bible version, not limited to the current chapter
- search results navigate to the matching book, chapter, and verse
- the selected verse may be highlighted by hash, such as `#v24`
- mode query may be preserved when moving between search results

Future behavior may add filters for book, testament, passage range, theme, or original-language relationship, but those filters should be explicit and not silently inferred from the current chapter.

## Original Text / Interlinear

Original Text and Interlinear are separate study modes.

Original Text mode:

- shows the Hebrew or Greek original sentence as natural text
- preserves Hebrew RTL rendering
- keeps each original word clickable
- opens the Original Word Panel for token-level study
- avoids card-style token clutter
- does not repeat the KRV verse inside the original text block

Interlinear mode:

- shows original-language tokens with learning aids
- may show transliteration, gloss, and morphology
- uses `transliteration_ko` and `gloss_ko` in Korean locale when available
- falls back clearly to existing Roman transliteration or English gloss when Korean values are missing
- suppresses punctuation, link markers, and pseudo morphology tokens from user-facing display

Original Text is for reading the source text. Interlinear is for studying the source text.

## Word Study Hierarchy

Word study should move from the immediate token to broader lexical study.

Hierarchy:

1. Token in Bible verse
2. Original Word Panel
3. Strong Study Panel
4. Term Study Panel
5. future dedicated Word Study route

The Original Word Panel should show the selected occurrence first:

- surface form
- lemma
- Strong number
- transliteration
- gloss
- morphology
- source reference

The Strong Study Panel groups related terms for the same Strong number or study family.

The Term Study Panel focuses on one original term:

- term identity
- summary counts
- sample occurrences
- simple navigation back to the broader Strong grouping

Future dedicated Word Study pages may add deeper occurrence browsing, filters, and cross-reference links, but the drawer workflow remains the fast in-context study path.

## Cross Reference Relationship

Cross references should be modeled as relationships between passages, not copied Bible text.

Expected relationship types may include:

- quotation
- allusion
- parallel_theme
- fulfillment
- promise_fulfillment
- lexical_connection
- topical_connection
- curated_manual

Cross references should integrate with:

- Bible Reader
- Original Word Panel
- Strong Study Panel
- Gospel Harmony workspace
- future Commentary panel

The UI should make the relationship type visible enough for users to distinguish direct quotation from broader thematic connection.

## Gospel Harmony Relationship

Gospel Harmony compares Gospel passages by event or teaching unit.

Architecture principle:

- a harmony unit stores references, not Bible text
- Bible text is fetched from the selected Bible version API
- Matthew, Mark, Luke, and John passages may be present or absent independently

The first workspace may display Matthew, Mark, and Luke columns, with John support retained in the data shape.

Future integration points:

- open a harmony unit from a Bible passage
- link parallel Gospel passages from Cross Reference
- support KRV first and WEB later when English Bible support is imported
- support Gospel harmony compatibility with future commentary

## English Bible Relationship

Locale and Bible version are separate concepts.

Current policy:

- Korean locale defaults to KRV
- English locale should route toward WEB as the first English Bible candidate
- WEB content is not assumed until future import approval
- the frontend must not fake English Bible text

Future English Bible support should provide:

- source and license review
- data package or import manifest
- dry-run import
- reader/search support
- KRV-WEB parallel view

English Bible support is a Phase 9 concern and should remain separate from Korean original-language MVP stabilization.

## Hebrew-Greek Bridge Position

The Hebrew-Greek Bridge is a future curated relationship layer between Old Testament Hebrew/Aramaic terms and New Testament Greek terms.

Rules:

- H and G Strong numbers are separate systems
- H430 is not technically the same identifier system as G2316
- related terms may be connected for study
- relationships must be curated or source-backed
- a relationship means related for study, not identical

Example future relationships:

- H430 `אֱלֹהִים` related to G2316 `θεός`
- H3068 `יהוה` related to G2962 `κύριος`
- H2233 `זֶרַע` related to G4690 `σπέρμα`

This belongs after the current original-language MVP stabilization, currently planned as a future Hebrew-Greek Bridge and Revelation Lexicon foundation phase.

## Future Commentary Position

Commentary should be a research layer attached to Scripture references, original-language terms, harmony units, or cross-reference relationships.

It should not become the source of Bible text.

Future commentary may connect to:

- passage references
- verse ranges
- original terms
- Strong numbers
- Hebrew-Greek bridge relationships
- Gospel Harmony units
- Cross Reference relationships

Commentary should remain clearly distinguished from Scripture text and source data.

## UI Navigation Map

Current and planned navigation surfaces:

- `/{locale}`: home
- `/{locale}/bible/{version}/{book}/{chapter}`: Bible Study Workspace
- `/{locale}/bible/{version}/{book}/{chapter}?mode=reader`: reader mode
- `/{locale}/bible/{version}/{book}/{chapter}?mode=original`: Original Text mode
- `/{locale}/bible/{version}/{book}/{chapter}?mode=interlinear`: Interlinear mode
- `/{locale}/bible/search`: dedicated Bible search page
- `/{locale}/original-language`: original-language entry page
- `/{locale}/gospel-harmony`: Gospel Harmony workspace

Future possible navigation:

- `/{locale}/word-study`: dedicated Word Study entry point
- `/{locale}/word-study/{termId}`: dedicated term page
- `/{locale}/cross-references`: Cross Reference entry point
- `/{locale}/commentary`: Commentary entry point
- `/{locale}/bible/{version}/{book}/{chapter}?parallel=WEB`: future parallel Bible display

Navigation should keep Bible references and locale visible in the route where practical.

## Out Of Scope

This document does not implement:

- schema changes
- database migrations
- data imports
- WEB import
- Gospel Harmony data import
- Cross Reference data import
- Commentary data model
- new backend APIs
- production DB changes
- external source collection
- automated H-G Strong equivalence
- copyrighted Bible data usage
- frontend route rewrites beyond documented future direction

Any future implementation must follow the project constitution, inspect the repository, document data/source policy, and use dry-run workflows where data changes are involved.

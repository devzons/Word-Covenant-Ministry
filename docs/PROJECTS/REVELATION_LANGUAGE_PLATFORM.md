# Revelation Language Platform

## Subtitle

Revelation Semantic Architecture for Word Covenant Ministry.

## 1. Document Purpose and Status

This document defines the highest-level semantic and research architecture for Word Covenant Ministry.

It exists because the project is no longer only a Bible reader, a Strong-number lookup tool, or a study-content site. The platform now needs a single architectural frame for:

- Scripture reading
- original-language study
- lexical meaning analysis
- Hebrew and Greek alignment
- New Testament reception
- study notes and research collections
- papers and books
- future commentary

This document is normative. It sets the platform vocabulary, the conceptual layers, and the long-term design direction.

This document does not by itself approve:

- schema changes
- migrations
- imports
- new APIs
- runtime UI implementation
- deployment changes
- production data changes

### Relationship to Existing Scripture Research Architecture

`docs/PROJECTS/SCRIPTURE_RESEARCH_ARCHITECTURE.md` remains the operational architecture document for the Reader and the research workspace.

This Revelation Language Platform document sits above it.

Think of the relationship this way:

- Revelation Language Platform: the top-level meaning and publication constitution
- Scripture Research Architecture: the current Reader/workspace implementation architecture inside that constitution

The lower-level document should stay aligned with this one, but it should not define the platform vision independently.

### What This Document Decides

This document decides:

- the platform vision
- the research hierarchy
- the meaning-card and meaning-journey standards
- the revelation-map concept
- the evidence and review discipline
- the publication integration flow
- the UX principles for progressive disclosure
- the conceptual data model boundaries

### What This Document Does Not Decide

This document does not decide:

- exact database schema column names
- final API route names
- import pipeline code
- editor permission policies
- deployment mechanics
- detailed frontend component names
- every future ADR-level implementation detail

Those decisions should still be recorded in ADRs or implementation docs when they become concrete.

## 2. Historical and Methodological Background

### Strong's Concordance: Historical Contribution

Strong's Concordance is historically important because it gave readers a stable cross-reference coordinate for original-language study.

It lowered the barrier between ordinary Bible reading and original-language lookup by letting readers move from a surface word to a numbered reference.

The exact publication history and historical specifics should be source-verified before any public historical write-up. The comments below are design-oriented, not a final historiography.

### What Strong Numbers Solved

Strong-style numbering solved a practical indexing problem:

- readers needed a simple bridge from English/Korean surface text to original-language lookup
- concordance workflows needed a repeatable coordinate system
- study tools needed a way to group occurrences without requiring every user to know Hebrew or Greek morphology first

### Current Limitations of Strong Numbers

Strong numbers are useful, but they are not sufficient as a meaning system.

They cannot by themselves answer:

- what a word means in a specific passage
- how a word behaves in different contexts
- how one Bible writer reuses a term
- how translation shifts affect meaning
- whether two surface forms are truly related in study terms

Strong numbers are coordinates, not destinations.

### Why Strong Numbers Should Remain

Strong numbers should not be deleted or discarded.

They should remain as external study coordinates because they still help users:

- jump from reading text to lexical tools
- compare occurrences
- anchor references across study layers
- retain continuity with common Bible-study workflows

### From Word Index to Meaning Network

The platform should expand from a word index into a meaning network.

That means the system should move from:

- "this number points to that dictionary entry"

to:

- "this term has a sense in this passage"
- "this sense is supported by these occurrences"
- "this passage participates in these translation relationships"
- "this term participates in these semantic and theological relationships"

## 3. Platform Vision

### Official Flow

The platform vision is:

```txt
Read Scripture
→ Understand Words
→ Follow Meaning
→ See Revelation
→ Know Christ
```

### Korean Candidate Phrase

Suggested Korean official expression:

```txt
성경을 읽고 → 단어를 이해하고 → 의미를 따라가고 → 계시를 보고 → 그리스도를 안다
```

Another concise variant:

```txt
성경 읽기 → 단어 이해 → 의미 추적 → 계시 인식 → 그리스도를 알기
```

The Korean wording should stay readable, Scripture-centered, and non-technical.

### What the Vision Means

This vision means the site should help a user start with the biblical text and move outward in a controlled order:

- from passage to word
- from word to meaning
- from meaning to canonical usage
- from canonical usage to translation alignment
- from translation alignment to New Testament reception
- from reception to theological reading
- from theological reading to study output and publication

The site should not force users to begin with Strong numbers, manuscript data, or abstract theology.

## 4. Core Principles

### 4.1 Meaning First

Users should meet meaning before they meet tooling.

The first screen should explain the passage, not the database.

Implementation implication:

- show the passage meaning summary first
- keep deep technical fields behind progressive disclosure
- never make Strong numbers or morphological codes the only obvious entry point

### 4.2 Scripture First

Scripture is the primary anchor for the whole platform.

Implementation implication:

- every study layer should point back to a canonical passage
- every meaning claim should be anchored in a text
- every derived relation should preserve the passage reference that supports it

### 4.3 Evidence Before Interpretation

No interpretation should appear without visible evidence.

Implementation implication:

- separate cited evidence from editorial conclusion
- label uncertain or disputed items clearly
- do not collapse text, note, and conclusion into one unreviewed block

### 4.4 Strong as Coordinate

Strong numbers are lookup coordinates, not meaning identities.

Implementation implication:

- Strong numbers may help users navigate
- Strong numbers must not become the platform's primary identity layer
- two terms with similar numbering or similar glosses must not be assumed identical

### 4.5 Language-Aware but Language-Neutral

The platform should understand language differences without worshiping any one language form.

Implementation implication:

- Hebrew, Aramaic, Greek, Korean, and English are all display and study languages
- the system should not assume that one language's surface form is automatically the meaning itself
- language is a carrier of meaning, not the final authority over meaning

### 4.6 Context Before Etymology

Context comes before root-chasing.

Implementation implication:

- show immediate passage usage first
- show broader canonical usage second
- show etymology, root shape, and letter observations only after contextual meaning is clear
- do not let etymology override usage

### 4.7 Translation as Relation, Not Identity

Translation relationships are useful, but they are not identity statements.

Implementation implication:

- a Hebrew word and a Greek word may be related for study without being identical
- an LXX rendering may be a translation choice, not a one-to-one meaning clone
- New Testament reuse may be quotation, allusion, echo, or general usage

### 4.8 Data and Interpretation Separation

Raw data, semantic relations, and publication-level interpretation must stay separate.

Implementation implication:

- source data should stay source data
- candidate semantic relations should stay machine- or editor-generated candidates until reviewed
- published interpretation should only be shown as published interpretation

### 4.9 Progressive Disclosure

The platform should serve ordinary readers and researchers at the same time without overwhelming either group.

Implementation implication:

- show a short meaning summary first
- reveal advanced fields only when the user asks for them
- make deeper layers feel available, not mandatory

### 4.10 Research Once, Publish Many

A single research substrate should feed many publication outputs.

Implementation implication:

- one studied meaning card may support a study note, article, paper, chapter, or book later
- the system should avoid duplicating the same research in multiple places
- research assets should be reusable without becoming copy-paste content

### 4.11 Scripture Interprets Scripture

The platform must preserve the canonical reading principle that Scripture interprets Scripture.

Implementation implication:

- the platform should encourage passage-to-passage reading
- related passages should be clearly labeled by relation type
- thematic or lexical links must not replace the immediate context of the passage

## 5. Target Users

### General Believers

Needs:

- readable Scripture-centered guidance
- short meaning summaries
- minimal terminology

Experience:

- should not be forced to learn Strong numbers first
- should see a clean reading-first interface
- should be able to expand only when curious

### Bible Readers

Needs:

- chapter reading
- related passages
- simple study cards
- clear navigation back to the text

Experience:

- should be able to read and study in one flow
- should not lose orientation when opening side panels

### Pastors

Needs:

- passage meaning
- sermon preparation paths
- cross references
- theme and theological connections

Experience:

- should be able to move from passage to teaching outline candidates
- should see evidence and review labels clearly

### Seminary Students

Needs:

- stronger evidence visibility
- lexical and grammatical detail
- translation comparison
- canonical and reception context

Experience:

- should see deeper layers without losing passage-level meaning

### Original-Language Researchers

Needs:

- lemma, morphology, and occurrence detail
- original-language relations
- canonical usage traces
- alignment layers

Experience:

- should be able to move from word to usage to relation graph

### Article and Book Authors

Needs:

- reusable research notes
- publishable sections
- evidence tracking
- review status

Experience:

- should be able to promote a researched idea into a publishable artifact without rebuilding it

### Admins and Editors

Needs:

- review queue
- status labels
- source metadata
- permission-safe editing
- duplicate detection

Experience:

- should manage candidate, draft, reviewed, approved, disputed, and deprecated content safely

## 6. Platform Layers

### 6.1 Bible Reading Layer

- Purpose: keep Scripture reading central.
- Visible content: Bible chapter, verse navigation, localized chapter reading UI.
- Data needed: canonical reference, Bible version, passage text, locale.
- Relation to other layers: this is the anchor for every other layer.
- MVP scope: chapter reading with safe verse navigation.
- Future expansion: richer parallel reading and study integration.

### 6.2 Interlinear Layer

- Purpose: show original-language tokens in reading order with learning aids.
- Visible content: tokens, transliteration, gloss, morphology, selected-word hover or tap behavior.
- Data needed: token occurrence, lemma, morphology, surface form, gloss, source verse.
- Relation to other layers: depends on Bible Reading Layer and feeds Meaning Card / Word Study.
- MVP scope: selected-verse interlinear view.
- Future expansion: richer token comparison, filtering, and note layering.

### 6.3 Meaning Card Layer

- Purpose: provide a short, passage-aware meaning summary for one original-language term.
- Visible content: compact lexical identity, current passage sense, representative usage, and study links.
- Data needed: term identity, occurrence summary, review state, evidence links.
- Relation to other layers: the entry point into deeper meaning work.
- MVP scope: one-card summary with progressive disclosure.
- Future expansion: multiple senses, sense ranking, and richer evidence linking.

### 6.4 Usage and Context Layer

- Purpose: show how a term behaves across immediate and canonical contexts.
- Visible content: immediate verse context, book usage, passage ranges, and sample occurrences.
- Data needed: occurrence history, verse references, frequency summaries, nearby context snippets.
- Relation to other layers: supports Meaning Card and Meaning Journey.
- MVP scope: selected usage samples and simple counts.
- Future expansion: full occurrence explorer and contextual filters.

### 6.5 LXX Alignment Layer

- Purpose: show how Hebrew/Aramaic terms are rendered in the Septuagint and related Greek forms.
- Visible content: aligned terms, translation choices, cautions, and relationship types.
- Data needed: aligned passage references, term pairs, translation labels, review status.
- Relation to other layers: bridges Hebrew original-language study and Greek reception study.
- MVP scope: curated alignment examples with clear caution labels.
- Future expansion: broader alignment coverage and translation-pattern analysis.

### 6.6 New Testament Reception Layer

- Purpose: show how terms, themes, and passages are received in the New Testament.
- Visible content: direct quotations, allusions, echoes, general usage, and related passages.
- Data needed: NT references, relation type, evidence metadata, review state.
- Relation to other layers: extends meaning through canonical reception.
- MVP scope: curated reception examples.
- Future expansion: broader reception graph and thematic tracing.

### 6.7 Meaning Journey Layer

- Purpose: trace a term or meaning through Scripture and translation history.
- Visible content: source passage, sense transitions, alignment history, and reception notes.
- Data needed: term identity, aligned terms, relation edges, evidence, review states.
- Relation to other layers: combines reading, usage, alignment, and reception.
- MVP scope: one guided journey per studied term.
- Future expansion: ranking, filtering, and comparative journeys.

### 6.8 Revelation Map Layer

- Purpose: connect Scripture, terms, themes, covenant, persons, events, and publications into a typed relationship network.
- Visible content: graph-like relation views, tagged paths, and evidence-backed links.
- Data needed: nodes, edges, weights, direction, evidence, review state.
- Relation to other layers: sits above individual cards and journeys as the broader semantic map.
- MVP scope: limited, reviewable graph links only.
- Future expansion: richer graph navigation and exportable relation sets.

### 6.9 Evidence Layer

- Purpose: keep every meaning claim tied to source material.
- Visible content: evidence list, source basis, confidence, review labels, and editorial notes.
- Data needed: textual basis, dictionary basis, source reference, review metadata, citations.
- Relation to other layers: every higher layer should read from this layer rather than replace it.
- MVP scope: visible evidence pointers and review labels.
- Future expansion: richer citation views and exportable evidence bundles.

### 6.10 Study and Publishing Layer

- Purpose: turn researched meaning into reusable study and publication assets.
- Visible content: study collections, articles, papers, chapters, books, and commentary sections.
- Data needed: study notes, review status, publication grouping, Scripture links, evidence links.
- Relation to other layers: consumes Meaning Card, Meaning Journey, and Revelation Map outputs.
- MVP scope: study collection shells and content grouping.
- Future expansion: full publication workflows and reusable manuscript outputs.

## 7. Meaning Card Standard

### Purpose

A Meaning Card is the first structured answer to the question: "What does this term mean here?"

It must be short, readable, and passage-aware.

### Display Order

The card should not begin with Strong numbers.

Recommended order:

1. Current passage meaning
2. Short summary
3. Original term identity
4. Contextual sense
5. Key usage categories
6. Representative passages
7. Study links and deeper evidence

### Required Fields

- Original headword
- Korean transliteration
- Language
- Part of speech
- Contextual core meaning
- Short explanation
- Meaning in the current verse or passage
- Main semantic categories
- Representative passages
- Total Bible usage count
- Major translation equivalents
- LXX alignment terms
- NT connections
- Related meanings
- Strong number
- Other external identifiers
- Review status
- Evidence sources
- Interpretation cautions

### Field Discipline

- Strong number should be visible, but not first.
- Dictionary definition should be kept separate from current passage sense.
- Verified data should be separated from editor commentary.
- The user-facing summary and the researcher-facing evidence should be staged progressively.

### UI Guidance

- The Meaning Card should open from a word click.
- The card should stay compact by default.
- Advanced details should appear only after user intent.

## 8. Meaning Journey Standard

Meaning Journey is the feature that shows how a word or theme moves through Scripture, translation, and reception.

### Required Journey Fields

- Starting passage
- Hebrew or Greek context
- Book-level usage
- Canonical usage distribution
- LXX translation alignment
- Translation technique
- Direct NT quotation
- NT allusion or echo
- General NT usage
- Meaning continuity
- Meaning narrowing
- Meaning expansion
- Meaning clarification
- Recontextualization
- Theological reuse

### Journey Rules

- A journey must begin from a passage, not from a detached dictionary entry.
- A journey must distinguish relation types instead of flattening everything into one link.
- A journey may include both machine-generated candidates and human-reviewed relations, but the status of each edge must be visible.

### Data Source Discipline

Meaning Journey may use:

- automatically generated candidate edges
- manually reviewed edges
- source-backed alignment data
- editorial notes

Meaning Journey must not hide which edges are reviewed and which are not.

## 9. Revelation Map Standard

The Revelation Map is the platform's typed semantic network.

It connects passages, terms, senses, themes, covenants, persons, places, events, promises, fulfillments, typologies, studies, and publications.

### Possible Node Types

- Scripture Passage
- Original Term
- Lexical Sense
- LXX Term
- New Testament Term
- Theme
- Covenant
- Person
- Place
- Event
- Promise
- Fulfillment
- Typology
- Study
- Publication

### Possible Relation Types

- occurs_in
- has_sense
- translated_as
- quotes
- alludes_to
- echoes
- fulfills
- contrasts_with
- develops
- narrows
- expands
- clarifies
- belongs_to_theme
- supports_interpretation
- disputed_relation

### Relation Metadata

Every relation should be able to carry:

- relation type
- direction
- evidence basis
- confidence
- review status
- author or reviewer
- source reference
- generation mode
- disagreement flag

### Relation Rules

- Relation type must be explicit.
- Direction must be preserved where it matters.
- Disputed or low-confidence relations must remain visible as such.
- A relationship means "related for study," not "identical."
- Strong-number similarity alone is never enough to establish identity.

## 10. Evidence Layer

Every meaning claim should be traceable to evidence.

### Minimum Evidence Types

- Hebrew text
- Greek text
- morphology
- grammar
- immediate context
- same-book usage
- canonical usage
- LXX alignment
- translation technique
- textual criticism notes
- NT quotation or allusion
- dictionary evidence
- academic reference
- editorial note

### Editorial Rules

- evidence and conclusion must be separate
- a card can summarize a conclusion, but the evidence trail must remain visible
- unsupported claims should not be promoted as established facts
- review status should be part of the visible trust model

## 11. Academic Safety Guards

The following risks must be documented and guarded against:

- etymology fallacy
- root fallacy
- treating Strong numbers as meaning itself
- assuming the same translation word means the same original word
- assuming identical H/G numbers are equivalent
- forcing Hebrew and Greek into a 1:1 identity map
- overgeneralizing Hebrew as "concrete" and Greek as "abstract"
- treating the entire Septuagint as one uniform translation method
- treating every NT use of the same word as an OT quotation
- importing later theology back into the source text without evidence
- presenting pictographic observation as historical linguistics

The platform should make these risks visible where relevant rather than hiding them in implementation notes.

## 12. Data Structure Concept

This section defines the conceptual model only.

It does not claim that every table below already exists exactly as written.

### Existing Repository Foundations

The repository already contains or documents:

- `wcm_original_terms`
- `wcm_original_word_occurrences`
- `wcm_study`
- `wcm_study_category`

These current foundations show that the project already distinguishes original-language storage from study content.

### Conceptual Entities

- `term`
- `term_identity`
- `occurrence`
- `lexical_sense`
- `occurrence_sense`
- `translation_alignment`
- `alignment_candidate`
- `nt_reception_relation`
- `semantic_relation`
- `evidence`
- `source_reference`
- `review`
- `study`
- `study_collection`
- `publication_section`

### Data Model Rules

- Strong numbers are external identifiers, not the primary key of the semantic model.
- A term can have multiple senses.
- An occurrence can map to one or more candidate senses.
- Translation alignment must be represented as relation data, not as identity.
- Study and publication content should reuse the same research substrate instead of duplicating it.

### Existing Structure Connection

Current original-language tables can anchor the `term` and `occurrence` concepts.

Current Study CPT content can anchor the `study` and `publication_section` concepts.

Future semantic tables, if approved, should extend these foundations rather than replacing them.

## 13. Content State and Review System

The platform should recognize the following states:

- generated
- candidate
- draft
- reviewed
- approved
- disputed
- deprecated

### State Meaning

- `generated`: created automatically and not yet trusted for publication
- `candidate`: plausible but not yet accepted
- `draft`: human-prepared but not yet reviewed
- `reviewed`: reviewed and acceptable for the current layer
- `approved`: ready for broader use or publication
- `disputed`: explicitly contested or unresolved
- `deprecated`: retained for history but not for current guidance

### Review Discipline

- generated data and reviewed data must be visually distinct
- reviewed status should be required before strong claims are shown publicly
- disputed data must not masquerade as settled
- publication output should inherit review state or cite it clearly

## 14. User Experience

### General User Experience

General readers should see information in this order:

1. meaning in the current passage
2. short meaning card
3. representative passages
4. meaning journey
5. deeper research only if desired

### Researcher Experience

Researchers should additionally see:

- morphology
- usage distribution
- LXX alignment
- NT reception
- textual criticism notes
- academic references
- disagreement markers
- export options

### Progressive Disclosure Rule

The interface should expand in layers.

It should never force the general user to parse the researcher surface first.

It should never hide the research evidence so completely that the deeper claim becomes untraceable.

## 15. Research and Publication Integration

The platform should treat research and publication as related but distinct outputs.

### Proposed Flow

```txt
Meaning Card
→ Meaning Journey
→ Study Collection
→ Article
→ Paper
→ Book Chapter
→ Book
→ Commentary
```

### Separation Rules

- raw source and imported data remain separate from editorial prose
- research notes remain separate from published copy
- publication sections should be able to point back to the underlying meaning and evidence
- one research item may be reused many times without re-authoring the core analysis

### Publication Discipline

The website should become the source repository for research, while articles, papers, and books become curated outputs from that repository.

## 16. Pilot Research

The first pilot study set should verify the structure, not prematurely settle every theological question.

Suggested pilot items:

- חֶסֶד (`chesed`)
- ἔλεος (`eleos`)
- Hosea 6:6
- Matthew 9:13
- Matthew 12:7

### Pilot Purpose

The pilot is meant to test:

- Meaning Card layout
- Meaning Journey pathing
- Evidence Layer visibility
- review-state handling
- relation typing

### Pilot Constraint

Do not hard-code final counts, translation ratios, or theological conclusions without evidence.

The pilot is for structural validation first.

## 17. Step-by-Step Implementation Roadmap

### Phase 0 - Documentation and Research Constitution

Goal:

- establish the umbrella vocabulary and rules

Prerequisites:

- current project docs and ADRs inspected

Deliverables:

- this document
- aligned architecture references
- glossary and decision links

Validation:

- documentation review
- terminology consistency

Exclusions:

- no runtime implementation
- no schema changes

Risk:

- terminology drift if lower-level docs do not stay aligned

### Phase 1 - Meaning Card Pilot

Goal:

- show a compact, passage-aware card for one term

Prerequisites:

- term identity and reviewed occurrence data
- evidence model

Deliverables:

- compact meaning card
- visible Strong number as a secondary coordinate

Validation:

- user can understand the passage meaning without entering a search tool

Exclusions:

- no full semantic graph
- no publication pipeline

Risk:

- overfitting the card to one language or one corpus

### Phase 2 - Usage and Context

Goal:

- connect a term to its contextual usage across Scripture

Prerequisites:

- occurrence data
- canonical reference model

Deliverables:

- usage explorer
- passage samples
- context summaries

Validation:

- usage summaries distinguish passage context from dictionary definition

Exclusions:

- no LXX bridge yet

Risk:

- confusing frequency with meaning

### Phase 3 - LXX Alignment

Goal:

- represent Hebrew/Aramaic to Greek translation relationships as study relations

Prerequisites:

- vetted alignment candidates
- source-backed reference policy

Deliverables:

- alignment layer
- translation relation labels

Validation:

- users can see relation type and confidence

Exclusions:

- no assumption that every alignment is identity

Risk:

- false equivalence between Hebrew and Greek

### Phase 4 - NT Reception

Goal:

- expose quotation, allusion, echo, and general reception paths

Prerequisites:

- curated NT relation data
- evidence metadata

Deliverables:

- reception layer
- relation-type labels

Validation:

- direct quotation remains distinguishable from general usage

Exclusions:

- no automatic theological conclusion generation

Risk:

- over-attributing all usage to direct quotation

### Phase 5 - Meaning Journey

Goal:

- combine context, alignment, and reception into one guided path

Prerequisites:

- meaning card
- usage context
- alignment and reception layers

Deliverables:

- journey view
- review labels
- evidence trail

Validation:

- users can follow meaning through Scripture without losing source context

Exclusions:

- no full graph explosion

Risk:

- path overload if every possible edge is shown at once

### Phase 6 - Revelation Map

Goal:

- expose the broader typed semantic network

Prerequisites:

- reviewed relation data
- stable node identity model

Deliverables:

- typed graph
- edge metadata

Validation:

- users can distinguish theme, covenant, person, event, and publication links

Exclusions:

- no unreviewed speculative graph as default

Risk:

- turning the platform into a generic knowledge graph without Scripture priority

### Phase 7 - Study and Publishing

Goal:

- connect the research substrate to articles, papers, and books

Prerequisites:

- stable study collection structure
- review status and publication metadata

Deliverables:

- study collections
- article / paper / book scaffolding

Validation:

- one researched item can be reused across multiple outputs

Exclusions:

- no duplicate manual re-entry of the same research

Risk:

- publication copy drifting from the research substrate

### Phase 8 - Researcher Tools and Export

Goal:

- add review, filter, and export tools for advanced users

Prerequisites:

- stable meaning and relation layers

Deliverables:

- filters
- batch review tools
- export formats

Validation:

- researchers can inspect evidence and export reproducible subsets

Exclusions:

- no user-facing clutter in the default reading path

Risk:

- exposing export features before review discipline is stable

### Phase 9 - AI-Assisted Candidate Generation

Goal:

- use AI only to suggest candidates, not to replace review

Prerequisites:

- review workflow
- evidence model
- candidate status handling

Deliverables:

- candidate generation helpers
- review queues

Validation:

- AI output is clearly marked as candidate or generated

Exclusions:

- no AI final theological authority

Risk:

- mixing generated suggestions with reviewed conclusions

## 18. Non-Functional Requirements

- Multilingual support must handle Korean and English first, while staying open to Hebrew, Aramaic, and Greek display needs.
- Mobile UX must preserve progressive disclosure rather than collapsing the platform into a tiny desktop copy.
- RTL support must remain correct for Hebrew and other right-to-left content.
- Performance must stay reference-driven and avoid bundling large Scripture datasets into the frontend.
- Search must remain passage-aware and language-aware.
- Data provenance must remain visible.
- Versioning must preserve review history.
- Review history must be auditable.
- License compliance must be explicit.
- Export must be reproducible.
- The platform must remain publishable, not just inspectable.
- Long-term data migration must be planned, not improvised.

## 19. Success Criteria

The platform is succeeding when:

- a user can reach the core meaning of a passage without knowing Strong numbers
- every public interpretive claim has visible evidence
- generated, candidate, reviewed, approved, disputed, and deprecated states are clear
- Hebrew-to-Greek and passage-to-passage relations are typed rather than flattened into "same meaning"
- one research item can flow into a web note, a paper, or a book chapter
- Scripture remains the primary reading surface everywhere
- original-language depth remains available without overwhelming ordinary readers
- LXX and NT reception are shown as relations, not as identity shortcuts

## 20. Excluded Scope

The following are explicitly excluded from this document's first version:

- full automatic meaning graph completion
- AI-generated final theology
- unreviewed pictographic interpretation presented as final fact
- replacing Strong numbers
- storing external dictionary text without license review
- claiming meaning ratios without evidence
- auto-linking every NT word to an OT source
- frontend implementation details
- backend implementation details
- schema implementation details
- import implementation details
- deployment implementation details

## Related Documents

- `docs/DECISIONS/0017-revelation-language-platform-semantic-architecture.md`
- `docs/PROJECTS/SCRIPTURE_RESEARCH_ARCHITECTURE.md`
- `docs/DECISIONS/0008-scripture-data-model.md`
- `docs/DECISIONS/0009-bible-storage-strategy.md`
- `docs/DECISIONS/0010-original-language-data-model.md`
- `docs/DECISIONS/0012-scripture-relationship-model.md`
- `docs/DECISIONS/0013-content-domain-model.md`

This platform document should remain the highest-level semantic architecture reference for the project.

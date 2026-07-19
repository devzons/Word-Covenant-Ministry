# Meaning Layer Architecture

## Subtitle

Meaning Layer Architecture for Word Covenant Ministry.

## 1. Document Purpose and Status

This document defines the next semantic design layer under the Revelation Language Platform.

The Revelation Language Platform establishes the top-level constitution for Scripture meaning, evidence, and publication. Scripture Research Architecture stays focused on the operational Reader and research workspace. This document fills the gap between those two by defining what the platform means by meaning itself.

This document is normative at the architectural level. It defines the vocabulary, identity strategy, evidence model, and publication flow for meaning-centered research.

This document does not by itself approve:

- schema changes
- migrations
- imports
- new APIs
- runtime UI implementation
- deployment changes
- production data changes

### Relationship to Existing Documents

- `docs/PROJECTS/REVELATION_LANGUAGE_PLATFORM.md` defines the top-level platform constitution.
- `docs/PROJECTS/SCRIPTURE_RESEARCH_ARCHITECTURE.md` defines the operational Reader and study-workspace architecture.
- This document defines the meaning layer that sits between the platform vision and the operational workspace.

### What This Document Decides

This document decides:

- what "meaning" means in the platform
- how meaning differs from Strong numbers, lexicons, dictionaries, and semantic tags
- the recommended meaning identity model
- the Meaning Card standard
- the Meaning Journey standard
- the Theme Layer standard
- the Revelation Map flow model
- the evidence and confidence model
- the research-object hierarchy
- the publication pipeline relationship

### What This Document Does Not Decide

This document does not decide:

- exact database table names
- final API route names
- import pipeline code
- editor permission policies
- deployment mechanics
- detailed frontend component names
- every future ADR-level implementation detail

Those decisions should still be recorded in ADRs or implementation docs when they become concrete.

## 2. What Meaning Layer Is

### What It Means

The Meaning Layer is the platform layer that describes what a passage, term, or usage means in context, using visible evidence and explicit review state.

Meaning is not a word by itself.
Meaning is not a Strong number.
Meaning is not a dictionary entry by itself.
Meaning is not a relation graph by itself.

Meaning is the context-bound semantic claim that can be defended from Scripture and related evidence.

### What It Does Not Mean

The Meaning Layer does not mean:

- a lexicon replacement
- a dictionary replacement
- a synonym list
- an etymology-only system
- a Strong-number index with a new label
- a free-form semantic tag cloud
- an AI-generated doctrine engine

### Why It Is Needed

Strong numbers helped readers jump from surface text to original-language lookup.

That solved a coordinate problem, but not a meaning problem.

Word Covenant Ministry needs a layer that can say:

- this term means this in this passage
- this meaning is supported by these witnesses
- this usage belongs to this canonical pattern
- this translation choice reflects this relationship
- this meaning is reviewed, disputed, or approved at this stage

### Strong, Lexicon, Dictionary, Semantic Network

#### Strong

Strong is an external coordinate.

It helps users navigate, but it does not define meaning identity.

#### Lexicon

A lexicon organizes lemma-level entries and sense ranges.

It is useful, but it usually sits below the platform's passage-centered meaning model.

#### Dictionary

A dictionary summarizes meanings in a reference format.

It is useful as support, but it is not the same thing as a passage-specific meaning claim.

#### Semantic Network

A semantic network describes relationships between meanings, passages, themes, and reception paths.

It is powerful, but it must be built from reviewed meaning objects, not from loose tags or unreviewed associations.

## 3. Meaning Definition

### Logical Definition

Meaning is the smallest context-bound semantic claim that the platform can defend from evidence.

In practical terms, meaning answers questions like:

- What does this term do in this passage?
- What sense is active here?
- What canonical pattern does this usage participate in?
- What translation relationship is being expressed?
- What claim is justified by the evidence?

### Example: חסד

חסד is not only:

- a word form
- a Strong number
- a glossary line
- a theological slogan

It may function differently depending on:

- immediate clause context
- canonical book context
- covenant context
- translation history
- reception in later Scripture

So the Meaning Layer must represent more than the lemma and more than the dictionary gloss.

### Meaning Types

The platform may eventually distinguish several meaning modes:

- passage meaning
- lexical meaning
- canonical meaning
- thematic meaning
- reception meaning
- publication meaning

These are related, but they are not identical.

## 4. Meaning Identity

The platform needs an identity scheme that does not collapse meaning into Strong numbers.

### Candidates

#### Meaning ID

Meaning ID is the recommended primary identity for the platform's meaning object.

Pros:

- passage-centered
- review-friendly
- suitable for Meaning Cards and Meaning Journeys
- can survive changes in surface wording or external references
- can bridge lexical, thematic, and publication layers

Cons:

- requires a deliberate platform model
- needs review rules to avoid becoming too broad

#### Sense ID

Sense ID is useful for lexical sense indexing.

Pros:

- good for dictionary-like grouping
- good for lemma-level sub-senses
- helpful when one term has multiple meaning branches

Cons:

- too narrow for passage-level meaning
- too lexical for theme and revelation layers
- can become dictionary-first instead of Scripture-first

#### Semantic ID

Semantic ID is useful as a generic label for nodes or relations.

Pros:

- flexible
- can describe many node types

Cons:

- too vague for a primary identity
- can blur nodes and edges
- does not clearly say whether something is a meaning object, a relation, or a theme

### Recommended Structure

Recommended hierarchy:

1. `meaning_id` as the primary platform identity
2. `sense_id` as a subordinate lexical-sense identity
3. `theme_id` as a thematic aggregation identity
4. `relation_id` as a relationship or edge identity
5. `strong_number` as an external coordinate, not a primary identity

This keeps the platform meaning-first while preserving lexical and relational flexibility.

### Policy Summary

- Strong stays.
- Strong does not become the meaning key.
- Meaning is the primary research object.
- Sense is subordinate to meaning.
- Theme is broader than meaning.
- Relation is not meaning itself.

## 5. Meaning Card Standard

Meaning Card is the user-facing presentation of a reviewed meaning object.

This section defines the data model standard, not the final UI component.

### Must Include

- `meaning_id`
- current passage reference
- original term or terms involved
- transliteration or display form
- language
- part of speech or lexical category when relevant
- current passage meaning
- canonical meaning summary
- lexical meaning summary
- historical meaning note when relevant
- main evidence list
- review state
- editor or reviewer note when present

### Should Include

- representative canonical passages
- broader usage categories
- Strong number as secondary coordinate
- related themes
- related Journey entries
- related publication pointers
- short cautions or boundaries

### Must Not Include

- Strong number as the primary identity
- unsupported doctrine
- hidden or unlabelled editorial opinion
- evidence-free certainty
- mixed raw data and final conclusion in one undifferentiated block
- unreviewed AI conclusion presented as approved meaning

### Required Separation

Meaning Card must keep these fields distinct:

- current passage meaning
- canonical meaning
- lexical meaning
- historical meaning
- editor observation
- evidence
- review state

That separation is critical because the same term may have:

- a lexical definition
- a passage-specific sense
- a canonical usage pattern
- a publication-ready summary

These are related, but not interchangeable.

### General User View vs Researcher View

General users should see:

- current passage meaning
- short explanation
- representative passages
- progress to deeper study

Researchers should additionally see:

- morphology
- full usage distribution
- translation alignment
- reception data
- source and review detail
- evidence list

## 6. Meaning Journey

Meaning Journey traces how a meaning behaves across Scripture and reception history.

### What It Follows

Meaning Journey follows a meaning, not only a word form.

It can start from:

- a passage
- an occurrence
- a lemma
- a sense
- a theme

But the smallest meaningful unit should remain passage-anchored.

### Minimum Unit

The minimum unit of a Meaning Journey is a reviewed meaning transition anchored in a source passage.

In other words, the journey begins with:

- one source passage
- one meaning claim
- one or more supporting witnesses

### Journey Stages

The journey may show:

- source passage meaning
- canonical usage pattern
- translation relation
- LXX alignment
- NT reception
- continuity
- narrowing
- expansion
- clarification
- recontextualization
- theological reuse

### What It Must Not Do

Meaning Journey must not:

- flatten every reuse into identity
- pretend every translation match is the same meaning
- treat every NT echo as a direct quotation
- hide review state
- hide disagreements

### Automatic vs Reviewed Data

Meaning Journey should be able to show:

- automatic candidate relations
- editor-reviewed relations
- disputed relations
- approved relations

Automatic relations are useful for discovery, but they are not final interpretation.

## 7. Biblical Theme Layer

Themes are not words.

Themes are recurring biblical patterns that gather multiple meanings, passages, and reception paths.

Examples include:

- light
- life
- covenant
- holiness
- temple
- rest
- seed
- lamb
- king

### Theme Layer Function

Theme Layer sits above the meaning layer and below broad Revelation Map flow.

It helps the platform say:

- this meaning participates in this theme
- this theme is supported by these passages
- this theme develops across Scripture
- this theme is later fulfilled or clarified in Christ-centered reading

### Relationship to Meaning Layer

A meaning can support multiple themes.
A theme can gather multiple meanings.
Neither one replaces the other.

Meaning answers "what does this mean here?"
Theme answers "what pattern is this part of?"

### What Theme Layer Must Not Become

Theme Layer must not become:

- a free association list
- a synonym bucket
- a doctrinal slogan board
- a replacement for passage-level meaning

## 8. Revelation Map

Revelation Map is the flow view of the platform.

It is the layer that shows how Scripture's meaning moves through the canonical story.

### Flow Perspective

The platform should be able to express broad redemptive flow such as:

```txt
Creation
-> Covenant
-> Kingdom
-> Christ
-> Church
-> New Creation
```

This is not a replacement for Scripture detail.
It is a higher-order view built from reviewed meaning and theme relations.

### What It Connects

Revelation Map connects:

- passages
- original terms
- meanings
- themes
- covenants
- persons
- events
- promises
- fulfillments
- studies
- publications

### What It Must Not Do

Revelation Map must not:

- flatten redemptive history into a single undifferentiated graph
- replace passage meaning with slogan-level theme claims
- hide relation types
- hide review status
- hide disagreement

### Relationship to Meaning Layer

Meaning Layer provides the local, context-bound claim.

Revelation Map provides the canonical flow view.

The flow view should be built from reviewed local claims, not from unsupported macro assertions.

## 9. Evidence Levels

Meaning claims must have visible evidence levels.

### Recommended Evidence Ladder

#### Level 1 - Direct Text

The Hebrew, Greek, or relevant Scripture text itself.

#### Level 2 - Grammar and Syntax

Morphology, clause function, and immediate syntactic relation.

#### Level 3 - Immediate Context

The verse, paragraph, chapter, or book context.

#### Level 4 - Canonical Usage

How the same term or sense behaves across Scripture.

#### Level 5 - Translation Alignment

How translation choices, including LXX alignment, reflect or shift meaning.

#### Level 6 - New Testament Reception

Quotation, allusion, echo, reuse, or broader reception.

#### Level 7 - Historical Theology

Later theological or scholarly witness, when cited and clearly labeled.

#### Level 8 - Editor Observation

Editorial or pictographic observation that may be useful but is not proof by itself.

### Evidence Policy

- Higher-level evidence is not automatically more authoritative.
- Direct textual and contextual evidence should normally outrank later observation.
- Editor observation must never override the text.
- Pictographic or observational notes must be clearly labeled as observations, not proof.

### Separate Evidence from Conclusion

Every evidence item should be distinguishable from the conclusion it supports.

That means the system should be able to show:

- source
- evidence type
- evidence strength
- relation to the claim
- reviewer status

without collapsing all of that into one paragraph.

## 10. Confidence Model

Evidence and confidence are not the same thing.

### Evidence

Evidence answers:

- What supports this claim?
- How direct is it?
- What kind of support is it?

### Confidence

Confidence answers:

- How stable is the current claim?
- How much disagreement remains?
- How much review has been completed?

### Recommended Components

Confidence should consider:

- directness of evidence
- coverage of witnesses
- agreement among witnesses
- strength of counter-evidence
- reviewer maturity
- publication readiness

### Recommended Expression

Use both:

- a confidence band, such as low / medium / high / approved / disputed
- a short confidence note explaining why the band exists

The system may later use a numeric score for ranking, but the user-facing presentation should stay readable and review-aware.

### What Confidence Must Not Do

Confidence must not:

- masquerade as evidence
- turn automatic guesses into approved truth
- hide disputed relations
- imply that all strong-looking relations are equally proven

## 11. Research Object Hierarchy

The platform needs a stable research object hierarchy.

### Recommended Hierarchy

1. Passage
2. Occurrence
3. Term or Lemma
4. Sense
5. Meaning
6. Theme
7. Study
8. Publication

### Why Occurrence Matters

The smallest useful research unit is not the character and not the abstract word.

The smallest useful platform unit is the occurrence:

- one term in one passage
- one textual event with context
- one observable instance the platform can verify

Characters and letters may matter for certain sub-studies, but they are not the primary research object.

### How the Current Repository Relates

Current repository foundations already point in this direction:

- `wcm_original_terms` and `wcm_original_word_occurrences` support term and occurrence anchoring
- `wcm_study` supports authored ministry content
- `wcm_study_category` supports study organization
- Scripture Research Architecture already separates Reader surfaces from deeper research surfaces

The Meaning Layer should build on those foundations rather than inventing parallel ones.

## 12. Publishing Model

The platform should support "research once, publish many".

### Recommended Flow

```txt
Meaning Card
-> Meaning Journey
-> Study Collection
-> Article
-> Paper
-> Book Chapter
-> Book
-> Commentary
```

### What This Means

- Meaning Card stores the smallest reviewed meaning claim.
- Meaning Journey expands that claim through usage, alignment, and reception.
- Study Collection groups related research objects.
- Article turns research into a shorter teaching or explanatory form.
- Paper adds structured argument, method, and evidence.
- Book Chapter and Book assemble sustained treatment across many research objects.
- Commentary anchors publication back to Scripture passages.

### Anti-Duplication Rule

Research should not be duplicated across web, paper, and book forms.

Instead, the publication layer should reuse reviewed research objects and selectively narrate them for each format.

### Relationship to Study Content

Study content is a publication layer, not the source layer.

The source layer remains:

- Scripture
- original terms
- occurrences
- meaning claims
- evidence
- review state

Study content should reuse the source layer rather than replacing it.

## 13. Long-Term Vision

Strong gave the project a coordinate system.
Meaning Layer gives the project a research system.

In a 20-year view, Word Covenant Ministry should be able to function as:

- a Scripture meaning repository
- a reviewed semantic network
- a publication pipeline
- a teaching archive
- a commentary source system
- a research memory for the ministry

The end state is not merely a better Bible lookup site.
The end state is a Scripture-centered platform where meaning, evidence, and publication can be traced back to the text with review discipline.

## 14. Repository Grounding and Current vs Future

### Current Repository Anchors

The repository already provides the following anchors that can support the future Meaning Layer:

- Scripture text storage and import groundwork
- original-language term and occurrence tables
- Bible Reader and Original Language Reader surfaces
- Word Study panel flow
- Scripture Research Architecture
- Cross Reference and Gospel Harmony foundations
- Study content CPT foundation

### Future Layer

The Meaning Layer is not yet implemented as a dedicated runtime or schema layer.

This document defines the architecture that future work should follow when it is implemented.

That future work may eventually include:

- meaning records
- sense records
- theme records
- journey records
- relation records
- review workflows
- publication reuse flows

But those are not approved by this document alone.

## 15. Exclusions

The following are explicitly out of scope for this document:

- full Scripture meaning graph completion
- AI-generated theological conclusions
- unreviewed pictographic claims as fact
- Strong replacement or deletion
- copied dictionary text without license review
- unsupported meaning ratios
- automatic NT-to-OT identity claims
- runtime UI implementation
- backend schema implementation
- data import implementation


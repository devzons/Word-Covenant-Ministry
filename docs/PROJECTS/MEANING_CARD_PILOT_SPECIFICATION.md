# Meaning Card Pilot Specification

## Subtitle

Pilot Specification for the first Meaning Card in Word Covenant Ministry.

## 1. Meaning Card란 무엇인가

Meaning Card is the reviewed, passage-first presentation of a meaning object.

It is the first place where a reader should meet the platform's meaning model in a visible, simple form.

Meaning Card is for:

- quick reading
- passage-centered understanding
- research entry
- movement into deeper study

Meaning Card is not for:

- replacing the Bible text
- replacing the dictionary
- replacing Strong
- replacing the full research trail
- replacing theology or doctrine

### Dictionary와 차이

A dictionary gives reference definitions.

Meaning Card gives a passage-bound meaning claim.

### Strong와 차이

Strong is an external coordinate.

Meaning Card is the primary research object for the passage.

### Lexicon과 차이

A lexicon organizes lexical senses and entries.

Meaning Card begins with current passage meaning and only later reaches broader lexical framing.

## 2. User Goals

When a user opens a Meaning Card, the first thing they should learn is:

- what this term means in this passage
- why the meaning is supported
- where to go next if they want more detail

The user should not be forced to start with Strong, lexical jargon, or a full evidence dump.

The card should answer the reading question first and the research question second.

## 3. Card Hierarchy

Recommended hierarchy:

1. Original Term
2. Transliteration
3. Current Passage Meaning
4. Short Summary
5. Part of Speech
6. Canonical Meaning
7. Representative Passages
8. Related Themes
9. Strong
10. Evidence Preview
11. Research Links
12. LXX
13. NT
14. Study

### Why this order

The order begins with the text the reader can see and ends with the research surfaces the researcher may want to open.

The card must remain Scripture-first and meaning-first.

## 4. Current Passage Meaning

Current Passage Meaning is the top interpretive field because the reader is standing in a specific verse or passage.

The question is not first, "What does the word mean in general?"

The first question is, "What does it mean here?"

That is why Current Passage Meaning must come before Canonical Meaning.

Canonical Meaning is broader and more stable across Scripture, but it should not obscure the meaning of the current passage.

### Rule

- Current Passage Meaning first
- Canonical Meaning second
- Lexical or historical framing after the current reading

## 5. Canonical Meaning

Canonical Meaning is the reviewed broader meaning pattern across Scripture.

It is not the same thing as Current Passage Meaning.

### Distinction

- Current Passage Meaning: the meaning active here
- Canonical Meaning: the broader reviewed pattern across Scripture

### Rule

Do not use Canonical Meaning as a substitute for the passage-level reading.

## 6. Related Themes

Themes are thematic patterns, not dictionary entries.

Examples for the pilot term include:

- 언약
- 긍휼
- 신실함
- 사랑

### Theme connection

Meaning Card should show related themes as secondary navigation or chips.

If a theme becomes a major research path, it should lead to a Theme Card or Theme Layer view rather than being expanded inside the Meaning Card itself.

## 7. Meaning Journey Entry

Meaning Card is the front door to Meaning Journey.

The card should allow the user to move from:

- the current passage meaning
- the original term
- the related themes
- the representative passages
- the language relations

into the Journey view.

### Rule

Journey starts from the reviewed meaning object, not from a bare Strong number.

## 8. Evidence Preview

Meaning Card should show only an evidence preview, not the entire evidence archive.

### Why preview only

- The card must remain readable.
- The card is an entry point, not the entire research report.
- The full evidence trail belongs in deeper research surfaces.

### Preview contents

The preview may show:

- key supporting passages
- a short evidence label
- a confidence or review label
- a link to the fuller research record

### Rule

Evidence preview must never be presented as the full proof trail.

## 9. Progressive Disclosure

Different users need different depths.

### General user

Sees:

- term
- transliteration
- current passage meaning
- short summary
- a small number of related themes

### Researcher

Sees:

- representative passages
- broader canonical meaning
- evidence preview
- journey links
- language connections

### Editor

Sees:

- review state
- evidence detail
- disputed items
- editorial observations

### Admin

Sees:

- full review workflow
- publication readiness
- relationship status
- content governance signals

## 10. Visual Hierarchy

This is not a UI implementation spec, but it does define visual priority.

### Large

- original term
- transliteration
- current passage meaning

### Medium

- short summary
- canonical meaning
- representative passages
- related themes

### Small

- Strong
- evidence preview
- research links

### Hidden behind disclosure

- full evidence
- deeper research notes
- review history
- disputed relation detail

## 11. Original Language Rule

This pilot must follow `docs/EDITORIAL_STYLE_GUIDE.md`.

### Required display

- `חֶסֶד (헤세드)`
- `λόγος (로고스)`
- `חֶסֶד (hesed)`
- `λόγος (logos)`

### Rules

- No original-language term may appear alone.
- Transliteration must appear with the term.
- Strong may never appear before the term.

## 12. Strong Rule

Strong belongs in the card as secondary information only.

### Position

Strong should appear below the primary meaning fields.

### Why

Strong is a coordinate.

It helps the user navigate, but it does not define the meaning object.

## 13. Research Links

Meaning Card should link out to the following research surfaces:

- Occurrence
- Meaning Journey
- Theme
- Study
- LXX
- NT Reception
- Publication

### Rule

Meaning Card should not swallow those surfaces.

It should lead to them.

## 14. Do Not

Meaning Card must not:

- become Strong-centered
- become dictionary-first
- mix evidence with interpretation
- mix theme with doctrine
- show original-language terms without transliteration
- hide review state when review matters
- pretend unreviewed output is settled truth

## 15. Pilot Walkthrough

### Scenario

A reader is in Hosea 6:6 and clicks `חֶסֶד (헤세드)`.

### What happens

1. The Meaning Card opens.
2. The first visible claim is the Current Passage Meaning for Hosea 6:6.
3. The card shows the original term and transliteration before any Strong label.
4. The user sees a short summary, not a wall of notes.
5. The user sees a small set of related themes, such as covenant and mercy when reviewed.
6. The user sees a compact evidence preview rather than the full archive.
7. The user can open Meaning Journey to see how the term continues into the wider canonical story.
8. The Journey can expose the reception path toward `ἔλεος (엘레오스)` and Gospel citations such as Matthew 9:13 and Matthew 12:7.
9. The user can continue into a Study or Publication surface when they need more depth.

### What the user learns

- The card is Scripture-first.
- The card is meaning-first.
- The card is not Strong-first.
- The card is not dictionary-first.
- The card is not a complete research paper.
- The card is the first step in a controlled research experience.

## Architectural Observations

- The first pilot Meaning Card likely needs a shared review-state vocabulary across Meaning, Theme, and Publication layers.
- The card should probably be the default entry point for future Theme Cards rather than the other way around.
- The difference between Current Passage Meaning and Canonical Meaning must stay visible in both the data model and the writing guide.
- Evidence preview likely needs a separate reusable bundle format later, even though this pilot does not approve it.
- The pilot suggests that Meaning Journey is more useful as a passage-to-reception path than as a pure lexical chain.


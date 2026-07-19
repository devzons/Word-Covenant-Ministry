# Word Covenant Ministry Editorial Style Guide

## Subtitle

Editorial Constitution for Word Covenant Ministry.

## 1. Purpose

This style guide defines the official editorial standard for Word Covenant Ministry across the entire project.

It applies to:

- website copy
- Meaning Card text
- Meaning Journey text
- Revelation Map labels and explanations
- Study pages
- papers
- books
- commentaries
- API documentation
- admin screens
- project documentation

The purpose of this guide is consistency.

It ensures that the same theological and editorial ideas are expressed with the same terms, the same order, and the same level of caution across the project.

This document is not a UI implementation guide and not a code implementation guide.

It is the editorial constitution for the project.

## 2. Original Language Rule

This is the most important rule in this guide.

Every original-language term must always be displayed with its transliteration.

### Required Format

- Hebrew: `חֶסֶד (헤세드)`
- Hebrew in English UI: `חֶסֶד (hesed)`
- Greek: `λόγος (로고스)`
- Greek in English UI: `λόγος (logos)`

### Rules

- Do not display original-language terms without transliteration.
- Use parentheses for transliteration.
- Apply the rule consistently across the whole platform.
- The rule applies to website copy, Meaning Card, Meaning Journey, Revelation Map, Study, papers, books, commentaries, API descriptions, admin screens, and project documents.

### Preferred Examples

- `חֶסֶד (헤세드)`
- `בָּרָא (바라)`
- `רוּחַ (루아흐)`
- `אֱלֹהִים (엘로힘)`
- `λόγος (로고스)`
- `ἀγάπη (아가페)`
- `ἔλεος (엘레오스)`
- `χάρις (카리스)`

### English UI Rule

When the surrounding UI language is English, use a Latin transliteration while still keeping the original script.

Examples:

- `חֶסֶד (hesed)`
- `λόγος (logos)`

### Do Not

- Do not use original-language script alone.
- Do not hide transliteration in tooltips only.
- Do not switch between transliteration systems without a clear reason.
- Do not treat original script as decorative text.

## 3. Meaning Card 표기

Meaning Card should present information in a stable order.

### Recommended Order

1. Original term
2. Transliteration
3. Current passage meaning
4. Short explanation
5. Part of speech
6. Strong number
7. Evidence

### Rule

Do not show Strong before the original term.

Do not make Strong the primary identity marker.

## 4. Strong 표기 규칙

Strong is secondary information.

### Format

- `Strong H2617`
- `Strong G3056`

### Rules

- Show Strong only as a supporting coordinate.
- Do not use Strong as the first or dominant identity label.
- Do not let Strong replace the original language form.

## 5. Meaning 표기

The following meaning categories must stay distinct:

- Lexical Meaning
- Canonical Meaning
- Current Passage Meaning
- Historical Meaning
- Editor Observation
- Evidence

### Rules

- Do not mix lexical meaning and passage meaning into one undifferentiated sentence.
- Do not present historical meaning as if it were identical to current passage meaning.
- Do not merge editor observation with evidence.
- Do not merge evidence with interpretation.

## 6. Evidence 표기

Evidence and interpretation are different editorial layers.

### Required Separation

- Evidence
- Interpretation
- Conclusion
- Doctrine

### Rules

- Evidence should show what supports the claim.
- Interpretation should show how the claim is read.
- Conclusion should summarize the current editorial result.
- Doctrine should only appear when the project is intentionally making a doctrinal statement, and it must remain clearly labeled.

### Do Not

- Do not write conclusion as if it were evidence.
- Do not present interpretation as if it were direct proof.
- Do not present doctrine as if it were a lexical observation.

## 7. Review 상태 표기

Use the following review states exactly:

- Generated
- Candidate
- Draft
- Reviewed
- Approved
- Disputed
- Deprecated

### User-Facing Presentation

- Generated: automatically produced and not yet editor-reviewed
- Candidate: plausible but not yet ready for publication
- Draft: editor-in-progress
- Reviewed: checked and ready for internal use
- Approved: approved for publication or release
- Disputed: disagreement exists and must remain visible
- Deprecated: retained for history but not for current use

### Rules

- Do not hide review state when it matters to interpretation.
- Do not display generated material as if it were approved truth.
- Do not collapse disputed content into approved content.

## 8. Theme 표기

Themes are not words.

They are biblical patterns.

### Theme Examples

- 언약
- 빛
- 생명
- 왕국
- 성전
- 안식
- 씨

### Rules

- Do not present theme labels as dictionary entries.
- Do not use theme labels as if they were exact lexical equivalents.
- Keep theme language concise and Scripture-centered.

## 9. Scripture Citation

Scripture citation must remain consistent across Korean, English, papers, books, and web content.

### Preferred Order

1. Bible reference
2. Original text
3. Transliteration
4. Translation

### Examples

- `창세기 1:1 / בָּרָא (바라) / “창조하다”`
- `Genesis 1:1 / בָּרָא (bara) / “create”`
- `요한복음 1:1 / λόγος (로고스) / “말씀”`
- `John 1:1 / λόγος (logos) / “Word”`

### Rules

- Keep the Bible reference first.
- Keep original language and transliteration together.
- Keep translation last in the citation line.
- Use the same citation order in prose, study pages, papers, books, API documentation, and admin screens.

## 10. Terminology

Use the following standard terms consistently:

- Meaning
- Sense
- Theme
- Doctrine
- Study
- Publication
- Occurrence
- Lemma
- Root
- Word
- Phrase
- Passage
- Event
- Typology
- Promise
- Fulfillment
- Evidence
- Observation
- Interpretation
- Conclusion

### Rules

- Meaning is the broad platform term.
- Sense is a narrower lexical or contextual branch.
- Theme is a biblical pattern, not a dictionary item.
- Doctrine is a theological conclusion, not a raw observation.
- Study is a research or learning work.
- Publication is the outward written or published form of research.
- Occurrence is one observed instance in context.
- Lemma is the dictionary headword or lexical base form.
- Root is a language-specific morphological or etymological base, when appropriately supported.
- Phrase and passage are structural units.
- Event is a historical or narrative unit.
- Typology is a pattern relationship that must remain clearly labeled.
- Promise and fulfillment are covenantal or redemptive relations.
- Evidence, observation, interpretation, and conclusion must remain distinct.

## 11. Typography

### Original Language

- Show original-language script as real text, not decorative text.
- Pair it with transliteration in parentheses.
- Use bold sparingly, only when needed for structure or emphasis.
- Avoid italics for original language unless the grammar of the surrounding text requires it.

### Headings

- Use clear, concise headings.
- Prefer title-style headings for major sections.
- Use short subsection titles for reader-friendly navigation.

### Quotations

- Keep quotation marks consistent within one document.
- Quote Scripture separately from editorial explanation.
- Do not overuse quotation marks for emphasis.

### Lists

- Use lists when they improve readability.
- Keep lists parallel in grammar and level.
- Do not mix evidence, interpretation, and conclusion in the same bullet list unless their labels are explicit.

### Tables

- Use tables only when they improve clarity.
- Keep table labels short and standard.
- Do not use tables to hide unresolved distinctions.

### Code

- Use code formatting only for literal identifiers, routes, tags, commands, or field names.
- Do not use code formatting for normal prose emphasis.

## 12. Writing Style

### General Users

For general users:

- write clearly
- keep sentences short
- keep the Scripture first
- use plain language before technical language
- explain technical terms when they first appear

### Researchers

For researchers:

- keep evidence visible
- distinguish review state
- preserve terminology precision
- show interpretive boundaries
- avoid hidden assumptions

### Papers

For papers:

- state the thesis clearly
- separate evidence from conclusion
- document method
- distinguish review from speculation
- keep citations precise and consistent

### Books

For books:

- preserve narrative flow
- keep chapter-level arguments coherent
- reuse reviewed research material
- keep terminology stable across chapters

## 13. Do Not

The following are prohibited editorial patterns:

- explaining meaning using Strong only
- using original-language terms without transliteration
- omitting transliteration for technical terms
- mixing evidence and interpretation
- hiding review state
- presenting unreviewed conclusions as fact
- presenting AI-generated output as if it were human-reviewed editorial truth
- using theme labels as dictionary entries
- using doctrine language for raw observations
- allowing inconsistent citation order across the project

## 14. Future Expansion

This style guide applies to future additions across the project, including:

- website copy
- Meaning Card
- Meaning Journey
- Revelation Map
- Study
- papers
- books
- commentaries
- API explanations
- admin screens

Any new public-facing or editorial content should follow this document unless a later approved document explicitly overrides it.


# Korean History Source Policy

## 1. Purpose

This document defines the source-review and citation-policy baseline required before `CR-92C Korean History Pilot Rows after source review` can begin.

Korean history references remain below Scripture in authority and display order.

“한국사 참조는 성경 본문을 해석하는 근거가 아니라, 시대 배경 감각을 돕는 보조 참조이다.”

Korean history references are supporting contextual aids, not grounds for interpreting Scripture.

This document does not approve real Korean-history timeline rows by itself.
It defines the policy that must be explicitly approved before pilot rows are allowed.

## 2. Authority Position

Authority order:

1. Scripture Anchor
2. Internal Biblical Sequence
3. Biblical Event / Book / Kingdom / Place Context
4. Biblical supporting date / relative year
5. World history reference
6. Korean history reference

Rules:

- Korean history references must never override Scripture.
- Korean history references must never be displayed as biblical events.
- Korean history references must not be used to prove biblical chronology.
- Korean history references remain supporting-only and below Scripture authority.

## 3. Source Categories

This policy defines source categories and approval rules.
It does not automatically mark any specific source as `approved-primary`.

### A. Official / Public Institution Sources

Examples:

- 국사편찬위원회
- 한국민족문화대백과사전
- 국립중앙박물관
- 국가유산청 / 문화재청 계열 자료
- 한국학중앙연구원

Use:

- good candidates for broad period framing, terminology, and cautious reference summaries
- still require row-safe citation metadata and approval-level tagging

### B. Public-domain / Open-license Historical Texts

Examples:

- 삼국사기
- 삼국유사
- 고려사
- 조선왕조실록

Use:

- may support source-basis labels such as primary historical text or traditional record
- original text, modern translation, annotation, and commentary may have different copyright status
- copyright and edition status must be checked separately

### C. Academic / Scholarly References

Examples:

- university press works
- peer-reviewed scholarship
- academically controlled historical reference works

Use:

- may support cautious scholarly summary labels
- copyrighted prose must not be copied into package rows
- use fact summary plus citation metadata only

### D. Educational / Government Curriculum Summaries

Use:

- useful for broad period labels and non-controversial overview framing
- copied prose is not allowed
- do not treat educational simplification as final scholarly proof

### E. Not Approved By Default

These must not be used as default package-data sources:

- unsourced blogs
- random internet summaries
- AI-generated summaries as source
- Wikipedia as a primary source
- copied prose from copyrighted textbooks
- nationalist or polemical materials without scholarly control

## 4. Source Approval Levels

Allowed approval levels:

- `approved-primary`
  - may serve as the main source basis for a row
- `approved-supporting`
  - may serve as a secondary confirmation source
- `review-required`
  - source identified, but not yet approved for package-row use
- `rejected`
  - should not be used for package-row content
- `citation-only`
  - may be cited in roadmap or review documentation, but not yet used as a package-data source

Policy:

- pilot rows should use `approved-primary` or `approved-supporting` sources only
- mixed-source rows must still have one explicit source basis label
- uncertain or disputed material should remain `review-required` until explicitly approved

## 5. Citation Metadata Requirements

Every future Korean history row must eventually carry:

- `sourceId`
- `sourceTitle`
- `sourceProvider`
- `sourceUrl` or bibliographic reference
- `sourceLicenseLabel`
- `sourceAccessDate`
- `sourceBasisLabel`
- `sourceApprovalLevel`
- `quotationPolicy`
- `note`

Offline or print-source metadata should additionally include:

- `authorOrEditor`
- `publisher`
- `publicationYear`
- `pageRange`, if used
- `copyrightStatus`
- `quotationLimit`

Rules:

- no row may be approved without `sourceBasisLabel`
- no row may be approved without a traceable source title and provider
- citation metadata should identify the source basis, not reproduce protected prose
- access-date tracking is required for online institutional sources

## 6. Row-Level Source Basis Labels

Required label vocabulary for future Korean history rows:

Korean:

- 공식 기관 자료
- 사료 기반
- 전통 기록
- 현대 학계 해석
- 교육용 개설 자료
- 출처 검토 필요
- 논의 중
- 보조 참조
- 성경 해석 근거 아님

English:

- Official institutional source
- Primary historical text
- Traditional record
- Modern scholarly interpretation
- Educational overview
- Source review required
- Debated
- Supporting reference
- Not a basis for biblical interpretation

Policy:

- every Korean-history row must include a source-basis label
- every Korean-history row must include a supporting-only / non-interpretive label
- debated or low-confidence material must not appear without caution labeling

## 7. Chronology Label Policy

Future Korean-history date presentation must never use a standalone exact-looking date.

Required row-level chronology fields:

- `dateLabel`
- `dateBasisLabel`
- `confidenceLabel`
- `cautionNote`

Allowed chronology label categories:

- traditional date
- approximate period
- scholarly estimate
- debated chronology
- source-attested date
- later historical period
- reference only

Korean equivalents:

- 전통 연대
- 대략적 시대
- 학술 추정
- 논의 중
- 사료 기준
- 참조용

Rules:

- 단군 / 고조선 관련 연대는 반드시 `전통 연대`, `논의 중`, `참조용` 같은 caution labels가 필요하다
- exact BC/AD-style display requires source basis and caution metadata
- no exact-looking date may appear without `dateBasisLabel` and `confidenceLabel`
- chronology must remain subordinate to Scripture anchors and biblical sequence

## 8. Quotation and Copyright Policy

Rules:

- do not copy long prose from modern copyrighted sources
- prefer paraphrased factual summaries
- store citation metadata, not source prose
- public-domain original texts may still be paired with copyrighted translation or annotation
- dataset rows should contain short factual summaries only
- avoid copied textbook explanations

Row policy:

- no long quotation blocks
- no commentary-style copied explanation
- no source text repository behavior

## 9. Pilot Row Approval Criteria

Before `CR-92C` can add `3-5` pilot rows, all of the following must be true:

1. At least one `approved-primary` or `approved-supporting` source category is explicitly selected by the user or project.
2. Citation metadata shape is finalized.
3. Row-level `sourceBasisLabel` policy is finalized.
4. Chronology label policy is finalized.
5. Verifier requirements for Korean reference rows are documented.
6. Pilot rows are limited to broad, low-risk period references.
7. Each row includes:
   - `isSupportingReference: true`
   - `referenceTypeLabel`
   - `sourceBasisLabel`
   - `confidenceLabel`
   - `cautionNote`
   - a not-a-basis-for-biblical-interpretation label

This document satisfies the policy-definition part of the gate.
It does not satisfy the final approval step by itself.

## 10. Recommended Pilot Scope

Do not implement rows in this step.
This section defines only broad, low-risk pilot categories.

Safer first-pass categories:

- broad prehistoric / Bronze Age reference
- broad Gojoseon traditional-reference note
- broad Han Commanderies / Proto-Three-Kingdoms reference
- broad Three Kingdoms or later church-history reference only where it clearly sits outside biblical-canon event authority

Cautions:

- avoid detailed controversial claims in the first pilot
- prefer broad period labels over exact synchronism
- keep all rows clearly secondary to biblical content

## 11. Gate Status

Current policy status after this step:

- `gate-ready-for-user-approval`

Meaning:

- the policy draft exists
- source categories, citation metadata, row-level source-basis labels, and chronology label policy are now defined
- `CR-92C` is still not automatically open
- explicit user or project approval of selected sources is still required before pilot rows begin

## 12. Non-goals

- Not a Korean history database.
- Not a nationalist history layer.
- Not a biblical chronology proof layer.
- Not an imported dataset.
- Not a map layer.
- Not a source text repository.

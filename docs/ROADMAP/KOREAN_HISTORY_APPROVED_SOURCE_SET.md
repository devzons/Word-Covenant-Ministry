# Korean History Approved Source Set

## 1. Purpose

This document defines the approved source set for `CR-92C Korean History Pilot Rows`.

Korean history references are not a basis for interpreting biblical text.
Korean history references are supporting aids that help users read biblical-era flow with broad historical context.

This document is not data-import approval.
This document is a source and citation approval step for a small manually curated pilot.

## 2. Approval Status

Current status:

- `approved-for-pilot`

This approval is limited:

- only for manually curated pilot rows
- only for broad, low-risk reference rows
- no bulk import
- no copied prose
- no exact chronology without caution labels

Rules:

- This approval does not authorize automated import.
- This approval does not authorize copying source prose.
- This approval does not authorize exact historical synchronization with biblical events.

## 3. Approved Primary Sources

Approved-primary source categories for pilot use:

### 1. 국사편찬위원회

- `sourceProvider`: National Institute of Korean History
- `approvalLevel`: `approved-primary`
- approved use:
  - broad Korean historical period reference
  - official historical overview
  - source guidance for cautious pilot summaries
- caution:
  - do not copy prose
  - summarize only
  - exact source URL or bibliographic detail should be filled when a real row is created

### 2. 한국민족문화대백과사전

- `sourceProvider`: Academy of Korean Studies / Encyclopedia of Korean Culture
- `approvalLevel`: `approved-primary` or `approved-supporting` depending on article and rights posture
- approved use:
  - period-level reference
  - article-level background guidance
- caution:
  - article copyright and license posture must still be respected
  - use citation metadata and paraphrase
  - do not copy article prose into package rows

## 4. Approved Supporting Sources

Approved-supporting categories:

### 1. 국립중앙박물관

- `sourceProvider`: National Museum of Korea
- `approvalLevel`: `approved-supporting`
- approved use:
  - artifact context
  - cultural-period context
- caution:
  - do not treat artifact period as exact biblical synchronization

### 2. 국가유산청 / 문화재청 계열 자료

- `sourceProvider`: Korea Heritage Service / Cultural Heritage Administration
- `approvalLevel`: `approved-supporting`
- approved use:
  - heritage or cultural-period references
- caution:
  - source-specific copyright and reuse status must still be checked at row time

### 3. 한국학중앙연구원

- `sourceProvider`: Academy of Korean Studies
- `approvalLevel`: `approved-supporting`
- approved use:
  - Korean studies reference support
  - terminology and cautious contextual framing
- caution:
  - use citation metadata and paraphrase

### 4. Additional supporting categories

The following categories may be used as supporting-only when provider and provenance are explicit:

- government or public educational summaries
- museum exhibit descriptions with clear provider identity
- public-domain original historical texts, only after translation and annotation copyright status review
- scholarly secondary sources using citation metadata only

Rules:

- supporting sources cannot override approved-primary categories
- supporting sources cannot be the sole basis for controversial chronology
- supporting sources cannot be copied verbatim into data rows

## 5. Not Approved Sources

Not approved for package-row source use:

- Wikipedia as a primary source
- unsourced blogs
- AI-generated summaries
- random internet articles
- copied prose from copyrighted textbooks
- nationalist or polemical sources without scholarly control
- user memory alone
- model memory alone

## 6. Row-Level Source Metadata Required

Every future Korean history row must include:

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

Offline-source fields if applicable:

- `authorOrEditor`
- `publisher`
- `publicationYear`
- `pageRange`
- `copyrightStatus`
- `quotationLimit`

Rules:

- no row may be approved without `sourceBasisLabel`
- no row may be approved without traceable source metadata
- citation metadata identifies source basis; it does not store protected prose

## 7. Approved Source Basis Labels

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

## 8. Chronology and Confidence Rules

Every future row with a date or period must include:

- `dateLabel`
- `dateBasisLabel`
- `confidenceLabel`
- `cautionNote`

Allowed labels:

- traditional date / 전통 연대
- approximate period / 대략적 시대
- scholarly estimate / 학술 추정
- debated chronology / 논의 중
- source-attested date / 사료 기준
- reference only / 참조용

Special caution:

- 단군 / 고조선 관련 연대는 traditional, debated, and reference-only caution labels가 필요하다
- exact-looking dates cannot appear without source basis and caution metadata
- Korean chronology must never be used to prove biblical chronology

## 9. Pilot Row Scope Approved

This approval covers only the following pilot scope:

- broad prehistoric or Bronze Age reference
- broad Gojoseon traditional-reference note
- broad Han Commanderies or Proto-Three-Kingdoms reference
- broad Three Kingdoms or post-biblical church-history reference only where it remains outside biblical-canon event authority

Rules:

- `3-5` rows maximum in the first pilot
- broad period labels only
- no detailed synchronism
- no exact biblical event alignment
- no controversial claim without caution labeling
- supporting-only
- collapsed or reference-layer presentation only

## 10. Gate Decision

Gate status after this document:

- `approved-for-pilot`

Meaning:

- `CR-92C` may proceed with `3-5` manually curated pilot rows
- pilot rows must use approved source categories
- pilot rows must include required citation metadata
- pilot rows must remain broad supporting references only
- any bulk import remains prohibited

## 11. Non-goals

- Not a Korean history database
- Not a world-history synchronization engine
- Not a source import approval
- Not a map or coordinate layer
- Not a biblical chronology proof layer
- Not an interpretation layer

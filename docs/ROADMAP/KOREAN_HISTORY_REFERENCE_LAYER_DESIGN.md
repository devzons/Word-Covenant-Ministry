# Korean History Reference Layer Design

## 1. Purpose

This layer helps users understand approximate historical context around biblical-era flow.
It must not become interpretive authority over Scripture.
It is not a parallel sacred history.
It is a reference layer below Scripture, below biblical chronology, and below Scripture anchors.

Korean principle wording:

“한국사 참조는 성경 해석의 근거가 아니라, 성경 시대 흐름을 읽을 때 동시대 또는 근접 시대의 역사적 배경 감각을 돕기 위한 보조 정보이다.”

English equivalent:

“Korean history references are supporting contextual aids, not grounds for interpreting Scripture.”

## 2. Authority Order

The display and interpretation order must remain strict:

1. Scripture Anchor
2. Internal Biblical Sequence
3. Biblical Event / Book / Kingdom / Place Context
4. Biblical supporting date or relative year
5. World history reference
6. Korean history reference

Rules:

- Korean history must never override biblical sequence.
- Korean history must never determine biblical interpretation.
- Korean history must never be displayed as equal to Scripture anchors.

## 3. UI Placement

Recommended placement:

- Not a primary Timeline tab at first.
- Not mixed as normal event rows.
- Add as an optional collapsed reference section inside period blocks.

Preferred UI:

- Period-level `한국사 참조` collapsible section.
- Default collapsed.
- Small muted style.
- Clearly labeled `참조용 / 성경 해석 근거 아님`.

Example:

족장 시대

성경 흐름:

- 아브라함
- 이삭
- 야곱
- 요셉

보조 참조:

▸ 한국사 참조

- 한반도 선사 / 청동기 문화권 참조
- 대략적 시대 감각을 위한 보조 정보
- 성경 해석 근거 아님

## 4. Data Model Proposal

Future frontend-only type proposal only. Do not implement yet.

```ts
type TimelineReferenceHistoryRow = {
  id: string;
  periodId: string;
  region: "korea" | "world";
  title: TimelineText;
  dateLabel?: TimelineText;
  dateBasisLabel: TimelineText;
  confidenceLabel: TimelineText;
  sourceBasisLabel: TimelineText;
  referenceTypeLabel: TimelineText;
  relatedBiblicalPeriodIds?: string[];
  note: TimelineText;
  cautionNote: TimelineText;
  isSupportingReference: true;
};
```

Required labels:

- 참조용
- 보조 연대
- 전통 연대
- 대략적 시대
- 논의 중
- 성경 해석 근거 아님

English:

- Reference only
- Supporting date
- Traditional date
- Approximate period
- Debated
- Not a basis for biblical interpretation

## 5. Korean History Period Mapping Proposal

Do not assert detailed facts as final data. Present only a cautious framework.

### 1. Primeval / Patriarchal Preview

- Korean reference category: 한반도 선사 / 청동기 문화권 참조
- Label: 대략적 시대 / 참조용
- Caution: 성경 사건과 직접 연결하지 않음

### 2. Exodus / Wilderness

- Korean reference category: 한반도 선사·청동기 문화 흐름 참조
- Label: 대략적 시대 / 참조용

### 3. Conquest / Judges

- Korean reference category: 고조선 전승 / 초기 국가 형성 참조
- Label: 전통 연대와 역사 논의 구분 필요

### 4. United Kingdom / Divided Kingdom

- Korean reference category: 고조선 관련 전승과 동북아 초기 국가 형성 참조
- Label: 전통 / 논의 중 / 참조용

### 5. Exile / Return

- Korean reference category: 고조선 후기 / 동북아 정세 참조
- Label: 대략적 시대 / 참조용

### 6. Intertestamental / New Testament

- Korean reference category: 한사군 이후 / 원삼국·삼한·초기 삼국 형성 참조
- Label: 역사 참조 / 성경 해석 근거 아님

### 7. Post-biblical Church History

- Korean reference category: 삼국 / 통일신라·발해 / 고려 / 조선 / 근현대 한국 교회사
- Label: 교회사·세계사 참조

This belongs outside biblical canon timeline proper, or in a later Church History workspace.

Important:

- These are design categories, not imported data.
- Do not populate exact date rows yet.
- Exact Korean historical claims require approved sources and source policy.

## 6. Source and License Policy

- Korean history reference data cannot be imported without source/license review.
- Use only approved public-domain/open-license/officially allowed sources.
- Every row must eventually carry `sourceBasisLabel`.
- Avoid copying copyrighted text.
- Do not use unsourced internet summaries as project data.
- Ancient Korean history with debated chronology must be labeled.

## 7. Display Labels

Korean UI labels:

- 한국사 참조
- 보조 참조
- 시대 감각
- 전통 연대
- 대략적 시대
- 논의 중
- 성경 해석 근거 아님
- 출처 검토 필요

English labels:

- Korean History Reference
- Supporting Reference
- Historical Context
- Traditional Date
- Approximate Period
- Debated
- Not a Basis for Biblical Interpretation
- Source Review Required

## 8. Non-goals

- Not a Korean history database.
- Not a replacement for Scripture chronology.
- Not a world-history synchronization engine.
- Not a nationalist history layer.
- Not a doctrine or interpretation layer.
- Not a map/coordinate layer.
- Not an imported dataset.

## 9. Recommended Implementation Phases

Gate note:

- `CR-92C` cannot safely begin until source review and source-basis approval are explicit.
- `CR-92C-0` now exists as a readiness gate in `docs/ROADMAP/KOREAN_HISTORY_SOURCE_REVIEW_GATE.md`.
- Current gate result: blocked until an approved source set and citation policy are documented.

### Phase CR-92A

- Design doc only.

### Phase CR-92B

- Add UI labels and empty collapsed `한국사 참조` placeholder only.
- No data yet.

### Phase CR-92C-0

- Source review gate and readiness check only.
- Confirm whether an approved source set exists.
- Confirm citation and source-basis policy.
- Do not add rows unless the gate is approved.

### Phase CR-92C

- Add 3–5 manually curated Korean reference rows as pilot.
- All rows clearly marked supporting/reference only.
- Source basis required.

### Phase CR-92D

- Source review and data policy.
- Decide approved Korean history sources.

### Phase CR-92E

- Optional broader Korean/world reference layer after approval.

## 10. Acceptance Criteria

- The design clearly keeps Korean history below Scripture.
- No implementation code added.
- No data imported.
- No exact chronology asserted as final.
- Uncertain/traditional/debated periods are labeled.
- Roadmap is updated to show CR-92A as design-only.

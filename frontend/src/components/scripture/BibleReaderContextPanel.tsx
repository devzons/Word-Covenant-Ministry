"use client";

import { ContextRow } from "@/components/scripture/timeline/timeline-detail-panel/ContextRow";
import { PanelSection } from "@/components/scripture/timeline/timeline-detail-panel/PanelSection";
import { ScriptureAnchorsSection } from "@/components/scripture/timeline/timeline-detail-panel/ScriptureAnchorsSection";
import { SectionNote } from "@/components/scripture/timeline/timeline-detail-panel/SectionNote";
import { getTimelineText, type TimelineBookContextRow, type TimelineLocale } from "@/components/scripture/timeline/passionWeekTimeline";

type BibleReaderContextPanelProps = {
  bookContext: TimelineBookContextRow | null;
  chapter: number;
  locale: string;
  selectedVerse?: number | null;
};

const bibleReaderContextCopy = {
  en: {
    title: "Context",
    description:
      "This panel shows book-level preview metadata only. It does not infer verse-level entities from the current chapter text.",
    bookScope: "Current book context",
    canonical: "Canonical location",
    authorship: "Authorship / Basis",
    background: "Background / Dating",
    scriptureAnchors: "Scripture Anchors",
    packageBasis: "Package basis",
    evidenceConfidence: "Evidence confidence",
    authorshipLabel: "Authorship",
    authorshipBasis: "Authorship basis",
    backgroundSetting: "Background setting",
    backgroundBasis: "Background basis",
    dateLabel: "Date label",
    dateConfidence: "Date confidence",
    caution: "Caution",
    selectedVerse: "Current selected verse",
    verseFuture:
      "Verse-level entity tagging remains a future phase. The current panel does not infer people, places, kingdoms, or names from this verse automatically.",
    missing:
      "Context metadata for the current book is not yet connected.",
    missingNote:
      "For now this reader surface can only show book-level metadata when a package-backed context row is available.",
    referenceOnly:
      "These Scripture anchors are shown as reference-only metadata. Bible text remains in the reader column.",
  },
  ko: {
    title: "문맥",
    description:
      "이 패널은 현재 책 기준의 preview metadata만 표시합니다. 현재 장 본문에서 절 단위 엔티티를 자동 해석하지 않습니다.",
    bookScope: "현재 책 문맥",
    canonical: "정경 위치",
    authorship: "저자 / 근거",
    background: "배경 / 연대",
    scriptureAnchors: "성경 근거",
    packageBasis: "패키지 기준",
    evidenceConfidence: "근거 신뢰",
    authorshipLabel: "저자",
    authorshipBasis: "저자 근거",
    backgroundSetting: "배경 연결",
    backgroundBasis: "배경 근거",
    dateLabel: "연대 표기",
    dateConfidence: "연대 신뢰",
    caution: "주의",
    selectedVerse: "현재 선택 절",
    verseFuture:
      "절 단위 entity tagging은 future phase로 남아 있습니다. 현재 패널은 이 절에서 사람, 장소, 왕국, 이름을 자동 인식하지 않습니다.",
    missing:
      "현재 책의 context metadata가 아직 연결되지 않았습니다.",
    missingNote:
      "현재 reader surface는 package-backed 책 문맥 row가 있을 때만 책 수준 metadata를 표시할 수 있습니다.",
    referenceOnly:
      "이 성경 근거는 reference-only metadata로만 표시됩니다. 성경 본문은 reader 영역에 남아 있습니다.",
  },
} as const;

export function BibleReaderContextPanel({
  bookContext,
  chapter,
  locale,
  selectedVerse,
}: BibleReaderContextPanelProps) {
  const activeLocale: TimelineLocale = locale === "en" ? "en" : "ko";
  const copy = bibleReaderContextCopy[activeLocale];

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-zinc-950">{copy.title}</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600">{copy.description}</p>
      </div>

      {!bookContext ? (
        <div className="rounded-md border border-zinc-200 bg-white px-4 py-4">
          <p className="text-sm font-medium text-zinc-900">{copy.missing}</p>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{copy.missingNote}</p>
        </div>
      ) : (
        <>
          <PanelSection label={copy.bookScope}>
            <ContextRow
              label={copy.bookScope}
              value={getTimelineText(bookContext.title, activeLocale)}
            />
            <ContextRow
              label={copy.canonical}
              value={getTimelineText(bookContext.canonicalLocation, activeLocale)}
            />
            {selectedVerse ? (
              <>
                <ContextRow
                  label={copy.selectedVerse}
                  value={`${chapter}:${selectedVerse}`}
                />
                <SectionNote>{copy.verseFuture}</SectionNote>
              </>
            ) : null}
          </PanelSection>

          <ScriptureAnchorsSection
            anchors={bookContext.scriptureAnchors}
            label={copy.scriptureAnchors}
            locale={activeLocale}
            openInReaderLabel={copy.scriptureAnchors}
            referenceOnly
            referenceOnlyDescription={copy.referenceOnly}
            rowId={bookContext.id}
          />

          <PanelSection label={copy.authorship}>
            {bookContext.authorshipLabel ? (
              <ContextRow
                label={copy.authorshipLabel}
                value={getTimelineText(bookContext.authorshipLabel, activeLocale)}
              />
            ) : null}
            {bookContext.authorshipBasisLabel ? (
              <ContextRow
                label={copy.authorshipBasis}
                value={getTimelineText(bookContext.authorshipBasisLabel, activeLocale)}
              />
            ) : null}
          </PanelSection>

          <PanelSection label={copy.background}>
            {bookContext.historicalSettingLabel ? (
              <ContextRow
                label={copy.backgroundSetting}
                value={getTimelineText(bookContext.historicalSettingLabel, activeLocale)}
              />
            ) : null}
            {bookContext.backgroundBasisLabel ? (
              <ContextRow
                label={copy.backgroundBasis}
                value={getTimelineText(bookContext.backgroundBasisLabel, activeLocale)}
              />
            ) : null}
            {bookContext.dateLabel ? (
              <ContextRow
                label={copy.dateLabel}
                value={getTimelineText(bookContext.dateLabel, activeLocale)}
              />
            ) : null}
            {bookContext.dateConfidenceLabel ? (
              <ContextRow
                label={copy.dateConfidence}
                value={getTimelineText(bookContext.dateConfidenceLabel, activeLocale)}
              />
            ) : null}
            {bookContext.basisLabel ? (
              <ContextRow
                label={copy.packageBasis}
                value={getTimelineText(bookContext.basisLabel, activeLocale)}
              />
            ) : null}
            {bookContext.confidenceLabel ? (
              <ContextRow
                label={copy.evidenceConfidence}
                value={getTimelineText(bookContext.confidenceLabel, activeLocale)}
              />
            ) : null}
            {bookContext.note ? (
              <SectionNote>{getTimelineText(bookContext.note, activeLocale)}</SectionNote>
            ) : null}
          </PanelSection>
        </>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";

import { ContextRow } from "@/components/scripture/timeline/timeline-detail-panel/ContextRow";
import { PanelSection } from "@/components/scripture/timeline/timeline-detail-panel/PanelSection";
import { ScriptureAnchorsSection } from "@/components/scripture/timeline/timeline-detail-panel/ScriptureAnchorsSection";
import { SectionNote } from "@/components/scripture/timeline/timeline-detail-panel/SectionNote";
import { Tag } from "@/components/scripture/timeline/timeline-detail-panel/Tag";
import { getTimelineText, type TimelineBookContextRow, type TimelineLocale, type TimelineText } from "@/components/scripture/timeline/passionWeekTimeline";

export type BibleReaderRelatedMetadataPreviewItem = {
  id: string;
  label: TimelineText;
  timelineHref?: string;
};

export type BibleReaderRelatedMetadataPreview = {
  books: BibleReaderRelatedMetadataPreviewItem[];
  events: BibleReaderRelatedMetadataPreviewItem[];
  kingdoms: BibleReaderRelatedMetadataPreviewItem[];
  places: BibleReaderRelatedMetadataPreviewItem[];
};

type BibleReaderContextPanelProps = {
  bookContext: TimelineBookContextRow | null;
  chapter: number;
  locale: string;
  relatedMetadata: BibleReaderRelatedMetadataPreview;
  selectedVerse?: number | null;
};

const bibleReaderContextCopy = {
  en: {
    title: "Context",
    description:
      "This panel shows book-level preview metadata only for the current book. It does not infer verse-level entities from the current chapter text.",
    bookScope: "Current book context",
    canonical: "Canonical location",
    authorship: "Authorship / Basis",
    background: "Background / Dating",
    scriptureAnchors: "Scripture Anchors",
    packageBasis: "Package basis",
    evidenceConfidence: "Evidence confidence",
    relatedMetadata: "Related metadata preview",
    relatedMetadataNote:
      "Related metadata is derived from current book-level preview data only.",
    relatedMetadataBoundary:
      "This does not mean the selected verse has been entity-tagged.",
    relatedMetadataTimeline:
      "This opens current book-level preview metadata in the Timeline validation view.",
    relatedMetadataTimelineSurface:
      "Timeline remains an advanced study and validation surface.",
    relatedEvents: "Related events",
    relatedPlaces: "Related places",
    relatedKingdoms: "Related kingdoms",
    relatedBooks: "Related books",
    openInTimeline: "Open in advanced Timeline",
    authorshipLabel: "Authorship",
    authorshipBasis: "Authorship basis",
    backgroundSetting: "Background setting",
    backgroundBasis: "Background basis",
    dateLabel: "Date label",
    dateConfidence: "Date confidence",
    caution: "Caution",
    selectedVerse: "Current selected verse",
    verseFuture:
      "This verse reference is shown only as a reader-state hint. Verse-level people, places, kingdoms, names, and maps remain future phases.",
    missing:
      "Context metadata for the current book is not yet connected.",
    missingNote:
      "For now this reader panel can only show book-level metadata when a package-backed context row is available.",
    noRelatedMetadata:
      "No related preview metadata is connected for this book yet.",
    referenceOnly:
      "These Scripture anchors are shown as reference-only metadata. Bible text remains in the reader column.",
  },
  ko: {
    title: "문맥",
    description:
      "이 패널은 현재 책 기준의 preview metadata만 표시합니다. 현재 장 본문을 절 단위 entity로 자동 분석하지 않습니다.",
    bookScope: "현재 책 문맥",
    canonical: "정경 위치",
    authorship: "저자 / 근거",
    background: "배경 / 연대",
    scriptureAnchors: "성경 근거",
    packageBasis: "패키지 기준",
    evidenceConfidence: "근거 신뢰",
    relatedMetadata: "관련 metadata 미리보기",
    relatedMetadataNote:
      "관련 항목은 현재 책 기준 preview metadata에서만 가져온 것입니다.",
    relatedMetadataBoundary:
      "이 표시는 선택 절에 사람/장소/왕국 태그가 붙었다는 뜻이 아닙니다.",
    relatedMetadataTimeline:
      "이 링크는 현재 책 기준 preview metadata를 Timeline 검증 화면에서 엽니다.",
    relatedMetadataTimelineSurface:
      "Timeline은 고급 연구/검증 화면입니다.",
    relatedEvents: "관련 사건",
    relatedPlaces: "관련 장소",
    relatedKingdoms: "관련 왕국",
    relatedBooks: "관련 책",
    openInTimeline: "고급 Timeline에서 보기",
    authorshipLabel: "저자",
    authorshipBasis: "저자 근거",
    backgroundSetting: "배경 연결",
    backgroundBasis: "배경 근거",
    dateLabel: "연대 표기",
    dateConfidence: "연대 신뢰",
    caution: "주의",
    selectedVerse: "현재 선택 절",
    verseFuture:
      "이 절 표시는 reader 상태를 보여 주는 참고 표시일 뿐입니다. 절 단위 인물, 장소, 왕국, 이름, 지도 연결은 이후 단계입니다.",
    missing:
      "현재 책의 context metadata가 아직 연결되지 않았습니다.",
    missingNote:
      "현재 reader 패널은 package-backed 책 문맥 row가 있을 때만 책 수준 metadata를 표시할 수 있습니다.",
    noRelatedMetadata:
      "이 책에 연결된 관련 preview metadata가 아직 없습니다.",
    referenceOnly:
      "이 성경 근거는 reference-only metadata로만 표시됩니다. 성경 본문은 reader 영역에 남아 있습니다.",
  },
} as const;

export function BibleReaderContextPanel({
  bookContext,
  chapter,
  locale,
  relatedMetadata,
  selectedVerse,
}: BibleReaderContextPanelProps) {
  const activeLocale: TimelineLocale = locale === "en" ? "en" : "ko";
  const copy = bibleReaderContextCopy[activeLocale];
  const hasRelatedMetadata =
    relatedMetadata.events.length > 0 ||
    relatedMetadata.places.length > 0 ||
    relatedMetadata.kingdoms.length > 0 ||
    relatedMetadata.books.length > 0;

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

          <PanelSection label={copy.relatedMetadata}>
            {hasRelatedMetadata ? (
              <>
                {relatedMetadata.events.length > 0 ? (
                  <MetadataPreviewTagGroup
                    items={relatedMetadata.events}
                    label={copy.relatedEvents}
                    locale={activeLocale}
                    openInTimelineLabel={copy.openInTimeline}
                  />
                ) : null}
                {relatedMetadata.places.length > 0 ? (
                  <MetadataPreviewTagGroup
                    items={relatedMetadata.places}
                    label={copy.relatedPlaces}
                    locale={activeLocale}
                    openInTimelineLabel={copy.openInTimeline}
                  />
                ) : null}
                {relatedMetadata.kingdoms.length > 0 ? (
                  <MetadataPreviewTagGroup
                    items={relatedMetadata.kingdoms}
                    label={copy.relatedKingdoms}
                    locale={activeLocale}
                    openInTimelineLabel={copy.openInTimeline}
                  />
                ) : null}
                {relatedMetadata.books.length > 0 ? (
                  <MetadataPreviewTagGroup
                    items={relatedMetadata.books}
                    label={copy.relatedBooks}
                    locale={activeLocale}
                    openInTimelineLabel={copy.openInTimeline}
                  />
                ) : null}
              </>
            ) : (
              <SectionNote>{copy.noRelatedMetadata}</SectionNote>
            )}
            <SectionNote>{copy.relatedMetadataNote}</SectionNote>
            <SectionNote>{copy.relatedMetadataBoundary}</SectionNote>
            <SectionNote>{copy.relatedMetadataTimeline}</SectionNote>
            <SectionNote>{copy.relatedMetadataTimelineSurface}</SectionNote>
          </PanelSection>

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

function MetadataPreviewTagGroup({
  items,
  label,
  locale,
  openInTimelineLabel,
}: {
  items: BibleReaderRelatedMetadataPreviewItem[];
  label: string;
  locale: TimelineLocale;
  openInTimelineLabel: string;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <div
            className="flex flex-wrap items-center gap-2"
            key={`${label}-${item.id}`}
          >
            <Tag>{getTimelineText(item.label, locale)}</Tag>
            {item.timelineHref ? (
              <Link
                className="text-xs font-semibold text-zinc-600 underline decoration-zinc-300 underline-offset-2 transition-colors hover:text-zinc-900 hover:decoration-zinc-500"
                href={item.timelineHref}
              >
                {openInTimelineLabel}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import type { ReactNode } from "react";

import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

import {
  getTimelineBook,
  getTimelineDatePreview,
  getTimelinePlace,
  getTimelineReaderHrefFromReader,
  getTimelineText,
  timelineBookContextRows,
  timelineGenealogyComparisonRows,
  timelineGenealogySegments,
  timelineKingdomComparisonRows,
  timelineSchematicPlaceRows,
  type PassionWeekTimelineEvent,
  type TimelineBookContextRow,
  type TimelineGenealogyComparisonRow,
  type TimelineInspectorSelection,
  type TimelineKingdomComparisonRow,
  type TimelineLocale,
  type TimelineSchematicPlaceRow,
  type TimelineText,
} from "./passionWeekTimeline";
import { TimelineDatingNote } from "./TimelineDatingNote";
import type { TimelineHighlightState } from "./timelineHighlightState";
import type { TimelineKingsKingdomsPreviewRow } from "./timelineKingsKingdomsPackage";

type TimelineEventDetailPanelProps = {
  highlightState?: TimelineHighlightState;
  lookupMaps: TimelineEvidenceLookupMaps;
  onSelectInspectorItem: (selection: TimelineInspectorSelection) => void;
  selection: TimelineInspectorSelection;
  panelHeading: string;
  locale: TimelineLocale;
  noSelection: string;
  openInReaderLabel: string;
  relatedStudy: string;
  selectedLabel: string;
};

type TimelineInspectorSelectionItem = Exclude<TimelineInspectorSelection, null>;
type TimelineInspectorSelectionType = TimelineInspectorSelectionItem["type"];

type TimelineKingdomEvidenceRow = TimelineKingdomComparisonRow | TimelineKingsKingdomsPreviewRow;

type TimelineEvidenceLookupMaps = {
  bookContextById: Map<string, TimelineBookContextRow>;
  bookContextByBookId: Map<string, TimelineBookContextRow>;
  eventById: Map<string, PassionWeekTimelineEvent>;
  genealogyComparisonById: Map<string, TimelineGenealogyComparisonRow>;
  kingdomComparisonById: Map<string, TimelineKingdomEvidenceRow>;
  schematicPlaceById: Map<string, TimelineSchematicPlaceRow>;
  schematicPlaceByPlaceId: Map<string, TimelineSchematicPlaceRow>;
};

const kingdomToGenealogyLinks: Record<string, string[]> = {
  "comparison-jehoiachin-jeconiah": ["genealogy-josiah-jeconiah", "genealogy-jeconiah-exile"],
  "comparison-uzziah-azariah": ["genealogy-joram-uzziah", "genealogy-uzziah-azariah"],
};

const genealogyToKingdomLinks: Record<string, string[]> = {
  "genealogy-jeconiah-exile": ["comparison-jehoiachin-jeconiah"],
  "genealogy-josiah-jeconiah": ["comparison-jehoiachin-jeconiah"],
  "genealogy-joram-uzziah": ["comparison-uzziah-azariah"],
  "genealogy-uzziah-azariah": ["comparison-uzziah-azariah"],
};

export function TimelineEventDetailPanel({
  highlightState,
  lookupMaps,
  onSelectInspectorItem,
  selection,
  panelHeading,
  locale,
  noSelection,
  openInReaderLabel,
  relatedStudy,
  selectedLabel,
}: TimelineEventDetailPanelProps) {
  const selectedType = selection?.type ?? null;
  const selectionId = selection?.id ?? "";
  const event = selectedType === "event" ? lookupMaps.eventById.get(selectionId) : undefined;
  const bookRow = selectedType === "book" ? lookupMaps.bookContextById.get(selectionId) : undefined;
  const kingdomRow = selectedType === "kingdom" ? lookupMaps.kingdomComparisonById.get(selectionId) : undefined;
  const genealogyRow =
    selectedType === "genealogy" ? lookupMaps.genealogyComparisonById.get(selectionId) : undefined;
  const placeRow = selectedType === "place" ? lookupMaps.schematicPlaceById.get(selectionId) : undefined;
  const hasDerivedHighlights = Boolean(
    highlightState?.highlightedItems.some((item) => item.reason !== "selected") ||
      highlightState?.highlightedSections.length ||
      highlightState?.highlightedBookIds.length,
  );

  return (
    <Card className="flex min-w-0 flex-col gap-4 sm:gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">{panelHeading}</p>
        {!selection || (!event && !bookRow && !kingdomRow && !genealogyRow && !placeRow) ? (
          <div className="space-y-3">
            <p className="text-base leading-7 text-zinc-600">{noSelection}</p>
            <p className="text-sm leading-6 text-zinc-500">
              {locale === "ko"
                ? "연대, 장소, 전통 정보는 성경 본문 아래의 보조 정보로 표시됩니다."
                : "Dates, places, and tradition labels are shown as supporting information under the biblical text."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full border border-zinc-900 bg-zinc-950 px-2.5 py-1 text-[11px] font-semibold leading-none text-white">
                {selectedLabel}
              </span>
              <span className="inline-flex rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold leading-none text-zinc-700">
                {getSelectionTypeLabel(selectedType, locale)}
              </span>
            </div>
            {hasDerivedHighlights ? (
              <p className="text-xs leading-5 text-zinc-500">
                {locale === "ko"
                  ? "관련 highlight는 package metadata와 현재 선택 상태에서만 파생됩니다. 성경 본문이나 좌표는 사용하지 않습니다."
                  : "Related highlights are derived only from package metadata and the current selection state. They do not use Bible text or coordinates."}
              </p>
            ) : null}
          </div>
        )}
      </div>

      {event
        ? renderEventEvidencePanel(event, locale, lookupMaps, onSelectInspectorItem, openInReaderLabel, relatedStudy, selection)
        : null}
      {bookRow
        ? renderBookEvidencePanel(bookRow, locale, lookupMaps, onSelectInspectorItem, openInReaderLabel, relatedStudy, selection)
        : null}
      {kingdomRow
        ? renderKingdomEvidencePanel(kingdomRow, locale, lookupMaps, onSelectInspectorItem, openInReaderLabel, relatedStudy, selection)
        : null}
      {genealogyRow
        ? renderGenealogyEvidencePanel(genealogyRow, locale, lookupMaps, onSelectInspectorItem, openInReaderLabel, relatedStudy, selection)
        : null}
      {placeRow
        ? renderPlaceEvidencePanel(placeRow, locale, lookupMaps, onSelectInspectorItem, openInReaderLabel, relatedStudy, selection)
        : null}
    </Card>
  );
}

type DetailSectionProps = {
  children: ReactNode;
  label: string;
};

function DetailSection({ children, label }: DetailSectionProps) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">{label}</p>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}

type SectionNoteProps = {
  children: ReactNode;
};

function SectionNote({ children }: SectionNoteProps) {
  return <p className="text-sm leading-6 text-zinc-600">{children}</p>;
}

type TagProps = {
  children: ReactNode;
};

function Tag({ children }: TagProps) {
  return <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700">{children}</span>;
}

type RelatedItemButtonProps = {
  active?: boolean;
  eyebrow: string;
  label: string;
  onClick: () => void;
};

function RelatedItemButton({ active = false, eyebrow, label, onClick }: RelatedItemButtonProps) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "inline-flex cursor-pointer flex-col items-start rounded-md border px-3 py-2 text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
        active
          ? "border-zinc-300 bg-zinc-100 text-zinc-950"
          : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-white",
      )}
      onClick={onClick}
      type="button"
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500">{eyebrow}</span>
      <span className="mt-1 text-sm font-medium leading-5">{label}</span>
    </button>
  );
}

type RelatedItemSectionProps = {
  children: ReactNode;
  label: string;
};

function RelatedItemSection({ children, label }: RelatedItemSectionProps) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

type ContextTagGroupProps = {
  label: string;
  locale: TimelineLocale;
  tags?: TimelineText[];
};

function ContextTagGroup({ label, locale, tags }: ContextTagGroupProps) {
  if (!tags?.length) {
    return null;
  }

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Tag key={`${label}-${tag.en}-${tag.ko}`}>{getTimelineText(tag, locale)}</Tag>
        ))}
      </div>
    </div>
  );
}

type ContextRowProps = {
  label: string;
  value: string;
};

function ContextRow({ label, value }: ContextRowProps) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">{label}</p>
      <p className="text-sm leading-6 text-zinc-600">{value}</p>
    </div>
  );
}

type ScriptureAnchorListProps = {
  anchors: PassionWeekTimelineEvent["scriptureAnchors"];
  locale: TimelineLocale;
  openInReaderLabel: string;
  rowId: string;
};

function ScriptureAnchorList({ anchors, locale, openInReaderLabel, rowId }: ScriptureAnchorListProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {anchors.map((anchor) => (
        <Link
          className={cn(
            "inline-flex min-h-8 items-center rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold leading-none text-zinc-900 transition-colors hover:border-zinc-300 hover:bg-zinc-50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
          )}
          href={getTimelineReaderHrefFromReader(anchor.reader, locale)}
          onClick={(event) => event.stopPropagation()}
          key={`${rowId}-${anchor.label.en}-${anchor.reader.book}-${anchor.reader.chapter}-${anchor.reader.verse}`}
        >
          {getTimelineText(anchor.label, locale)}
        </Link>
      ))}
      {anchors.length ? (
        <Link
          className={cn(
            "ml-1 inline-flex min-h-8 items-center rounded-full border border-dashed border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold leading-none text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
          )}
          href={getTimelineReaderHrefFromReader(anchors[0].reader, locale)}
          onClick={(event) => event.stopPropagation()}
        >
          {openInReaderLabel}
        </Link>
      ) : null}
    </div>
  );
}

function ReferenceOnlyAnchorList({
  anchors,
  locale,
}: {
  anchors: PassionWeekTimelineEvent["scriptureAnchors"];
  locale: TimelineLocale;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {anchors.map((anchor) => (
        <span
          className="inline-flex min-h-8 items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold leading-none text-zinc-700"
          key={`${anchor.label.en}-${anchor.reader.book}-${anchor.reader.chapter}-${anchor.reader.verse}`}
        >
          {getTimelineText(anchor.label, locale)}
        </span>
      ))}
    </div>
  );
}

function getSelectionTypeLabel(selectionType: TimelineInspectorSelectionType | null, locale: TimelineLocale) {
  switch (selectionType) {
    case "book":
      return locale === "ko" ? "책 / 시편" : "Book / Psalm";
    case "event":
      return locale === "ko" ? "사건" : "Event";
    case "genealogy":
      return locale === "ko" ? "족보" : "Genealogy";
    case "kingdom":
      return locale === "ko" ? "왕국 / 제국" : "Kingdom / Empire";
    case "place":
      return locale === "ko" ? "장소" : "Place";
    default:
      return locale === "ko" ? "선택됨" : "Selected";
  }
}

function renderEventEvidencePanel(
  event: PassionWeekTimelineEvent,
  locale: TimelineLocale,
  lookupMaps: TimelineEvidenceLookupMaps,
  onSelectInspectorItem: (selection: TimelineInspectorSelection) => void,
  openInReaderLabel: string,
  relatedStudy: string,
  selection: TimelineInspectorSelection,
) {
  const datePreview = getTimelineDatePreview(event);
  const primaryBook = getTimelineBook(event.primaryBookId);
  const placeLabels = event.placeIds
    .map((placeId) => getTimelinePlace(placeId))
    .filter((place): place is NonNullable<typeof place> => Boolean(place));
  const relativeYearLabel = event.relativeYearLabel ? getTimelineText(event.relativeYearLabel, locale) : "";
  const relatedBookRows = timelineBookContextRows.filter((row) => row.relatedEventIds?.includes(event.id));
  const relatedPackageBookRows = dedupeById(
    event.relatedBookIds
      .map((bookId) => lookupMaps.bookContextByBookId.get(bookId))
      .filter((row): row is TimelineBookContextRow => Boolean(row)),
  );
  const relatedPlaceRows = dedupeById(
    [
      ...event.placeIds
        .map((placeId) => lookupMaps.schematicPlaceByPlaceId.get(placeId))
        .filter((row): row is TimelineSchematicPlaceRow => Boolean(row)),
      ...timelineSchematicPlaceRows.filter((row) => row.relatedEventIds?.includes(event.id)),
    ],
  );
  const relatedKingdomRows = timelineKingdomComparisonRows.filter((row) => row.relatedEventIds?.includes(event.id));
  const relatedGenealogyRows = timelineGenealogyComparisonRows.filter((row) => row.relatedEventIds?.includes(event.id));

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-950">{getTimelineText(event.title, locale)}</h2>
        <p className="text-sm leading-6 text-zinc-600">{getTimelineText(event.summary, locale)}</p>
      </div>

      <DetailSection label={locale === "ko" ? "성경 근거" : "Scripture Anchors"}>
        {event.scriptureReferencesOnly ? (
          <>
            <ReferenceOnlyAnchorList anchors={event.scriptureAnchors} locale={locale} />
            <SectionNote>
              {locale === "ko"
                ? "이 package는 성경 본문을 저장하지 않습니다. 사건 수준 Scripture reference만 표시합니다."
                : "This package does not store Bible text. It shows event-level Scripture references only."}
            </SectionNote>
          </>
        ) : (
          <ScriptureAnchorList
            anchors={event.scriptureAnchors}
            locale={locale}
            openInReaderLabel={openInReaderLabel}
            rowId={event.id}
          />
        )}
      </DetailSection>

      <DetailSection label={locale === "ko" ? "배경 / 요약" : "Background / Summary"}>
        <SectionNote>{getTimelineText(event.locationNote, locale)}</SectionNote>
        {event.sequenceLabel ? (
          <ContextRow
            label={locale === "ko" ? "사건 순서" : "Sequence"}
            value={getTimelineText(event.sequenceLabel, locale)}
          />
        ) : null}
        <ContextRow
          label={locale === "ko" ? "이벤트 유형" : "Event Type"}
          value={getTimelineText(event.eventType, locale)}
        />
        {primaryBook ? (
          <ContextRow
            label={locale === "ko" ? "관련 책" : "Related Book"}
            value={getTimelineText(primaryBook.label, locale)}
          />
        ) : null}
        {event.basisLabel ? (
          <ContextRow
            label={locale === "ko" ? "패키지 기준" : "Package basis"}
            value={getTimelineText(event.basisLabel, locale)}
          />
        ) : null}
      </DetailSection>

      {datePreview && !event.scriptureReferencesOnly ? (
        <DetailSection label={locale === "ko" ? "보조 연대 / 연대 근거" : "Supporting Date / Basis"}>
          <ContextRow label={locale === "ko" ? "연대 표기" : "Date label"} value={getTimelineText(datePreview.dateLabel, locale)} />
          <ContextRow
            label={locale === "ko" ? "연대 근거" : "Date basis"}
            value={getTimelineText(datePreview.dateBasisLabel, locale)}
          />
          <ContextRow
            label={locale === "ko" ? "연대 신뢰" : "Date confidence"}
            value={getTimelineText(datePreview.dateConfidenceLabel, locale)}
          />
          <TimelineDatingNote
            label={locale === "ko" ? "보조 연대 메모" : "Supporting date note"}
            locale={locale}
            note={getTimelineText(event.datingNote, locale)}
          />
        </DetailSection>
      ) : null}

      {!event.scriptureReferencesOnly && (relativeYearLabel || event.relativeYearBasisLabel || event.relativeYearCalculationNote) ? (
        <DetailSection label={locale === "ko" ? "성경 내부 연수" : "Scripture-Derived Relative Year"}>
          {relativeYearLabel ? (
            <ContextRow label={locale === "ko" ? "연수 표기" : "Relative year"} value={relativeYearLabel} />
          ) : null}
          {event.relativeYearBasisLabel ? (
            <ContextRow
              label={locale === "ko" ? "기준" : "Basis"}
              value={getTimelineText(event.relativeYearBasisLabel, locale)}
            />
          ) : null}
          {event.relativeYearCalculationNote ? (
            <SectionNote>{getTimelineText(event.relativeYearCalculationNote, locale)}</SectionNote>
          ) : null}
        </DetailSection>
      ) : null}

      <DetailSection label={locale === "ko" ? "인물 / 장소 / 문맥" : "People / Places / Context"}>
        <ContextTagGroup
          label={locale === "ko" ? "인물" : "People"}
          locale={locale}
          tags={event.people}
        />
        <ContextTagGroup
          label={locale === "ko" ? "장소" : "Places"}
          locale={locale}
          tags={placeLabels.map((place) => place.label)}
        />
        <ContextTagGroup
          label={locale === "ko" ? "왕국" : "Kingdoms"}
          locale={locale}
          tags={event.kingdomTags}
        />
        <ContextTagGroup
          label={locale === "ko" ? "열강" : "Empires"}
          locale={locale}
          tags={event.empireTags}
        />
        <ContextTagGroup
          label={locale === "ko" ? "선지자" : "Prophets"}
          locale={locale}
          tags={event.prophetTags}
        />
        {event.prophetTags?.length ? (
          <SectionNote>
            {locale === "ko"
              ? "선지자 표시는 선택 가능한 별도 엔티티가 아니라 현재 사건을 돕는 보조 문맥 태그입니다."
              : "Prophet labels remain supporting context tags for the current event, not selectable standalone entities."}
          </SectionNote>
        ) : null}
        <ContextTagGroup
          label={locale === "ko" ? "주변 민족" : "Surrounding Nations"}
          locale={locale}
          tags={event.surroundingNationTags}
        />
        {event.synchronismNote ? <SectionNote>{getTimelineText(event.synchronismNote, locale)}</SectionNote> : null}
        {event.worldContextNote ? <SectionNote>{getTimelineText(event.worldContextNote, locale)}</SectionNote> : null}
        {event.worldContextBasisLabel ? (
          <SectionNote>{getTimelineText(event.worldContextBasisLabel, locale)}</SectionNote>
        ) : null}
        {event.worldContextConfidenceLabel ? (
          <SectionNote>{getTimelineText(event.worldContextConfidenceLabel, locale)}</SectionNote>
        ) : null}
        {event.nameVariantNote ? <SectionNote>{getTimelineText(event.nameVariantNote, locale)}</SectionNote> : null}
        {event.cautionNote ? <SectionNote>{getTimelineText(event.cautionNote, locale)}</SectionNote> : null}
      </DetailSection>

      {relatedBookRows.length || relatedPackageBookRows.length || relatedPlaceRows.length || relatedKingdomRows.length || relatedGenealogyRows.length ? (
        <DetailSection label={locale === "ko" ? "관련 항목" : "Related Items"}>
          {relatedBookRows.length || relatedPackageBookRows.length ? (
            <RelatedItemSection label={locale === "ko" ? "관련 책/시편" : "Related Books / Psalms"}>
              {dedupeById([...relatedBookRows, ...relatedPackageBookRows]).map((row) => (
                <RelatedItemButton
                  active={selection?.type === "book" && selection.id === row.id}
                  eyebrow={locale === "ko" ? "책 / 시편" : "Book / Psalm"}
                  key={row.id}
                  label={getTimelineText(row.title, locale)}
                  onClick={() => onSelectInspectorItem({ id: row.id, type: "book" })}
                />
              ))}
            </RelatedItemSection>
          ) : null}
          {relatedPlaceRows.length ? (
            <RelatedItemSection label={locale === "ko" ? "관련 장소" : "Related Places"}>
              {relatedPlaceRows.map((row) => (
                <RelatedItemButton
                  active={selection?.type === "place" && selection.id === row.id}
                  eyebrow={locale === "ko" ? "장소" : "Place"}
                  key={row.id}
                  label={getTimelineText(row.title, locale)}
                  onClick={() => onSelectInspectorItem({ id: row.id, type: "place" })}
                />
              ))}
            </RelatedItemSection>
          ) : null}
          {relatedKingdomRows.length ? (
            <RelatedItemSection label={locale === "ko" ? "관련 왕국/제국" : "Related Kingdoms"}>
              {relatedKingdomRows.map((row) => (
                <RelatedItemButton
                  active={selection?.type === "kingdom" && selection.id === row.id}
                  eyebrow={locale === "ko" ? "왕국 / 제국" : "Kingdom / Empire"}
                  key={row.id}
                  label={getTimelineText(row.sequenceLabel, locale)}
                  onClick={() => onSelectInspectorItem({ id: row.id, type: "kingdom" })}
                />
              ))}
            </RelatedItemSection>
          ) : null}
          {relatedGenealogyRows.length ? (
            <RelatedItemSection label={locale === "ko" ? "관련 족보" : "Related Genealogy"}>
              {relatedGenealogyRows.map((row) => (
                <RelatedItemButton
                  active={selection?.type === "genealogy" && selection.id === row.id}
                  eyebrow={locale === "ko" ? "족보" : "Genealogy"}
                  key={row.id}
                  label={getTimelineText(row.matthewName, locale)}
                  onClick={() => onSelectInspectorItem({ id: row.id, type: "genealogy" })}
                />
              ))}
            </RelatedItemSection>
          ) : null}
        </DetailSection>
      ) : null}

      {event.sourcePackage === "core-biblical-skeleton" ? (
        <DetailSection label={locale === "ko" ? "패키지 상태" : "Package Status"}>
          <SectionNote>
            {locale === "ko"
              ? "이 패널은 core biblical event skeleton package의 metadata-only preview를 보여 줍니다."
              : "This panel shows a metadata-only preview from the core biblical event skeleton package."}
          </SectionNote>
          {event.reviewRequired ? (
            <SectionNote>
              {locale === "ko" ? "후속 검토 필요 상태로 유지됩니다." : "This row remains marked for further review."}
            </SectionNote>
          ) : null}
        </DetailSection>
      ) : null}

      <p className="text-sm leading-6 text-zinc-500">{relatedStudy}</p>
    </div>
  );
}

function renderBookEvidencePanel(
  row: TimelineBookContextRow,
  locale: TimelineLocale,
  lookupMaps: TimelineEvidenceLookupMaps,
  onSelectInspectorItem: (selection: TimelineInspectorSelection) => void,
  openInReaderLabel: string,
  relatedStudy: string,
  selection: TimelineInspectorSelection,
) {
  const relatedPlaceRows = dedupeById(
    (row.relatedPlaces ?? [])
      .map((placeId) => lookupMaps.schematicPlaceByPlaceId.get(placeId))
      .filter((place): place is TimelineSchematicPlaceRow => Boolean(place)),
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-950">{getTimelineText(row.title, locale)}</h2>
        <p className="text-sm leading-6 text-zinc-600">{getTimelineText(row.canonicalLocation, locale)}</p>
      </div>

      <DetailSection label={locale === "ko" ? "성경 근거" : "Scripture Anchors"}>
        {row.scriptureReferencesOnly ? (
          <>
            <ReferenceOnlyAnchorList anchors={row.scriptureAnchors} locale={locale} />
            <SectionNote>
              {locale === "ko"
                ? "이 package는 성경 본문을 저장하지 않습니다. 책 수준 Scripture reference만 표시합니다."
                : "This package does not store Bible text. It shows book-level Scripture references only."}
            </SectionNote>
          </>
        ) : (
          <ScriptureAnchorList anchors={row.scriptureAnchors} locale={locale} openInReaderLabel={openInReaderLabel} rowId={row.id} />
        )}
      </DetailSection>

      <DetailSection label={locale === "ko" ? "정경 위치" : "Canonical Location"}>
        <ContextRow label={locale === "ko" ? "정경 위치" : "Canonical location"} value={getTimelineText(row.canonicalLocation, locale)} />
        {row.canonicalOrder ? (
          <ContextRow
            label={locale === "ko" ? "정경 순서" : "Canonical order"}
            value={`${row.canonicalOrder}`}
          />
        ) : null}
        {row.testament ? (
          <ContextRow
            label={locale === "ko" ? "구분" : "Testament"}
            value={row.testament === "OT" ? (locale === "ko" ? "구약" : "Old Testament") : locale === "ko" ? "신약" : "New Testament"}
          />
        ) : null}
        {row.canonicalSectionLabel ? (
          <ContextRow
            label={locale === "ko" ? "정경 구간" : "Canonical section"}
            value={getTimelineText(row.canonicalSectionLabel, locale)}
          />
        ) : null}
        {row.historicalSettingLabel ? (
          <ContextRow
            label={locale === "ko" ? "배경 연결" : "Background connection"}
            value={getTimelineText(row.historicalSettingLabel, locale)}
          />
        ) : null}
      </DetailSection>

      <DetailSection label={locale === "ko" ? "저자 / 근거" : "Authorship / Basis"}>
        {row.authorshipLabel ? (
          <ContextRow label={locale === "ko" ? "저자" : "Authorship"} value={getTimelineText(row.authorshipLabel, locale)} />
        ) : null}
        {row.authorshipBasisLabel ? (
          <SectionNote>{getTimelineText(row.authorshipBasisLabel, locale)}</SectionNote>
        ) : null}
      </DetailSection>

      <DetailSection label={locale === "ko" ? "배경 근거" : "Background Basis"}>
        <SectionNote>{getTimelineText(row.backgroundBasisLabel, locale)}</SectionNote>
        {row.dateLabel || row.dateBasisLabel || row.dateConfidenceLabel ? (
          <div className="space-y-3">
            {row.dateLabel ? (
              <ContextRow label={locale === "ko" ? "연대 표기" : "Date label"} value={getTimelineText(row.dateLabel, locale)} />
            ) : null}
            {row.dateBasisLabel ? (
              <ContextRow label={locale === "ko" ? "기준" : "Basis"} value={getTimelineText(row.dateBasisLabel, locale)} />
            ) : null}
            {row.dateConfidenceLabel ? (
              <ContextRow
                label={locale === "ko" ? "신뢰" : "Confidence"}
                value={getTimelineText(row.dateConfidenceLabel, locale)}
              />
            ) : null}
          </div>
        ) : null}
      </DetailSection>

      <DetailSection label={locale === "ko" ? "인물 / 장소" : "People / Places"}>
        <ContextTagGroup label={locale === "ko" ? "인물" : "People"} locale={locale} tags={row.relatedPeople} />
        <ContextTagGroup
          label={locale === "ko" ? "장소" : "Places"}
          locale={locale}
          tags={row.relatedPlaces?.map((placeId) => getTimelinePlace(placeId)?.label).filter((value): value is TimelineText => Boolean(value))}
        />
        <ContextTagGroup
          label={locale === "ko" ? "왕국" : "Kingdoms"}
          locale={locale}
          tags={row.relatedKingdoms}
        />
        <ContextTagGroup
          label={locale === "ko" ? "열강" : "Empires"}
          locale={locale}
          tags={row.relatedEmpires}
        />
        {row.relatedEventIds?.length ? (
          <RelatedItemSection label={locale === "ko" ? "관련 사건" : "Related Events"}>
            {row.relatedEventIds.map((eventId) => {
              const relatedEvent = lookupMaps.eventById.get(eventId);

              if (!relatedEvent) {
                return null;
              }

              return (
                <RelatedItemButton
                  active={selection?.type === "event" && selection.id === relatedEvent.id}
                  eyebrow={locale === "ko" ? "사건" : "Event"}
                  key={`${row.id}-${eventId}`}
                  label={getTimelineText(relatedEvent.title, locale)}
                  onClick={() => onSelectInspectorItem({ id: relatedEvent.id, type: "event" })}
                />
              );
            })}
          </RelatedItemSection>
        ) : null}
        {relatedPlaceRows.length ? (
          <RelatedItemSection label={locale === "ko" ? "관련 장소" : "Related Places"}>
            {relatedPlaceRows.map((placeRow) => (
              <RelatedItemButton
                active={selection?.type === "place" && selection.id === placeRow.id}
                eyebrow={locale === "ko" ? "장소" : "Place"}
                key={`${row.id}-${placeRow.id}`}
                label={getTimelineText(placeRow.title, locale)}
                onClick={() => onSelectInspectorItem({ id: placeRow.id, type: "place" })}
              />
            ))}
          </RelatedItemSection>
        ) : null}
      </DetailSection>

      <DetailSection label={locale === "ko" ? "주의 / 메모" : "Caution / Note"}>
        <SectionNote>{getTimelineText(row.note, locale)}</SectionNote>
        {row.sourcePackage === "canonical-66-skeleton" ? (
          <SectionNote>
            {locale === "ko"
              ? "이 패널은 66권 canonical skeleton package의 metadata-only preview를 보여 줍니다."
              : "This panel shows a metadata-only preview from the canonical 66-book skeleton package."}
          </SectionNote>
        ) : null}
        <SectionNote>{relatedStudy}</SectionNote>
      </DetailSection>
    </div>
  );
}

function renderKingdomEvidencePanel(
  row: TimelineKingdomEvidenceRow,
  locale: TimelineLocale,
  lookupMaps: TimelineEvidenceLookupMaps,
  onSelectInspectorItem: (selection: TimelineInspectorSelection) => void,
  openInReaderLabel: string,
  relatedStudy: string,
  selection: TimelineInspectorSelection,
) {
  if (isKingsPackageEvidenceRow(row)) {
    return renderKingsPackageEvidencePanel(
      row,
      locale,
      lookupMaps,
      onSelectInspectorItem,
      openInReaderLabel,
      relatedStudy,
      selection,
    );
  }

  const linkedGenealogyRows = (kingdomToGenealogyLinks[row.id] ?? [])
    .map((genealogyId) => lookupMaps.genealogyComparisonById.get(genealogyId))
    .filter((item): item is TimelineGenealogyComparisonRow => Boolean(item));

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-950">{getTimelineText(row.eraLabel, locale)}</h2>
        <p className="text-sm leading-6 text-zinc-600">{getTimelineText(row.sequenceLabel, locale)}</p>
      </div>

      <DetailSection label={locale === "ko" ? "성경 근거" : "Scripture Anchors"}>
        <ScriptureAnchorList anchors={row.scriptureAnchors} locale={locale} openInReaderLabel={openInReaderLabel} rowId={row.id} />
      </DetailSection>

      <DetailSection label={locale === "ko" ? "왕국 흐름" : "Kingdom Flow"}>
        <ContextRow label={locale === "ko" ? "시대 / 흐름" : "Era / flow"} value={getTimelineText(row.eraLabel, locale)} />
        <ContextRow label={locale === "ko" ? "흐름 순서" : "Sequence"} value={getTimelineText(row.sequenceLabel, locale)} />
        {row.unitedKing ? <ContextRow label={locale === "ko" ? "통일 왕국" : "United Kingdom"} value={getTimelineText(row.unitedKing, locale)} /> : null}
        {row.judahKing ? <ContextRow label={locale === "ko" ? "유다" : "Judah"} value={getTimelineText(row.judahKing, locale)} /> : null}
        {row.northernKing ? (
          <ContextRow label={locale === "ko" ? "북이스라엘" : "Northern Israel"} value={getTimelineText(row.northernKing, locale)} />
        ) : null}
      </DetailSection>

      <DetailSection label={locale === "ko" ? "선지자 문맥" : "Prophetic Context"}>
        <ContextTagGroup
          label={locale === "ko" ? "선지자 태그" : "Prophet tags"}
          locale={locale}
          tags={row.prophetTags}
        />
        {row.prophetTags?.length ? (
          <SectionNote>
            {locale === "ko"
              ? "이 태그들은 별도 선지자 row나 선택 타입이 아니라, 현재 왕국 흐름을 돕는 보조 문맥 표지입니다."
              : "These labels remain supporting context markers for the current kingdom flow, not separate prophet rows or a selectable inspector type."}
          </SectionNote>
        ) : null}
      </DetailSection>

      <DetailSection label={locale === "ko" ? "열강 / 주변 민족" : "Empires / Nations"}>
        <ContextTagGroup
          label={locale === "ko" ? "열강" : "Empires"}
          locale={locale}
          tags={row.empireTags}
        />
        <ContextTagGroup
          label={locale === "ko" ? "주변 민족" : "Surrounding Nations"}
          locale={locale}
          tags={row.surroundingNationTags}
        />
        {row.relatedEventIds?.length ? (
          <RelatedItemSection label={locale === "ko" ? "관련 사건" : "Related Events"}>
            {row.relatedEventIds.map((eventId) => {
              const relatedEvent = lookupMaps.eventById.get(eventId);

              if (!relatedEvent) {
                return null;
              }

              return (
                <RelatedItemButton
                  active={selection?.type === "event" && selection.id === relatedEvent.id}
                  eyebrow={locale === "ko" ? "사건" : "Event"}
                  key={`${row.id}-${eventId}`}
                  label={getTimelineText(relatedEvent.title, locale)}
                  onClick={() => onSelectInspectorItem({ id: relatedEvent.id, type: "event" })}
                />
              );
            })}
          </RelatedItemSection>
        ) : null}
        {linkedGenealogyRows.length ? (
          <RelatedItemSection label={locale === "ko" ? "관련 족보" : "Related Genealogy"}>
            {linkedGenealogyRows.map((genealogyRow) => (
              <RelatedItemButton
                active={selection?.type === "genealogy" && selection.id === genealogyRow.id}
                eyebrow={locale === "ko" ? "족보" : "Genealogy"}
                key={`${row.id}-${genealogyRow.id}`}
                label={getTimelineText(genealogyRow.matthewName, locale)}
                onClick={() => onSelectInspectorItem({ id: genealogyRow.id, type: "genealogy" })}
              />
            ))}
          </RelatedItemSection>
        ) : null}
      </DetailSection>

      {(row.dateLabel || row.dateBasisLabel || row.dateConfidenceLabel || row.nameVariantNote || row.note) ? (
        <DetailSection label={locale === "ko" ? "보조 연대 / 주의" : "Supporting Date / Caution"}>
          {row.dateLabel ? <ContextRow label={locale === "ko" ? "연대 표기" : "Date label"} value={getTimelineText(row.dateLabel, locale)} /> : null}
          {row.dateBasisLabel ? <SectionNote>{getTimelineText(row.dateBasisLabel, locale)}</SectionNote> : null}
          {row.dateConfidenceLabel ? (
            <SectionNote>{getTimelineText(row.dateConfidenceLabel, locale)}</SectionNote>
          ) : null}
          {row.nameVariantNote ? <SectionNote>{getTimelineText(row.nameVariantNote, locale)}</SectionNote> : null}
          {row.note ? <SectionNote>{getTimelineText(row.note, locale)}</SectionNote> : null}
          <SectionNote>{relatedStudy}</SectionNote>
        </DetailSection>
      ) : null}
    </div>
  );
}

function isKingsPackageEvidenceRow(
  row: TimelineKingdomEvidenceRow,
): row is TimelineKingsKingdomsPreviewRow {
  return "sourcePackage" in row && row.sourcePackage === "kings-kingdoms-skeleton";
}

function getKingdomEvidenceLabel(row: TimelineKingdomEvidenceRow, locale: TimelineLocale) {
  if (isKingsPackageEvidenceRow(row)) {
    return getTimelineText(row.title, locale);
  }

  return getTimelineText(row.sequenceLabel, locale);
}

function renderKingsPackageEvidencePanel(
  row: TimelineKingsKingdomsPreviewRow,
  locale: TimelineLocale,
  lookupMaps: TimelineEvidenceLookupMaps,
  onSelectInspectorItem: (selection: TimelineInspectorSelection) => void,
  _openInReaderLabel: string,
  relatedStudy: string,
  selection: TimelineInspectorSelection,
) {
  const relatedRows = dedupeById(
    [
      row.kingdomId ? lookupMaps.kingdomComparisonById.get(row.kingdomId) : undefined,
      row.predecessorId ? lookupMaps.kingdomComparisonById.get(row.predecessorId) : undefined,
      row.successorId ? lookupMaps.kingdomComparisonById.get(row.successorId) : undefined,
      ...(row.relatedKingIds ?? []).map((id) => lookupMaps.kingdomComparisonById.get(id)),
      ...(row.relatedTransitionIds ?? []).map((id) => lookupMaps.kingdomComparisonById.get(id)),
      ...(row.relatedKingdomIds ?? []).map((id) => lookupMaps.kingdomComparisonById.get(id)),
      ...(row.relatedPeriodIds ?? []).map((id) => lookupMaps.kingdomComparisonById.get(id)),
      row.previousStateId ? lookupMaps.kingdomComparisonById.get(row.previousStateId) : undefined,
      row.nextStateId ? lookupMaps.kingdomComparisonById.get(row.nextStateId) : undefined,
    ].filter((item): item is TimelineKingdomEvidenceRow => Boolean(item)),
  ).filter((item) => item.id !== row.id);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-950">{getTimelineText(row.title, locale)}</h2>
        <p className="text-sm leading-6 text-zinc-600">
          {locale === "ko" ? "Kings / Kingdoms skeleton metadata preview" : "Kings / Kingdoms skeleton metadata preview"}
        </p>
      </div>

      <DetailSection label={locale === "ko" ? "성경 근거" : "Scripture Anchors"}>
        <ReferenceOnlyAnchorList anchors={row.scriptureAnchors} locale={locale} />
        <SectionNote>
          {locale === "ko"
            ? "이 package는 성경 본문을 저장하지 않습니다. 왕/왕국 수준 Scripture reference만 표시합니다."
            : "This package does not store Bible text. It shows king/kingdom-level Scripture references only."}
        </SectionNote>
      </DetailSection>

      <DetailSection label={locale === "ko" ? "구조 / 관계" : "Structure / Relations"}>
        <ContextRow
          label={locale === "ko" ? "record type" : "Record type"}
          value={row.recordType}
        />
        <ContextRow
          label={locale === "ko" ? "표시 순서" : "Display order"}
          value={`${row.displayOrder}`}
        />
        <ContextRow
          label={locale === "ko" ? "section" : "Section"}
          value={row.sectionId}
        />
        {row.kingdomName ? (
          <ContextRow
            label={locale === "ko" ? "왕국" : "Kingdom"}
            value={getTimelineText(row.kingdomName, locale)}
          />
        ) : null}
        {row.reignLabel ? (
          <ContextRow
            label={locale === "ko" ? "왕정 라벨" : "Reign label"}
            value={getTimelineText(row.reignLabel, locale)}
          />
        ) : null}
        {row.scope ? (
          <ContextRow
            label={locale === "ko" ? "구간 범위" : "Scope"}
            value={getTimelineText(row.scope, locale)}
          />
        ) : null}
      </DetailSection>

      <DetailSection label={locale === "ko" ? "연대 / 주의" : "Chronology / Caution"}>
        {row.approximateDateLabel ? (
          <ContextRow
            label={locale === "ko" ? "근사 연대 라벨" : "Approximate date label"}
            value={getTimelineText(row.approximateDateLabel, locale)}
          />
        ) : null}
        <ContextRow
          label={locale === "ko" ? "신뢰도" : "Confidence"}
          value={getTimelineText(row.confidenceLabel, locale)}
        />
        {row.reviewRequired ? (
          <SectionNote>{locale === "ko" ? "이 row는 reviewRequired 상태입니다." : "This row remains review-required."}</SectionNote>
        ) : null}
        <SectionNote>{getTimelineText(row.cautionNote, locale)}</SectionNote>
      </DetailSection>

      <DetailSection label={locale === "ko" ? "관련 책" : "Related Books"}>
        <div className="flex flex-wrap gap-2">
          {row.relatedBookIds.map((bookId) => {
            const bookRow = lookupMaps.bookContextByBookId.get(bookId);
            const label = bookRow ? getTimelineText(bookRow.title, locale) : getTimelineBook(bookId)?.label ? getTimelineText(getTimelineBook(bookId)!.label, locale) : bookId;

            return <Tag key={`${row.id}-${bookId}`}>{label}</Tag>;
          })}
        </div>
      </DetailSection>

      {relatedRows.length ? (
        <DetailSection label={locale === "ko" ? "내부 관계" : "Internal Relations"}>
          <RelatedItemSection label={locale === "ko" ? "관련 왕 / 왕국 / 전환" : "Related Kings / Kingdoms / Transitions"}>
            {relatedRows.map((relatedRow) => (
              <RelatedItemButton
                active={selection?.type === "kingdom" && selection.id === relatedRow.id}
                eyebrow={locale === "ko" ? "왕국 / 제국" : "Kingdom / Empire"}
                key={`${row.id}-${relatedRow.id}`}
                label={getKingdomEvidenceLabel(relatedRow, locale)}
                onClick={() => onSelectInspectorItem({ id: relatedRow.id, type: "kingdom" })}
              />
            ))}
          </RelatedItemSection>
        </DetailSection>
      ) : null}

      <DetailSection label={locale === "ko" ? "패키지 상태" : "Package Status"}>
        <SectionNote>
          {locale === "ko"
            ? "이 패널은 kings-kingdoms skeleton package의 metadata-only preview를 보여 줍니다."
            : "This panel shows a metadata-only preview from the kings-kingdoms skeleton package."}
        </SectionNote>
        <SectionNote>
          {locale === "ko"
            ? "선지자 확장 row는 아직 추가하지 않았으며, 현재 cross-link는 기존 사건 / 왕국 / 족보 metadata 안에서만 동작합니다."
            : "No prophet-expansion rows have been added here; the current cross-links stay within existing event, kingdom, and genealogy metadata."}
        </SectionNote>
        <SectionNote>
          {locale === "ko"
            ? "연대 정보는 확정 데이터가 아니라 review-gated caution으로만 유지됩니다."
            : "Chronology information remains review-gated caution rather than finalized data."}
        </SectionNote>
      </DetailSection>

      <p className="text-sm leading-6 text-zinc-500">{relatedStudy}</p>
    </div>
  );
}

function renderGenealogyEvidencePanel(
  row: TimelineGenealogyComparisonRow,
  locale: TimelineLocale,
  lookupMaps: TimelineEvidenceLookupMaps,
  onSelectInspectorItem: (selection: TimelineInspectorSelection) => void,
  openInReaderLabel: string,
  relatedStudy: string,
  selection: TimelineInspectorSelection,
) {
  const segment = timelineGenealogySegments.find((item) => item.id === row.segmentId);
  const linkedKingdomRows = (genealogyToKingdomLinks[row.id] ?? [])
    .map((kingdomId) => lookupMaps.kingdomComparisonById.get(kingdomId))
    .filter((item): item is TimelineKingdomComparisonRow => Boolean(item));

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-950">{getTimelineText(row.matthewName, locale)}</h2>
        <p className="text-sm leading-6 text-zinc-600">
          {segment ? `${getTimelineText(segment.title, locale)} · ${getTimelineText(segment.rangeLabel, locale)}` : getTimelineText(row.comparisonLabel, locale)}
        </p>
        <p className="text-sm leading-6 text-zinc-500">
          {locale === "ko"
            ? "이 패널은 마태복음 1장의 구조와 선택된 성경 비교 표지만 요약합니다. 완전한 족보 재구성이나 정확한 연대 증명을 시도하지 않습니다."
            : "This panel summarizes Matthew 1's structure with selected Scripture comparison markers only. It does not attempt exhaustive genealogy reconstruction or exact chronology proof."}
        </p>
      </div>

      <DetailSection label={locale === "ko" ? "성경 근거" : "Scripture Anchors"}>
        <ScriptureAnchorList anchors={row.scriptureAnchors} locale={locale} openInReaderLabel={openInReaderLabel} rowId={row.id} />
      </DetailSection>

      <DetailSection label={locale === "ko" ? "관찰" : "Observation"}>
        <ContextRow label={locale === "ko" ? "마태복음" : "Matthew"} value={getTimelineText(row.matthewName, locale)} />
        {row.oldTestamentName ? (
          <ContextRow
            label={locale === "ko" ? "구약 비교" : "Old Testament Comparison"}
            value={getTimelineText(row.oldTestamentName, locale)}
          />
        ) : null}
        <ContextRow
          label={locale === "ko" ? "비교 라벨" : "Comparison"}
          value={getTimelineText(row.comparisonLabel, locale)}
        />
        {segment ? (
          <>
            <ContextRow
              label={locale === "ko" ? "족보 구간" : "Genealogy Segment"}
              value={`${getTimelineText(segment.title, locale)} · ${getTimelineText(segment.rangeLabel, locale)}`}
            />
            <SectionNote>{getTimelineText(segment.note, locale)}</SectionNote>
          </>
        ) : null}
        <SectionNote>
          {locale === "ko"
            ? "이 관찰은 본문 구조와 이름 비교를 요약한 metadata-only preview이며, 누락이나 이름 차이를 외부 전승이나 확정 연대로 해결하려 하지 않습니다."
            : "These observations stay metadata-only and summarize textual structure plus name comparison without resolving omissions or variants through external tradition or exact chronology claims."}
        </SectionNote>
      </DetailSection>

      <DetailSection label={locale === "ko" ? "이름 차이 / 생략 관찰" : "Name Variant / Omission Observation"}>
        {row.nameVariantNote ? <SectionNote>{getTimelineText(row.nameVariantNote, locale)}</SectionNote> : null}
        {row.omissionNote ? <SectionNote>{getTimelineText(row.omissionNote, locale)}</SectionNote> : null}
        {row.basisLabel ? <SectionNote>{getTimelineText(row.basisLabel, locale)}</SectionNote> : null}
      </DetailSection>

      <DetailSection label={locale === "ko" ? "관련 표지" : "Related Markers"}>
        <ContextTagGroup label={locale === "ko" ? "왕국" : "Kingdoms"} locale={locale} tags={row.kingdomTags} />
        <ContextTagGroup label={locale === "ko" ? "열강" : "Empires"} locale={locale} tags={row.empireTags} />
        <ContextTagGroup label={locale === "ko" ? "통치자" : "Rulers"} locale={locale} tags={row.rulerTags} />
        {row.relatedBookIds?.length ? (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
              {locale === "ko" ? "관련 책" : "Related Books"}
            </p>
            <div className="flex flex-wrap gap-2">
              {row.relatedBookIds.map((bookId) => {
                const book = getTimelineBook(bookId);
                return (
                  <Tag key={`${row.id}-${bookId}`}>{book ? getTimelineText(book.label, locale) : bookId}</Tag>
                );
              })}
            </div>
          </div>
        ) : null}
        {row.relatedEventIds?.length ? (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
              {locale === "ko" ? "관련 사건" : "Related Events"}
            </p>
            <div className="flex flex-wrap gap-2">
              {row.relatedEventIds.map((eventId) => {
                const relatedEvent = lookupMaps.eventById.get(eventId);

                if (!relatedEvent) {
                  return null;
                }

                return (
                  <RelatedItemButton
                    active={selection?.type === "event" && selection.id === relatedEvent.id}
                    eyebrow={locale === "ko" ? "사건" : "Event"}
                    key={`${row.id}-${eventId}`}
                    label={getTimelineText(relatedEvent.title, locale)}
                    onClick={() => onSelectInspectorItem({ id: relatedEvent.id, type: "event" })}
                  />
                );
              })}
            </div>
          </div>
        ) : null}
        {linkedKingdomRows.length ? (
          <RelatedItemSection label={locale === "ko" ? "관련 왕국/제국" : "Related Kingdoms"}>
            {linkedKingdomRows.map((kingdomRow) => (
              <RelatedItemButton
                active={selection?.type === "kingdom" && selection.id === kingdomRow.id}
                eyebrow={locale === "ko" ? "왕국 / 제국" : "Kingdom / Empire"}
                key={`${row.id}-${kingdomRow.id}`}
                label={getTimelineText(kingdomRow.sequenceLabel, locale)}
                onClick={() => onSelectInspectorItem({ id: kingdomRow.id, type: "kingdom" })}
              />
            ))}
          </RelatedItemSection>
        ) : null}
      </DetailSection>

      <p className="text-sm leading-6 text-zinc-500">{relatedStudy}</p>
    </div>
  );
}

function renderPlaceEvidencePanel(
  row: TimelineSchematicPlaceRow,
  locale: TimelineLocale,
  lookupMaps: TimelineEvidenceLookupMaps,
  onSelectInspectorItem: (selection: TimelineInspectorSelection) => void,
  openInReaderLabel: string,
  relatedStudy: string,
  selection: TimelineInspectorSelection,
) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-950">{getTimelineText(row.title, locale)}</h2>
        <p className="text-sm leading-6 text-zinc-600">{getTimelineText(row.conceptRegionLabel, locale)}</p>
      </div>

      <DetailSection label={locale === "ko" ? "성경 근거" : "Scripture Anchors"}>
        <ScriptureAnchorList anchors={row.scriptureAnchors} locale={locale} openInReaderLabel={openInReaderLabel} rowId={row.id} />
      </DetailSection>

      <DetailSection label={locale === "ko" ? "장소 / 개념지도" : "Place / Schematic Map"}>
        <ContextRow label={locale === "ko" ? "장소" : "Place"} value={getTimelineText(row.title, locale)} />
        {row.modernReferenceLabel ? (
          <ContextRow
            label={locale === "ko" ? "오늘날 보조 표기" : "Modern reference"}
            value={getTimelineText(row.modernReferenceLabel, locale)}
          />
        ) : null}
        {row.modernReferenceStatusLabel ? (
          <ContextRow
            label={locale === "ko" ? "지명 상태" : "Reference status"}
            value={getTimelineText(row.modernReferenceStatusLabel, locale)}
          />
        ) : null}
        <ContextRow
          label={locale === "ko" ? "개념 권역" : "Concept region"}
          value={getTimelineText(row.conceptRegionLabel, locale)}
        />
        {row.placeTypeLabel ? (
          <ContextRow
            label={locale === "ko" ? "장소 유형" : "Place type"}
            value={getTimelineText(row.placeTypeLabel, locale)}
          />
        ) : null}
        <SectionNote>
          {locale === "ko"
            ? "이 단계에서는 좌표, 지도 provider, 지오코딩, 경로 재구성을 제공하지 않습니다. 오늘날 지명은 보조 표기입니다."
            : "This phase does not provide coordinates, a map provider, geocoding, or route reconstruction. Modern place labels are supporting references."}
        </SectionNote>
        <SectionNote>
          {locale === "ko"
            ? "이 place panel은 실제 지도가 아니라 성경 본문 흐름을 돕는 metadata-only schematic summary입니다."
            : "This place panel is a metadata-only schematic summary for following the biblical textual flow, not a real map."}
        </SectionNote>
      </DetailSection>

      <DetailSection label={locale === "ko" ? "위치 근거 / 주의" : "Location Basis / Caution"}>
        <SectionNote>{getTimelineText(row.locationBasisLabel, locale)}</SectionNote>
        <SectionNote>{getTimelineText(row.locationConfidenceLabel, locale)}</SectionNote>
        {row.cautionNote ? <SectionNote>{getTimelineText(row.cautionNote, locale)}</SectionNote> : null}
        <SectionNote>{getTimelineText(row.note, locale)}</SectionNote>
        <SectionNote>
          {locale === "ko"
            ? "위치 설명은 Scripture anchor와 existing metadata에 근거한 개념 요약이며, exact geography claim으로 확장하지 않습니다."
            : "Location notes remain conceptual summaries derived from Scripture anchors and existing metadata and do not expand into exact geography claims."}
        </SectionNote>
      </DetailSection>

      <DetailSection label={locale === "ko" ? "관련 인물 / 문맥" : "Related People / Context"}>
        <ContextTagGroup label={locale === "ko" ? "인물" : "People"} locale={locale} tags={row.relatedPeople} />
        <ContextTagGroup label={locale === "ko" ? "왕국" : "Kingdoms"} locale={locale} tags={row.relatedKingdoms} />
        <ContextTagGroup label={locale === "ko" ? "열강" : "Empires"} locale={locale} tags={row.relatedEmpires} />
        {row.relatedBookContextIds?.length ? (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
              {locale === "ko" ? "관련 책/시편" : "Related Books / Psalms"}
            </p>
            <div className="flex flex-wrap gap-2">
              {row.relatedBookContextIds.map((contextId) => {
                const relatedBookRow = lookupMaps.bookContextById.get(contextId);

                if (!relatedBookRow) {
                  return null;
                }

                return (
                  <RelatedItemButton
                    active={selection?.type === "book" && selection.id === relatedBookRow.id}
                    eyebrow={locale === "ko" ? "책 / 시편" : "Book / Psalm"}
                    key={`${row.id}-${contextId}`}
                    label={getTimelineText(relatedBookRow.title, locale)}
                    onClick={() => onSelectInspectorItem({ id: relatedBookRow.id, type: "book" })}
                  />
                );
              })}
            </div>
          </div>
        ) : null}
        {row.relatedEventIds?.length ? (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
              {locale === "ko" ? "관련 사건" : "Related Events"}
            </p>
            <div className="flex flex-wrap gap-2">
              {row.relatedEventIds.map((eventId) => {
                const relatedEvent = lookupMaps.eventById.get(eventId);

                if (!relatedEvent) {
                  return null;
                }

                return (
                  <RelatedItemButton
                    active={selection?.type === "event" && selection.id === relatedEvent.id}
                    eyebrow={locale === "ko" ? "사건" : "Event"}
                    key={`${row.id}-${eventId}`}
                    label={getTimelineText(relatedEvent.title, locale)}
                    onClick={() => onSelectInspectorItem({ id: relatedEvent.id, type: "event" })}
                  />
                );
              })}
            </div>
          </div>
        ) : null}
      </DetailSection>

      <p className="text-sm leading-6 text-zinc-500">{relatedStudy}</p>
    </div>
  );
}

function dedupeById<T extends { id: string }>(items: T[]) {
  return Array.from(new Map(items.map((item) => [item.id, item])).values());
}

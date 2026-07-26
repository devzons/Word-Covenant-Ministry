"use client";

import { Card } from "@/components/ui/Card";

import {
  getTimelineText,
  type TimelineGenealogyComparisonRow,
  type TimelineInspectorSelection,
  type TimelineKingdomComparisonRow,
  type TimelineLocale,
} from "./passionWeekTimeline";
import type { TimelineHighlightState } from "./timelineHighlightState";
import { BookEvidencePanel } from "./timeline-detail-panel/BookEvidencePanel";
import { EventEvidencePanel } from "./timeline-detail-panel/EventEvidencePanel";
import { GenealogyEvidencePanel } from "./timeline-detail-panel/GenealogyEvidencePanel";
import { KingdomEvidencePanel } from "./timeline-detail-panel/KingdomEvidencePanel";
import { previewLimitationCopy } from "./timeline-detail-panel/panelCopy";
import { dedupeById, isKingsPackageEvidenceRow } from "./timeline-detail-panel/panelHelpers";
import { PlaceEvidencePanel } from "./timeline-detail-panel/PlaceEvidencePanel";
import type {
  TimelineEvidenceLookupMaps,
  TimelineInspectorSelectionType,
  TimelineKingdomEvidenceRow,
} from "./timeline-detail-panel/panelTypes";

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
            <p className="text-xs leading-5 text-zinc-500">{getTimelineText(previewLimitationCopy.noSelection, locale)}</p>
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

      {event ? (
        <EventEvidencePanel
          event={event}
          locale={locale}
          lookupMaps={lookupMaps}
          onSelectInspectorItem={onSelectInspectorItem}
          openInReaderLabel={openInReaderLabel}
          relatedStudy={relatedStudy}
          selection={selection}
        />
      ) : null}
      {bookRow ? (
        <BookEvidencePanel
          row={bookRow}
          locale={locale}
          lookupMaps={lookupMaps}
          onSelectInspectorItem={onSelectInspectorItem}
          openInReaderLabel={openInReaderLabel}
          relatedStudy={relatedStudy}
          selection={selection}
        />
      ) : null}
      {kingdomRow ? (
        isKingsPackageEvidenceRow(kingdomRow) ? (
          <KingdomEvidencePanel
            variant="package"
            row={kingdomRow}
            relatedRows={dedupeById(
              [
                kingdomRow.kingdomId ? lookupMaps.kingdomComparisonById.get(kingdomRow.kingdomId) : undefined,
                kingdomRow.predecessorId ? lookupMaps.kingdomComparisonById.get(kingdomRow.predecessorId) : undefined,
                kingdomRow.successorId ? lookupMaps.kingdomComparisonById.get(kingdomRow.successorId) : undefined,
                ...(kingdomRow.relatedKingIds ?? []).map((id) => lookupMaps.kingdomComparisonById.get(id)),
                ...(kingdomRow.relatedTransitionIds ?? []).map((id) => lookupMaps.kingdomComparisonById.get(id)),
                ...(kingdomRow.relatedKingdomIds ?? []).map((id) => lookupMaps.kingdomComparisonById.get(id)),
                ...(kingdomRow.relatedPeriodIds ?? []).map((id) => lookupMaps.kingdomComparisonById.get(id)),
                kingdomRow.previousStateId ? lookupMaps.kingdomComparisonById.get(kingdomRow.previousStateId) : undefined,
                kingdomRow.nextStateId ? lookupMaps.kingdomComparisonById.get(kingdomRow.nextStateId) : undefined,
              ].filter((item): item is TimelineKingdomEvidenceRow => Boolean(item)),
            ).filter((item) => item.id !== kingdomRow.id)}
            locale={locale}
            lookupMaps={lookupMaps}
            onSelectInspectorItem={onSelectInspectorItem}
            openInReaderLabel={openInReaderLabel}
            relatedStudy={relatedStudy}
            selection={selection}
          />
        ) : (
          <KingdomEvidencePanel
            variant="runtime"
            row={kingdomRow}
            linkedGenealogyRows={(kingdomToGenealogyLinks[kingdomRow.id] ?? [])
              .map((genealogyId) => lookupMaps.genealogyComparisonById.get(genealogyId))
              .filter((item): item is TimelineGenealogyComparisonRow => Boolean(item))}
            locale={locale}
            lookupMaps={lookupMaps}
            onSelectInspectorItem={onSelectInspectorItem}
            openInReaderLabel={openInReaderLabel}
            relatedStudy={relatedStudy}
            selection={selection}
          />
        )
      ) : null}
      {genealogyRow
        ? (
          <GenealogyEvidencePanel
            row={genealogyRow}
            linkedKingdomRows={(genealogyToKingdomLinks[genealogyRow.id] ?? [])
              .map((kingdomId) => lookupMaps.kingdomComparisonById.get(kingdomId))
              .filter((item): item is TimelineKingdomComparisonRow => Boolean(item))}
            locale={locale}
            lookupMaps={lookupMaps}
            onSelectInspectorItem={onSelectInspectorItem}
            openInReaderLabel={openInReaderLabel}
            relatedStudy={relatedStudy}
            selection={selection}
          />
        )
        : null}
      {placeRow ? (
        <PlaceEvidencePanel
          row={placeRow}
          locale={locale}
          lookupMaps={lookupMaps}
          onSelectInspectorItem={onSelectInspectorItem}
          openInReaderLabel={openInReaderLabel}
          relatedStudy={relatedStudy}
          selection={selection}
        />
      ) : null}
    </Card>
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

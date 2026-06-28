"use client";

import { Card } from "@/components/ui/Card";

import {
  getTimelineBook,
  getTimelineText,
  timelineGenealogySegments,
  type TimelineGenealogyComparisonRow,
  type TimelineInspectorSelection,
  type TimelineKingdomComparisonRow,
  type TimelineLocale,
  type TimelineSchematicPlaceRow,
} from "./passionWeekTimeline";
import type { TimelineHighlightState } from "./timelineHighlightState";
import type { TimelineKingsKingdomsPreviewRow } from "./timelineKingsKingdomsPackage";
import { BookEvidencePanel } from "./timeline-detail-panel/BookEvidencePanel";
import { ContextRow } from "./timeline-detail-panel/ContextRow";
import { ContextTagGroup } from "./timeline-detail-panel/ContextTagGroup";
import { EventEvidencePanel } from "./timeline-detail-panel/EventEvidencePanel";
import { PanelSection } from "./timeline-detail-panel/PanelSection";
import { previewLimitationCopy } from "./timeline-detail-panel/panelCopy";
import { dedupeById, getKingdomEvidenceLabel, isKingsPackageEvidenceRow } from "./timeline-detail-panel/panelHelpers";
import { RelatedItemButton } from "./timeline-detail-panel/RelatedItemButton";
import { RelatedItemSection } from "./timeline-detail-panel/RelatedItemSection";
import { ScriptureAnchorsSection } from "./timeline-detail-panel/ScriptureAnchorsSection";
import { SectionNote } from "./timeline-detail-panel/SectionNote";
import { Tag } from "./timeline-detail-panel/Tag";
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

const DetailSection = PanelSection;

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

      <ScriptureAnchorsSection
        anchors={row.scriptureAnchors}
        label={locale === "ko" ? "성경 근거" : "Scripture Anchors"}
        locale={locale}
        openInReaderLabel={openInReaderLabel}
        rowId={row.id}
      />

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

      <ScriptureAnchorsSection
        anchors={row.scriptureAnchors}
        label={locale === "ko" ? "성경 근거" : "Scripture Anchors"}
        locale={locale}
        openInReaderLabel=""
        referenceOnly
        referenceOnlyDescription={
          locale === "ko"
            ? "이 package는 성경 본문을 저장하지 않습니다. 왕/왕국 수준 Scripture reference만 표시합니다."
            : "This package does not store Bible text. It shows king/kingdom-level Scripture references only."
        }
        rowId={row.id}
      />

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
        {row.basisLabel ? (
          <ContextRow
            label={locale === "ko" ? "패키지 기준" : "Package basis"}
            value={getTimelineText(row.basisLabel, locale)}
          />
        ) : null}
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

      <DetailSection label={locale === "ko" ? "내부 관계" : "Internal Relations"}>
        {relatedRows.length ? (
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
        ) : (
          <SectionNote>{getTimelineText(previewLimitationCopy.kingdomRelationsPending, locale)}</SectionNote>
        )}
      </DetailSection>

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

      <ScriptureAnchorsSection
        anchors={row.scriptureAnchors}
        label={locale === "ko" ? "성경 근거" : "Scripture Anchors"}
        locale={locale}
        openInReaderLabel={openInReaderLabel}
        rowId={row.id}
      />

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
        <SectionNote>{getTimelineText(previewLimitationCopy.genealogyDeferred, locale)}</SectionNote>
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

      <ScriptureAnchorsSection
        anchors={row.scriptureAnchors}
        label={locale === "ko" ? "성경 근거" : "Scripture Anchors"}
        locale={locale}
        openInReaderLabel={openInReaderLabel}
        rowId={row.id}
      />

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
        <ContextRow
          label={locale === "ko" ? "지도 범위" : "Map scope"}
          value={
            locale === "ko"
              ? "좌표 없는 schematic preview"
              : "Coordinate-free schematic preview"
          }
        />
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

      <DetailSection label={locale === "ko" ? "위치 근거 / 신뢰" : "Location Basis / Confidence"}>
        <ContextRow
          label={locale === "ko" ? "위치 근거" : "Location basis"}
          value={getTimelineText(row.locationBasisLabel, locale)}
        />
        <ContextRow
          label={locale === "ko" ? "위치 신뢰" : "Location confidence"}
          value={getTimelineText(row.locationConfidenceLabel, locale)}
        />
      </DetailSection>

      <DetailSection label={locale === "ko" ? "주의 / 메모" : "Caution / Note"}>
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
              {row.relatedBookContextIds.map((contextId: string) => {
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
              {row.relatedEventIds.map((eventId: string) => {
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
        {!row.relatedPeople?.length &&
        !row.relatedKingdoms?.length &&
        !row.relatedEmpires?.length &&
        !row.relatedBookContextIds?.length &&
        !row.relatedEventIds?.length ? (
          <SectionNote>{getTimelineText(previewLimitationCopy.placeRelationsPending, locale)}</SectionNote>
        ) : null}
      </DetailSection>

      <p className="text-sm leading-6 text-zinc-500">{relatedStudy}</p>
    </div>
  );
}

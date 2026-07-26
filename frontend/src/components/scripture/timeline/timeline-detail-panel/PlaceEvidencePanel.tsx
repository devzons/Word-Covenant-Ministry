import {
  getTimelineText,
  type TimelineInspectorSelection,
  type TimelineLocale,
  type TimelineSchematicPlaceRow,
} from "../passionWeekTimeline";
import { ContextRow } from "./ContextRow";
import { ContextTagGroup } from "./ContextTagGroup";
import { PanelSection } from "./PanelSection";
import { previewLimitationCopy } from "./panelCopy";
import { RelatedItemButton } from "./RelatedItemButton";
import { ScriptureAnchorsSection } from "./ScriptureAnchorsSection";
import { SectionNote } from "./SectionNote";
import type { TimelineEvidenceLookupMaps } from "./panelTypes";

type PlaceEvidencePanelProps = {
  row: TimelineSchematicPlaceRow;
  locale: TimelineLocale;
  lookupMaps: TimelineEvidenceLookupMaps;
  onSelectInspectorItem: (selection: TimelineInspectorSelection) => void;
  openInReaderLabel: string;
  relatedStudy: string;
  selection: TimelineInspectorSelection;
};

const DetailSection = PanelSection;

export function PlaceEvidencePanel({
  row,
  locale,
  lookupMaps,
  onSelectInspectorItem,
  openInReaderLabel,
  relatedStudy,
  selection,
}: PlaceEvidencePanelProps) {
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
          value={locale === "ko" ? "좌표 없는 schematic preview" : "Coordinate-free schematic preview"}
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

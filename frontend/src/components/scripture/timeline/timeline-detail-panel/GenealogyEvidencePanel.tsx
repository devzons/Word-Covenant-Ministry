import {
  getTimelineBook,
  getTimelineText,
  timelineGenealogySegments,
  type TimelineGenealogyComparisonRow,
  type TimelineInspectorSelection,
  type TimelineKingdomComparisonRow,
  type TimelineLocale,
} from "../passionWeekTimeline";
import { ContextRow } from "./ContextRow";
import { ContextTagGroup } from "./ContextTagGroup";
import { PanelSection } from "./PanelSection";
import { previewLimitationCopy } from "./panelCopy";
import { RelatedItemButton } from "./RelatedItemButton";
import { RelatedItemSection } from "./RelatedItemSection";
import { ScriptureAnchorsSection } from "./ScriptureAnchorsSection";
import { SectionNote } from "./SectionNote";
import { Tag } from "./Tag";
import type { TimelineEvidenceLookupMaps } from "./panelTypes";

type GenealogyEvidencePanelProps = {
  row: TimelineGenealogyComparisonRow;
  linkedKingdomRows: TimelineKingdomComparisonRow[];
  locale: TimelineLocale;
  lookupMaps: TimelineEvidenceLookupMaps;
  onSelectInspectorItem: (selection: TimelineInspectorSelection) => void;
  openInReaderLabel: string;
  relatedStudy: string;
  selection: TimelineInspectorSelection;
};

const DetailSection = PanelSection;

export function GenealogyEvidencePanel({
  row,
  linkedKingdomRows,
  locale,
  lookupMaps,
  onSelectInspectorItem,
  openInReaderLabel,
  relatedStudy,
  selection,
}: GenealogyEvidencePanelProps) {
  const segment = timelineGenealogySegments.find((item) => item.id === row.segmentId);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-950">{getTimelineText(row.matthewName, locale)}</h2>
        <p className="text-sm leading-6 text-zinc-600">
          {segment
            ? `${getTimelineText(segment.title, locale)} · ${getTimelineText(segment.rangeLabel, locale)}`
            : getTimelineText(row.comparisonLabel, locale)}
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
                return <Tag key={`${row.id}-${bookId}`}>{book ? getTimelineText(book.label, locale) : bookId}</Tag>;
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

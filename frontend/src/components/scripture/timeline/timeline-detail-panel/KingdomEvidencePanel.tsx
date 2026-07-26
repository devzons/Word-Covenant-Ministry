import {
  getTimelineBook,
  getTimelineText,
  type TimelineGenealogyComparisonRow,
  type TimelineInspectorSelection,
  type TimelineKingdomComparisonRow,
  type TimelineLocale,
} from "../passionWeekTimeline";
import type { TimelineKingsKingdomsPreviewRow } from "../timelineKingsKingdomsPackage";
import { ContextRow } from "./ContextRow";
import { ContextTagGroup } from "./ContextTagGroup";
import { PanelSection } from "./PanelSection";
import { previewLimitationCopy } from "./panelCopy";
import { getKingdomEvidenceLabel } from "./panelHelpers";
import { RelatedItemButton } from "./RelatedItemButton";
import { RelatedItemSection } from "./RelatedItemSection";
import { ScriptureAnchorsSection } from "./ScriptureAnchorsSection";
import { SectionNote } from "./SectionNote";
import { Tag } from "./Tag";
import type { TimelineEvidenceLookupMaps, TimelineKingdomEvidenceRow } from "./panelTypes";

type SharedProps = {
  locale: TimelineLocale;
  lookupMaps: TimelineEvidenceLookupMaps;
  onSelectInspectorItem: (selection: TimelineInspectorSelection) => void;
  openInReaderLabel: string;
  relatedStudy: string;
  selection: TimelineInspectorSelection;
};

type RuntimeKingdomEvidencePanelProps = SharedProps & {
  linkedGenealogyRows: TimelineGenealogyComparisonRow[];
  row: TimelineKingdomComparisonRow;
  variant: "runtime";
};

type PackageKingdomEvidencePanelProps = SharedProps & {
  relatedRows: TimelineKingdomEvidenceRow[];
  row: TimelineKingsKingdomsPreviewRow;
  variant: "package";
};

type KingdomEvidencePanelProps =
  | RuntimeKingdomEvidencePanelProps
  | PackageKingdomEvidencePanelProps;

const DetailSection = PanelSection;

export function KingdomEvidencePanel(props: KingdomEvidencePanelProps) {
  if (props.variant === "package") {
    const { locale, lookupMaps, onSelectInspectorItem, relatedRows, relatedStudy, row, selection } = props;

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-zinc-950">{getTimelineText(row.title, locale)}</h2>
          <p className="text-sm leading-6 text-zinc-600">
            {locale === "ko"
              ? "Kings / Kingdoms skeleton metadata preview"
              : "Kings / Kingdoms skeleton metadata preview"}
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
          <ContextRow label={locale === "ko" ? "record type" : "Record type"} value={row.recordType} />
          <ContextRow label={locale === "ko" ? "표시 순서" : "Display order"} value={`${row.displayOrder}`} />
          <ContextRow label={locale === "ko" ? "section" : "Section"} value={row.sectionId} />
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
              const label = bookRow
                ? getTimelineText(bookRow.title, locale)
                : getTimelineBook(bookId)?.label
                  ? getTimelineText(getTimelineBook(bookId)!.label, locale)
                  : bookId;

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

  const { linkedGenealogyRows, locale, lookupMaps, onSelectInspectorItem, openInReaderLabel, relatedStudy, row, selection } = props;

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
        {row.unitedKing ? (
          <ContextRow label={locale === "ko" ? "통일 왕국" : "United Kingdom"} value={getTimelineText(row.unitedKing, locale)} />
        ) : null}
        {row.judahKing ? (
          <ContextRow label={locale === "ko" ? "유다" : "Judah"} value={getTimelineText(row.judahKing, locale)} />
        ) : null}
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
        <ContextTagGroup label={locale === "ko" ? "열강" : "Empires"} locale={locale} tags={row.empireTags} />
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

      {row.dateLabel || row.dateBasisLabel || row.dateConfidenceLabel || row.nameVariantNote || row.note ? (
        <DetailSection label={locale === "ko" ? "보조 연대 / 주의" : "Supporting Date / Caution"}>
          {row.dateLabel ? (
            <ContextRow label={locale === "ko" ? "연대 표기" : "Date label"} value={getTimelineText(row.dateLabel, locale)} />
          ) : null}
          {row.dateBasisLabel ? <SectionNote>{getTimelineText(row.dateBasisLabel, locale)}</SectionNote> : null}
          {row.dateConfidenceLabel ? <SectionNote>{getTimelineText(row.dateConfidenceLabel, locale)}</SectionNote> : null}
          {row.nameVariantNote ? <SectionNote>{getTimelineText(row.nameVariantNote, locale)}</SectionNote> : null}
          {row.note ? <SectionNote>{getTimelineText(row.note, locale)}</SectionNote> : null}
          <SectionNote>{relatedStudy}</SectionNote>
        </DetailSection>
      ) : null}
    </div>
  );
}

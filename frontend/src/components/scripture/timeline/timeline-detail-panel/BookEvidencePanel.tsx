import {
  getTimelinePlace,
  getTimelineText,
  type TimelineBookContextRow,
  type TimelineInspectorSelection,
  type TimelineLocale,
  type TimelineSchematicPlaceRow,
  type TimelineText,
} from "../passionWeekTimeline";
import { ContextRow } from "./ContextRow";
import { ContextTagGroup } from "./ContextTagGroup";
import { PanelSection } from "./PanelSection";
import { previewLimitationCopy } from "./panelCopy";
import { dedupeById, getKingdomEvidenceLabel } from "./panelHelpers";
import { RelatedItemButton } from "./RelatedItemButton";
import { RelatedItemSection } from "./RelatedItemSection";
import { ScriptureAnchorsSection } from "./ScriptureAnchorsSection";
import { SectionNote } from "./SectionNote";
import type { TimelineEvidenceLookupMaps, TimelineKingdomEvidenceRow } from "./panelTypes";

type BookEvidencePanelProps = {
  row: TimelineBookContextRow;
  locale: TimelineLocale;
  lookupMaps: TimelineEvidenceLookupMaps;
  onSelectInspectorItem: (selection: TimelineInspectorSelection) => void;
  openInReaderLabel: string;
  relatedStudy: string;
  selection: TimelineInspectorSelection;
};

const DetailSection = PanelSection;

export function BookEvidencePanel({
  row,
  locale,
  lookupMaps,
  onSelectInspectorItem,
  openInReaderLabel,
  relatedStudy,
  selection,
}: BookEvidencePanelProps) {
  const relatedPlaceRows = dedupeById(
    (row.relatedPlaces ?? [])
      .map((placeId) => lookupMaps.schematicPlaceByPlaceId.get(placeId))
      .filter((place): place is TimelineSchematicPlaceRow => Boolean(place)),
  );
  const relatedBookRows = dedupeById(
    (row.relatedBookIds ?? [])
      .map((bookId) => lookupMaps.bookContextByBookId.get(bookId))
      .filter((bookRow): bookRow is TimelineBookContextRow => bookRow !== undefined && bookRow.id !== row.id),
  );
  const relatedKingdomRows = dedupeById(
    (row.relatedKingdomIds ?? [])
      .map((kingdomId) => lookupMaps.kingdomComparisonById.get(kingdomId))
      .filter((kingdomRow): kingdomRow is TimelineKingdomEvidenceRow => Boolean(kingdomRow)),
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-950">{getTimelineText(row.title, locale)}</h2>
        <p className="text-sm leading-6 text-zinc-600">{getTimelineText(row.canonicalLocation, locale)}</p>
      </div>

      <ScriptureAnchorsSection
        anchors={row.scriptureAnchors}
        label={locale === "ko" ? "성경 근거" : "Scripture Anchors"}
        locale={locale}
        openInReaderLabel={openInReaderLabel}
        referenceOnly={row.scriptureReferencesOnly}
        referenceOnlyDescription={
          row.scriptureReferencesOnly
            ? locale === "ko"
              ? "이 package는 성경 본문을 저장하지 않습니다. 책 수준 Scripture reference만 표시합니다."
              : "This package does not store Bible text. It shows book-level Scripture references only."
            : undefined
        }
        rowId={row.id}
      />

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
        {row.basisLabel ? (
          <ContextRow
            label={locale === "ko" ? "패키지 기준" : "Package basis"}
            value={getTimelineText(row.basisLabel, locale)}
          />
        ) : null}
        {row.confidenceLabel ? (
          <ContextRow
            label={locale === "ko" ? "근거 신뢰" : "Evidence confidence"}
            value={getTimelineText(row.confidenceLabel, locale)}
          />
        ) : null}
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
        {!row.relatedPeople?.length ? (
          <SectionNote>{getTimelineText(previewLimitationCopy.bookPeoplePending, locale)}</SectionNote>
        ) : null}
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
        {relatedBookRows.length ? (
          <RelatedItemSection label={locale === "ko" ? "관련 책/시편" : "Related Books / Psalms"}>
            {relatedBookRows.map((bookRow) => (
              <RelatedItemButton
                active={selection?.type === "book" && selection.id === bookRow.id}
                eyebrow={locale === "ko" ? "책 / 시편" : "Book / Psalm"}
                key={`${row.id}-${bookRow.id}`}
                label={getTimelineText(bookRow.title, locale)}
                onClick={() => onSelectInspectorItem({ id: bookRow.id, type: "book" })}
              />
            ))}
          </RelatedItemSection>
        ) : null}
        {relatedKingdomRows.length ? (
          <RelatedItemSection label={locale === "ko" ? "관련 왕국/제국" : "Related Kingdoms"}>
            {relatedKingdomRows.map((kingdomRow) => (
              <RelatedItemButton
                active={selection?.type === "kingdom" && selection.id === kingdomRow.id}
                eyebrow={locale === "ko" ? "왕국 / 제국" : "Kingdom / Empire"}
                key={`${row.id}-${kingdomRow.id}`}
                label={getKingdomEvidenceLabel(kingdomRow, locale)}
                onClick={() => onSelectInspectorItem({ id: kingdomRow.id, type: "kingdom" })}
              />
            ))}
          </RelatedItemSection>
        ) : null}
        {!row.relatedEventIds?.length &&
        !relatedPlaceRows.length &&
        !relatedBookRows.length &&
        !relatedKingdomRows.length ? (
          <SectionNote>{getTimelineText(previewLimitationCopy.relatedItemsPending, locale)}</SectionNote>
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

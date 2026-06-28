import {
  getTimelineBook,
  getTimelineDatePreview,
  getTimelinePlace,
  getTimelineText,
  timelineBookContextRows,
  timelineGenealogyComparisonRows,
  timelineKingdomComparisonRows,
  timelineSchematicPlaceRows,
  type PassionWeekTimelineEvent,
  type TimelineBookContextRow,
  type TimelineInspectorSelection,
  type TimelineLocale,
  type TimelineSchematicPlaceRow,
} from "../passionWeekTimeline";
import { TimelineDatingNote } from "../TimelineDatingNote";
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

type EventEvidencePanelProps = {
  event: PassionWeekTimelineEvent;
  locale: TimelineLocale;
  lookupMaps: TimelineEvidenceLookupMaps;
  onSelectInspectorItem: (selection: TimelineInspectorSelection) => void;
  openInReaderLabel: string;
  relatedStudy: string;
  selection: TimelineInspectorSelection;
};

const DetailSection = PanelSection;

export function EventEvidencePanel({
  event,
  locale,
  lookupMaps,
  onSelectInspectorItem,
  openInReaderLabel,
  relatedStudy,
  selection,
}: EventEvidencePanelProps) {
  const datePreview = getTimelineDatePreview(event);
  const hasExplicitDateMetadata = Boolean(event.dateLabel || event.dateBasisLabel || event.dateConfidenceLabel);
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
  const relatedKingdomRows = dedupeById(
    [
      ...timelineKingdomComparisonRows.filter((row) => row.relatedEventIds?.includes(event.id)),
      ...(event.relatedKingdomIds ?? [])
        .map((id) => lookupMaps.kingdomComparisonById.get(id))
        .filter((row): row is TimelineKingdomEvidenceRow => Boolean(row)),
    ],
  );
  const relatedEventRows = dedupeById(
    (event.relatedEventIds ?? [])
      .map((eventId) => lookupMaps.eventById.get(eventId))
      .filter((row): row is PassionWeekTimelineEvent => row !== undefined && row.id !== event.id),
  );
  const relatedGenealogyRows = timelineGenealogyComparisonRows.filter((row) => row.relatedEventIds?.includes(event.id));

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-950">{getTimelineText(event.title, locale)}</h2>
        <p className="text-sm leading-6 text-zinc-600">{getTimelineText(event.summary, locale)}</p>
      </div>

      <ScriptureAnchorsSection
        anchors={event.scriptureAnchors}
        label={locale === "ko" ? "성경 근거" : "Scripture Anchors"}
        locale={locale}
        openInReaderLabel={openInReaderLabel}
        referenceOnly={event.scriptureReferencesOnly}
        referenceOnlyDescription={
          event.scriptureReferencesOnly
            ? locale === "ko"
              ? "이 package는 성경 본문을 저장하지 않습니다. 사건 수준 Scripture reference만 표시합니다."
              : "This package does not store Bible text. It shows event-level Scripture references only."
            : undefined
        }
        rowId={event.id}
      />

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
        <ContextRow
          label={locale === "ko" ? "근거 신뢰" : "Evidence confidence"}
          value={getTimelineText(event.confidenceLevel, locale)}
        />
      </DetailSection>

      {(hasExplicitDateMetadata || !event.scriptureReferencesOnly) && datePreview ? (
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
          {event.scriptureReferencesOnly ? (
            <SectionNote>
              {locale === "ko"
                ? "이 연대 표기는 성경 본문이 아니라 package metadata에서 온 보조 참고 정보이며, 정확한 chronology proof로 사용하지 않습니다."
                : "This date metadata comes from the package as supporting reference only and is not used as exact chronology proof."}
            </SectionNote>
          ) : null}
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

      {relatedBookRows.length || relatedPackageBookRows.length || relatedPlaceRows.length || relatedKingdomRows.length || relatedEventRows.length || relatedGenealogyRows.length || event.sourcePackage === "core-biblical-skeleton" ? (
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
                  label={getKingdomEvidenceLabel(row, locale)}
                  onClick={() => onSelectInspectorItem({ id: row.id, type: "kingdom" })}
                />
              ))}
            </RelatedItemSection>
          ) : null}
          {relatedEventRows.length ? (
            <RelatedItemSection label={locale === "ko" ? "관련 사건" : "Related Events"}>
              {relatedEventRows.map((row) => (
                <RelatedItemButton
                  active={selection?.type === "event" && selection.id === row.id}
                  eyebrow={locale === "ko" ? "사건" : "Event"}
                  key={row.id}
                  label={getTimelineText(row.title, locale)}
                  onClick={() => onSelectInspectorItem({ id: row.id, type: "event" })}
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
          {!relatedBookRows.length &&
          !relatedPackageBookRows.length &&
          !relatedPlaceRows.length &&
          !relatedKingdomRows.length &&
          !relatedEventRows.length &&
          !relatedGenealogyRows.length ? (
            <SectionNote>{getTimelineText(previewLimitationCopy.relatedItemsPending, locale)}</SectionNote>
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

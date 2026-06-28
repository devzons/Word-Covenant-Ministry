import type { TimelineLocale, TimelineText } from "./passionWeekTimeline";

export type KoreanHistoryReferencePackage = {
  items: KoreanHistoryReferenceRow[];
};

export type KoreanHistoryReferenceCitation = {
  sourceId: string;
  sourceTitle: string;
  sourceProvider: string;
  sourceUrl: string | null;
  bibliographicReference?: string;
  sourceLicenseLabel: string;
  sourceAccessDate: string;
  sourceBasisLabel: string;
  sourceApprovalLevel: string;
  quotationPolicy: string;
  note: string;
};

export type KoreanHistoryReferenceRow = {
  id: string;
  region: "korea";
  timelinePeriodId: string;
  sectionId: string;
  displayOrder: number;
  accordionGroup: string;
  title: TimelineText;
  dateLabel: TimelineText;
  dateBasisLabel: TimelineText;
  confidenceLabel: TimelineText;
  referenceTypeLabel: TimelineText;
  sourceBasisLabel: TimelineText;
  sourceApprovalLevel: string;
  isSupportingReference: true;
  notBasisForBiblicalInterpretation: true;
  scriptureInterpretationUse: TimelineText;
  cautionNote: TimelineText;
  note: TimelineText;
  sourceCitations: KoreanHistoryReferenceCitation[];
  relatedBiblicalPeriodIds: string[];
  relatedEventIds: string[];
  relatedBookIds: string[];
  relatedPlaceIds: string[];
};

export type TimelineKoreanHistoryReferenceRow = KoreanHistoryReferenceRow & {
  sourcePackage: "korean-history-pilot";
};

const currentBiblicalPeriodIds = new Set([
  "primeval",
  "patriarchs",
  "exodus",
  "conquest",
  "united-kingdom",
  "divided-kingdom",
  "exile",
  "return",
  "gospel",
  "acts",
]);

export function normalizeKoreanHistoryReferencesPackage(
  packageData: KoreanHistoryReferencePackage,
): TimelineKoreanHistoryReferenceRow[] {
  return packageData.items
    .map((row) => ({
      ...row,
      sourcePackage: "korean-history-pilot" as const,
    }))
    .sort((left, right) => left.displayOrder - right.displayOrder);
}

export function getKoreanHistoryReferencesForPeriod(
  rows: TimelineKoreanHistoryReferenceRow[],
  periodId: string,
) {
  return rows.filter((row) => {
    if (row.relatedBiblicalPeriodIds.includes(periodId)) {
      return true;
    }

    return row.timelinePeriodId === periodId;
  });
}

export function getUnassignedKoreanHistoryReferences(
  rows: TimelineKoreanHistoryReferenceRow[],
) {
  return rows.filter((row) => {
    if (row.relatedBiblicalPeriodIds.length > 0) {
      return false;
    }

    return !currentBiblicalPeriodIds.has(row.timelinePeriodId);
  });
}

export function getIntentionallyUnlinkedPostBiblicalKoreanHistoryReferences(
  rows: TimelineKoreanHistoryReferenceRow[],
) {
  return getUnassignedKoreanHistoryReferences(rows).filter(
    (row) => row.timelinePeriodId === "reference-post-biblical",
  );
}

export function getKoreanHistoryReferenceLabel(
  text: TimelineText,
  locale: TimelineLocale,
) {
  return locale === "en" ? text.en : text.ko;
}

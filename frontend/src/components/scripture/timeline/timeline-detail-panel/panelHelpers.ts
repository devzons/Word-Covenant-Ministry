import { getTimelineText, type TimelineLocale } from "../passionWeekTimeline";
import type { TimelineKingsKingdomsPreviewRow } from "../timelineKingsKingdomsPackage";
import type { TimelineKingdomEvidenceRow } from "./panelTypes";

export function dedupeById<T extends { id: string }>(items: T[]) {
  return Array.from(new Map(items.map((item) => [item.id, item])).values());
}

export function isKingsPackageEvidenceRow(
  row: TimelineKingdomEvidenceRow,
): row is TimelineKingsKingdomsPreviewRow {
  return "sourcePackage" in row && row.sourcePackage === "kings-kingdoms-skeleton";
}

export function getKingdomEvidenceLabel(row: TimelineKingdomEvidenceRow, locale: TimelineLocale) {
  if (isKingsPackageEvidenceRow(row)) {
    return getTimelineText(row.title, locale);
  }

  return getTimelineText(row.sequenceLabel, locale);
}

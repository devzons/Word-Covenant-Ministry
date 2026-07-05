import type { TimelineText } from "./passionWeekTimeline";

export type TimelineChapterContextText = TimelineText;

export type TimelineChapterContextScriptureAnchor = {
  bookId: string;
  label: TimelineChapterContextText;
  reference: string;
  scope: string;
};

export type TimelineChapterContextRow = {
  id: string;
  chapterContextId: string;
  bookId: string;
  chapter: number;
  title: TimelineChapterContextText;
  summary: TimelineChapterContextText;
  chapterScopeLabel: TimelineChapterContextText;
  scriptureAnchors: TimelineChapterContextScriptureAnchor[];
  basisLabel: TimelineChapterContextText;
  confidenceLabel: TimelineChapterContextText;
  cautionNote: TimelineChapterContextText;
  reviewStatus: "reviewed";
  sourceBasisLabel: TimelineChapterContextText;
  relatedBookIds: string[];
  relatedEventIds: string[];
  relatedKingdomIds: string[];
  relatedPlaceIds: string[];
  relatedThemeLabels: TimelineChapterContextText[];
  isSkeleton: false;
};

type TimelineChapterContextPackage = {
  items?: unknown;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeText(value: unknown): TimelineChapterContextText | null {
  if (!isObject(value) || typeof value.ko !== "string" || typeof value.en !== "string") {
    return null;
  }

  return {
    ko: value.ko,
    en: value.en,
  };
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is string => typeof entry === "string" && entry.length > 0);
}

function normalizeTextArray(value: unknown): TimelineChapterContextText[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => normalizeText(entry))
    .filter((entry): entry is TimelineChapterContextText => entry !== null);
}

function normalizeScriptureAnchor(value: unknown): TimelineChapterContextScriptureAnchor | null {
  if (!isObject(value)) {
    return null;
  }

  const label = normalizeText(value.label);

  if (
    typeof value.bookId !== "string" ||
    typeof value.reference !== "string" ||
    typeof value.scope !== "string" ||
    label === null
  ) {
    return null;
  }

  return {
    bookId: value.bookId,
    label,
    reference: value.reference,
    scope: value.scope,
  };
}

function normalizeScriptureAnchors(value: unknown): TimelineChapterContextScriptureAnchor[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => normalizeScriptureAnchor(entry))
    .filter((entry): entry is TimelineChapterContextScriptureAnchor => entry !== null);
}

function normalizeChapterContextRow(value: unknown): TimelineChapterContextRow | null {
  if (!isObject(value)) {
    return null;
  }

  const title = normalizeText(value.title);
  const summary = normalizeText(value.summary);
  const chapterScopeLabel = normalizeText(value.chapterScopeLabel);
  const basisLabel = normalizeText(value.basisLabel);
  const confidenceLabel = normalizeText(value.confidenceLabel);
  const cautionNote = normalizeText(value.cautionNote);
  const sourceBasisLabel = normalizeText(value.sourceBasisLabel);
  const scriptureAnchors = normalizeScriptureAnchors(value.scriptureAnchors);
  const chapter = value.chapter;

  if (
    typeof value.id !== "string" ||
    typeof value.chapterContextId !== "string" ||
    typeof value.bookId !== "string" ||
    typeof chapter !== "number" ||
    !Number.isInteger(chapter) ||
    chapter < 1 ||
    title === null ||
    summary === null ||
    chapterScopeLabel === null ||
    basisLabel === null ||
    confidenceLabel === null ||
    cautionNote === null ||
    sourceBasisLabel === null ||
    scriptureAnchors.length === 0 ||
    value.reviewStatus !== "reviewed" ||
    value.isSkeleton !== false
  ) {
    return null;
  }

  return {
    id: value.id,
    chapterContextId: value.chapterContextId,
    bookId: value.bookId,
    chapter,
    title,
    summary,
    chapterScopeLabel,
    scriptureAnchors,
    basisLabel,
    confidenceLabel,
    cautionNote,
    reviewStatus: "reviewed",
    sourceBasisLabel,
    relatedBookIds: normalizeStringArray(value.relatedBookIds),
    relatedEventIds: normalizeStringArray(value.relatedEventIds),
    relatedKingdomIds: normalizeStringArray(value.relatedKingdomIds),
    relatedPlaceIds: normalizeStringArray(value.relatedPlaceIds),
    relatedThemeLabels: normalizeTextArray(value.relatedThemeLabels),
    isSkeleton: false,
  };
}

export function normalizeTimelineChapterContextPackage(
  raw: unknown,
): TimelineChapterContextRow[] {
  const packageData = raw as TimelineChapterContextPackage;

  if (!Array.isArray(packageData?.items)) {
    return [];
  }

  return packageData.items
    .map((entry) => normalizeChapterContextRow(entry))
    .filter((entry): entry is TimelineChapterContextRow => entry !== null);
}

export function getReviewedChapterContextByBookAndChapter(
  rows: TimelineChapterContextRow[],
  bookId: string,
  chapter: number,
): TimelineChapterContextRow | null {
  if (!bookId || !Number.isInteger(chapter) || chapter < 1) {
    return null;
  }

  return rows.find((row) => row.bookId === bookId && row.chapter === chapter) ?? null;
}

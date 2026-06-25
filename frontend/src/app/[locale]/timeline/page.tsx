import { readFile } from "node:fs/promises";
import path from "node:path";

import { SiteShell } from "@/components/layout/SiteShell";
import { siteConfig } from "@/config/site";

import { TimelinePageShell } from "@/components/scripture/timeline/TimelinePageShell";
import {
  getCanonicalBookPreviewStats,
  normalizeCanonicalBooksPackage,
  type CanonicalBooksPackage,
} from "@/components/scripture/timeline/timelineBooksPackage";
import {
  getCoreEventPreviewStats,
  normalizeCoreBiblicalEventsPackage,
  type CoreBiblicalEventsPackage,
} from "@/components/scripture/timeline/timelineEventsPackage";
import {
  getKingsKingdomsPreviewStats,
  normalizeKingsKingdomsPackage,
  type KingsKingdomsPackage,
} from "@/components/scripture/timeline/timelineKingsKingdomsPackage";

type TimelinePageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    book?: string;
    inspectId?: string;
    inspectType?: string;
    period?: string;
    place?: string;
    q?: string;
    view?: string;
  }>;
};

const timelineViews = ["overview", "events", "books", "kingdoms", "genealogy", "places"] as const;

export default async function TimelinePage({ params, searchParams }: TimelinePageProps) {
  const { locale } = await params;
  const activeLocale = getSupportedLocale(locale);
  const query = await searchParams;
  const initialView = parseTimelineView(query.view);
  const canonicalBooksPackage = await loadCanonicalBooksPackage();
  const coreEventsPackage = await loadCoreBiblicalEventsPackage();
  const kingsKingdomsPackage = await loadKingsKingdomsPackage();
  const canonicalBookRows = normalizeCanonicalBooksPackage(canonicalBooksPackage);
  const canonicalBookStats = getCanonicalBookPreviewStats(canonicalBookRows);
  const coreEventRows = normalizeCoreBiblicalEventsPackage(coreEventsPackage);
  const coreEventStats = getCoreEventPreviewStats(coreEventRows);
  const kingsKingdomRows = normalizeKingsKingdomsPackage(kingsKingdomsPackage);
  const kingsKingdomStats = getKingsKingdomsPreviewStats(kingsKingdomRows);
  const initialFilters = {
    bookId: parseFilterValue(query.book),
    periodId: parseFilterValue(query.period),
    placeId: parseFilterValue(query.place),
    searchTerm: parseQueryValue(query.q),
  };

  return (
    <SiteShell locale={activeLocale}>
      <TimelinePageShell
        canonicalBookRows={canonicalBookRows}
        canonicalBookStats={canonicalBookStats}
        coreEventRows={coreEventRows}
        coreEventStats={coreEventStats}
        initialFilters={initialFilters}
        initialView={initialView}
        kingsKingdomRows={kingsKingdomRows}
        kingsKingdomStats={kingsKingdomStats}
        key={[
          activeLocale,
          canonicalBookStats.totalCount,
          kingsKingdomStats.totalCount,
          initialView,
          initialFilters.bookId,
          initialFilters.periodId,
          initialFilters.placeId,
          initialFilters.searchTerm,
        ].join(":")}
        locale={activeLocale}
      />
    </SiteShell>
  );
}

function getSupportedLocale(locale: string): "en" | "ko" {
  return siteConfig.supportedLocales.includes(
    locale as (typeof siteConfig.supportedLocales)[number],
  ) && locale === "en"
    ? "en"
    : "ko";
}

function parseTimelineView(view: string | string[] | undefined): (typeof timelineViews)[number] {
  const value = parseQueryValue(view);

  return (timelineViews as readonly string[]).includes(value) ? (value as (typeof timelineViews)[number]) : "overview";
}

function parseQueryValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return typeof value === "string" ? value.trim() : "";
}

function parseFilterValue(value: string | string[] | undefined): string {
  const parsed = parseQueryValue(value);

  return parsed !== "" ? parsed : "all";
}

async function loadCanonicalBooksPackage(): Promise<CanonicalBooksPackage> {
  const packagePath = path.join(
    process.cwd(),
    "..",
    "docs",
    "data-packages",
    "timeline",
    "books.66-canonical-skeleton.json",
  );
  const raw = await readFile(packagePath, "utf8");
  return JSON.parse(raw) as CanonicalBooksPackage;
}

async function loadCoreBiblicalEventsPackage(): Promise<CoreBiblicalEventsPackage> {
  const packagePath = path.join(
    process.cwd(),
    "..",
    "docs",
    "data-packages",
    "timeline",
    "events.core-biblical-skeleton.json",
  );
  const raw = await readFile(packagePath, "utf8");
  return JSON.parse(raw) as CoreBiblicalEventsPackage;
}

async function loadKingsKingdomsPackage(): Promise<KingsKingdomsPackage> {
  const packagePath = path.join(
    process.cwd(),
    "..",
    "docs",
    "data-packages",
    "timeline",
    "kings-kingdoms.skeleton.json",
  );
  const raw = await readFile(packagePath, "utf8");
  return JSON.parse(raw) as KingsKingdomsPackage;
}

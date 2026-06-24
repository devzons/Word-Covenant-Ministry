import { SiteShell } from "@/components/layout/SiteShell";
import { siteConfig } from "@/config/site";

import { TimelinePageShell } from "@/components/scripture/timeline/TimelinePageShell";

type TimelinePageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    book?: string;
    period?: string;
    place?: string;
    q?: string;
    view?: string;
  }>;
};

const timelineViews = ["overview", "events", "books", "kingdoms", "genealogy"] as const;

export default async function TimelinePage({ params, searchParams }: TimelinePageProps) {
  const { locale } = await params;
  const activeLocale = getSupportedLocale(locale);
  const query = await searchParams;
  const initialView = parseTimelineView(query.view);
  const initialFilters = {
    bookId: parseFilterValue(query.book),
    periodId: parseFilterValue(query.period),
    placeId: parseFilterValue(query.place),
    searchTerm: parseQueryValue(query.q),
  };

  return (
    <SiteShell locale={activeLocale}>
      <TimelinePageShell
        initialFilters={initialFilters}
        initialView={initialView}
        key={[
          activeLocale,
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

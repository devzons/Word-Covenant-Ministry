"use client";

import { useMemo, useState } from "react";
import type { KeyboardEvent } from "react";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";

import {
  getTimelineBook,
  getTimelinePeriod,
  getTimelinePlace,
  getTimelineReaderHrefFromReader,
  getTimelineText,
  passionWeekTimelineEvents,
  type TimelineInspectorSelection,
  timelineBookContextRows,
  timelineGenealogyComparisonRows,
  timelineGenealogySegments,
  timelineKingdomComparisonRows,
  timelineSchematicPlaceRows,
  timelineBooks,
  timelinePeriods,
  timelinePlaces,
  type TimelineText,
  type TimelineLocale,
} from "./passionWeekTimeline";
import { ScriptureTimelineList } from "./ScriptureTimelineList";
import { TimelineEventDetailPanel } from "./TimelineEventDetailPanel";
import { TimelineFilterBar } from "./TimelineFilterBar";
import { TimelineViewTabs } from "./TimelineViewTabs";

type TimelinePageShellProps = {
  initialFilters: TimelineFilterState;
  initialView: TimelineView;
  locale: TimelineLocale;
};

type TimelineView = "overview" | "events" | "books" | "kingdoms" | "genealogy" | "places" | "themes";

type TimelineOption = {
  id: string;
  label: string;
};

type TimelineFilterState = {
  bookId: string;
  placeId: string;
  periodId: string;
  searchTerm: string;
};

const pageCopy = {
  en: {
    detailHeading: "Scripture Evidence Panel",
    eventsHeading: "Events View",
    eventsNote: "The flow stays Scripture-first and preserves the selected item in the right panel.",
    futureViewNote:
      "Themes remain future views until later approved phases add their own content layers.",
    openInReader: "Open in Reader",
    overviewHeading: "Scripture Flow",
    overviewNote:
      "This flow stays top-down and Scripture-first. The rows summarize broad biblical flow using the current preview content.",
    relatedStudy:
      "Related passages, Gospel Harmony links, authorship detail, and map layers deepen in later phases.",
    selectedLabel: "Selected",
    sidebar: {
      authorship: "Authorship / Book Context",
      book: "Book",
      clear: "Clear filters",
      confidence: "Confidence",
      covenant: "Covenant",
      empire: "Empire",
      future: "Future only",
      of: "of",
      period: "Period",
      people: "People",
      place: "Place",
      prophets: "Prophets",
      search: "Search",
      showing: "Showing",
      theme: "Theme",
      kingdom: "Kingdom",
    },
    viewTabs: [
      { id: "overview", label: "Overview", future: false },
      { id: "events", label: "Events", future: false },
      { id: "books", label: "Books / Psalms", future: false },
      { id: "kingdoms", label: "Kings & Kingdoms", future: false },
      { id: "genealogy", label: "Genealogy", future: false },
      { id: "places", label: "Places / Schematic Map", future: false },
      { id: "themes", label: "Themes", future: true },
    ],
  },
  ko: {
    detailHeading: "성경 근거 패널",
    eventsHeading: "사건 보기",
    eventsNote: "본문 흐름은 성경 우선을 유지하며, 선택 항목은 오른쪽 패널에 계속 남아 있습니다.",
    futureViewNote: "주제는 이후 승인 단계에서 각자 고유한 내용 층이 추가되기 전까지 미래 전용으로 남습니다.",
    openInReader: "읽기에서 열기",
    overviewHeading: "성경 흐름",
    overviewNote:
      "이 흐름은 위에서 아래로, 성경 우선으로 진행됩니다. 현재 미리보기 내용으로 큰 흐름을 요약합니다.",
    relatedStudy:
      "관련 구절, 복음서 링크, 저자 세부 정보, 지도 층은 이후 단계에서 더 깊어집니다.",
    selectedLabel: "선택됨",
    sidebar: {
      authorship: "저자 / 책 배경",
      book: "책",
      clear: "필터 초기화",
      confidence: "신뢰도",
      covenant: "언약",
      empire: "열강",
      future: "미래 전용",
      of: "중",
      period: "기간",
      people: "인물",
      place: "지명",
      prophets: "선지자",
      search: "검색",
      showing: "표시 중",
      theme: "주제",
      kingdom: "왕국",
    },
    viewTabs: [
      { id: "overview", label: "개요", future: false },
      { id: "events", label: "사건", future: false },
      { id: "books", label: "책 / 시편", future: false },
      { id: "kingdoms", label: "왕국 / 제국", future: false },
      { id: "genealogy", label: "족보 / 마태복음", future: false },
      { id: "places", label: "장소 / 개념지도", future: false },
      { id: "themes", label: "주제", future: true },
    ],
  },
} as const;

export function TimelinePageShell({ initialFilters, initialView, locale }: TimelinePageShellProps) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const copy = pageCopy[activeLocale];
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeView, setActiveView] = useState<TimelineView>(initialView);
  const [filters, setFilters] = useState<TimelineFilterState>(initialFilters);
  const [inspectorSelection, setInspectorSelection] = useState<TimelineInspectorSelection>(null);

  const periodCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const event of passionWeekTimelineEvents) {
      counts.set(event.periodId, (counts.get(event.periodId) ?? 0) + 1);
    }

    return counts;
  }, []);

  const bookCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const event of passionWeekTimelineEvents) {
      counts.set(event.primaryBookId, (counts.get(event.primaryBookId) ?? 0) + 1);

      for (const relatedBookId of event.relatedBookIds) {
        counts.set(relatedBookId, (counts.get(relatedBookId) ?? 0) + 1);
      }
    }

    return counts;
  }, []);

  const placeCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const event of passionWeekTimelineEvents) {
      for (const placeId of event.placeIds) {
        counts.set(placeId, (counts.get(placeId) ?? 0) + 1);
      }
    }

    return counts;
  }, []);

  const periodOptions = useMemo<TimelineOption[]>(
    () => [
      { id: "all", label: activeLocale === "ko" ? "모든 기간" : "All periods" },
      ...timelinePeriods
        .filter((period) => periodCounts.has(period.id))
        .sort((left, right) => left.order - right.order)
        .map((period) => ({
          id: period.id,
          label: `${getTimelineText(period.label, activeLocale)} (${periodCounts.get(period.id) ?? 0})`,
        })),
    ],
    [activeLocale, periodCounts],
  );

  const bookOptions = useMemo<TimelineOption[]>(
    () => [
      { id: "all", label: activeLocale === "ko" ? "모든 책" : "All books" },
      ...timelineBooks
        .filter((book) => bookCounts.has(book.id))
        .map((book) => ({
          id: book.id,
          label: `${getTimelineText(book.label, activeLocale)} (${bookCounts.get(book.id) ?? 0})`,
        })),
    ],
    [activeLocale, bookCounts],
  );

  const placeOptions = useMemo<TimelineOption[]>(
    () => [
      { id: "all", label: activeLocale === "ko" ? "모든 지명" : "All places" },
      ...timelinePlaces
        .filter((place) => placeCounts.has(place.id))
        .map((place) => ({
          id: place.id,
          label: `${getTimelineText(place.label, activeLocale)} (${placeCounts.get(place.id) ?? 0})`,
        })),
    ],
    [activeLocale, placeCounts],
  );

  const normalizedSearch = filters.searchTerm.trim().toLowerCase();

  const visibleEvents = useMemo(
    () =>
      passionWeekTimelineEvents.filter((event) => {
        const matchesPeriod = filters.periodId === "all" || event.periodId === filters.periodId;
        const matchesBook =
          filters.bookId === "all" ||
          event.primaryBookId === filters.bookId ||
          event.relatedBookIds.includes(filters.bookId);
        const matchesPlace = filters.placeId === "all" || event.placeIds.includes(filters.placeId);
        const matchesSearch = matchesTimelineSearch(event, normalizedSearch);

        return matchesPeriod && matchesBook && matchesPlace && matchesSearch;
      }),
    [filters.bookId, filters.periodId, filters.placeId, normalizedSearch],
  );

  const selectedEventId = inspectorSelection?.type === "event" ? inspectorSelection.id : "";

  const previewCounts = useMemo(() => {
    const periodCount = new Set(visibleEvents.map((event) => event.periodId)).size;
    const bookCount = new Set(
      visibleEvents.flatMap((event) => [event.primaryBookId, ...event.relatedBookIds]),
    ).size;
    const placeCount = new Set(visibleEvents.flatMap((event) => event.placeIds)).size;

    return {
      bookCount,
      periodCount,
      placeCount,
      totalCount: passionWeekTimelineEvents.length,
      visibleCount: visibleEvents.length,
    };
  }, [visibleEvents]);

  const visiblePeriodSummaries = useMemo(
    () =>
      timelinePeriods
        .filter((period) => visibleEvents.some((event) => event.periodId === period.id))
        .sort((left, right) => left.order - right.order)
        .map((period) => ({
          count: visibleEvents.filter((event) => event.periodId === period.id).length,
          id: period.id,
          label: getTimelineText(period.label, activeLocale),
        })),
    [activeLocale, visibleEvents],
  );

  const eventById = useMemo(
    () => new Map(passionWeekTimelineEvents.map((event) => [event.id, event])),
    [],
  );
  const bookContextById = useMemo(
    () => new Map(timelineBookContextRows.map((row) => [row.id, row])),
    [],
  );
  const kingdomComparisonById = useMemo(
    () => new Map(timelineKingdomComparisonRows.map((row) => [row.id, row])),
    [],
  );
  const genealogyComparisonById = useMemo(
    () => new Map(timelineGenealogyComparisonRows.map((row) => [row.id, row])),
    [],
  );
  const schematicPlaceById = useMemo(
    () => new Map(timelineSchematicPlaceRows.map((row) => [row.id, row])),
    [],
  );
  const schematicPlaceByPlaceId = useMemo(
    () => new Map(timelineSchematicPlaceRows.map((row) => [row.placeId, row])),
    [],
  );

  function syncViewToUrl(nextView: TimelineView) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", nextView);
    const nextQuery = params.toString();

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }

  function setTimelineView(nextView: TimelineView, clearSelection = false) {
    setActiveView(nextView);

    if (clearSelection) {
      setInspectorSelection(null);
    }

    syncViewToUrl(nextView);
  }

  function getViewForSelection(selection: Exclude<TimelineInspectorSelection, null>): TimelineView {
    switch (selection.type) {
      case "event":
        return "events";
      case "book":
        return "books";
      case "kingdom":
        return "kingdoms";
      case "genealogy":
        return "genealogy";
      case "place":
        return "places";
    }
  }

  function selectInspectorItem(selection: TimelineInspectorSelection, view?: TimelineView) {
    if (!selection) {
      setInspectorSelection(null);
      return;
    }

    const nextView = view ?? getViewForSelection(selection);
    setInspectorSelection(selection);

    if (nextView !== activeView) {
      setActiveView(nextView);
    }

    syncViewToUrl(nextView);
  }

  const activeViewLabel = getTimelineViewLabel(activeView, activeLocale);

  return (
    <Container className="max-w-[96rem] py-12 sm:py-16">
      <section className="flex flex-col gap-6 sm:gap-8">
        <header className="flex max-w-4xl flex-col gap-2 sm:gap-3">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
            Word Covenant Ministry
          </p>
          <h1 className="text-3xl font-semibold text-zinc-950 sm:text-4xl">{activeLocale === "ko" ? "성경 Timeline" : "Scripture Timeline"}</h1>
          <p className="text-base leading-7 text-zinc-600">{activeLocale === "ko"
            ? "성경 본문을 중심으로 사건, 순서, 근거 구절을 따라가는 연구 연표"
            : "A Scripture-first timeline for following events, sequence, and passage anchors."}</p>
        </header>

        <TimelineViewTabs
          activeTab={activeView}
          locale={activeLocale}
          onTabChange={(tabId) => {
            setTimelineView(tabId as TimelineView, true);
          }}
          tabs={copy.viewTabs}
        />

        <div
          className={cn(
            "grid gap-6",
            "xl:grid-cols-[19rem_minmax(0,1fr)_21rem]",
            "2xl:grid-cols-[20rem_minmax(0,1fr)_22rem]",
            "xl:items-start",
          )}
        >
          <TimelineFilterBar
            activeBookId={filters.bookId}
            activePeriodId={filters.periodId}
            activePlaceId={filters.placeId}
            activeView={activeView}
            bookOptions={bookOptions}
            confidenceLabel={activeLocale === "ko" ? "높은 신뢰도 미리보기" : "High-confidence preview"}
            confidenceNote={
              activeLocale === "ko"
                ? "신뢰도는 카드와 상세 패널에 계속 표시됩니다."
                : "Confidence remains visible on cards and in the detail panel."
            }
            labels={copy.sidebar}
            locale={activeLocale}
            onBookChange={(bookId) => setFilters((current) => ({ ...current, bookId }))}
            onClearFilters={() =>
              setFilters({
                bookId: "all",
                placeId: "all",
                periodId: "all",
                searchTerm: "",
              })
            }
            onPeriodChange={(periodId) =>
              setFilters((current) => ({ ...current, periodId }))
            }
            onPlaceChange={(placeId) => setFilters((current) => ({ ...current, placeId }))}
            onSearchChange={(searchTerm) =>
              setFilters((current) => ({ ...current, searchTerm }))
            }
            periodOptions={periodOptions}
            placeOptions={placeOptions}
            previewNote={
              activeLocale === "ko"
                ? "기간, 책, 지명, 왕국, 족보, 그리고 개념지도 미리보기는 현재 레이아웃에서 실제로 작동합니다. 나머지 섹션은 다음 단계에서 확장됩니다."
                : "Period, book, place, kingdom, genealogy, and schematic map previews are active in the current layout. The remaining sections expand in later phases."
            }
            searchTerm={filters.searchTerm}
            totalCount={previewCounts.totalCount}
            visibleCount={previewCounts.visibleCount}
          />

          <div className="flex min-w-0 flex-col gap-4">
            <CompactStatusRow
              activeBookLabel={bookLabelForStatus(filters.bookId, bookOptions, activeLocale)}
              activePeriodLabel={periodLabelForStatus(filters.periodId, periodOptions, activeLocale)}
              activePlaceLabel={placeLabelForStatus(filters.placeId, placeOptions, activeLocale)}
              locale={activeLocale}
              activeView={activeView}
              modeLabel={activeViewLabel}
              totalCount={previewCounts.totalCount}
              visibleCount={previewCounts.visibleCount}
            />

            <div key={activeView} className="min-w-0">
              {activeView === "overview" ? (
                <OverviewPreviewPanel
                  locale={activeLocale}
                  overviewHeading={copy.overviewHeading}
                  overviewNote={copy.overviewNote}
                  previewCounts={previewCounts}
                  periods={visiblePeriodSummaries}
                />
              ) : null}

              {activeView === "events" ? (
                <EventsPreviewPanel
                  eventsHeading={copy.eventsHeading}
                  eventsNote={copy.eventsNote}
                  locale={activeLocale}
                  previewCounts={previewCounts}
                />
              ) : null}

              {activeView === "kingdoms" ? (
                <KingsKingdomsPreviewPanel
                  locale={activeLocale}
                  onSelectRow={(rowId) => selectInspectorItem({ id: rowId, type: "kingdom" })}
                  selectedRowId={inspectorSelection?.type === "kingdom" ? inspectorSelection.id : ""}
                />
              ) : null}

              {activeView === "books" ? (
                <BooksContextPreviewPanel
                  activeBookId={filters.bookId}
                  activePeriodId={filters.periodId}
                  locale={activeLocale}
                  onSelectRow={(rowId) => selectInspectorItem({ id: rowId, type: "book" })}
                  searchTerm={filters.searchTerm}
                  selectedRowId={inspectorSelection?.type === "book" ? inspectorSelection.id : ""}
                />
              ) : null}

              {activeView === "genealogy" ? (
                <GenealogyComparisonPreviewPanel
                  activePeriodId={filters.periodId}
                  locale={activeLocale}
                  onSelectRow={(rowId) => selectInspectorItem({ id: rowId, type: "genealogy" })}
                  searchTerm={filters.searchTerm}
                  selectedRowId={inspectorSelection?.type === "genealogy" ? inspectorSelection.id : ""}
                />
              ) : null}

              {activeView === "places" ? (
                <PlacesSchematicMapPreviewPanel
                  locale={activeLocale}
                  onSelectRow={(rowId) => selectInspectorItem({ id: rowId, type: "place" })}
                  searchTerm={filters.searchTerm}
                  selectedRowId={inspectorSelection?.type === "place" ? inspectorSelection.id : ""}
                />
              ) : null}

              {activeView === "events" ? (
                <div className="mt-4">
                  <ScriptureTimelineList
                    activePeriodId={filters.periodId}
                    events={visibleEvents}
                    locale={activeLocale}
                    searchTerm={filters.searchTerm}
                    onSelect={(eventId) => selectInspectorItem({ id: eventId, type: "event" })}
                    selectedEventId={selectedEventId}
                  />
                </div>
              ) : null}
            </div>
          </div>

          <TimelineEventDetailPanel
            selection={inspectorSelection}
            panelHeading={copy.detailHeading}
            locale={activeLocale}
            noSelection={
              activeLocale === "ko"
                ? "항목을 선택하세요. 사건, 시편, 왕국, 족보, 장소 항목을 선택하면 이곳에 성경 근거와 연결 본문이 표시됩니다."
                : "Select an item. When you choose an event, psalm, kingdom, genealogy row, or place, this panel will show its Scripture anchors and supporting context."
            }
            openInReaderLabel={copy.openInReader}
            relatedStudy={copy.relatedStudy}
            onSelectInspectorItem={selectInspectorItem}
            selectedLabel={copy.selectedLabel}
            lookupMaps={{
              bookContextById,
              eventById,
              genealogyComparisonById,
              kingdomComparisonById,
              schematicPlaceById,
              schematicPlaceByPlaceId,
            }}
          />
        </div>
      </section>
    </Container>
  );
}

type CompactStatusRowProps = {
  activeBookLabel: string;
  activePeriodLabel: string;
  activePlaceLabel: string;
  activeView: TimelineView;
  locale: TimelineLocale;
  modeLabel: string;
  totalCount: number;
  visibleCount: number;
};

function CompactStatusRow({
  activeBookLabel,
  activePeriodLabel,
  activePlaceLabel,
  activeView,
  locale,
  modeLabel,
  totalCount,
  visibleCount,
}: CompactStatusRowProps) {
  const viewStatusNote = getCompactStatusNote(activeView, locale, visibleCount, totalCount);

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-600">
      <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-700">
        {modeLabel}
      </span>
      {activeView === "events" || activeView === "overview" ? (
        <>
          <span className="text-zinc-300" aria-hidden="true">
            ·
          </span>
          <span>{activePeriodLabel}</span>
          <span className="text-zinc-300" aria-hidden="true">
            ·
          </span>
          <span>{activeBookLabel}</span>
          <span className="text-zinc-300" aria-hidden="true">
            ·
          </span>
          <span>{activePlaceLabel}</span>
        </>
      ) : null}
      <span className="text-zinc-300" aria-hidden="true">
        ·
      </span>
      <span className="font-medium text-zinc-950">{viewStatusNote}</span>
    </div>
  );
}

function getCompactStatusNote(
  view: TimelineView,
  locale: TimelineLocale,
  visibleCount: number,
  totalCount: number,
) {
  switch (view) {
    case "overview":
    case "events":
      return locale === "ko"
        ? `${visibleCount}개 사건 / 전체 ${totalCount}개`
        : `${visibleCount} events / ${totalCount} total`;
    case "books":
      return locale === "ko" ? "runtime preview rows · 66권 package 연결 전" : "Runtime preview rows · 66-book package not integrated";
    case "kingdoms":
      return locale === "ko" ? "왕국 비교 preview rows" : "Kingdom comparison preview rows";
    case "genealogy":
      return locale === "ko" ? "마태복음 1장 preview" : "Matthew 1 preview";
    case "places":
      return locale === "ko" ? "좌표 없는 개념지도 preview" : "Non-coordinate schematic preview";
    case "themes":
      return locale === "ko" ? "준비 중" : "Planned";
  }
}

function getTimelineViewLabel(view: TimelineView, locale: TimelineLocale) {
  switch (view) {
    case "overview":
      return locale === "ko" ? "성경 흐름" : "Scripture Flow";
    case "events":
      return locale === "ko" ? "사건 흐름" : "Event Stream";
    case "books":
      return locale === "ko" ? "책·시편" : "Books & Psalms";
    case "kingdoms":
      return locale === "ko" ? "왕국·제국" : "Kings & Kingdoms";
    case "genealogy":
      return locale === "ko" ? "족보 / 마태복음" : "Matthew Genealogy";
    case "places":
      return locale === "ko" ? "장소 / 개념지도" : "Places / Schematic Map";
    case "themes":
      return locale === "ko" ? "주제" : "Themes";
  }
}

type OverviewPreviewPanelProps = {
  locale: TimelineLocale;
  overviewHeading: string;
  overviewNote: string;
  periods: Array<{
    count: number;
    id: string;
    label: string;
  }>;
  previewCounts: {
    bookCount: number;
    periodCount: number;
    placeCount: number;
    totalCount: number;
    visibleCount: number;
  };
};

function OverviewPreviewPanel({
  locale,
  overviewHeading,
  overviewNote,
  periods,
  previewCounts,
}: OverviewPreviewPanelProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex flex-col gap-1.5 border-b border-zinc-200 pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
            {overviewHeading}
          </p>
          <p className="mt-1 text-sm leading-6 text-zinc-600">{overviewNote}</p>
        </div>
        <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-700">
          {locale === "ko" ? "개요" : "Overview"}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <OverviewMetric
          label={locale === "ko" ? "표시 사건" : "Visible events"}
          value={`${previewCounts.visibleCount}`}
        />
        <OverviewMetric
          label={locale === "ko" ? "전체 사건" : "Total events"}
          value={`${previewCounts.totalCount}`}
        />
        <OverviewMetric
          label={locale === "ko" ? "표시 기간" : "Visible periods"}
          value={`${previewCounts.periodCount}`}
        />
        <OverviewMetric
          label={locale === "ko" ? "표시 책 / 지명" : "Visible books / places"}
          value={`${previewCounts.bookCount} / ${previewCounts.placeCount}`}
        />
      </div>

      <div className="mt-4 space-y-2">
        {periods.map((period) => (
          <div
            className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2"
            key={period.id}
          >
            <span className="text-sm font-medium text-zinc-900">{period.label}</span>
            <span className="inline-flex rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-700">
              {locale === "ko" ? `${period.count}개 사건` : `${period.count} events`}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

type OverviewMetricProps = {
  label: string;
  value: string;
};

function OverviewMetric({ label, value }: OverviewMetricProps) {
  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-zinc-950">{value}</p>
    </div>
  );
}

type EventsPreviewPanelProps = {
  eventsHeading: string;
  eventsNote: string;
  locale: TimelineLocale;
  previewCounts: {
    totalCount: number;
    visibleCount: number;
  };
};

function EventsPreviewPanel({
  eventsHeading,
  eventsNote,
  locale,
  previewCounts,
}: EventsPreviewPanelProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex flex-wrap items-end justify-between gap-2 border-b border-zinc-200 pb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
            {eventsHeading}
          </p>
          <p className="mt-1 text-sm leading-6 text-zinc-600">{eventsNote}</p>
        </div>
        <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-700">
          {locale === "ko"
            ? `${previewCounts.visibleCount} / ${previewCounts.totalCount}개`
            : `${previewCounts.visibleCount} / ${previewCounts.totalCount}`}
        </span>
      </div>
    </section>
  );
}

type PlacesSchematicMapPreviewPanelProps = {
  locale: TimelineLocale;
  onSelectRow: (rowId: string) => void;
  searchTerm: string;
  selectedRowId: string;
};

type SchematicFlowSection = {
  id: string;
  label: TimelineText;
  note: TimelineText;
  rowIds: string[];
};

// Center column follows a top-to-bottom biblical flow first; schematic place views
// keep that chronology before any regional grouping.
const schematicFlowSections: SchematicFlowSection[] = [
  {
    id: "patriarchal",
    label: { en: "Primeval / Patriarchal Setting", ko: "태고 / 족장 배경" },
    note: { en: "Early movements before Israel enters the land", ko: "이스라엘이 땅에 들어가기 전의 초기 흐름" },
    rowIds: ["schematic-place-shinar", "schematic-place-ur", "schematic-place-shechem", "schematic-place-hebron"],
  },
  {
    id: "exodus",
    label: { en: "Exodus / Wilderness", ko: "출애굽 / 광야" },
    note: { en: "Deliverance, covenant, and wilderness movement", ko: "구원, 언약, 광야 이동 흐름" },
    rowIds: ["schematic-place-egypt", "schematic-place-sinai"],
  },
  {
    id: "conquest",
    label: { en: "Conquest / Judges / Ruth", ko: "정복 / 사사 / 룻기" },
    note: { en: "Entry, settlement, and covenant family movements", ko: "입성, 정착, 언약 가정의 이동" },
    rowIds: ["schematic-place-jericho", "schematic-place-moab", "schematic-place-bethlehem"],
  },
  {
    id: "united-kingdom",
    label: { en: "United Kingdom / David", ko: "통일 왕국 / 다윗" },
    note: { en: "Royal center, refuge, and Davidic settings", ko: "왕국 중심, 피난, 다윗 배경" },
    rowIds: [
      "schematic-place-jerusalem",
      "schematic-place-gath",
      "schematic-place-nob",
      "schematic-place-adullam",
      "schematic-place-en-gedi",
      "schematic-place-wilderness-of-judah",
    ],
  },
  {
    id: "divided-kingdom",
    label: { en: "Divided Kingdom / Prophets", ko: "분열 왕국 / 선지자" },
    note: { en: "Judah, Northern Israel, and imperial pressure", ko: "유다, 북이스라엘, 제국 압박" },
    rowIds: ["schematic-place-jerusalem-judah", "schematic-place-aram", "schematic-place-assyria"],
  },
  {
    id: "exile-return",
    label: { en: "Exile / Return", ko: "포로기 / 귀환" },
    note: { en: "Babylon and Persian return settings", ko: "바벨론과 바사 귀환 배경" },
    rowIds: ["schematic-place-babylon", "schematic-place-susa"],
  },
];

function PlacesSchematicMapPreviewPanel({
  locale,
  onSelectRow,
  searchTerm,
  selectedRowId,
}: PlacesSchematicMapPreviewPanelProps) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const visibleRows = timelineSchematicPlaceRows.filter((row) => matchesSchematicPlaceSearch(row, normalizedSearch));

  const groupedSections = schematicFlowSections
    .map((section) => ({
      rows: visibleRows.filter((row) => section.rowIds.includes(row.id)),
      section,
    }))
    .filter(({ rows }) => rows.length > 0);

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex flex-col gap-1.5 border-b border-zinc-200 pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
            {locale === "ko" ? "장소 / 개념지도" : "Places / Schematic Map"}
          </p>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            {locale === "ko"
              ? "이 지도는 성경 본문 흐름을 돕는 개념지도입니다. 정확한 좌표 지도가 아니며, 오늘날 지명은 보조 표기로만 표시됩니다. 중앙 컬럼은 시대순 위→아래 흐름을 우선합니다."
              : "This map is a schematic aid for following the biblical textual flow. It is not a coordinate map, and modern place labels are shown only as supporting references. The center column defaults to a top-to-bottom chronological flow."}
          </p>
        </div>
        <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-700">
          {locale === "ko" ? "미리보기" : "Preview"}
        </span>
      </div>

      <div className="mt-4 rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
          {locale === "ko" ? "성경 흐름 개념지도" : "Biblical Flow Schematic"}
        </p>
        {visibleRows.length === 0 ? (
          <div className="mt-3 rounded-md border border-zinc-200 bg-white px-3 py-4 text-sm leading-6 text-zinc-600">
            {locale === "ko"
              ? "검색과 일치하는 장소가 없습니다."
              : "No places match the current search."}
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {groupedSections.map(({ section, rows }, index) => (
              <div className="flex flex-col gap-3" key={section.id}>
                <section className="rounded-md border border-zinc-200 bg-white p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-zinc-200 pb-2.5">
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-950">{getTimelineText(section.label, locale)}</h3>
                      <p className="mt-1 text-xs leading-5 text-zinc-500">{getTimelineText(section.note, locale)}</p>
                    </div>
                    <span className="inline-flex shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-700">
                      {locale === "ko" ? `${rows.length}개` : `${rows.length}`}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    {rows.map((row) => (
                      <article
                        className={cn(
                          "relative rounded-md border bg-white p-3 transition-colors",
                          selectedRowId === row.id
                            ? "border-zinc-950 shadow-sm"
                            : "cursor-pointer border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50",
                        )}
                        key={row.id}
                        onClick={() => onSelectRow(row.id)}
                        onKeyDown={(event) => handleSelectableKeyDown(event, () => onSelectRow(row.id))}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className={cn(
                              "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border",
                              selectedRowId === row.id ? "border-zinc-950 bg-zinc-950" : "border-zinc-300 bg-zinc-300",
                            )}
                          />

                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-zinc-950">{getTimelineText(row.title, locale)}</p>
                                {row.modernReferenceLabel ? (
                                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                                    {getTimelineText(row.modernReferenceLabel, locale)}
                                  </p>
                                ) : null}
                              </div>
                              {row.modernReferenceStatusLabel ? (
                                <span className="inline-flex shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-semibold text-zinc-700">
                                  {getTimelineText(row.modernReferenceStatusLabel, locale)}
                                </span>
                              ) : null}
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                              <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-semibold text-zinc-700">
                                {getTimelineText(row.conceptRegionLabel, locale)}
                              </span>
                              {row.placeTypeLabel ? (
                                <span className="inline-flex rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-zinc-700">
                                  {getTimelineText(row.placeTypeLabel, locale)}
                                </span>
                              ) : null}
                              {row.conceptFlowGroup ? (
                                <span className="inline-flex rounded-full border border-dashed border-zinc-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-zinc-600">
                                  {getSchematicFlowGroupLabel(row.conceptFlowGroup, locale)}
                                </span>
                              ) : null}
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                              {row.scriptureAnchors.map((anchor) => (
                                <Link
                                  className={cn(
                                    "inline-flex min-h-8 items-center rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold leading-none text-zinc-900 transition-colors hover:border-zinc-300 hover:bg-zinc-50",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
                                  )}
                                  href={getTimelineReaderHrefFromReader(anchor.reader, locale)}
                                  onClick={(event) => event.stopPropagation()}
                                  key={`${row.id}-${anchor.label.en}-${anchor.reader.book}-${anchor.reader.chapter}-${anchor.reader.verse}`}
                                >
                                  {getTimelineText(anchor.label, locale)}
                                </Link>
                              ))}
                            </div>

                            <div className="space-y-1.5 text-xs leading-5 text-zinc-500">
                              <p>
                                <span className="font-medium text-zinc-600">
                                  {locale === "ko" ? "위치 근거: " : "Location basis: "}
                                </span>
                                {getTimelineText(row.locationBasisLabel, locale)}
                              </p>
                              <p>
                                <span className="font-medium text-zinc-600">
                                  {locale === "ko" ? "신뢰도: " : "Confidence: "}
                                </span>
                                {getTimelineText(row.locationConfidenceLabel, locale)}
                              </p>
                              {row.cautionNote ? (
                                <p>
                                  <span className="font-medium text-zinc-600">
                                    {locale === "ko" ? "주의: " : "Caution: "}
                                  </span>
                                  {getTimelineText(row.cautionNote, locale)}
                                </p>
                              ) : null}
                              <p>{getTimelineText(row.note, locale)}</p>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                {index < groupedSections.length - 1 ? (
                  <div className="flex justify-center text-lg font-semibold text-zinc-300" aria-hidden="true">
                    ↓
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function getSchematicFlowGroupLabel(
  flowGroup: NonNullable<(typeof timelineSchematicPlaceRows)[number]["conceptFlowGroup"]>,
  locale: TimelineLocale,
) {
  switch (flowGroup) {
    case "david-flight":
      return locale === "ko" ? "다윗 도피" : "David flight";
    case "exile-return":
      return locale === "ko" ? "포로 / 귀환" : "Exile / return";
    case "exodus":
      return locale === "ko" ? "출애굽" : "Exodus";
    case "kingdoms":
      return locale === "ko" ? "왕국 흐름" : "Kingdoms";
    case "patriarchs":
      return locale === "ko" ? "족장 시대" : "Patriarchs";
    case "psalms":
      return locale === "ko" ? "시편 배경" : "Psalm setting";
  }

  return locale === "ko" ? "기타" : "Other";
}

type KingsKingdomsPreviewPanelProps = {
  locale: TimelineLocale;
  onSelectRow: (rowId: string) => void;
  selectedRowId: string;
};

function KingsKingdomsPreviewPanel({ locale, onSelectRow, selectedRowId }: KingsKingdomsPreviewPanelProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex flex-col gap-1.5 border-b border-zinc-200 pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
            {locale === "ko" ? "왕국 / 제국 비교표" : "Kings / Kingdoms Comparison"}
          </p>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            {locale === "ko"
              ? "이 표는 성경 근거를 따라 왕국, 열강, 선지자, 보조 연대를 간단히 비교합니다."
              : "This table compares kingdoms, empires, prophets, and supporting dates while staying anchored to Scripture."}
          </p>
        </div>
        <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-700">
          {locale === "ko" ? "미리보기" : "Preview"}
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-[88rem] w-full border-separate border-spacing-0">
          <thead>
            <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
              <th className="border-b border-zinc-200 px-3 py-2">
                {locale === "ko" ? "시대 / 흐름" : "Era / Flow"}
              </th>
              <th className="border-b border-zinc-200 px-3 py-2">
                {locale === "ko" ? "통일 왕국" : "United Kingdom"}
              </th>
              <th className="border-b border-zinc-200 px-3 py-2">
                {locale === "ko" ? "유다" : "Judah"}
              </th>
              <th className="border-b border-zinc-200 px-3 py-2">
                {locale === "ko" ? "북이스라엘" : "Northern Israel"}
              </th>
              <th className="border-b border-zinc-200 px-3 py-2">
                {locale === "ko" ? "선지자" : "Prophets"}
              </th>
              <th className="border-b border-zinc-200 px-3 py-2">
                {locale === "ko" ? "열강 / 주변 민족" : "Empires / Nations"}
              </th>
              <th className="border-b border-zinc-200 px-3 py-2">
                {locale === "ko" ? "성경 근거" : "Scripture Anchor"}
              </th>
              <th className="border-b border-zinc-200 px-3 py-2">
                {locale === "ko" ? "보조 연대 / 메모" : "Supporting Date / Note"}
              </th>
            </tr>
          </thead>
          <tbody>
            {timelineKingdomComparisonRows.map((row) => {
              const period = getTimelinePeriod(row.periodId);
              const isSelected = selectedRowId === row.id;

              return (
                <tr
                  className={cn(
                    "align-top transition-colors",
                    isSelected
                      ? "bg-zinc-50/80"
                      : "cursor-pointer bg-white hover:bg-zinc-50",
                  )}
                  key={row.id}
                  onClick={() => onSelectRow(row.id)}
                  onKeyDown={(event) => handleSelectableKeyDown(event, () => onSelectRow(row.id))}
                  role="button"
                  tabIndex={0}
                >
                  <td className="border-b border-zinc-200 px-3 py-3">
                    <div className="flex flex-col gap-1.5">
                      {period ? (
                        <span className="inline-flex w-fit rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-semibold text-zinc-700">
                          {getTimelineText(period.label, locale)}
                        </span>
                      ) : null}
                      <span className="text-sm font-semibold text-zinc-950">
                        {getTimelineText(row.eraLabel, locale)}
                      </span>
                      <span className="text-xs font-medium leading-5 text-zinc-500">
                        {getTimelineText(row.sequenceLabel, locale)}
                      </span>
                    </div>
                  </td>
                  <td className="border-b border-zinc-200 px-3 py-3">
                    <ComparisonCellValue value={row.unitedKing} locale={locale} />
                  </td>
                  <td className="border-b border-zinc-200 px-3 py-3">
                    <ComparisonCellValue value={row.judahKing} locale={locale} />
                  </td>
                  <td className="border-b border-zinc-200 px-3 py-3">
                    <ComparisonCellValue value={row.northernKing} locale={locale} />
                  </td>
                  <td className="border-b border-zinc-200 px-3 py-3">
                    <ComparisonTagList tags={row.prophetTags} locale={locale} />
                  </td>
                  <td className="border-b border-zinc-200 px-3 py-3">
                    <ComparisonTagList
                      locale={locale}
                      tags={[...(row.empireTags ?? []), ...(row.surroundingNationTags ?? [])]}
                    />
                  </td>
                  <td className="border-b border-zinc-200 px-3 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {row.scriptureAnchors.map((anchor) => (
                        <Link
                          className={cn(
                            "inline-flex min-h-8 items-center rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold leading-none text-zinc-900 transition-colors hover:border-zinc-300 hover:bg-zinc-50",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
                          )}
                          href={getTimelineReaderHrefFromReader(anchor.reader, locale)}
                          onClick={(event) => event.stopPropagation()}
                          key={`${row.id}-${anchor.label.en}-${anchor.reader.book}-${anchor.reader.chapter}-${anchor.reader.verse}`}
                        >
                          {getTimelineText(anchor.label, locale)}
                        </Link>
                      ))}
                    </div>
                  </td>
                  <td className="border-b border-zinc-200 px-3 py-3">
                    <div className="flex flex-col gap-1.5">
                      {row.dateLabel ? (
                        <span className="inline-flex w-fit rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-semibold text-zinc-700">
                          {getTimelineText(row.dateLabel, locale)}
                        </span>
                      ) : null}
                      {row.dateBasisLabel ? (
                        <p className="text-xs font-medium leading-5 text-zinc-500">
                          {getTimelineText(row.dateBasisLabel, locale)}
                        </p>
                      ) : null}
                      {row.dateConfidenceLabel ? (
                        <p className="text-xs leading-5 text-zinc-500">
                          {getTimelineText(row.dateConfidenceLabel, locale)}
                        </p>
                      ) : null}
                      {row.note ? (
                        <p className="text-sm leading-6 text-zinc-600">
                          {getTimelineText(row.note, locale)}
                        </p>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

type BooksContextPreviewPanelProps = {
  activeBookId: string;
  activePeriodId: string;
  locale: TimelineLocale;
  searchTerm: string;
  onSelectRow: (rowId: string) => void;
  selectedRowId: string;
};

function BooksContextPreviewPanel({
  activeBookId,
  activePeriodId,
  locale,
  searchTerm,
  onSelectRow,
  selectedRowId,
}: BooksContextPreviewPanelProps) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const visibleRows = timelineBookContextRows.filter((row) => {
    const matchesBook = activeBookId === "all" || row.bookId === activeBookId;
    const matchesPeriod = activePeriodId === "all" || row.periodId === activePeriodId;
    const matchesSearch = matchesBookContextSearch(row, normalizedSearch);

    return matchesBook && matchesPeriod && matchesSearch;
  });

  const groupedRows = timelinePeriods
    .filter((period) => visibleRows.some((row) => row.periodId === period.id))
    .sort((left, right) => left.order - right.order)
    .map((period) => ({
      period,
      rows: visibleRows.filter((row) => row.periodId === period.id),
    }));

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex flex-col gap-1.5 border-b border-zinc-200 pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
            {locale === "ko" ? "책 / 시편 문맥" : "Books / Psalms Context"}
          </p>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            {locale === "ko"
              ? "정경 위치와 배경 연결을 분리해 보여 주는 간단한 미리보기입니다."
              : "A compact preview that separates canonical location from background connection."}
          </p>
        </div>
        <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-700">
          {locale === "ko" ? "미리보기" : "Preview"}
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {groupedRows.map(({ period, rows }) => (
          <section className="rounded-md border border-zinc-200 bg-zinc-50 p-3" key={period.id}>
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-zinc-950">{getTimelineText(period.label, locale)}</h3>
                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  {locale === "ko" ? "정경 위치 / 배경 연결" : "Canonical location / background connection"}
                </p>
              </div>
              <span className="inline-flex shrink-0 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-700">
                {locale === "ko" ? `${rows.length}개` : `${rows.length}`}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {rows.map((row) => {
                const selected = selectedRowId === row.id;

                return (
                  <div
                    className={cn(
                      "rounded-md border px-3 py-3 transition-colors",
                      selected
                        ? "border-zinc-950 bg-white shadow-sm"
                        : "cursor-pointer border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50",
                    )}
                    key={row.id}
                    onClick={() => onSelectRow(row.id)}
                    onKeyDown={(event) => handleSelectableKeyDown(event, () => onSelectRow(row.id))}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-700">
                        {getTimelineText(row.title, locale)}
                      </span>
                      <span className="text-sm font-semibold text-zinc-950">
                        {getTimelineText(row.canonicalLocation, locale)}
                      </span>
                      {row.historicalSettingLabel ? (
                        <span className="text-sm text-zinc-600">
                          {getTimelineText(row.historicalSettingLabel, locale)}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-medium text-zinc-600">
                      {row.authorshipLabel ? (
                        <span className="rounded-full bg-zinc-100 px-2.5 py-1">
                          {getTimelineText(row.authorshipLabel, locale)}
                          {row.authorshipBasisLabel ? ` · ${getTimelineText(row.authorshipBasisLabel, locale)}` : ""}
                        </span>
                      ) : null}
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1">
                        {getTimelineText(row.backgroundBasisLabel, locale)}
                      </span>
                      {row.dateLabel ? (
                        <span className="rounded-full bg-zinc-100 px-2.5 py-1">
                          {getTimelineText(row.dateLabel, locale)}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {row.scriptureAnchors.map((anchor) => (
                        <Link
                          className={cn(
                            "inline-flex min-h-8 items-center rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold leading-none text-zinc-900 transition-colors hover:border-zinc-300 hover:bg-zinc-50",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
                          )}
                          href={getTimelineReaderHrefFromReader(anchor.reader, locale)}
                          onClick={(event) => event.stopPropagation()}
                          key={`${row.id}-${anchor.label.en}-${anchor.reader.book}-${anchor.reader.chapter}-${anchor.reader.verse}`}
                        >
                          {getTimelineText(anchor.label, locale)}
                        </Link>
                      ))}
                    </div>

                    <p className="mt-2 text-sm leading-6 text-zinc-600">{getTimelineText(row.note, locale)}</p>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

type GenealogyComparisonPreviewPanelProps = {
  activePeriodId: string;
  locale: TimelineLocale;
  searchTerm: string;
  onSelectRow: (rowId: string) => void;
  selectedRowId: string;
};

function GenealogyComparisonPreviewPanel({
  activePeriodId,
  locale,
  searchTerm,
  onSelectRow,
  selectedRowId,
}: GenealogyComparisonPreviewPanelProps) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const visibleRows = timelineGenealogyComparisonRows.filter((row) => {
    const matchesPeriod = activePeriodId === "all" || row.periodId === activePeriodId;
    const matchesSearch = matchesGenealogySearch(row, normalizedSearch);

    return matchesPeriod && matchesSearch;
  });

  const groupedSegments = timelineGenealogySegments
    .map((segment) => ({
      rows: visibleRows.filter((row) => row.segmentId === segment.id),
      segment,
    }))
    .filter(({ rows }) => rows.length > 0);

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex flex-col gap-1.5 border-b border-zinc-200 pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
            {locale === "ko" ? "마태복음 족보 비교" : "Matthew Genealogy Comparison"}
          </p>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            {locale === "ko"
              ? "14 / 14 / 14 구조와 구약 족보 비교를 간단히 보여 주는 미리보기입니다."
              : "A compact preview of Matthew's 14 / 14 / 14 structure compared with the Old Testament genealogy."}
          </p>
        </div>
        <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-700">
          {locale === "ko" ? "미리보기" : "Preview"}
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {groupedSegments.map(({ rows, segment }) => (
          <section className="rounded-md border border-zinc-200 bg-zinc-50 p-3" key={segment.id}>
            <div className="flex flex-col gap-2 border-b border-zinc-200 pb-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-semibold text-zinc-950">{getTimelineText(segment.title, locale)}</h3>
                  <span className="inline-flex w-fit rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-zinc-700">
                    {getTimelineText(segment.rangeLabel, locale)}
                  </span>
                  <p className="text-xs leading-5 text-zinc-500">{getTimelineText(segment.structureLabel, locale)}</p>
                  <p className="text-xs leading-5 text-zinc-500">{getTimelineText(segment.basisLabel, locale)}</p>
                </div>
                <span className="inline-flex shrink-0 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-700">
                  {locale === "ko" ? `${rows.length}개` : `${rows.length}`}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {segment.scriptureAnchors.map((anchor) => (
                  <Link
                    className={cn(
                      "inline-flex min-h-8 items-center rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold leading-none text-zinc-900 transition-colors hover:border-zinc-300 hover:bg-zinc-50",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
                    )}
                    href={getTimelineReaderHrefFromReader(anchor.reader, locale)}
                    key={`${segment.id}-${anchor.label.en}-${anchor.reader.book}-${anchor.reader.chapter}-${anchor.reader.verse}`}
                  >
                    {getTimelineText(anchor.label, locale)}
                  </Link>
                ))}
              </div>

              <p className="text-sm leading-6 text-zinc-600">{getTimelineText(segment.note, locale)}</p>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="min-w-[80rem] w-full border-separate border-spacing-0">
                <thead>
                  <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                    <th className="border-b border-zinc-200 px-3 py-2">
                      {locale === "ko" ? "마태복음" : "Matthew"}
                    </th>
                    <th className="border-b border-zinc-200 px-3 py-2">
                      {locale === "ko" ? "구약 비교" : "Old Testament Comparison"}
                    </th>
                    <th className="border-b border-zinc-200 px-3 py-2">
                      {locale === "ko" ? "관찰" : "Observation"}
                    </th>
                    <th className="border-b border-zinc-200 px-3 py-2">
                      {locale === "ko" ? "성경 근거" : "Scripture Anchor"}
                    </th>
                    <th className="border-b border-zinc-200 px-3 py-2">
                      {locale === "ko" ? "메모" : "Notes"}
                    </th>
                  </tr>
                </thead>
          <tbody>
                  {rows.map((row) => {
                    const isSelected = selectedRowId === row.id;

                    return (
                      <tr
                        className={cn(
                          "align-top transition-colors",
                          isSelected ? "bg-white shadow-sm" : "cursor-pointer bg-zinc-50 hover:bg-white",
                        )}
                        key={row.id}
                        onClick={() => onSelectRow(row.id)}
                        onKeyDown={(event) => handleSelectableKeyDown(event, () => onSelectRow(row.id))}
                        role="button"
                        tabIndex={0}
                      >
                        <td className="border-b border-zinc-200 px-3 py-3">
                          <ComparisonCellValue locale={locale} value={row.matthewName} />
                        </td>
                        <td className="border-b border-zinc-200 px-3 py-3">
                          <ComparisonCellValue locale={locale} value={row.oldTestamentName} />
                        </td>
                        <td className="border-b border-zinc-200 px-3 py-3">
                          <div className="flex flex-col gap-1.5">
                            <span className="inline-flex w-fit rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-zinc-700">
                              {getTimelineText(row.comparisonLabel, locale)}
                            </span>
                            {row.kingdomTags?.length || row.rulerTags?.length ? (
                              <ComparisonTagList
                                locale={locale}
                                tags={[...(row.kingdomTags ?? []), ...(row.rulerTags ?? [])]}
                              />
                            ) : null}
                          </div>
                        </td>
                        <td className="border-b border-zinc-200 px-3 py-3">
                          <div className="flex flex-wrap gap-1.5">
                            {row.scriptureAnchors.map((anchor) => (
                              <Link
                                className={cn(
                                  "inline-flex min-h-8 items-center rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold leading-none text-zinc-900 transition-colors hover:border-zinc-300 hover:bg-zinc-50",
                                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
                                )}
                                href={getTimelineReaderHrefFromReader(anchor.reader, locale)}
                                onClick={(event) => event.stopPropagation()}
                                key={`${row.id}-${anchor.label.en}-${anchor.reader.book}-${anchor.reader.chapter}-${anchor.reader.verse}`}
                              >
                                {getTimelineText(anchor.label, locale)}
                              </Link>
                            ))}
                          </div>
                        </td>
                        <td className="border-b border-zinc-200 px-3 py-3">
                          <div className="flex flex-col gap-1.5">
                            <p className="text-xs font-semibold leading-5 text-zinc-500">
                              {getTimelineText(row.basisLabel, locale)}
                            </p>
                            {row.nameVariantNote ? (
                              <p className="text-sm leading-6 text-zinc-600">
                                {getTimelineText(row.nameVariantNote, locale)}
                              </p>
                            ) : null}
                            {row.omissionNote ? (
                              <p className="text-sm leading-6 text-zinc-600">
                                {getTimelineText(row.omissionNote, locale)}
                              </p>
                            ) : null}
                            {row.note ? (
                              <p className="text-sm leading-6 text-zinc-600">
                                {getTimelineText(row.note, locale)}
                              </p>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

type ComparisonCellValueProps = {
  locale: TimelineLocale;
  value?: { en: string; ko: string };
};

function ComparisonCellValue({ locale, value }: ComparisonCellValueProps) {
  if (!value) {
    return <span className="text-sm leading-6 text-zinc-400">—</span>;
  }

  return <span className="text-sm font-medium leading-6 text-zinc-900">{getTimelineText(value, locale)}</span>;
}

type ComparisonTagListProps = {
  locale: TimelineLocale;
  tags?: readonly TimelineText[];
};

function ComparisonTagList({ locale, tags }: ComparisonTagListProps) {
  if (!tags?.length) {
    return <span className="text-sm leading-6 text-zinc-400">—</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold leading-none text-zinc-700"
          key={`${tag.en}-${tag.ko}`}
        >
          {getTimelineText(tag, locale)}
        </span>
      ))}
    </div>
  );
}

function handleSelectableKeyDown(
  event: KeyboardEvent<HTMLElement>,
  onSelect: () => void,
) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onSelect();
  }
}

function matchesBookContextSearch(
  row: (typeof timelineBookContextRows)[number],
  query: string,
) {
  if (!query) {
    return true;
  }

  const rowTokens = [
    row.title.en,
    row.title.ko,
    row.canonicalLocation.en,
    row.canonicalLocation.ko,
    row.historicalSettingLabel?.en ?? "",
    row.historicalSettingLabel?.ko ?? "",
    row.authorshipLabel?.en ?? "",
    row.authorshipLabel?.ko ?? "",
    row.authorshipBasisLabel?.en ?? "",
    row.authorshipBasisLabel?.ko ?? "",
    row.backgroundBasisLabel.en,
    row.backgroundBasisLabel.ko,
    row.dateLabel?.en ?? "",
    row.dateLabel?.ko ?? "",
    row.dateBasisLabel?.en ?? "",
    row.dateBasisLabel?.ko ?? "",
    row.dateConfidenceLabel?.en ?? "",
    row.dateConfidenceLabel?.ko ?? "",
    row.note.en,
    row.note.ko,
    ...row.scriptureAnchors.flatMap((anchor) => [anchor.label.en, anchor.label.ko]),
    ...(row.relatedPeople?.flatMap((person) => [person.en, person.ko]) ?? []),
    ...(row.relatedKingdoms?.flatMap((kingdom) => [kingdom.en, kingdom.ko]) ?? []),
    ...(row.relatedEmpires?.flatMap((empire) => [empire.en, empire.ko]) ?? []),
    ...(row.relatedPlaces ?? []),
  ]
    .join(" ")
    .toLowerCase();

  return rowTokens.includes(query);
}

function matchesGenealogySearch(
  row: (typeof timelineGenealogyComparisonRows)[number],
  query: string,
) {
  if (!query) {
    return true;
  }

  const rowTokens = [
    row.matthewName.en,
    row.matthewName.ko,
    row.oldTestamentName?.en ?? "",
    row.oldTestamentName?.ko ?? "",
    row.comparisonLabel.en,
    row.comparisonLabel.ko,
    row.basisLabel.en,
    row.basisLabel.ko,
    row.nameVariantNote?.en ?? "",
    row.nameVariantNote?.ko ?? "",
    row.omissionNote?.en ?? "",
    row.omissionNote?.ko ?? "",
    row.note?.en ?? "",
    row.note?.ko ?? "",
    ...row.scriptureAnchors.flatMap((anchor) => [anchor.label.en, anchor.label.ko]),
    ...(row.kingdomTags?.flatMap((tag) => [tag.en, tag.ko]) ?? []),
    ...(row.rulerTags?.flatMap((tag) => [tag.en, tag.ko]) ?? []),
  ]
    .join(" ")
    .toLowerCase();

  return rowTokens.includes(query);
}

function matchesSchematicPlaceSearch(
  row: (typeof timelineSchematicPlaceRows)[number],
  query: string,
) {
  if (!query) {
    return true;
  }

  const rowTokens = [
    row.title.en,
    row.title.ko,
    row.modernReferenceLabel?.en ?? "",
    row.modernReferenceLabel?.ko ?? "",
    row.modernReferenceStatusLabel?.en ?? "",
    row.modernReferenceStatusLabel?.ko ?? "",
    row.conceptRegionLabel.en,
    row.conceptRegionLabel.ko,
    row.placeTypeLabel?.en ?? "",
    row.placeTypeLabel?.ko ?? "",
    row.locationBasisLabel.en,
    row.locationBasisLabel.ko,
    row.locationConfidenceLabel.en,
    row.locationConfidenceLabel.ko,
    row.cautionNote?.en ?? "",
    row.cautionNote?.ko ?? "",
    row.note.en,
    row.note.ko,
    row.conceptFlowGroup ?? "",
    ...row.scriptureAnchors.flatMap((anchor) => [anchor.label.en, anchor.label.ko]),
    ...(row.relatedPeople?.flatMap((person) => [person.en, person.ko]) ?? []),
    ...(row.relatedKingdoms?.flatMap((kingdom) => [kingdom.en, kingdom.ko]) ?? []),
    ...(row.relatedEmpires?.flatMap((empire) => [empire.en, empire.ko]) ?? []),
    ...(row.relatedBookContextIds ?? []),
    ...(row.relatedEventIds ?? []),
    row.placeId,
  ]
    .join(" ")
    .toLowerCase();

  return rowTokens.includes(query);
}

function periodLabelForStatus(periodId: string, periodOptions: TimelineOption[], locale: TimelineLocale) {
  if (periodId === "all") {
    return locale === "ko" ? "전체 기간" : "All periods";
  }

  return periodOptions.find((option) => option.id === periodId)?.label ?? "";
}

function bookLabelForStatus(bookId: string, bookOptions: TimelineOption[], locale: TimelineLocale) {
  if (bookId === "all") {
    return locale === "ko" ? "전체 책" : "All books";
  }

  return bookOptions.find((option) => option.id === bookId)?.label ?? "";
}

function placeLabelForStatus(placeId: string, placeOptions: TimelineOption[], locale: TimelineLocale) {
  if (placeId === "all") {
    return locale === "ko" ? "전체 지명" : "All places";
  }

  return placeOptions.find((option) => option.id === placeId)?.label ?? "";
}

function matchesTimelineSearch(event: (typeof passionWeekTimelineEvents)[number], query: string) {
  if (!query) {
    return true;
  }

  const period = getTimelinePeriod(event.periodId);
  const primaryBook = getTimelineBook(event.primaryBookId);
  const placeLabels = event.placeIds
    .map((placeId) => getTimelinePlace(placeId))
    .filter((place): place is NonNullable<typeof place> => Boolean(place))
    .flatMap((place) => [place.label.en, place.label.ko]);

  const tokens = [
    event.title.en,
    event.title.ko,
    event.summary.en,
    event.summary.ko,
    event.locationNote.en,
    event.locationNote.ko,
    event.datingNote.en,
    event.datingNote.ko,
    event.sequenceLabel.en,
    event.sequenceLabel.ko,
    event.eventType.en,
    event.eventType.ko,
    event.confidenceLevel.en,
    event.confidenceLevel.ko,
    ...(event.kingdomTags?.flatMap((tag) => [tag.en, tag.ko]) ?? []),
    ...(event.empireTags?.flatMap((tag) => [tag.en, tag.ko]) ?? []),
    ...(event.rulerTags?.flatMap((tag) => [tag.en, tag.ko]) ?? []),
    ...(event.prophetTags?.flatMap((tag) => [tag.en, tag.ko]) ?? []),
    ...(event.surroundingNationTags?.flatMap((tag) => [tag.en, tag.ko]) ?? []),
    event.synchronismNote?.en ?? "",
    event.synchronismNote?.ko ?? "",
    event.worldContextNote?.en ?? "",
    event.worldContextNote?.ko ?? "",
    event.worldContextBasisLabel?.en ?? "",
    event.worldContextBasisLabel?.ko ?? "",
    event.worldContextConfidenceLabel?.en ?? "",
    event.worldContextConfidenceLabel?.ko ?? "",
    event.nameVariantNote?.en ?? "",
    event.nameVariantNote?.ko ?? "",
    primaryBook?.label.en ?? "",
    primaryBook?.label.ko ?? "",
    period?.label.en ?? "",
    period?.label.ko ?? "",
    ...placeLabels,
    ...event.people.flatMap((person) => [person.en, person.ko]),
    ...event.scriptureAnchors.flatMap((anchor) => [anchor.label.en, anchor.label.ko]),
  ]
    .join(" ")
    .toLowerCase();

  return tokens.includes(query);
}

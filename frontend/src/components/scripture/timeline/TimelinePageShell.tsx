"use client";

import { useMemo, useState } from "react";

import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";

import {
  getTimelineBook,
  getTimelinePeriod,
  getTimelinePlace,
  getTimelineReaderHref,
  getTimelineText,
  passionWeekTimelineEvents,
  timelineBooks,
  timelinePeriods,
  timelinePlaces,
  type TimelineLocale,
} from "./passionWeekTimeline";
import { ScriptureTimelineList } from "./ScriptureTimelineList";
import { TimelineEventDetailPanel } from "./TimelineEventDetailPanel";
import { TimelineFilterBar } from "./TimelineFilterBar";
import { TimelineViewTabs } from "./TimelineViewTabs";

type TimelinePageShellProps = {
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
    detailHeading: "Selected Event Scripture Context",
    eventsHeading: "Events View",
    eventsNote: "The event stream stays Scripture-first and preserves the selected item in the right panel.",
    futureViewNote:
      "Future workspace views remain visible but disabled until later approved phases add their own content layers.",
    openInReader: "Open in Reader",
    overviewHeading: "Scripture Timeline Overview",
    overviewNote:
      "This overview stays top-down and Scripture-first. The cards summarize broad biblical flow using the current preview content.",
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
      { id: "books", label: "Books", future: true },
      { id: "kingdoms", label: "Kings & Kingdoms", future: true },
      { id: "genealogy", label: "Genealogy", future: true },
      { id: "places", label: "Places / Map", future: true },
      { id: "themes", label: "Themes", future: true },
    ],
  },
  ko: {
    detailHeading: "선택한 사건의 성경 문맥",
    eventsHeading: "사건 보기",
    eventsNote: "사건 흐름은 성경 우선을 유지하며, 선택 항목은 오른쪽 패널에 계속 남아 있습니다.",
    futureViewNote: "이후 승인 단계에서 각자 고유한 내용 층이 추가되기 전까지 미래 전용 보기는 비활성 상태로 보입니다.",
    openInReader: "읽기에서 열기",
    overviewHeading: "성경 Timeline 개요",
    overviewNote:
      "이 개요는 위에서 아래로, 성경 우선으로 진행됩니다. 현재 미리보기 내용으로 큰 흐름을 요약합니다.",
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
      { id: "books", label: "책", future: true },
      { id: "kingdoms", label: "왕국 / 제국", future: true },
      { id: "genealogy", label: "족보", future: true },
      { id: "places", label: "지명 / 지도", future: true },
      { id: "themes", label: "주제", future: true },
    ],
  },
} as const;

export function TimelinePageShell({ locale }: TimelinePageShellProps) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const copy = pageCopy[activeLocale];
  const [activeView, setActiveView] = useState<TimelineView>("overview");
  const [filters, setFilters] = useState<TimelineFilterState>({
    bookId: "all",
    placeId: "all",
    periodId: "all",
    searchTerm: "",
  });
  const [selectedEventId, setSelectedEventId] = useState(passionWeekTimelineEvents[0]?.id ?? "");

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

  const selectedEvent =
    visibleEvents.find((event) => event.id === selectedEventId) ?? visibleEvents[0];
  const selectedReaderHref = selectedEvent
    ? getTimelineReaderHref(selectedEvent, activeLocale)
    : "";

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

  const overviewGroups = useMemo(
    () =>
      timelinePeriods
        .map((period) => ({
          events: visibleEvents.filter((event) => event.periodId === period.id),
          period,
        }))
        .filter((group) => group.events.length > 0),
    [visibleEvents],
  );

  const tabTitles = {
    events:
      activeLocale === "ko"
        ? "사건 흐름"
        : "Event stream",
    overview:
      activeLocale === "ko"
        ? "성경 이야기 개요"
        : "Scripture-first overview",
  };

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
          onTabChange={(tabId) => setActiveView(tabId as TimelineView)}
          tabs={copy.viewTabs}
        />

        <div
          className={cn(
            "grid gap-6",
            "xl:grid-cols-[minmax(20rem,22rem)_minmax(0,1fr)_minmax(22rem,24rem)]",
            "2xl:grid-cols-[minmax(21rem,24rem)_minmax(0,1fr)_minmax(23rem,25rem)]",
            "xl:items-start",
          )}
        >
          <TimelineFilterBar
            activeBookId={filters.bookId}
            activePeriodId={filters.periodId}
            activePlaceId={filters.placeId}
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
                ? "기간, 책, 지명은 현재 미리보기에서 실제로 작동합니다. 나머지 섹션은 다음 단계에서 확장됩니다."
                : "Period, book, and place filters are active in the preview. The remaining sections expand in later phases."
            }
            searchTerm={filters.searchTerm}
            totalCount={previewCounts.totalCount}
            visibleCount={previewCounts.visibleCount}
          />

          <div className="flex min-w-0 flex-col gap-4">
            <Card className="flex flex-col gap-4 border-zinc-200 bg-white p-4 sm:p-5">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
                  {activeView === "overview" ? copy.overviewHeading : copy.eventsHeading}
                </p>
                <h2 className="text-xl font-semibold text-zinc-950">
                  {activeView === "overview" ? tabTitles.overview : tabTitles.events}
                </h2>
                <p className="text-sm leading-6 text-zinc-600">
                  {activeView === "overview" ? copy.overviewNote : copy.eventsNote}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-semibold text-zinc-600">
                <span className="rounded-full bg-zinc-100 px-3 py-1.5">
                  {activeLocale === "ko"
                    ? `사건 ${previewCounts.visibleCount} / ${previewCounts.totalCount}`
                    : `Events ${previewCounts.visibleCount} / ${previewCounts.totalCount}`}
                </span>
                <span className="rounded-full bg-zinc-100 px-3 py-1.5">
                  {activeLocale === "ko"
                    ? `기간 ${previewCounts.periodCount}`
                    : `Periods ${previewCounts.periodCount}`}
                </span>
                <span className="rounded-full bg-zinc-100 px-3 py-1.5">
                  {activeLocale === "ko"
                    ? `책 ${previewCounts.bookCount}`
                    : `Books ${previewCounts.bookCount}`}
                </span>
                <span className="rounded-full bg-zinc-100 px-3 py-1.5">
                  {activeLocale === "ko"
                    ? `지명 ${previewCounts.placeCount}`
                    : `Places ${previewCounts.placeCount}`}
                </span>
              </div>
            </Card>

            {activeView === "overview" ? (
              <OverviewPanel
                groups={overviewGroups}
                locale={activeLocale}
                onFocusPeriod={(periodId) => {
                  setFilters((current) => ({ ...current, periodId }));
                  setActiveView("events");
                }}
                searchTerm={filters.searchTerm}
              />
            ) : null}

            <Card className="flex min-w-0 flex-col gap-4 border-zinc-200 bg-white p-4 sm:p-5">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
                  {activeLocale === "ko" ? "사건 흐름" : "Event Stream"}
                </p>
                <p className="text-sm leading-6 text-zinc-600">
                  {activeLocale === "ko"
                    ? "사건을 선택하면 오른쪽 문맥 패널이 갱신됩니다. 기간과 책 필터는 같은 페이지에서 계속 작동합니다."
                    : "Select an event to update the right-side context panel. Period and book filters keep working on the same page."}
                </p>
              </div>

              <ScriptureTimelineList
                events={visibleEvents}
                locale={activeLocale}
                onSelect={setSelectedEventId}
                selectedEventId={selectedEvent?.id ?? ""}
              />
            </Card>
          </div>

          <TimelineEventDetailPanel
            event={selectedEvent}
            locale={activeLocale}
            noSelection={
              activeLocale === "ko"
                ? "사건을 선택하거나 필터를 넓혀 성경 근거, 순서, 연대 메모를 확인하세요."
                : "Select an event or widen the filters to inspect the Scripture anchor, sequence, and dating note."
            }
            openInReaderLabel={copy.openInReader}
            readerHref={selectedReaderHref}
            relatedStudy={copy.relatedStudy}
            selectedLabel={copy.selectedLabel}
          />
        </div>
      </section>
    </Container>
  );
}

type OverviewPanelProps = {
  groups: Array<{
    events: typeof passionWeekTimelineEvents;
    period: (typeof timelinePeriods)[number];
  }>;
  locale: TimelineLocale;
  onFocusPeriod: (periodId: string) => void;
  searchTerm: string;
};

function OverviewPanel({ groups, locale, onFocusPeriod, searchTerm }: OverviewPanelProps) {
  return (
    <Card className="flex min-w-0 flex-col gap-4 border-zinc-200 bg-zinc-50 p-4 sm:p-5">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
          {locale === "ko" ? "성경 스토리라인 개요" : "Biblical storyline overview"}
        </p>
        <p className="text-sm leading-6 text-zinc-600">
          {locale === "ko"
            ? "개요는 고정된 연대표가 아니라 성경 흐름을 한눈에 보여 주는 작업 공간입니다."
            : "The overview is a workspace view for seeing Scripture flow at a glance, not a fixed chronology chart."}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {groups.map(({ events, period }) => {
          const firstEvent = events[0];

          return (
            <button
              className={cn(
                "flex min-h-0 w-full flex-col gap-3 rounded-md border border-zinc-200 bg-white p-4 text-left text-sm transition-colors",
                "hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
              )}
              key={period.id}
              onClick={() => onFocusPeriod(period.id)}
              type="button"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
                  {getTimelineText(period.label, locale)}
                </span>
                <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-700">
                  {locale === "ko" ? `${events.length}개 사건` : `${events.length} events`}
                </span>
              </div>

              {firstEvent ? (
                <div className="space-y-2">
                  <p className="text-base font-semibold text-zinc-950">
                    {getTimelineText(firstEvent.title, locale)}
                  </p>
                  <p className="text-sm leading-6 text-zinc-600">
                    {getTimelineText(firstEvent.summary, locale)}
                  </p>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2 text-xs font-medium text-zinc-600">
                {firstEvent?.placeIds.slice(0, 2).map((placeId) => {
                  const place = getTimelinePlace(placeId);

                  return place ? (
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1" key={place.id}>
                      {getTimelineText(place.label, locale)}
                    </span>
                  ) : null;
                })}
                {firstEvent?.people.slice(0, 2).map((person) => (
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1" key={person.en}>
                    {getTimelineText(person, locale)}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {searchTerm.trim() ? (
        <p className="text-xs leading-5 text-zinc-500">
          {locale === "ko"
            ? "검색어가 적용된 개요입니다."
            : "The overview reflects the current search term."}
        </p>
      ) : null}
    </Card>
  );
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

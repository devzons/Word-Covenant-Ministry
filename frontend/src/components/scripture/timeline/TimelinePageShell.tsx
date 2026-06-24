"use client";

import { useMemo, useState } from "react";

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
    eventsNote: "The flow stays Scripture-first and preserves the selected item in the right panel.",
    futureViewNote:
      "Future workspace views remain visible but disabled until later approved phases add their own content layers.",
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
    eventsNote: "본문 흐름은 성경 우선을 유지하며, 선택 항목은 오른쪽 패널에 계속 남아 있습니다.",
    futureViewNote: "이후 승인 단계에서 각자 고유한 내용 층이 추가되기 전까지 미래 전용 보기는 비활성 상태로 보입니다.",
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
            "xl:grid-cols-[19rem_minmax(0,1fr)_21rem]",
            "2xl:grid-cols-[20rem_minmax(0,1fr)_22rem]",
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
            <CompactStatusRow
              activeBookLabel={bookLabelForStatus(filters.bookId, bookOptions, activeLocale)}
              activePeriodLabel={periodLabelForStatus(filters.periodId, periodOptions, activeLocale)}
              activePlaceLabel={placeLabelForStatus(filters.placeId, placeOptions, activeLocale)}
              locale={activeLocale}
              modeLabel={
                activeView === "overview"
                  ? activeLocale === "ko"
                    ? "성경 흐름"
                    : "Scripture Flow"
                  : activeLocale === "ko"
                    ? "사건 흐름"
                    : "Event Stream"
              }
              totalCount={previewCounts.totalCount}
              visibleCount={previewCounts.visibleCount}
            />

            <ScriptureTimelineList
              events={visibleEvents}
              locale={activeLocale}
              onSelect={setSelectedEventId}
              selectedEventId={selectedEvent?.id ?? ""}
            />
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

type CompactStatusRowProps = {
  activeBookLabel: string;
  activePeriodLabel: string;
  activePlaceLabel: string;
  locale: TimelineLocale;
  modeLabel: string;
  totalCount: number;
  visibleCount: number;
};

function CompactStatusRow({
  activeBookLabel,
  activePeriodLabel,
  activePlaceLabel,
  locale,
  modeLabel,
  totalCount,
  visibleCount,
}: CompactStatusRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-600">
      <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-700">
        {modeLabel}
      </span>
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
      <span className="text-zinc-300" aria-hidden="true">
        ·
      </span>
      <span className="font-medium text-zinc-950">
        {locale === "ko" ? `${visibleCount}개 사건` : `${visibleCount} events`}
      </span>
      <span className="text-zinc-500">
        {locale === "ko" ? `/ 전체 ${totalCount}개` : `/ ${totalCount} total`}
      </span>
    </div>
  );
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

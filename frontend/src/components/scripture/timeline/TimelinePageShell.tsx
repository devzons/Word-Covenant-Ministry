"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";

import {
  getTimelineBook,
  getTimelinePeriod,
  getTimelinePlace,
  getTimelineReaderHref,
  getTimelineReaderHrefFromReader,
  getTimelineText,
  passionWeekTimelineEvents,
  timelineBookContextRows,
  timelineGenealogyComparisonRows,
  timelineGenealogySegments,
  timelineKingdomComparisonRows,
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
      "Places / map and themes remain future views until later approved phases add their own content layers.",
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
      { id: "places", label: "Places / Map", future: true },
      { id: "themes", label: "Themes", future: true },
    ],
  },
  ko: {
    detailHeading: "선택한 사건의 성경 문맥",
    eventsHeading: "사건 보기",
    eventsNote: "본문 흐름은 성경 우선을 유지하며, 선택 항목은 오른쪽 패널에 계속 남아 있습니다.",
    futureViewNote: "지명 / 지도와 주제는 이후 승인 단계에서 각자 고유한 내용 층이 추가되기 전까지 미래 전용으로 남습니다.",
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
                ? "기간, 책, 지명, 왕국 미리보기는 현재 레이아웃에서 실제로 작동합니다. 나머지 섹션은 다음 단계에서 확장됩니다."
                : "Period, book, place, and kingdom preview are active in the current layout. The remaining sections expand in later phases."
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
                  : activeView === "kingdoms"
                    ? activeLocale === "ko"
                      ? "왕국 / 제국"
                      : "Kings & Kingdoms"
                    : activeView === "genealogy"
                      ? activeLocale === "ko"
                        ? "족보 / 마태복음"
                        : "Genealogy"
                  : activeLocale === "ko"
                    ? "사건 흐름"
                    : "Event Stream"
              }
              totalCount={previewCounts.totalCount}
              visibleCount={previewCounts.visibleCount}
            />

            {activeView === "kingdoms" ? (
              <KingsKingdomsPreviewPanel
                locale={activeLocale}
                selectedEventId={selectedEvent?.id ?? ""}
              />
            ) : null}

            {activeView === "books" ? (
              <BooksContextPreviewPanel
                activeBookId={filters.bookId}
                activePeriodId={filters.periodId}
                locale={activeLocale}
                searchTerm={filters.searchTerm}
                selectedEventId={selectedEvent?.id ?? ""}
              />
            ) : null}

            {activeView === "genealogy" ? (
              <GenealogyComparisonPreviewPanel
                activePeriodId={filters.periodId}
                locale={activeLocale}
                searchTerm={filters.searchTerm}
                selectedEventId={selectedEvent?.id ?? ""}
              />
            ) : null}

            <ScriptureTimelineList
              activePeriodId={filters.periodId}
              events={visibleEvents}
              locale={activeLocale}
              searchTerm={filters.searchTerm}
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

type KingsKingdomsPreviewPanelProps = {
  locale: TimelineLocale;
  selectedEventId: string;
};

function KingsKingdomsPreviewPanel({ locale, selectedEventId }: KingsKingdomsPreviewPanelProps) {
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
              const isSelected = Boolean(row.relatedEventIds?.includes(selectedEventId));

              return (
                <tr
                  className={cn(
                    "align-top",
                    isSelected ? "bg-zinc-50/80" : "bg-white",
                  )}
                  key={row.id}
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
  selectedEventId: string;
};

function BooksContextPreviewPanel({
  activeBookId,
  activePeriodId,
  locale,
  searchTerm,
  selectedEventId,
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
                const selected = Boolean(row.relatedEventIds?.includes(selectedEventId));

                return (
                  <div
                    className={cn(
                      "rounded-md border px-3 py-3",
                      selected ? "border-zinc-950 bg-white shadow-sm" : "border-zinc-200 bg-white",
                    )}
                    key={row.id}
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
  selectedEventId: string;
};

function GenealogyComparisonPreviewPanel({
  activePeriodId,
  locale,
  searchTerm,
  selectedEventId,
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
                    const isSelected = Boolean(row.relatedEventIds?.includes(selectedEventId));

                    return (
                      <tr
                        className={cn("align-top", isSelected ? "bg-white shadow-sm" : "bg-zinc-50")}
                        key={row.id}
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

"use client";

import { useMemo, useState } from "react";

import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";

import {
  getTimelineReaderHref,
  getTimelineText,
  passionWeekTimelineEvents,
  timelineBooks,
  timelinePeriods,
  timelinePlaces,
  type TimelineLocale,
} from "./passionWeekTimeline";
import { TimelineEventDetailPanel } from "./TimelineEventDetailPanel";
import { TimelineFilterBar } from "./TimelineFilterBar";
import { ScriptureTimelineList } from "./ScriptureTimelineList";
import { TimelineViewTabs } from "./TimelineViewTabs";

type TimelinePageShellProps = {
  locale: TimelineLocale;
};

type TimelineOption = {
  id: string;
  label: string;
};

type TimelineFilterState = {
  bookId: string;
  placeId: string;
  periodId: string;
};

const pageCopy = {
  en: {
    title: "Scripture Timeline",
    subtitle: "A Scripture-first timeline for following events, sequence, and passage anchors.",
    previewNote:
      "Period, book, and place filters are preview-active. Confidence remains visible on cards and in the detail panel.",
    overlayNote: "World-history overlay is deferred to a later approved phase.",
    viewTabs: [
      { id: "scripture", label: "Scripture Timeline", future: false },
      { id: "people", label: "People", future: true },
      { id: "events", label: "Events", future: true },
      { id: "gospel", label: "Gospel", future: true },
      { id: "kingdoms", label: "Kingdoms / Empires", future: true },
    ],
    filters: {
      period: "Period",
      book: "Book",
      place: "Place",
      confidence: "Confidence",
      clear: "Clear filters",
      showing: "Showing",
      of: "of",
    },
    confidenceSummary: "High-confidence preview",
    timelineHeading: "Biblical storyline preview",
    timelineSubheading: "Creation through Acts",
    detailsHeading: "Selected Event Scripture Context",
    noSelection:
      "Select an event or widen the filters to inspect the Scripture anchor, sequence, and dating note.",
    openInReader: "Open in Reader",
    relatedStudy:
      "Related passages and Gospel Harmony links are deferred to later approved phases.",
    selectedLabel: "Selected",
  },
  ko: {
    title: "성경 Timeline",
    subtitle: "성경 본문을 중심으로 사건, 순서, 근거 구절을 따라가는 연구 연표",
    previewNote:
      "기간, 책, 지명 필터는 미리보기에서 실제로 작동합니다. 신뢰도는 카드와 상세 패널에 계속 표시됩니다.",
    overlayNote: "세계사 Overlay는 이후 승인 단계에서 다룹니다.",
    viewTabs: [
      { id: "scripture", label: "성경 Timeline", future: false },
      { id: "people", label: "인물", future: true },
      { id: "events", label: "사건", future: true },
      { id: "gospel", label: "복음서", future: true },
      { id: "kingdoms", label: "왕국 / 제국", future: true },
    ],
    filters: {
      period: "기간",
      book: "책",
      place: "지명",
      confidence: "신뢰도",
      clear: "필터 초기화",
      showing: "표시 중",
      of: "중",
    },
    confidenceSummary: "높은 신뢰도 미리보기",
    timelineHeading: "성경 스토리라인 미리보기",
    timelineSubheading: "창조부터 사도행전까지",
    detailsHeading: "선택한 사건의 성경 문맥",
    noSelection: "사건을 선택하거나 필터를 넓혀 성경 근거, 순서, 연대 메모를 확인하세요.",
    openInReader: "읽기에서 열기",
    relatedStudy: "관련 구절과 복음서 링크는 이후 승인 단계에서 다룹니다.",
    selectedLabel: "선택됨",
  },
} as const;

export function TimelinePageShell({ locale }: TimelinePageShellProps) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const copy = pageCopy[activeLocale];
  const [filters, setFilters] = useState<TimelineFilterState>({
    bookId: "all",
    placeId: "all",
    periodId: "all",
  });
  const [selectedEventId, setSelectedEventId] = useState(
    passionWeekTimelineEvents[0]?.id ?? "",
  );

  const periodOptions = useMemo<TimelineOption[]>(() => {
    const periodCounts = new Map<string, number>();

    for (const event of passionWeekTimelineEvents) {
      periodCounts.set(event.periodId, (periodCounts.get(event.periodId) ?? 0) + 1);
    }

    return [
      { id: "all", label: activeLocale === "ko" ? "모든 기간" : "All periods" },
      ...timelinePeriods
        .filter((period) => periodCounts.has(period.id))
        .sort((left, right) => left.order - right.order)
        .map((period) => ({
          id: period.id,
          label: `${getTimelineText(period.label, activeLocale)} (${periodCounts.get(period.id) ?? 0})`,
        })),
    ];
  }, [activeLocale]);

  const bookOptions = useMemo<TimelineOption[]>(() => {
    const bookCounts = new Map<string, number>();
    const usedBookIds = new Set<string>();

    for (const event of passionWeekTimelineEvents) {
      usedBookIds.add(event.primaryBookId);
      bookCounts.set(event.primaryBookId, (bookCounts.get(event.primaryBookId) ?? 0) + 1);

      for (const relatedBookId of event.relatedBookIds) {
        usedBookIds.add(relatedBookId);
        bookCounts.set(relatedBookId, (bookCounts.get(relatedBookId) ?? 0) + 1);
      }
    }

    return [
      { id: "all", label: activeLocale === "ko" ? "모든 책" : "All books" },
      ...timelineBooks
        .filter((book) => usedBookIds.has(book.id))
        .map((book) => ({
          id: book.id,
          label: `${getTimelineText(book.label, activeLocale)} (${bookCounts.get(book.id) ?? 0})`,
        })),
    ];
  }, [activeLocale]);

  const placeOptions = useMemo<TimelineOption[]>(() => {
    const placeCounts = new Map<string, number>();
    const usedPlaceIds = new Set<string>();

    for (const event of passionWeekTimelineEvents) {
      for (const placeId of event.placeIds) {
        usedPlaceIds.add(placeId);
        placeCounts.set(placeId, (placeCounts.get(placeId) ?? 0) + 1);
      }
    }

    return [
      { id: "all", label: activeLocale === "ko" ? "모든 지명" : "All places" },
      ...timelinePlaces
        .filter((place) => usedPlaceIds.has(place.id))
        .map((place) => ({
          id: place.id,
          label: `${getTimelineText(place.label, activeLocale)} (${placeCounts.get(place.id) ?? 0})`,
        })),
    ];
  }, [activeLocale]);

  const visibleEvents = useMemo(
    () =>
      passionWeekTimelineEvents.filter((event) => {
        const matchesPeriod = filters.periodId === "all" || event.periodId === filters.periodId;
        const matchesBook =
          filters.bookId === "all" ||
          event.primaryBookId === filters.bookId ||
          event.relatedBookIds.includes(filters.bookId);
        const matchesPlace = filters.placeId === "all" || event.placeIds.includes(filters.placeId);

        return matchesPeriod && matchesBook && matchesPlace;
      }),
    [filters],
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
    <Container className="py-12 sm:py-16">
      <section className="flex flex-col gap-6 sm:gap-8">
        <header className="flex max-w-4xl flex-col gap-2 sm:gap-3">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
            Word Covenant Ministry
          </p>
          <h1 className="text-3xl font-semibold text-zinc-950 sm:text-4xl">{copy.title}</h1>
          <p className="text-base leading-7 text-zinc-600">{copy.subtitle}</p>
        </header>

        <div className="space-y-3 sm:space-y-4">
          <TimelineViewTabs
            activeTab="scripture"
            locale={activeLocale}
            tabs={copy.viewTabs}
          />
          <TimelineFilterBar
            activeBookId={filters.bookId}
            activePeriodId={filters.periodId}
            activePlaceId={filters.placeId}
            bookOptions={bookOptions}
            confidenceLabel={copy.confidenceSummary}
            confidenceNote={
              activeLocale === "ko"
                ? "신뢰도는 카드와 상세 패널에 계속 표시됩니다."
                : "Confidence remains visible on cards and in the detail panel."
            }
            labels={copy.filters}
            locale={activeLocale}
            onBookChange={(bookId) => setFilters((current) => ({ ...current, bookId }))}
            onClearFilters={() =>
              setFilters({
                bookId: "all",
                placeId: "all",
                periodId: "all",
              })
            }
            onPeriodChange={(periodId) => setFilters((current) => ({ ...current, periodId }))}
            onPlaceChange={(placeId) => setFilters((current) => ({ ...current, placeId }))}
            periodOptions={periodOptions}
            placeOptions={placeOptions}
            previewNote={copy.previewNote}
            showingLabel={copy.filters.showing}
            totalLabel={copy.filters.of}
            visibleCount={previewCounts.visibleCount}
            totalCount={previewCounts.totalCount}
          />
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
          <p className="text-sm text-zinc-500">{copy.overlayNote}</p>
        </div>

        <div
          className={cn(
            "grid gap-4 sm:gap-6",
            "lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]",
            "xl:gap-8",
          )}
        >
          <Card className="flex min-w-0 flex-col gap-4 sm:gap-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
                  {copy.timelineHeading}
                </p>
                <h2 className="text-xl font-semibold text-zinc-950">{copy.timelineSubheading}</h2>
                <p className="text-sm leading-6 text-zinc-600">
                  {activeLocale === "ko"
                    ? "이 미리보기는 창조에서 사도행전까지 이어지며, 기간·책·지명 구조를 함께 보여줍니다."
                    : "This preview runs from Creation through Acts so period, book, and place behavior stay visible."}
                </p>
              </div>
            </div>

            <ScriptureTimelineList
              events={visibleEvents}
              locale={activeLocale}
              onSelect={setSelectedEventId}
              selectedEventId={selectedEvent?.id ?? ""}
            />
          </Card>

          <TimelineEventDetailPanel
            event={selectedEvent}
            locale={activeLocale}
            noSelection={copy.noSelection}
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

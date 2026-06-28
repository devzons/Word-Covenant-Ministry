"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  type TimelineInspectorSelection,
  timelineBookContextRows,
  timelineGenealogyComparisonRows,
  timelineGenealogySegments,
  timelineKingdomComparisonRows,
  timelineSchematicPlaceRows,
  timelineBooks,
  timelinePeriods,
  timelinePlaces,
  type TimelineEvent,
  type TimelineBookContextRow,
  type TimelineText,
  type TimelineLocale,
} from "./passionWeekTimeline";
import { ScriptureTimelineList } from "./ScriptureTimelineList";
import { TimelineEventDetailPanel } from "./TimelineEventDetailPanel";
import { createTimelineEventRowId } from "./TimelineEventCard";
import { TimelineFilterBar } from "./TimelineFilterBar";
import {
  buildTimelineHighlightLookup,
  createEmptyTimelineHighlightState,
  createTimelineHighlightItemKey,
  createTimelineHighlightSectionKey,
  type TimelineHighlightItem,
  type TimelineHighlightReason,
  type TimelineHighlightSection,
  type TimelineHighlightState,
  type TimelineHighlightStrength,
} from "./timelineHighlightState";
import type { TimelineKoreanHistoryReferenceRow } from "./koreanHistoryReferences";
import type { TimelineKingsKingdomsPreviewRow } from "./timelineKingsKingdomsPackage";
import { TimelineViewTabs } from "./TimelineViewTabs";

type TimelinePageShellProps = {
  canonicalBookRows: TimelineBookContextRow[];
  canonicalBookStats: {
    newTestamentCount: number;
    oldTestamentCount: number;
    totalCount: number;
  };
  coreEventRows: TimelineEvent[];
  coreEventStats: {
    totalCount: number;
  };
  initialFilters: TimelineFilterState;
  initialView: TimelineView;
  koreanHistoryReferenceRows: TimelineKoreanHistoryReferenceRow[];
  kingsKingdomRows: TimelineKingsKingdomsPreviewRow[];
  kingsKingdomStats: {
    recordTypeCount: Record<string, number>;
    sectionCount: number;
    totalCount: number;
  };
  locale: TimelineLocale;
};

type TimelineBookSectionNavigationItem = {
  count: number;
  sectionId: string;
  sectionKey: string;
  label: TimelineText;
  testament: "OT" | "NT";
};

type TimelineKingdomSectionNavigationItem = {
  count: number;
  sectionId: string;
  sectionKey: string;
  label: TimelineText;
};

type TimelineView = "overview" | "events" | "books" | "kingdoms" | "genealogy" | "places" | "themes";
type TimelineSupportedInspectType = "book" | "event" | "kingdom";

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

export function TimelinePageShell({
  canonicalBookRows,
  canonicalBookStats,
  coreEventRows,
  coreEventStats,
  initialFilters,
  initialView,
  koreanHistoryReferenceRows,
  kingsKingdomRows,
  kingsKingdomStats,
  locale,
}: TimelinePageShellProps) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const copy = pageCopy[activeLocale];
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<TimelineFilterState>(initialFilters);
  const [manualInspectorSelection, setManualInspectorSelection] = useState<TimelineInspectorSelection>(null);
  const [activeBookSectionKey, setActiveBookSectionKey] = useState<string>("");
  const [expandedBookSectionKeys, setExpandedBookSectionKeys] = useState<string[]>([]);
  const [activeKingdomSectionKey, setActiveKingdomSectionKey] = useState<string>("");
  const [expandedKingdomSectionKeys, setExpandedKingdomSectionKeys] = useState<string[]>([]);
  const timelineEvents = coreEventRows;
  const activeView = parseTimelineViewValue(searchParams.get("view")) ?? initialView;
  const canonicalBookSections = useMemo(
    () => buildCanonicalBookSectionNavigation(canonicalBookRows),
    [canonicalBookRows],
  );
  const kingsKingdomSections = useMemo(
    () => buildKingsKingdomSectionNavigation(kingsKingdomRows),
    [kingsKingdomRows],
  );
  const periodCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const event of timelineEvents) {
      counts.set(event.periodId, (counts.get(event.periodId) ?? 0) + 1);
    }

    return counts;
  }, [timelineEvents]);

  const bookCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const event of timelineEvents) {
      counts.set(event.primaryBookId, (counts.get(event.primaryBookId) ?? 0) + 1);

      for (const relatedBookId of event.relatedBookIds) {
        counts.set(relatedBookId, (counts.get(relatedBookId) ?? 0) + 1);
      }
    }

    return counts;
  }, [timelineEvents]);

  const placeCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const event of timelineEvents) {
      for (const placeId of event.placeIds) {
        counts.set(placeId, (counts.get(placeId) ?? 0) + 1);
      }
    }

    return counts;
  }, [timelineEvents]);

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
      timelineEvents.filter((event) => {
        const matchesPeriod = filters.periodId === "all" || event.periodId === filters.periodId;
        const matchesBook =
          filters.bookId === "all" ||
          event.primaryBookId === filters.bookId ||
          event.relatedBookIds.includes(filters.bookId);
        const matchesPlace = filters.placeId === "all" || event.placeIds.includes(filters.placeId);
        const matchesSearch = matchesTimelineSearch(event, normalizedSearch);

        return matchesPeriod && matchesBook && matchesPlace && matchesSearch;
      }),
    [filters.bookId, filters.periodId, filters.placeId, normalizedSearch, timelineEvents],
  );

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
      totalCount: coreEventStats.totalCount,
      visibleCount: visibleEvents.length,
    };
  }, [coreEventStats.totalCount, visibleEvents]);

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
    () => new Map(timelineEvents.map((event) => [event.id, event])),
    [timelineEvents],
  );
  const bookContextById = useMemo(
    () => new Map([...timelineBookContextRows, ...canonicalBookRows].map((row) => [row.id, row])),
    [canonicalBookRows],
  );
  const bookContextByBookId = useMemo(
    () => new Map([...timelineBookContextRows, ...canonicalBookRows].map((row) => [row.bookId, row])),
    [canonicalBookRows],
  );
  const kingdomComparisonById = useMemo(
    () =>
      new Map(
        [...timelineKingdomComparisonRows, ...kingsKingdomRows].map((row) => [row.id, row]),
      ),
    [kingsKingdomRows],
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
  const resolveSelectionFromQuery = useCallback(
    (
      view: TimelineView,
      inspectType: TimelineSupportedInspectType | null,
      inspectId: string,
    ): TimelineInspectorSelection => {
      if (!inspectType || inspectId === "") {
        return null;
      }

      if (view === "events" && inspectType === "event" && eventById.has(inspectId)) {
        return { id: inspectId, type: "event" };
      }

      if (view === "books" && inspectType === "book") {
        const bookRow = bookContextByBookId.get(inspectId);

        if (bookRow) {
          return { id: bookRow.id, type: "book" };
        }
      }

      if (view === "kingdoms" && inspectType === "kingdom" && kingdomComparisonById.has(inspectId)) {
        return { id: inspectId, type: "kingdom" };
      }

      return null;
    },
    [bookContextByBookId, eventById, kingdomComparisonById],
  );
  const getInspectQueryState = useCallback(
    (selection: TimelineInspectorSelection) => {
      if (!selection) {
        return null;
      }

      if (selection.type === "event") {
        return {
          inspectId: selection.id,
          inspectType: "event" as const,
        };
      }

      if (selection.type === "book") {
        const row = bookContextById.get(selection.id);

        return row
          ? {
              inspectId: row.bookId,
              inspectType: "book" as const,
            }
          : null;
      }

      if (selection.type === "kingdom") {
        return {
          inspectId: selection.id,
          inspectType: "kingdom" as const,
        };
      }

      return null;
    },
    [bookContextById],
  );
  const hasInspectQuery =
    normalizeQueryValue(searchParams.get("inspectType")) !== "" ||
    normalizeQueryValue(searchParams.get("inspectId")) !== "";
  const queryInspectorSelection = useMemo(
    () =>
      resolveSelectionFromQuery(
        activeView,
        parseInspectTypeValue(searchParams.get("inspectType")),
        normalizeQueryValue(searchParams.get("inspectId")),
      ),
    [activeView, resolveSelectionFromQuery, searchParams],
  );
  const inspectorSelection = queryInspectorSelection ?? (hasInspectQuery ? null : getManualSelectionForView(manualInspectorSelection, activeView));
  const forcedBookSectionKey =
    inspectorSelection?.type === "book"
      ? getBookSectionKeyForSelection(inspectorSelection.id, canonicalBookRows)
      : "";
  const forcedKingdomSectionKey =
    inspectorSelection?.type === "kingdom"
      ? getKingdomSectionKeyForSelection(inspectorSelection.id, kingsKingdomRows)
      : "";
  const resolvedExpandedBookSectionKeys = forcedBookSectionKey
    ? Array.from(new Set([...expandedBookSectionKeys, forcedBookSectionKey]))
    : expandedBookSectionKeys;
  const resolvedExpandedKingdomSectionKeys = forcedKingdomSectionKey
    ? Array.from(new Set([...expandedKingdomSectionKeys, forcedKingdomSectionKey]))
    : expandedKingdomSectionKeys;
  const resolvedActiveBookSectionKey = forcedBookSectionKey || (
    canonicalBookSections.some((section) => section.sectionKey === activeBookSectionKey)
      ? activeBookSectionKey
      : ""
  );
  const resolvedActiveKingdomSectionKey = forcedKingdomSectionKey || (
    kingsKingdomSections.some((section) => section.sectionKey === activeKingdomSectionKey)
      ? activeKingdomSectionKey
      : ""
  );
  const selectedEventId = inspectorSelection?.type === "event" ? inspectorSelection.id : "";
  const timelineHighlightState = useMemo(
    () =>
      deriveTimelineHighlightState({
        activeView,
        canonicalBookRows,
        inspectorSelection,
        kingsKingdomRows,
        timelineEvents,
      }),
    [activeView, canonicalBookRows, inspectorSelection, kingsKingdomRows, timelineEvents],
  );
  const timelineHighlightLookup = useMemo(
    () => buildTimelineHighlightLookup(timelineHighlightState),
    [timelineHighlightState],
  );
  const highlightedBookSectionKeys = useMemo(
    () =>
      timelineHighlightState.highlightedSections
        .filter((section) => section.view === "books")
        .map((section) => getTimelineBooksSectionKeyFromSectionId(section.sectionId)),
    [timelineHighlightState],
  );
  const highlightedKingdomSectionKeys = useMemo(
    () =>
      timelineHighlightState.highlightedSections
        .filter((section) => section.view === "kingdoms")
        .map((section) => getTimelineKingsSectionKeyFromSectionId(section.sectionId)),
    [timelineHighlightState],
  );

  const replaceTimelineQuery = useCallback((nextView: TimelineView, selection: TimelineInspectorSelection) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", nextView);

    const inspectState = getInspectQueryState(selection);

    if (inspectState) {
      params.set("inspectType", inspectState.inspectType);
      params.set("inspectId", inspectState.inspectId);
    } else {
      params.delete("inspectType");
      params.delete("inspectId");
    }

    const nextQuery = params.toString();

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [getInspectQueryState, pathname, router, searchParams]);

  function setTimelineView(nextView: TimelineView, clearSelection = false) {
    if (clearSelection) {
      setManualInspectorSelection(null);
    }

    replaceTimelineQuery(nextView, clearSelection ? null : inspectorSelection ?? manualInspectorSelection);
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
      setManualInspectorSelection(null);
      replaceTimelineQuery(activeView, null);
      return;
    }

    const nextView = view ?? getViewForSelection(selection);
    const querySelection = getInspectQueryState(selection);

    if (querySelection) {
      setManualInspectorSelection(null);
    } else {
      setManualInspectorSelection(selection);
    }

    replaceTimelineQuery(nextView, selection);
  }

  function focusSelectionTarget(selection: Exclude<TimelineInspectorSelection, null>) {
    if (typeof document === "undefined") {
      return;
    }

    const targetId = getSelectionTargetId(selection);

    if (!targetId) {
      return;
    }

    window.setTimeout(() => {
      const element = document.getElementById(targetId);

      if (!element) {
        return;
      }

      element.scrollIntoView({ behavior: "smooth", block: "start" });
      if ("focus" in element) {
        (element as HTMLElement).focus();
      }
    }, 160);
  }

  useEffect(() => {
    const inspectType = parseInspectTypeValue(searchParams.get("inspectType"));
    const inspectId = normalizeQueryValue(searchParams.get("inspectId"));
    const shouldClearInvalidInspectQuery = () => {
      if (inspectType === null) {
        return Boolean(normalizeQueryValue(searchParams.get("inspectType")) || inspectId);
      }

      if (inspectId === "") {
        return true;
      }

      return resolveSelectionFromQuery(activeView, inspectType, inspectId) === null;
    };

    if (!queryInspectorSelection) {
      if ((searchParams.get("inspectType") || searchParams.get("inspectId")) && shouldClearInvalidInspectQuery()) {
        replaceTimelineQuery(activeView, null);
      }

      return;
    }

    focusSelectionTarget(queryInspectorSelection);
  }, [activeView, queryInspectorSelection, replaceTimelineQuery, resolveSelectionFromQuery, searchParams]);

  const activeViewLabel = getTimelineViewLabel(activeView, activeLocale);

  function handleBookSectionSelect(section: TimelineBookSectionNavigationItem) {
    setActiveBookSectionKey(section.sectionKey);
    setExpandedBookSectionKeys((current) =>
      current.includes(section.sectionKey) ? current : [...current, section.sectionKey],
    );

    if (typeof document === "undefined") {
      return;
    }

    const sectionElement = document.getElementById(section.sectionId);

    if (!sectionElement) {
      return;
    }

    sectionElement.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      sectionElement.focus();
    }, 150);
  }

  function handleBookSectionToggle(sectionKey: string) {
    setActiveBookSectionKey(sectionKey);
    setExpandedBookSectionKeys((current) =>
      current.includes(sectionKey)
        ? current.filter((key) => key !== sectionKey)
        : [...current, sectionKey],
    );
  }

  function handleKingdomSectionSelect(section: TimelineKingdomSectionNavigationItem) {
    setActiveKingdomSectionKey(section.sectionKey);
    setExpandedKingdomSectionKeys((current) =>
      current.includes(section.sectionKey) ? current : [...current, section.sectionKey],
    );

    if (typeof document === "undefined") {
      return;
    }

    const sectionElement = document.getElementById(section.sectionId);

    if (!sectionElement) {
      return;
    }

    sectionElement.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      sectionElement.focus();
    }, 150);
  }

  function handleKingdomSectionToggle(sectionKey: string) {
    setActiveKingdomSectionKey(sectionKey);
    setExpandedKingdomSectionKeys((current) =>
      current.includes(sectionKey)
        ? current.filter((key) => key !== sectionKey)
        : [...current, sectionKey],
    );
  }

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
            activeKingdomSectionKey={resolvedActiveKingdomSectionKey}
            bookOptions={bookOptions}
            booksPreviewStats={canonicalBookStats}
            bookSections={canonicalBookSections}
            kingdomSections={kingsKingdomSections}
            kingdomsPreviewStats={kingsKingdomStats}
            confidenceLabel={activeLocale === "ko" ? "높은 신뢰도 미리보기" : "High-confidence preview"}
            confidenceNote={
              activeLocale === "ko"
                ? "신뢰도는 카드와 상세 패널에 계속 표시됩니다."
                : "Confidence remains visible on cards and in the detail panel."
            }
            highlightedBookSectionKeys={highlightedBookSectionKeys}
            highlightedKingdomSectionKeys={highlightedKingdomSectionKeys}
            labels={copy.sidebar}
            locale={activeLocale}
            activeBookSectionKey={resolvedActiveBookSectionKey}
            onBookChange={(bookId) => setFilters((current) => ({ ...current, bookId }))}
            onBookSectionSelect={(sectionKey) => {
              const selectedSection = canonicalBookSections.find((section) => section.sectionKey === sectionKey);

              if (!selectedSection) {
                return;
              }

              handleBookSectionSelect(selectedSection);
            }}
            onClearFilters={() =>
              setFilters({
                bookId: "all",
                placeId: "all",
                periodId: "all",
                searchTerm: "",
              })
            }
            onKingdomSectionSelect={(sectionKey) => {
              const selectedSection = kingsKingdomSections.find(
                (section) => section.sectionKey === sectionKey,
              );

              if (!selectedSection) {
                return;
              }

              handleKingdomSectionSelect(selectedSection);
            }}
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
              canonicalBookStats={canonicalBookStats}
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
                  activeSectionKey={resolvedActiveKingdomSectionKey}
                  expandedSectionKeys={resolvedExpandedKingdomSectionKeys}
                  highlightLookup={timelineHighlightLookup}
                  kingdomSections={kingsKingdomSections}
                  kingsKingdomRows={kingsKingdomRows}
                  kingsKingdomStats={kingsKingdomStats}
                  locale={activeLocale}
                  onSectionToggle={handleKingdomSectionToggle}
                  onSelectRow={(rowId) => {
                    const selectedRow = kingsKingdomRows.find((row) => row.id === rowId);

                    if (selectedRow?.sectionId) {
                      setActiveKingdomSectionKey(selectedRow.sectionId);
                      setExpandedKingdomSectionKeys((current) =>
                        current.includes(selectedRow.sectionId)
                          ? current
                          : [...current, selectedRow.sectionId],
                      );
                    }

                    selectInspectorItem({ id: rowId, type: "kingdom" });
                  }}
                  selectedRowId={inspectorSelection?.type === "kingdom" ? inspectorSelection.id : ""}
                />
              ) : null}

              {activeView === "books" ? (
                <BooksContextPreviewPanel
                  activeSectionKey={resolvedActiveBookSectionKey}
                  canonicalBookRows={canonicalBookRows}
                  canonicalBookStats={canonicalBookStats}
                  bookSections={canonicalBookSections}
                  expandedSectionKeys={resolvedExpandedBookSectionKeys}
                  highlightLookup={timelineHighlightLookup}
                  locale={activeLocale}
                  onSectionToggle={handleBookSectionToggle}
                  onSelectRow={(rowId) => {
                    const selectedRow = canonicalBookRows.find((row) => row.id === rowId);

                    if (selectedRow?.canonicalSection) {
                      const sectionKey = getTimelineBooksSectionKey(selectedRow.canonicalSection);
                      setActiveBookSectionKey(sectionKey);
                      setExpandedBookSectionKeys((current) =>
                        current.includes(sectionKey) ? current : [...current, sectionKey],
                      );
                    }

                    selectInspectorItem({ id: rowId, type: "book" });
                  }}
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
                  bookContextById={bookContextById}
                  highlightState={timelineHighlightState}
                  locale={activeLocale}
                  onSelectRow={(rowId) => selectInspectorItem({ id: rowId, type: "place" })}
                  searchTerm={filters.searchTerm}
                  selection={inspectorSelection}
                  selectedRowId={inspectorSelection?.type === "place" ? inspectorSelection.id : ""}
                />
              ) : null}

              {activeView === "events" ? (
                <div className="mt-4">
                  <ScriptureTimelineList
                    activePeriodId={filters.periodId}
                    events={visibleEvents}
                    highlightLookup={timelineHighlightLookup}
                    koreanHistoryReferenceRows={koreanHistoryReferenceRows}
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
            highlightState={timelineHighlightState}
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
              bookContextByBookId,
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
  canonicalBookStats: {
    newTestamentCount: number;
    oldTestamentCount: number;
    totalCount: number;
  };
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
  canonicalBookStats,
  locale,
  modeLabel,
  totalCount,
  visibleCount,
}: CompactStatusRowProps) {
  const viewStatusNote = getCompactStatusNote(activeView, locale, visibleCount, totalCount, canonicalBookStats);

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
  canonicalBookStats: {
    newTestamentCount: number;
    oldTestamentCount: number;
    totalCount: number;
  },
) {
  switch (view) {
    case "overview":
    case "events":
      return locale === "ko"
        ? `${visibleCount}개 사건 / 전체 ${totalCount}개`
        : `${visibleCount} events / ${totalCount} total`;
    case "books":
      return locale === "ko"
        ? `66권 package preview · 구약 ${canonicalBookStats.oldTestamentCount} / 신약 ${canonicalBookStats.newTestamentCount}`
        : `66-book package preview · OT ${canonicalBookStats.oldTestamentCount} / NT ${canonicalBookStats.newTestamentCount}`;
    case "kingdoms":
      return locale === "ko" ? "왕국 비교 preview rows" : "Kingdom comparison preview rows";
    case "genealogy":
      return locale === "ko" ? "마태복음 1장 구조 preview" : "Matthew 1 structural preview";
    case "places":
      return locale === "ko" ? "좌표 없는 개념지도 preview" : "Non-coordinate schematic preview";
    case "themes":
      return locale === "ko" ? "준비 중" : "Planned";
  }
}

function normalizeQueryValue(value: string | null) {
  return typeof value === "string" ? value.trim() : "";
}

function parseTimelineViewValue(value: string | null): TimelineView {
  const normalized = normalizeQueryValue(value);
  const supportedViews: TimelineView[] = ["overview", "events", "books", "kingdoms", "genealogy", "places", "themes"];

  return supportedViews.includes(normalized as TimelineView) ? (normalized as TimelineView) : "overview";
}

function parseInspectTypeValue(value: string | null): TimelineSupportedInspectType | null {
  const normalized = normalizeQueryValue(value);

  if (normalized === "event" || normalized === "book" || normalized === "kingdom") {
    return normalized;
  }

  return null;
}

function getManualSelectionForView(
  selection: TimelineInspectorSelection,
  activeView: TimelineView,
): TimelineInspectorSelection {
  if (!selection) {
    return null;
  }

  switch (selection.type) {
    case "event":
      return activeView === "events" ? selection : null;
    case "book":
      return activeView === "books" ? selection : null;
    case "genealogy":
      return activeView === "genealogy" ? selection : null;
    case "kingdom":
      return activeView === "kingdoms" ? selection : null;
    case "place":
      return activeView === "places" ? selection : null;
  }
}

function getBookSectionKeyForSelection(rowId: string, canonicalBookRows: TimelineBookContextRow[]) {
  const row = canonicalBookRows.find((entry) => entry.id === rowId);

  return row?.canonicalSection ? getTimelineBooksSectionKey(row.canonicalSection) : "";
}

function getKingdomSectionKeyForSelection(
  rowId: string,
  kingsKingdomRows: TimelineKingsKingdomsPreviewRow[],
) {
  const row = kingsKingdomRows.find((entry) => entry.id === rowId);

  return row?.sectionId ?? "";
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
          <p className="mt-2 text-xs leading-5 text-zinc-500">
            {locale === "ko"
              ? "core biblical event skeleton package 기반 metadata-only preview입니다. 성경 본문은 저장하거나 표시하지 않습니다."
              : "This is a metadata-only preview backed by the core biblical event skeleton package. Bible text is not stored or rendered here."}
          </p>
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
  bookContextById: Map<string, TimelineBookContextRow>;
  highlightState: TimelineHighlightState;
  locale: TimelineLocale;
  onSelectRow: (rowId: string) => void;
  searchTerm: string;
  selection: TimelineInspectorSelection;
  selectedRowId: string;
};

type PlacesSchematicHighlightSummary = {
  cautionCount: number;
  highlightedBookCount: number;
  highlightedItemCount: number;
  highlightedSectionCount: number;
  selectedContextLabel: string;
  selectedContextTypeLabel: string;
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
  bookContextById,
  highlightState,
  locale,
  onSelectRow,
  searchTerm,
  selection,
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
  const summary = buildPlacesSchematicHighlightSummary({
    bookContextById,
    highlightState,
    locale,
    selection,
  });

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

      <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
            {locale === "ko" ? "개념 highlight placeholder" : "Schematic highlight placeholder"}
          </p>
          <p className="text-sm leading-6 text-zinc-600">
            {locale === "ko"
              ? "이 영역은 현재 Context Inspector 선택과 package metadata에서만 파생되는 개념 요약입니다. 실제 지도, 좌표, 지도 제공자, 지오코딩은 사용하지 않습니다."
              : "This area is a schematic summary derived only from the current Context Inspector selection and package metadata. It does not use a real map, coordinates, a map provider, or geocoding."}
          </p>
          <p className="text-xs leading-5 text-zinc-500">
            {locale === "ko"
              ? "성경 본문은 저장하거나 표시하지 않으며, Places package integration은 아직 보류 상태입니다."
              : "Bible text is not stored or rendered here, and Places package integration remains deferred."}
          </p>
        </div>

        {summary ? (
          <div className="mt-3 space-y-3 rounded-md border border-zinc-200 bg-white p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full border border-zinc-900 bg-zinc-950 px-2.5 py-1 text-[11px] font-semibold leading-none text-white">
                {summary.selectedContextTypeLabel}
              </span>
              <span className="text-sm font-medium text-zinc-950">{summary.selectedContextLabel}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-700">
                {locale === "ko"
                  ? `연결 항목 ${summary.highlightedItemCount}`
                  : `Linked items ${summary.highlightedItemCount}`}
              </span>
              <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-700">
                {locale === "ko"
                  ? `연결 책 ${summary.highlightedBookCount}`
                  : `Linked books ${summary.highlightedBookCount}`}
              </span>
              <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-700">
                {locale === "ko"
                  ? `구간 ${summary.highlightedSectionCount}`
                  : `Sections ${summary.highlightedSectionCount}`}
              </span>
              <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-700">
                {locale === "ko"
                  ? `주의 ${summary.cautionCount}`
                  : `Cautions ${summary.cautionCount}`}
              </span>
            </div>
            <p className="text-xs leading-5 text-zinc-500">
              {locale === "ko"
                ? "향후 Places highlight는 이 metadata-only 요약을 소비하는 방향으로 확장됩니다."
                : "Future Places highlights will extend this metadata-only summary surface."}
            </p>
          </div>
        ) : (
          <div className="mt-3 rounded-md border border-zinc-200 bg-white p-3 text-sm leading-6 text-zinc-600">
            {locale === "ko"
              ? "아직 선택된 Context Inspector 항목이 없습니다. 사건, 책, 왕국, 또는 장소 항목을 선택하면 이 영역이 좌표 없이 개념 요약만 표시합니다."
              : "There is no active Context Inspector selection yet. Select an event, book, kingdom, or place item and this surface will show a coordinate-free schematic summary only."}
          </div>
        )}
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

function buildPlacesSchematicHighlightSummary({
  bookContextById,
  highlightState,
  locale,
  selection,
}: {
  bookContextById: Map<string, TimelineBookContextRow>;
  highlightState: TimelineHighlightState;
  locale: TimelineLocale;
  selection: TimelineInspectorSelection;
}): PlacesSchematicHighlightSummary | null {
  if (selection?.type === "place") {
    const placeRow = timelineSchematicPlaceRows.find((row) => row.id === selection.id);

    if (!placeRow) {
      return null;
    }

    const relatedBookIds = new Set(
      (placeRow.relatedBookContextIds ?? [])
        .map((rowId) => bookContextById.get(rowId)?.bookId)
        .filter((bookId): bookId is string => Boolean(bookId)),
    );

    return {
      cautionCount: placeRow.cautionNote ? 1 : 0,
      highlightedBookCount: relatedBookIds.size,
      highlightedItemCount:
        (placeRow.relatedEventIds?.length ?? 0) + (placeRow.relatedBookContextIds?.length ?? 0),
      highlightedSectionCount: placeRow.conceptFlowGroup ? 1 : 0,
      selectedContextLabel: getTimelineText(placeRow.title, locale),
      selectedContextTypeLabel: locale === "ko" ? "선택된 장소" : "Selected place",
    };
  }

  if (!highlightState.activeItem) {
    return null;
  }

  return {
    cautionCount: highlightState.cautionNotes.length,
    highlightedBookCount: highlightState.highlightedBookIds.length,
    highlightedItemCount: highlightState.highlightedItems.length,
    highlightedSectionCount: highlightState.highlightedSections.length,
    selectedContextLabel: highlightState.activeItem.id,
    selectedContextTypeLabel: getPlacesSummaryTypeLabel(highlightState.activeItem.type, locale),
  };
}

function getPlacesSummaryTypeLabel(
  type: "event" | "book" | "kingdom",
  locale: TimelineLocale,
) {
  if (locale === "ko") {
    switch (type) {
      case "event":
        return "선택된 사건";
      case "book":
        return "선택된 책";
      case "kingdom":
        return "선택된 왕국";
    }
  }

  switch (type) {
    case "event":
      return "Selected event";
    case "book":
      return "Selected book";
    case "kingdom":
      return "Selected kingdom";
  }
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
  activeSectionKey: string;
  expandedSectionKeys: string[];
  highlightLookup: ReturnType<typeof buildTimelineHighlightLookup>;
  kingdomSections: TimelineKingdomSectionNavigationItem[];
  kingsKingdomRows: TimelineKingsKingdomsPreviewRow[];
  kingsKingdomStats: {
    recordTypeCount: Record<string, number>;
    sectionCount: number;
    totalCount: number;
  };
  locale: TimelineLocale;
  onSectionToggle: (sectionKey: string) => void;
  onSelectRow: (rowId: string) => void;
  selectedRowId: string;
};

function KingsKingdomsPreviewPanel({
  activeSectionKey,
  expandedSectionKeys,
  highlightLookup,
  kingdomSections,
  kingsKingdomRows,
  kingsKingdomStats,
  locale,
  onSectionToggle,
  onSelectRow,
  selectedRowId,
}: KingsKingdomsPreviewPanelProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex flex-col gap-1.5 border-b border-zinc-200 pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
            {locale === "ko" ? "왕국 / 제국 흐름" : "Kings / Kingdoms Flow"}
          </p>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            {locale === "ko"
              ? "kings-kingdoms skeleton package를 metadata-only preview로 연결한 보기입니다."
              : "A metadata-only preview backed by the kings-kingdoms skeleton package."}
          </p>
          <p className="mt-2 text-xs leading-5 text-zinc-500">
            {locale === "ko"
              ? "성경 본문은 저장하거나 표시하지 않습니다. 연대 표기는 review-gated caution으로만 다룹니다."
              : "Bible text is not stored or rendered here. Chronology labels remain review-gated cautions."}
          </p>
          <p className="mt-2 text-xs leading-5 text-zinc-500">
            {locale === "ko"
              ? "선지자 표시는 보조 문맥 태그로만 유지되며, 별도 선지자 row나 선택 타입으로 확장하지 않습니다."
              : "Prophet labels remain supporting context tags only and are not expanded into standalone prophet rows or a separate selection type."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-700">
            {locale === "ko" ? "미리보기" : "Preview"}
          </span>
          <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-700">
            {locale === "ko"
              ? `section ${kingsKingdomStats.sectionCount}`
              : `${kingsKingdomStats.sectionCount} sections`}
          </span>
          <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-700">
            {locale === "ko" ? `총 ${kingsKingdomStats.totalCount} rows` : `${kingsKingdomStats.totalCount} rows`}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {kingdomSections.map((section) => {
          const sectionRows = kingsKingdomRows.filter((row) => row.sectionId === section.sectionKey);
          const isActiveSection = activeSectionKey === section.sectionKey;
          const isExpanded = expandedSectionKeys.includes(section.sectionKey);
          const headingId = `${section.sectionId}-heading`;
          const panelId = `${section.sectionId}-panel`;
          const periodLabel = sectionRows[0] ? getTimelinePeriod(sectionRows[0].timelinePeriodId) : null;
          const sectionHighlight = highlightLookup.highlightedSections.get(
            createTimelineHighlightSectionKey("kingdoms", section.sectionId),
          );

          return (
            <div
              aria-labelledby={headingId}
              className={cn(
                "space-y-2 scroll-mt-28 rounded-md border border-transparent p-1",
                isActiveSection
                  ? "border-zinc-200 bg-zinc-50/70"
                  : sectionHighlight
                    ? "border-emerald-200 bg-emerald-50/40"
                    : "",
              )}
              id={section.sectionId}
              key={section.sectionKey}
              tabIndex={-1}
            >
              <button
                aria-controls={panelId}
                aria-expanded={isExpanded}
                className={cn(
                  "flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-md border px-3 py-2 text-left transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
                  isActiveSection
                    ? "border-zinc-300 bg-white text-zinc-950"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50",
                )}
                id={headingId}
                onClick={() => onSectionToggle(section.sectionKey)}
                type="button"
              >
                <span className="flex min-w-0 flex-col">
                  <span className="text-sm font-semibold text-current">
                    {`${section.label[locale]} · ${section.count} rows`}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {periodLabel ? getTimelineText(periodLabel.label, locale) : section.sectionKey}
                  </span>
                </span>
                <span className="text-xs font-semibold text-zinc-500">
                  {isExpanded ? (locale === "ko" ? "접기" : "Collapse") : locale === "ko" ? "펼치기" : "Expand"}
                </span>
              </button>

              <div className={cn("space-y-2", !isExpanded ? "hidden" : "")} id={panelId}>
                {sectionRows.map((row) => {
                  const selected = selectedRowId === row.id;
                  const period = getTimelinePeriod(row.timelinePeriodId);
                  const rowHighlight = highlightLookup.highlightedItems.get(
                    createTimelineHighlightItemKey(row.recordType, row.id),
                  );
                  const rowHighlightStrength = selected ? "primary" : rowHighlight?.strength ?? null;

                  return (
                    <button
                      id={createTimelineKingdomRowId(row.id)}
                      aria-pressed={selected}
                      className={cn(
                        "w-full rounded-md border px-3 py-3 text-left transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
                        getTimelineHighlightSurfaceClasses(rowHighlightStrength),
                        !selected && !rowHighlight ? "cursor-pointer" : "",
                      )}
                      key={row.id}
                      onClick={() => onSelectRow(row.id)}
                      type="button"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-950 px-2.5 py-1 text-[11px] font-semibold text-white">
                          {row.displayOrder}
                        </span>
                        <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-700">
                          {getKingsRecordTypeLabel(row.recordType, locale)}
                        </span>
                        {row.reviewRequired ? (
                          <span className="inline-flex rounded-full border border-zinc-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                            {locale === "ko" ? "검토 필요" : "Review required"}
                          </span>
                        ) : null}
                        {!selected && rowHighlight ? (
                          <span
                            className={cn(
                              "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                              rowHighlightStrength === "caution"
                                ? "border-amber-300 bg-amber-50 text-amber-800"
                                : "border-emerald-300 bg-emerald-50 text-emerald-800",
                            )}
                          >
                            {getTimelineHighlightReasonLabel(rowHighlight.reason, locale)}
                          </span>
                        ) : null}
                        <span className="text-sm font-semibold text-zinc-950">{getTimelineText(row.title, locale)}</span>
                        {period ? (
                          <span className="text-xs font-medium text-zinc-500">
                            {getTimelineText(period.label, locale)}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-medium text-zinc-600">
                        <span className="rounded-full bg-zinc-100 px-2.5 py-1">
                          {getTimelineText(row.confidenceLabel, locale)}
                        </span>
                        <span className="rounded-full bg-zinc-100 px-2.5 py-1">
                          {locale === "ko" ? "본문 미저장 · reference only" : "No Bible text · references only"}
                        </span>
                        {row.reignLabel ? (
                          <span className="rounded-full bg-zinc-100 px-2.5 py-1">
                            {getTimelineText(row.reignLabel, locale)}
                          </span>
                        ) : null}
                        {row.approximateDateLabel ? (
                          <span className="rounded-full bg-zinc-100 px-2.5 py-1">
                            {getTimelineText(row.approximateDateLabel, locale)}
                          </span>
                        ) : null}
                      </div>

                      {!!row.relatedBookIds.length ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {row.relatedBookIds.slice(0, 4).map((bookId) => (
                            <span
                              className="inline-flex min-h-8 items-center rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold leading-none text-zinc-900"
                              key={`${row.id}-${bookId}`}
                            >
                              {getTimelineBook(bookId)
                                ? getTimelineText(getTimelineBook(bookId)!.label, locale)
                                : bookId}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {row.scriptureAnchors.map((anchor) => (
                          <span
                            className="inline-flex min-h-8 items-center rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold leading-none text-zinc-900"
                            key={`${row.id}-${anchor.label.en}-${anchor.reader.book}-${anchor.reader.chapter}-${anchor.reader.verse}`}
                          >
                            {getTimelineText(anchor.label, locale)}
                          </span>
                        ))}
                      </div>

                      <p className="mt-2 text-sm leading-6 text-zinc-600">{getTimelineText(row.cautionNote, locale)}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

type BooksContextPreviewPanelProps = {
  activeSectionKey: string;
  bookSections: TimelineBookSectionNavigationItem[];
  canonicalBookRows: TimelineBookContextRow[];
  canonicalBookStats: {
    newTestamentCount: number;
    oldTestamentCount: number;
    totalCount: number;
  };
  expandedSectionKeys: string[];
  highlightLookup: ReturnType<typeof buildTimelineHighlightLookup>;
  locale: TimelineLocale;
  onSectionToggle: (sectionKey: string) => void;
  onSelectRow: (rowId: string) => void;
  selectedRowId: string;
};

function BooksContextPreviewPanel({
  activeSectionKey,
  bookSections,
  canonicalBookRows,
  canonicalBookStats,
  expandedSectionKeys,
  highlightLookup,
  locale,
  onSectionToggle,
  onSelectRow,
  selectedRowId,
}: BooksContextPreviewPanelProps) {
  const groupedRows = [
    {
      countLabel: locale === "ko" ? `구약 ${canonicalBookStats.oldTestamentCount}` : `OT ${canonicalBookStats.oldTestamentCount}`,
      id: "OT",
      label: locale === "ko" ? "구약" : "Old Testament",
      rows: canonicalBookRows.filter((row) => row.testament === "OT"),
    },
    {
      countLabel: locale === "ko" ? `신약 ${canonicalBookStats.newTestamentCount}` : `NT ${canonicalBookStats.newTestamentCount}`,
      id: "NT",
      label: locale === "ko" ? "신약" : "New Testament",
      rows: canonicalBookRows.filter((row) => row.testament === "NT"),
    },
  ];

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex flex-col gap-1.5 border-b border-zinc-200 pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
            {locale === "ko" ? "책 / 시편 문맥" : "Books / Psalms Context"}
          </p>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            {locale === "ko"
              ? "66권 canonical skeleton package를 metadata-only preview로 연결한 보기입니다."
              : "A metadata-only preview backed by the canonical 66-book skeleton package."}
          </p>
          <p className="mt-2 text-xs leading-5 text-zinc-500">
            {locale === "ko"
              ? "정경구간을 열어 각 책의 metadata를 확인하세요. 성경 본문은 저장하거나 표시하지 않습니다."
              : "Open a canonical section to inspect book metadata. Bible text is not stored or rendered here."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-700">
            {locale === "ko" ? "미리보기" : "Preview"}
          </span>
          <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-700">
            {locale === "ko" ? `총 ${canonicalBookStats.totalCount}권` : `${canonicalBookStats.totalCount} Books`}
          </span>
          <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-700">
            {locale === "ko"
              ? `구약 ${canonicalBookStats.oldTestamentCount} / 신약 ${canonicalBookStats.newTestamentCount}`
              : `OT ${canonicalBookStats.oldTestamentCount} / NT ${canonicalBookStats.newTestamentCount}`}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {groupedRows.map(({ countLabel, id, label, rows }) => {
          const sectionGroups = Array.from(
            rows.reduce((map, row) => {
              const sectionKey = row.canonicalSectionLabel?.en ?? row.canonicalSection ?? "Other";
              const existingRows = map.get(sectionKey) ?? [];
              existingRows.push(row);
              map.set(sectionKey, existingRows);
              return map;
            }, new Map<string, typeof rows>()),
          );

          return (
          <section className="rounded-md border border-zinc-200 bg-zinc-50 p-3" key={id}>
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-zinc-950">{label}</h3>
                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  {locale === "ko"
                    ? "정경 순서 / 저자 라벨 / 배경 연결 / Scripture reference only"
                    : "Canonical order / authorship label / background connection / Scripture references only"}
                </p>
              </div>
              <span className="inline-flex shrink-0 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-700">
                {countLabel}
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {sectionGroups.map(([sectionKey, sectionRows]) => {
                const normalizedSectionKey = getTimelineBooksSectionKey(sectionKey);
                const sectionNavigationItem = bookSections.find((section) => section.sectionKey === normalizedSectionKey);
                const sectionId = sectionNavigationItem?.sectionId ?? createTimelineBooksSectionId(sectionKey);
                const headingId = `${sectionId}-heading`;
                const panelId = `${sectionId}-panel`;
                const isActiveSection = activeSectionKey === (sectionNavigationItem?.sectionKey ?? normalizedSectionKey);
                const isExpanded = expandedSectionKeys.includes(normalizedSectionKey);
                const sectionLabel = getTimelineText(
                  sectionRows[0].canonicalSectionLabel ?? { ko: sectionKey, en: sectionKey },
                  locale,
                );
                const sectionHighlight = highlightLookup.highlightedSections.get(
                  createTimelineHighlightSectionKey("books", sectionId),
                );
                const sectionSummary =
                  locale === "ko"
                    ? `${sectionLabel} · ${sectionRows.length}권`
                    : `${sectionLabel} · ${sectionRows.length} books`;

                return (
                <div
                  aria-labelledby={headingId}
                  className={cn(
                    "space-y-2 scroll-mt-28 rounded-md border border-transparent p-1",
                    isActiveSection
                      ? "border-zinc-200 bg-white/60"
                      : sectionHighlight
                        ? "border-emerald-200 bg-emerald-50/40"
                        : "",
                  )}
                  id={sectionId}
                  key={`${id}-${sectionKey}`}
                  tabIndex={-1}
                >
                  <div className="flex items-center justify-between gap-2">
                    <button
                      aria-controls={panelId}
                      aria-expanded={isExpanded}
                      className={cn(
                        "flex min-h-11 flex-1 cursor-pointer items-center justify-between gap-3 rounded-md border px-3 py-2 text-left transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
                        isActiveSection
                          ? "border-zinc-300 bg-white text-zinc-950"
                          : "border-zinc-200 bg-white/80 text-zinc-700 hover:border-zinc-300 hover:bg-white",
                      )}
                      id={headingId}
                      onClick={() => onSectionToggle(normalizedSectionKey)}
                      type="button"
                    >
                      <span className="flex min-w-0 flex-col">
                        <span className="text-sm font-semibold text-current">{sectionSummary}</span>
                        <span className="text-xs text-zinc-500">
                          {sectionNavigationItem?.testament === "NT"
                            ? locale === "ko"
                              ? "신약"
                              : "NT"
                            : locale === "ko"
                              ? "구약"
                              : "OT"}
                        </span>
                      </span>
                      <span className="text-xs font-semibold text-zinc-500">
                        {isExpanded
                          ? locale === "ko"
                            ? "접기"
                            : "Collapse"
                          : locale === "ko"
                            ? "펼치기"
                            : "Expand"}
                      </span>
                    </button>
                  </div>
                  <div
                    className={cn("space-y-2", !isExpanded ? "hidden" : "")}
                    id={panelId}
                  >
                      {sectionRows.map((row) => {
                const selected = selectedRowId === row.id;
                const rowHighlight = highlightLookup.highlightedItems.get(
                  createTimelineHighlightItemKey("book", row.id),
                );
                const rowHighlightStrength = selected ? "primary" : rowHighlight?.strength ?? null;

                return (
                  <button
                    id={createTimelineBookRowId(row.id)}
                    aria-pressed={selected}
                    className={cn(
                      "w-full rounded-md border px-3 py-3 text-left transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
                      getTimelineHighlightSurfaceClasses(rowHighlightStrength),
                      !selected && !rowHighlight ? "cursor-pointer" : "",
                    )}
                    key={row.id}
                    onClick={() => onSelectRow(row.id)}
                    type="button"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      {row.canonicalOrder ? (
                        <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-950 px-2.5 py-1 text-[11px] font-semibold text-white">
                          {row.canonicalOrder}
                        </span>
                      ) : null}
                      <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-700">
                        {getTimelineText(row.title, locale)}
                      </span>
                      {row.testament ? (
                        <span className="text-xs font-medium uppercase tracking-[0.08em] text-zinc-500">
                          {row.testament}
                        </span>
                      ) : null}
                      {!selected && rowHighlight ? (
                        <span
                          className={cn(
                            "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                            rowHighlightStrength === "caution"
                              ? "border-amber-300 bg-amber-50 text-amber-800"
                              : "border-emerald-300 bg-emerald-50 text-emerald-800",
                          )}
                        >
                          {getTimelineHighlightReasonLabel(rowHighlight.reason, locale)}
                        </span>
                      ) : null}
                      <span className="text-sm font-semibold text-zinc-950">{getTimelineText(row.canonicalLocation, locale)}</span>
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
                      {row.scriptureReferencesOnly ? (
                        <span className="rounded-full bg-zinc-100 px-2.5 py-1">
                          {locale === "ko" ? "본문 미저장 · reference only" : "No Bible text · references only"}
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
                        <span
                          className={cn(
                            "inline-flex min-h-8 items-center rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold leading-none text-zinc-900",
                          )}
                          key={`${row.id}-${anchor.label.en}-${anchor.reader.book}-${anchor.reader.chapter}-${anchor.reader.verse}`}
                        >
                          {getTimelineText(anchor.label, locale)}
                        </span>
                      ))}
                    </div>

                    <p className="mt-2 text-sm leading-6 text-zinc-600">{getTimelineText(row.note, locale)}</p>
                  </button>
                );
              })}
                  </div>
                </div>
              )})}
            </div>
          </section>
        )})}
      </div>
    </section>
  );
}

function getTimelineBooksSectionKey(canonicalSection: string) {
  switch (canonicalSection) {
    case "Torah":
      return "torah";
    case "Historical Books":
      return "historical-books";
    case "Wisdom / Poetry":
      return "wisdom-poetry";
    case "Major Prophets":
      return "major-prophets";
    case "Minor Prophets":
      return "minor-prophets";
    case "Gospels / Acts":
      return "gospels-acts";
    case "Pauline Epistles":
      return "pauline-epistles";
    case "General Epistles":
      return "general-epistles";
    case "Revelation":
      return "revelation";
    default:
      return canonicalSection
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
  }
}

function createTimelineBooksSectionId(canonicalSection: string) {
  return `timeline-books-section-${getTimelineBooksSectionKey(canonicalSection)}`;
}

function createTimelineBookRowId(rowId: string) {
  return `timeline-book-row-${rowId}`;
}

function buildCanonicalBookSectionNavigation(
  canonicalBookRows: TimelineBookContextRow[],
): TimelineBookSectionNavigationItem[] {
  const sectionOrder: Record<string, number> = {
    torah: 1,
    "historical-books": 2,
    "wisdom-poetry": 3,
    "major-prophets": 4,
    "minor-prophets": 5,
    "gospels-acts": 6,
    "pauline-epistles": 7,
    "general-epistles": 8,
    revelation: 9,
  };
  const groupedSections = new Map<string, TimelineBookSectionNavigationItem>();

  for (const row of canonicalBookRows) {
    const canonicalSection = row.canonicalSection ?? row.canonicalSectionLabel?.en ?? "other";
    const sectionKey = getTimelineBooksSectionKey(canonicalSection);

    if (!groupedSections.has(sectionKey)) {
      groupedSections.set(sectionKey, {
        count: 0,
        label: row.canonicalSectionLabel ?? { en: canonicalSection, ko: canonicalSection },
        sectionId: createTimelineBooksSectionId(canonicalSection),
        sectionKey,
        testament: row.testament ?? "OT",
      });
    }

    const current = groupedSections.get(sectionKey);

    if (current) {
      current.count += 1;
    }
  }

  return Array.from(groupedSections.values()).sort((left, right) => {
    return (sectionOrder[left.sectionKey] ?? 999) - (sectionOrder[right.sectionKey] ?? 999);
  });
}

function createTimelineKingsSectionId(sectionId: string) {
  return `timeline-kings-section-${sectionId}`;
}

function createTimelineKingdomRowId(rowId: string) {
  return `timeline-kingdom-row-${rowId}`;
}

function getTimelineBooksSectionKeyFromSectionId(sectionId: string) {
  return sectionId.replace(/^timeline-books-section-/, "");
}

function getTimelineKingsSectionKeyFromSectionId(sectionId: string) {
  return sectionId.replace(/^timeline-kings-section-/, "");
}

function getSelectionTargetId(selection: Exclude<TimelineInspectorSelection, null>) {
  switch (selection.type) {
    case "event":
      return createTimelineEventRowId(selection.id);
    case "book":
      return createTimelineBookRowId(selection.id);
    case "kingdom":
      return createTimelineKingdomRowId(selection.id);
    default:
      return null;
  }
}

function getTimelineHighlightSurfaceClasses(
  strength: TimelineHighlightStrength | null,
) {
  if (strength === "primary") {
    return "border-zinc-950 bg-white shadow-sm";
  }

  if (strength === "caution") {
    return "border-amber-300 bg-amber-50/70 hover:border-amber-400 hover:bg-amber-50";
  }

  if (strength === "related") {
    return "border-emerald-300 bg-emerald-50/60 hover:border-emerald-400 hover:bg-emerald-50";
  }

  return "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50";
}

function getTimelineHighlightReasonLabel(
  reason: TimelineHighlightReason,
  locale: TimelineLocale,
) {
  switch (reason) {
    case "selected":
      return locale === "ko" ? "선택됨" : "Selected";
    case "same-section":
      return locale === "ko" ? "같은 구간" : "Same section";
    case "related-book":
      return locale === "ko" ? "관련 책" : "Related book";
    case "scripture-anchor-overlap":
      return locale === "ko" ? "같은 reference" : "Reference overlap";
    case "internal-relation":
      return locale === "ko" ? "명시 관계" : "Explicit relation";
    case "transition-link":
      return locale === "ko" ? "전환 연결" : "Transition link";
    case "predecessor-successor":
      return locale === "ko" ? "전임/후임" : "Predecessor/successor";
    case "same-period":
      return locale === "ko" ? "같은 기간" : "Same period";
    case "same-accordion-group":
      return locale === "ko" ? "같은 흐름" : "Same flow";
  }
}

function buildKingsKingdomSectionNavigation(
  kingsKingdomRows: TimelineKingsKingdomsPreviewRow[],
): TimelineKingdomSectionNavigationItem[] {
  const sectionOrder: Record<string, number> = {
    "kings-united-monarchy": 1,
    "kings-divided-overview": 2,
    "kings-northern-israel": 3,
    "kings-southern-judah": 4,
    "kings-exile-markers": 5,
  };
  const groupedSections = new Map<string, TimelineKingdomSectionNavigationItem>();

  for (const row of kingsKingdomRows) {
    if (!groupedSections.has(row.sectionId)) {
      groupedSections.set(row.sectionId, {
        count: 0,
        label: row.title,
        sectionId: createTimelineKingsSectionId(row.sectionId),
        sectionKey: row.sectionId,
      });
    }

    const current = groupedSections.get(row.sectionId);

    if (current) {
      current.count += 1;
    }
  }

  return Array.from(groupedSections.values()).sort(
    (left, right) => (sectionOrder[left.sectionKey] ?? 999) - (sectionOrder[right.sectionKey] ?? 999),
  );
}

function getKingsRecordTypeLabel(
  recordType: TimelineKingsKingdomsPreviewRow["recordType"],
  locale: TimelineLocale,
) {
  const labels: Record<TimelineKingsKingdomsPreviewRow["recordType"], TimelineText> = {
    exileMarker: { en: "Exile Marker", ko: "포로 표지" },
    king: { en: "King", ko: "왕" },
    kingdom: { en: "Kingdom", ko: "왕국" },
    kingdomPeriod: { en: "Kingdom Period", ko: "왕국 구간" },
    propheticContextMarker: { en: "Prophetic Context", ko: "선지자 문맥" },
    templeMarker: { en: "Temple Marker", ko: "성전 표지" },
    transition: { en: "Transition", ko: "전환" },
  };

  return getTimelineText(labels[recordType], locale);
}

function deriveTimelineHighlightState({
  activeView,
  canonicalBookRows,
  inspectorSelection,
  kingsKingdomRows,
  timelineEvents,
}: {
  activeView: TimelineView;
  canonicalBookRows: TimelineBookContextRow[];
  inspectorSelection: TimelineInspectorSelection;
  kingsKingdomRows: TimelineKingsKingdomsPreviewRow[];
  timelineEvents: TimelineEvent[];
}): TimelineHighlightState {
  if (
    !inspectorSelection ||
    (activeView !== "events" && activeView !== "books" && activeView !== "kingdoms")
  ) {
    return createEmptyTimelineHighlightState();
  }

  const itemMap = new Map<string, TimelineHighlightItem>();
  const sectionMap = new Map<string, TimelineHighlightSection>();
  const bookIds = new Set<string>();
  const cautionNotes = new Set<string>();

  const addItem = ({
    id,
    reason,
    source,
    strength,
    type,
  }: TimelineHighlightItem) => {
    const key = createTimelineHighlightItemKey(type, id);
    const current = itemMap.get(key);

    if (!current || getTimelineHighlightStrengthRank(strength) > getTimelineHighlightStrengthRank(current.strength)) {
      itemMap.set(key, { id, reason, source, strength, type });
    }
  };

  const addSection = (section: TimelineHighlightSection) => {
    sectionMap.set(
      createTimelineHighlightSectionKey(section.view, section.sectionId),
      section,
    );
  };

  const addBookIds = (ids: string[]) => {
    for (const id of ids) {
      if (id) {
        bookIds.add(id);
      }
    }
  };

  const addCautionNote = (note?: TimelineText, reviewRequired?: boolean) => {
    if (reviewRequired && note) {
      cautionNotes.add(note.ko);
      cautionNotes.add(note.en);
    }
  };

  if (activeView === "events" && inspectorSelection.type === "event") {
    const selectedEvent = timelineEvents.find((event) => event.id === inspectorSelection.id);

    if (!selectedEvent) {
      return createEmptyTimelineHighlightState();
    }

    addItem({
      id: selectedEvent.id,
      reason: "selected",
      source: "selection",
      strength: "primary",
      type: "event",
    });
    addSection({
      reason: "same-period",
      sectionId: selectedEvent.periodId,
      view: "events",
    });
    addBookIds(selectedEvent.relatedBookIds);
    addCautionNote(selectedEvent.cautionNote, selectedEvent.reviewRequired);

    for (const event of timelineEvents) {
      if (event.id === selectedEvent.id) {
        continue;
      }

      if (event.sectionId && selectedEvent.sectionId && event.sectionId === selectedEvent.sectionId) {
        addItem({
          id: event.id,
          reason: "same-section",
          source: "metadata",
          strength: event.reviewRequired ? "caution" : "related",
          type: "event",
        });
        continue;
      }

      if (
        event.accordionGroup &&
        selectedEvent.accordionGroup &&
        event.accordionGroup === selectedEvent.accordionGroup
      ) {
        addItem({
          id: event.id,
          reason: "same-accordion-group",
          source: "metadata",
          strength: event.reviewRequired ? "caution" : "related",
          type: "event",
        });
        continue;
      }

      if (event.periodId === selectedEvent.periodId) {
        addItem({
          id: event.id,
          reason: "same-period",
          source: "metadata",
          strength: event.reviewRequired ? "caution" : "related",
          type: "event",
        });
      }
    }

    return {
      activeItem: { id: selectedEvent.id, type: "event", view: "events" },
      cautionNotes: Array.from(cautionNotes),
      highlightedBookIds: Array.from(bookIds),
      highlightedItems: Array.from(itemMap.values()),
      highlightedSections: Array.from(sectionMap.values()),
    };
  }

  if (activeView === "books" && inspectorSelection.type === "book") {
    const selectedRow = canonicalBookRows.find((row) => row.id === inspectorSelection.id);

    if (!selectedRow) {
      return createEmptyTimelineHighlightState();
    }

    const sectionId = createTimelineBooksSectionId(
      selectedRow.canonicalSection ?? selectedRow.canonicalSectionLabel?.en ?? "other",
    );

    addItem({
      id: selectedRow.id,
      reason: "selected",
      source: "selection",
      strength: "primary",
      type: "book",
    });
    addSection({ reason: "same-section", sectionId, view: "books" });
    addBookIds([selectedRow.bookId]);
    addCautionNote(selectedRow.note, false);

    for (const row of canonicalBookRows) {
      if (row.id === selectedRow.id) {
        continue;
      }

      if (
        row.canonicalSection &&
        selectedRow.canonicalSection &&
        row.canonicalSection === selectedRow.canonicalSection
      ) {
        addItem({
          id: row.id,
          reason: "same-section",
          source: "metadata",
          strength: "related",
          type: "book",
        });
      }
    }

    for (const event of timelineEvents) {
      if (event.relatedBookIds.includes(selectedRow.bookId) || event.primaryBookId === selectedRow.bookId) {
        addItem({
          id: event.id,
          reason: "related-book",
          source: "metadata",
          strength: event.reviewRequired ? "caution" : "related",
          type: "event",
        });
      }
    }

    for (const row of kingsKingdomRows) {
      if (row.relatedBookIds.includes(selectedRow.bookId)) {
        addItem({
          id: row.id,
          reason: "related-book",
          source: "metadata",
          strength: row.reviewRequired ? "caution" : "related",
          type: row.recordType,
        });
      }
    }

    return {
      activeItem: { id: selectedRow.id, type: "book", view: "books" },
      cautionNotes: Array.from(cautionNotes),
      highlightedBookIds: Array.from(bookIds),
      highlightedItems: Array.from(itemMap.values()),
      highlightedSections: Array.from(sectionMap.values()),
    };
  }

  if (activeView === "kingdoms" && inspectorSelection.type === "kingdom") {
    const selectedRow = kingsKingdomRows.find((row) => row.id === inspectorSelection.id);

    if (!selectedRow) {
      return createEmptyTimelineHighlightState();
    }

    addItem({
      id: selectedRow.id,
      reason: "selected",
      source: "selection",
      strength: "primary",
      type: selectedRow.recordType,
    });
    addSection({
      reason: "same-section",
      sectionId: createTimelineKingsSectionId(selectedRow.sectionId),
      view: "kingdoms",
    });
    addBookIds(selectedRow.relatedBookIds);
    addCautionNote(selectedRow.cautionNote, selectedRow.reviewRequired);

    for (const row of kingsKingdomRows) {
      if (row.id === selectedRow.id) {
        continue;
      }

      if (row.sectionId === selectedRow.sectionId) {
        addItem({
          id: row.id,
          reason: "same-section",
          source: "metadata",
          strength: row.reviewRequired ? "caution" : "related",
          type: row.recordType,
        });
      }
    }

    addRelatedKingsKingdomItem(selectedRow.kingdomId, "internal-relation", kingsKingdomRows, addItem);
    addRelatedKingsKingdomItem(selectedRow.predecessorId, "predecessor-successor", kingsKingdomRows, addItem);
    addRelatedKingsKingdomItem(selectedRow.successorId, "predecessor-successor", kingsKingdomRows, addItem);
    for (const relationId of selectedRow.relatedKingIds ?? []) {
      addRelatedKingsKingdomItem(relationId, "internal-relation", kingsKingdomRows, addItem);
    }
    for (const relationId of selectedRow.relatedTransitionIds ?? []) {
      addRelatedKingsKingdomItem(relationId, "transition-link", kingsKingdomRows, addItem);
    }
    for (const relationId of selectedRow.relatedKingdomIds ?? []) {
      addRelatedKingsKingdomItem(relationId, "internal-relation", kingsKingdomRows, addItem);
    }
    for (const relationId of selectedRow.relatedPeriodIds ?? []) {
      addRelatedKingsKingdomItem(relationId, "internal-relation", kingsKingdomRows, addItem);
    }
    addRelatedKingsKingdomItem(selectedRow.previousStateId, "transition-link", kingsKingdomRows, addItem);
    addRelatedKingsKingdomItem(selectedRow.nextStateId, "transition-link", kingsKingdomRows, addItem);

    return {
      activeItem: { id: selectedRow.id, type: "kingdom", view: "kingdoms" },
      cautionNotes: Array.from(cautionNotes),
      highlightedBookIds: Array.from(bookIds),
      highlightedItems: Array.from(itemMap.values()),
      highlightedSections: Array.from(sectionMap.values()),
    };
  }

  return createEmptyTimelineHighlightState();
}

function addRelatedKingsKingdomItem(
  relationId: string | undefined,
  reason: TimelineHighlightReason,
  rows: TimelineKingsKingdomsPreviewRow[],
  addItem: (item: TimelineHighlightItem) => void,
) {
  if (!relationId) {
    return;
  }

  const targetRow = rows.find((row) => row.id === relationId);

  if (!targetRow) {
    return;
  }

  addItem({
    id: targetRow.id,
    reason,
    source: "metadata",
    strength: targetRow.reviewRequired ? "caution" : "related",
    type: targetRow.recordType,
  });
}

function getTimelineHighlightStrengthRank(
  strength: TimelineHighlightStrength,
) {
  switch (strength) {
    case "primary":
      return 4;
    case "caution":
      return 3;
    case "related":
      return 2;
    case "subdued":
      return 1;
  }
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
              ? "마태복음 1장의 14 / 14 / 14 구조와 선택된 구약 족보 비교를 간단히 보여 주는 metadata-only 미리보기입니다. 완전한 족보 재구성이나 정확한 연대 증명을 시도하지 않습니다."
              : "A compact metadata-only preview of Matthew 1's 14 / 14 / 14 structure with selected Old Testament genealogy comparisons. It does not attempt exhaustive genealogy reconstruction or exact chronology proof."}
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

function matchesTimelineSearch(event: TimelineEvent, query: string) {
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
    event.basisLabel?.en ?? "",
    event.basisLabel?.ko ?? "",
    event.cautionNote?.en ?? "",
    event.cautionNote?.ko ?? "",
    event.periodLabel?.en ?? "",
    event.periodLabel?.ko ?? "",
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

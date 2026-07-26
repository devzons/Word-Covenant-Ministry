"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import {
  CrossReferenceItemCard,
  crossReferenceItemKey,
  type PassagePreviewTarget,
} from "@/components/scripture/CrossReferenceItemCard";
import {
  CrossReferencePassagePreviewModal,
  type PassagePreviewCacheEntry,
} from "@/components/scripture/CrossReferencePassagePreviewModal";
import { GospelHarmonyNavigator } from "@/components/scripture/GospelHarmonyNavigator";
import {
  getGospelHarmonyRecordBooks,
  getGospelHarmonyRecordCount,
  gospelHarmonyBookLabels,
  gospelHarmonyBooks,
  gospelHarmonyCounts,
  gospelHarmonyKindLabels,
  gospelHarmonySectionLabels,
  gospelHarmonyUnits,
  resolveGospelHarmonyUnitId,
  resolveGospelHarmonyView,
  type GospelHarmonyBook,
  type GospelHarmonyPassage,
  type GospelHarmonySection,
  type GospelHarmonyUnit,
  type GospelHarmonyView,
} from "@/data/gospelHarmonyUnits";
import { getBibleChapter } from "@/lib/api/bible";
import { getCrossReferences } from "@/lib/api/cross-references";
import { cn } from "@/lib/utils/cn";
import type { BibleVerse } from "@/types/bible";
import type { CrossReferenceAttribution, CrossReferenceItem } from "@/types/cross-reference";

type GospelHarmonyWorkspaceProps = {
  locale: "en" | "ko";
};

type GospelHarmonyLayout = "parallel" | "stacked";

const gospelHarmonyCopy = {
  en: {
    title: "Gospel Harmony",
    eyebrow: "Scripture Study",
    description:
      "Compare curated Gospel units across Matthew, Mark, Luke, and John with runtime Bible text loading.",
    filtersLabel: "Views",
    searchLabel: "Search",
    searchPlaceholder: "Search titles or references",
    searchEmpty: "No harmony units match this filter or search.",
    searchResults: "Search Results",
    selectUnit: "Browse Units",
    parallelPassages: "Parallel Passages",
    layoutLabel: "Reading Layout",
    layoutParallel: "Parallel",
    layoutStacked: "Stacked",
    selectedInformation: "Selected Unit",
    classification: "Classification",
    tags: "Tags",
    coverage: "Gospel Coverage",
    wholeChapter: "Open in Reader",
    viewPassage: "View passage",
    openInReader: "Open in Reader",
    close: "Close",
    closePreview: "Close passage preview",
    previewDialog: "Passage Preview",
    loadingPassage: "Loading passage...",
    passageError: "Passage could not be loaded.",
    passageUnavailable: "No passage text returned for this version.",
    unsupportedRange: "This range is not supported in preview.",
    version: "Version",
    noPassage: "No linked passage yet.",
    loading: "Loading passage...",
    error: "Passage could not be loaded.",
    noText: "No passage text returned.",
    relatedPassages: "Related Passages",
    relatedPassagesDescription:
      "Source-backed related passages for each Gospel account. OpenBible links are unreviewed discovery data.",
    loadRelatedPassages: "Load related passages",
    loadingRelatedPassages: "Loading related passages...",
    relatedPassagesEmpty: "No related passages were found for these Gospel accounts.",
    relatedPassagesError: "Some related passages could not be loaded.",
    relatedPassagesMvpNote: "MVP note: related passages use each account's start verse only.",
    columnsLabel: "Recorded Accounts",
    mobileRecordedAccounts: "Recorded Gospel accounts",
    uniqueSingleRecord: "Unique Gospel record",
    relatedTheme: "Theme",
    unreviewed: "Unreviewed",
  },
  ko: {
    title: "복음서 대조서",
    eyebrow: "성경 연구",
    description:
      "마태·마가·누가·요한복음의 대조 단위를 탐색하면서 실제 성경 본문을 런타임으로 불러옵니다.",
    filtersLabel: "보기 필터",
    searchLabel: "검색",
    searchPlaceholder: "제목 또는 성경 참조 검색",
    searchEmpty: "현재 필터와 검색에 맞는 대조 단위가 없습니다.",
    searchResults: "검색 결과",
    selectUnit: "단위 탐색",
    parallelPassages: "병행 본문",
    layoutLabel: "읽기 레이아웃",
    layoutParallel: "병행 대조",
    layoutStacked: "위아래 읽기",
    selectedInformation: "선택 단위 정보",
    classification: "분류",
    tags: "태그",
    coverage: "복음서 기록 범위",
    wholeChapter: "성경 본문으로 이동",
    viewPassage: "본문 보기",
    openInReader: "성경 본문으로 이동",
    close: "닫기",
    closePreview: "본문 미리보기 닫기",
    previewDialog: "본문 미리보기",
    loadingPassage: "본문을 불러오는 중입니다.",
    passageError: "본문을 불러오지 못했습니다.",
    passageUnavailable: "이 번역본에서 본문을 찾을 수 없습니다.",
    unsupportedRange: "이 범위는 미리보기에서 지원하지 않습니다.",
    version: "번역",
    noPassage: "아직 연결된 본문이 없습니다.",
    loading: "본문을 불러오는 중입니다...",
    error: "본문을 불러올 수 없습니다.",
    noText: "본문이 없습니다.",
    relatedPassages: "관련 구절",
    relatedPassagesDescription:
      "각 복음서 본문과 연결된 출처 기반 관련 구절입니다. OpenBible 링크는 검토 전 탐색 데이터입니다.",
    loadRelatedPassages: "관련 구절 불러오기",
    loadingRelatedPassages: "관련 구절을 불러오는 중입니다...",
    relatedPassagesEmpty: "이 복음서 본문에 대한 관련 구절이 없습니다.",
    relatedPassagesError: "일부 관련 구절을 불러오지 못했습니다.",
    relatedPassagesMvpNote: "MVP 참고: 관련 구절은 각 본문의 시작 절 기준으로 조회합니다.",
    columnsLabel: "실제 기록된 복음서",
    mobileRecordedAccounts: "기록된 복음서 선택",
    uniqueSingleRecord: "고유 기록",
    relatedTheme: "주제",
    unreviewed: "검토 전",
  },
};

const relatedGospelColumns: GospelHarmonyBook[] = ["matthew", "mark", "luke", "john"];
const RELATED_PASSAGES_PER_ACCOUNT = 3;
const sectionOrder: GospelHarmonySection[] = [
  "ministry-start",
  "kingdom",
  "grace-repentance-forgiveness",
  "discipleship-obedience",
  "prayer-faith",
  "stewardship-wealth",
  "israel-leaders",
  "eschatology",
  "figurative",
];

export function GospelHarmonyWorkspace({ locale }: GospelHarmonyWorkspaceProps) {
  const copy = gospelHarmonyCopy[locale];
  const translation = locale === "en" ? "WEB" : "KRV";
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedView = resolveGospelHarmonyView(searchParams.get("view"));
  const activeView = requestedView ?? "all";
  const requestedLayout = resolveGospelHarmonyLayout(searchParams.get("layout"));
  const activeLayout = requestedLayout ?? "parallel";
  const requestedUnitId = resolveGospelHarmonyUnitId(searchParams.get("unit"));
  const [searchQuery, setSearchQuery] = useState("");
  const [openMobileColumn, setOpenMobileColumn] = useState<GospelHarmonyBook | null>(null);
  const [previewTarget, setPreviewTarget] = useState<PassagePreviewTarget | null>(null);
  const [previewCache, setPreviewCache] = useState<Record<string, PassagePreviewCacheEntry>>({});
  const previewReturnFocusRef = useRef<HTMLElement | null>(null);

  const viewCounts = useMemo(
    () => ({
      all: gospelHarmonyCounts.total,
      parables: gospelHarmonyCounts.parables,
      eschatology: gospelHarmonyCounts.eschatology,
      events: gospelHarmonyCounts.events,
      figurative: gospelHarmonyCounts.figurative,
    }),
    [],
  );

  const filteredByView = useMemo(
    () => gospelHarmonyUnits.filter((unit) => matchesView(unit, activeView)),
    [activeView],
  );
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredUnits = useMemo(() => {
    if (!normalizedSearch) {
      return filteredByView;
    }

    return filteredByView.filter((unit) => buildSearchIndex(unit).includes(normalizedSearch));
  }, [filteredByView, normalizedSearch]);
  const selectedUnit = useMemo(() => {
    if (requestedUnitId) {
      return (
        filteredUnits.find((unit) => unit.id === requestedUnitId) ??
        filteredByView.find((unit) => unit.id === requestedUnitId) ??
        gospelHarmonyUnits.find((unit) => unit.id === requestedUnitId)
      );
    }

    return filteredUnits[0] ?? filteredByView[0] ?? gospelHarmonyUnits[0];
  }, [filteredByView, filteredUnits, requestedUnitId]);
  const displayUnit = normalizedSearch && filteredUnits.length === 0 ? null : selectedUnit;
  const visibleBooks = useMemo(
    () => (displayUnit ? getGospelHarmonyRecordBooks(displayUnit) : []),
    [displayUnit],
  );
  const mobileActiveColumn =
    openMobileColumn && visibleBooks.includes(openMobileColumn)
      ? openMobileColumn
      : visibleBooks[0] ?? null;
  const groupedSections = useMemo(
    () =>
      sectionOrder
        .map((section) => {
          const units = filteredUnits.filter((unit) => unit.section === section);

          return {
            count: units.length,
            section,
            title: gospelHarmonySectionLabels[section][locale],
            units,
          };
        })
        .filter((section) => section.count > 0),
    [filteredUnits, locale],
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let shouldReplace = false;

    if (requestedView === null && searchParams.get("view")) {
      params.delete("view");
      shouldReplace = true;
    }

    if (requestedLayout === null && searchParams.get("layout")) {
      params.delete("layout");
      shouldReplace = true;
    }

    const activeUnitInView =
      requestedUnitId && filteredByView.some((unit) => unit.id === requestedUnitId)
        ? requestedUnitId
        : null;
    const fallbackUnitId = activeUnitInView ?? filteredByView[0]?.id ?? gospelHarmonyUnits[0]?.id;

    if (fallbackUnitId && searchParams.get("unit") !== fallbackUnitId) {
      params.set("unit", fallbackUnitId);
      shouldReplace = true;
    }

    if (activeView === "all") {
      if (params.has("view")) {
        params.delete("view");
        shouldReplace = true;
      }
    } else if (searchParams.get("view") !== activeView) {
      params.set("view", activeView);
      shouldReplace = true;
    }

    if (activeLayout === "parallel") {
      if (params.has("layout")) {
        params.delete("layout");
        shouldReplace = true;
      }
    } else if (searchParams.get("layout") !== activeLayout) {
      params.set("layout", activeLayout);
      shouldReplace = true;
    }

    if (!shouldReplace) {
      return;
    }

    const query = params.toString();
    const hash = getCurrentHash();
    router.replace(query ? `${pathname}?${query}${hash}` : `${pathname}${hash}`, { scroll: false });
  }, [
    activeLayout,
    activeView,
    filteredByView,
    pathname,
    requestedLayout,
    requestedUnitId,
    requestedView,
    router,
    searchParams,
  ]);

  function replaceQuery(options: {
    layout?: GospelHarmonyLayout;
    unitId?: string;
    view?: GospelHarmonyView;
  }) {
    const params = new URLSearchParams(searchParams.toString());
    const nextView = options.view ?? activeView;
    const nextLayout = options.layout ?? activeLayout;
    const nextUnitId = options.unitId;

    if (nextView === "all") {
      params.delete("view");
    } else {
      params.set("view", nextView);
    }

    if (nextUnitId) {
      params.set("unit", nextUnitId);
    }

    if (nextLayout === "parallel") {
      params.delete("layout");
    } else {
      params.set("layout", nextLayout);
    }

    const query = params.toString();
    const hash = getCurrentHash();
    router.replace(query ? `${pathname}?${query}${hash}` : `${pathname}${hash}`, { scroll: false });
  }

  function handleViewChange(nextView: GospelHarmonyView) {
    const nextUnits = gospelHarmonyUnits.filter((unit) => matchesView(unit, nextView));
    replaceQuery({ unitId: nextUnits[0]?.id, view: nextView });
  }

  function handleSelectUnit(unitId: string) {
    replaceQuery({ unitId });
  }

  function handleLayoutChange(nextLayout: GospelHarmonyLayout) {
    replaceQuery({ layout: nextLayout });
  }

  function handleOpenPreview(target: PassagePreviewTarget, triggerElement: HTMLElement) {
    previewReturnFocusRef.current = triggerElement;
    setPreviewTarget(target);
  }

  function restorePreviewFocus() {
    const returnElement = previewReturnFocusRef.current;
    previewReturnFocusRef.current = null;

    window.requestAnimationFrame(() => {
      if (
        returnElement &&
        document.contains(returnElement) &&
        typeof returnElement.focus === "function"
      ) {
        returnElement.focus();
      }
    });
  }

  function handleClosePreview() {
    setPreviewTarget(null);
    restorePreviewFocus();
  }

  if (!selectedUnit) {
    return null;
  }

  return (
    <section className="flex flex-col gap-8 py-12 sm:py-16">
      <div className="flex max-w-4xl flex-col gap-3">
        <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
          {copy.eyebrow}
        </p>
        <h1 className="text-3xl font-semibold text-zinc-950 sm:text-4xl">{copy.title}</h1>
        <p className="text-base leading-7 text-zinc-600">{copy.description}</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)] 2xl:grid-cols-[280px_minmax(0,1fr)]">
        <GospelHarmonyNavigator
          activeView={activeView}
          copy={copy}
          groupedSections={groupedSections}
          key={`${activeView}:${selectedUnit.section}:${searchQuery.trim() ? "search" : "browse"}`}
          locale={locale}
          onSearchChange={setSearchQuery}
          onSelectUnit={handleSelectUnit}
          onViewChange={handleViewChange}
          searchQuery={searchQuery}
          selectedSection={selectedUnit.section}
          selectedUnitId={selectedUnit.id}
          totalVisibleUnits={filteredUnits.length}
          viewCounts={viewCounts}
        />

        <div className="flex min-w-0 flex-col gap-4">
          {displayUnit ? (
            <>
              <div className="flex flex-col gap-3 rounded-md border border-zinc-200 bg-white p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex min-w-0 flex-col gap-3">
                    <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
                      {copy.parallelPassages}
                    </p>
                    <h2 className="text-2xl font-semibold text-zinc-950">{displayUnit.title[locale]}</h2>
                  </div>
                  <div className="flex flex-col gap-2 lg:items-end">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
                      {copy.layoutLabel}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          ["parallel", copy.layoutParallel],
                          ["stacked", copy.layoutStacked],
                        ] as const
                      ).map(([layout, label]) => {
                        const active = activeLayout === layout;

                        return (
                          <button
                            aria-pressed={active}
                            className={cn(
                              "rounded-md border px-3 py-2 text-sm font-semibold transition-colors",
                              active
                                ? "border-zinc-950 bg-zinc-950 text-white"
                                : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100",
                            )}
                            key={layout}
                            onClick={() => handleLayoutChange(layout)}
                            type="button"
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <InfoCard label={copy.classification} value={displayUnit.category[locale]} />
                  <InfoCard
                    label={copy.tags}
                    value={
                      <div className="flex flex-wrap gap-1.5">
                        {displayUnit.kinds.map((kind) => (
                          <span
                            className="rounded-full border border-zinc-200 px-2 py-0.5 text-xs font-semibold text-zinc-600"
                            key={kind}
                          >
                            {gospelHarmonyKindLabels[kind][locale]}
                          </span>
                        ))}
                      </div>
                    }
                  />
                  <InfoCard
                    label={copy.coverage}
                    value={
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-zinc-900">
                          {formatCoverageLabel(displayUnit, locale)}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {formatCoverageDetail(displayUnit, locale)}
                        </span>
                      </div>
                    }
                  />
                </div>
              </div>

              {activeLayout === "parallel" ? (
                <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 lg:hidden">
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
                      {copy.mobileRecordedAccounts}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {visibleBooks.map((book) => {
                        const active = mobileActiveColumn === book;

                        return (
                          <button
                            aria-pressed={active}
                            className={cn(
                              "rounded-md border px-3 py-2 text-sm font-semibold transition-colors",
                              active
                                ? "border-zinc-950 bg-zinc-950 text-white"
                                : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100",
                            )}
                            key={book}
                            onClick={() => setOpenMobileColumn(book)}
                            type="button"
                          >
                            {gospelHarmonyBookLabels[book][locale]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className={activeLayout === "stacked" ? "flex flex-col gap-3" : getParallelGridClass(visibleBooks.length)}>
                {visibleBooks.map((column) => (
                  <HarmonyColumn
                    bookCount={visibleBooks.length}
                    column={column}
                    copy={copy}
                    isMobileOpen={activeLayout === "stacked" ? true : mobileActiveColumn === column}
                    key={column}
                    layout={activeLayout}
                    locale={locale}
                    onPreview={handleOpenPreview}
                    passage={displayUnit.passages[column]}
                    translation={translation}
                  />
                ))}
              </div>

              <HarmonyRelatedPassages
                copy={copy}
                key={`${displayUnit.id}-${activeView}-${activeLayout}`}
                locale={locale}
                onPreview={handleOpenPreview}
                translation={translation}
                unit={displayUnit}
              />
            </>
          ) : (
            <section className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-5 py-10 text-sm text-zinc-600">
              {copy.searchEmpty}
            </section>
          )}
        </div>
      </div>

      {previewTarget ? (
        <CrossReferencePassagePreviewModal
          cache={previewCache}
          copy={copy}
          onCacheChange={setPreviewCache}
          onClose={handleClosePreview}
          returnFocusRef={previewReturnFocusRef}
          target={previewTarget}
          translation={translation}
        />
      ) : null}
    </section>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">{label}</p>
      <div className="text-sm leading-6 text-zinc-700">{value}</div>
    </div>
  );
}

type HarmonyRelatedPassageGroup = {
  attribution: CrossReferenceAttribution | null;
  column: GospelHarmonyBook;
  items: CrossReferenceItem[];
  passage: GospelHarmonyPassage;
};

type HarmonyRelatedPassageResult =
  | { group: HarmonyRelatedPassageGroup; ok: true }
  | { column: GospelHarmonyBook; ok: false };

function HarmonyRelatedPassages({
  copy,
  locale,
  onPreview,
  translation,
  unit,
}: {
  copy: (typeof gospelHarmonyCopy)["en"];
  locale: "en" | "ko";
  onPreview: (target: PassagePreviewTarget, triggerElement: HTMLElement) => void;
  translation: string;
  unit: GospelHarmonyUnit;
}) {
  const [groups, setGroups] = useState<HarmonyRelatedPassageGroup[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPartialError, setHasPartialError] = useState(false);
  const passages = relatedGospelColumns
    .map((column) => ({ column, passage: unit.passages[column] }))
    .filter(
      (entry): entry is { column: GospelHarmonyBook; passage: GospelHarmonyPassage } =>
        Boolean(entry.passage),
    );
  const visibleGroups = groups?.filter((group) => group.items.length > 0) ?? [];

  async function handleLoadRelatedPassages() {
    if (passages.length === 0) {
      setGroups([]);
      setHasPartialError(false);
      return;
    }

    setIsLoading(true);
    setHasPartialError(false);
    setGroups(null);

    const results: HarmonyRelatedPassageResult[] = await Promise.all(
      passages.map(async ({ column, passage }) => {
        try {
          const response = await getCrossReferences({
            book: passage.book,
            chapter: passage.startChapter,
            page: 1,
            perPage: RELATED_PASSAGES_PER_ACCOUNT,
            verse: passage.startVerse,
          });

          return {
            group: {
              attribution: response.attribution,
              column,
              items: response.items.slice(0, RELATED_PASSAGES_PER_ACCOUNT),
              passage,
            },
            ok: true,
          };
        } catch {
          return { column, ok: false };
        }
      }),
    );

    setGroups(
      results
        .filter(
          (
            result,
          ): result is {
            group: HarmonyRelatedPassageGroup;
            ok: true;
          } => result.ok,
        )
        .map((result) => result.group),
    );
    setHasPartialError(results.some((result) => !result.ok));
    setIsLoading(false);
  }

  return (
    <section className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
            {copy.relatedPassages}
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            {copy.relatedPassagesDescription}
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">{copy.relatedPassagesMvpNote}</p>
        </div>
        <button
          className="shrink-0 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:text-zinc-400"
          disabled={isLoading}
          onClick={handleLoadRelatedPassages}
          type="button"
        >
          {isLoading ? copy.loadingRelatedPassages : copy.loadRelatedPassages}
        </button>
      </div>

      {hasPartialError ? (
        <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          {copy.relatedPassagesError}
        </p>
      ) : null}

      {groups && visibleGroups.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-600">{copy.relatedPassagesEmpty}</p>
      ) : null}

      {visibleGroups.length > 0 ? (
        <div className="mt-4 flex flex-col gap-4">
          {visibleGroups.map((group) => (
            <section
              className="rounded-md border border-zinc-200 bg-white p-3"
              key={`${unit.id}-${group.column}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-zinc-950">
                  {gospelHarmonyBookLabels[group.column][locale]}
                </h4>
                <span className="text-xs text-zinc-500">
                  {formatPassage(group.passage, locale)}
                </span>
              </div>
              <ul className="mt-3 flex flex-col gap-2">
                {group.items.map((item, index) => (
                  <CrossReferenceItemCard
                    copy={copy}
                    item={item}
                    key={crossReferenceItemKey(item, index)}
                    locale={locale}
                    onPreview={onPreview}
                    translation={translation}
                  />
                ))}
              </ul>
              {group.attribution ? (
                <p className="mt-3 text-xs leading-5 text-zinc-500">
                  <a
                    className="underline-offset-2 hover:underline"
                    href={group.attribution.source_url}
                  >
                    {group.attribution.attribution}
                  </a>
                </p>
              ) : null}
            </section>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function HarmonyColumn({
  bookCount,
  column,
  copy,
  isMobileOpen,
  layout,
  locale,
  onPreview,
  passage,
  translation,
}: {
  bookCount: number;
  column: GospelHarmonyBook;
  copy: (typeof gospelHarmonyCopy)["en"];
  isMobileOpen: boolean;
  layout: GospelHarmonyLayout;
  locale: "en" | "ko";
  onPreview: (target: PassagePreviewTarget, triggerElement: HTMLElement) => void;
  passage?: GospelHarmonyPassage;
  translation: string;
}) {
  return (
    <section
      className={cn(
        "min-h-40 rounded-md border border-zinc-200 bg-white",
        layout === "parallel" && !isMobileOpen ? "hidden lg:block" : "",
        bookCount === 1 ? "lg:col-span-full" : "",
      )}
    >
      <div className="border-b border-zinc-200 px-3 py-2.5">
        <h3 className="text-lg font-semibold text-zinc-950">
          {gospelHarmonyBookLabels[column][locale]}
        </h3>
      </div>

      <div className="px-3 py-3">
        {passage ? (
          <HarmonyPassageContent
            copy={copy}
            locale={locale}
            onPreview={onPreview}
            passage={passage}
            translation={translation}
          />
        ) : (
          <p className="text-sm text-zinc-600">{copy.noPassage}</p>
        )}
      </div>
    </section>
  );
}

function HarmonyPassageContent({
  copy,
  locale,
  onPreview,
  passage,
  translation,
}: {
  copy: (typeof gospelHarmonyCopy)["en"];
  locale: "en" | "ko";
  onPreview: (target: PassagePreviewTarget, triggerElement: HTMLElement) => void;
  passage: GospelHarmonyPassage;
  translation: string;
}) {
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const passageLabel = formatPassage(passage, locale);
  const readerHref = `/${locale}/bible/${translation}/${passage.book}/${passage.startChapter}?mode=reader#v${passage.startVerse}`;
  const previewTarget = {
    href: readerHref,
    reference: toPreviewReference(passage),
    referenceLabel: passageLabel,
  };

  useEffect(() => {
    let isCurrent = true;

    async function loadPassage() {
      setIsLoading(true);
      setErrorMessage("");
      setVerses([]);

      try {
        const chapter = await getBibleChapter(translation, passage.book, passage.startChapter);
        const selectedVerses = chapter.verses.filter((verse) =>
          isVerseInPassageRange(verse.verse, passage),
        );

        if (isCurrent) {
          setVerses(selectedVerses);
        }
      } catch {
        if (isCurrent) {
          setErrorMessage(copy.error);
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    void loadPassage();

    return () => {
      isCurrent = false;
    };
  }, [copy.error, passage, translation]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-zinc-600">{passageLabel}</p>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <button
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100"
            onClick={(event) => onPreview(previewTarget, event.currentTarget)}
            type="button"
          >
            {copy.viewPassage}
          </button>
          <Link
            aria-label={`${copy.openInReader}: ${passageLabel}`}
            className="rounded-md border border-zinc-200 px-3 py-1.5 text-sm font-semibold text-zinc-700 underline-offset-2 transition-colors hover:bg-zinc-50 hover:underline"
            href={readerHref}
          >
            {copy.openInReader}
          </Link>
        </div>
      </div>

      {renderPassageState({ copy, errorMessage, isLoading, verses })}
    </div>
  );
}

function renderPassageState({
  copy,
  errorMessage,
  isLoading,
  verses,
}: {
  copy: (typeof gospelHarmonyCopy)["en"];
  errorMessage: string;
  isLoading: boolean;
  verses: BibleVerse[];
}) {
  if (isLoading) {
    return <p className="text-sm text-zinc-600">{copy.loading}</p>;
  }

  if (errorMessage) {
    return <p className="text-sm text-red-700">{errorMessage}</p>;
  }

  if (verses.length === 0) {
    return <p className="text-sm text-zinc-600">{copy.noText}</p>;
  }

  return (
      <ol className="flex flex-col gap-2">
      {verses.map((verse) => (
        <li className="text-base leading-7" key={verse.verse}>
          <span className="mr-1 align-super text-[0.7rem] font-semibold text-zinc-500">
            {verse.verse}
          </span>
          <span className="break-words text-zinc-900">{verse.text}</span>
        </li>
      ))}
    </ol>
  );
}

function resolveGospelHarmonyLayout(value: string | null): GospelHarmonyLayout | null {
  if (!value) {
    return null;
  }

  if (value === "parallel" || value === "stacked") {
    return value;
  }

  return null;
}

function getCurrentHash() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.hash || "";
}

function matchesView(unit: GospelHarmonyUnit, view: GospelHarmonyView): boolean {
  switch (view) {
    case "all":
      return true;
    case "parables":
      return unit.kinds.includes("parable");
    case "eschatology":
      return unit.kinds.includes("eschatology");
    case "events":
      return unit.kinds.includes("event");
    case "figurative":
      return unit.kinds.includes("figurative");
    default:
      return true;
  }
}

function buildSearchIndex(unit: GospelHarmonyUnit): string {
  const titles = [unit.title.ko, unit.title.en, unit.category.ko, unit.category.en]
    .map((value) => value.toLowerCase())
    .join(" ");

  const references = gospelHarmonyBooks
    .flatMap((book) => {
      const passage = unit.passages[book];

      if (!passage) {
        return [];
      }

      const bookLabels = gospelHarmonyBookLabels[book];

      return [
        `${bookLabels.ko} ${passage.startChapter}`,
        `${bookLabels.ko.replace("복음", "")} ${passage.startChapter}`,
        `${bookLabels.en.toLowerCase()} ${passage.startChapter}`,
        `${book} ${passage.startChapter}`,
      ];
    })
    .join(" ");

  return `${titles} ${references}`;
}

function getParallelGridClass(bookCount: number): string {
  switch (bookCount) {
    case 1:
      return "grid gap-3";
    case 2:
      return "grid gap-3 lg:grid-cols-2";
    case 3:
      return "grid gap-3 lg:grid-cols-3";
    default:
      return "grid gap-3 lg:grid-cols-2";
  }
}

function formatCoverageLabel(unit: GospelHarmonyUnit, locale: "en" | "ko") {
  const recordCount = getGospelHarmonyRecordCount(unit);

  if (recordCount >= 4) {
    return locale === "ko" ? "4복음서" : "4 Gospels";
  }

  if (recordCount === 3) {
    return locale === "ko" ? "3복음서" : "3 Gospels";
  }

  if (recordCount === 2) {
    return locale === "ko" ? "2복음서" : "2 Gospels";
  }

  return formatCoverageDetail(unit, locale);
}

function formatCoverageDetail(unit: GospelHarmonyUnit, locale: "en" | "ko") {
  const books = getGospelHarmonyRecordBooks(unit);

  if (books.length !== 1) {
    return books.map((book) => gospelHarmonyBookLabels[book][locale]).join(" · ");
  }

  switch (books[0]) {
    case "matthew":
      return locale === "ko" ? "마태복음의 고유 기록" : "Unique to Matthew";
    case "mark":
      return locale === "ko" ? "마가복음의 고유 기록" : "Unique to Mark";
    case "luke":
      return locale === "ko" ? "누가복음의 고유 기록" : "Unique to Luke";
    case "john":
      return locale === "ko" ? "요한복음의 고유 기록" : "Unique to John";
    default:
      return "";
  }
}

function isVerseInPassageRange(verse: number, passage: GospelHarmonyPassage): boolean {
  if (passage.endChapter && passage.endChapter !== passage.startChapter) {
    return verse >= passage.startVerse;
  }

  const endVerse = passage.endVerse ?? passage.startVerse;

  return verse >= passage.startVerse && verse <= endVerse;
}

function formatPassage(passage: GospelHarmonyPassage, locale: "en" | "ko"): string {
  const bookName = gospelHarmonyBookLabels[passage.book][locale];
  const start = `${bookName} ${passage.startChapter}:${passage.startVerse}`;

  if (!passage.endVerse && !passage.endChapter) {
    return start;
  }

  const endChapter = passage.endChapter ?? passage.startChapter;
  const endVerse = passage.endVerse ?? passage.startVerse;

  if (endChapter === passage.startChapter) {
    return `${start}-${endVerse}`;
  }

  return `${start}-${endChapter}:${endVerse}`;
}

function toPreviewReference(passage: GospelHarmonyPassage) {
  return {
    book: passage.book,
    start_chapter: passage.startChapter,
    start_verse: passage.startVerse,
    end_chapter: passage.endChapter ?? null,
    end_verse: passage.endVerse ?? null,
  };
}

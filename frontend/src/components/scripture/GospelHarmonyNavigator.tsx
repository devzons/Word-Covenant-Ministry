"use client";

import { forwardRef, useEffect, useMemo, useRef, useState } from "react";

import {
  gospelHarmonyBookLabels,
  getGospelHarmonyRecordCount,
  gospelHarmonyScopeLabels,
  gospelHarmonySectionLabels,
  gospelHarmonyViewLabels,
  type GospelHarmonyBook,
  type GospelHarmonySection,
  type GospelHarmonyUnit,
  type GospelHarmonyView,
} from "@/data/gospelHarmonyUnits";
import { cn } from "@/lib/utils/cn";

type GospelHarmonyNavigatorCopy = {
  filtersLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchEmpty: string;
  searchResults: string;
  selectUnit: string;
  uniqueSingleRecord: string;
};

type GroupedSection = {
  count: number;
  section: GospelHarmonySection;
  title: string;
  units: GospelHarmonyUnit[];
};

type GospelHarmonyNavigatorProps = {
  activeView: GospelHarmonyView;
  copy: GospelHarmonyNavigatorCopy;
  groupedSections: GroupedSection[];
  locale: "en" | "ko";
  onSearchChange: (value: string) => void;
  onSelectUnit: (unitId: string) => void;
  onViewChange: (view: GospelHarmonyView) => void;
  searchQuery: string;
  selectedSection: GospelHarmonySection;
  selectedUnitId: string | null;
  totalVisibleUnits: number;
  viewCounts: Record<GospelHarmonyView, number>;
};

export function GospelHarmonyNavigator({
  activeView,
  copy,
  groupedSections,
  locale,
  onSearchChange,
  onSelectUnit,
  onViewChange,
  searchQuery,
  selectedSection,
  selectedUnitId,
  totalVisibleUnits,
  viewCounts,
}: GospelHarmonyNavigatorProps) {
  const selectedItemRef = useRef<HTMLButtonElement | null>(null);
  const normalizedSearch = searchQuery.trim();
  const isSearchMode = normalizedSearch.length > 0;
  const [openSection, setOpenSection] = useState<GospelHarmonySection>(selectedSection);
  const flatUnits = useMemo(
    () => groupedSections.flatMap((group) => group.units),
    [groupedSections],
  );

  useEffect(() => {
    if (!selectedItemRef.current) {
      return;
    }

    selectedItemRef.current.scrollIntoView({ block: "nearest" });
  }, [isSearchMode, openSection, selectedUnitId]);

  return (
    <aside className="rounded-md border border-zinc-200 bg-zinc-50 p-4 lg:sticky lg:top-24">
      <div className="flex flex-col gap-5 lg:max-h-[calc(100vh-7rem)] lg:overflow-hidden">
        <div className="flex flex-col gap-5 lg:shrink-0">
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
              {copy.filtersLabel}
            </h2>
            <nav
              aria-label={copy.filtersLabel}
              className="flex flex-wrap gap-2"
            >
              {(Object.keys(gospelHarmonyViewLabels) as GospelHarmonyView[]).map((view) => {
                const active = view === activeView;

                return (
                  <button
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-10 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
                      active
                        ? "border-zinc-950 bg-zinc-950 text-white"
                        : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-100",
                    )}
                    key={view}
                    onClick={() => onViewChange(view)}
                    type="button"
                  >
                    <span>{gospelHarmonyViewLabels[view][locale]}</span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-semibold",
                        active ? "bg-zinc-800 text-zinc-100" : "bg-zinc-100 text-zinc-500",
                      )}
                    >
                      {viewCounts[view]}
                    </span>
                  </button>
                );
              })}
            </nav>
          </section>

          <section className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-700" htmlFor="gospel-harmony-search">
              {copy.searchLabel}
            </label>
            <input
              className="min-h-11 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950/15"
              id="gospel-harmony-search"
              name="gospel-harmony-search"
              placeholder={copy.searchPlaceholder}
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </section>
        </div>

        <section className="flex min-h-0 flex-col gap-4 lg:overflow-hidden">
          <div className="flex items-center justify-between gap-3 lg:shrink-0">
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
              {isSearchMode ? copy.searchResults : copy.selectUnit}
            </h2>
            <span className="text-xs font-semibold text-zinc-500">{totalVisibleUnits}</span>
          </div>

          {totalVisibleUnits === 0 ? (
            <p className="rounded-md border border-dashed border-zinc-300 bg-white px-3 py-4 text-sm text-zinc-600">
              {copy.searchEmpty}
            </p>
          ) : (
            <div className="min-h-0 lg:overflow-y-auto lg:pr-1">
              {isSearchMode ? (
                <ul className="flex flex-col gap-2">
                  {flatUnits.map((unit) => {
                    const active = unit.id === selectedUnitId;

                    return (
                      <li key={unit.id}>
                        <UnitButton
                          active={active}
                          copy={copy}
                          locale={locale}
                          ref={active ? selectedItemRef : null}
                          unit={unit}
                          onSelectUnit={onSelectUnit}
                        />
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="flex flex-col gap-2">
                  {groupedSections.map((group) => {
                    const isOpen = group.section === openSection;
                    const panelId = `gospel-harmony-section-${group.section}`;

                    return (
                      <section className="overflow-hidden rounded-md border border-zinc-200 bg-white" key={group.section}>
                        <button
                          aria-controls={panelId}
                          aria-expanded={isOpen}
                          className={cn(
                            "flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-inset",
                            isOpen ? "bg-zinc-100" : "bg-white hover:bg-zinc-50",
                          )}
                          onClick={() => setOpenSection(group.section)}
                          type="button"
                        >
                          <span className="text-sm font-semibold text-zinc-800">{gospelHarmonySectionLabels[group.section][locale]}</span>
                          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-500">
                            {group.count}
                          </span>
                        </button>

                        {isOpen ? (
                          <div className="border-t border-zinc-200 px-2 py-2" id={panelId}>
                            <ul className="flex flex-col gap-2">
                              {group.units.map((unit) => {
                                const active = unit.id === selectedUnitId;

                                return (
                                  <li key={unit.id}>
                                    <UnitButton
                                      active={active}
                                      copy={copy}
                                      locale={locale}
                                      ref={active ? selectedItemRef : null}
                                      unit={unit}
                                      onSelectUnit={onSelectUnit}
                                    />
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ) : null}
                      </section>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </aside>
  );
}

type UnitButtonProps = {
  active: boolean;
  copy: GospelHarmonyNavigatorCopy;
  locale: "en" | "ko";
  unit: GospelHarmonyUnit;
  onSelectUnit: (unitId: string) => void;
};

const UnitButton = forwardRef<HTMLButtonElement, UnitButtonProps>(function UnitButton(
  { active, copy, locale, unit, onSelectUnit }: UnitButtonProps,
  ref,
) {
  const scope = getScopeCopy(unit, locale);
  const books = getRecordedBookList(unit, locale);

  return (
    <button
      aria-pressed={active}
      className={cn(
        "flex w-full flex-col gap-1 rounded-md border px-3 py-2 text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
        active
          ? "border-zinc-950 bg-zinc-950 text-white"
          : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-100",
      )}
      onClick={() => onSelectUnit(unit.id)}
      ref={ref}
      type="button"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="line-clamp-2 text-sm font-semibold leading-5">{unit.title[locale]}</span>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold",
            active ? "bg-zinc-800 text-zinc-100" : "bg-zinc-100 text-zinc-600",
          )}
        >
          {scope.badge}
        </span>
      </div>
      <p
        className={cn(
          "text-xs leading-5",
          active ? "text-zinc-300" : "text-zinc-500",
        )}
      >
        {books ?? scope.detail ?? copy.uniqueSingleRecord}
      </p>
    </button>
  );
});

function getScopeCopy(unit: GospelHarmonyUnit, locale: "en" | "ko") {
  const recordCount = getGospelHarmonyRecordCount(unit);

  if (recordCount >= 4) {
    return { badge: gospelHarmonyScopeLabels.four[locale], detail: null };
  }

  if (recordCount === 3) {
    return { badge: gospelHarmonyScopeLabels.three[locale], detail: null };
  }

  if (recordCount === 2) {
    return { badge: gospelHarmonyScopeLabels.two[locale], detail: null };
  }

  const book = (Object.keys(unit.passages) as GospelHarmonyBook[]).find((candidate) =>
    Boolean(unit.passages[candidate]),
  );

  if (!book) {
    return { badge: "", detail: null };
  }

  return {
    badge: gospelHarmonyScopeLabels.single[book].badge[locale],
    detail: gospelHarmonyScopeLabels.single[book].detail[locale],
  };
}

function getRecordedBookList(unit: GospelHarmonyUnit, locale: "en" | "ko") {
  const books = (Object.keys(unit.passages) as GospelHarmonyBook[]).filter((candidate) =>
    Boolean(unit.passages[candidate]),
  );

  if (books.length <= 1) {
    return null;
  }

  return books.map((book) => gospelHarmonyBookLabels[book][locale]).join(locale === "ko" ? " · " : " · ");
}

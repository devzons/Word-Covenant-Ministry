"use client";

import {
  getGospelHarmonyRecordCount,
  gospelHarmonyKindLabels,
  gospelHarmonyScopeLabels,
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
  selectedUnitId,
  totalVisibleUnits,
  viewCounts,
}: GospelHarmonyNavigatorProps) {
  return (
    <aside className="flex flex-col gap-5 rounded-md border border-zinc-200 bg-zinc-50 p-4">
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

      <section className="flex min-h-0 flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
            {copy.selectUnit}
          </h2>
          <span className="text-xs font-semibold text-zinc-500">{totalVisibleUnits}</span>
        </div>

        {totalVisibleUnits === 0 ? (
          <p className="rounded-md border border-dashed border-zinc-300 bg-white px-3 py-4 text-sm text-zinc-600">
            {copy.searchEmpty}
          </p>
        ) : null}

        {groupedSections.map((group) => (
          <section className="flex flex-col gap-2" key={group.section}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-zinc-800">{group.title}</h3>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-zinc-500">
                {group.count}
              </span>
            </div>
            <ul className="flex flex-col gap-2">
              {group.units.map((unit) => {
                const active = unit.id === selectedUnitId;
                const scope = getScopeCopy(unit, locale);

                return (
                  <li key={unit.id}>
                    <button
                      aria-pressed={active}
                      className={cn(
                        "flex w-full flex-col gap-2 rounded-md border px-3 py-3 text-left transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
                        active
                          ? "border-zinc-950 bg-zinc-950 text-white"
                          : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-100",
                      )}
                      onClick={() => onSelectUnit(unit.id)}
                      type="button"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <span className="text-sm font-semibold leading-6">{unit.title[locale]}</span>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                            active ? "bg-zinc-800 text-zinc-100" : "bg-zinc-100 text-zinc-600",
                          )}
                        >
                          {scope.badge}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {unit.kinds.map((kind) => (
                          <span
                            className={cn(
                              "rounded-full border px-2 py-0.5 text-[11px] font-medium",
                              active
                                ? "border-zinc-700 text-zinc-100"
                                : "border-zinc-200 text-zinc-600",
                            )}
                            key={kind}
                          >
                            {gospelHarmonyKindLabels[kind][locale]}
                          </span>
                        ))}
                      </div>
                      {getGospelHarmonyRecordCount(unit) === 1 ? (
                        <p
                          className={cn(
                            "text-xs leading-5",
                            active ? "text-zinc-300" : "text-zinc-500",
                          )}
                        >
                          {scope.detail ?? copy.uniqueSingleRecord}
                        </p>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </section>
    </aside>
  );
}

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

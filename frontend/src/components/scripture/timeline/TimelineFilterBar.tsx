"use client";

import type { ReactNode } from "react";

import { TimelineConfidenceBadge } from "./TimelineConfidenceBadge";
import type { TimelineLocale } from "./passionWeekTimeline";

type TimelineFilterLabels = {
  book: string;
  clear: string;
  confidence: string;
  of: string;
  period: string;
  place: string;
  showing: string;
};

type TimelineFilterOption = {
  id: string;
  label: string;
};

type TimelineFilterBarProps = {
  activeBookId: string;
  activePeriodId: string;
  activePlaceId: string;
  bookOptions: TimelineFilterOption[];
  confidenceLabel: string;
  confidenceNote: string;
  labels: TimelineFilterLabels;
  locale: TimelineLocale;
  onBookChange: (bookId: string) => void;
  onClearFilters: () => void;
  onPeriodChange: (periodId: string) => void;
  onPlaceChange: (placeId: string) => void;
  periodOptions: TimelineFilterOption[];
  placeOptions: TimelineFilterOption[];
  previewNote: string;
  showingLabel: string;
  totalCount: number;
  totalLabel: string;
  visibleCount: number;
};

export function TimelineFilterBar({
  activeBookId,
  activePeriodId,
  activePlaceId,
  bookOptions,
  confidenceLabel,
  confidenceNote,
  labels,
  locale,
  onBookChange,
  onClearFilters,
  onPeriodChange,
  onPlaceChange,
  periodOptions,
  placeOptions,
  previewNote,
  showingLabel,
  totalCount,
  totalLabel,
  visibleCount,
}: TimelineFilterBarProps) {
  return (
    <section className="rounded-md border border-zinc-200 bg-zinc-50 p-4 sm:p-5">
      <div className="grid gap-3 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,0.9fr)]">
        <FilterField label={labels.period}>
          <select
            className="min-h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950/10"
            value={activePeriodId}
            onChange={(event) => onPeriodChange(event.target.value)}
          >
            {periodOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </FilterField>

        <FilterField label={labels.book}>
          <select
            className="min-h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950/10"
            value={activeBookId}
            onChange={(event) => onBookChange(event.target.value)}
          >
            {bookOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </FilterField>

        <FilterField label={labels.place}>
          <select
            className="min-h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950/10"
            value={activePlaceId}
            onChange={(event) => onPlaceChange(event.target.value)}
          >
            {placeOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </FilterField>

        <div className="flex min-h-full flex-col justify-between rounded-md border border-zinc-200 bg-white p-3">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
              {labels.confidence}
            </p>
            <TimelineConfidenceBadge label={confidenceLabel} locale={locale} />
            <p className="text-xs leading-5 text-zinc-500">{confidenceNote}</p>
          </div>
          <button
            className="mt-3 inline-flex w-fit items-center rounded-md border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
            onClick={onClearFilters}
            type="button"
          >
            {labels.clear}
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <p className="text-sm leading-6 text-zinc-600">{previewNote}</p>
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
          {locale === "ko"
            ? `${showingLabel} ${visibleCount} / ${totalCount}`
            : `${showingLabel} ${visibleCount} ${totalLabel} ${totalCount}`}
        </p>
      </div>
    </section>
  );
}

type FilterFieldProps = {
  children: ReactNode;
  label: string;
};

function FilterField({ children, label }: FilterFieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
        {label}
      </span>
      {children}
    </label>
  );
}

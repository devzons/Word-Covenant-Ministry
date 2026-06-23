"use client";

import { cn } from "@/lib/utils/cn";

import type { TimelineLocale } from "./passionWeekTimeline";

type TimelineFilterLabels = {
  period: string;
  book: string;
  eventType: string;
  confidence: string;
};

type TimelineFilterBarProps = {
  labels: TimelineFilterLabels;
  locale: TimelineLocale;
};

export function TimelineFilterBar({ labels, locale }: TimelineFilterBarProps) {
  const filters = [
    labels.period,
    labels.book,
    labels.eventType,
    labels.confidence,
  ];

  return (
    <div
      aria-label={locale === "ko" ? "필터" : "Filters"}
      className="flex flex-wrap gap-2"
    >
      {filters.map((filter) => (
        <button
          className={cn(
            "inline-flex min-h-9 items-center rounded-full border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-500",
            "cursor-not-allowed opacity-80",
          )}
          disabled
          key={filter}
          type="button"
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

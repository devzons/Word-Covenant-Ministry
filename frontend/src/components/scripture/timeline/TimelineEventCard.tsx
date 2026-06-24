"use client";

import { cn } from "@/lib/utils/cn";

import { TimelineConfidenceBadge } from "./TimelineConfidenceBadge";
import {
  getTimelineBook,
  getTimelinePeriod,
  getTimelinePlace,
  getTimelineText,
} from "./passionWeekTimeline";
import type { PassionWeekTimelineEvent, TimelineLocale } from "./passionWeekTimeline";

type TimelineEventCardProps = {
  event: PassionWeekTimelineEvent;
  locale: TimelineLocale;
  onSelect: (eventId: string) => void;
  selected: boolean;
};

export function TimelineEventCard({
  event,
  locale,
  onSelect,
  selected,
}: TimelineEventCardProps) {
  const primaryBook = getTimelineBook(event.primaryBookId);
  const period = getTimelinePeriod(event.periodId);
  const periodLabel = period ? getTimelineText(period.label, locale) : "";
  const placeLabels = event.placeIds
    .map((placeId) => getTimelinePlace(placeId))
    .filter((place): place is NonNullable<typeof place> => Boolean(place))
    .map((place) => getTimelineText(place.label, locale));

  return (
    <li className="relative">
      <span
        aria-hidden="true"
        className={cn(
          "absolute -left-[1.375rem] top-4 h-3 w-3 rounded-full border-2 border-white",
          selected ? "bg-zinc-950" : "bg-zinc-300",
        )}
      />
      <button
        className={cn(
          "w-full rounded-md border bg-white p-4 text-left transition-colors sm:p-5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
          selected
            ? "border-zinc-950 bg-zinc-50 shadow-sm ring-1 ring-zinc-950"
            : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50",
        )}
        aria-pressed={selected}
        onClick={() => onSelect(event.id)}
        type="button"
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold leading-none text-zinc-700">
              {locale === "ko" ? "성경 근거" : "Scripture Anchor"}
            </span>
            <span className="inline-flex rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium leading-none text-zinc-700">
              {getTimelineText(event.scriptureAnchors[0]?.label ?? event.summary, locale)}
            </span>
            {selected ? (
              <span className="inline-flex rounded-full border border-zinc-900 bg-zinc-950 px-2.5 py-1 text-[11px] font-semibold leading-none text-white">
                {locale === "ko" ? "선택됨" : "Selected"}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-zinc-950">
                {getTimelineText(event.title, locale)}
              </h3>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                {getTimelineText(event.summary, locale)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <TimelineConfidenceBadge
                label={getTimelineText(event.confidenceLevel, locale)}
                locale={locale}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-medium text-zinc-600">
            {periodLabel ? (
              <span className="rounded-full bg-zinc-100 px-2.5 py-1">{periodLabel}</span>
            ) : null}
            {primaryBook ? (
              <span className="rounded-full bg-zinc-100 px-2.5 py-1">
                {getTimelineText(primaryBook.label, locale)}
              </span>
            ) : null}
            {placeLabels.slice(0, 2).map((placeLabel) => (
              <span className="rounded-full bg-zinc-100 px-2.5 py-1" key={placeLabel}>
                {placeLabel}
              </span>
            ))}
            <span className="rounded-full bg-zinc-100 px-2.5 py-1">
              {getTimelineText(event.eventType, locale)}
            </span>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1">
              {getTimelineText(event.sequenceLabel, locale)}
            </span>
            {event.durationLabel ? (
              <span className="rounded-full bg-zinc-100 px-2.5 py-1">
                {getTimelineText(event.durationLabel, locale)}
              </span>
            ) : null}
          </div>

          <p className="text-xs leading-5 text-zinc-500">
            {getTimelineText(event.locationNote, locale)}
          </p>
        </div>
      </button>
    </li>
  );
}

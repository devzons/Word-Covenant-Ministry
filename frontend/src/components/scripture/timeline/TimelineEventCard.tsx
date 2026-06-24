"use client";

import { cn } from "@/lib/utils/cn";

import { TimelineConfidenceBadge } from "./TimelineConfidenceBadge";
import { TimelineDatingNote } from "./TimelineDatingNote";
import { getTimelineText, type PassionWeekTimelineEvent, type TimelineLocale } from "./passionWeekTimeline";

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
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-zinc-950">
                {getTimelineText(event.title, locale)}
              </h3>
              <p className="mt-1 text-sm text-zinc-600">
                {getTimelineText(event.scriptureAnchor, locale)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {selected ? (
                <span className="inline-flex rounded-full border border-zinc-900 bg-zinc-950 px-2.5 py-1 text-[11px] font-semibold leading-none text-white">
                  {locale === "ko" ? "선택됨" : "Selected"}
                </span>
              ) : null}
              <TimelineConfidenceBadge
                label={getTimelineText(event.confidenceLabel, locale)}
                locale={locale}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-medium text-zinc-600">
            <span className="rounded-full bg-zinc-100 px-2.5 py-1">{getTimelineText(event.period, locale)}</span>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1">{getTimelineText(event.eventType, locale)}</span>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1">{getTimelineText(event.sequenceLabel, locale)}</span>
          </div>

          <TimelineDatingNote
            label={getTimelineText(event.datingMode, locale)}
            locale={locale}
            note={getTimelineText(event.datingNote, locale)}
          />
        </div>
      </button>
    </li>
  );
}

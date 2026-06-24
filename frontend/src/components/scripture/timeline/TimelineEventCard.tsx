"use client";

import { cn } from "@/lib/utils/cn";

import { TimelineConfidenceBadge } from "./TimelineConfidenceBadge";
import {
  getTimelineDatePreview,
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
  const datePreview = getTimelineDatePreview(event);
  const relativeYearLabel = event.relativeYearLabel ? getTimelineText(event.relativeYearLabel, locale) : "";
  const peopleLabels = event.people.map((person) => getTimelineText(person, locale));
  const placeLabels = event.placeIds
    .map((placeId) => getTimelinePlace(placeId))
    .filter((place): place is NonNullable<typeof place> => Boolean(place))
    .map((place) => getTimelineText(place.label, locale));
  const kingdomLabels = event.kingdomTags?.map((tag) => getTimelineText(tag, locale)) ?? [];
  const empireLabels = event.empireTags?.map((tag) => getTimelineText(tag, locale)) ?? [];
  const rulerLabels = event.rulerTags?.map((tag) => getTimelineText(tag, locale)) ?? [];
  const prophetLabels = event.prophetTags?.map((tag) => getTimelineText(tag, locale)) ?? [];

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
          "w-full cursor-pointer rounded-md border bg-white px-3.5 py-3 text-left transition-colors sm:px-4 sm:py-3.5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
          selected
            ? "border-zinc-950 bg-zinc-50 shadow-sm ring-1 ring-zinc-950"
            : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50",
        )}
        aria-pressed={selected}
        onClick={() => onSelect(event.id)}
        type="button"
      >
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-wrap items-start gap-3">
            <div className="flex min-w-[6.25rem] flex-col gap-1">
              <span className="inline-flex min-h-8 items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold leading-none text-zinc-700">
                {getTimelineText(datePreview.dateLabel, locale)}
              </span>
              {relativeYearLabel ? (
                <span className="text-[11px] font-medium leading-4 text-zinc-500">
                  {relativeYearLabel}
                </span>
              ) : null}
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold leading-none text-zinc-700">
                  {locale === "ko" ? "성경 근거" : "Scripture Anchor"}
                </span>
                {event.scriptureAnchors.map((anchor) => (
                  <span
                    className="inline-flex rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium leading-none text-zinc-700"
                    key={`${event.id}-${anchor.label.en}-${anchor.reader.book}-${anchor.reader.chapter}-${anchor.reader.verse}`}
                  >
                    {getTimelineText(anchor.label, locale)}
                  </span>
                ))}
                {selected ? (
                  <span className="inline-flex rounded-full border border-zinc-900 bg-zinc-950 px-2.5 py-1 text-[11px] font-semibold leading-none text-white">
                    {locale === "ko" ? "선택됨" : "Selected"}
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap items-start justify-between gap-2.5">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-zinc-950 sm:text-[15px]">
                    {getTimelineText(event.title, locale)}
                  </h3>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <TimelineConfidenceBadge
                    label={getTimelineText(event.confidenceLevel, locale)}
                    locale={locale}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-medium text-zinc-600">
                {peopleLabels.slice(0, 3).map((peopleLabel) => (
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1" key={peopleLabel}>
                    {peopleLabel}
                  </span>
                ))}
                {placeLabels.slice(0, 2).map((placeLabel) => (
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1" key={placeLabel}>
                    {placeLabel}
                  </span>
                ))}
                <span className="rounded-full bg-zinc-100 px-2.5 py-1">
                  {getTimelineText(event.eventType, locale)}
                </span>
              </div>

              {kingdomLabels.length || empireLabels.length || rulerLabels.length || prophetLabels.length ? (
                <div className="flex flex-wrap gap-2 text-[11px] font-medium text-zinc-600">
                  {kingdomLabels.map((label) => (
                    <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1" key={`kingdom-${event.id}-${label}`}>
                      {label}
                    </span>
                  ))}
                  {empireLabels.map((label) => (
                    <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1" key={`empire-${event.id}-${label}`}>
                      {label}
                    </span>
                  ))}
                  {rulerLabels.map((label) => (
                    <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1" key={`ruler-${event.id}-${label}`}>
                      {label}
                    </span>
                  ))}
                  {prophetLabels.map((label) => (
                    <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1" key={`prophet-${event.id}-${label}`}>
                      {label}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </button>
    </li>
  );
}

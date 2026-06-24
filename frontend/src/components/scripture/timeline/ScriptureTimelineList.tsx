"use client";

import {
  getTimelineText,
  timelinePeriods,
  type PassionWeekTimelineEvent,
  type TimelineLocale,
} from "./passionWeekTimeline";
import { TimelineEventCard } from "./TimelineEventCard";

type ScriptureTimelineListProps = {
  events: PassionWeekTimelineEvent[];
  locale: TimelineLocale;
  onSelect: (eventId: string) => void;
  selectedEventId: string;
};

export function ScriptureTimelineList({
  events,
  locale,
  onSelect,
  selectedEventId,
}: ScriptureTimelineListProps) {
  const groupedEvents = timelinePeriods
    .map((period) => ({
      events: events.filter((event) => event.periodId === period.id),
      period,
    }))
    .filter((group) => group.events.length > 0);

  if (!groupedEvents.length) {
    return (
      <div className="rounded-md border border-dashed border-zinc-200 bg-white p-5 text-sm leading-6 text-zinc-600">
        {locale === "ko"
          ? "필터를 넓혀 더 많은 사건 미리보기를 보세요."
          : "Widen the filters to reveal more preview events."}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {groupedEvents.map(({ events: periodEvents, period }) => {
        const periodLabel = getTimelineText(period.label, locale);

        return (
          <section className="space-y-3" key={period.id}>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div className="space-y-1">
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
                  {periodLabel}
                </p>
                <p className="text-xs text-zinc-500">
                  {locale === "ko"
                    ? `${periodEvents.length}개 사건`
                    : `${periodEvents.length} events`}
                </p>
              </div>
            </div>

            <ol className="flex flex-col gap-3 border-l border-zinc-200 pl-5">
              {periodEvents.map((event) => (
                <TimelineEventCard
                  event={event}
                  key={event.id}
                  locale={locale}
                  onSelect={onSelect}
                  selected={selectedEventId === event.id}
                />
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}

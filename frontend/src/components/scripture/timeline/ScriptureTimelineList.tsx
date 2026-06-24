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
  activePeriodId: string;
  searchTerm: string;
  locale: TimelineLocale;
  onSelect: (eventId: string) => void;
  selectedEventId: string;
};

export function ScriptureTimelineList({
  activePeriodId,
  events,
  locale,
  searchTerm,
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

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const shouldOpenAllMatchingGroups = Boolean(normalizedSearchTerm);

  return (
    <div className="flex flex-col gap-5">
      {groupedEvents.map(({ events: periodEvents, period }, index) => {
        const periodLabel = getTimelineText(period.label, locale);
        const hasRelativeYears = periodEvents.some((event) => Boolean(event.relativeYearLabel));
        const selectedInGroup = periodEvents.some((event) => event.id === selectedEventId);
        const defaultOpen =
          activePeriodId === period.id ||
          selectedInGroup ||
          (activePeriodId === "all" && (shouldOpenAllMatchingGroups || index === 0));
        const summaryText = locale === "ko"
          ? `${periodEvents.length}개 · ${hasRelativeYears ? "성경 내부 연수 포함" : "연대표"}`
          : `${periodEvents.length} events · ${hasRelativeYears ? "Includes Scripture-derived years" : "Timeline section"}`;

        return (
          <details className="group rounded-xl border border-zinc-200 bg-white" key={period.id} open={defaultOpen}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-600">
                  {periodLabel}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{summaryText}</p>
              </div>
              <span className="inline-flex min-h-8 items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold leading-none text-zinc-700">
                {locale === "ko"
                  ? `${periodEvents.length}개 사건`
                  : `${periodEvents.length} events`}
              </span>
            </summary>

            <div className="px-4 pb-4">
              <ol className="flex flex-col gap-2.5 border-l-2 border-zinc-200 pl-6">
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
            </div>
          </details>
        );
      })}
    </div>
  );
}

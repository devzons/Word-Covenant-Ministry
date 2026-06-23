"use client";

import type { PassionWeekTimelineEvent, TimelineLocale } from "./passionWeekTimeline";
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
  return (
    <ol className="flex flex-col gap-3 border-l border-zinc-200 pl-5">
      {events.map((event) => (
        <TimelineEventCard
          event={event}
          key={event.id}
          locale={locale}
          onSelect={onSelect}
          selected={selectedEventId === event.id}
        />
      ))}
    </ol>
  );
}

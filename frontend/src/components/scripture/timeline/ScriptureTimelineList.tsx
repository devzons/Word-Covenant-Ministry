"use client";

import {
  getTimelineText,
  timelinePeriods,
  type PassionWeekTimelineEvent,
  type TimelineLocale,
} from "./passionWeekTimeline";
import { TimelineEventCard } from "./TimelineEventCard";
import {
  createTimelineHighlightItemKey,
  createTimelineHighlightSectionKey,
  type TimelineHighlightLookup,
} from "./timelineHighlightState";

type ScriptureTimelineListProps = {
  events: PassionWeekTimelineEvent[];
  activePeriodId: string;
  highlightLookup?: TimelineHighlightLookup;
  searchTerm: string;
  locale: TimelineLocale;
  onSelect: (eventId: string) => void;
  selectedEventId: string;
};

export function ScriptureTimelineList({
  activePeriodId,
  events,
  highlightLookup,
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
        const historyPlaceholderTitle = locale === "ko" ? "한국사 참조" : "Korean History Reference";
        const historyPlaceholderBody =
          locale === "ko"
            ? "이 구간의 한국사 참조는 아직 추가되지 않았습니다. 한국사 정보는 성경 해석의 근거가 아니라, 시대 배경 감각을 돕는 보조 참조로만 제공될 예정입니다."
            : "Korean history references for this period have not been added yet. They will be provided only as supporting historical context, not as a basis for interpreting Scripture.";

        return (
          <details
            className={[
              "group rounded-xl border bg-white",
              highlightLookup?.highlightedSections.has(
                createTimelineHighlightSectionKey("events", period.id),
              )
                ? "border-emerald-300 bg-emerald-50/40"
                : "border-zinc-200",
            ].join(" ")}
            key={period.id}
            open={defaultOpen}
          >
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
                    highlight={
                      highlightLookup?.highlightedItems.get(
                        createTimelineHighlightItemKey("event", event.id),
                      ) ?? null
                    }
                    highlightedBookIds={highlightLookup?.highlightedBookIds}
                    key={event.id}
                    locale={locale}
                    onSelect={onSelect}
                    selected={selectedEventId === event.id}
                  />
                ))}
              </ol>

              <details className="mt-4 rounded-lg border border-dashed border-zinc-200 bg-zinc-50/60 px-3 py-2.5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-500">
                      {historyPlaceholderTitle}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      {locale === "ko"
                        ? "참조용 / 성경 해석 근거 아님"
                        : "Reference only / not a basis for biblical interpretation"}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 rounded-full border border-zinc-200 bg-white/80 px-2 py-0.5 text-[11px] font-medium text-zinc-500">
                    {locale === "ko" ? "접기/펼치기" : "Toggle"}
                  </span>
                </summary>

                <div className="mt-3 rounded-md border border-zinc-200 bg-white/90 p-3">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-semibold text-zinc-600">
                      {locale === "ko" ? "참조용" : "Reference only"}
                    </span>
                    <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-semibold text-zinc-600">
                      {locale === "ko" ? "출처 검토 필요" : "Source review required"}
                    </span>
                    <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-semibold text-zinc-600">
                      {locale === "ko" ? "성경 해석 근거 아님" : "Not a basis for biblical interpretation"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">{historyPlaceholderBody}</p>
                  <p className="mt-2 text-xs leading-5 text-zinc-500">
                    {locale === "ko"
                      ? `현재 구간: ${periodLabel}`
                      : `Current period: ${periodLabel}`}
                  </p>
                </div>
              </details>
            </div>
          </details>
        );
      })}
    </div>
  );
}

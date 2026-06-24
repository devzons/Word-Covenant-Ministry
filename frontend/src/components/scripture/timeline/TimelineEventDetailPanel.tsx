"use client";

import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

import {
  getTimelineText,
  type PassionWeekTimelineEvent,
  type TimelineLocale,
} from "./passionWeekTimeline";
import { TimelineConfidenceBadge } from "./TimelineConfidenceBadge";
import { TimelineDatingNote } from "./TimelineDatingNote";

type TimelineEventDetailPanelProps = {
  event?: PassionWeekTimelineEvent;
  locale: TimelineLocale;
  noSelection: string;
  openInReaderLabel: string;
  readerHref: string;
  relatedStudy: string;
};

export function TimelineEventDetailPanel({
  event,
  locale,
  noSelection,
  openInReaderLabel,
  readerHref,
  relatedStudy,
}: TimelineEventDetailPanelProps) {
  return (
    <Card className="flex min-w-0 flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
          {locale === "ko" ? "선택한 사건의 성경 문맥" : "Selected Event Scripture Context"}
        </p>
        {!event ? (
          <p className="text-base leading-7 text-zinc-600">{noSelection}</p>
        ) : (
          <DetailSection
            label={locale === "ko" ? "성경 근거" : "Scripture Anchor"}
            value={getTimelineText(event.scriptureAnchor, locale)}
          />
        )}
      </div>

      {event ? (
        <>
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-zinc-950">
              {getTimelineText(event.title, locale)}
            </h2>
            <p className="text-sm text-zinc-600">{getTimelineText(event.period, locale)}</p>
          </div>
          <DetailSection
            label={locale === "ko" ? "사건 요약" : "Event Summary"}
            value={getTimelineText(event.title, locale)}
          />
          <DetailSection
            label={locale === "ko" ? "성경 내부 순서" : "Internal Biblical Sequence"}
            value={getTimelineText(event.sequenceLabel, locale)}
          />
          <div className="flex flex-col gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <TimelineConfidenceBadge
                label={getTimelineText(event.confidenceLabel, locale)}
                locale={locale}
              />
              <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold leading-none text-zinc-700">
                {getTimelineText(event.datingMode, locale)}
              </span>
            </div>
            <TimelineDatingNote
              label={getTimelineText(event.datingMode, locale)}
              locale={locale}
              note={getTimelineText(event.datingNote, locale)}
            />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-zinc-950">
              {locale === "ko" ? "관련 연구 링크" : "Related Study Links"}
            </p>
            <p className="text-sm leading-6 text-zinc-600">{relatedStudy}</p>
            <Link
              className={cn(
                "inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800",
                "w-full sm:w-fit",
              )}
              href={readerHref}
            >
              {openInReaderLabel}
            </Link>
          </div>
        </>
      ) : null}
    </Card>
  );
}

type DetailSectionProps = {
  label: string;
  value: string;
};

function DetailSection({ label, value }: DetailSectionProps) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-zinc-950">{value}</p>
    </div>
  );
}

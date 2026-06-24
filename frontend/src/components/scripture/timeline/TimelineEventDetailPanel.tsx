"use client";

import type { ReactNode } from "react";

import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

import {
  getTimelineBook,
  getTimelinePlace,
  getTimelinePeriod,
  getTimelineReaderHrefFromReader,
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
  selectedLabel: string;
};

export function TimelineEventDetailPanel({
  event,
  locale,
  noSelection,
  openInReaderLabel,
  readerHref,
  relatedStudy,
  selectedLabel,
}: TimelineEventDetailPanelProps) {
  return (
    <Card className="flex min-w-0 flex-col gap-4 sm:gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
          {locale === "ko" ? "선택한 사건의 성경 문맥" : "Selected Event Scripture Context"}
        </p>
        {!event ? (
          <p className="text-base leading-7 text-zinc-600">{noSelection}</p>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full border border-zinc-900 bg-zinc-950 px-2.5 py-1 text-[11px] font-semibold leading-none text-white">
              {selectedLabel}
            </span>
            <span className="inline-flex rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold leading-none text-zinc-700">
              {getTimelinePeriodLabel(event.periodId, locale)}
            </span>
          </div>
        )}
      </div>

      {event ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-zinc-950">
              {getTimelineText(event.title, locale)}
            </h2>
            <p className="text-sm leading-6 text-zinc-600">
              {getTimelineText(event.summary, locale)}
            </p>
          </div>

          <DetailSection label={locale === "ko" ? "성경 근거" : "Scripture Anchor"}>
            <div className="flex flex-wrap gap-2">
              {event.scriptureAnchors.map((anchor) => (
                <Link
                  className={cn(
                    "inline-flex min-h-9 items-center rounded-full border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-900 transition-colors hover:border-zinc-300 hover:bg-zinc-50",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
                  )}
                  href={getTimelineReaderHrefFromReader(anchor.reader, locale)}
                  key={`${anchor.label.en}-${anchor.reader.book}-${anchor.reader.chapter}-${anchor.reader.verse}`}
                >
                  {getTimelineText(anchor.label, locale)}
                </Link>
              ))}
            </div>
          </DetailSection>

          <DetailSection label={locale === "ko" ? "기간 / 책" : "Period / Book"}>
            <div className="flex flex-wrap gap-2">
              <Tag>{getTimelinePeriodLabel(event.periodId, locale)}</Tag>
              {(() => {
                const primaryBook = getTimelineBook(event.primaryBookId);

                return primaryBook ? (
                  <Tag>{getTimelineText(primaryBook.label, locale)}</Tag>
                ) : null;
              })()}
              {event.relatedBookIds.map((bookId) => {
                const book = getTimelineBook(bookId);

                return book ? (
                  <Tag key={book.id}>{getTimelineText(book.label, locale)}</Tag>
                ) : null;
              })}
            </div>
          </DetailSection>

          <DetailSection label={locale === "ko" ? "지명 / 인물" : "Place / People"}>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {event.placeIds.map((placeId) => {
                  const place = getTimelinePlace(placeId);

                  return place ? <Tag key={place.id}>{getTimelineText(place.label, locale)}</Tag> : null;
                })}
              </div>
              <p className="text-sm leading-6 text-zinc-600">
                {getTimelineText(event.locationNote, locale)}
              </p>
              <div className="flex flex-wrap gap-2">
                {event.people.length ? (
                  event.people.map((person) => (
                    <Tag key={`${person.en}-${person.ko}`}>{getTimelineText(person, locale)}</Tag>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">
                    {locale === "ko" ? "특정 인물 없음" : "No named person noted"}
                  </p>
                )}
              </div>
            </div>
          </DetailSection>

          <div className="flex flex-col gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <TimelineConfidenceBadge
                label={getTimelineText(event.confidenceLevel, locale)}
                locale={locale}
              />
              <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold leading-none text-zinc-700">
                {getTimelineText(event.datingNote, locale)}
              </span>
            </div>
            <TimelineDatingNote
              label={locale === "ko" ? "연대 메모" : "Dating Note"}
              locale={locale}
              note={getTimelineText(event.datingNote, locale)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-zinc-950">
              {locale === "ko" ? "읽기에서 열기" : "Open in Reader"}
            </p>
            <p className="text-sm leading-6 text-zinc-600">
              {locale === "ko"
                ? "선택한 성경 근거를 읽기 화면에서 바로 엽니다."
                : "Open the selected Scripture anchor in the Reader."}
            </p>
            <Link
              className={cn(
                "inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800",
                "w-full sm:w-fit",
              )}
              href={readerHref}
            >
              {openInReaderLabel} ↗
            </Link>
            <p className="text-sm leading-6 text-zinc-600">{relatedStudy}</p>
          </div>
        </div>
      ) : null}
    </Card>
  );
}

type DetailSectionProps = {
  children: ReactNode;
  label: string;
};

function DetailSection({ children, label }: DetailSectionProps) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">{label}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

type TagProps = {
  children: ReactNode;
};

function Tag({ children }: TagProps) {
  return (
    <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700">
      {children}
    </span>
  );
}

function getTimelinePeriodLabel(periodId: string, locale: TimelineLocale) {
  if (periodId === "all") {
    return locale === "ko" ? "모든 기간" : "All periods";
  }

  const period = getTimelinePeriod(periodId);

  return period ? getTimelineText(period.label, locale) : "";
}

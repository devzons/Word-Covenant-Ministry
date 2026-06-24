"use client";

import type { ReactNode } from "react";

import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

import {
  getTimelineDatePreview,
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
  const datePreview = event ? getTimelineDatePreview(event) : null;

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
          {(() => {
            const primaryBook = getTimelineBook(event.primaryBookId);

            return (
              <DetailSection label={locale === "ko" ? "성경 문맥" : "Scripture Context"}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <ContextRow
                    label={locale === "ko" ? "정경 위치" : "Canonical Location"}
                    value={getTimelinePeriodLabel(event.periodId, locale)}
                  />
                  <ContextRow
                    label={locale === "ko" ? "역사/배경" : "Historical / Background"}
                    value={getTimelineText(event.sequenceLabel, locale)}
                  />
                  <ContextRow
                    label={locale === "ko" ? "책 문맥" : "Book Context"}
                    value={primaryBook ? getTimelineText(primaryBook.label, locale) : ""}
                  />
                  <ContextRow
                    label={locale === "ko" ? "사건 유형" : "Event Type"}
                    value={getTimelineText(event.eventType, locale)}
                  />
                </div>
              </DetailSection>
            );
          })()}

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

          <DetailSection label={locale === "ko" ? "보조 연대 / 신뢰도" : "Supporting Date / Confidence"}>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Tag>{getTimelineText(datePreview?.dateLabel ?? event.datingNote, locale)}</Tag>
                <Tag>{getTimelineText(datePreview?.dateBasisLabel ?? event.datingNote, locale)}</Tag>
                <Tag>
                  {getTimelineText(datePreview?.dateConfidenceLabel ?? event.confidenceLevel, locale)}
                </Tag>
              </div>
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
          </DetailSection>

          {event.relativeYearLabel ? (
            <DetailSection
              label={locale === "ko" ? "성경 내부 연수" : "Scripture-Derived Relative Year"}
            >
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Tag>{getTimelineText(event.relativeYearLabel, locale)}</Tag>
                  {event.relativeYearBasisLabel ? (
                    <Tag>{getTimelineText(event.relativeYearBasisLabel, locale)}</Tag>
                  ) : null}
                </div>
                {event.relativeYearCalculationNote ? (
                  <p className="text-sm leading-6 text-zinc-600">
                    {getTimelineText(event.relativeYearCalculationNote, locale)}
                  </p>
                ) : null}
              </div>
            </DetailSection>
          ) : null}

          <DetailSection label={locale === "ko" ? "지도 미리보기" : "Map Preview"}>
            <div className="space-y-2">
              <div className="rounded-md border border-dashed border-zinc-200 bg-zinc-50 p-4 text-sm leading-6 text-zinc-600">
                {locale === "ko"
                  ? "지도는 이후 승인 단계에서 확장됩니다. 현재는 지명 칩과 배경 설명이 위치 감각을 보여줍니다."
                  : "Maps expand in a later approved phase. For now, place chips and context notes provide location sense."}
              </div>
              <div className="flex flex-wrap gap-2">
                {event.placeIds.map((placeId) => {
                  const place = getTimelinePlace(placeId);

                  return place ? <Tag key={`map-${place.id}`}>{getTimelineText(place.label, locale)}</Tag> : null;
                })}
              </div>
            </div>
          </DetailSection>

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
            <div className="rounded-md border border-dashed border-zinc-200 bg-white p-3 text-sm leading-6 text-zinc-600">
              <p className="font-medium text-zinc-700">
                {locale === "ko" ? "미래 레이어" : "Future layers"}
              </p>
              <p className="mt-1">
                {locale === "ko"
                  ? "저자 / 책 배경, 언약, 왕국, 열강, 주제, 이름 변형은 다음 단계에서 더 세분화됩니다."
                  : "Authorship / book context, covenant, kingdom, empire, themes, and name variants expand in later phases."}
              </p>
            </div>
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

type ContextRowProps = {
  label: string;
  value: string;
};

function ContextRow({ label, value }: ContextRowProps) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-zinc-800">{value}</p>
    </div>
  );
}

"use client";

import { useState } from "react";

import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";

import {
  getTimelineReaderHref,
  getTimelineText,
  passionWeekTimelineEvents,
  type PassionWeekTimelineEvent,
  type TimelineLocale,
} from "./passionWeekTimeline";
import { TimelineConfidenceBadge } from "./TimelineConfidenceBadge";
import { TimelineDatingNote } from "./TimelineDatingNote";
import { TimelineEventDetailPanel } from "./TimelineEventDetailPanel";
import { TimelineFilterBar } from "./TimelineFilterBar";
import { ScriptureTimelineList } from "./ScriptureTimelineList";
import { TimelineViewTabs } from "./TimelineViewTabs";

type TimelinePageShellProps = {
  locale: TimelineLocale;
};

const pageCopy = {
  en: {
    title: "Scripture Timeline",
    subtitle: "A Scripture-first timeline for following events, sequence, and passage anchors.",
    overlayNote: "World-history overlay is deferred to a later approved phase.",
    viewTabs: [
      { id: "scripture", label: "Scripture Timeline", future: false },
      { id: "people", label: "People", future: true },
      { id: "events", label: "Events", future: true },
      { id: "gospel", label: "Gospel", future: true },
      { id: "kingdoms", label: "Kingdoms / Empires", future: true },
    ],
    filters: {
      period: "Period",
      book: "Book",
      eventType: "Event Type",
      confidence: "Confidence",
    },
    timelineHeading: "Passion Week",
    detailsHeading: "Selected Event Scripture Context",
    noSelection: "Select an event to inspect the Scripture anchor, sequence, and dating note.",
    openInReader: "Open in Reader",
    relatedStudy:
      "Related passages and Gospel Harmony links are deferred to later approved phases.",
    confidenceLabel: "Scripture anchor: High",
    datingLabel: "Dating: Internal biblical sequence",
    datingNote: "External chronology is not shown in this MVP.",
  },
  ko: {
    title: "성경 Timeline",
    subtitle: "성경 본문을 중심으로 사건, 순서, 근거 구절을 따라가는 연구 연표",
    overlayNote: "세계사 Overlay는 이후 승인 단계에서 다룹니다.",
    viewTabs: [
      { id: "scripture", label: "성경 Timeline", future: false },
      { id: "people", label: "인물", future: true },
      { id: "events", label: "사건", future: true },
      { id: "gospel", label: "복음서", future: true },
      { id: "kingdoms", label: "왕국 / 제국", future: true },
    ],
    filters: {
      period: "기간",
      book: "책",
      eventType: "사건 유형",
      confidence: "신뢰도",
    },
    timelineHeading: "수난 주간",
    detailsHeading: "선택한 사건의 성경 문맥",
    noSelection: "성경 근거, 순서, 연대 메모를 보려면 사건을 선택하세요.",
    openInReader: "성경 본문으로 이동",
    relatedStudy: "관련 구절과 복음서 링크는 이후 승인 단계에서 다룹니다.",
    confidenceLabel: "본문 근거: 높음",
    datingLabel: "연대: 성경 내부 순서",
    datingNote: "외부 연대는 이 MVP에서 표시하지 않습니다.",
  },
} as const;

export function TimelinePageShell({ locale }: TimelinePageShellProps) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const copy = pageCopy[activeLocale];
  const [selectedEventId, setSelectedEventId] = useState(passionWeekTimelineEvents[0]?.id ?? "");

  const selectedEvent =
    passionWeekTimelineEvents.find((event) => event.id === selectedEventId) ??
    passionWeekTimelineEvents[0];
  const selectedReaderHref = selectedEvent
    ? getTimelineReaderHref(selectedEvent, activeLocale)
    : "";

  return (
    <Container className="py-12 sm:py-16">
      <section className="flex flex-col gap-8">
        <header className="flex max-w-4xl flex-col gap-3">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
            Word Covenant Ministry
          </p>
          <h1 className="text-3xl font-semibold text-zinc-950 sm:text-4xl">{copy.title}</h1>
          <p className="text-base leading-7 text-zinc-600">{copy.subtitle}</p>
        </header>

        <div className="space-y-4">
          <TimelineViewTabs
            activeTab="scripture"
            locale={activeLocale}
            tabs={copy.viewTabs}
          />
          <TimelineFilterBar locale={activeLocale} labels={copy.filters} />
          <p className="text-sm text-zinc-500">{copy.overlayNote}</p>
        </div>

        <div
          className={cn(
            "grid gap-6",
            "lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]",
            "xl:gap-8",
          )}
        >
          <Card className="flex min-w-0 flex-col gap-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
                  {copy.timelineHeading}
                </p>
                <h2 className="text-xl font-semibold text-zinc-950">
                  {activeLocale === "ko" ? "마태복음 수난 주간" : "Matthew Passion Week"}
                </h2>
              </div>
              <div className="text-right text-xs leading-5 text-zinc-500">
                <TimelineConfidenceBadge locale={activeLocale} label={copy.confidenceLabel} />
                <TimelineDatingNote
                  locale={activeLocale}
                  label={copy.datingLabel}
                  note={copy.datingNote}
                />
              </div>
            </div>

            <TimelineEntryMeta
              locale={activeLocale}
              event={selectedEvent}
            />

            <ScriptureTimelineList
              locale={activeLocale}
              onSelect={setSelectedEventId}
              selectedEventId={selectedEvent?.id ?? ""}
              events={passionWeekTimelineEvents}
            />
          </Card>

          <TimelineEventDetailPanel
            event={selectedEvent}
            locale={activeLocale}
            openInReaderLabel={copy.openInReader}
            noSelection={copy.noSelection}
            readerHref={selectedReaderHref}
            relatedStudy={copy.relatedStudy}
          />
        </div>
      </section>
    </Container>
  );
}

type TimelineEntryMetaProps = {
  event?: PassionWeekTimelineEvent;
  locale: TimelineLocale;
};

function TimelineEntryMeta({ event, locale }: TimelineEntryMetaProps) {
  if (!event) {
    return null;
  }

  return (
    <div className="grid gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-4 sm:grid-cols-2">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
          {locale === "ko" ? "성경 근거" : "Scripture Anchor"}
        </p>
        <p className="text-sm font-semibold text-zinc-950">
          {getTimelineText(event.scriptureAnchor, locale)}
        </p>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
          {locale === "ko" ? "사건 유형" : "Event Type"}
        </p>
        <p className="text-sm font-semibold text-zinc-950">
          {getTimelineText(event.eventType, locale)}
        </p>
      </div>
    </div>
  );
}

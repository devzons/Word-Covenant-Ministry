"use client";

import type { ReactNode } from "react";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

import { TimelineConfidenceBadge } from "./TimelineConfidenceBadge";
import type { TimelineLocale } from "./passionWeekTimeline";

type TimelineFilterLabels = {
  authorship: string;
  book: string;
  clear: string;
  confidence: string;
  covenant: string;
  empire: string;
  future: string;
  of: string;
  period: string;
  people: string;
  place: string;
  prophets: string;
  search: string;
  showing: string;
  theme: string;
  kingdom: string;
};

type TimelineFilterOption = {
  id: string;
  label: string;
};

type TimelineFilterBarProps = {
  activeBookId: string;
  activePeriodId: string;
  activePlaceId: string;
  bookOptions: TimelineFilterOption[];
  confidenceLabel: string;
  confidenceNote: string;
  labels: TimelineFilterLabels;
  locale: TimelineLocale;
  onBookChange: (bookId: string) => void;
  onClearFilters: () => void;
  onPeriodChange: (periodId: string) => void;
  onPlaceChange: (placeId: string) => void;
  onSearchChange: (value: string) => void;
  periodOptions: TimelineFilterOption[];
  placeOptions: TimelineFilterOption[];
  previewNote: string;
  searchTerm: string;
  totalCount: number;
  visibleCount: number;
};

export function TimelineFilterBar({
  activeBookId,
  activePeriodId,
  activePlaceId,
  bookOptions,
  confidenceLabel,
  confidenceNote,
  labels,
  locale,
  onBookChange,
  onClearFilters,
  onPeriodChange,
  onPlaceChange,
  onSearchChange,
  periodOptions,
  placeOptions,
  previewNote,
  searchTerm,
  totalCount,
  visibleCount,
}: TimelineFilterBarProps) {
  return (
    <Card className="flex flex-col gap-5 border-zinc-200 bg-zinc-50 p-4 sm:p-5">
      <div className="space-y-3">
        <div className="space-y-1.5">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
            {locale === "ko" ? "좌측 탐색기" : "Left Sidebar Navigator"}
          </p>
          <p className="text-sm leading-6 text-zinc-600">
            {locale === "ko"
              ? "타임라인 콘텐츠를 페이지를 떠나지 않고 좁혀 보세요."
              : "Narrow Timeline content without leaving the page."}
          </p>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
            {labels.search}
          </span>
          <input
            className={cn(
              "min-h-11 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900",
              "placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950/10",
            )}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={
              locale === "ko"
                ? "사건, 구절, 인물, 지명, 책을 검색"
                : "Search events, passages, people, places, or books"
            }
            value={searchTerm}
          />
        </label>

        <div className="flex flex-wrap gap-2 text-xs font-semibold text-zinc-600">
          <span className="rounded-full bg-white px-3 py-1.5">{`${labels.showing} ${visibleCount} ${
            locale === "ko" ? "/" : labels.of
          } ${totalCount}`}</span>
          <span className="rounded-full bg-white px-3 py-1.5">
            {locale === "ko" ? `기간 ${periodOptions.length - 1}` : `Periods ${periodOptions.length - 1}`}
          </span>
          <span className="rounded-full bg-white px-3 py-1.5">
            {locale === "ko" ? `책 ${bookOptions.length - 1}` : `Books ${bookOptions.length - 1}`}
          </span>
          <span className="rounded-full bg-white px-3 py-1.5">
            {locale === "ko" ? `지명 ${placeOptions.length - 1}` : `Places ${placeOptions.length - 1}`}
          </span>
        </div>

        <div className="flex items-start justify-between gap-3 rounded-md border border-zinc-200 bg-white p-3">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
              {labels.confidence}
            </p>
            <TimelineConfidenceBadge label={confidenceLabel} locale={locale} />
            <p className="text-xs leading-5 text-zinc-500">{confidenceNote}</p>
          </div>
          <button
            className="inline-flex min-h-10 items-center rounded-md border border-zinc-200 px-3 text-xs font-semibold text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
            onClick={onClearFilters}
            type="button"
          >
            {labels.clear}
          </button>
        </div>
      </div>

      <SidebarGroup label={labels.period} locale={locale}>
        <ChipGrid>
          {periodOptions.map((option) => (
            <FilterChip
              active={activePeriodId === option.id}
              key={option.id}
              label={option.label}
              locale={locale}
              onClick={() => onPeriodChange(option.id)}
            />
          ))}
        </ChipGrid>
      </SidebarGroup>

      <SidebarGroup label={labels.book} locale={locale}>
        <ChipGrid>
          {bookOptions.map((option) => (
            <FilterChip
              active={activeBookId === option.id}
              key={option.id}
              label={option.label}
              locale={locale}
              onClick={() => onBookChange(option.id)}
            />
          ))}
        </ChipGrid>
      </SidebarGroup>

      <SidebarGroup label={labels.place} locale={locale}>
        <ChipGrid>
          {placeOptions.map((option) => (
            <FilterChip
              active={activePlaceId === option.id}
              key={option.id}
              label={option.label}
              locale={locale}
              onClick={() => onPlaceChange(option.id)}
            />
          ))}
        </ChipGrid>
      </SidebarGroup>

      <details className="group rounded-md border border-zinc-200 bg-white p-3">
        <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-[0.08em] text-zinc-600">
          {locale === "ko" ? "미래 / 미리보기" : "Future / Preview"}
          <span className="ml-2 text-[11px] font-medium normal-case tracking-normal text-zinc-400">
            {labels.future}
          </span>
        </summary>
        <div className="mt-3 space-y-4">
          <p className="text-sm leading-6 text-zinc-600">
            {locale === "ko"
              ? "인물, 언약, 왕국, 열강, 선지자, 주제, 저자 / 책 배경은 다음 단계에서 확장됩니다."
              : "People, covenant, kingdom, empire, prophets, themes, and authorship / book context expand in later phases."}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {futureLabels(locale).map((label) => (
              <span
                className="inline-flex min-h-10 items-center rounded-md border border-dashed border-zinc-200 bg-zinc-50 px-3 text-sm font-medium text-zinc-500"
                key={label}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </details>

      <div className="space-y-2 rounded-md border border-zinc-200 bg-white p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
          {locale === "ko" ? "미리보기 메모" : "Preview Note"}
        </p>
        <p className="text-sm leading-6 text-zinc-600">{previewNote}</p>
      </div>
    </Card>
  );
}

type SidebarGroupProps = {
  children: ReactNode;
  label: string;
  locale: TimelineLocale;
};

function SidebarGroup({ children, label, locale }: SidebarGroupProps) {
  return (
    <details className="group rounded-md border border-zinc-200 bg-white p-3" open>
      <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-[0.08em] text-zinc-600">
        {label}
        <span className="ml-2 text-[11px] font-medium normal-case tracking-normal text-zinc-400">
          {locale === "ko" ? "필터" : "Filter"}
        </span>
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

function ChipGrid({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

type FilterChipProps = {
  active: boolean;
  label: string;
  locale: TimelineLocale;
  onClick: () => void;
};

function FilterChip({ active, label, locale, onClick }: FilterChipProps) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-10 items-center rounded-md border px-3 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
        active
          ? "border-zinc-950 bg-zinc-950 text-white"
          : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-white",
      )}
      onClick={onClick}
      type="button"
    >
      <span className="max-w-[12rem] truncate">{label}</span>
      {active ? (
        <span className="ml-2 text-[11px] font-semibold uppercase tracking-[0.08em] opacity-80">
          {locale === "ko" ? "선택됨" : "Selected"}
        </span>
      ) : null}
    </button>
  );
}

function futureLabels(locale: TimelineLocale) {
  return locale === "ko"
    ? ["인물", "언약", "왕국", "열강", "선지자", "주제", "저자 / 책 배경"]
    : ["People", "Covenant", "Kingdom", "Empire", "Prophets", "Theme", "Authorship / Book Context"];
}

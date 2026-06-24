"use client";

import type { ReactNode } from "react";

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
  const periodCount = periodOptions.length - 1;
  const bookCount = bookOptions.length - 1;
  const placeCount = placeOptions.length - 1;
  const futureCount = futureLabels(locale).length;

  return (
    <aside className="flex flex-col gap-4 rounded-2xl border border-zinc-200/80 bg-zinc-50 p-4 sm:p-5">
      <div className="space-y-2">
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
        <span className="rounded-full border border-zinc-200 bg-white px-3 py-1.5">
          {`${labels.showing} ${visibleCount} ${locale === "ko" ? "/" : labels.of} ${totalCount}`}
        </span>
        <span className="rounded-full border border-zinc-200 bg-white px-3 py-1.5">
          {locale === "ko" ? `기간 ${periodCount}` : `Periods ${periodCount}`}
        </span>
        <span className="rounded-full border border-zinc-200 bg-white px-3 py-1.5">
          {locale === "ko" ? `책 ${bookCount}` : `Books ${bookCount}`}
        </span>
        <span className="rounded-full border border-zinc-200 bg-white px-3 py-1.5">
          {locale === "ko" ? `지명 ${placeCount}` : `Places ${placeCount}`}
        </span>
      </div>

      <div className="flex items-start justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-3">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
            {labels.confidence}
          </p>
          <TimelineConfidenceBadge label={confidenceLabel} locale={locale} />
          <p className="text-xs leading-5 text-zinc-500">{confidenceNote}</p>
        </div>
        <button
          className="inline-flex min-h-10 items-center rounded-md border border-zinc-200 px-3 text-xs font-semibold text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
          onClick={onClearFilters}
          type="button"
        >
          {labels.clear}
        </button>
      </div>

      <SidebarSection
        count={periodCount}
        defaultOpen
        label={labels.period}
        subtitle={locale === "ko" ? "현재 작동 중" : "Active now"}
      >
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
      </SidebarSection>

      <SidebarSection
        count={bookCount}
        label={labels.book}
        subtitle={locale === "ko" ? "미리보기" : "Preview"}
      >
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
      </SidebarSection>

      <SidebarSection
        count={placeCount}
        label={labels.place}
        subtitle={locale === "ko" ? "미리보기" : "Preview"}
      >
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
      </SidebarSection>

      <SidebarSection
        count={futureCount}
        label={locale === "ko" ? "미래 / 미리보기" : "Future / Preview"}
        subtitle={labels.future}
      >
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
      </SidebarSection>

      <div className="rounded-xl border border-dashed border-zinc-200 bg-white p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
          {locale === "ko" ? "미리보기 메모" : "Preview Note"}
        </p>
        <p className="mt-2 text-sm leading-6 text-zinc-600">{previewNote}</p>
      </div>
    </aside>
  );
}

type SidebarSectionProps = {
  children: ReactNode;
  count: number;
  defaultOpen?: boolean;
  label: string;
  subtitle: string;
};

function SidebarSection({
  children,
  count,
  defaultOpen,
  label,
  subtitle,
}: SidebarSectionProps) {
  return (
    <details className="group rounded-xl border border-zinc-200 bg-white p-3" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-600">
            {label}
          </p>
          <p className="mt-0.5 text-[11px] font-medium tracking-normal text-zinc-400">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-700">
            {count}
          </span>
          <span
            aria-hidden="true"
            className="text-xs font-semibold text-zinc-400 transition-transform duration-200 group-open:rotate-180"
          >
            ▾
          </span>
        </div>
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

type ChipGridProps = {
  children: ReactNode;
};

function ChipGrid({ children }: ChipGridProps) {
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

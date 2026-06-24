"use client";

import { cn } from "@/lib/utils/cn";

import type { TimelineLocale } from "./passionWeekTimeline";

type TimelineViewTab = {
  id: string;
  future: boolean;
  label: string;
};

type TimelineViewTabsProps = {
  activeTab: string;
  locale: TimelineLocale;
  tabs: readonly TimelineViewTab[];
};

export function TimelineViewTabs({ activeTab, locale, tabs }: TimelineViewTabsProps) {
  return (
    <div aria-label={locale === "ko" ? "타임라인 보기" : "Timeline views"} className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const active = tab.id === activeTab;

        return (
          <button
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex min-h-10 items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
              active
                ? "border-zinc-950 bg-zinc-950 text-white"
                : "border-zinc-300 bg-white text-zinc-700",
              tab.future && !active ? "cursor-not-allowed opacity-60" : "",
            )}
            disabled={!active}
            key={tab.id}
            title={tab.future && !active ? (locale === "ko" ? "미래 전용" : "Future only") : undefined}
            type="button"
          >
            <span>{tab.label}</span>
            {tab.future && !active ? (
              <span className="ml-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-400">
                {locale === "ko" ? "미래 전용" : "Future only"}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

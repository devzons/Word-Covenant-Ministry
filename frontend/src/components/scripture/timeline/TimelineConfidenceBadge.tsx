"use client";

import { cn } from "@/lib/utils/cn";

type TimelineConfidenceBadgeProps = {
  label: string;
  locale: "en" | "ko";
};

export function TimelineConfidenceBadge({ label, locale }: TimelineConfidenceBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none",
        locale === "ko"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-sky-200 bg-sky-50 text-sky-800",
      )}
    >
      {label}
    </span>
  );
}

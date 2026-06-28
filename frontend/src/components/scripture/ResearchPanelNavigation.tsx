"use client";

import { cn } from "@/lib/utils/cn";

export type ResearchPanelSection = "search" | "insight" | "cross-reference" | "context";

type ResearchPanelNavigationProps = {
  activeSection: ResearchPanelSection;
  locale: string;
  onSectionChange: (section: ResearchPanelSection) => void;
};

const researchPanelNavigationCopy = {
  en: {
    title: "Research tools",
    sections: {
      context: "Context",
      search: "Search",
      insight: "Insight",
      "cross-reference": "Related Passages",
    },
  },
  ko: {
    title: "연구 도구",
    sections: {
      context: "문맥",
      search: "검색",
      insight: "통찰",
      "cross-reference": "관련 구절",
    },
  },
};

const visibleResearchSections: ResearchPanelSection[] = [
  "context",
  "search",
  "insight",
  "cross-reference",
];

export function ResearchPanelNavigation({
  activeSection,
  locale,
  onSectionChange,
}: ResearchPanelNavigationProps) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const copy = researchPanelNavigationCopy[activeLocale];

  return (
    <div className="mb-4 flex flex-col gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
        {copy.title}
      </h2>
      <nav
        aria-label={copy.title}
        className="grid grid-cols-2 gap-1 rounded-md border border-zinc-200 bg-white p-1 sm:grid-cols-4"
      >
        {visibleResearchSections.map((section) => (
          <button
            aria-pressed={activeSection === section}
            aria-current={activeSection === section ? "true" : undefined}
            className={cn(
              "min-w-0 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors",
              activeSection === section
                ? "border border-zinc-950 bg-zinc-950 text-white shadow-sm"
                : "border border-transparent bg-zinc-50 text-zinc-600 hover:border-zinc-200 hover:bg-zinc-100",
            )}
            key={section}
            onClick={() => onSectionChange(section)}
            type="button"
          >
            {copy.sections[section]}
          </button>
        ))}
      </nav>
    </div>
  );
}

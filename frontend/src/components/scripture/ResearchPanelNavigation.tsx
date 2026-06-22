"use client";

import { cn } from "@/lib/utils/cn";

export type ResearchPanelSection = "search" | "insight" | "cross-reference";

type ResearchPanelNavigationProps = {
  activeSection: ResearchPanelSection;
  locale: string;
  onSectionChange: (section: ResearchPanelSection) => void;
};

const researchPanelNavigationCopy = {
  en: {
    title: "Study",
    sections: {
      search: "Search",
      insight: "Insight",
      "cross-reference": "Cross Ref",
    },
  },
  ko: {
    title: "연구",
    sections: {
      search: "검색",
      insight: "통찰",
      "cross-reference": "참조",
    },
  },
};

const visibleResearchSections: ResearchPanelSection[] = [
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
        className="grid grid-cols-3 rounded-md border border-zinc-200 bg-white p-1"
      >
        {visibleResearchSections.map((section) => (
          <button
            aria-pressed={activeSection === section}
            className={cn(
              "rounded px-3 py-2 text-sm font-semibold transition-colors",
              activeSection === section
                ? "bg-zinc-950 text-white"
                : "text-zinc-600 hover:bg-zinc-100",
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

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils/cn";
import {
  buildStudySectionHref,
  type StudySection,
} from "@/lib/utils/study-library";

type StudySectionNavigationProps = {
  locale: "en" | "ko";
};

const copy = {
  en: {
    title: "Study",
    hub: "Study Hub",
    sermons: "Sermons & Exposition",
    publications: "Books & Research Papers",
  },
  ko: {
    title: "말씀연구",
    hub: "말씀연구 허브",
    sermons: "설교와 강해",
    publications: "책과 연구논문",
  },
} as const;

export function StudySectionNavigation({ locale }: StudySectionNavigationProps) {
  const pathname = usePathname();
  const pageCopy = copy[locale];

  const activeSection = resolveActiveSection(pathname);
  const isHub = activeSection === "hub";
  const sections: Array<{ key: StudySection; label: string }> = [
    { key: "hub", label: pageCopy.hub },
    { key: "sermons", label: pageCopy.sermons },
    { key: "publications", label: pageCopy.publications },
  ];

  return (
    <section className="border-b border-zinc-200 bg-white">
      <div
        className={cn(
          "mx-auto flex w-full max-w-[1600px] flex-col px-4 sm:px-6 lg:px-8",
          isHub ? "gap-3 py-4 sm:py-5" : "gap-4 py-6",
        )}
      >
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
            Word Covenant Ministry
          </p>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-zinc-950 sm:text-3xl">{pageCopy.title}</h1>
            {!isHub ? (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
                {locale === "en"
                  ? "Use separate persistent workspaces for sermons and publications without mixing their navigation structures."
                  : "설교와 강해, 책과 연구논문을 서로 다른 persistent workspace로 분리해 탐색 구조를 섞지 않고 사용합니다."}
              </p>
            ) : null}
          </div>
        </div>

        <nav
          aria-label={locale === "en" ? "Study section navigation" : "말씀연구 섹션 탐색"}
          className="flex flex-wrap gap-2"
        >
          {sections.map((section) => {
            const active = activeSection === section.key;

            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2",
                  active
                    ? "border-zinc-950 bg-zinc-950 text-white"
                    : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950",
                )}
                href={buildStudySectionHref(locale, section.key)}
                key={section.key}
              >
                {section.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </section>
  );
}

function resolveActiveSection(pathname: string): StudySection {
  if (pathname.includes("/study/sermons")) {
    return "sermons";
  }

  if (pathname.includes("/study/publications")) {
    return "publications";
  }

  return "hub";
}

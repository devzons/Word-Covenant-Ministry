import type { ReactNode } from "react";

import { StudyLibraryWorkspace } from "@/components/content/study/StudyLibraryWorkspace";
import { SiteShell } from "@/components/layout/SiteShell";
import { siteConfig } from "@/config/site";
import { fetchStudyCategories, fetchStudyContents } from "@/lib/api/study";

type StudyLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function StudyLayout({ children, params }: StudyLayoutProps) {
  const { locale } = await params;
  const activeLocale = getSupportedLocale(locale);
  const [contents, categories] = await Promise.all([
    fetchStudyContents(activeLocale, { perPage: 100, order: "asc", orderBy: "title" }),
    fetchStudyCategories(activeLocale),
  ]);

  return (
    <SiteShell locale={activeLocale}>
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <StudyLibraryWorkspace
          categories={categories}
          contents={contents}
          locale={activeLocale}
          variant="publications"
        >
          {children}
        </StudyLibraryWorkspace>
      </div>
    </SiteShell>
  );
}

function getSupportedLocale(locale: string): "en" | "ko" {
  return siteConfig.supportedLocales.includes(
    locale as (typeof siteConfig.supportedLocales)[number],
  ) && locale === "en"
    ? "en"
    : "ko";
}

import type { ReactNode } from "react";

import { StudyLibraryWorkspace } from "@/components/content/study/StudyLibraryWorkspace";
import { siteConfig } from "@/config/site";
import { fetchStudyCategories, fetchStudyContents } from "@/lib/api/study";

type StudyPublicationsLayoutProps = {
  children: ReactNode;
  params: Promise<unknown>;
};

export const dynamic = "force-dynamic";

export default async function StudyPublicationsLayout({
  children,
  params,
}: StudyPublicationsLayoutProps) {
  const locale = resolveLocale(await params);
  const activeLocale = getSupportedLocale(locale);
  const [contents, categories] = await Promise.all([
    fetchStudyContents(activeLocale, { perPage: 100, order: "asc", orderBy: "title" }),
    fetchStudyCategories(activeLocale),
  ]);

  return (
    <StudyLibraryWorkspace
      categories={categories}
      contents={contents}
      locale={activeLocale}
      variant="publications"
    >
      {children}
    </StudyLibraryWorkspace>
  );
}

function resolveLocale(params: unknown): string {
  if (typeof params === "object" && params !== null && "locale" in params) {
    const value = (params as { locale?: unknown }).locale;

    if (typeof value === "string") {
      return value;
    }

    if (Array.isArray(value) && typeof value[0] === "string") {
      return value[0];
    }
  }

  return "ko";
}

function getSupportedLocale(locale: string): "en" | "ko" {
  return siteConfig.supportedLocales.includes(
    locale as (typeof siteConfig.supportedLocales)[number],
  ) && locale === "en"
    ? "en"
    : "ko";
}

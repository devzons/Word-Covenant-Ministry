import type { ReactNode } from "react";

import { StudySectionNavigation } from "@/components/content/study/StudySectionNavigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { siteConfig } from "@/config/site";

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

  return (
    <SiteShell locale={activeLocale}>
      <StudySectionNavigation locale={activeLocale} />
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">{children}</div>
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

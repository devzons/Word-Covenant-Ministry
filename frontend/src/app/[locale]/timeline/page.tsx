import { SiteShell } from "@/components/layout/SiteShell";
import { siteConfig } from "@/config/site";

import { TimelinePageShell } from "@/components/scripture/timeline/TimelinePageShell";

type TimelinePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function TimelinePage({ params }: TimelinePageProps) {
  const { locale } = await params;
  const activeLocale = getSupportedLocale(locale);

  return (
    <SiteShell locale={activeLocale}>
      <TimelinePageShell locale={activeLocale} />
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

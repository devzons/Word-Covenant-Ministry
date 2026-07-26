import { SiteShell } from "@/components/layout/SiteShell";
import { GospelHarmonyWorkspace } from "@/components/scripture/GospelHarmonyWorkspace";
import { siteConfig } from "@/config/site";

type GospelHarmonyPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function GospelHarmonyPage({ params }: GospelHarmonyPageProps) {
  const { locale } = await params;
  const activeLocale = getSupportedLocale(locale);

  return (
    <SiteShell locale={activeLocale}>
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <GospelHarmonyWorkspace locale={activeLocale} />
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

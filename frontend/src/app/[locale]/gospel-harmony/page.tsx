import { SiteShell } from "@/components/layout/SiteShell";
import { GospelHarmonyWorkspace } from "@/components/scripture/GospelHarmonyWorkspace";
import { Container } from "@/components/ui/Container";
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
      <Container>
        <GospelHarmonyWorkspace locale={activeLocale} />
      </Container>
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

import { HomePage } from "@/components/content/HomePage";
import { SiteShell } from "@/components/layout/SiteShell";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

type LocaleHomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function LocaleHomePage({ params }: LocaleHomePageProps) {
  const { locale } = await params;
  const activeLocale = isSupportedLocale(locale) ? locale : siteConfig.defaultLocale;

  return (
    <SiteShell locale={activeLocale}>
      <Container>
        <HomePage locale={activeLocale} />
      </Container>
    </SiteShell>
  );
}

function isSupportedLocale(locale: string): boolean {
  return siteConfig.supportedLocales.includes(
    locale as (typeof siteConfig.supportedLocales)[number],
  );
}

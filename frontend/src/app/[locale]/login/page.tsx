import { LoginForm } from "@/components/content/LoginForm";
import { SiteShell } from "@/components/layout/SiteShell";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

type LoginPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  const activeLocale = isSupportedLocale(locale) ? locale : siteConfig.defaultLocale;

  return (
    <SiteShell locale={activeLocale}>
      <Container className="py-12 sm:py-16">
        <LoginForm locale={activeLocale} />
      </Container>
    </SiteShell>
  );
}

function isSupportedLocale(locale: string): boolean {
  return siteConfig.supportedLocales.includes(
    locale as (typeof siteConfig.supportedLocales)[number],
  );
}

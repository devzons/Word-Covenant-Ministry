import { ForgotPasswordForm } from "@/components/content/ForgotPasswordForm";
import { SiteShell } from "@/components/layout/SiteShell";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

type ForgotPasswordPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ForgotPasswordPage({
  params,
}: ForgotPasswordPageProps) {
  const { locale } = await params;
  const activeLocale = isSupportedLocale(locale) ? locale : siteConfig.defaultLocale;

  return (
    <SiteShell locale={activeLocale}>
      <Container className="py-12 sm:py-16">
        <ForgotPasswordForm locale={activeLocale} />
      </Container>
    </SiteShell>
  );
}

function isSupportedLocale(locale: string): boolean {
  return siteConfig.supportedLocales.includes(
    locale as (typeof siteConfig.supportedLocales)[number],
  );
}

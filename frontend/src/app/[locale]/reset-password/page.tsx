import { ResetPasswordForm } from "@/components/content/ResetPasswordForm";
import { SiteShell } from "@/components/layout/SiteShell";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

type ResetPasswordPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    key?: string;
    login?: string;
  }>;
};

export default async function ResetPasswordPage({
  params,
  searchParams,
}: ResetPasswordPageProps) {
  const { locale } = await params;
  const query = await searchParams;
  const activeLocale = isSupportedLocale(locale) ? locale : siteConfig.defaultLocale;
  const login = typeof query.login === "string" ? query.login : "";
  const resetKey = typeof query.key === "string" ? query.key : "";

  return (
    <SiteShell locale={activeLocale}>
      <Container className="py-12 sm:py-16">
        <ResetPasswordForm
          locale={activeLocale}
          login={login}
          resetKey={resetKey}
        />
      </Container>
    </SiteShell>
  );
}

function isSupportedLocale(locale: string): boolean {
  return siteConfig.supportedLocales.includes(
    locale as (typeof siteConfig.supportedLocales)[number],
  );
}

import type { Metadata } from "next";

import { RegistrationCheckEmail } from "@/components/content/RegistrationCheckEmail";
import { SiteShell } from "@/components/layout/SiteShell";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo/metadata";

type RegistrationCheckEmailPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    delivery?: string;
    redirect?: string;
  }>;
};

export async function generateMetadata({
  params,
}: RegistrationCheckEmailPageProps): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale = isSupportedLocale(locale) ? locale : siteConfig.defaultLocale;

  return createMetadata({
    description:
      activeLocale === "en"
        ? "Continue account setup by checking your verification email or requesting another message."
        : "확인 이메일을 확인하거나 새 확인 메일을 요청하여 계정 설정을 계속하세요.",
    path: `/${activeLocale}/register/check-email`,
    title: activeLocale === "en" ? "Check your email" : "이메일 확인 안내",
  });
}

export default async function RegistrationCheckEmailPage({
  params,
  searchParams,
}: RegistrationCheckEmailPageProps) {
  const { locale } = await params;
  const query = await searchParams;
  const activeLocale = isSupportedLocale(locale) ? locale : siteConfig.defaultLocale;
  const deliveryStatus = query.delivery === "failed" ? "failed" : "sent";

  return (
    <SiteShell locale={activeLocale}>
      <Container className="py-12 sm:py-16">
        <RegistrationCheckEmail
          deliveryStatus={deliveryStatus}
          locale={activeLocale}
          redirect={query.redirect}
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

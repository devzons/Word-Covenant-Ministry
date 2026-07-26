import type { Metadata } from "next";

import { VerifyEmailPanel } from "@/components/content/VerifyEmailPanel";
import { SiteShell } from "@/components/layout/SiteShell";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo/metadata";

type VerifyEmailPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
};

export async function generateMetadata({
  params,
}: VerifyEmailPageProps): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale = isSupportedLocale(locale) ? locale : siteConfig.defaultLocale;

  return createMetadata({
    description:
      activeLocale === "en"
        ? "Verify your Word Covenant Ministry email address and continue to sign in."
        : "Word Covenant Ministry 이메일 주소를 확인하고 로그인으로 계속 진행하세요.",
    path: `/${activeLocale}/verify-email`,
    title: activeLocale === "en" ? "Verify email" : "이메일 확인",
  });
}

export default async function VerifyEmailPage({
  params,
  searchParams,
}: VerifyEmailPageProps) {
  const { locale } = await params;
  const query = await searchParams;
  const activeLocale = isSupportedLocale(locale) ? locale : siteConfig.defaultLocale;

  return (
    <SiteShell locale={activeLocale}>
      <Container className="py-12 sm:py-16">
        <VerifyEmailPanel locale={activeLocale} token={query.token ?? ""} />
      </Container>
    </SiteShell>
  );
}

function isSupportedLocale(locale: string): boolean {
  return siteConfig.supportedLocales.includes(
    locale as (typeof siteConfig.supportedLocales)[number],
  );
}

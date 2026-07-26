import type { Metadata } from "next";

import { LoginForm } from "@/components/content/LoginForm";
import { SiteShell } from "@/components/layout/SiteShell";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo/metadata";

type LoginPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: LoginPageProps): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale = isSupportedLocale(locale) ? locale : siteConfig.defaultLocale;

  return createMetadata({
    description:
      activeLocale === "en"
        ? "Sign in to access private verse notes and other account features in Word Covenant Ministry."
        : "Word Covenant Ministry에서 개인 구절 노트와 계정 기능을 사용하려면 로그인하세요.",
    path: `/${activeLocale}/login`,
    title: activeLocale === "en" ? "Log in" : "로그인",
  });
}

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

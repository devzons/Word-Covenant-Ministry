import type { Metadata } from "next";

import { RegisterForm } from "@/components/content/RegisterForm";
import { SiteShell } from "@/components/layout/SiteShell";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo/metadata";

type RegisterPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: RegisterPageProps): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale = isSupportedLocale(locale) ? locale : siteConfig.defaultLocale;

  return createMetadata({
    description:
      activeLocale === "en"
        ? "Create a Word Covenant Ministry account and review the required legal notices before using account features."
        : "Word Covenant Ministry 계정을 만들고 계정 기능 사용 전에 필요한 법적 고지를 확인하세요.",
    path: `/${activeLocale}/register`,
    title: activeLocale === "en" ? "Create account" : "회원가입",
  });
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;
  const activeLocale = isSupportedLocale(locale) ? locale : siteConfig.defaultLocale;

  return (
    <SiteShell locale={activeLocale}>
      <Container className="py-12 sm:py-16">
        <RegisterForm locale={activeLocale} />
      </Container>
    </SiteShell>
  );
}

function isSupportedLocale(locale: string): boolean {
  return siteConfig.supportedLocales.includes(
    locale as (typeof siteConfig.supportedLocales)[number],
  );
}

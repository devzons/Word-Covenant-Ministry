import type { Metadata } from "next";

import { LegalPage } from "@/components/content/LegalPage";
import { SiteShell } from "@/components/layout/SiteShell";
import { getLegalDocument } from "@/content/legal/legalDocuments";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo/metadata";

type PrivacyPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale = isSupportedLocale(locale) ? locale : siteConfig.defaultLocale;
  const document = getLegalDocument(activeLocale, "privacy");

  return createMetadata({
    description: document.description,
    path: `/${activeLocale}/privacy`,
    title: document.title,
  });
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  const activeLocale = isSupportedLocale(locale) ? locale : siteConfig.defaultLocale;
  const document = getLegalDocument(activeLocale, "privacy");

  return (
    <SiteShell locale={activeLocale}>
      <LegalPage document={document} locale={activeLocale} />
    </SiteShell>
  );
}

function isSupportedLocale(locale: string): boolean {
  return siteConfig.supportedLocales.includes(
    locale as (typeof siteConfig.supportedLocales)[number],
  );
}

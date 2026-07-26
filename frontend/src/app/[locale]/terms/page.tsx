import type { Metadata } from "next";

import { LegalPage } from "@/components/content/LegalPage";
import { SiteShell } from "@/components/layout/SiteShell";
import { getLegalDocument } from "@/content/legal/legalDocuments";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo/metadata";

type TermsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale = isSupportedLocale(locale) ? locale : siteConfig.defaultLocale;
  const document = getLegalDocument(activeLocale, "terms");

  return createMetadata({
    description: document.description,
    path: `/${activeLocale}/terms`,
    title: document.title,
  });
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  const activeLocale = isSupportedLocale(locale) ? locale : siteConfig.defaultLocale;
  const document = getLegalDocument(activeLocale, "terms");

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

import Link from "next/link";

import type { LegalDocument, LegalDocumentType, LegalLocale } from "@/content/legal/legalDocuments";
import { getLegalPath } from "@/content/legal/legalDocuments";
import { Container } from "@/components/ui/Container";

type LegalPageProps = {
  document: LegalDocument;
  locale: string;
};

const copy = {
  en: {
    contents: "Contents",
    lastUpdated: "Last updated",
    version: "Version",
    relatedDocuments: "Related documents",
  },
  ko: {
    contents: "목차",
    lastUpdated: "최종 수정일",
    version: "버전",
    relatedDocuments: "관련 문서",
  },
} as const;

export function LegalPage({ document, locale }: LegalPageProps) {
  const activeLocale: LegalLocale = locale === "en" ? "en" : "ko";
  const labels = copy[activeLocale];
  const relatedDocuments = getRelatedDocuments(document.documentType, activeLocale);

  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <header className="flex flex-col gap-4 border-b border-zinc-200 pb-8">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-500">
            <span>
              {labels.version}: {document.version}
            </span>
            <span>
              {labels.lastUpdated}: {formatLastUpdated(document.lastUpdated, activeLocale)}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              {document.title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-zinc-700">
              {document.description}
            </p>
          </div>
          <div className="space-y-3 text-sm leading-7 text-zinc-600 sm:text-base">
            {document.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </header>

        {document.sections.length > 6 ? (
          <nav
            aria-label={labels.contents}
            className="rounded-lg border border-zinc-200 bg-zinc-50 p-5"
          >
            <p className="text-sm font-semibold text-zinc-950">{labels.contents}</p>
            <ol className="mt-4 grid gap-2 sm:grid-cols-2">
              {document.sections.map((section) => (
                <li key={section.id}>
                  <Link
                    className="text-sm leading-6 text-zinc-700 transition-colors hover:text-zinc-950"
                    href={`#${section.id}`}
                  >
                    {section.title}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className="flex flex-col gap-8">
          {document.sections.map((section) => (
            <section className="scroll-mt-24" id={section.id} key={section.id}>
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold text-zinc-950 sm:text-2xl">
                  {section.title}
                </h2>
                <div className="space-y-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets?.length ? (
                  <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-700 sm:text-base">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}
        </div>

        <footer className="flex flex-col gap-6 border-t border-zinc-200 pt-8">
          <div className="space-y-3 text-sm leading-7 text-zinc-600 sm:text-base">
            {document.contactNotice.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-zinc-950">{labels.relatedDocuments}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {relatedDocuments.map((item) => (
                <Link
                  className="font-medium text-zinc-700 transition-colors hover:text-zinc-950"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </Container>
  );
}

function formatLastUpdated(value: string, locale: LegalLocale): string {
  const date = new Date(`${value}T00:00:00Z`);

  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "ko-KR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}

function getRelatedDocuments(documentType: LegalDocumentType, locale: LegalLocale) {
  const labels =
    locale === "en"
      ? {
          privacy: "Privacy Policy",
          terms: "Terms of Service",
        }
      : {
          privacy: "개인정보 처리방침",
          terms: "이용약관",
        };

  const otherType: LegalDocumentType = documentType === "terms" ? "privacy" : "terms";

  return [
    {
      href: getLegalPath(locale, documentType),
      label: labels[documentType],
    },
    {
      href: getLegalPath(locale, otherType),
      label: labels[otherType],
    },
  ];
}

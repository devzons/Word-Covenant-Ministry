import Link from "next/link";

import { SiteShell } from "@/components/layout/SiteShell";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

type SermonsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const copy = {
  en: {
    title: "Sermons",
    body: "The sermon archive is being prepared. Until it is ready, you can continue reading Scripture or searching the Bible text.",
    reader: "Open Bible Reader",
    search: "Search Scripture",
  },
  ko: {
    title: "설교",
    body: "설교 아카이브를 준비하고 있습니다. 준비되는 동안 성경을 읽거나 본문을 검색할 수 있습니다.",
    reader: "성경 읽기",
    search: "성경 검색",
  },
};

export default async function SermonsPage({ params }: SermonsPageProps) {
  const { locale } = await params;
  const activeLocale = getSupportedLocale(locale);
  const pageCopy = copy[activeLocale];

  return (
    <SiteShell locale={activeLocale}>
      <Container>
        <section className="flex flex-col gap-6 py-12 sm:py-16">
          <div className="flex max-w-3xl flex-col gap-3">
            <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
              Word Covenant Ministry
            </p>
            <h1 className="text-3xl font-semibold text-zinc-950 sm:text-4xl">
              {pageCopy.title}
            </h1>
            <p className="text-base leading-7 text-zinc-600">{pageCopy.body}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
              href={`/${activeLocale}/bible/KRV/genesis/1`}
            >
              {pageCopy.reader}
            </Link>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
              href={`/${activeLocale}/bible/search`}
            >
              {pageCopy.search}
            </Link>
          </div>
        </section>
      </Container>
    </SiteShell>
  );
}

function getSupportedLocale(locale: string): "en" | "ko" {
  return siteConfig.supportedLocales.includes(
    locale as (typeof siteConfig.supportedLocales)[number],
  ) && locale === "en"
    ? "en"
    : "ko";
}

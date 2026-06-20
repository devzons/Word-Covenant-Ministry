import Link from "next/link";

import { SiteShell } from "@/components/layout/SiteShell";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

type OriginalLanguagePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const copy = {
  en: {
    title: "Original Language",
    eyebrow: "Bible Reader",
    body: "Original-language study tools are available inside the Bible Reader. Use reader modes to inspect verse tokens without leaving the Scripture flow.",
    tools: [
      "Original Mode",
      "Interlinear Mode",
      "Original Word Panel",
      "Strong Study",
    ],
    genesis: "Genesis 1 Original Mode",
    matthew: "Matthew 1 Interlinear Mode",
  },
  ko: {
    title: "원어 연구",
    eyebrow: "성경 리더",
    body: "원어 연구 도구는 성경 리더 안에서 사용할 수 있습니다. 본문 흐름을 유지하면서 절별 토큰을 확인할 수 있습니다.",
    tools: ["원어 모드", "인터리니어 모드", "원어 단어 패널", "Strong 연구"],
    genesis: "창세기 1장 원어 모드",
    matthew: "마태복음 1장 인터리니어 모드",
  },
};

export default async function OriginalLanguagePage({ params }: OriginalLanguagePageProps) {
  const { locale } = await params;
  const activeLocale = getSupportedLocale(locale);
  const pageCopy = copy[activeLocale];

  return (
    <SiteShell locale={activeLocale}>
      <Container>
        <section className="flex flex-col gap-8 py-12 sm:py-16">
          <div className="flex max-w-3xl flex-col gap-3">
            <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
              {pageCopy.eyebrow}
            </p>
            <h1 className="text-3xl font-semibold text-zinc-950 sm:text-4xl">
              {pageCopy.title}
            </h1>
            <p className="text-base leading-7 text-zinc-600">{pageCopy.body}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {pageCopy.tools.map((tool) => (
              <div className="rounded-md border border-zinc-200 bg-white p-4 text-sm font-semibold text-zinc-800" key={tool}>
                {tool}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
              href={`/${activeLocale}/bible/KRV/genesis/1?mode=original`}
            >
              {pageCopy.genesis}
            </Link>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
              href={`/${activeLocale}/bible/KRV/matthew/1?mode=interlinear`}
            >
              {pageCopy.matthew}
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

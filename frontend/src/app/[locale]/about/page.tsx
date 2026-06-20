import { SiteShell } from "@/components/layout/SiteShell";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

type AboutPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const copy = {
  en: {
    title: "About",
    body: "Word Covenant Ministry is a Christ-centered Scripture platform for Bible reading, Scripture search, and original-language study tools. The platform is being built carefully so ministry content and study features can grow without losing a clear focus on the biblical text.",
  },
  ko: {
    title: "소개",
    body: "Word Covenant Ministry는 성경 읽기, 말씀 검색, 원어 연구 도구를 위한 그리스도 중심의 성경 플랫폼입니다. 사역 콘텐츠와 연구 기능이 확장되어도 성경 본문 중심을 잃지 않도록 신중하게 준비하고 있습니다.",
  },
};

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const activeLocale = getSupportedLocale(locale);
  const pageCopy = copy[activeLocale];

  return (
    <SiteShell locale={activeLocale}>
      <Container>
        <section className="flex flex-col gap-4 py-12 sm:py-16">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
            Word Covenant Ministry
          </p>
          <h1 className="text-3xl font-semibold text-zinc-950 sm:text-4xl">
            {pageCopy.title}
          </h1>
          <p className="max-w-3xl text-base leading-7 text-zinc-600">{pageCopy.body}</p>
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

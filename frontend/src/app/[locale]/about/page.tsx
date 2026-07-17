import Link from "next/link";

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
    lead: "Word Covenant Ministry is a Scripture-centered reading platform that helps readers stay close to the biblical text while using chapter context, related passages, and original-language tools as aids.",
    missionTitle: "Purpose",
    missionBody:
      "The platform is built to support careful Bible reading, Christ-centered witness, and ministry study without losing sight of the passage in front of you.",
    principlesTitle: "Reading principles",
    principles: [
      {
        title: "Scripture interprets Scripture",
        body: "Related passages and search results are used to clarify the text, not to replace it.",
      },
      {
        title: "All Scripture bears witness to Christ",
        body: "The reading experience is shaped by the conviction that the whole Bible points to Christ.",
      },
      {
        title: "Context guards interpretation",
        body: "Chapter Context is a supplemental aid that helps readers keep each passage inside its own setting.",
      },
      {
        title: "Original language serves the text",
        body: "Hebrew and Greek details are provided to serve the passage, not to distract from it.",
      },
    ],
    toolsTitle: "Study tools",
    tools: [
      {
        title: "Bible Reading",
        body: "Read Scripture in a focused reader built around the biblical text.",
      },
      {
        title: "Chapter Context",
        body: "Review surrounding context to keep interpretation grounded in the chapter.",
      },
      {
        title: "Original Language",
        body: "Open original-language details and interlinear views while staying in the reader.",
      },
      {
        title: "Related Passages",
        body: "Use cross references as guides for deeper study and comparison.",
      },
      {
        title: "Bible Search",
        body: "Search Scripture and move directly into the passage you want to study.",
      },
      {
        title: "Research Workspace",
        body: "Keep chapter context, cross references, and original-language notes together.",
      },
    ],
    chapterContextTitle: "Chapter Context",
    chapterContextBody:
      "Chapter Context does not replace Scripture itself. It is a supplemental guide that helps readers observe the flow of a chapter, see what surrounds a verse, and avoid reading a verse in isolation.",
    chapterContextList: [
      "keeps the surrounding passage visible",
      "helps readers notice the immediate literary flow",
      "supports careful interpretation without taking the place of the text",
    ],
    ctas: {
      read: "Start Reading Scripture",
      search: "Search Scripture",
    },
  },
  ko: {
    title: "소개",
    lead: "Word Covenant Ministry는 성경 본문을 중심에 두고 읽도록 돕는 성경 읽기 플랫폼입니다. 장별 문맥, 관련 구절, 원어 도구를 보조 수단으로 활용하면서 본문에 가까이 머물 수 있도록 설계했습니다.",
    missionTitle: "사역 목적",
    missionBody:
      "이 플랫폼은 말씀을 신중하게 읽고, 그리스도를 증언하는 성경의 흐름을 붙들며, 본문 앞에서 떠나지 않는 연구를 돕기 위해 만들어졌습니다.",
    principlesTitle: "읽기 원칙",
    principles: [
      {
        title: "성경은 성경으로 해석한다",
        body: "관련 구절과 검색 결과는 본문을 밝히는 데 사용되며, 본문을 대신하지 않습니다.",
      },
      {
        title: "모든 성경은 그리스도를 증언한다",
        body: "전체 성경이 그리스도를 가리킨다는 믿음 속에서 읽기 경험을 구성합니다.",
      },
      {
        title: "문맥은 해석의 울타리다",
        body: "Chapter Context는 각 절을 장의 흐름 안에서 살피도록 돕는 보조 도구입니다.",
      },
      {
        title: "원어는 본문을 섬기는 도구다",
        body: "히브리어와 헬라어 정보는 본문 이해를 돕기 위해 제공되며, 본문보다 앞서지 않습니다.",
      },
    ],
    toolsTitle: "말씀 연구 도구",
    tools: [
      {
        title: "성경 읽기",
        body: "성경 본문 중심의 리더에서 말씀을 집중하여 읽을 수 있습니다.",
      },
      {
        title: "장별 문맥",
        body: "주변 문맥을 함께 살펴 절의 의미를 장 전체 안에서 이해하도록 돕습니다.",
      },
      {
        title: "원어 보기",
        body: "리더를 떠나지 않고 원어 정보와 행간 보기를 확인할 수 있습니다.",
      },
      {
        title: "관련 구절",
        body: "관련 구절을 길잡이로 삼아 더 깊이 비교하고 살펴볼 수 있습니다.",
      },
      {
        title: "성경 검색",
        body: "말씀을 검색하고 원하는 본문으로 바로 이동할 수 있습니다.",
      },
      {
        title: "연구 Workspace",
        body: "장별 문맥, 관련 구절, 원어 메모를 함께 모아 연구할 수 있습니다.",
      },
    ],
    chapterContextTitle: "Chapter Context",
    chapterContextBody:
      "Chapter Context는 성경 본문을 대신하지 않습니다. 각 장의 흐름과 주변 문맥을 함께 살피도록 돕는 보조 도구로서, 한 절을 문맥에서 떼어 읽지 않도록 안내합니다.",
    chapterContextList: [
      "주변 본문을 계속 보이게 해 줍니다",
      "가까운 문학적 흐름을 살피도록 돕습니다",
      "본문을 대신하지 않고 해석을 보조합니다",
    ],
    ctas: {
      read: "성경 읽기 시작하기",
      search: "성경 검색하기",
    },
  },
};

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const activeLocale = getSupportedLocale(locale);
  const pageCopy = copy[activeLocale];

  return (
    <SiteShell locale={activeLocale}>
      <Container>
        <div className="flex flex-col gap-14 py-12 sm:py-16">
          <section className="grid gap-8 border-b border-zinc-200 pb-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="flex max-w-3xl flex-col gap-5">
              <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
                Word Covenant Ministry
              </p>
              <div className="flex flex-col gap-3">
                <h1 className="text-4xl font-semibold text-zinc-950 sm:text-5xl">
                  {pageCopy.title}
                </h1>
                <p className="text-xl leading-8 text-zinc-700">{pageCopy.lead}</p>
              </div>
              <p className="max-w-2xl text-base leading-7 text-zinc-600">{pageCopy.missionBody}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
                  href={`/${activeLocale}/bible/KRV/genesis/1`}
                >
                  {pageCopy.ctas.read}
                </Link>
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
                  href={`/${activeLocale}/bible/search`}
                >
                  {pageCopy.ctas.search}
                </Link>
              </div>
            </div>
            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-5">
              <p className="text-sm font-semibold text-zinc-950">{pageCopy.missionTitle}</p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{pageCopy.missionBody}</p>
              <div className="mt-5 rounded-md border border-zinc-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
                  {activeLocale === "en" ? "Guiding idea" : "핵심 문장"}
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-700">
                  {activeLocale === "en"
                    ? "Chapter context, original language, and cross references serve the passage."
                    : "장별 문맥, 원어, 관련 구절은 본문을 섬기는 보조 도구입니다."}
                </p>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-5">
            <h2 className="text-2xl font-semibold text-zinc-950">{pageCopy.principlesTitle}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {pageCopy.principles.map((principle) => (
                <article className="rounded-md border border-zinc-200 bg-white p-5" key={principle.title}>
                  <h3 className="text-base font-semibold text-zinc-950">{principle.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">{principle.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-5">
            <h2 className="text-2xl font-semibold text-zinc-950">{pageCopy.toolsTitle}</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {pageCopy.tools.map((tool) => (
                <article className="rounded-md border border-zinc-200 bg-zinc-50 p-5" key={tool.title}>
                  <h3 className="text-base font-semibold text-zinc-950">{tool.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">{tool.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-6 rounded-md border border-zinc-200 bg-white p-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
                Chapter Context
              </p>
              <h2 className="text-2xl font-semibold text-zinc-950">{pageCopy.chapterContextTitle}</h2>
              <p className="text-sm leading-6 text-zinc-600">{pageCopy.chapterContextBody}</p>
            </div>
            <div className="rounded-md bg-zinc-50 p-5">
              <ul className="grid gap-3 text-sm leading-6 text-zinc-700">
                {pageCopy.chapterContextList.map((item) => (
                  <li className="flex items-start gap-3" key={item}>
                    <span className="mt-1 size-2 shrink-0 rounded-full bg-zinc-500" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
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

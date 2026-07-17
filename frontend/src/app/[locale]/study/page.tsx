import Link from "next/link";
import type { Metadata } from "next";

import { SiteShell } from "@/components/layout/SiteShell";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo/metadata";

type StudyPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const copy = {
  en: {
    title: "Study",
    lead: "A Scripture study space that keeps the biblical text central while using context, related passages, and original-language tools as servants of the passage.",
    introTitle: "Study posture",
    intro: [
      "Scripture interprets Scripture.",
      "All Scripture bears witness to Christ.",
      "Context guards interpretation.",
      "Original language serves the text.",
    ],
    cardsTitle: "Study categories",
    cards: [
      {
        id: "sermons",
        title: "Sermons & Exposition",
        body: "Follow the flow of the text as it is unfolded in preaching and exposition.",
        href: "/sermons",
        kind: "route" as const,
      },
      {
        id: "books",
        title: "Books",
        body: "Introduce books that help with manuscript preparation and Bible study.",
        href: "#books",
        kind: "anchor" as const,
      },
      {
        id: "interpretation",
        title: "Biblical Interpretation",
        body: "Read passages within their immediate context and the flow of the whole Bible.",
        href: "#interpretation",
        kind: "anchor" as const,
      },
      {
        id: "original-paja",
        title: "Original Languages & Paja",
        body: "Work with Hebrew, Greek, word studies, and character-level study as aids to the text.",
        href: "#original-paja",
        kind: "anchor" as const,
      },
    ],
    ctas: {
      read: "Read Scripture",
      search: "Search Scripture",
    },
    sections: {
      sermons: "Sermons & Exposition",
      books: "Books",
      interpretation: "Biblical Interpretation",
      originalPaja: "Original Languages & Paja",
    },
    sectionBody: {
      sermons:
        "This area gathers sermon and exposition content that stays close to the biblical text and follows the flow of the passage.",
      books:
        "This area introduces books and written resources that support Bible reading and careful study.",
      interpretation:
        "This area focuses on reading within context, comparing related passages, and keeping the passage in its own literary setting.",
      originalPaja:
        "This area gathers Hebrew, Greek, word, and character study material as a support for deeper reading, not as a replacement for the text.",
    },
  },
  ko: {
    title: "말씀연구",
    lead: "성경 본문을 중심에 두고, 문맥과 관련 구절, 원어 도구를 본문을 섬기는 보조 수단으로 사용하는 연구 공간입니다.",
    introTitle: "연구 자세",
    intro: [
      "성경은 성경으로 해석한다.",
      "모든 성경은 그리스도를 증언한다.",
      "문맥은 해석의 울타리다.",
      "원어는 본문을 섬기는 도구다.",
    ],
    cardsTitle: "연구 범주",
    cards: [
      {
        id: "sermons",
        title: "설교와 강해",
        body: "본문의 흐름을 따라 말씀을 풀어가는 설교와 강해를 살펴봅니다.",
        href: "/sermons",
        kind: "route" as const,
      },
      {
        id: "books",
        title: "책소개",
        body: "집필 원고와 성경 연구에 도움이 되는 책을 소개합니다.",
        href: "#books",
        kind: "anchor" as const,
      },
      {
        id: "interpretation",
        title: "성경해석",
        body: "문맥과 성경 전체의 흐름 안에서 본문을 살핍니다.",
        href: "#interpretation",
        kind: "anchor" as const,
      },
      {
        id: "original-paja",
        title: "원어와 파자",
        body: "히브리어, 헬라어, 단어와 문자 연구를 본문 안에서 다룹니다.",
        href: "#original-paja",
        kind: "anchor" as const,
      },
    ],
    ctas: {
      read: "성경읽기",
      search: "성경검색",
    },
    sections: {
      sermons: "설교와 강해",
      books: "책소개",
      interpretation: "성경해석",
      originalPaja: "원어와 파자",
    },
    sectionBody: {
      sermons:
        "이 구역은 본문에 가까운 설교와 강해 자료를 모아, 말씀이 전개되는 흐름을 따라가도록 돕습니다.",
      books:
        "이 구역은 성경 읽기와 연구를 돕는 책과 원고를 소개합니다.",
      interpretation:
        "이 구역은 문맥을 따라 읽고 관련 구절을 비교하며, 본문을 그 자체의 자리에서 살피도록 돕습니다.",
      originalPaja:
        "이 구역은 히브리어, 헬라어, 단어, 문자 연구를 본문을 더 깊이 살피기 위한 보조 자료로 제공합니다.",
    },
  },
};

export const metadata: Metadata = createMetadata({
  title: "Study",
  path: "/study",
});

export default async function StudyPage({ params }: StudyPageProps) {
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
            </div>
            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-5">
              <p className="text-sm font-semibold text-zinc-950">{pageCopy.introTitle}</p>
              <ul className="mt-4 grid gap-3 text-sm leading-6 text-zinc-700">
                {pageCopy.intro.map((item) => (
                  <li className="flex items-start gap-3" key={item}>
                    <span className="mt-1 size-2 shrink-0 rounded-full bg-zinc-500" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="flex flex-col gap-5">
            <h2 className="text-2xl font-semibold text-zinc-950">{pageCopy.cardsTitle}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {pageCopy.cards.map((card) => (
                <article
                  className="rounded-md border border-zinc-200 bg-white p-5"
                  key={card.id}
                  id={card.id}
                >
                  <h3 className="text-base font-semibold text-zinc-950">{card.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">{card.body}</p>
                  <div className="mt-5">
                    <Link
                      className="inline-flex min-h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
                      href={`/${activeLocale}${card.href}`}
                    >
                      {card.kind === "route"
                        ? activeLocale === "en"
                          ? "Open Sermons"
                          : "설교 열기"
                        : activeLocale === "en"
                          ? "Read more"
                          : "자세히 보기"}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-6 rounded-md border border-zinc-200 bg-white p-6">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
                {activeLocale === "en" ? "Study overview" : "말씀연구 개요"}
              </p>
              <h2 className="text-2xl font-semibold text-zinc-950">
                {activeLocale === "en" ? "Study focus areas" : "연구 초점 영역"}
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <article id="books" className="rounded-md bg-zinc-50 p-5">
                <h3 className="text-base font-semibold text-zinc-950">{pageCopy.sections.books}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{pageCopy.sectionBody.books}</p>
              </article>
              <article id="interpretation" className="rounded-md bg-zinc-50 p-5">
                <h3 className="text-base font-semibold text-zinc-950">
                  {pageCopy.sections.interpretation}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {pageCopy.sectionBody.interpretation}
                </p>
              </article>
              <article id="original-paja" className="rounded-md bg-zinc-50 p-5 md:col-span-2">
                <h3 className="text-base font-semibold text-zinc-950">
                  {pageCopy.sections.originalPaja}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {pageCopy.sectionBody.originalPaja}
                </p>
              </article>
            </div>

            <article id="sermons" className="rounded-md border border-zinc-200 bg-zinc-50 p-5">
              <h3 className="text-base font-semibold text-zinc-950">{pageCopy.sections.sermons}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                {pageCopy.sectionBody.sermons}
              </p>
              <div className="mt-5">
                <Link
                  className="inline-flex min-h-10 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
                  href={`/${activeLocale}/sermons`}
                >
                  {activeLocale === "en" ? "Open Sermons" : "설교로 이동"}
                </Link>
              </div>
            </article>
          </section>

          <section className="rounded-md border border-zinc-200 bg-zinc-50 p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
                  {activeLocale === "en" ? "Start here" : "시작하기"}
                </p>
                <p className="text-base leading-7 text-zinc-600">
                  {activeLocale === "en"
                    ? "Continue in the Bible Reader or search Scripture from the study workspace."
                    : "성경 리더에서 말씀을 이어 읽거나, 검색으로 필요한 본문을 바로 찾을 수 있습니다."}
                </p>
              </div>
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

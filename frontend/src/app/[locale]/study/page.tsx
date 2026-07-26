import Link from "next/link";
import type { Metadata } from "next";
import type { ReactElement } from "react";

import { SiteShell } from "@/components/layout/SiteShell";
import { siteConfig } from "@/config/site";
import { fetchStudyCategories, fetchStudyContents } from "@/lib/api/study";
import { createMetadata } from "@/lib/seo/metadata";
import type { StudyCategory, StudyContentSummary } from "@/types/study";

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
    sidebarTitle: "On this page",
    sidebarBody:
      "Use the grouped sections below to move between the available study areas and the preview areas that are still being prepared.",
    navigation: {
      overview: "Overview",
      sermons: "Sermons & Exposition",
      booksPapers: "Books & Research Papers",
      interpretation: "Biblical Interpretation",
      originalPaja: "Original Languages & Paja",
    },
    sections: {
      sermons: {
        title: "Sermons & Exposition",
        status: "Available now",
        body: "Follow the flow of the text as it is unfolded in preaching and exposition.",
        action: "Open Sermons",
        note: "This section continues to live in the existing sermons route.",
      },
      booksPapers: {
        title: "Books & Research Papers",
        status: "Connected to WordPress content",
        body: "This section groups books, recommended reading, and research papers that support Scripture reading and study.",
        note: "The page stays readable even when WordPress returns no study posts, so sample content is optional.",
        books: {
          title: "Books",
          status: "Preview area",
          body: "Books and recommended reading are being prepared for this section.",
        },
        papers: {
          title: "Research Papers",
          status: "Preview area",
          body: "Research essays on Scripture, covenant, original languages, Paja, and biblical interpretation.",
        },
        liveTitle: "Live archive snapshot",
        liveBody:
          "These counts and cards are driven by the WordPress study archive. If content is missing, the page falls back to a safe empty state instead of breaking.",
        contentCountLabel: "Published posts",
        categoryCountLabel: "Categories",
        sectionCountLabel: "Top-level sections",
        emptyStateTitle: "No published study content yet",
        emptyStateBody:
          "The study archive is connected, but no posts or categories are available right now. The page remains usable until sample or real content is published.",
        populatedStateBody:
          "Published study posts are grouped below by category. If a category has no direct posts yet, it still renders as a safe preview shell.",
        categoryFallback: "A WordPress category description has not been added yet.",
        noPostsTitle: "No posts in this category yet",
        noPostsBody:
          "When sample or real posts are published in WordPress, they will appear here automatically.",
      },
      interpretation: {
        title: "Biblical Interpretation",
        status: "Coming soon",
        body: "This section will focus on reading within context, comparing related passages, and keeping the passage in its own literary setting.",
        note: "The section remains a preview space for now and does not point to a separate page.",
      },
      originalPaja: {
        title: "Original Languages & Paja",
        status: "Available now",
        body: "Use the existing original-language study tools to inspect Hebrew, Greek, and word-level details.",
        action: "Open Original Language",
        note: "The reader and interlinear views already handle original-language study.",
      },
    },
    ctas: {
      read: "Read Scripture",
      search: "Search Scripture",
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
    sidebarTitle: "이 페이지",
    sidebarBody:
      "아래의 묶음 섹션을 따라 현재 연결된 연구 영역과 준비 중인 미리보기 영역을 함께 살펴볼 수 있습니다.",
    navigation: {
      overview: "전체",
      sermons: "설교와 강해",
      booksPapers: "책과 연구논문",
      interpretation: "성경해석",
      originalPaja: "원어와 파자",
    },
    sections: {
      sermons: {
        title: "설교와 강해",
        status: "현재 연결됨",
        body: "본문을 따라 말씀의 흐름을 풀어가는 설교와 강해 자료입니다.",
        action: "설교로 이동",
        note: "이 섹션은 기존 설교 페이지로 이어집니다.",
      },
      booksPapers: {
        title: "책과 연구논문",
        status: "워드프레스 콘텐츠 연결됨",
        body: "집필 원고, 책소개, 연구논문을 함께 정리할 공간입니다.",
        note: "워드프레스에 아직 글이 없더라도 이 페이지는 안전한 빈 상태로 유지됩니다.",
        books: {
          title: "책소개",
          status: "미리보기 영역",
          body: "집필 원고와 추천 도서가 정리될 공간입니다.",
        },
        papers: {
          title: "연구논문",
          status: "미리보기 영역",
          body: "성경 본문, 언약, 원어, 파자, 성경해석에 관한 깊이 있는 연구 글을 정리합니다.",
        },
        liveTitle: "실시간 아카이브 현황",
        liveBody:
          "이 수치와 카드들은 워드프레스 말씀연구 아카이브를 기반으로 그려집니다. 콘텐츠가 아직 없어도 페이지는 안전한 빈 상태로 유지됩니다.",
        contentCountLabel: "공개 글 수",
        categoryCountLabel: "분류 수",
        sectionCountLabel: "상위 섹션 수",
        emptyStateTitle: "아직 공개된 말씀연구 글이 없습니다",
        emptyStateBody:
          "말씀연구 아카이브 연결은 완료되었지만, 지금은 공개된 글이나 분류가 없습니다. 샘플 또는 실제 콘텐츠가 추가되면 이 페이지에 자동 반영됩니다.",
        populatedStateBody:
          "공개된 말씀연구 글은 아래 분류별로 묶여 표시됩니다. 특정 분류에 직접 글이 없어도 안전한 미리보기 구조를 유지합니다.",
        categoryFallback: "아직 워드프레스 분류 설명이 입력되지 않았습니다.",
        noPostsTitle: "이 분류에는 아직 글이 없습니다",
        noPostsBody:
          "워드프레스에서 샘플 또는 실제 글이 공개되면 이 영역에 자동으로 표시됩니다.",
      },
      interpretation: {
        title: "성경해석",
        status: "준비 중",
        body: "문맥과 성경 전체의 흐름 안에서 본문을 살피는 해석 자료입니다.",
        note: "현재는 전용 페이지 없이 이 페이지의 미리보기 영역으로 제공됩니다.",
      },
      originalPaja: {
        title: "원어와 파자",
        status: "현재 연결됨",
        body: "히브리어, 헬라어, 단어와 문자 연구를 본문 안에서 다룹니다.",
        action: "원어 연구로 이동",
        note: "원어 보기와 행간 보기는 기존 원어 연구 페이지와 리더에서 확인할 수 있습니다.",
      },
    },
    ctas: {
      read: "성경읽기",
      search: "성경검색",
    },
  },
};

export const metadata: Metadata = createMetadata({
  title: "Study",
  path: "/study",
});

export const dynamic = "force-dynamic";

export default async function StudyPage({ params }: StudyPageProps) {
  const { locale } = await params;
  const activeLocale = getSupportedLocale(locale);
  const pageCopy = copy[activeLocale];
  const navigation = getStudyNavigation(activeLocale);
  const [studyContents, studyCategories] = await Promise.all([
    fetchStudyContents(activeLocale, { perPage: 100, order: "asc", orderBy: "title" }),
    fetchStudyCategories(activeLocale),
  ]);
  const studyCategoryTree = buildStudyCategoryTree(studyCategories, studyContents);
  const studyStats = {
    contents: studyContents.length,
    categories: studyCategories.length,
    topLevelCategories: studyCategoryTree.length,
  };

  return (
    <SiteShell locale={activeLocale}>
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="py-12 sm:py-16">
          <div className="mb-6 lg:hidden">
            <nav aria-label={pageCopy.sidebarTitle} className="flex flex-wrap gap-2">
              {navigation.map((item) => (
                <Link
                  className="inline-flex min-h-10 items-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-950"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:items-start">
            <aside className="hidden lg:block">
              <div className="sticky top-6 rounded-md border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
                  {pageCopy.sidebarTitle}
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{pageCopy.sidebarBody}</p>
                <nav aria-label={pageCopy.sidebarTitle} className="mt-4 grid gap-2">
                  {navigation.map((item) => (
                    <Link
                      className="rounded-md border border-transparent px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-200 hover:bg-white hover:text-zinc-950"
                      href={item.href}
                      key={item.href}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>

            <div className="flex flex-col gap-10">
              <section
                id="overview"
                className="scroll-mt-24 grid gap-8 border-b border-zinc-200 pb-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end"
              >
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
                        <span
                          aria-hidden="true"
                          className="mt-1 size-2 shrink-0 rounded-full bg-zinc-500"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section
                id="sermons"
                className="scroll-mt-24 rounded-md border border-zinc-200 bg-white p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
                      {pageCopy.sections.sermons.status}
                    </p>
                    <h2 className="text-2xl font-semibold text-zinc-950">
                      {pageCopy.sections.sermons.title}
                    </h2>
                  </div>
                  <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                    {activeLocale === "en" ? "Route" : "연결됨"}
                  </span>
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
                  {pageCopy.sections.sermons.body}
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    className="inline-flex min-h-10 items-center justify-center rounded-md border border-zinc-300 bg-zinc-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
                    href={`/${activeLocale}/sermons`}
                  >
                    {pageCopy.sections.sermons.action}
                  </Link>
                  <p className="text-xs leading-5 text-zinc-500">{pageCopy.sections.sermons.note}</p>
                </div>
              </section>

              <section
                id="books-papers"
                className="scroll-mt-24 rounded-md border border-zinc-200 bg-zinc-50 p-6"
              >
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
                    {pageCopy.sections.booksPapers.status}
                  </p>
                  <h2 className="text-2xl font-semibold text-zinc-950">
                    {pageCopy.sections.booksPapers.title}
                  </h2>
                  <p className="max-w-3xl text-sm leading-6 text-zinc-600">
                    {pageCopy.sections.booksPapers.body}
                  </p>
                </div>
                <p className="mt-5 text-xs leading-5 text-zinc-500">
                  {pageCopy.sections.booksPapers.note}
                </p>
                <div className="mt-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                  <div className="flex flex-col gap-4">
                    {studyCategoryTree.length > 0 ? (
                      studyCategoryTree.map((category) =>
                        renderStudyCategoryNode(category, activeLocale, pageCopy),
                      )
                    ) : (
                      <div className="rounded-md border border-dashed border-zinc-300 bg-white p-5">
                        <p className="text-base font-semibold text-zinc-950">
                          {pageCopy.sections.booksPapers.emptyStateTitle}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-zinc-600">
                          {pageCopy.sections.booksPapers.emptyStateBody}
                        </p>
                        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                          <Link
                            className="inline-flex min-h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
                            href={`/${activeLocale}/bible/KRV/genesis/1`}
                          >
                            {pageCopy.ctas.read}
                          </Link>
                          <Link
                            className="inline-flex min-h-10 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
                            href={`/${activeLocale}/bible/search`}
                          >
                            {pageCopy.ctas.search}
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  <aside className="rounded-md border border-zinc-200 bg-white p-5">
                    <p className="text-sm font-semibold text-zinc-950">
                      {pageCopy.sections.booksPapers.liveTitle}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      {pageCopy.sections.booksPapers.liveBody}
                    </p>
                    <dl className="mt-5 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
                        <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                          {pageCopy.sections.booksPapers.contentCountLabel}
                        </dt>
                        <dd className="mt-2 text-2xl font-semibold text-zinc-950">
                          {studyStats.contents}
                        </dd>
                      </div>
                      <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
                        <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                          {pageCopy.sections.booksPapers.categoryCountLabel}
                        </dt>
                        <dd className="mt-2 text-2xl font-semibold text-zinc-950">
                          {studyStats.categories}
                        </dd>
                      </div>
                      <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
                        <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                          {pageCopy.sections.booksPapers.sectionCountLabel}
                        </dt>
                        <dd className="mt-2 text-2xl font-semibold text-zinc-950">
                          {studyStats.topLevelCategories}
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-5 rounded-md border border-zinc-200 bg-zinc-50 p-4">
                      <p className="text-sm font-semibold text-zinc-950">
                        {pageCopy.sections.booksPapers.emptyStateTitle}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-zinc-600">
                        {studyCategoryTree.length > 0 || studyContents.length > 0
                          ? pageCopy.sections.booksPapers.populatedStateBody
                          : pageCopy.sections.booksPapers.emptyStateBody}
                      </p>
                    </div>
                  </aside>
                </div>
              </section>

              <section
                id="interpretation"
                className="scroll-mt-24 rounded-md border border-zinc-200 bg-white p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
                      {pageCopy.sections.interpretation.status}
                    </p>
                    <h2 className="text-2xl font-semibold text-zinc-950">
                      {pageCopy.sections.interpretation.title}
                    </h2>
                  </div>
                  <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                    {activeLocale === "en" ? "Preview" : "미리보기"}
                  </span>
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
                  {pageCopy.sections.interpretation.body}
                </p>
                <p className="mt-5 text-xs leading-5 text-zinc-500">
                  {pageCopy.sections.interpretation.note}
                </p>
              </section>

              <section
                id="original-paja"
                className="scroll-mt-24 rounded-md border border-zinc-200 bg-zinc-50 p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
                      {pageCopy.sections.originalPaja.status}
                    </p>
                    <h2 className="text-2xl font-semibold text-zinc-950">
                      {pageCopy.sections.originalPaja.title}
                    </h2>
                  </div>
                  <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                    {activeLocale === "en" ? "Available now" : "현재 연결됨"}
                  </span>
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
                  {pageCopy.sections.originalPaja.body}
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    className="inline-flex min-h-10 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
                    href={`/${activeLocale}/original-language`}
                  >
                    {pageCopy.sections.originalPaja.action}
                  </Link>
                  <p className="text-xs leading-5 text-zinc-500">
                    {pageCopy.sections.originalPaja.note}
                  </p>
                </div>
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
          </div>
        </div>
      </div>
    </SiteShell>
  );
}

function getStudyNavigation(locale: "en" | "ko"): Array<{ href: string; label: string }> {
  return locale === "en"
    ? [
        { href: "#overview", label: "Overview" },
        { href: `/${locale}/sermons`, label: "Sermons & Exposition" },
        { href: "#books-papers", label: "Books & Research Papers" },
        { href: "#interpretation", label: "Biblical Interpretation" },
        { href: `/${locale}/original-language`, label: "Original Languages & Paja" },
      ]
    : [
        { href: "#overview", label: "전체" },
        { href: `/${locale}/sermons`, label: "설교와 강해" },
        { href: "#books-papers", label: "책과 연구논문" },
        { href: "#interpretation", label: "성경해석" },
        { href: `/${locale}/original-language`, label: "원어와 파자" },
      ];
}

function getSupportedLocale(locale: string): "en" | "ko" {
  return siteConfig.supportedLocales.includes(
    locale as (typeof siteConfig.supportedLocales)[number],
  ) && locale === "en"
    ? "en"
    : "ko";
}

type StudyPageCopy = (typeof copy)["en"];

type StudyCategoryNode = StudyCategory & {
  children: StudyCategoryNode[];
  posts: StudyContentSummary[];
};

function buildStudyCategoryTree(
  categories: StudyCategory[],
  contents: StudyContentSummary[],
): StudyCategoryNode[] {
  const nodesById = new Map<number, StudyCategoryNode>();

  categories
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((category) => {
      nodesById.set(category.id, {
        ...category,
        children: [],
        posts: [],
      });
    });

  const roots: StudyCategoryNode[] = [];

  for (const node of nodesById.values()) {
    node.posts = contents
      .filter((content) => content.studyCategoryIds.includes(node.id))
      .slice()
      .sort((a, b) => a.title.localeCompare(b.title));

    if (node.parent > 0 && nodesById.has(node.parent)) {
      const parent = nodesById.get(node.parent);

      if (parent) {
        parent.children.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  const sortNodes = (nodes: StudyCategoryNode[]): StudyCategoryNode[] => {
    nodes.sort((a, b) => a.name.localeCompare(b.name));
    nodes.forEach((node) => sortNodes(node.children));

    return nodes;
  };

  return sortNodes(roots);
}

function renderStudyCategoryNode(
  category: StudyCategoryNode,
  locale: "en" | "ko",
  pageCopy: StudyPageCopy,
): ReactElement {
  return (
    <article className="rounded-md border border-zinc-200 bg-white p-5" key={category.id}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-zinc-950">{category.name}</h3>
            <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
              {category.count}
            </span>
          </div>
          {category.description !== "" ? (
            <p className="text-sm leading-6 text-zinc-600">{category.description}</p>
          ) : (
            <p className="text-sm leading-6 text-zinc-500">
              {pageCopy.sections.booksPapers.categoryFallback}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {category.posts.length > 0 ? (
          category.posts.map((post) => renderStudyPostCard(post, locale))
        ) : (
          <div className="rounded-md border border-dashed border-zinc-200 bg-zinc-50 p-4">
            <p className="text-sm font-medium text-zinc-700">
              {pageCopy.sections.booksPapers.noPostsTitle}
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              {pageCopy.sections.booksPapers.noPostsBody}
            </p>
          </div>
        )}
      </div>

      {category.children.length > 0 ? (
        <div className="mt-5 grid gap-4 border-t border-zinc-200 pt-5">
          {category.children.map((child) => renderStudyCategoryNode(child, locale, pageCopy))}
        </div>
      ) : null}
    </article>
  );
}

function renderStudyPostCard(post: StudyContentSummary, locale: "en" | "ko"): ReactElement {
  return (
    <article className="rounded-md border border-zinc-200 bg-white p-4" key={post.id}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <h4 className="text-base font-semibold text-zinc-950">{post.title}</h4>
          {post.excerpt !== "" ? (
            <div
              className="text-sm leading-6 text-zinc-600"
              dangerouslySetInnerHTML={{ __html: post.excerpt }}
            />
          ) : (
            <p className="text-sm leading-6 text-zinc-500">{postFallbackBody(locale)}</p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          {post.date !== "" ? (
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-zinc-500">
              {formatStudyDate(post.date, locale)}
            </p>
          ) : null}
          {post.link !== "" ? (
            <a
              className="text-sm font-semibold text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-500"
              href={post.link}
            >
              {locale === "en" ? "Open post" : "글 열기"}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function postFallbackBody(locale: "en" | "ko"): string {
  return locale === "en"
    ? "This content is published without a summary yet."
    : "이 글은 아직 요약이 공개되지 않았습니다.";
}

function formatStudyDate(value: string, locale: "en" | "ko"): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "ko-KR", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

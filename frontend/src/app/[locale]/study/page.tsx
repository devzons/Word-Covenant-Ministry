import Link from "next/link";

import { siteConfig } from "@/config/site";
import { fetchStudyCategories, fetchStudyContents } from "@/lib/api/study";
import {
  buildStudyIndexHref,
  buildStudyLibraryScope,
} from "@/lib/utils/study-library";

type StudyIndexPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const copy = {
  en: {
    title: "Study",
    body: "Read and research Scripture through separate persistent workspaces for sermons, exposition, books, and research papers.",
    sermonsTitle: "Sermons & Exposition",
    sermonsBody: "Move through sermon manuscripts with a persistent taxonomy navigator and right-side reading panel.",
    sermonsAction: "Open sermons & exposition",
    publicationsTitle: "Books & Research Papers",
    publicationsBody: "Open books and research papers inside a separate publication workspace that keeps its own navigator state.",
    publicationsAction: "Open books & research papers",
    sermonsAvailable: "Published sermons",
    publicationsAvailable: "Published publications",
    publicationsEmpty: "No published books or research papers yet",
  },
  ko: {
    title: "말씀연구",
    body: "설교와 강해, 책과 연구논문을 서로 다른 persistent workspace 안에서 읽고 연구할 수 있는 허브입니다.",
    sermonsTitle: "설교와 강해",
    sermonsBody: "taxonomy 기반 Sidebar를 유지한 채 선택한 설교 또는 강해 원고만 오른쪽에서 계속 읽습니다.",
    sermonsAction: "설교와 강해 보기",
    publicationsTitle: "책과 연구논문",
    publicationsBody: "출판물 전용 workspace에서 책과 연구논문을 분리된 탐색 구조로 엽니다.",
    publicationsAction: "책과 연구논문 보기",
    sermonsAvailable: "공개 설교",
    publicationsAvailable: "공개 출판물",
    publicationsEmpty: "아직 공개된 책 또는 연구논문이 없습니다",
  },
} as const;

export const dynamic = "force-dynamic";

export default async function StudyIndexPage({ params }: StudyIndexPageProps) {
  const { locale } = await params;
  const activeLocale = getSupportedLocale(locale);
  const pageCopy = copy[activeLocale];
  const [contents, categories] = await Promise.all([
    fetchStudyContents(activeLocale, { perPage: 100, order: "asc", orderBy: "title" }),
    fetchStudyCategories(activeLocale),
  ]);
  const sermonsScope = buildStudyLibraryScope("sermons", contents, categories);
  const publicationsScope = buildStudyLibraryScope("publications", contents, categories);

  return (
    <section className="flex min-w-0 flex-col gap-8 py-10 sm:py-12">
      <div className="rounded-md border border-zinc-200 bg-white p-6 sm:p-8">
        <div className="flex max-w-4xl flex-col gap-5">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
            Word Covenant Ministry
          </p>
          <h1 className="text-3xl font-semibold text-zinc-950 sm:text-4xl">{pageCopy.title}</h1>
          <p className="text-base leading-7 text-zinc-600">{pageCopy.body}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-md border border-zinc-200 bg-white p-6">
          <div className="flex h-full flex-col gap-5">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
                {pageCopy.sermonsTitle}
              </p>
              <h2 className="text-2xl font-semibold text-zinc-950">{pageCopy.sermonsTitle}</h2>
              <p className="text-sm leading-7 text-zinc-600">{pageCopy.sermonsBody}</p>
            </div>
            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                {pageCopy.sermonsAvailable}
              </p>
              <p className="mt-2 text-2xl font-semibold text-zinc-950">{sermonsScope.items.length}</p>
            </div>
            <div className="mt-auto">
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
                href={buildStudyIndexHref(activeLocale, "sermons")}
              >
                {pageCopy.sermonsAction}
              </Link>
            </div>
          </div>
        </article>

        <article className="rounded-md border border-zinc-200 bg-white p-6">
          <div className="flex h-full flex-col gap-5">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
                {pageCopy.publicationsTitle}
              </p>
              <h2 className="text-2xl font-semibold text-zinc-950">{pageCopy.publicationsTitle}</h2>
              <p className="text-sm leading-7 text-zinc-600">{pageCopy.publicationsBody}</p>
            </div>
            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                {pageCopy.publicationsAvailable}
              </p>
              <p className="mt-2 text-2xl font-semibold text-zinc-950">
                {publicationsScope.items.length}
              </p>
              {publicationsScope.items.length === 0 ? (
                <p className="mt-2 text-sm leading-6 text-zinc-600">{pageCopy.publicationsEmpty}</p>
              ) : null}
            </div>
            <div className="mt-auto">
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
                href={buildStudyIndexHref(activeLocale, "publications")}
              >
                {pageCopy.publicationsAction}
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function getSupportedLocale(locale: string): "en" | "ko" {
  return siteConfig.supportedLocales.includes(
    locale as (typeof siteConfig.supportedLocales)[number],
  ) && locale === "en"
    ? "en"
    : "ko";
}

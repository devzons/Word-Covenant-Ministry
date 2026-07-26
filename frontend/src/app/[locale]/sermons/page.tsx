import Link from "next/link";

import { siteConfig } from "@/config/site";
import { fetchStudyCategories, fetchStudyContents } from "@/lib/api/study";
import { buildStudyDetailHref, buildStudyLibraryScope } from "@/lib/utils/study-library";

type SermonsIndexPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const copy = {
  en: {
    title: "Sermons & Exposition",
    body: "This workspace keeps the sermon navigator persistent while the selected manuscript changes on the right. Grouping is currently taxonomy-based because Bible/topic/series metadata is not yet modeled in the API contract.",
    available: "Published items",
    categories: "Active groups",
    openFirst: "Open first manuscript",
    emptyTitle: "No published sermon content yet",
    emptyBody: "The persistent shell is ready, but no sermon manuscripts are published in the current study archive.",
  },
  ko: {
    title: "설교와 강해",
    body: "이 workspace는 왼쪽 탐색을 유지한 채 오른쪽 원고만 바꾸도록 구성됩니다. 현재 API 계약에는 성경별·주제별·시리즈 metadata가 없으므로 taxonomy 기준 탐색만 지원합니다.",
    available: "공개 콘텐츠",
    categories: "활성 그룹",
    openFirst: "첫 원고 열기",
    emptyTitle: "아직 공개된 설교 콘텐츠가 없습니다",
    emptyBody: "persistent shell은 준비되었지만, 현재 study archive에는 공개된 설교 원고가 없습니다.",
  },
} as const;

export const dynamic = "force-dynamic";

export default async function SermonsIndexPage({ params }: SermonsIndexPageProps) {
  const { locale } = await params;
  const activeLocale = getSupportedLocale(locale);
  const pageCopy = copy[activeLocale];
  const [contents, categories] = await Promise.all([
    fetchStudyContents(activeLocale, { perPage: 100, order: "asc", orderBy: "title" }),
    fetchStudyCategories(activeLocale),
  ]);
  const scope = buildStudyLibraryScope("sermons", contents, categories);
  const firstItem = scope.items[0] ?? null;

  return (
    <section className="flex min-w-0 flex-col gap-6">
      <div className="rounded-md border border-zinc-200 bg-white p-6">
        <div className="flex max-w-4xl flex-col gap-4">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
            Word Covenant Ministry
          </p>
          <h1 className="text-3xl font-semibold text-zinc-950 sm:text-4xl">{pageCopy.title}</h1>
          <p className="text-base leading-7 text-zinc-600">{pageCopy.body}</p>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 xl:max-w-xl">
          <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
              {pageCopy.available}
            </dt>
            <dd className="mt-2 text-2xl font-semibold text-zinc-950">{scope.items.length}</dd>
          </div>
          <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
              {pageCopy.categories}
            </dt>
            <dd className="mt-2 text-2xl font-semibold text-zinc-950">{scope.groups.length}</dd>
          </div>
        </dl>

        {firstItem ? (
          <div className="mt-6">
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
              href={buildStudyDetailHref(activeLocale, "sermons", firstItem.slug)}
              scroll={false}
            >
              {pageCopy.openFirst}
            </Link>
          </div>
        ) : null}
      </div>

      {!firstItem ? (
        <div className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-6">
          <p className="text-lg font-semibold text-zinc-950">{pageCopy.emptyTitle}</p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">{pageCopy.emptyBody}</p>
        </div>
      ) : null}
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

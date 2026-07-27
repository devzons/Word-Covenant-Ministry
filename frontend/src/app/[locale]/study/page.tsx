import Link from "next/link";

import { StudyHubSearch } from "@/components/content/study/StudyHubSearch";
import { siteConfig } from "@/config/site";
import { fetchStudyCategories, fetchStudyContents } from "@/lib/api/study";
import {
  buildStudyDetailHref,
  buildStudyIndexHref,
  type StudyLibraryVariant,
} from "@/lib/utils/study-library";
import type { StudyCategory, StudyContentSummary } from "@/types/study";

type StudyIndexPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const copy = {
  en: {
    title: "Study",
    body: "Explore Scripture research through sermons, exposition, books, research papers, and future visual study resources without mixing their navigation structures.",
    searchHint:
      "Use the current archive scope honestly. Search can go straight into sermons or publications without inventing a cross-library result model.",
    statsPublished: "Published study items",
    statsCategories: "Visible taxonomy groups",
    statsUpdated: "Latest update",
    sermonsTitle: "Sermons & Exposition",
    sermonsBody: "Read sermon manuscripts in a persistent workspace with taxonomy-backed navigation and right-side reading flow.",
    sermonsAction: "Open sermons & exposition",
    publicationsTitle: "Books & Research Papers",
    publicationsBody: "Open books and research papers in a separate workspace that keeps its own navigator and safe empty state.",
    publicationsAction: "Open books & research papers",
    visualsTitle: "Visual Research Resources",
    visualsBody: "Maps, timelines, genealogies, temple diagrams, and structural charts will connect back to Scripture and related studies.",
    visualsAction: "Explore visual study foundation",
    visualsPending: "Visual data model is still being prepared.",
    topicalTitle: "Browse current categories",
    topicalBody: "Only categories with real published items are shown here. This is taxonomy browsing, not a full topic graph yet.",
    topicalAction: "Open category",
    recentTitle: "Recently added or updated",
    recentBody: "Uses real publish and modified dates from the current study archive.",
    recentAction: "Open study item",
    scripturesTitle: "Book-based study discovery",
    scripturesBody:
      "The current archive does not yet expose explicit Scripture-book relationships, so the hub cannot honestly build a Bible-wide discovery grid yet.",
    scripturesPending: "Explicit Scripture relationship metadata is required before 66-book discovery can be shown here.",
    emptyRecent: "No recently updated study items are available yet.",
    noPublications: "No published books or research papers are available yet.",
    noCount: "Not available yet",
    readyLabel: "Available now",
    pendingLabel: "In preparation",
    openWorkspace: "Open workspace",
    openVisuals: "Open visuals foundation",
    updated: "Updated",
    published: "Published",
  },
  ko: {
    title: "말씀연구",
    body: "설교와 강해, 책과 연구논문, 그리고 앞으로 추가될 시각 연구 자료를 통해 성경 말씀을 탐색하는 디지털 연구 허브입니다.",
    searchHint:
      "현재 공개 archive 범위 안에서만 정직하게 검색합니다. 통합 검색 모델을 억지로 만들지 않고 설교와 강해 또는 책과 연구논문 작업공간으로 바로 진입합니다.",
    statsPublished: "공개 자료",
    statsCategories: "표시 가능한 분류",
    statsUpdated: "최신 수정",
    sermonsTitle: "설교와 강해",
    sermonsBody: "taxonomy 기반 Sidebar를 유지한 채 설교와 강해 원고를 오른쪽 읽기 흐름으로 계속 탐색합니다.",
    sermonsAction: "설교와 강해 보기",
    publicationsTitle: "책과 연구논문",
    publicationsBody: "책과 연구논문은 별도 workspace와 안전한 empty state로 유지되며, 향후 출간 자료가 늘어나도 같은 구조를 사용합니다.",
    publicationsAction: "책과 연구논문 보기",
    visualsTitle: "시각 연구 자료",
    visualsBody: "성경 지도, 연대표, 족보, 성막·성전 도표, 구조 차트를 성경 본문과 연결하는 진입 기반입니다.",
    visualsAction: "시각 연구 자료 보기",
    visualsPending: "시각 자료 데이터 구조는 아직 준비 중입니다.",
    topicalTitle: "현재 분류로 살펴보기",
    topicalBody: "현재 공개 자료가 실제로 연결된 taxonomy만 표시합니다. 아직 완전한 주제 그래프는 아닙니다.",
    topicalAction: "이 분류 열기",
    recentTitle: "최근 추가·수정된 자료",
    recentBody: "현재 study archive의 실제 공개일과 수정일만 사용합니다.",
    recentAction: "자료 열기",
    scripturesTitle: "성경별 연구",
    scripturesBody:
      "현재 archive에는 명시적 성경 책 단위 관계 metadata가 없어, 허브에서 66권 기준의 성경별 연구 지도를 정직하게 만들 수 없습니다.",
    scripturesPending: "성경별 연구를 허브에서 제공하려면 explicit Scripture relationship metadata가 먼저 필요합니다.",
    emptyRecent: "최근 업데이트 자료가 아직 없습니다.",
    noPublications: "아직 공개된 책과 연구논문이 없습니다.",
    noCount: "아직 없음",
    readyLabel: "현재 사용 가능",
    pendingLabel: "준비 중",
    openWorkspace: "작업공간 열기",
    openVisuals: "시각 자료 foundation 열기",
    updated: "수정일",
    published: "공개일",
  },
} as const;

export const dynamic = "force-dynamic";

export default async function StudyIndexPage({ params }: StudyIndexPageProps) {
  const { locale } = await params;
  const activeLocale = getSupportedLocale(locale);
  const pageCopy = copy[activeLocale];
  const [contents, categories] = await Promise.all([
    fetchStudyContents(activeLocale, { perPage: 100, order: "desc", orderBy: "modified" }),
    fetchStudyCategories(activeLocale),
  ]);

  const publishedCount = contents.length;
  const visibleCategories = categories.filter((category) => category.count > 0);
  const sermonsCount = countVariantItems(contents, categories, "sermons");
  const publicationsCount = countVariantItems(contents, categories, "publications");
  const lastUpdated = contents
    .map((item) => item.modified || item.date)
    .find((value) => value !== "") ?? "";
  const recentItems = [...contents]
    .sort((left, right) => compareStudyDates(right, left))
    .slice(0, 6);
  const discoverableCategories = visibleCategories
    .filter((category) => resolveCategoryVariant(category, categories) !== null)
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name))
    .slice(0, 8);

  return (
    <section className="flex min-w-0 flex-col gap-8 py-10 sm:gap-10 sm:py-12">
      <section className="rounded-md border border-zinc-200 bg-white p-6 sm:p-8">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] xl:items-start">
          <div className="flex min-w-0 flex-col gap-5">
            <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
              Word Covenant Ministry
            </p>
            <div className="max-w-4xl space-y-4">
              <h1 className="text-3xl font-semibold text-zinc-950 sm:text-4xl">{pageCopy.title}</h1>
              <p className="text-base leading-7 text-zinc-600">{pageCopy.body}</p>
              <p className="text-sm leading-6 text-zinc-500">{pageCopy.searchHint}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
                href={buildStudyIndexHref(activeLocale, "sermons")}
              >
                {pageCopy.sermonsAction}
              </Link>
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
                href={buildStudyIndexHref(activeLocale, "publications")}
              >
                {pageCopy.publicationsAction}
              </Link>
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
                href={`/${activeLocale}/study/visuals`}
              >
                {pageCopy.visualsAction}
              </Link>
            </div>
          </div>

          <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 sm:p-5">
            <StudyHubSearch locale={activeLocale} />
          </div>
        </div>

        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          <MetricCard label={pageCopy.statsPublished} value={String(publishedCount)} />
          <MetricCard label={pageCopy.statsCategories} value={String(visibleCategories.length)} />
          <MetricCard
            label={pageCopy.statsUpdated}
            value={lastUpdated !== "" ? formatLongDate(lastUpdated, activeLocale) : pageCopy.noCount}
          />
        </dl>
      </section>

      <StudySectionHeader
        body={activeLocale === "en"
          ? "Enter each workspace with the navigation structure that fits the material type."
          : "자료 성격에 맞는 탐색 구조를 가진 작업공간으로 바로 들어갑니다."}
        title={activeLocale === "en" ? "Research workspaces" : "연구 작업공간"}
      />
      <div className="grid gap-6 xl:grid-cols-3">
        <EntryCard
          actionHref={buildStudyIndexHref(activeLocale, "sermons")}
          actionLabel={pageCopy.openWorkspace}
          description={pageCopy.sermonsBody}
          metadata={`${pageCopy.readyLabel} · ${sermonsCount}`}
          title={pageCopy.sermonsTitle}
        />
        <EntryCard
          actionHref={buildStudyIndexHref(activeLocale, "publications")}
          actionLabel={pageCopy.openWorkspace}
          description={pageCopy.publicationsBody}
          metadata={`${pageCopy.readyLabel} · ${publicationsCount}`}
          title={pageCopy.publicationsTitle}
        />
        <EntryCard
          actionHref={`/${activeLocale}/study/visuals`}
          actionLabel={pageCopy.openVisuals}
          description={pageCopy.visualsBody}
          metadata={`${pageCopy.pendingLabel} · ${pageCopy.visualsPending}`}
          title={pageCopy.visualsTitle}
        />
      </div>

      <StudySectionHeader body={pageCopy.recentBody} title={pageCopy.recentTitle} />
      {recentItems.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recentItems.map((item) => {
            const variant = resolveItemVariant(item, categories);
            const href = buildStudyDetailHref(activeLocale, variant, item.slug);

            return (
              <Link
                className="rounded-md border border-zinc-200 bg-white p-5 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2"
                href={href}
                key={item.id}
              >
                <div className="flex h-full flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                      {variant === "sermons" ? pageCopy.sermonsTitle : pageCopy.publicationsTitle}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="line-clamp-2 text-lg font-semibold text-zinc-950">{item.title}</h3>
                    {item.excerpt !== "" ? (
                      <div
                        className="line-clamp-3 text-sm leading-6 text-zinc-600 [&_p]:m-0"
                        dangerouslySetInnerHTML={{ __html: item.excerpt }}
                      />
                    ) : null}
                  </div>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-zinc-500">
                    <span>{pageCopy.updated}</span>
                    <span>{formatLongDate(item.modified || item.date, activeLocale)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyPanel body={pageCopy.emptyRecent} />
      )}

      <StudySectionHeader body={pageCopy.topicalBody} title={pageCopy.topicalTitle} />
      {discoverableCategories.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {discoverableCategories.map((category) => {
            const variant = resolveCategoryVariant(category, categories);

            if (!variant) {
              return null;
            }

            return (
              <Link
                className="rounded-md border border-zinc-200 bg-white p-5 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2"
                href={`${buildStudyIndexHref(activeLocale, variant)}?category=${encodeURIComponent(category.slug)}`}
                key={category.id}
              >
                <div className="flex h-full flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
                        {variant === "sermons" ? pageCopy.sermonsTitle : pageCopy.publicationsTitle}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-zinc-950">{category.name}</h3>
                    </div>
                    <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                      {category.count}
                    </span>
                  </div>
                  {category.description !== "" ? (
                    <p className="line-clamp-2 text-sm leading-6 text-zinc-600">{category.description}</p>
                  ) : null}
                  <span className="mt-auto text-sm font-semibold text-zinc-900">
                    {pageCopy.topicalAction}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyPanel
          body={activeLocale === "en"
            ? "No published category group can be shown honestly yet."
            : "정직하게 표시할 수 있는 공개 분류가 아직 충분하지 않습니다."}
        />
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="rounded-md border border-zinc-200 bg-white p-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                {pageCopy.pendingLabel}
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-zinc-950">{pageCopy.scripturesTitle}</h2>
            <p className="text-sm leading-7 text-zinc-600">{pageCopy.scripturesBody}</p>
            <p className="text-sm font-medium text-zinc-700">{pageCopy.scripturesPending}</p>
          </div>
        </div>

        <div className="rounded-md border border-zinc-200 bg-white p-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                {pageCopy.pendingLabel}
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-zinc-950">{pageCopy.visualsTitle}</h2>
            <p className="text-sm leading-7 text-zinc-600">{pageCopy.visualsBody}</p>
            <p className="text-sm font-medium text-zinc-700">{pageCopy.visualsPending}</p>
            <div className="pt-2">
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
                href={`/${activeLocale}/study/visuals`}
              >
                {pageCopy.visualsAction}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {publicationsCount === 0 ? <EmptyPanel body={pageCopy.noPublications} /> : null}
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

function compareStudyDates(left: StudyContentSummary, right: StudyContentSummary): number {
  return toTimestamp(left.modified || left.date) - toTimestamp(right.modified || right.date);
}

function toTimestamp(value: string): number {
  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function countVariantItems(
  contents: StudyContentSummary[],
  categories: StudyCategory[],
  variant: StudyLibraryVariant,
): number {
  return contents.filter((item) => resolveItemVariant(item, categories) === variant).length;
}

function resolveItemVariant(
  item: StudyContentSummary,
  categories: StudyCategory[],
): StudyLibraryVariant {
  const categoryMap = new Map(categories.map((category) => [category.id, category]));

  for (const categoryId of item.studyCategoryIds) {
    const category = categoryMap.get(categoryId);

    if (!category) {
      continue;
    }

    const variant = resolveCategoryVariant(category, categories);

    if (variant) {
      return variant;
    }
  }

  return "sermons";
}

function resolveCategoryVariant(
  category: StudyCategory,
  categories: StudyCategory[],
): StudyLibraryVariant | null {
  const categoryMap = new Map(categories.map((item) => [item.id, item]));
  let current: StudyCategory | undefined = category;

  while (current && current.parent > 0) {
    current = categoryMap.get(current.parent);
  }

  if (!current) {
    return null;
  }

  if (current.slug === "sermon_exposition") {
    return "sermons";
  }

  if (current.slug === "books_papers") {
    return "publications";
  }

  return null;
}

function formatLongDate(value: string, locale: "en" | "ko"): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function StudySectionHeader({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-semibold text-zinc-950">{title}</h2>
      <p className="max-w-4xl text-sm leading-6 text-zinc-600">{body}</p>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
        {label}
      </dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-950">{value}</dd>
    </div>
  );
}

function EntryCard({
  title,
  description,
  metadata,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  metadata: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <article className="rounded-md border border-zinc-200 bg-white p-6">
      <div className="flex h-full flex-col gap-4">
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
            {metadata}
          </p>
          <h3 className="text-2xl font-semibold text-zinc-950">{title}</h3>
          <p className="text-sm leading-7 text-zinc-600">{description}</p>
        </div>
        <div className="mt-auto">
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
            href={actionHref}
          >
            {actionLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}

function EmptyPanel({ body }: { body: string }) {
  return (
    <div className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-6">
      <p className="max-w-3xl text-sm leading-6 text-zinc-600">{body}</p>
    </div>
  );
}

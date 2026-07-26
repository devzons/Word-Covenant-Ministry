"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Dispatch, ReactNode, RefObject, SetStateAction } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils/cn";
import {
  appendStudyQuery,
  buildStudyDetailHref,
  buildStudyIndexHref,
  buildStudyLibraryScope,
  filterStudyLibraryItems,
  resolveOpenGroupSlug,
  type StudyLibraryGroup,
  type StudyLibraryPublicationKind,
  type StudyLibraryVariant,
} from "@/lib/utils/study-library";
import type { StudyCategory, StudyContentSummary } from "@/types/study";

type StudyLibraryWorkspaceProps = {
  children: ReactNode;
  categories: StudyCategory[];
  contents: StudyContentSummary[];
  locale: "en" | "ko";
  variant: StudyLibraryVariant;
};

const copy = {
  en: {
    results: "results",
    search: "Search",
    searchPlaceholder: "Search titles and summaries",
    currentScope: "Current scope",
    navigator: "Navigator",
    empty: "No content matches the current filter.",
    clearSearch: "Clear search",
    all: "All",
    books: "Books",
    papers: "Research Papers",
    sermonsLead: "Taxonomy-based navigation is available now. Bible/topic/series grouping still depends on future metadata.",
    publicationsLead:
      "Books and research papers already use the WordPress study taxonomy. The navigator is ready even when the archive is sparse.",
    openNavigator: "Open navigator",
    closeNavigator: "Close navigator",
    openArchive: "Open archive",
  },
  ko: {
    results: "개",
    search: "검색",
    searchPlaceholder: "제목과 요약 검색",
    currentScope: "현재 범위",
    navigator: "탐색",
    empty: "현재 필터에 맞는 콘텐츠가 없습니다.",
    clearSearch: "검색 지우기",
    all: "전체",
    books: "책",
    papers: "연구논문",
    sermonsLead: "현재는 taxonomy 기반 탐색만 지원합니다. 성경별·주제별·시리즈별 분류는 추후 metadata가 필요합니다.",
    publicationsLead:
      "책과 연구논문은 현재 WordPress study taxonomy를 기준으로 탐색합니다. 아카이브가 적더라도 shell과 route 구조는 유지됩니다.",
    openNavigator: "탐색 열기",
    closeNavigator: "탐색 닫기",
    openArchive: "아카이브 열기",
  },
} as const;

export function StudyLibraryWorkspace({
  children,
  categories,
  contents,
  locale,
  variant,
}: StudyLibraryWorkspaceProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedItemRef = useRef<HTMLAnchorElement | null>(null);
  const selectedSlug = useMemo(() => resolveSelectedSlug(pathname, variant), [pathname, variant]);

  const pageCopy = copy[locale];
  const searchQuery = searchParams.get("q") ?? "";
  const normalizedSearchQuery = searchQuery.trim();
  const publicationKind = getPublicationKind(searchParams.get("kind"));

  const scope = useMemo(
    () => buildStudyLibraryScope(variant, contents, categories, publicationKind),
    [categories, contents, publicationKind, variant],
  );
  const filteredItems = useMemo(
    () => filterStudyLibraryItems(scope, searchQuery),
    [scope, searchQuery],
  );
  const hasSearch = normalizedSearchQuery !== "";
  const autoOpenGroupSlug = useMemo(
    () => resolveOpenGroupSlug(scope, selectedSlug),
    [scope, selectedSlug],
  );
  const [openGroupState, setOpenGroupState] = useState<{
    pathname: string;
    selectedSlug: string | null;
    slug: string | null;
  }>({
    pathname,
    selectedSlug,
    slug: autoOpenGroupSlug,
  });
  const [mobileNavigatorState, setMobileNavigatorState] = useState<{
    pathname: string;
    open: boolean;
  }>({
    pathname,
    open: false,
  });
  const openGroupSlug =
    hasSearch
      ? null
      : openGroupState.pathname === pathname && openGroupState.selectedSlug === selectedSlug
        ? openGroupState.slug ?? autoOpenGroupSlug
        : autoOpenGroupSlug;
  const mobileNavigatorOpen =
    mobileNavigatorState.pathname === pathname ? mobileNavigatorState.open : false;

  useEffect(() => {
    selectedItemRef.current?.scrollIntoView({ block: "nearest" });
  }, [pathname, hasSearch]);

  const resultCountLabel =
    locale === "en"
      ? `${filteredItems.length} ${pageCopy.results}`
      : `${filteredItems.length}${pageCopy.results}`;
  const currentScopeLabel = getCurrentScopeLabel(locale, variant, publicationKind);

  return (
    <div className="py-10 sm:py-12">
      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)] 2xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="min-w-0">
          <div className="xl:sticky xl:top-24">
            <div className="rounded-md border border-zinc-200 bg-zinc-50 xl:max-h-[calc(100vh-7rem)] xl:overflow-hidden">
              <div className="border-b border-zinc-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
                      {pageCopy.navigator}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      {variant === "sermons" ? pageCopy.sermonsLead : pageCopy.publicationsLead}
                    </p>
                  </div>
                  <button
                    className="inline-flex min-h-10 shrink-0 items-center rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-800 xl:hidden"
                    onClick={() =>
                      setMobileNavigatorState((current) => ({
                        pathname,
                        open:
                          current.pathname === pathname
                            ? !current.open
                            : true,
                      }))
                    }
                    type="button"
                  >
                    {mobileNavigatorOpen ? pageCopy.closeNavigator : pageCopy.openNavigator}
                  </button>
                </div>

                {variant === "publications" ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      { key: "all", label: pageCopy.all },
                      { key: "books", label: pageCopy.books },
                      { key: "papers", label: pageCopy.papers },
                    ].map((option) => (
                      <button
                        aria-pressed={publicationKind === option.key}
                        className={cn(
                          "inline-flex min-h-10 items-center rounded-full border px-3 text-sm font-medium transition-colors",
                          publicationKind === option.key
                            ? "border-zinc-900 bg-zinc-900 text-white"
                            : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100",
                        )}
                        key={option.key}
                        onClick={() =>
                          replaceSearchParams(router, pathname, searchParams, {
                            kind: option.key === "all" ? null : option.key,
                          })
                        }
                        type="button"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="mt-4 flex flex-col gap-2">
                  <label className="text-sm font-semibold text-zinc-700" htmlFor={`${variant}-search`}>
                    {pageCopy.search}
                  </label>
                  <input
                    className="min-h-11 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
                    id={`${variant}-search`}
                    name={`${variant}-search`}
                    onChange={(event) =>
                      replaceSearchParams(router, pathname, searchParams, {
                        q: event.currentTarget.value.trim() === "" ? null : event.currentTarget.value,
                      })
                    }
                    placeholder={pageCopy.searchPlaceholder}
                    type="search"
                    value={searchQuery}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-zinc-500">
                    <span>
                      {pageCopy.currentScope}: {currentScopeLabel}
                    </span>
                    <span>{resultCountLabel}</span>
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "min-h-0 xl:overflow-y-auto",
                  mobileNavigatorOpen || hasSearch || pathname.endsWith("/sermons") || pathname.endsWith("/study")
                    ? "block"
                    : "hidden xl:block",
                )}
              >
                <div className="p-3">
                  {hasSearch ? (
                    <div className="grid gap-2">
                      {filteredItems.length > 0 ? (
                        filteredItems.map((item) => {
                          const href = appendStudyQuery(
                            buildStudyDetailHref(locale, variant, item.slug),
                            searchQuery,
                            publicationKind,
                            variant,
                          );

                          return (
                            <Link
                              aria-current={selectedSlug === item.slug ? "page" : undefined}
                              className={cn(
                                "flex flex-col gap-1.5 rounded-md border px-3 py-2.5 text-sm transition-colors",
                                selectedSlug === item.slug
                                  ? "border-zinc-900 bg-zinc-900 text-white"
                                  : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-100",
                              )}
                              href={href}
                              key={item.id}
                              onClick={() =>
                                setMobileNavigatorState({
                                  pathname,
                                  open: false,
                                })
                              }
                              ref={selectedSlug === item.slug ? selectedItemRef : null}
                              scroll={false}
                            >
                              <span className="line-clamp-2 leading-[1.35] font-medium">{item.title}</span>
                              <span
                                className={cn(
                                  "text-xs",
                                  selectedSlug === item.slug ? "text-zinc-200" : "text-zinc-500",
                                )}
                              >
                                {item.branchName ?? item.topLevelName ?? currentScopeLabel}
                              </span>
                            </Link>
                          );
                        })
                      ) : (
                        <div className="rounded-md border border-dashed border-zinc-300 bg-white px-3 py-4 text-sm text-zinc-600">
                          <p>{pageCopy.empty}</p>
                          <button
                            className="mt-3 text-sm font-medium text-zinc-900 underline underline-offset-4"
                            onClick={() => replaceSearchParams(router, pathname, searchParams, { q: null })}
                            type="button"
                          >
                            {pageCopy.clearSearch}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {scope.groups.map((group) => (
                        <StudyLibraryGroupPanel
                          group={group}
                          isOpen={openGroupSlug === group.slug}
                          key={group.id}
                          locale={locale}
                          publicationKind={publicationKind}
                          searchQuery={searchQuery}
                          selectedItemRef={selectedItemRef}
                          selectedSlug={selectedSlug}
                          setOpenGroupSlug={setOpenGroupState}
                          setMobileNavigatorState={setMobileNavigatorState}
                          variant={variant}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}

function resolveSelectedSlug(pathname: string, variant: StudyLibraryVariant): string | null {
  const segments = pathname.split("/").filter(Boolean);

  if (variant === "sermons") {
    const sermonsIndex = segments.indexOf("sermons");

    if (sermonsIndex < 0 || sermonsIndex === segments.length - 1) {
      return null;
    }

    return decodePathSegment(segments[sermonsIndex + 1]);
  }

  const studyIndex = segments.indexOf("study");

  if (studyIndex < 0 || studyIndex === segments.length - 1) {
    return null;
  }

  return decodePathSegment(segments[studyIndex + 1]);
}

function decodePathSegment(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

type StudyLibraryGroupPanelProps = {
  group: StudyLibraryGroup;
  isOpen: boolean;
  locale: "en" | "ko";
  publicationKind: StudyLibraryPublicationKind;
  searchQuery: string;
  selectedItemRef: RefObject<HTMLAnchorElement | null>;
  selectedSlug: string | null;
  setOpenGroupSlug: Dispatch<
    SetStateAction<{
      pathname: string;
      selectedSlug: string | null;
      slug: string | null;
    }>
  >;
  setMobileNavigatorState: Dispatch<
    SetStateAction<{
      pathname: string;
      open: boolean;
    }>
  >;
  variant: StudyLibraryVariant;
};

function StudyLibraryGroupPanel({
  group,
  isOpen,
  locale,
  publicationKind,
  searchQuery,
  selectedItemRef,
  selectedSlug,
  setOpenGroupSlug,
  setMobileNavigatorState,
  variant,
}: StudyLibraryGroupPanelProps) {
  const pathname = usePathname();
  const panelId = `${variant}-group-${group.slug}`;

  return (
    <section className="rounded-md border border-zinc-200 bg-white">
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        className="flex w-full items-start justify-between gap-3 px-3 py-2.5 text-left"
        onClick={() =>
          setOpenGroupSlug({
            pathname,
            selectedSlug,
            slug: group.slug,
          })
        }
        type="button"
      >
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-zinc-900">{group.title}</span>
          {group.description !== "" ? (
            <span className="mt-1 block text-xs leading-5 text-zinc-500">{group.description}</span>
          ) : null}
        </span>
        <span className="shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
          {group.count}
        </span>
      </button>

      {isOpen ? (
        <div className="grid gap-1 border-t border-zinc-200 px-2 py-2.5" id={panelId}>
          {group.items.length > 0 ? (
            group.items.map((item) => {
              const href = appendStudyQuery(
                buildStudyDetailHref(locale, variant, item.slug),
                searchQuery,
                publicationKind,
                variant,
              );

              return (
                <Link
                  aria-current={selectedSlug === item.slug ? "page" : undefined}
                  className={cn(
                    "rounded-md border px-3 py-2.5 text-sm transition-colors",
                    selectedSlug === item.slug
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-transparent text-zinc-800 hover:border-zinc-200 hover:bg-zinc-50",
                  )}
                  href={href}
                  key={item.id}
                  onClick={() =>
                    setMobileNavigatorState({
                      pathname,
                      open: false,
                    })
                  }
                  ref={selectedSlug === item.slug ? selectedItemRef : null}
                  scroll={false}
                >
                  <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
                    <span className="min-w-0 flex-1 line-clamp-2 leading-[1.35] font-medium">
                      {item.title}
                    </span>
                    {item.date !== "" ? (
                      <span
                        className={cn(
                          "shrink-0 text-[11px] font-medium uppercase tracking-[0.08em]",
                          selectedSlug === item.slug ? "text-zinc-200" : "text-zinc-500",
                        )}
                      >
                        {formatShortDate(item.date, locale)}
                      </span>
                    ) : null}
                  </div>
                </Link>
              );
            })
          ) : (
            <Link
              className="rounded-md border border-dashed border-zinc-200 px-3 py-3 text-sm text-zinc-600"
              href={appendStudyQuery(buildStudyIndexHref(locale, variant), searchQuery, publicationKind, variant)}
              scroll={false}
            >
              {locale === "en" ? "No items yet in this group." : "이 그룹에는 아직 콘텐츠가 없습니다."}
            </Link>
          )}
        </div>
      ) : null}
    </section>
  );
}

function replaceSearchParams(
  router: ReturnType<typeof useRouter>,
  pathname: string,
  currentSearchParams: ReturnType<typeof useSearchParams>,
  updates: Record<string, string | null>,
) {
  const params = new URLSearchParams(currentSearchParams.toString());

  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value.trim() === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }

  const query = params.toString();

  router.replace(query === "" ? pathname : `${pathname}?${query}`, { scroll: false });
}

function getPublicationKind(value: string | null): StudyLibraryPublicationKind {
  return value === "books" || value === "papers" ? value : "all";
}

function getCurrentScopeLabel(
  locale: "en" | "ko",
  variant: StudyLibraryVariant,
  publicationKind: StudyLibraryPublicationKind,
): string {
  if (variant === "sermons") {
    return locale === "en" ? "Sermons & Exposition" : "설교와 강해";
  }

  if (publicationKind === "books") {
    return locale === "en" ? "Books" : "책";
  }

  if (publicationKind === "papers") {
    return locale === "en" ? "Research Papers" : "연구논문";
  }

  return locale === "en" ? "Books & Research Papers" : "책과 연구논문";
}

function formatShortDate(value: string, locale: "en" | "ko"): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "ko-KR", {
    month: "short",
    day: "numeric",
  }).format(date);
}

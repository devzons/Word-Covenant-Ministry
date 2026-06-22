import Link from "next/link";

import type { BibleSearchResponse } from "@/types/bible";

type BibleSearchResultsProps = {
  locale: string;
  q: string;
  translation: string;
  page: number;
  perPage: number;
  search: BibleSearchResponse | null;
  errorMessage?: string;
};

export function BibleSearchResults({
  locale,
  q,
  translation,
  page,
  perPage,
  search,
  errorMessage,
}: BibleSearchResultsProps) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const copy = searchCopy[activeLocale];
  const total = search?.total ?? 0;
  const hasPreviousPage = page > 1;
  const hasNextPage = page * perPage < total;

  return (
    <article className="flex w-full flex-col gap-8 py-8 sm:py-12">
      <header className="flex flex-col gap-5 border-b border-zinc-200 pb-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
            {translation}
          </p>
          <h1 className="text-3xl font-semibold text-zinc-950 sm:text-4xl">
            {copy.title}
          </h1>
          <p className="text-sm text-zinc-600">
            {q ? copy.resultsFor(q) : copy.enterQuery}
          </p>
        </div>

        <form
          action={`/${locale}/bible/search`}
          className="grid gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 sm:grid-cols-[1fr_120px_auto]"
          method="get"
        >
          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
            {copy.query}
            <input
              className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-950"
              defaultValue={q}
              minLength={1}
              name="q"
              placeholder="태초"
              type="search"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
            {copy.version}
            <select
              className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-950"
              defaultValue={translation}
              name="translation"
            >
              <option value="KRV">KRV</option>
            </select>
          </label>
          <input name="page" type="hidden" value="1" />
          <input name="per_page" type="hidden" value={perPage} />
          <button
            className="h-11 self-end rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
            type="submit"
          >
            {copy.search}
          </button>
        </form>
      </header>

      {renderSearchState({
        locale,
        copy,
        q,
        search,
        errorMessage,
      })}

      {search && total > 0 ? (
        <nav
          aria-label={copy.pagination}
          className="flex flex-col gap-3 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-zinc-600">
            {copy.totalResults(total)}
          </p>
          <div className="flex items-center gap-3">
            {hasPreviousPage ? (
              <Link
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                href={createSearchHref(locale, q, translation, page - 1, perPage)}
              >
                {copy.previous}
              </Link>
            ) : (
              <span className="rounded-md border border-zinc-200 px-4 py-2 text-sm text-zinc-400">
                {copy.previous}
              </span>
            )}
            <span className="text-sm text-zinc-600">{copy.page(page)}</span>
            {hasNextPage ? (
              <Link
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                href={createSearchHref(locale, q, translation, page + 1, perPage)}
              >
                {copy.next}
              </Link>
            ) : (
              <span className="rounded-md border border-zinc-200 px-4 py-2 text-sm text-zinc-400">
                {copy.next}
              </span>
            )}
          </div>
        </nav>
      ) : null}
    </article>
  );
}

const searchCopy = {
  en: {
    title: "Bible Search",
    enterQuery: "Enter a search query.",
    resultsFor: (q: string) => `Search results for "${q}"`,
    query: "Query",
    version: "Version",
    search: "Search",
    pagination: "Search pagination",
    totalResults: (total: number) => `Total ${total.toLocaleString()} results`,
    previous: "Previous",
    next: "Next",
    page: (page: number) => `Page ${page}`,
    emptyQuery: "Enter a search query.",
    noResults: "No search results.",
  },
  ko: {
    title: "성경 검색",
    enterQuery: "검색어를 입력하세요.",
    resultsFor: (q: string) => `"${q}" 검색 결과`,
    query: "검색어",
    version: "번역",
    search: "검색",
    pagination: "검색 페이지 이동",
    totalResults: (total: number) => `총 ${total.toLocaleString()}개 결과`,
    previous: "이전",
    next: "다음",
    page: (page: number) => `${page}쪽`,
    emptyQuery: "검색어를 입력하세요.",
    noResults: "검색 결과가 없습니다.",
  },
};

function renderSearchState({
  copy,
  locale,
  q,
  search,
  errorMessage,
}: Pick<BibleSearchResultsProps, "locale" | "q" | "search" | "errorMessage"> & {
  copy: (typeof searchCopy)["en"];
}) {
  if (!q) {
    return <StatusMessage message={copy.emptyQuery} />;
  }

  if (errorMessage) {
    return <StatusMessage tone="error" message={errorMessage} />;
  }

  if (!search || search.results.length === 0) {
    return <StatusMessage message={copy.noResults} />;
  }

  return (
    <ol className="flex flex-col gap-1.5">
      {search.results.map((result) => (
        <li
          className="py-1"
          key={`${result.translation}-${result.book}-${result.chapter}-${result.verse}`}
        >
          <Link
            className="block hover:text-zinc-950"
            href={`/${locale}/bible/${result.translation}/${result.book}/${result.chapter}#v${result.verse}`}
          >
            <span className="text-base leading-6 text-zinc-800">
              <HighlightedText text={result.text} query={q} />
              <span className="ml-1 text-sm text-zinc-500">
                ({result.reference} · {result.translation})
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return text;
  }

  const lowerText = text.toLocaleLowerCase();
  const lowerQuery = trimmedQuery.toLocaleLowerCase();
  const parts: Array<{ isMatch: boolean; value: string }> = [];
  let cursor = 0;

  while (cursor < text.length) {
    const matchIndex = lowerText.indexOf(lowerQuery, cursor);

    if (matchIndex === -1) {
      parts.push({ isMatch: false, value: text.slice(cursor) });
      break;
    }

    if (matchIndex > cursor) {
      parts.push({ isMatch: false, value: text.slice(cursor, matchIndex) });
    }

    parts.push({
      isMatch: true,
      value: text.slice(matchIndex, matchIndex + trimmedQuery.length),
    });
    cursor = matchIndex + trimmedQuery.length;
  }

  return (
    <>
      {parts.map((part, index) =>
        part.isMatch ? (
          <strong className="font-bold text-zinc-950" key={`${part.value}-${index}`}>
            {part.value}
          </strong>
        ) : (
          <span key={`${part.value}-${index}`}>{part.value}</span>
        ),
      )}
    </>
  );
}

function StatusMessage({
  message,
  tone = "default",
}: {
  message: string;
  tone?: "default" | "error";
}) {
  const className =
    tone === "error"
      ? "rounded-md border border-red-200 bg-red-50 p-5 text-sm text-red-800"
      : "rounded-md border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-600";

  return <div className={className}>{message}</div>;
}

function createSearchHref(
  locale: string,
  q: string,
  translation: string,
  page: number,
  perPage: number,
) {
  const params = new URLSearchParams({
    q,
    translation,
    page: String(page),
    per_page: String(perPage),
  });

  return `/${locale}/bible/search?${params.toString()}`;
}

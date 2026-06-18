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
  const total = search?.total ?? 0;
  const hasPreviousPage = page > 1;
  const hasNextPage = page * perPage < total;

  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-8 py-8 sm:py-12">
      <header className="flex flex-col gap-5 border-b border-zinc-200 pb-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
            {translation}
          </p>
          <h1 className="text-3xl font-semibold text-zinc-950 sm:text-4xl">
            Bible Search
          </h1>
          <p className="text-sm text-zinc-600">
            {q ? `Search results for "${q}"` : "Enter a search query."}
          </p>
        </div>

        <form
          action={`/${locale}/bible/search`}
          className="grid gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 sm:grid-cols-[1fr_120px_auto]"
          method="get"
        >
          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
            Query
            <input
              className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-950"
              defaultValue={q}
              minLength={2}
              name="q"
              placeholder="태초"
              type="search"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
            Version
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
            Search
          </button>
        </form>
      </header>

      {renderSearchState({
        locale,
        q,
        search,
        errorMessage,
      })}

      {search && total > 0 ? (
        <nav
          aria-label="Search pagination"
          className="flex flex-col gap-3 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-zinc-600">
            Total {total.toLocaleString()} results
          </p>
          <div className="flex items-center gap-3">
            {hasPreviousPage ? (
              <Link
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                href={createSearchHref(locale, q, translation, page - 1, perPage)}
              >
                Previous
              </Link>
            ) : (
              <span className="rounded-md border border-zinc-200 px-4 py-2 text-sm text-zinc-400">
                Previous
              </span>
            )}
            <span className="text-sm text-zinc-600">Page {page}</span>
            {hasNextPage ? (
              <Link
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                href={createSearchHref(locale, q, translation, page + 1, perPage)}
              >
                Next
              </Link>
            ) : (
              <span className="rounded-md border border-zinc-200 px-4 py-2 text-sm text-zinc-400">
                Next
              </span>
            )}
          </div>
        </nav>
      ) : null}
    </article>
  );
}

function renderSearchState({
  locale,
  q,
  search,
  errorMessage,
}: Pick<BibleSearchResultsProps, "locale" | "q" | "search" | "errorMessage">) {
  if (!q) {
    return <StatusMessage message="검색어를 입력하세요." />;
  }

  if (errorMessage) {
    return <StatusMessage tone="error" message={errorMessage} />;
  }

  if (!search || search.results.length === 0) {
    return <StatusMessage message="검색 결과가 없습니다." />;
  }

  return (
    <ol className="flex flex-col gap-4">
      {search.results.map((result) => (
        <li
          className="rounded-md border border-zinc-200 p-4 transition-colors hover:bg-zinc-50"
          key={`${result.translation}-${result.book}-${result.chapter}-${result.verse}`}
        >
          <Link
            className="flex flex-col gap-2"
            href={`/${locale}/bible/${result.translation}/${result.book}/${result.chapter}`}
          >
            <span className="text-sm font-semibold text-zinc-950">
              {result.reference}
            </span>
            <span className="text-base leading-7 text-zinc-800">{result.text}</span>
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-zinc-500">
              {result.translation}
            </span>
          </Link>
        </li>
      ))}
    </ol>
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

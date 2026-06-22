"use client";

import { usePathname, useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { searchBible } from "@/lib/api/bible";
import type { BibleSearchResponse, BibleSearchResult } from "@/types/bible";
import type { OriginalLanguageReaderMode } from "@/types/original-language";

type ReaderSearchPanelProps = {
  initialSearchQuery?: string;
  locale: string;
  mode: OriginalLanguageReaderMode;
  translation: string;
};

const readerSearchCopy = {
  en: {
    title: "Bible Search",
    label: "Search",
    placeholder: "seed, light, covenant",
    submit: "Search",
    loading: "Searching...",
    noResults: "No search results.",
    error: "Search failed. Please try again.",
  },
  ko: {
    title: "성경 검색",
    label: "검색",
    placeholder: "씨, 빛, 언약",
    submit: "검색",
    loading: "검색 중입니다...",
    noResults: "검색 결과가 없습니다.",
    error: "검색에 실패했습니다. 다시 시도해 주세요.",
  },
};

export function ReaderSearchPanel({
  initialSearchQuery = "",
  locale,
  mode,
  translation,
}: ReaderSearchPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const activeLocale = locale === "en" ? "en" : "ko";
  const copy = readerSearchCopy[activeLocale];
  const normalizedInitialQuery = initialSearchQuery.trim();
  const [query, setQuery] = useState(normalizedInitialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(normalizedInitialQuery);
  const [search, setSearch] = useState<BibleSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const trimmedQuery = query.trim();

  useEffect(() => {
    const nextQuery = initialSearchQuery.trim();

    if (!nextQuery) {
      return;
    }

    let isCurrent = true;

    async function loadInitialSearch() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const nextSearch = await searchBible({
          q: nextQuery,
          translation,
          page: 1,
          perPage: 20,
        });

        if (isCurrent) {
          setSearch(nextSearch);
        }
      } catch {
        if (isCurrent) {
          setSearch(null);
          setErrorMessage(copy.error);
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialSearch();

    return () => {
      isCurrent = false;
    };
  }, [copy.error, initialSearchQuery, translation]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!trimmedQuery) {
      setSearch(null);
      setSubmittedQuery("");
      setErrorMessage("");
      router.replace(createReaderCurrentHref({ mode, pathname }));
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSubmittedQuery(trimmedQuery);

    try {
      const nextSearch = await searchBible({
        q: trimmedQuery,
        translation,
        page: 1,
        perPage: 20,
      });
      setSearch(nextSearch);
    } catch {
      setSearch(null);
      setErrorMessage(copy.error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleResultClick(result: BibleSearchResult) {
    router.push(createReaderResultHref({ locale, mode, query: submittedQuery, result }));
  }

  return (
    <aside className="min-w-0 w-full rounded-md border border-zinc-200 bg-zinc-50 p-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      <div className="flex min-w-0 flex-col gap-4">
        <h2 className="text-base font-semibold text-zinc-950">{copy.title}</h2>

        <form className="flex min-w-0 flex-col gap-3" onSubmit={handleSubmit}>
          <label className="flex min-w-0 flex-col gap-1 text-sm font-medium text-zinc-700">
            {copy.label}
            <input
              className="h-11 w-full min-w-0 rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-950"
              minLength={1}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.placeholder}
              type="search"
              value={query}
            />
          </label>
          <button
            className="h-11 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
            disabled={isLoading}
            type="submit"
          >
            {copy.submit}
          </button>
        </form>

        {renderReaderSearchState({
          copy,
          errorMessage,
          isLoading,
          onResultClick: handleResultClick,
          query: submittedQuery,
          search,
        })}
      </div>
    </aside>
  );
}

function renderReaderSearchState({
  copy,
  errorMessage,
  isLoading,
  onResultClick,
  query,
  search,
}: {
  copy: (typeof readerSearchCopy)["en"];
  errorMessage: string;
  isLoading: boolean;
  onResultClick: (result: BibleSearchResult) => void;
  query: string;
  search: BibleSearchResponse | null;
}) {
  if (isLoading) {
    return <ReaderSearchStatus message={copy.loading} />;
  }

  if (errorMessage) {
    return <ReaderSearchStatus message={errorMessage} tone="error" />;
  }

  if (!search) {
    return null;
  }

  if (search.results.length === 0) {
    return <ReaderSearchStatus message={copy.noResults} />;
  }

  return (
    <ol className="flex flex-col gap-1.5">
      {search.results.map((result) => (
        <li
          className="py-1"
          key={`${result.translation}-${result.book}-${result.chapter}-${result.verse}`}
        >
          <button
            className="block w-full text-left hover:text-zinc-950"
            onClick={() => onResultClick(result)}
            type="button"
          >
            <span className="text-base leading-6 text-zinc-800">
              <HighlightedText text={result.text} query={query} />
              <span className="ml-1 text-sm text-zinc-500">
                ({result.reference} · {result.translation})
              </span>
            </span>
          </button>
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

function ReaderSearchStatus({
  message,
  tone = "default",
}: {
  message: string;
  tone?: "default" | "error";
}) {
  const className =
    tone === "error"
      ? "rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"
      : "rounded-md border border-zinc-200 bg-white p-3 text-sm text-zinc-600";

  return <div className={className}>{message}</div>;
}

function createReaderResultHref({
  locale,
  mode,
  query,
  result,
}: {
  locale: string;
  mode: OriginalLanguageReaderMode;
  query: string;
  result: BibleSearchResult;
}) {
  const params = new URLSearchParams({ mode });
  const trimmedQuery = query.trim();

  if (trimmedQuery) {
    params.set("q", trimmedQuery);
  }

  return `/${locale}/bible/${result.translation}/${result.book}/${result.chapter}?${params.toString()}#v${result.verse}`;
}

function createReaderCurrentHref({
  mode,
  pathname,
}: {
  mode: OriginalLanguageReaderMode;
  pathname: string;
}) {
  const params = new URLSearchParams({ mode });

  return `${pathname}?${params.toString()}`;
}

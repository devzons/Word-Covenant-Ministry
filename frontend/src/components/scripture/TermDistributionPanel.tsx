"use client";

import { useEffect, useState } from "react";

import { getWordStudyTermDistribution } from "@/lib/api/original-language";
import type {
  WordStudyTermBookDistribution,
  WordStudyTermDistributionResponse,
} from "@/types/original-language";

type TermDistributionPanelProps = {
  locale?: string;
  termId: number;
  onBack: () => void;
  onOpenOccurrences?: () => void;
};

const termDistributionPanelCopy = {
  en: {
    title: "Distribution",
    back: "Back to Term Study",
    loading: "Loading distribution...",
    error: "Distribution could not be loaded.",
    empty: "No distribution returned.",
    totalOccurrences: "Total Occurrences",
    bookCount: "Books",
    chapterCount: "Chapters",
    books: "Book Distribution",
    occurrences: "occurrences",
    viewAllOccurrences: "View all occurrences",
  },
  ko: {
    title: "분포",
    back: "단어 연구로 돌아가기",
    loading: "분포를 불러오는 중입니다...",
    error: "분포를 불러올 수 없습니다.",
    empty: "분포 정보가 없습니다.",
    totalOccurrences: "총 출현",
    bookCount: "출현 책",
    chapterCount: "출현 장",
    books: "책별 분포",
    occurrences: "회",
    viewAllOccurrences: "전체 출현 보기",
  },
};

export function TermDistributionPanel({
  locale = "en",
  termId,
  onBack,
  onOpenOccurrences,
}: TermDistributionPanelProps) {
  const activeLocale = locale === "ko" ? "ko" : "en";
  const copy = termDistributionPanelCopy[activeLocale];
  const [expandedBook, setExpandedBook] = useState<number | null>(null);
  const [data, setData] = useState<WordStudyTermDistributionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadDistribution() {
      setIsLoading(true);
      setErrorMessage("");
      setData(null);

      try {
        const response = await getWordStudyTermDistribution(termId);

        if (isCurrent) {
          setData(response);
          setExpandedBook(response.books[0]?.book.id ?? null);
        }
      } catch {
        if (isCurrent) {
          setErrorMessage(copy.error);
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    void loadDistribution();

    return () => {
      isCurrent = false;
    };
  }, [copy.error, termId]);

  return (
    <div>
      <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
            {copy.title}
          </p>
          <h2 className="mt-1 break-words text-2xl font-semibold text-zinc-950">
            {data?.term.lemma ?? `#${termId}`}
          </h2>
        </div>
        <button
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
          onClick={onBack}
          type="button"
        >
          {copy.back}
        </button>
      </div>

      <div className="mt-5">
        {renderDistributionState({
          copy,
          data,
          errorMessage,
          expandedBook,
          isLoading,
          locale: activeLocale,
          onOpenOccurrences,
          onToggleBook: (bookId) =>
            setExpandedBook((currentBookId) => (currentBookId === bookId ? null : bookId)),
        })}
      </div>
    </div>
  );
}

function renderDistributionState({
  copy,
  data,
  errorMessage,
  expandedBook,
  isLoading,
  locale,
  onOpenOccurrences,
  onToggleBook,
}: {
  copy: (typeof termDistributionPanelCopy)["en"];
  data: WordStudyTermDistributionResponse | null;
  errorMessage: string;
  expandedBook: number | null;
  isLoading: boolean;
  locale: "en" | "ko";
  onOpenOccurrences?: () => void;
  onToggleBook: (bookId: number) => void;
}) {
  if (isLoading) {
    return <p className="text-sm text-zinc-600">{copy.loading}</p>;
  }

  if (errorMessage) {
    return <p className="text-sm text-red-700">{errorMessage}</p>;
  }

  if (!data) {
    return <p className="text-sm text-zinc-600">{copy.empty}</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      <dl className="grid gap-3 text-sm">
        <SummaryField
          label={copy.totalOccurrences}
          value={data.summary.total_occurrences.toLocaleString()}
        />
        <SummaryField label={copy.bookCount} value={data.summary.book_count.toLocaleString()} />
        <SummaryField
          label={copy.chapterCount}
          value={data.summary.chapter_count.toLocaleString()}
        />
      </dl>

      {onOpenOccurrences ? (
        <button
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
          onClick={onOpenOccurrences}
          type="button"
        >
          {copy.viewAllOccurrences}
        </button>
      ) : null}

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
          {copy.books}
        </h3>
        {data.books.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-2">
            {data.books.map((bookDistribution) => (
              <BookDistributionItem
                bookDistribution={bookDistribution}
                copy={copy}
                expandedBook={expandedBook}
                key={bookDistribution.book.id}
                locale={locale}
                onToggleBook={onToggleBook}
              />
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-zinc-600">{copy.empty}</p>
        )}
      </section>
    </div>
  );
}

function BookDistributionItem({
  bookDistribution,
  copy,
  expandedBook,
  locale,
  onToggleBook,
}: {
  bookDistribution: WordStudyTermBookDistribution;
  copy: (typeof termDistributionPanelCopy)["en"];
  expandedBook: number | null;
  locale: "en" | "ko";
  onToggleBook: (bookId: number) => void;
}) {
  const isExpanded = expandedBook === bookDistribution.book.id;
  const bookName =
    locale === "ko" ? bookDistribution.book.name_ko : bookDistribution.book.name_en;

  return (
    <li className="rounded-md border border-zinc-200 bg-zinc-50">
      <button
        aria-expanded={isExpanded}
        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition-colors hover:bg-white"
        onClick={() => onToggleBook(bookDistribution.book.id)}
        type="button"
      >
        <span className="font-semibold text-zinc-950">{bookName}</span>
        <span className="text-sm text-zinc-600">
          {bookDistribution.occurrence_count.toLocaleString()} {copy.occurrences}
        </span>
      </button>
      {isExpanded ? (
        <ol className="border-t border-zinc-200 bg-white px-3 py-2">
          {bookDistribution.chapters.map((chapter) => (
            <li
              className="flex items-center justify-between gap-3 py-1 text-sm"
              key={chapter.chapter}
            >
              <span className="text-zinc-700">{chapterLabel(chapter.chapter, locale)}</span>
              <span className="font-medium text-zinc-950">
                {chapter.occurrence_count.toLocaleString()}
              </span>
            </li>
          ))}
        </ol>
      ) : null}
    </li>
  );
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-zinc-500">{label}</dt>
      <dd className="mt-1 break-words text-base text-zinc-950">{value}</dd>
    </div>
  );
}

function chapterLabel(chapter: number, locale: "en" | "ko"): string {
  if (locale === "ko") {
    return `${chapter.toLocaleString()}장`;
  }

  return `Chapter ${chapter.toLocaleString()}`;
}

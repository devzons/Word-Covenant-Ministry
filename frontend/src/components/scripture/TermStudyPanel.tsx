"use client";

import { useEffect, useState } from "react";

import { TermDistributionPanel } from "@/components/scripture/TermDistributionPanel";
import { TermOccurrenceExplorer } from "@/components/scripture/TermOccurrenceExplorer";
import {
  getWordStudyTerm,
  getWordStudyTermDistribution,
} from "@/lib/api/original-language";
import { formatOriginalLanguageMorphology } from "@/lib/original-language/morphology";
import type {
  OriginalLanguageOccurrence,
  OriginalLanguageTerm,
  WordStudyTermDistributionResponse,
  WordStudyTermResponse,
} from "@/types/original-language";

type TermStudyPanelProps = {
  backLabel?: string;
  locale?: string;
  termId: number;
  onBack: () => void;
};

const termStudyPanelCopy = {
  en: {
    title: "Term Study",
    loading: "Loading term study...",
    error: "Term study could not be loaded.",
    empty: "No term study loaded.",
    back: "Back",
    lemma: "Lemma",
    strongs: "Strong's",
    strongsExtended: "Strong's Extended",
    transliteration: "Transliteration",
    gloss: "Gloss",
    englishGloss: "Gloss",
    totalOccurrences: "Total Occurrences",
    bookCount: "Books",
    chapterCount: "Chapters",
    scriptureInsight: "Scripture Insight",
    commonBooks: "Most frequent books",
    samples: "Sample Occurrences",
    sourceRef: "Reference",
    surfaceForm: "Form",
    morphology: "Morphology",
    page: "Page",
    perPage: "Per Page",
    noSamples: "No sample occurrences returned.",
    viewAllOccurrences: "View all occurrences",
    viewDistribution: "View Distribution",
  },
  ko: {
    title: "단어 연구",
    loading: "단어 연구를 불러오는 중입니다...",
    error: "단어 연구를 불러올 수 없습니다.",
    empty: "단어 연구가 불러와지지 않았습니다.",
    back: "뒤로",
    lemma: "원형",
    strongs: "스트롱 번호",
    strongsExtended: "확장 스트롱 번호",
    transliteration: "음역",
    gloss: "뜻",
    englishGloss: "영어 뜻",
    totalOccurrences: "총 출현",
    bookCount: "출현 책",
    chapterCount: "출현 장",
    scriptureInsight: "성경 사용 요약",
    commonBooks: "많이 나오는 책",
    samples: "출현 예시",
    sourceRef: "참조",
    surfaceForm: "표기",
    morphology: "형태",
    page: "페이지",
    perPage: "페이지당",
    noSamples: "출현 예시가 없습니다.",
    viewAllOccurrences: "전체 출현 보기",
    viewDistribution: "분포 보기",
  },
};

export function TermStudyPanel({
  backLabel,
  locale = "en",
  termId,
  onBack,
}: TermStudyPanelProps) {
  const [panelView, setPanelView] = useState<"summary" | "distribution" | "occurrences">(
    "summary",
  );
  const [data, setData] = useState<WordStudyTermResponse | null>(null);
  const [distribution, setDistribution] = useState<WordStudyTermDistributionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const activeLocale = locale === "ko" ? "ko" : "en";
  const copy = termStudyPanelCopy[activeLocale];

  useEffect(() => {
    let isCurrent = true;

    async function loadTermStudy() {
      setIsLoading(true);
      setErrorMessage("");
      setData(null);

      try {
        const response = await getWordStudyTerm(termId);

        if (isCurrent) {
          setData(response);
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

    void loadTermStudy();

    return () => {
      isCurrent = false;
    };
  }, [copy.error, termId]);

  useEffect(() => {
    let isCurrent = true;

    async function loadScriptureInsight() {
      setDistribution(null);

      try {
        const response = await getWordStudyTermDistribution(termId);

        if (isCurrent) {
          setDistribution(response);
        }
      } catch {
        if (isCurrent) {
          setDistribution(null);
        }
      }
    }

    void loadScriptureInsight();

    return () => {
      isCurrent = false;
    };
  }, [termId]);

  if (panelView === "occurrences") {
    return (
      <TermOccurrenceExplorer
        locale={activeLocale}
        onBack={() => setPanelView("summary")}
        onOpenDistribution={() => setPanelView("distribution")}
        termId={termId}
      />
    );
  }

  if (panelView === "distribution") {
    return (
      <TermDistributionPanel
        locale={activeLocale}
        onBack={() => setPanelView("summary")}
        onOpenOccurrences={() => setPanelView("occurrences")}
        termId={termId}
      />
    );
  }

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
          {backLabel ?? copy.back}
        </button>
      </div>

      <div className="mt-5">
        {renderTermStudyState({
          copy,
          data,
          distribution,
          errorMessage,
          isLoading,
          locale: activeLocale,
          onOpenDistribution: () => setPanelView("distribution"),
          onOpenOccurrences: () => setPanelView("occurrences"),
        })}
      </div>
    </div>
  );
}

function renderTermStudyState({
  copy,
  data,
  distribution,
  errorMessage,
  isLoading,
  locale,
  onOpenDistribution,
  onOpenOccurrences,
}: {
  copy: (typeof termStudyPanelCopy)["en"];
  data: WordStudyTermResponse | null;
  distribution: WordStudyTermDistributionResponse | null;
  errorMessage: string;
  isLoading: boolean;
  locale: "en" | "ko";
  onOpenDistribution: () => void;
  onOpenOccurrences: () => void;
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

  const transliteration = localizedTransliteration(data.term, locale);
  const gloss = localizedGloss(data.term, locale);

  return (
    <div className="flex flex-col gap-5">
      <dl className="grid gap-3 text-sm">
        <SummaryField label={copy.lemma} value={data.term.lemma} />
        <SummaryField label={copy.strongs} value={data.term.strongs_number} />
        <SummaryField label={copy.strongsExtended} value={data.term.strongs_extended} />
        {transliteration.value ? (
          <SummaryField label={copy.transliteration} value={transliteration.value} />
        ) : null}
        {gloss.value ? <SummaryField label={gloss.label} value={gloss.value} /> : null}
        <SummaryField
          label={copy.totalOccurrences}
          value={data.summary.total_occurrences.toLocaleString()}
        />
        <SummaryField label={copy.bookCount} value={data.summary.book_count.toLocaleString()} />
        <SummaryField
          label={copy.chapterCount}
          value={data.summary.chapter_count.toLocaleString()}
        />
        <SummaryField label={copy.page} value={data.page.toLocaleString()} />
        <SummaryField label={copy.perPage} value={data.per_page.toLocaleString()} />
      </dl>

      {distribution ? (
        <ScriptureInsight
          copy={copy}
          distribution={distribution}
          locale={locale}
          onOpenDistribution={onOpenDistribution}
          onOpenOccurrences={onOpenOccurrences}
        />
      ) : null}

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
            {copy.samples}
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
              onClick={onOpenDistribution}
              type="button"
            >
              {copy.viewDistribution}
            </button>
            <button
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
              onClick={onOpenOccurrences}
              type="button"
            >
              {copy.viewAllOccurrences}
            </button>
          </div>
        </div>
        {data.sample_occurrences.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-2">
            {data.sample_occurrences.map((occurrence) => (
              <SampleOccurrence
                copy={copy}
                key={occurrence.id}
                locale={locale}
                occurrence={occurrence}
              />
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-zinc-600">{copy.noSamples}</p>
        )}
      </section>
    </div>
  );
}

function ScriptureInsight({
  copy,
  distribution,
  locale,
  onOpenDistribution,
  onOpenOccurrences,
}: {
  copy: (typeof termStudyPanelCopy)["en"];
  distribution: WordStudyTermDistributionResponse;
  locale: "en" | "ko";
  onOpenDistribution: () => void;
  onOpenOccurrences: () => void;
}) {
  const topBooks = distribution.books
    .slice()
    .sort((first, second) => second.occurrence_count - first.occurrence_count)
    .slice(0, 3);

  return (
    <section className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
          {copy.scriptureInsight}
        </h3>
        <p className="text-base font-semibold text-zinc-950">
          {insightSummary(distribution, locale)}
        </p>
        {topBooks.length > 0 ? (
          <p className="text-sm leading-6 text-zinc-700">
            <span className="font-semibold text-zinc-500">{copy.commonBooks}: </span>
            {topBooks
              .map((book) => {
                const bookName = locale === "ko" ? book.book.name_ko : book.book.name_en;

                return `${bookName} ${book.occurrence_count.toLocaleString()}`;
              })
              .join(", ")}
          </p>
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
          onClick={onOpenDistribution}
          type="button"
        >
          {copy.viewDistribution}
        </button>
        <button
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
          onClick={onOpenOccurrences}
          type="button"
        >
          {copy.viewAllOccurrences}
        </button>
      </div>
    </section>
  );
}

function insightSummary(
  distribution: WordStudyTermDistributionResponse,
  locale: "en" | "ko",
): string {
  const totalOccurrences = distribution.summary.total_occurrences.toLocaleString();
  const bookCount = distribution.summary.book_count.toLocaleString();
  const chapterCount = distribution.summary.chapter_count.toLocaleString();

  if (locale === "ko") {
    return `총 ${totalOccurrences}회 · ${bookCount}권 · ${chapterCount}장`;
  }

  return `${totalOccurrences} total · ${bookCount} books · ${chapterCount} chapters`;
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-zinc-500">{label}</dt>
      <dd className="mt-1 break-words text-base text-zinc-950">{value}</dd>
    </div>
  );
}

function SampleOccurrence({
  copy,
  locale,
  occurrence,
}: {
  copy: (typeof termStudyPanelCopy)["en"];
  locale: "en" | "ko";
  occurrence: OriginalLanguageOccurrence;
}) {
  const morphology = formatOriginalLanguageMorphology(occurrence.morphology, locale);

  return (
    <li className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold text-zinc-950">{occurrence.source_ref}</p>
        <p className="text-zinc-600">{occurrence.surface_form}</p>
      </div>
      {morphology.display ? (
        <p className="mt-2 text-zinc-700">
          <span className="font-semibold text-zinc-500">{copy.morphology}: </span>
          {morphology.display}
        </p>
      ) : null}
    </li>
  );
}

function localizedTransliteration(
  term: Pick<OriginalLanguageTerm, "transliteration" | "transliteration_ko">,
  locale: "en" | "ko",
): { value: string } {
  if (locale === "ko" && term.transliteration_ko) {
    return {
      value: term.transliteration_ko,
    };
  }

  return {
    value: term.transliteration,
  };
}

function localizedGloss(
  term: Pick<OriginalLanguageTerm, "gloss" | "gloss_ko">,
  locale: "en" | "ko",
): { label: string; value: string } {
  if (locale === "ko" && term.gloss_ko) {
    return {
      label: termStudyPanelCopy.ko.gloss,
      value: term.gloss_ko,
    };
  }

  return {
    label: locale === "ko" ? termStudyPanelCopy.ko.englishGloss : termStudyPanelCopy.en.gloss,
    value: term.gloss || "",
  };
}

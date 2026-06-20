"use client";

import { useEffect, useState } from "react";

import { getWordStudyStrong } from "@/lib/api/original-language";
import type { WordStudyStrongsResponse, WordStudyTerm } from "@/types/original-language";

type StrongStudyPanelProps = {
  backLabel?: string;
  locale?: string;
  strongsNumber: string;
  onBack: () => void;
};

const strongStudyPanelCopy = {
  en: {
    title: "Strong Study",
    loading: "Loading Strong study...",
    error: "Strong study could not be loaded.",
    empty: "No Strong study loaded.",
    strongsNumber: "Strong's Number",
    language: "Language",
    totalTerms: "Total Terms",
    totalOccurrences: "Total Occurrences",
    groupedTerms: "Grouped Terms",
    gloss: "Gloss",
    englishGloss: "Gloss",
    terms: "terms",
    noGroupedTerms: "No grouped terms returned.",
  },
  ko: {
    title: "Strong 연구",
    loading: "Strong 연구를 불러오는 중입니다...",
    error: "Strong 연구를 불러올 수 없습니다.",
    empty: "Strong 연구가 불러와지지 않았습니다.",
    strongsNumber: "스트롱 번호",
    language: "언어",
    totalTerms: "총 단어",
    totalOccurrences: "총 출현",
    groupedTerms: "묶인 단어",
    gloss: "뜻",
    englishGloss: "영어 뜻",
    terms: "단어",
    noGroupedTerms: "묶인 단어가 없습니다.",
  },
};

export function StrongStudyPanel({
  backLabel = "Back",
  locale = "en",
  strongsNumber,
  onBack,
}: StrongStudyPanelProps) {
  const [data, setData] = useState<WordStudyStrongsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const activeLocale = locale === "ko" ? "ko" : "en";
  const copy = strongStudyPanelCopy[activeLocale];

  useEffect(() => {
    let isCurrent = true;

    async function loadStrongStudy() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getWordStudyStrong(strongsNumber);

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

    void loadStrongStudy();

    return () => {
      isCurrent = false;
    };
  }, [copy.error, strongsNumber]);

  return (
    <div>
      <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
            {copy.title}
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
            {strongsNumber}
          </h2>
        </div>
        <button
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
          onClick={onBack}
          type="button"
        >
          {backLabel}
        </button>
      </div>

      <div className="mt-5">
        {renderStrongStudyState({
          copy,
          data,
          errorMessage,
          isLoading,
          locale: activeLocale,
        })}
      </div>
    </div>
  );
}

function renderStrongStudyState({
  copy,
  data,
  errorMessage,
  isLoading,
  locale,
}: {
  copy: (typeof strongStudyPanelCopy)["en"];
  data: WordStudyStrongsResponse | null;
  errorMessage: string;
  isLoading: boolean;
  locale: "en" | "ko";
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
        <SummaryField label={copy.strongsNumber} value={data.strongs_number} />
        <SummaryField label={copy.language} value={languageLabel(data.language_type, copy)} />
        <SummaryField label={copy.totalTerms} value={data.total_terms.toLocaleString()} />
        <SummaryField
          label={copy.totalOccurrences}
          value={data.total_occurrences.toLocaleString()}
        />
      </dl>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
          {copy.groupedTerms}
        </h3>
        {data.terms_by_extended.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {data.terms_by_extended.map((group) => (
              <li
                className="rounded-md border border-zinc-200 bg-zinc-50 p-3"
                key={group.strongs_extended}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-zinc-950">
                    {group.strongs_extended}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {group.term_count.toLocaleString()} {copy.terms}
                  </p>
                </div>

                <ul className="mt-3 flex flex-col gap-2">
                  {group.terms.map((term) => {
                    const transliteration = localizedTransliteration(term, locale);
                    const gloss = localizedGloss(term, locale);

                    return (
                      <li
                        className="rounded border border-zinc-200 bg-white p-2"
                        key={term.id}
                      >
                        <p className="font-semibold text-zinc-950">{term.lemma}</p>
                        {transliteration.value ? (
                          <p
                            className={
                              transliteration.isFallback
                                ? "text-sm italic text-zinc-500"
                                : "text-sm text-zinc-600"
                            }
                          >
                            {transliteration.value}
                          </p>
                        ) : null}
                        {gloss.value ? (
                          <p
                            className={
                              gloss.isFallback
                                ? "mt-1 text-sm italic text-zinc-700"
                                : "mt-1 text-sm text-zinc-800"
                            }
                          >
                            <span className="font-semibold text-zinc-500">
                              {gloss.label}:{" "}
                            </span>
                            {gloss.value}
                          </p>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-600">{copy.noGroupedTerms}</p>
        )}
      </div>
    </div>
  );
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-zinc-500">{label}</dt>
      <dd className="mt-1 text-base text-zinc-950">{value}</dd>
    </div>
  );
}

function languageLabel(
  languageType: WordStudyStrongsResponse["language_type"],
  copy: (typeof strongStudyPanelCopy)["en"],
): string {
  if (copy === strongStudyPanelCopy.ko) {
    return languageType === "hebrew" ? "히브리어" : "헬라어";
  }

  return languageType;
}

function localizedTransliteration(
  term: Pick<WordStudyTerm, "transliteration" | "transliteration_ko">,
  locale: "en" | "ko",
): { value: string; isFallback: boolean } {
  if (locale === "ko" && term.transliteration_ko) {
    return {
      value: term.transliteration_ko,
      isFallback: false,
    };
  }

  return {
    value: term.transliteration,
    isFallback: locale === "ko",
  };
}

function localizedGloss(
  term: Pick<WordStudyTerm, "gloss" | "gloss_ko">,
  locale: "en" | "ko",
): { label: string; value: string; isFallback: boolean } {
  if (locale === "ko" && term.gloss_ko) {
    return {
      label: strongStudyPanelCopy.ko.gloss,
      value: term.gloss_ko,
      isFallback: false,
    };
  }

  return {
    label: locale === "ko" ? strongStudyPanelCopy.ko.englishGloss : strongStudyPanelCopy.en.gloss,
    value: term.gloss || "",
    isFallback: locale === "ko",
  };
}

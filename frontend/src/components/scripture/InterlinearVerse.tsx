"use client";

import { useEffect, useState } from "react";

import {
  OriginalWordPanel,
  type OriginalWordPanelWord,
} from "@/components/scripture/OriginalWordPanel";
import { getInterlinearVerse } from "@/lib/api/original-language";
import { formatMorphology } from "@/lib/utils/morphology";
import type {
  HighLevelInterlinearResponse,
  HighLevelInterlinearToken,
  OriginalLanguageTerm,
  OriginalLanguageType,
  OriginalLanguageSourceDataset,
} from "@/types/original-language";

type InterlinearVerseProps = {
  source: OriginalLanguageSourceDataset;
  book: string;
  chapter: number;
  verse: number | null;
  locale: string;
};

type InterlinearCache = Record<number, HighLevelInterlinearResponse>;

const interlinearCopy = {
  en: {
    transliteration: "Transliteration",
    lemma: "Lemma",
    strongs: "Strong's",
    gloss: "Gloss",
    englishGloss: "Gloss",
    morphology: "Morphology",
    notProvided: "Not provided",
    selectVerse: "Select a verse to view interlinear details.",
    loading: "Loading interlinear verse...",
    error: "Interlinear verse could not be loaded.",
  },
  ko: {
    transliteration: "음역",
    lemma: "원형",
    strongs: "스트롱 번호",
    gloss: "뜻",
    englishGloss: "영어 뜻",
    morphology: "형태",
    notProvided: "제공되지 않음",
    selectVerse: "인터리니어를 보려면 절을 선택하세요.",
    loading: "인터리니어 절을 불러오는 중입니다...",
    error: "인터리니어 절을 불러올 수 없습니다.",
  },
};

type ActiveLocale = "en" | "ko";

type TransliterationDisplay = {
  value: string;
  isFallback: boolean;
};

export function InterlinearVerse({
  source,
  book,
  chapter,
  verse,
  locale,
}: InterlinearVerseProps) {
  const [cache, setCache] = useState<InterlinearCache>({});
  const [loadingVerse, setLoadingVerse] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedWord, setSelectedWord] = useState<OriginalWordPanelWord | null>(null);
  const selectedData = verse ? cache[verse] : null;
  const activeLocale = locale === "en" ? "en" : "ko";
  const copy = interlinearCopy[activeLocale];

  useEffect(() => {
    let isCurrent = true;

    async function loadInterlinearVerse(selectedVerse: number) {
      if (cache[selectedVerse]) {
        return;
      }

      setLoadingVerse(selectedVerse);
      setErrorMessage("");

      try {
        const response = await getInterlinearVerse(source, book, chapter, selectedVerse);

        if (isCurrent) {
          setCache((currentCache) => ({
            ...currentCache,
            [selectedVerse]: response,
          }));
        }
      } catch {
        if (isCurrent) {
          setErrorMessage(copy.error);
        }
      } finally {
        if (isCurrent) {
          setLoadingVerse(null);
        }
      }
    }

    if (verse) {
      void loadInterlinearVerse(verse);
    }

    return () => {
      isCurrent = false;
    };
  }, [book, cache, chapter, copy.error, source, verse]);

  if (!verse) {
    return (
      <div className="rounded-md border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-600">
        {copy.selectVerse}
      </div>
    );
  }

  if (loadingVerse === verse && !selectedData) {
    return (
      <div className="rounded-md border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-600">
        {copy.loading}
      </div>
    );
  }

  if (errorMessage && !selectedData) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-5 text-sm text-red-800">
        {errorMessage}
      </div>
    );
  }

  if (!selectedData) {
    return null;
  }

  const sentenceDirection = originalSentenceDirection(selectedData.tokens);

  return (
    <section
      aria-label={`${localizedReference(selectedData, activeLocale)} interlinear`}
      className="rounded-md border border-zinc-200 bg-white p-4 shadow-sm ring-1 ring-zinc-100 sm:p-5"
    >
      <div className="flex flex-col gap-7">
        <div className="min-w-0">
          <ul
            className="flex max-w-4xl flex-wrap items-end gap-x-3 gap-y-5 text-zinc-950"
            dir={sentenceDirection}
          >
            {selectedData.tokens.map((token) => {
              const transliteration = getLocalizedTransliteration(token.term, activeLocale);
              const gloss = getLocalizedGloss(token.term, activeLocale);

              return (
                <li className="inline-flex" key={token.id}>
                  <button
                    className="group relative inline-flex flex-col items-center rounded px-1.5 py-1 text-center transition-colors hover:bg-zinc-100 focus-visible:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                    onClick={() => setSelectedWord(toPanelWord(token))}
                    type="button"
                  >
                    <span
                      className="text-xl font-semibold leading-8 text-zinc-950"
                      dir={textDirection(token.term.language_type)}
                    >
                      {token.surface_form}
                    </span>
                    <span className={transliterationClassName(transliteration.isFallback)}>
                      {transliteration.value || copy.notProvided}
                    </span>
                    <span
                      className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 hidden w-64 -translate-x-1/2 rounded-md border border-zinc-200 bg-white p-3 text-left text-xs leading-5 text-zinc-700 shadow-lg group-hover:block group-focus-visible:block"
                      dir="ltr"
                      role="tooltip"
                    >
                      <TooltipField label={copy.lemma} value={token.term.lemma} />
                      <TooltipField label={copy.strongs} value={token.term.strongs_number} />
                      <TooltipField
                        label={gloss.label}
                        value={gloss.value || copy.notProvided}
                      />
                      <TooltipField
                        label={copy.morphology}
                        value={
                          formatMorphology(token.morphology, activeLocale).display ||
                          copy.notProvided
                        }
                      />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <OriginalWordPanel
        locale={activeLocale}
        word={selectedWord}
        onClose={() => setSelectedWord(null)}
      />
    </section>
  );
}

function toPanelWord(token: HighLevelInterlinearToken): OriginalWordPanelWord {
  return {
    surface_form: token.surface_form,
    lemma: token.term.lemma,
    strongs_number: token.term.strongs_number,
    strongs_extended: token.term.strongs_extended,
    transliteration: token.term.transliteration,
    transliteration_ko: token.term.transliteration_ko,
    gloss: token.term.gloss,
    gloss_ko: token.term.gloss_ko,
    morphology: token.morphology,
  };
}

function textDirection(languageType: OriginalLanguageType): "ltr" | "rtl" {
  return languageType === "hebrew" ? "rtl" : "ltr";
}

function originalSentenceDirection(tokens: HighLevelInterlinearToken[]): "ltr" | "rtl" {
  return tokens.some((token) => token.term.language_type === "hebrew") ? "rtl" : "ltr";
}

function getLocalizedTransliteration(
  term: Pick<OriginalLanguageTerm, "transliteration" | "transliteration_ko">,
  locale: ActiveLocale,
): TransliterationDisplay {
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

function getLocalizedGloss(
  term: Pick<OriginalLanguageTerm, "gloss" | "gloss_ko">,
  locale: ActiveLocale,
): { label: string; value: string } {
  if (locale === "ko" && term.gloss_ko) {
    return {
      label: interlinearCopy.ko.gloss,
      value: term.gloss_ko,
    };
  }

  return {
    label: locale === "ko" ? interlinearCopy.ko.englishGloss : interlinearCopy.en.gloss,
    value: term.gloss || "",
  };
}

function transliterationClassName(isFallback: boolean): string {
  return [
    "mt-0.5 max-w-28 break-words text-xs leading-4",
    isFallback ? "text-zinc-500 italic" : "text-zinc-600",
  ].join(" ");
}

function localizedReference(
  data: HighLevelInterlinearResponse,
  locale: ActiveLocale,
): string {
  const bookName = locale === "ko" ? data.book.name_ko || data.book.name_en : data.book.name_en;

  if (locale === "ko") {
    return `${bookName} ${data.reference.chapter}장 ${data.reference.verse}절`;
  }

  return `${bookName} ${data.reference.chapter}:${data.reference.verse}`;
}

function TooltipField({ label, value }: { label: string; value: string }) {
  return (
    <span className="block">
      <span className="font-semibold text-zinc-500">{label}: </span>
      <span className="break-words text-zinc-900">{value}</span>
    </span>
  );
}

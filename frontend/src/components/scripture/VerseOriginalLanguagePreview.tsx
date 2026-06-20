"use client";

import { useState } from "react";

import {
  OriginalWordPanel,
  type OriginalWordPanelWord,
} from "@/components/scripture/OriginalWordPanel";
import { getOriginalLanguageVerse } from "@/lib/api/original-language";
import type {
  OriginalLanguageJoinedOccurrence,
  OriginalLanguageSourceDataset,
  OriginalLanguageVerseResponse,
} from "@/types/original-language";

type VerseOriginalLanguagePreviewProps = {
  source: OriginalLanguageSourceDataset;
  book: string;
  chapter: number;
  verse: number;
  locale: string;
};

const originalPreviewCopy = {
  en: {
    loadError: "Original language preview could not be loaded.",
    show: "Show original",
    hide: "Hide original",
    loading: "Loading original language...",
    empty: "No original language tokens loaded.",
  },
  ko: {
    loadError: "원어 보기를 불러올 수 없습니다.",
    show: "원어 보기",
    hide: "원어 숨기기",
    loading: "원어를 불러오는 중입니다...",
    empty: "불러온 원어 토큰이 없습니다.",
  },
};

export function VerseOriginalLanguagePreview({
  source,
  book,
  chapter,
  verse,
  locale,
}: VerseOriginalLanguagePreviewProps) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const copy = originalPreviewCopy[activeLocale];
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState<OriginalLanguageVerseResponse | null>(null);
  const [selectedWord, setSelectedWord] = useState<OriginalWordPanelWord | null>(null);

  async function handleToggle() {
    const nextExpanded = !isExpanded;
    setIsExpanded(nextExpanded);

    if (!nextExpanded || data || isLoading) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await getOriginalLanguageVerse(source, book, chapter, verse);
      setData(response);
    } catch {
      setErrorMessage(copy.loadError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-3 flex flex-col gap-3">
      <button
        aria-expanded={isExpanded}
        className="w-fit rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
        onClick={handleToggle}
        type="button"
      >
        {isExpanded ? copy.hide : copy.show}
      </button>

      {isExpanded ? (
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
          {renderPreviewState({
            data,
            errorMessage,
            isLoading,
            locale: activeLocale,
            onSelectWord: setSelectedWord,
          })}
        </div>
      ) : null}

      <OriginalWordPanel
        locale={locale}
        word={selectedWord}
        onClose={() => setSelectedWord(null)}
      />
    </div>
  );
}

function renderPreviewState({
  data,
  errorMessage,
  isLoading,
  locale,
  onSelectWord,
}: {
  data: OriginalLanguageVerseResponse | null;
  errorMessage: string;
  isLoading: boolean;
  locale: "en" | "ko";
  onSelectWord: (word: OriginalWordPanelWord) => void;
}) {
  const copy = originalPreviewCopy[locale];

  if (isLoading) {
    return <p className="text-sm text-zinc-600">{copy.loading}</p>;
  }

  if (errorMessage) {
    return <p className="text-sm text-red-700">{errorMessage}</p>;
  }

  if (!data || data.occurrences.length === 0) {
    return <p className="text-sm text-zinc-600">{copy.empty}</p>;
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {data.occurrences.map((occurrence) => (
        <li key={occurrence.id}>
          <button
            className="rounded border border-zinc-200 bg-white px-2.5 py-2 text-left transition-colors hover:border-zinc-300 hover:bg-zinc-50"
            onClick={() => onSelectWord(toPanelWord(occurrence))}
            type="button"
          >
            <span className="block text-base font-semibold text-zinc-950">
              {occurrence.surface_form}
            </span>
            <span className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs text-zinc-600">
              <span>{occurrence.term.strongs_number}</span>
              {occurrence.term.gloss ? <span>{occurrence.term.gloss}</span> : null}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function toPanelWord(occurrence: OriginalLanguageJoinedOccurrence): OriginalWordPanelWord {
  return {
    surface_form: occurrence.surface_form,
    lemma: occurrence.term.lemma,
    strongs_number: occurrence.term.strongs_number,
    strongs_extended: occurrence.term.strongs_extended,
    transliteration: occurrence.term.transliteration,
    transliteration_ko: occurrence.term.transliteration_ko,
    gloss: occurrence.term.gloss,
    morphology: occurrence.morphology,
  };
}

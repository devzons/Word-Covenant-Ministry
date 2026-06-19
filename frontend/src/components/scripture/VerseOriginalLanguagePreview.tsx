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
};

export function VerseOriginalLanguagePreview({
  source,
  book,
  chapter,
  verse,
}: VerseOriginalLanguagePreviewProps) {
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
      setErrorMessage("Original language preview could not be loaded.");
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
        {isExpanded ? "Hide original" : "Show original"}
      </button>

      {isExpanded ? (
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
          {renderPreviewState({
            data,
            errorMessage,
            isLoading,
            onSelectWord: setSelectedWord,
          })}
        </div>
      ) : null}

      <OriginalWordPanel word={selectedWord} onClose={() => setSelectedWord(null)} />
    </div>
  );
}

function renderPreviewState({
  data,
  errorMessage,
  isLoading,
  onSelectWord,
}: {
  data: OriginalLanguageVerseResponse | null;
  errorMessage: string;
  isLoading: boolean;
  onSelectWord: (word: OriginalWordPanelWord) => void;
}) {
  if (isLoading) {
    return <p className="text-sm text-zinc-600">Loading original language...</p>;
  }

  if (errorMessage) {
    return <p className="text-sm text-red-700">{errorMessage}</p>;
  }

  if (!data || data.occurrences.length === 0) {
    return <p className="text-sm text-zinc-600">No original language tokens loaded.</p>;
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
    gloss: occurrence.term.gloss,
    morphology: occurrence.morphology,
  };
}

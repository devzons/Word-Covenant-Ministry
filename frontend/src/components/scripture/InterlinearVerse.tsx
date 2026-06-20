"use client";

import { useEffect, useState } from "react";

import {
  OriginalWordPanel,
  type OriginalWordPanelWord,
} from "@/components/scripture/OriginalWordPanel";
import { getInterlinearVerse } from "@/lib/api/original-language";
import type {
  HighLevelInterlinearResponse,
  HighLevelInterlinearToken,
  OriginalLanguageType,
  OriginalLanguageSourceDataset,
} from "@/types/original-language";

type InterlinearVerseProps = {
  source: OriginalLanguageSourceDataset;
  book: string;
  chapter: number;
  verse: number | null;
};

type InterlinearCache = Record<number, HighLevelInterlinearResponse>;

export function InterlinearVerse({
  source,
  book,
  chapter,
  verse,
}: InterlinearVerseProps) {
  const [cache, setCache] = useState<InterlinearCache>({});
  const [loadingVerse, setLoadingVerse] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedWord, setSelectedWord] = useState<OriginalWordPanelWord | null>(null);
  const selectedData = verse ? cache[verse] : null;

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
          setErrorMessage("Interlinear verse could not be loaded.");
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
  }, [book, cache, chapter, source, verse]);

  if (!verse) {
    return (
      <div className="rounded-md border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-600">
        Select a verse to view interlinear details.
      </div>
    );
  }

  if (loadingVerse === verse && !selectedData) {
    return (
      <div className="rounded-md border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-600">
        Loading interlinear verse...
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

  return (
    <section
      aria-label={`${selectedData.book.name_en} ${selectedData.reference.chapter}:${selectedData.reference.verse} interlinear`}
      className="rounded-md border border-zinc-200 bg-zinc-50 p-4"
    >
      <div className="mb-4 flex flex-col gap-1">
        <p className="text-sm font-semibold text-zinc-600">
          {selectedData.book.name_en} {selectedData.reference.chapter}:
          {selectedData.reference.verse}
        </p>
        <p className="text-base leading-7 text-zinc-950">{selectedData.text}</p>
      </div>

      <ul className="flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible">
        {selectedData.tokens.map((token) => (
          <li className="shrink-0 sm:shrink" key={token.id}>
            <button
              className="flex min-h-36 w-36 flex-col items-center gap-1 rounded-md border border-zinc-200 bg-white px-2.5 py-3 text-center shadow-sm transition-colors hover:border-zinc-400 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
              onClick={() => setSelectedWord(toPanelWord(token))}
              type="button"
            >
              <span
                className="w-full break-words text-lg font-semibold leading-6 text-zinc-950"
                dir={textDirection(token.term.language_type)}
              >
                {token.surface_form}
              </span>
              <span
                className="w-full break-words text-sm leading-5 text-zinc-800"
                dir={textDirection(token.term.language_type)}
              >
                {token.term.lemma}
              </span>
              <span className="text-xs font-semibold text-zinc-600">
                {token.term.strongs_number}
              </span>
              <span className="w-full break-words text-xs text-zinc-600">
                {token.term.transliteration || "Not provided"}
              </span>
              <span className="w-full break-words text-xs leading-4 text-zinc-500">
                {token.term.gloss || "Not provided"}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <OriginalWordPanel word={selectedWord} onClose={() => setSelectedWord(null)} />
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
    gloss: token.term.gloss,
    morphology: token.morphology,
  };
}

function textDirection(languageType: OriginalLanguageType): "ltr" | "rtl" {
  return languageType === "hebrew" ? "rtl" : "ltr";
}

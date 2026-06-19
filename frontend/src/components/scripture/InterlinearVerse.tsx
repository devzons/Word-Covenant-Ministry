"use client";

import { useEffect, useState } from "react";

import { getInterlinearVerse } from "@/lib/api/original-language";
import type {
  HighLevelInterlinearResponse,
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

      <ul className="grid gap-3 sm:grid-cols-2">
        {selectedData.tokens.map((token) => (
          <li className="rounded-md border border-zinc-200 bg-white p-3" key={token.id}>
            <span className="block text-lg font-semibold text-zinc-950">
              {token.surface_form}
            </span>
            <dl className="mt-2 grid gap-1 text-sm">
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 font-medium text-zinc-500">Lemma</dt>
                <dd className="text-zinc-900">{token.term.lemma}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 font-medium text-zinc-500">
                  Strong&apos;s
                </dt>
                <dd className="text-zinc-900">{token.term.strongs_number}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 font-medium text-zinc-500">
                  Transliteration
                </dt>
                <dd className="text-zinc-900">{token.term.transliteration}</dd>
              </div>
              {token.term.gloss ? (
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 font-medium text-zinc-500">Gloss</dt>
                  <dd className="text-zinc-900">{token.term.gloss}</dd>
                </div>
              ) : null}
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
}

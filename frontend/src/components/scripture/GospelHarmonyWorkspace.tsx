"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  gospelHarmonyUnits,
  type GospelHarmonyBook,
  type GospelHarmonyPassage,
} from "@/data/gospelHarmonyUnits";
import { getBibleChapter } from "@/lib/api/bible";
import type { BibleVerse } from "@/types/bible";

type GospelHarmonyWorkspaceProps = {
  locale: "en" | "ko";
};

const gospelHarmonyCopy = {
  en: {
    title: "Gospel Harmony",
    eyebrow: "Scripture Study",
    description: "A study tool for comparing Matthew, Mark, and Luke in parallel by event unit.",
    selectEvent: "Select Event",
    parallelPassages: "Parallel Passages",
    wholeChapter: "Full chapter",
    noPassage: "No linked passage yet.",
    loading: "Loading passage...",
    error: "Passage could not be loaded.",
    noText: "No passage text returned.",
    johnNote: "John references are retained for future expansion.",
    columns: {
      matthew: "Matthew",
      mark: "Mark",
      luke: "Luke",
    },
  },
  ko: {
    title: "복음서 대조서",
    eyebrow: "성경 연구",
    description: "마태·마가·누가복음을 사건 단위로 병행 비교하는 연구 도구입니다.",
    selectEvent: "사건 선택",
    parallelPassages: "병행 본문",
    wholeChapter: "전체 장 보기",
    noPassage: "아직 연결된 본문이 없습니다.",
    loading: "본문을 불러오는 중입니다...",
    error: "본문을 불러올 수 없습니다.",
    noText: "본문이 없습니다.",
    johnNote: "요한복음 참조는 향후 확장을 위해 보존합니다.",
    columns: {
      matthew: "마태복음",
      mark: "마가복음",
      luke: "누가복음",
    },
  },
};

const gospelColumns = ["matthew", "mark", "luke"] as const;
const gospelHarmonyTranslation = "KRV";

export function GospelHarmonyWorkspace({ locale }: GospelHarmonyWorkspaceProps) {
  const copy = gospelHarmonyCopy[locale];
  const [selectedUnitId, setSelectedUnitId] = useState(gospelHarmonyUnits[0]?.id ?? "");
  const [openMobileColumn, setOpenMobileColumn] =
    useState<(typeof gospelColumns)[number]>("matthew");
  const selectedUnit =
    gospelHarmonyUnits.find((unit) => unit.id === selectedUnitId) ?? gospelHarmonyUnits[0];

  return (
    <section className="flex flex-col gap-8 py-12 sm:py-16">
      <div className="flex max-w-3xl flex-col gap-3">
        <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
          {copy.eyebrow}
        </p>
        <h1 className="text-3xl font-semibold text-zinc-950 sm:text-4xl">
          {copy.title}
        </h1>
        <p className="text-base leading-7 text-zinc-600">{copy.description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(220px,280px)_minmax(0,1fr)]">
        <aside className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
            {copy.selectEvent}
          </h2>
          <ul className="mt-3 flex flex-col gap-1.5">
            {gospelHarmonyUnits.map((unit) => (
              <li key={unit.id}>
                <button
                  aria-pressed={unit.id === selectedUnit.id}
                  className={
                    unit.id === selectedUnit.id
                      ? "w-full rounded-md bg-zinc-950 px-3 py-2 text-left text-sm font-semibold text-white"
                      : "w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-zinc-700 transition-colors hover:bg-white"
                  }
                  onClick={() => setSelectedUnitId(unit.id)}
                  type="button"
                >
                  <span className="block">{unit.title[locale]}</span>
                  {unit.category ? (
                    <span
                      className={
                        unit.id === selectedUnit.id
                          ? "mt-0.5 block text-xs font-medium text-zinc-300"
                          : "mt-0.5 block text-xs font-medium text-zinc-500"
                      }
                    >
                      {unit.category[locale]}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex min-w-0 flex-col gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
              {copy.parallelPassages}
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
              {selectedUnit.title[locale]}
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {gospelColumns.map((column) => (
              <HarmonyColumn
                column={column}
                copy={copy}
                isMobileOpen={openMobileColumn === column}
                key={column}
                locale={locale}
                onToggleMobile={() => setOpenMobileColumn(column)}
                passage={selectedUnit.passages[column]}
              />
            ))}
          </div>

          {selectedUnit.passages.john ? (
            <p className="text-sm text-zinc-500">{copy.johnNote}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function HarmonyColumn({
  column,
  copy,
  isMobileOpen,
  locale,
  onToggleMobile,
  passage,
}: {
  column: (typeof gospelColumns)[number];
  copy: (typeof gospelHarmonyCopy)["en"];
  isMobileOpen: boolean;
  locale: "en" | "ko";
  onToggleMobile: () => void;
  passage?: GospelHarmonyPassage;
}) {
  return (
    <section className="min-h-40 rounded-md border border-zinc-200 bg-white">
      <button
        aria-expanded={isMobileOpen}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left lg:hidden"
        onClick={onToggleMobile}
        type="button"
      >
        <span className="text-lg font-semibold text-zinc-950">{copy.columns[column]}</span>
        <span className="text-sm font-semibold text-zinc-500">
          {isMobileOpen ? "-" : "+"}
        </span>
      </button>

      <div className="hidden border-b border-zinc-200 px-4 py-3 lg:block">
        <h3 className="text-lg font-semibold text-zinc-950">{copy.columns[column]}</h3>
      </div>

      <div className={isMobileOpen ? "px-4 pb-4 lg:block lg:p-4" : "hidden lg:block lg:p-4"}>
        {passage ? (
          <HarmonyPassageContent copy={copy} locale={locale} passage={passage} />
        ) : (
          <p className="text-sm text-zinc-600">{copy.noPassage}</p>
        )}
      </div>
    </section>
  );
}

function HarmonyPassageContent({
  copy,
  locale,
  passage,
}: {
  copy: (typeof gospelHarmonyCopy)["en"];
  locale: "en" | "ko";
  passage: GospelHarmonyPassage;
}) {
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadPassage() {
      setIsLoading(true);
      setErrorMessage("");
      setVerses([]);

      try {
        const chapter = await getBibleChapter(
          gospelHarmonyTranslation,
          passage.book,
          passage.startChapter,
        );
        const selectedVerses = chapter.verses.filter((verse) =>
          isVerseInPassageRange(verse.verse, passage),
        );

        if (isCurrent) {
          setVerses(selectedVerses);
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

    void loadPassage();

    return () => {
      isCurrent = false;
    };
  }, [copy.error, passage]);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-zinc-600">
        {formatPassage(passage, locale)}
      </p>

      {renderPassageState({ copy, errorMessage, isLoading, verses })}

      <Link
        className="text-sm font-semibold text-zinc-900 underline-offset-2 hover:underline"
        href={`/${locale}/bible/${gospelHarmonyTranslation}/${passage.book}/${passage.startChapter}?mode=reader#v${passage.startVerse}`}
      >
        {copy.wholeChapter}
      </Link>
    </div>
  );
}

function renderPassageState({
  copy,
  errorMessage,
  isLoading,
  verses,
}: {
  copy: (typeof gospelHarmonyCopy)["en"];
  errorMessage: string;
  isLoading: boolean;
  verses: BibleVerse[];
}) {
  if (isLoading) {
    return <p className="text-sm text-zinc-600">{copy.loading}</p>;
  }

  if (errorMessage) {
    return <p className="text-sm text-red-700">{errorMessage}</p>;
  }

  if (verses.length === 0) {
    return <p className="text-sm text-zinc-600">{copy.noText}</p>;
  }

  return (
    <ol className="flex flex-col gap-2">
      {verses.map((verse) => (
        <li
          className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2 text-base leading-7"
          key={verse.verse}
        >
          <span className="pt-0.5 text-sm font-semibold text-zinc-500">{verse.verse}</span>
          <span className="break-words text-zinc-900">{verse.text}</span>
        </li>
      ))}
    </ol>
  );
}

function isVerseInPassageRange(verse: number, passage: GospelHarmonyPassage): boolean {
  if (passage.endChapter && passage.endChapter !== passage.startChapter) {
    return verse >= passage.startVerse;
  }

  const endVerse = passage.endVerse ?? passage.startVerse;

  return verse >= passage.startVerse && verse <= endVerse;
}

function formatPassage(passage: GospelHarmonyPassage, locale: "en" | "ko"): string {
  const bookName = gospelBookLabels[passage.book][locale];
  const start = `${bookName} ${passage.startChapter}:${passage.startVerse}`;

  if (!passage.endVerse && !passage.endChapter) {
    return start;
  }

  const endChapter = passage.endChapter ?? passage.startChapter;
  const endVerse = passage.endVerse ?? passage.startVerse;

  if (endChapter === passage.startChapter) {
    return `${start}-${endVerse}`;
  }

  return `${start}-${endChapter}:${endVerse}`;
}

const gospelBookLabels: Record<GospelHarmonyBook, { en: string; ko: string }> = {
  matthew: { en: "Matthew", ko: "마태복음" },
  mark: { en: "Mark", ko: "마가복음" },
  luke: { en: "Luke", ko: "누가복음" },
  john: { en: "John", ko: "요한복음" },
};

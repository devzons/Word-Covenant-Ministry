"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { PassagePreviewTarget } from "@/components/scripture/CrossReferenceItemCard";
import {
  CrossReferencePassagePreviewModal,
  type PassagePreviewCacheEntry,
} from "@/components/scripture/CrossReferencePassagePreviewModal";
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
    wholeChapter: "Open in Reader",
    viewPassage: "View passage",
    openInReader: "Open in Reader",
    close: "Close",
    closePreview: "Close passage preview",
    previewDialog: "Passage Preview",
    loadingPassage: "Loading passage...",
    passageError: "Passage could not be loaded.",
    passageUnavailable: "No passage text returned for this version.",
    unsupportedRange: "This range is not supported in preview.",
    version: "Version",
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
    wholeChapter: "성경 본문으로 이동",
    viewPassage: "본문 보기",
    openInReader: "성경 본문으로 이동",
    close: "닫기",
    closePreview: "본문 미리보기 닫기",
    previewDialog: "본문 미리보기",
    loadingPassage: "본문을 불러오는 중입니다.",
    passageError: "본문을 불러오지 못했습니다.",
    passageUnavailable: "이 번역본에서 본문을 찾을 수 없습니다.",
    unsupportedRange: "이 범위는 미리보기에서 지원하지 않습니다.",
    version: "번역",
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
const gospelHarmonyUnitAliases: Record<string, string> = {
  "baptism-of-jesus": "jesus-baptism",
  "feeding-5000": "feeding-five-thousand",
};

export function GospelHarmonyWorkspace({ locale }: GospelHarmonyWorkspaceProps) {
  const copy = gospelHarmonyCopy[locale];
  const translation = locale === "en" ? "WEB" : "KRV";
  const [selectedUnitId, setSelectedUnitId] = useState(gospelHarmonyUnits[0]?.id ?? "");
  const [openMobileColumn, setOpenMobileColumn] =
    useState<(typeof gospelColumns)[number]>("matthew");
  const [previewTarget, setPreviewTarget] = useState<PassagePreviewTarget | null>(null);
  const [previewCache, setPreviewCache] = useState<Record<string, PassagePreviewCacheEntry>>({});
  const previewReturnFocusRef = useRef<HTMLElement | null>(null);
  const selectedUnit =
    gospelHarmonyUnits.find((unit) => unit.id === selectedUnitId) ?? gospelHarmonyUnits[0];

  useEffect(() => {
    const url = new URL(window.location.href);
    const unitSlug = url.searchParams.get("unit");
    const unitId = getHarmonyUnitIdFromSlug(unitSlug);

    if (unitId) {
      const frame = window.requestAnimationFrame(() => setSelectedUnitId(unitId));

      return () => window.cancelAnimationFrame(frame);
    }
  }, []);

  function handleSelectUnit(unitId: string) {
    setSelectedUnitId(unitId);

    const url = new URL(window.location.href);
    url.searchParams.set("unit", unitId);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  function handleOpenPreview(target: PassagePreviewTarget, triggerElement: HTMLElement) {
    previewReturnFocusRef.current = triggerElement;
    setPreviewTarget(target);
  }

  function restorePreviewFocus() {
    const returnElement = previewReturnFocusRef.current;
    previewReturnFocusRef.current = null;

    window.requestAnimationFrame(() => {
      if (
        returnElement &&
        document.contains(returnElement) &&
        typeof returnElement.focus === "function"
      ) {
        returnElement.focus();
      }
    });
  }

  function handleClosePreview() {
    setPreviewTarget(null);
    restorePreviewFocus();
  }

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
                  onClick={() => handleSelectUnit(unit.id)}
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
                onPreview={handleOpenPreview}
                passage={selectedUnit.passages[column]}
                translation={translation}
              />
            ))}
          </div>

          {selectedUnit.passages.john ? (
            <p className="text-sm text-zinc-500">{copy.johnNote}</p>
          ) : null}
        </div>
      </div>

      {previewTarget ? (
        <CrossReferencePassagePreviewModal
          cache={previewCache}
          copy={copy}
          onCacheChange={setPreviewCache}
          onClose={handleClosePreview}
          returnFocusRef={previewReturnFocusRef}
          target={previewTarget}
          translation={translation}
        />
      ) : null}
    </section>
  );
}

function HarmonyColumn({
  column,
  copy,
  isMobileOpen,
  locale,
  onToggleMobile,
  onPreview,
  passage,
  translation,
}: {
  column: (typeof gospelColumns)[number];
  copy: (typeof gospelHarmonyCopy)["en"];
  isMobileOpen: boolean;
  locale: "en" | "ko";
  onToggleMobile: () => void;
  onPreview: (target: PassagePreviewTarget, triggerElement: HTMLElement) => void;
  passage?: GospelHarmonyPassage;
  translation: string;
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
          <HarmonyPassageContent
            copy={copy}
            locale={locale}
            onPreview={onPreview}
            passage={passage}
            translation={translation}
          />
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
  onPreview,
  passage,
  translation,
}: {
  copy: (typeof gospelHarmonyCopy)["en"];
  locale: "en" | "ko";
  onPreview: (target: PassagePreviewTarget, triggerElement: HTMLElement) => void;
  passage: GospelHarmonyPassage;
  translation: string;
}) {
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const passageLabel = formatPassage(passage, locale);
  const readerHref = `/${locale}/bible/${translation}/${passage.book}/${passage.startChapter}?mode=reader#v${passage.startVerse}`;
  const previewTarget = {
    href: readerHref,
    reference: toPreviewReference(passage),
    referenceLabel: passageLabel,
  };

  useEffect(() => {
    let isCurrent = true;

    async function loadPassage() {
      setIsLoading(true);
      setErrorMessage("");
      setVerses([]);

      try {
        const chapter = await getBibleChapter(
          translation,
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
  }, [copy.error, passage, translation]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-zinc-600">{passageLabel}</p>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <button
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100"
            onClick={(event) => onPreview(previewTarget, event.currentTarget)}
            type="button"
          >
            {copy.viewPassage}
          </button>
          <Link
            aria-label={`${copy.openInReader}: ${passageLabel}`}
            className="rounded-md border border-zinc-200 px-3 py-1.5 text-sm font-semibold text-zinc-700 underline-offset-2 transition-colors hover:bg-zinc-50 hover:underline"
            href={readerHref}
          >
            {copy.openInReader}
          </Link>
        </div>
      </div>

      {renderPassageState({ copy, errorMessage, isLoading, verses })}
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

function getHarmonyUnitIdFromSlug(slug: string | null): string | null {
  if (!slug) {
    return null;
  }

  const normalizedSlug = gospelHarmonyUnitAliases[slug] ?? slug;
  const unit = gospelHarmonyUnits.find((candidate) => candidate.id === normalizedSlug);

  return unit?.id ?? gospelHarmonyUnits[0]?.id ?? null;
}

function toPreviewReference(passage: GospelHarmonyPassage) {
  return {
    book: passage.book,
    start_chapter: passage.startChapter,
    start_verse: passage.startVerse,
    end_chapter: passage.endChapter ?? null,
    end_verse: passage.endVerse ?? null,
  };
}

const gospelBookLabels: Record<GospelHarmonyBook, { en: string; ko: string }> = {
  matthew: { en: "Matthew", ko: "마태복음" },
  mark: { en: "Mark", ko: "마가복음" },
  luke: { en: "Luke", ko: "누가복음" },
  john: { en: "John", ko: "요한복음" },
};

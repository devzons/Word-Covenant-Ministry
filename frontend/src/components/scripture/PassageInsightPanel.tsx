"use client";

import { getCrossReferencesForPassage } from "@/data/crossReferences";
import type { OriginalLanguageReaderMode } from "@/types/original-language";

type PassageInsightPanelProps = {
  bookLabel: string;
  book: string;
  chapter: number;
  locale: string;
  mode: OriginalLanguageReaderMode;
  selectedVerse?: number | null;
  translation: string;
  verseCount: number;
};

const passageInsightCopy = {
  en: {
    title: "Passage Insight",
    description: "Data summary for the current reader location.",
    currentLocation: "Current location",
    currentTranslation: "Current translation",
    currentMode: "Current mode",
    verseCount: "Verses in chapter",
    selectedVerse: "Selected verse",
    crossReferenceCount: "Cross references",
    chapterScope: "Chapter scope",
    countUnit: "item(s)",
  },
  ko: {
    title: "본문 통찰",
    description: "현재 읽기 위치에 대한 데이터 요약입니다.",
    currentLocation: "현재 위치",
    currentTranslation: "현재 번역",
    currentMode: "현재 모드",
    verseCount: "현재 장 절 수",
    selectedVerse: "선택 절",
    crossReferenceCount: "교차 참조",
    chapterScope: "장 기준",
    countUnit: "개",
  },
};

const modeLabels = {
  en: {
    reader: "Reader",
    original: "Original Text",
    interlinear: "Interlinear",
  },
  ko: {
    reader: "읽기",
    original: "원문보기",
    interlinear: "행간보기",
  },
};

export function PassageInsightPanel({
  bookLabel,
  book,
  chapter,
  locale,
  mode,
  selectedVerse,
  translation,
  verseCount,
}: PassageInsightPanelProps) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const copy = passageInsightCopy[activeLocale];
  const crossReferenceCount = getCrossReferencesForPassage({
    book,
    chapter,
    verse: selectedVerse,
  }).length;
  const currentLocation = formatCurrentLocation({
    bookLabel,
    chapter,
    locale: activeLocale,
    verse: selectedVerse,
  });

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-zinc-950">{copy.title}</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600">{copy.description}</p>
      </div>

      <dl className="grid grid-cols-1 gap-2 text-sm">
        <InsightRow label={copy.currentLocation} value={currentLocation} />
        <InsightRow label={copy.currentTranslation} value={translation} />
        <InsightRow label={copy.currentMode} value={modeLabels[activeLocale][mode]} />
        <InsightRow label={copy.verseCount} value={String(verseCount)} />
        <InsightRow
          label={copy.selectedVerse}
          value={selectedVerse ? String(selectedVerse) : copy.chapterScope}
        />
        <InsightRow
          label={copy.crossReferenceCount}
          value={`${crossReferenceCount} ${copy.countUnit}`}
        />
      </dl>
    </div>
  );
}

function InsightRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white px-3 py-2">
      <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-medium text-zinc-950">{value}</dd>
    </div>
  );
}

function formatCurrentLocation({
  bookLabel,
  chapter,
  locale,
  verse,
}: {
  bookLabel: string;
  chapter: number;
  locale: "en" | "ko";
  verse?: number | null;
}): string {
  if (locale === "ko") {
    return verse ? `${bookLabel} ${chapter}:${verse}` : `${bookLabel} ${chapter}장`;
  }

  return verse ? `${bookLabel} ${chapter}:${verse}` : `${bookLabel} ${chapter}`;
}

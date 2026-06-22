"use client";

import Link from "next/link";
import { useState } from "react";

import {
  gospelHarmonyUnits,
  type GospelHarmonyBook,
  type GospelHarmonyPassage,
} from "@/data/gospelHarmonyUnits";

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
    openPassage: "Open Passage",
    noPassage: "No linked passage yet.",
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
    openPassage: "본문 보기",
    noPassage: "아직 연결된 본문이 없습니다.",
    johnNote: "요한복음 참조는 향후 확장을 위해 보존합니다.",
    columns: {
      matthew: "마태복음",
      mark: "마가복음",
      luke: "누가복음",
    },
  },
};

const gospelColumns = ["matthew", "mark", "luke"] as const;

export function GospelHarmonyWorkspace({ locale }: GospelHarmonyWorkspaceProps) {
  const copy = gospelHarmonyCopy[locale];
  const [selectedUnitId, setSelectedUnitId] = useState(gospelHarmonyUnits[0]?.id ?? "");
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
                key={column}
                locale={locale}
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
  locale,
  passage,
}: {
  column: (typeof gospelColumns)[number];
  copy: (typeof gospelHarmonyCopy)["en"];
  locale: "en" | "ko";
  passage?: GospelHarmonyPassage;
}) {
  return (
    <section className="min-h-40 rounded-md border border-zinc-200 bg-white p-4">
      <h3 className="text-lg font-semibold text-zinc-950">{copy.columns[column]}</h3>
      {passage ? (
        <div className="mt-4 flex flex-col gap-3">
          <p className="text-base font-semibold text-zinc-900">
            {formatPassage(passage, locale)}
          </p>
          <Link
            className="inline-flex w-fit rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
            href={`/${locale}/bible/KRV/${passage.book}/${passage.startChapter}?mode=reader#v${passage.startVerse}`}
          >
            {copy.openPassage}
          </Link>
        </div>
      ) : (
        <p className="mt-4 text-sm text-zinc-600">{copy.noPassage}</p>
      )}
    </section>
  );
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

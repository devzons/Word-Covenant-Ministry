"use client";

import Link from "next/link";

import {
  curatedCrossReferences,
  type CuratedCrossReference,
  type ScriptureReferenceRange,
} from "@/data/crossReferences";

type CrossReferencePanelProps = {
  book: string;
  chapter: number;
  locale: string;
  translation: string;
  verse?: number | null;
};

const crossReferencePanelCopy = {
  en: {
    title: "Cross References",
    description:
      "Curated references for this passage. This layer stores reference ranges and relationship types, not Bible text.",
    empty: "No curated cross references for this chapter yet.",
    targets: "Related passages",
  },
  ko: {
    title: "관련 구절",
    description:
      "이 본문에 연결된 선별 참조입니다. 이 레이어는 성경 본문을 저장하지 않고 참조 범위와 관계 유형만 사용합니다.",
    empty: "이 장에는 아직 선별된 교차 참조가 없습니다.",
    targets: "관련 본문",
  },
};

export function CrossReferencePanel({
  book,
  chapter,
  locale,
  translation,
  verse,
}: CrossReferencePanelProps) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const copy = crossReferencePanelCopy[activeLocale];
  const matches = curatedCrossReferences.filter((reference) =>
    matchesCurrentReference(reference.source, { book, chapter, verse }),
  );

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-zinc-950">{copy.title}</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600">{copy.description}</p>
      </div>

      {matches.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {matches.map((crossReference) => (
            <CrossReferenceItem
              copy={copy}
              crossReference={crossReference}
              key={crossReference.id}
              locale={activeLocale}
              translation={translation}
            />
          ))}
        </ul>
      ) : (
        <p className="rounded-md border border-zinc-200 bg-white p-3 text-sm text-zinc-600">
          {copy.empty}
        </p>
      )}
    </div>
  );
}

function CrossReferenceItem({
  copy,
  crossReference,
  locale,
  translation,
}: {
  copy: (typeof crossReferencePanelCopy)["en"];
  crossReference: CuratedCrossReference;
  locale: "en" | "ko";
  translation: string;
}) {
  return (
    <li className="rounded-md border border-zinc-200 bg-white p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-950">
          {crossReference.label[locale]}
        </h3>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
          {crossReference.type}
        </span>
      </div>
      {crossReference.note ? (
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          {crossReference.note[locale]}
        </p>
      ) : null}

      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
          {copy.targets}
        </p>
        <ul className="mt-2 flex flex-col gap-1.5">
          {crossReference.targets.map((target) => (
            <li key={referenceKey(target)}>
              <Link
                className="text-sm font-semibold text-zinc-900 underline-offset-2 hover:underline"
                href={`/${locale}/bible/${translation}/${target.book}/${target.chapter}?mode=reader#v${target.verse}`}
              >
                {formatReference(target, locale)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

function matchesCurrentReference(
  source: ScriptureReferenceRange,
  current: { book: string; chapter: number; verse?: number | null },
): boolean {
  if (source.book !== current.book) {
    return false;
  }

  if (current.verse === null || current.verse === undefined) {
    return isChapterInRange(source, current.chapter);
  }

  return isVerseInRange(source, current.chapter, current.verse);
}

function isChapterInRange(source: ScriptureReferenceRange, chapter: number): boolean {
  const endChapter = source.endChapter ?? source.chapter;

  return chapter >= source.chapter && chapter <= endChapter;
}

function isVerseInRange(
  source: ScriptureReferenceRange,
  chapter: number,
  verse: number,
): boolean {
  const endChapter = source.endChapter ?? source.chapter;
  const endVerse = source.endVerse ?? source.verse;

  if (chapter < source.chapter || chapter > endChapter) {
    return false;
  }

  if (source.chapter === endChapter) {
    return verse >= source.verse && verse <= endVerse;
  }

  if (chapter === source.chapter) {
    return verse >= source.verse;
  }

  if (chapter === endChapter) {
    return verse <= endVerse;
  }

  return true;
}

function formatReference(reference: ScriptureReferenceRange, locale: "en" | "ko"): string {
  const bookName = bookLabels[reference.book]?.[locale] ?? reference.book;
  const start = `${bookName} ${reference.chapter}:${reference.verse}`;

  if (!reference.endVerse && !reference.endChapter) {
    return start;
  }

  const endChapter = reference.endChapter ?? reference.chapter;
  const endVerse = reference.endVerse ?? reference.verse;

  if (endChapter === reference.chapter) {
    return `${start}-${endVerse}`;
  }

  return `${start}-${endChapter}:${endVerse}`;
}

function referenceKey(reference: ScriptureReferenceRange): string {
  return `${reference.book}-${reference.chapter}-${reference.verse}-${reference.endChapter ?? ""}-${reference.endVerse ?? ""}`;
}

const bookLabels: Record<string, { en: string; ko: string }> = {
  genesis: { en: "Genesis", ko: "창세기" },
  exodus: { en: "Exodus", ko: "출애굽기" },
  isaiah: { en: "Isaiah", ko: "이사야" },
  jeremiah: { en: "Jeremiah", ko: "예레미야" },
  ezekiel: { en: "Ezekiel", ko: "에스겔" },
  matthew: { en: "Matthew", ko: "마태복음" },
  mark: { en: "Mark", ko: "마가복음" },
  luke: { en: "Luke", ko: "누가복음" },
  john: { en: "John", ko: "요한복음" },
  romans: { en: "Romans", ko: "로마서" },
  "1-corinthians": { en: "1 Corinthians", ko: "고린도전서" },
  galatians: { en: "Galatians", ko: "갈라디아서" },
  titus: { en: "Titus", ko: "디도서" },
  hebrews: { en: "Hebrews", ko: "히브리서" },
  james: { en: "James", ko: "야고보서" },
  "1-peter": { en: "1 Peter", ko: "베드로전서" },
  revelation: { en: "Revelation", ko: "요한계시록" },
};

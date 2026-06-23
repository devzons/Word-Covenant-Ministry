"use client";

import Link from "next/link";

import type {
  CrossReferenceItem,
  CrossReferenceTargetReference,
} from "@/types/cross-reference";

export type CrossReferenceCardCopy = {
  openInReader: string;
  relatedTheme: string;
  unreviewed: string;
  viewPassage: string;
};

export type PassagePreviewTarget = {
  href: string;
  reference: CrossReferenceTargetReference;
  referenceLabel: string;
};

type CrossReferenceItemCardProps = {
  copy: CrossReferenceCardCopy;
  item: CrossReferenceItem;
  locale: "en" | "ko";
  onPreview: (target: PassagePreviewTarget, triggerElement: HTMLElement) => void;
  translation: string;
};

export function CrossReferenceItemCard({
  copy,
  item,
  locale,
  onPreview,
  translation,
}: CrossReferenceItemCardProps) {
  const label = item.relationship_type === "theme" ? copy.relatedTheme : item.relationship_label;
  const reviewStatus = item.review_status === "unreviewed" ? copy.unreviewed : humanizeToken(item.review_status);
  const sourceName = item.source_dataset === "openbible" ? "OpenBible" : item.source_dataset;
  const referenceLabel = formatCrossReferenceTargetReference(item.target_reference, locale);
  const href = `/${locale}/bible/${translation}/${item.target_reference.book}/${item.target_reference.start_chapter}?mode=reader#v${item.target_reference.start_verse}`;

  return (
    <li className="rounded-md border border-zinc-200 bg-white p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700">
            {label}
          </span>
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
            {reviewStatus}
          </span>
        </div>
        <span className="text-xs text-zinc-500 sm:text-right">
          {sourceName}
        </span>
      </div>

      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-w-0 text-sm font-semibold text-zinc-950">
          {referenceLabel}
        </p>

        <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
          <button
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100"
            onClick={(event) =>
              onPreview({
                href,
                reference: item.target_reference,
                referenceLabel,
              }, event.currentTarget)
            }
            type="button"
          >
            {copy.viewPassage}
          </button>
          <Link
            aria-label={`${copy.openInReader}: ${referenceLabel}`}
            className="rounded-md border border-zinc-200 px-3 py-1.5 text-sm font-semibold text-zinc-700 underline-offset-2 transition-colors hover:bg-zinc-50 hover:underline"
            href={href}
          >
            {copy.openInReader}
          </Link>
        </div>
      </div>
    </li>
  );
}

export function formatCrossReferenceTargetReference(
  reference: CrossReferenceTargetReference,
  locale: "en" | "ko",
): string {
  const bookName = bookLabels[reference.book]?.[locale] ?? reference.book;
  const start = `${bookName} ${reference.start_chapter}:${reference.start_verse}`;
  const endChapter = reference.end_chapter ?? reference.start_chapter;
  const endVerse = reference.end_verse ?? reference.start_verse;

  if (endChapter === reference.start_chapter && endVerse === reference.start_verse) {
    return start;
  }

  if (endChapter === reference.start_chapter) {
    return `${start}-${endVerse}`;
  }

  return `${start}-${endChapter}:${endVerse}`;
}

export function crossReferenceItemKey(item: CrossReferenceItem, index: number): string {
  const reference = item.target_reference;

  return [
    reference.book,
    reference.start_chapter,
    reference.start_verse,
    reference.end_chapter ?? "",
    reference.end_verse ?? "",
    item.relationship_type,
    item.source_dataset,
    index,
  ].join("-");
}

function humanizeToken(value: string): string {
  return value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const bookLabels: Record<string, { en: string; ko: string }> = {
  genesis: { en: "Genesis", ko: "창세기" },
  exodus: { en: "Exodus", ko: "출애굽기" },
  leviticus: { en: "Leviticus", ko: "레위기" },
  numbers: { en: "Numbers", ko: "민수기" },
  deuteronomy: { en: "Deuteronomy", ko: "신명기" },
  joshua: { en: "Joshua", ko: "여호수아" },
  judges: { en: "Judges", ko: "사사기" },
  ruth: { en: "Ruth", ko: "룻기" },
  "1-samuel": { en: "1 Samuel", ko: "사무엘상" },
  "2-samuel": { en: "2 Samuel", ko: "사무엘하" },
  "1-kings": { en: "1 Kings", ko: "열왕기상" },
  "2-kings": { en: "2 Kings", ko: "열왕기하" },
  "1-chronicles": { en: "1 Chronicles", ko: "역대상" },
  "2-chronicles": { en: "2 Chronicles", ko: "역대하" },
  ezra: { en: "Ezra", ko: "에스라" },
  nehemiah: { en: "Nehemiah", ko: "느헤미야" },
  esther: { en: "Esther", ko: "에스더" },
  job: { en: "Job", ko: "욥기" },
  psalms: { en: "Psalms", ko: "시편" },
  proverbs: { en: "Proverbs", ko: "잠언" },
  ecclesiastes: { en: "Ecclesiastes", ko: "전도서" },
  "song-of-songs": { en: "Song of Songs", ko: "아가" },
  isaiah: { en: "Isaiah", ko: "이사야" },
  jeremiah: { en: "Jeremiah", ko: "예레미야" },
  lamentations: { en: "Lamentations", ko: "예레미야애가" },
  ezekiel: { en: "Ezekiel", ko: "에스겔" },
  daniel: { en: "Daniel", ko: "다니엘" },
  hosea: { en: "Hosea", ko: "호세아" },
  joel: { en: "Joel", ko: "요엘" },
  amos: { en: "Amos", ko: "아모스" },
  obadiah: { en: "Obadiah", ko: "오바댜" },
  jonah: { en: "Jonah", ko: "요나" },
  micah: { en: "Micah", ko: "미가" },
  nahum: { en: "Nahum", ko: "나훔" },
  habakkuk: { en: "Habakkuk", ko: "하박국" },
  zephaniah: { en: "Zephaniah", ko: "스바냐" },
  haggai: { en: "Haggai", ko: "학개" },
  zechariah: { en: "Zechariah", ko: "스가랴" },
  malachi: { en: "Malachi", ko: "말라기" },
  matthew: { en: "Matthew", ko: "마태복음" },
  mark: { en: "Mark", ko: "마가복음" },
  luke: { en: "Luke", ko: "누가복음" },
  john: { en: "John", ko: "요한복음" },
  acts: { en: "Acts", ko: "사도행전" },
  romans: { en: "Romans", ko: "로마서" },
  "1-corinthians": { en: "1 Corinthians", ko: "고린도전서" },
  "2-corinthians": { en: "2 Corinthians", ko: "고린도후서" },
  galatians: { en: "Galatians", ko: "갈라디아서" },
  ephesians: { en: "Ephesians", ko: "에베소서" },
  philippians: { en: "Philippians", ko: "빌립보서" },
  colossians: { en: "Colossians", ko: "골로새서" },
  "1-thessalonians": { en: "1 Thessalonians", ko: "데살로니가전서" },
  "2-thessalonians": { en: "2 Thessalonians", ko: "데살로니가후서" },
  "1-timothy": { en: "1 Timothy", ko: "디모데전서" },
  "2-timothy": { en: "2 Timothy", ko: "디모데후서" },
  titus: { en: "Titus", ko: "디도서" },
  philemon: { en: "Philemon", ko: "빌레몬서" },
  hebrews: { en: "Hebrews", ko: "히브리서" },
  james: { en: "James", ko: "야고보서" },
  "1-peter": { en: "1 Peter", ko: "베드로전서" },
  "2-peter": { en: "2 Peter", ko: "베드로후서" },
  "1-john": { en: "1 John", ko: "요한일서" },
  "2-john": { en: "2 John", ko: "요한이서" },
  "3-john": { en: "3 John", ko: "요한삼서" },
  jude: { en: "Jude", ko: "유다서" },
  revelation: { en: "Revelation", ko: "요한계시록" },
};

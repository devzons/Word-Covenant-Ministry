"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getCrossReferences } from "@/lib/api/cross-references";
import type {
  CrossReferenceItem,
  CrossReferenceResponse,
  CrossReferenceTargetReference,
} from "@/types/cross-reference";

type CrossReferencePanelProps = {
  book: string;
  chapter: number;
  locale: string;
  translation: string;
  verse?: number | null;
};

const CROSS_REFERENCE_PER_PAGE = 20;

const crossReferencePanelCopy = {
  en: {
    title: "Related Passages",
    description:
      "Related passages for the selected verse. These references are unreviewed source links, not Bible text.",
    selectVerse: "Select a verse to view related passages.",
    loading: "Loading related passages...",
    loadingMore: "Loading more...",
    empty: "No related passages are available for the selected verse.",
    error: "Unable to load related passages.",
    loadMore: "Load more",
    relatedTheme: "Theme",
    unreviewed: "Unreviewed",
    source: "Source",
    attributionLabel: "Attribution",
    total: "total",
    openReference: "Open passage",
  },
  ko: {
    title: "관련 구절",
    description:
      "선택한 절과 관련된 구절입니다. 이 참조는 검토 전 출처 링크이며 성경 본문을 저장하지 않습니다.",
    selectVerse: "구절을 선택하면 관련 구절이 표시됩니다.",
    loading: "관련 구절을 불러오는 중입니다...",
    loadingMore: "더 불러오는 중입니다...",
    empty: "선택한 절에 대한 관련 구절이 아직 없습니다.",
    error: "관련 구절을 불러오지 못했습니다.",
    loadMore: "더 보기",
    relatedTheme: "주제",
    unreviewed: "검토 전",
    source: "출처",
    attributionLabel: "출처 표기",
    total: "전체",
    openReference: "본문 열기",
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
  const [crossReferences, setCrossReferences] = useState<CrossReferenceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!verse) {
      return;
    }

    let isCurrent = true;
    const selectedVerse = verse;

    async function loadInitialCrossReferences() {
      setIsLoading(true);
      setErrorMessage("");
      setCrossReferences(null);

      try {
        const nextReferences = await getCrossReferences({
          book,
          chapter,
          page: 1,
          perPage: CROSS_REFERENCE_PER_PAGE,
          verse: selectedVerse,
        });

        if (isCurrent) {
          setCrossReferences(nextReferences);
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

    void loadInitialCrossReferences();

    return () => {
      isCurrent = false;
    };
  }, [book, chapter, copy.error, verse]);

  async function handleLoadMore() {
    if (!verse || !crossReferences || !crossReferences.pagination.has_more) {
      return;
    }

    setIsLoadingMore(true);
    setErrorMessage("");

    try {
      const nextReferences = await getCrossReferences({
        book,
        chapter,
        page: crossReferences.pagination.page + 1,
        perPage: crossReferences.pagination.per_page,
        verse,
      });

      setCrossReferences({
        ...nextReferences,
        items: [...crossReferences.items, ...nextReferences.items],
      });
    } catch {
      setErrorMessage(copy.error);
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-zinc-950">{copy.title}</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600">{copy.description}</p>
      </div>

      {!verse ? <CrossReferenceStatus message={copy.selectVerse} /> : null}
      {verse && isLoading ? <CrossReferenceStatus message={copy.loading} /> : null}
      {verse && errorMessage ? <CrossReferenceStatus message={errorMessage} tone="error" /> : null}

      {!isLoading && verse && crossReferences?.items.length === 0 ? (
        <CrossReferenceStatus message={copy.empty} />
      ) : null}

      {verse && crossReferences && crossReferences.items.length > 0 ? (
        <div className="flex min-w-0 flex-col gap-3">
          <p className="text-sm text-zinc-600">
            {copy.total}: {crossReferences.pagination.total}
          </p>
          <ul className="flex min-w-0 flex-col gap-2">
            {crossReferences.items.map((item, index) => (
              <CrossReferenceItemView
                copy={copy}
                item={item}
                key={crossReferenceItemKey(item, index)}
                locale={activeLocale}
                translation={translation}
              />
            ))}
          </ul>

          {crossReferences.pagination.has_more ? (
            <button
              className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:text-zinc-400"
              disabled={isLoadingMore}
              onClick={handleLoadMore}
              type="button"
            >
              {isLoadingMore ? copy.loadingMore : copy.loadMore}
            </button>
          ) : null}

          <CrossReferenceAttribution
            attribution={crossReferences.attribution.attribution}
            label={copy.attributionLabel}
            sourceUrl={crossReferences.attribution.source_url}
          />
        </div>
      ) : null}
    </div>
  );
}

function CrossReferenceItemView({
  copy,
  item,
  locale,
  translation,
}: {
  copy: (typeof crossReferencePanelCopy)["en"];
  item: CrossReferenceItem;
  locale: "en" | "ko";
  translation: string;
}) {
  const label = item.relationship_type === "theme" ? copy.relatedTheme : item.relationship_label;
  const reviewStatus = item.review_status === "unreviewed" ? copy.unreviewed : humanizeToken(item.review_status);
  const sourceName = item.source_dataset === "openbible" ? "OpenBible" : item.source_dataset;
  const referenceLabel = formatReference(item.target_reference, locale);
  const href = `/${locale}/bible/${translation}/${item.target_reference.book}/${item.target_reference.start_chapter}?mode=reader#v${item.target_reference.start_verse}`;

  return (
    <li className="rounded-md border border-zinc-200 bg-white p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700">
          {label}
        </span>
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
          {reviewStatus}
        </span>
      </div>

      <Link
        aria-label={`${copy.openReference}: ${referenceLabel}`}
        className="mt-3 block text-sm font-semibold text-zinc-950 underline-offset-2 hover:underline"
        href={href}
      >
        {referenceLabel}
      </Link>

      <p className="mt-2 text-xs text-zinc-500">
        {copy.source}: {sourceName}
      </p>
    </li>
  );
}

function CrossReferenceStatus({
  message,
  tone = "default",
}: {
  message: string;
  tone?: "default" | "error";
}) {
  const className =
    tone === "error"
      ? "rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"
      : "rounded-md border border-zinc-200 bg-white p-3 text-sm text-zinc-600";

  return <div className={className}>{message}</div>;
}

function CrossReferenceAttribution({
  attribution,
  label,
  sourceUrl,
}: {
  attribution: string;
  label: string;
  sourceUrl: string;
}) {
  return (
    <p className="border-t border-zinc-200 pt-3 text-xs leading-5 text-zinc-500">
      {label}:{" "}
      <a className="underline-offset-2 hover:underline" href={sourceUrl}>
        {attribution}
      </a>
    </p>
  );
}

function formatReference(reference: CrossReferenceTargetReference, locale: "en" | "ko"): string {
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

function crossReferenceItemKey(item: CrossReferenceItem, index: number): string {
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

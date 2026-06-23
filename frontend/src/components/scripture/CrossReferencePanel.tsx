"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

import { getCrossReferences } from "@/lib/api/cross-references";
import { getBibleChapter } from "@/lib/api/bible";
import type { BibleVerse } from "@/types/bible";
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
const MAX_PREVIEW_VERSES = 10;

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
    viewPassage: "View passage",
    openInReader: "Open in Reader",
    close: "Close",
    closePreview: "Close passage preview",
    previewDialog: "Passage preview",
    loadingPassage: "Loading passage...",
    passageError: "Unable to load passage.",
    passageUnavailable: "This passage is unavailable for the selected version.",
    unsupportedRange: "This range is not supported in preview.",
    version: "Version",
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
  },
};

type PassagePreviewCacheEntry =
  | { status: "ready"; verses: BibleVerse[] }
  | { status: "error"; message: string }
  | { status: "unsupported"; message: string };

type PassagePreviewTarget = {
  href: string;
  reference: CrossReferenceTargetReference;
  referenceLabel: string;
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
  const [previewTarget, setPreviewTarget] = useState<PassagePreviewTarget | null>(null);
  const [previewCache, setPreviewCache] = useState<Record<string, PassagePreviewCacheEntry>>({});
  const previewReturnFocusRef = useRef<HTMLElement | null>(null);

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
                onPreview={handleOpenPreview}
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

      {previewTarget ? (
        <PassagePreviewModal
          cache={previewCache}
          copy={copy}
          onCacheChange={setPreviewCache}
          onClose={handleClosePreview}
          returnFocusRef={previewReturnFocusRef}
          target={previewTarget}
          translation={translation}
        />
      ) : null}
    </div>
  );
}

function CrossReferenceItemView({
  copy,
  item,
  locale,
  onPreview,
  translation,
}: {
  copy: (typeof crossReferencePanelCopy)["en"];
  item: CrossReferenceItem;
  locale: "en" | "ko";
  onPreview: (target: PassagePreviewTarget, triggerElement: HTMLElement) => void;
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

      <p className="mt-3 text-sm font-semibold text-zinc-950">
        {referenceLabel}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
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

      <p className="mt-2 text-xs text-zinc-500">
        {copy.source}: {sourceName}
      </p>
    </li>
  );
}

function PassagePreviewModal({
  cache,
  copy,
  onCacheChange,
  onClose,
  returnFocusRef,
  target,
  translation,
}: {
  cache: Record<string, PassagePreviewCacheEntry>;
  copy: (typeof crossReferencePanelCopy)["en"];
  onCacheChange: (cache: Record<string, PassagePreviewCacheEntry>) => void;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
  target: PassagePreviewTarget;
  translation: string;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const cacheKey = passagePreviewCacheKey(translation, target.reference);
  const cachedPreview = cache[cacheKey] ?? null;
  const isLoading = !cachedPreview;

  useEffect(() => {
    closeButtonRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, returnFocusRef]);

  useEffect(() => {
    if (cachedPreview) {
      return;
    }

    const rangeValidation = validatePreviewRange(target.reference, copy.unsupportedRange);
    if (rangeValidation.status === "unsupported") {
      onCacheChange({
        ...cache,
        [cacheKey]: rangeValidation,
      });
      return;
    }

    let isCurrent = true;

    async function loadPassagePreview() {
      try {
        const chapter = await getBibleChapter(
          translation,
          target.reference.book,
          target.reference.start_chapter,
        );
        const endVerse = target.reference.end_verse ?? target.reference.start_verse;
        const verses = chapter.verses.filter(
          (verse) =>
            verse.verse >= target.reference.start_verse && verse.verse <= endVerse,
        );
        const nextPreview: PassagePreviewCacheEntry =
          verses.length > 0
            ? { status: "ready", verses }
            : { status: "error", message: copy.passageUnavailable };

        if (isCurrent) {
          onCacheChange({
            ...cache,
            [cacheKey]: nextPreview,
          });
        }
      } catch {
        if (isCurrent) {
          onCacheChange({
            ...cache,
            [cacheKey]: { status: "error", message: copy.passageError },
          });
        }
      }
    }

    void loadPassagePreview();

    return () => {
      isCurrent = false;
    };
  }, [
    cache,
    cacheKey,
    cachedPreview,
    copy.passageError,
    copy.passageUnavailable,
    copy.unsupportedRange,
    onCacheChange,
    target.reference,
    translation,
  ]);

  const preview = cache[cacheKey] ?? null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label={copy.closePreview}
        className="absolute inset-0 bg-zinc-950/40"
        onClick={onClose}
        type="button"
      />
      <section
        aria-labelledby="cross-reference-preview-title"
        aria-modal="true"
        className="absolute inset-x-4 top-16 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-lg border border-zinc-200 bg-white p-5 shadow-2xl sm:left-1/2 sm:right-auto sm:w-full sm:max-w-lg sm:-translate-x-1/2"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
              {copy.previewDialog}
            </p>
            <h2
              className="mt-1 text-lg font-semibold text-zinc-950"
              id="cross-reference-preview-title"
            >
              {target.referenceLabel}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {copy.version}: {translation}
            </p>
          </div>
          <button
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
            onClick={onClose}
            ref={closeButtonRef}
            type="button"
          >
            {copy.close}
          </button>
        </div>

        <div className="mt-5">
          {isLoading ? <CrossReferenceStatus message={copy.loadingPassage} /> : null}

          {!isLoading && preview?.status === "unsupported" ? (
            <CrossReferenceStatus message={preview.message} />
          ) : null}

          {!isLoading && preview?.status === "error" ? (
            <CrossReferenceStatus message={preview.message} tone="error" />
          ) : null}

          {!isLoading && preview?.status === "ready" ? (
            <ol className="flex flex-col gap-3">
              {preview.verses.map((verse) => (
                <li className="text-base leading-7 text-zinc-900" key={verse.verse}>
                  <span className="mr-2 align-super text-xs font-semibold text-zinc-500">
                    {verse.verse}
                  </span>
                  {verse.text}
                </li>
              ))}
            </ol>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-zinc-200 pt-4">
          <Link
            className="rounded-md bg-zinc-950 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
            href={target.href}
            onClick={onClose}
          >
            {copy.openInReader}
          </Link>
          <button
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
            onClick={onClose}
            type="button"
          >
            {copy.close}
          </button>
        </div>
      </section>
    </div>
  );
}

function validatePreviewRange(
  reference: CrossReferenceTargetReference,
  message: string,
): PassagePreviewCacheEntry | { status: "supported" } {
  const endChapter = reference.end_chapter ?? reference.start_chapter;
  const endVerse = reference.end_verse ?? reference.start_verse;
  const verseCount = endVerse - reference.start_verse + 1;

  if (
    endChapter !== reference.start_chapter ||
    verseCount < 1 ||
    verseCount > MAX_PREVIEW_VERSES
  ) {
    return { status: "unsupported", message };
  }

  return { status: "supported" };
}

function passagePreviewCacheKey(
  translation: string,
  reference: CrossReferenceTargetReference,
): string {
  return [
    translation,
    reference.book,
    reference.start_chapter,
    reference.start_verse,
    reference.end_chapter ?? "",
    reference.end_verse ?? "",
  ].join(":");
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

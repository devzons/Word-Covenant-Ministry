"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { BibleReaderContextPanel } from "@/components/scripture/BibleReaderContextPanel";
import { CrossReferencePanel } from "@/components/scripture/CrossReferencePanel";
import { InterlinearVerse } from "@/components/scripture/InterlinearVerse";
import { PassageInsightPanel } from "@/components/scripture/PassageInsightPanel";
import { ReaderModeControl } from "@/components/scripture/ReaderModeControl";
import { ReaderSearchPanel } from "@/components/scripture/ReaderSearchPanel";
import { ResearchPanelNavigation } from "@/components/scripture/ResearchPanelNavigation";
import {
  ScriptureResearchWorkspaceProvider,
  useScriptureResearchWorkspace,
  type ScriptureResearchReferenceRange,
} from "@/components/scripture/ScriptureResearchWorkspaceContext";
import { VerseOriginalLanguagePreview } from "@/components/scripture/VerseOriginalLanguagePreview";
import type { TimelineBookContextRow } from "@/components/scripture/timeline/passionWeekTimeline";
import { cn } from "@/lib/utils/cn";
import type { BibleBookMetadata, BibleChapterResponse } from "@/types/bible";
import type {
  OriginalLanguageReaderMode,
  OriginalLanguageSourceDataset,
} from "@/types/original-language";

type BibleReaderProps = {
  bookContext?: TimelineBookContextRow | null;
  bookMetadata: BibleBookMetadata;
  chapter: BibleChapterResponse;
  initialSearchQuery?: string;
  locale: string;
  mode: OriginalLanguageReaderMode;
};

const bookOptions = [
  { slug: "genesis", label: { en: "Genesis", ko: "창세기" }, chapterCount: 50 },
  { slug: "exodus", label: { en: "Exodus", ko: "출애굽기" }, chapterCount: 40 },
  { slug: "leviticus", label: { en: "Leviticus", ko: "레위기" }, chapterCount: 27 },
  { slug: "numbers", label: { en: "Numbers", ko: "민수기" }, chapterCount: 36 },
  { slug: "deuteronomy", label: { en: "Deuteronomy", ko: "신명기" }, chapterCount: 34 },
  { slug: "joshua", label: { en: "Joshua", ko: "여호수아" }, chapterCount: 24 },
  { slug: "judges", label: { en: "Judges", ko: "사사기" }, chapterCount: 21 },
  { slug: "ruth", label: { en: "Ruth", ko: "룻기" }, chapterCount: 4 },
  { slug: "1-samuel", label: { en: "1 Samuel", ko: "사무엘상" }, chapterCount: 31 },
  { slug: "2-samuel", label: { en: "2 Samuel", ko: "사무엘하" }, chapterCount: 24 },
  { slug: "1-kings", label: { en: "1 Kings", ko: "열왕기상" }, chapterCount: 22 },
  { slug: "2-kings", label: { en: "2 Kings", ko: "열왕기하" }, chapterCount: 25 },
  { slug: "1-chronicles", label: { en: "1 Chronicles", ko: "역대상" }, chapterCount: 29 },
  { slug: "2-chronicles", label: { en: "2 Chronicles", ko: "역대하" }, chapterCount: 36 },
  { slug: "ezra", label: { en: "Ezra", ko: "에스라" }, chapterCount: 10 },
  { slug: "nehemiah", label: { en: "Nehemiah", ko: "느헤미야" }, chapterCount: 13 },
  { slug: "esther", label: { en: "Esther", ko: "에스더" }, chapterCount: 10 },
  { slug: "job", label: { en: "Job", ko: "욥기" }, chapterCount: 42 },
  { slug: "psalms", label: { en: "Psalms", ko: "시편" }, chapterCount: 150 },
  { slug: "proverbs", label: { en: "Proverbs", ko: "잠언" }, chapterCount: 31 },
  { slug: "ecclesiastes", label: { en: "Ecclesiastes", ko: "전도서" }, chapterCount: 12 },
  { slug: "song-of-songs", label: { en: "Song of Songs", ko: "아가" }, chapterCount: 8 },
  { slug: "isaiah", label: { en: "Isaiah", ko: "이사야" }, chapterCount: 66 },
  { slug: "jeremiah", label: { en: "Jeremiah", ko: "예레미야" }, chapterCount: 52 },
  { slug: "lamentations", label: { en: "Lamentations", ko: "예레미야애가" }, chapterCount: 5 },
  { slug: "ezekiel", label: { en: "Ezekiel", ko: "에스겔" }, chapterCount: 48 },
  { slug: "daniel", label: { en: "Daniel", ko: "다니엘" }, chapterCount: 12 },
  { slug: "hosea", label: { en: "Hosea", ko: "호세아" }, chapterCount: 14 },
  { slug: "joel", label: { en: "Joel", ko: "요엘" }, chapterCount: 3 },
  { slug: "amos", label: { en: "Amos", ko: "아모스" }, chapterCount: 9 },
  { slug: "obadiah", label: { en: "Obadiah", ko: "오바댜" }, chapterCount: 1 },
  { slug: "jonah", label: { en: "Jonah", ko: "요나" }, chapterCount: 4 },
  { slug: "micah", label: { en: "Micah", ko: "미가" }, chapterCount: 7 },
  { slug: "nahum", label: { en: "Nahum", ko: "나훔" }, chapterCount: 3 },
  { slug: "habakkuk", label: { en: "Habakkuk", ko: "하박국" }, chapterCount: 3 },
  { slug: "zephaniah", label: { en: "Zephaniah", ko: "스바냐" }, chapterCount: 3 },
  { slug: "haggai", label: { en: "Haggai", ko: "학개" }, chapterCount: 2 },
  { slug: "zechariah", label: { en: "Zechariah", ko: "스가랴" }, chapterCount: 14 },
  { slug: "malachi", label: { en: "Malachi", ko: "말라기" }, chapterCount: 4 },
  { slug: "matthew", label: { en: "Matthew", ko: "마태복음" }, chapterCount: 28 },
  { slug: "mark", label: { en: "Mark", ko: "마가복음" }, chapterCount: 16 },
  { slug: "luke", label: { en: "Luke", ko: "누가복음" }, chapterCount: 24 },
  { slug: "john", label: { en: "John", ko: "요한복음" }, chapterCount: 21 },
  { slug: "acts", label: { en: "Acts", ko: "사도행전" }, chapterCount: 28 },
  { slug: "romans", label: { en: "Romans", ko: "로마서" }, chapterCount: 16 },
  { slug: "1-corinthians", label: { en: "1 Corinthians", ko: "고린도전서" }, chapterCount: 16 },
  { slug: "2-corinthians", label: { en: "2 Corinthians", ko: "고린도후서" }, chapterCount: 13 },
  { slug: "galatians", label: { en: "Galatians", ko: "갈라디아서" }, chapterCount: 6 },
  { slug: "ephesians", label: { en: "Ephesians", ko: "에베소서" }, chapterCount: 6 },
  { slug: "philippians", label: { en: "Philippians", ko: "빌립보서" }, chapterCount: 4 },
  { slug: "colossians", label: { en: "Colossians", ko: "골로새서" }, chapterCount: 4 },
  { slug: "1-thessalonians", label: { en: "1 Thessalonians", ko: "데살로니가전서" }, chapterCount: 5 },
  { slug: "2-thessalonians", label: { en: "2 Thessalonians", ko: "데살로니가후서" }, chapterCount: 3 },
  { slug: "1-timothy", label: { en: "1 Timothy", ko: "디모데전서" }, chapterCount: 6 },
  { slug: "2-timothy", label: { en: "2 Timothy", ko: "디모데후서" }, chapterCount: 4 },
  { slug: "titus", label: { en: "Titus", ko: "디도서" }, chapterCount: 3 },
  { slug: "philemon", label: { en: "Philemon", ko: "빌레몬서" }, chapterCount: 1 },
  { slug: "hebrews", label: { en: "Hebrews", ko: "히브리서" }, chapterCount: 13 },
  { slug: "james", label: { en: "James", ko: "야고보서" }, chapterCount: 5 },
  { slug: "1-peter", label: { en: "1 Peter", ko: "베드로전서" }, chapterCount: 5 },
  { slug: "2-peter", label: { en: "2 Peter", ko: "베드로후서" }, chapterCount: 3 },
  { slug: "1-john", label: { en: "1 John", ko: "요한일서" }, chapterCount: 5 },
  { slug: "2-john", label: { en: "2 John", ko: "요한이서" }, chapterCount: 1 },
  { slug: "3-john", label: { en: "3 John", ko: "요한삼서" }, chapterCount: 1 },
  { slug: "jude", label: { en: "Jude", ko: "유다서" }, chapterCount: 1 },
  { slug: "revelation", label: { en: "Revelation", ko: "요한계시록" }, chapterCount: 22 },
];

const bibleReaderCopy = {
  en: {
    version: "Version",
    book: "Book",
    chapter: "Chapter",
    chapterSuffix: "Ch.",
    go: "Go",
    noVerses: "No verses were returned for this chapter.",
    chapterNav: "Bible chapter navigation",
    previousChapter: "Previous chapter",
    nextChapter: "Next chapter",
    selectOriginalVerse: "Select verse for original-language preview",
    selectInterlinearVerse: "Select verse for interlinear view",
    studyPanel: "Study panel",
    workspaceTitle: "Scripture Research Workspace",
    workspaceDescription: "Reader-centered research tools stay aligned to the current passage.",
    workspaceMode: {
      reader: "Reader",
      original: "Original Language",
      interlinear: "Interlinear",
    },
    workspaceSections: {
      context: "Context",
      search: "Search",
      insight: "Insight",
      "cross-reference": "Related Passages",
    },
  },
  ko: {
    version: "버전",
    book: "성경",
    chapter: "장",
    chapterSuffix: "장",
    go: "이동",
    noVerses: "이 장의 본문이 없습니다.",
    chapterNav: "성경 장 이동",
    previousChapter: "이전 장",
    nextChapter: "다음 장",
    selectOriginalVerse: "원어 미리보기 절 선택",
    selectInterlinearVerse: "행간 보기 절 선택",
    studyPanel: "연구 패널",
    workspaceTitle: "성경 연구 작업공간",
    workspaceDescription: "현재 본문에 맞춰 연구 도구를 함께 살펴봅니다.",
    workspaceMode: {
      reader: "본문",
      original: "원어",
      interlinear: "행간",
    },
    workspaceSections: {
      context: "문맥",
      search: "검색",
      insight: "통찰",
      "cross-reference": "관련 구절",
    },
  },
};

export function BibleReader({
  bookContext = null,
  bookMetadata,
  chapter,
  initialSearchQuery = "",
  locale,
  mode,
}: BibleReaderProps) {
  const router = useRouter();
  const activeLocale = locale === "en" ? "en" : "ko";
  const copy = bibleReaderCopy[activeLocale];
  const [activeVerseId, setActiveVerseId] = useState("");
  const [selectedOriginalVerse, setSelectedOriginalVerse] = useState<number | null>(null);
  const [selectedInterlinearVerse, setSelectedInterlinearVerse] = useState<number | null>(null);
  const chapterNumber = chapter.chapter;
  const currentBookIndex = bookOptions.findIndex((book) => book.slug === chapter.book);
  const currentBook = bookOptions[currentBookIndex] ?? null;
  const originalLanguageSource = getOriginalLanguageSource(chapter.book);
  const isOriginalMode = mode === "original";
  const isInterlinearMode = mode === "interlinear";
  const chapterReference = localizedChapterReference({
    bookMetadata,
    chapter: chapterNumber,
    locale: activeLocale,
    option: currentBook,
  });
  const visibleInterlinearVerse =
    selectedInterlinearVerse ?? (isInterlinearMode ? (chapter.verses[0]?.verse ?? null) : null);
  const visibleOriginalVerse =
    selectedOriginalVerse ?? (isOriginalMode ? (chapter.verses[0]?.verse ?? null) : null);
  const activeVerseNumber = activeVerseId.match(/^v(\d+)$/)?.[1]
    ? Number(activeVerseId.replace(/^v/, ""))
    : null;
  const crossReferenceVerse =
    activeVerseNumber ?? visibleInterlinearVerse ?? visibleOriginalVerse ?? null;
  const activeStudyVerse = crossReferenceVerse;
  const selectedReferenceRange: ScriptureResearchReferenceRange | undefined = crossReferenceVerse
    ? {
        book: chapter.book,
        startChapter: chapter.chapter,
        startVerse: crossReferenceVerse,
      }
    : undefined;
  const previousBook = currentBookIndex > 0 ? bookOptions[currentBookIndex - 1] : null;
  const nextBook =
    currentBookIndex >= 0 && currentBookIndex < bookOptions.length - 1
      ? bookOptions[currentBookIndex + 1]
      : null;
  const previousHref =
    chapterNumber > 1
      ? createReaderHref(locale, chapter.translation, chapter.book, chapterNumber - 1, mode)
      : previousBook
        ? createReaderHref(
            locale,
            chapter.translation,
            previousBook.slug,
            previousBook.chapterCount,
            mode,
          )
        : null;
  const nextHref =
    chapterNumber < bookMetadata.chapter_count
      ? createReaderHref(locale, chapter.translation, chapter.book, chapterNumber + 1, mode)
      : nextBook
        ? createReaderHref(locale, chapter.translation, nextBook.slug, 1, mode)
        : null;
  function handleReferenceChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const book = String(formData.get("book") || chapter.book);
    const nextChapter = Number(formData.get("chapter") || chapter.chapter);

    if (!Number.isInteger(nextChapter) || nextChapter < 1) {
      return;
    }

    router.push(createReaderHref(locale, chapter.translation, book, nextChapter, mode));
  }

  useEffect(() => {
    function updateActiveVerseId() {
      setActiveVerseId(window.location.hash.replace(/^#/, ""));
    }

    updateActiveVerseId();
    window.addEventListener("hashchange", updateActiveVerseId);

    return () => {
      window.removeEventListener("hashchange", updateActiveVerseId);
    };
  }, []);

  return (
    <ScriptureResearchWorkspaceProvider
      book={chapter.book}
      chapter={chapter.chapter}
      key={`${chapter.translation}-${chapter.book}-${chapter.chapter}`}
      locale={locale}
      mode={mode}
      selectedReferenceRange={selectedReferenceRange}
      sourceSurface="reader"
      verse={crossReferenceVerse ?? undefined}
      version={chapter.translation}
    >
      <article className="flex w-full min-w-0 flex-col gap-8 overflow-x-hidden py-8 sm:py-12">
      <header className="flex min-w-0 max-w-full flex-col gap-5 border-b border-zinc-200 pb-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
            {chapter.translation}
          </p>
          <h1 className="text-3xl font-semibold text-zinc-950 sm:text-4xl">
            {chapterReference}
          </h1>
        </div>

        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
          <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <div className="flex min-w-0 shrink-0 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm">
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
                {copy.version}
              </span>
              <span className="font-semibold text-zinc-950">{chapter.translation}</span>
              </div>
              <form
                className="flex min-w-0 flex-1 flex-wrap items-end gap-2"
                onSubmit={handleReferenceChange}
              >
                <label className="sr-only" htmlFor="reader-book-select">
                  {copy.book}
                </label>
                <select
                  aria-label={copy.book}
                  className="h-11 min-w-[10rem] rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-950 sm:min-w-[12rem]"
                  defaultValue={chapter.book}
                  id="reader-book-select"
                  name="book"
                >
                  {bookOptions.map((book) => (
                    <option key={book.slug} value={book.slug}>
                      {book.label[activeLocale]}
                    </option>
                  ))}
                </select>
                <div className="flex min-w-0 items-end gap-1">
                  <label className="sr-only" htmlFor="reader-chapter-input">
                    {copy.chapter}
                  </label>
                  <input
                    aria-label={copy.chapter}
                    className="h-11 w-20 rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-950"
                    defaultValue={chapter.chapter}
                    id="reader-chapter-input"
                    min={1}
                    name="chapter"
                    type="number"
                  />
                  <span className="pb-2 text-sm font-medium text-zinc-700">
                    {copy.chapterSuffix}
                  </span>
                </div>
                <button
                  className="h-11 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
                  type="submit"
                >
                  {copy.go}
                </button>
              </form>
            </div>

            <div className="shrink-0 lg:border-l lg:border-zinc-200 lg:pl-4">
              <ReaderModeControl
                book={chapter.book}
                chapter={chapter.chapter}
                locale={locale}
                mode={mode}
                version={chapter.translation}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.75fr)] lg:items-start xl:grid-cols-[minmax(0,55fr)_minmax(420px,45fr)] xl:gap-10">
        <div className="flex min-w-0 flex-col gap-8">
          {chapter.verses.length > 0 ? (
            <ol
              className={cn(
                "flex w-full min-w-0 flex-col gap-0",
                isInterlinearMode || isOriginalMode ? "max-w-6xl" : "max-w-4xl",
              )}
            >
              {chapter.verses.map((verse) => {
                const verseId = `v${verse.verse}`;
                const isActive =
                  activeVerseId === verseId ||
                  (isInterlinearMode && visibleInterlinearVerse === verse.verse) ||
                  (isOriginalMode && visibleOriginalVerse === verse.verse);
                const isSelectableStudyMode = isOriginalMode || isInterlinearMode;

                return (
                  <li className="flex flex-col" id={verseId} key={verse.verse}>
                    <div
                      className={cn(
                        "grid scroll-mt-24 grid-cols-[2rem_minmax(0,1fr)] gap-3 rounded-lg border border-transparent px-2 py-0.5 text-lg leading-7 transition-colors",
                        isActive && "border-blue-200 bg-blue-50 hover:bg-blue-100",
                      )}
                    >
                      <span
                        className={cn(
                          "pt-0.5 text-sm font-semibold text-zinc-500",
                          isActive && "text-blue-700",
                        )}
                      >
                        {verse.verse}
                      </span>
                      <div className="flex min-w-0 flex-col">
                        {isSelectableStudyMode ? (
                          <button
                            className="min-w-0 break-words text-left text-zinc-950 transition-colors hover:text-zinc-700"
                            aria-label={
                              isOriginalMode
                                ? `${copy.selectOriginalVerse}: ${verse.verse}`
                                : `${copy.selectInterlinearVerse}: ${verse.verse}`
                            }
                            onClick={() => {
                              if (isOriginalMode) {
                                setSelectedOriginalVerse(verse.verse);
                              }

                              if (isInterlinearMode) {
                                setSelectedInterlinearVerse(verse.verse);
                              }
                            }}
                            type="button"
                          >
                            {verse.text}
                          </button>
                        ) : (
                          <span className="break-words text-zinc-950">{verse.text}</span>
                        )}
                        {isOriginalMode && visibleOriginalVerse === verse.verse ? (
                          <VerseOriginalLanguagePreview
                            autoLoad
                            book={chapter.book}
                            chapter={chapter.chapter}
                            locale={locale}
                            source={originalLanguageSource}
                            translation={chapter.translation}
                            verse={verse.verse}
                          />
                        ) : null}
                      </div>
                    </div>

                    {isInterlinearMode && visibleInterlinearVerse === verse.verse ? (
                      <div className="mt-3">
                        <InterlinearVerse
                          book={chapter.book}
                          chapter={chapter.chapter}
                          locale={locale}
                          source={originalLanguageSource}
                          translation={chapter.translation}
                          verse={visibleInterlinearVerse}
                        />
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-600">
              {copy.noVerses}
            </div>
          )}

          <nav
            aria-label={copy.chapterNav}
            className="flex items-center justify-between border-t border-zinc-200 pt-6"
          >
            {previousHref ? (
              <Link
                className="text-sm font-semibold text-zinc-900 hover:text-zinc-600"
                href={previousHref}
              >
                {copy.previousChapter}
              </Link>
            ) : (
              <span className="text-sm text-zinc-400">{copy.previousChapter}</span>
            )}
            {nextHref ? (
              <Link
                className="text-sm font-semibold text-zinc-900 hover:text-zinc-600"
                href={nextHref}
              >
                {copy.nextChapter}
              </Link>
            ) : (
              <span className="text-sm text-zinc-400">{copy.nextChapter}</span>
            )}
          </nav>
        </div>

        <BibleReaderResearchPanel
          bookLabel={currentBook?.label[activeLocale] ?? bookMetadata.name}
          bookContext={bookContext}
          initialSearchQuery={initialSearchQuery}
          selectedVerse={activeStudyVerse}
          studyPanelLabel={copy.studyPanel}
          verseCount={chapter.verses.length}
        />
      </div>
      </article>
    </ScriptureResearchWorkspaceProvider>
  );
}

type BibleReaderResearchPanelProps = {
  bookLabel: string;
  bookContext: TimelineBookContextRow | null;
  initialSearchQuery: string;
  selectedVerse: number | null;
  studyPanelLabel: string;
  verseCount: number;
};

function BibleReaderResearchPanel({
  bookLabel,
  bookContext,
  initialSearchQuery,
  selectedVerse,
  studyPanelLabel,
  verseCount,
}: BibleReaderResearchPanelProps) {
  const {
    activeResearchSection,
    book,
    chapter,
    locale,
    mode,
    setActiveResearchSection,
    version,
    verse,
  } = useScriptureResearchWorkspace();
  const activeLocale = locale === "en" ? "en" : "ko";
  const copy = bibleReaderCopy[activeLocale];
  const searchPanelKey = `${version}-${book}-${chapter}-${mode}-${initialSearchQuery}`;
  const activeModeLabel = copy.workspaceMode[mode];
  const activeSectionLabel = copy.workspaceSections[activeResearchSection];
  const activeReferenceLabel =
    activeLocale === "ko" ? `${bookLabel} ${chapter}장` : `${bookLabel} ${chapter}`;

  return (
    <aside
      aria-label={studyPanelLabel}
      className="min-w-0 w-full rounded-md border border-zinc-200 bg-zinc-50 p-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto"
    >
      <div className="mb-4 rounded-md border border-zinc-200 bg-white px-3 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
              {copy.workspaceTitle}
            </h2>
            <p className="text-sm leading-6 text-zinc-700">{copy.workspaceDescription}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-medium text-zinc-600">
            <span className="rounded-full bg-zinc-100 px-2.5 py-1">{version}</span>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1">{activeReferenceLabel}</span>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1">{activeModeLabel}</span>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1">{activeSectionLabel}</span>
          </div>
        </div>
      </div>

      <ResearchPanelNavigation
        activeSection={activeResearchSection}
        locale={locale}
        onSectionChange={setActiveResearchSection}
      />

      {activeResearchSection === "search" ? (
        <ReaderSearchPanel
          initialSearchQuery={initialSearchQuery}
          key={searchPanelKey}
          locale={locale}
          mode={mode}
          translation={version}
        />
      ) : null}

      {activeResearchSection === "context" ? (
        <BibleReaderContextPanel
          bookContext={bookContext}
          chapter={chapter}
          locale={locale}
          selectedVerse={selectedVerse}
        />
      ) : null}

      {activeResearchSection === "insight" ? (
        <PassageInsightPanel
          book={book}
          bookLabel={bookLabel}
          chapter={chapter}
          locale={locale}
          mode={mode}
          selectedVerse={selectedVerse}
          translation={version}
          verseCount={verseCount}
        />
      ) : null}

      {activeResearchSection === "cross-reference" ? (
        <CrossReferencePanel
          book={book}
          chapter={chapter}
          locale={locale}
          translation={version}
          verse={verse ?? null}
        />
      ) : null}
    </aside>
  );
}

function createReaderHref(
  locale: string,
  version: string,
  book: string,
  chapter: number,
  mode: OriginalLanguageReaderMode,
): string {
  const params = new URLSearchParams({
    mode,
  });

  return `/${locale}/bible/${version}/${book}/${chapter}?${params.toString()}`;
}

function getOriginalLanguageSource(book: string): OriginalLanguageSourceDataset {
  const matthewIndex = bookOptions.findIndex((bookOption) => bookOption.slug === "matthew");
  const bookIndex = bookOptions.findIndex((bookOption) => bookOption.slug === book);

  return bookIndex >= matthewIndex ? "STEP_TAGNT" : "STEP_TAHOT";
}

function localizedChapterReference({
  bookMetadata,
  chapter,
  locale,
  option,
}: {
  bookMetadata: BibleBookMetadata;
  chapter: number;
  locale: "en" | "ko";
  option: (typeof bookOptions)[number] | null;
}): string {
  const bookName = option?.label[locale] ?? bookMetadata.name;

  if (locale === "ko") {
    return `${bookName} ${chapter}장`;
  }

  return `${bookName} ${chapter}`;
}

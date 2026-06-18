"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

import type { BibleChapterResponse } from "@/types/bible";

type BibleReaderProps = {
  chapter: BibleChapterResponse;
  locale: string;
};

const bookOptions = [
  { slug: "genesis", label: "창세기" },
  { slug: "exodus", label: "출애굽기" },
  { slug: "leviticus", label: "레위기" },
  { slug: "numbers", label: "민수기" },
  { slug: "deuteronomy", label: "신명기" },
  { slug: "joshua", label: "여호수아" },
  { slug: "judges", label: "사사기" },
  { slug: "ruth", label: "룻기" },
  { slug: "1-samuel", label: "사무엘상" },
  { slug: "2-samuel", label: "사무엘하" },
  { slug: "1-kings", label: "열왕기상" },
  { slug: "2-kings", label: "열왕기하" },
  { slug: "1-chronicles", label: "역대상" },
  { slug: "2-chronicles", label: "역대하" },
  { slug: "ezra", label: "에스라" },
  { slug: "nehemiah", label: "느헤미야" },
  { slug: "esther", label: "에스더" },
  { slug: "job", label: "욥기" },
  { slug: "psalms", label: "시편" },
  { slug: "proverbs", label: "잠언" },
  { slug: "ecclesiastes", label: "전도서" },
  { slug: "song-of-songs", label: "아가" },
  { slug: "isaiah", label: "이사야" },
  { slug: "jeremiah", label: "예레미야" },
  { slug: "lamentations", label: "예레미야애가" },
  { slug: "ezekiel", label: "에스겔" },
  { slug: "daniel", label: "다니엘" },
  { slug: "hosea", label: "호세아" },
  { slug: "joel", label: "요엘" },
  { slug: "amos", label: "아모스" },
  { slug: "obadiah", label: "오바댜" },
  { slug: "jonah", label: "요나" },
  { slug: "micah", label: "미가" },
  { slug: "nahum", label: "나훔" },
  { slug: "habakkuk", label: "하박국" },
  { slug: "zephaniah", label: "스바냐" },
  { slug: "haggai", label: "학개" },
  { slug: "zechariah", label: "스가랴" },
  { slug: "malachi", label: "말라기" },
  { slug: "matthew", label: "마태복음" },
  { slug: "mark", label: "마가복음" },
  { slug: "luke", label: "누가복음" },
  { slug: "john", label: "요한복음" },
  { slug: "acts", label: "사도행전" },
  { slug: "romans", label: "로마서" },
  { slug: "1-corinthians", label: "고린도전서" },
  { slug: "2-corinthians", label: "고린도후서" },
  { slug: "galatians", label: "갈라디아서" },
  { slug: "ephesians", label: "에베소서" },
  { slug: "philippians", label: "빌립보서" },
  { slug: "colossians", label: "골로새서" },
  { slug: "1-thessalonians", label: "데살로니가전서" },
  { slug: "2-thessalonians", label: "데살로니가후서" },
  { slug: "1-timothy", label: "디모데전서" },
  { slug: "2-timothy", label: "디모데후서" },
  { slug: "titus", label: "디도서" },
  { slug: "philemon", label: "빌레몬서" },
  { slug: "hebrews", label: "히브리서" },
  { slug: "james", label: "야고보서" },
  { slug: "1-peter", label: "베드로전서" },
  { slug: "2-peter", label: "베드로후서" },
  { slug: "1-john", label: "요한일서" },
  { slug: "2-john", label: "요한이서" },
  { slug: "3-john", label: "요한삼서" },
  { slug: "jude", label: "유다서" },
  { slug: "revelation", label: "요한계시록" },
];

export function BibleReader({ chapter, locale }: BibleReaderProps) {
  const router = useRouter();
  const chapterNumber = chapter.chapter;
  const previousHref =
    chapterNumber > 1
      ? `/${locale}/bible/${chapter.translation}/${chapter.book}/${chapterNumber - 1}`
      : null;
  const nextHref = `/${locale}/bible/${chapter.translation}/${chapter.book}/${chapterNumber + 1}`;
  const searchUrl = `/${locale}/bible/search`;

  function handleReferenceChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const book = String(formData.get("book") || chapter.book);
    const nextChapter = Number(formData.get("chapter") || chapter.chapter);

    if (!Number.isInteger(nextChapter) || nextChapter < 1) {
      return;
    }

    router.push(`/${locale}/bible/${chapter.translation}/${book}/${nextChapter}`);
  }

  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-8 py-8 sm:py-12">
      <header className="flex flex-col gap-5 border-b border-zinc-200 pb-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
            {chapter.translation}
          </p>
          <h1 className="text-3xl font-semibold text-zinc-950 sm:text-4xl">
            {chapter.reference}
          </h1>
        </div>

        <form
          className="grid gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 sm:grid-cols-[1fr_120px_auto]"
          onSubmit={handleReferenceChange}
        >
          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
            Book
            <select
              className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-950"
              defaultValue={chapter.book}
              name="book"
            >
              {bookOptions.map((book) => (
                <option key={book.slug} value={book.slug}>
                  {book.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
            Chapter
            <input
              className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-950"
              defaultValue={chapter.chapter}
              min={1}
              name="chapter"
              type="number"
            />
          </label>
          <button
            className="h-11 self-end rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
            type="submit"
          >
            Go
          </button>
        </form>

        <form action={searchUrl} className="flex flex-col gap-2 sm:flex-row" method="get">
          <input name="translation" type="hidden" value={chapter.translation} />
          <input name="page" type="hidden" value="1" />
          <input name="per_page" type="hidden" value="20" />
          <input
            className="min-h-11 flex-1 rounded-md border border-zinc-300 px-3 text-base text-zinc-950"
            minLength={2}
            name="q"
            placeholder="Search KRV"
            required
            type="search"
          />
          <button
            className="min-h-11 rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
            type="submit"
          >
            Search
          </button>
        </form>
      </header>

      {chapter.verses.length > 0 ? (
        <ol className="flex flex-col gap-4">
          {chapter.verses.map((verse) => (
            <li className="grid grid-cols-[2rem_1fr] gap-3 text-lg leading-8" key={verse.verse}>
              <span className="pt-0.5 text-sm font-semibold text-zinc-500">
                {verse.verse}
              </span>
              <span className="text-zinc-950">{verse.text}</span>
            </li>
          ))}
        </ol>
      ) : (
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-600">
          No verses were returned for this chapter.
        </div>
      )}

      <nav
        aria-label="Bible chapter navigation"
        className="flex items-center justify-between border-t border-zinc-200 pt-6"
      >
        {previousHref ? (
          <Link className="text-sm font-semibold text-zinc-900 hover:text-zinc-600" href={previousHref}>
            Previous chapter
          </Link>
        ) : (
          <span className="text-sm text-zinc-400">Previous chapter</span>
        )}
        <Link className="text-sm font-semibold text-zinc-900 hover:text-zinc-600" href={nextHref}>
          Next chapter
        </Link>
      </nav>
    </article>
  );
}

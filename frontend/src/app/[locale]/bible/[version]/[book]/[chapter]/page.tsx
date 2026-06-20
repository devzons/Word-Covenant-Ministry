import type { Metadata } from "next";

import { SiteShell } from "@/components/layout/SiteShell";
import { BibleReader } from "@/components/scripture/BibleReader";
import { Container } from "@/components/ui/Container";
import { getBibleBookMetadata, getBibleChapter } from "@/lib/api/bible";
import { createMetadata } from "@/lib/seo/metadata";
import type { BibleBookMetadata, BibleChapterResponse, BibleReaderParams } from "@/types/bible";
import type { OriginalLanguageReaderMode } from "@/types/original-language";

type BibleReaderPageProps = {
  params: Promise<BibleReaderParams>;
  searchParams: Promise<{
    mode?: string;
  }>;
};

export async function generateMetadata({
  params,
}: BibleReaderPageProps): Promise<Metadata> {
  const { version, book, chapter } = await params;

  return createMetadata({
    title: `${version} ${book} ${chapter}`,
  });
}

export default async function BibleReaderPage({
  params,
  searchParams,
}: BibleReaderPageProps) {
  const { locale, version, book, chapter } = await params;
  const query = await searchParams;
  const mode = parseReaderMode(query.mode);
  const chapterNumber = Number(chapter);

  if (!Number.isInteger(chapterNumber) || chapterNumber < 1) {
    return <BibleReaderError locale={locale} message="Invalid chapter request." />;
  }

  let bibleChapter: BibleChapterResponse | null = null;
  let bookMetadata: BibleBookMetadata | null = null;
  let errorMessage = "";
  let isChapterOutOfRange = false;

  try {
    bookMetadata = await getBibleBookMetadata(version, book);

    if (chapterNumber > bookMetadata.chapter_count) {
      isChapterOutOfRange = true;
    } else {
      bibleChapter = await getBibleChapter(version, book, chapterNumber);
    }
  } catch {
    errorMessage = "Bible chapter could not be loaded.";
  }

  if (isChapterOutOfRange) {
    return <BibleReaderError locale={locale} message="Bible chapter could not be loaded." />;
  }

  if (!bibleChapter || !bookMetadata) {
    return <BibleReaderError locale={locale} message={errorMessage} />;
  }

  return (
    <SiteShell locale={locale}>
      <Container>
        <BibleReader
          bookMetadata={bookMetadata}
          chapter={bibleChapter}
          locale={locale}
          mode={mode}
        />
      </Container>
    </SiteShell>
  );
}

function parseReaderMode(value: string | undefined): OriginalLanguageReaderMode {
  if (value === "original" || value === "interlinear") {
    return value;
  }

  return "reader";
}

function BibleReaderError({ locale, message }: { locale: string; message: string }) {
  return (
    <SiteShell locale={locale}>
      <Container>
        <div className="mx-auto max-w-3xl py-12">
          <div className="rounded-md border border-red-200 bg-red-50 p-5 text-sm text-red-800">
            {message}
          </div>
        </div>
      </Container>
    </SiteShell>
  );
}

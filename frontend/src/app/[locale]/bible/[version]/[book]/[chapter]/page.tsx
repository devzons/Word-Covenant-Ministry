import { readFile } from "node:fs/promises";
import path from "node:path";

import type { Metadata } from "next";

import { SiteShell } from "@/components/layout/SiteShell";
import { BibleReader } from "@/components/scripture/BibleReader";
import type { BibleReaderRelatedMetadataPreview } from "@/components/scripture/BibleReaderContextPanel";
import {
  normalizeCanonicalBooksPackage,
  type CanonicalBooksPackage,
} from "@/components/scripture/timeline/timelineBooksPackage";
import {
  normalizeCoreBiblicalEventsPackage,
  type CoreBiblicalEventsPackage,
} from "@/components/scripture/timeline/timelineEventsPackage";
import {
  normalizeKingsKingdomsPackage,
  type KingsKingdomsPackage,
} from "@/components/scripture/timeline/timelineKingsKingdomsPackage";
import {
  timelineSchematicPlaceRows,
  type TimelineBookContextRow,
  type TimelineText,
} from "@/components/scripture/timeline/passionWeekTimeline";
import { Container } from "@/components/ui/Container";
import { getBibleBookMetadata, getBibleChapter } from "@/lib/api/bible";
import { createMetadata } from "@/lib/seo/metadata";
import type { BibleBookMetadata, BibleChapterResponse, BibleReaderParams } from "@/types/bible";
import type { OriginalLanguageReaderMode } from "@/types/original-language";

type BibleReaderPageProps = {
  params: Promise<BibleReaderParams>;
  searchParams: Promise<{
    mode?: string;
    q?: string;
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
  const activeLocale = locale === "en" ? "en" : "ko";
  const query = await searchParams;
  const mode = parseReaderMode(query.mode);
  const chapterNumber = Number(chapter);

  if (!Number.isInteger(chapterNumber) || chapterNumber < 1) {
    return <BibleReaderError locale={locale} message={readerPageCopy[activeLocale].invalidChapter} />;
  }

  let bibleChapter: BibleChapterResponse | null = null;
  let bookMetadata: BibleBookMetadata | null = null;
  let bookContext: TimelineBookContextRow | null = null;
  let relatedMetadata: BibleReaderRelatedMetadataPreview = emptyRelatedMetadataPreview();
  let errorMessage = "";
  let isChapterOutOfRange = false;

  try {
    bookMetadata = await getBibleBookMetadata(version, book);

    if (chapterNumber > bookMetadata.chapter_count) {
      isChapterOutOfRange = true;
    } else {
      bibleChapter = await getBibleChapter(version, book, chapterNumber);
      const bookContextData = await loadBookContextData(book, locale);
      bookContext = bookContextData.bookContext;
      relatedMetadata = bookContextData.relatedMetadata;
    }
  } catch {
    errorMessage = readerPageCopy[activeLocale].chapterLoadError;
  }

  if (isChapterOutOfRange) {
    return <BibleReaderError locale={locale} message={readerPageCopy[activeLocale].chapterLoadError} />;
  }

  if (!bibleChapter || !bookMetadata) {
    return <BibleReaderError locale={locale} message={errorMessage} />;
  }

  return (
    <SiteShell locale={locale}>
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <BibleReader
          bookContext={bookContext}
          bookMetadata={bookMetadata}
          chapter={bibleChapter}
          initialSearchQuery={query.q ?? ""}
          locale={locale}
          mode={mode}
          relatedMetadata={relatedMetadata}
        />
      </div>
    </SiteShell>
  );
}

const readerPageCopy = {
  en: {
    invalidChapter: "Invalid chapter request.",
    chapterLoadError: "Bible chapter could not be loaded.",
  },
  ko: {
    invalidChapter: "잘못된 장 요청입니다.",
    chapterLoadError: "성경 장을 불러올 수 없습니다.",
  },
};

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

async function loadBookContextData(bookId: string, locale: string): Promise<{
  bookContext: TimelineBookContextRow | null;
  relatedMetadata: BibleReaderRelatedMetadataPreview;
}> {
  try {
    const timelinePackageDirectory = path.join(
      process.cwd(),
      "..",
      "docs",
      "data-packages",
      "timeline",
    );
    const [booksRaw, eventsRaw, kingdomsRaw] = await Promise.all([
      readFile(path.join(timelinePackageDirectory, "books.66-canonical-skeleton.json"), "utf8"),
      readFile(path.join(timelinePackageDirectory, "events.core-biblical-skeleton.json"), "utf8"),
      readFile(path.join(timelinePackageDirectory, "kings-kingdoms.skeleton.json"), "utf8"),
    ]);

    const canonicalBooks = normalizeCanonicalBooksPackage(
      JSON.parse(booksRaw) as CanonicalBooksPackage,
    );
    const coreEvents = normalizeCoreBiblicalEventsPackage(
      JSON.parse(eventsRaw) as CoreBiblicalEventsPackage,
    );
    const kingdoms = normalizeKingsKingdomsPackage(
      JSON.parse(kingdomsRaw) as KingsKingdomsPackage,
    );
    const bookContext = canonicalBooks.find((row) => row.bookId === bookId) ?? null;

    return {
      bookContext,
      relatedMetadata: bookContext
        ? createRelatedMetadataPreview({
            bookContext,
            canonicalBooks,
            coreEvents,
            kingdoms,
            locale,
          })
        : emptyRelatedMetadataPreview(),
    };
  } catch {
    return {
      bookContext: null,
      relatedMetadata: emptyRelatedMetadataPreview(),
    };
  }
}

function emptyRelatedMetadataPreview(): BibleReaderRelatedMetadataPreview {
  return {
    books: [],
    events: [],
    kingdoms: [],
    places: [],
  };
}

function createRelatedMetadataPreview({
  bookContext,
  canonicalBooks,
  coreEvents,
  kingdoms,
  locale,
}: {
  bookContext: TimelineBookContextRow;
  canonicalBooks: TimelineBookContextRow[];
  coreEvents: Array<{ id: string; title: TimelineText }>;
  kingdoms: Array<{ id: string; title: TimelineText }>;
  locale: string;
}): BibleReaderRelatedMetadataPreview {
  const timelineLocale = locale === "en" ? "en" : "ko";
  const booksById = new Map(
    canonicalBooks.map((row) => [
      row.bookId,
      {
        id: row.bookId,
        label: row.title,
        timelineHref: createTimelineHref(timelineLocale, "books", "book", row.bookId),
      },
    ]),
  );
  const eventsById = new Map(
    coreEvents.map((row) => [
      row.id,
      {
        id: row.id,
        label: row.title,
        timelineHref: createTimelineHref(timelineLocale, "events", "event", row.id),
      },
    ]),
  );
  const kingdomsById = new Map(
    kingdoms.map((row) => [
      row.id,
      {
        id: row.id,
        label: row.title,
        timelineHref: createTimelineHref(timelineLocale, "kingdoms", "kingdom", row.id),
      },
    ]),
  );
  const placesById = new Map(
    timelineSchematicPlaceRows.flatMap((row) => [
      [row.placeId, { id: row.placeId, label: row.title }] as const,
      [row.id, { id: row.id, label: row.title }] as const,
    ]),
  );

  return {
    books: dedupePreviewItems((bookContext.relatedBookIds ?? []).map((id) => booksById.get(id)).filter(isDefined)),
    events: dedupePreviewItems((bookContext.relatedEventIds ?? []).map((id) => eventsById.get(id)).filter(isDefined)),
    kingdoms: dedupePreviewItems(
      [
        ...(bookContext.relatedKingdomIds ?? []).map((id) => kingdomsById.get(id)).filter(isDefined),
        ...(bookContext.relatedKingdoms ?? []).map((label, index) => ({
          id: `${bookContext.id}-related-kingdom-${index}`,
          label,
        })),
      ],
    ),
    places: dedupePreviewItems((bookContext.relatedPlaces ?? []).map((id) => placesById.get(id)).filter(isDefined)),
  };
}

function dedupePreviewItems<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

function createTimelineHref(
  locale: "en" | "ko",
  view: "events" | "books" | "kingdoms",
  inspectType: "event" | "book" | "kingdom",
  inspectId: string,
) {
  const params = new URLSearchParams({
    inspectId,
    inspectType,
    view,
  });

  return `/${locale}/timeline?${params.toString()}`;
}

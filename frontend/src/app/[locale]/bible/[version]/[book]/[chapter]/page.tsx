import type { Metadata } from "next";

import { SiteShell } from "@/components/layout/SiteShell";
import { BibleReader } from "@/components/scripture/BibleReader";
import { Container } from "@/components/ui/Container";
import { getBibleChapter } from "@/lib/api/bible";
import { createMetadata } from "@/lib/seo/metadata";
import type { BibleChapterResponse, BibleReaderParams } from "@/types/bible";

type BibleReaderPageProps = {
  params: Promise<BibleReaderParams>;
};

export async function generateMetadata({
  params,
}: BibleReaderPageProps): Promise<Metadata> {
  const { version, book, chapter } = await params;

  return createMetadata({
    title: `${version} ${book} ${chapter}`,
  });
}

export default async function BibleReaderPage({ params }: BibleReaderPageProps) {
  const { locale, version, book, chapter } = await params;
  const chapterNumber = Number(chapter);

  if (!Number.isInteger(chapterNumber) || chapterNumber < 1) {
    return <BibleReaderError message="Invalid chapter request." />;
  }

  let bibleChapter: BibleChapterResponse | null = null;
  let errorMessage = "";

  try {
    bibleChapter = await getBibleChapter(version, book, chapterNumber);
  } catch {
    errorMessage = "Bible chapter could not be loaded.";
  }

  if (!bibleChapter) {
    return <BibleReaderError message={errorMessage} />;
  }

  return (
    <SiteShell>
      <Container>
        <BibleReader chapter={bibleChapter} locale={locale} />
      </Container>
    </SiteShell>
  );
}

function BibleReaderError({ message }: { message: string }) {
  return (
    <SiteShell>
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

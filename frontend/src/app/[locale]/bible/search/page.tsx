import type { Metadata } from "next";

import { SiteShell } from "@/components/layout/SiteShell";
import { BibleSearchResults } from "@/components/scripture/BibleSearchResults";
import { Container } from "@/components/ui/Container";
import { searchBible } from "@/lib/api/bible";
import { createMetadata } from "@/lib/seo/metadata";
import type { BibleSearchResponse } from "@/types/bible";

type BibleSearchPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    q?: string;
    translation?: string;
    page?: string;
    per_page?: string;
  }>;
};

const DEFAULT_TRANSLATION = "KRV";
const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 20;
const MAX_PER_PAGE = 50;

export const metadata: Metadata = createMetadata({
  title: "Bible Search",
});

export default async function BibleSearchPage({
  params,
  searchParams,
}: BibleSearchPageProps) {
  const { locale } = await params;
  const query = await searchParams;
  const q = typeof query.q === "string" ? query.q.trim() : "";
  const translation =
    typeof query.translation === "string" && query.translation.trim() !== ""
      ? query.translation.trim().toUpperCase()
      : DEFAULT_TRANSLATION;
  const page = parsePositiveInt(query.page, DEFAULT_PAGE);
  const perPage = Math.min(
    parsePositiveInt(query.per_page, DEFAULT_PER_PAGE),
    MAX_PER_PAGE,
  );

  let search: BibleSearchResponse | null = null;
  let errorMessage = "";

  if (q.length > 0 && q.length < 2) {
    errorMessage = "Search query must be at least 2 characters.";
  } else if (q.length >= 2) {
    try {
      search = await searchBible({
        q,
        translation,
        page,
        perPage,
      });
    } catch {
      errorMessage = "Bible search could not be loaded.";
    }
  }

  return (
    <SiteShell>
      <Container>
        <BibleSearchResults
          errorMessage={errorMessage}
          locale={locale}
          page={page}
          perPage={perPage}
          q={q}
          search={search}
          translation={translation}
        />
      </Container>
    </SiteShell>
  );
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

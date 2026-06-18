import { apiRequest } from "@/lib/api/client";
import type {
  BibleChapterResponse,
  BibleSearchParams,
  BibleSearchResponse,
} from "@/types/bible";

export function getBibleChapter(
  version: string,
  book: string,
  chapter: number,
): Promise<BibleChapterResponse> {
  return apiRequest<BibleChapterResponse>(
    `/wcm/v1/bible/${encodeURIComponent(version)}/${encodeURIComponent(book)}/${chapter}`,
  );
}

export function searchBible({
  q,
  translation = "KRV",
  page = 1,
  perPage = 20,
}: BibleSearchParams): Promise<BibleSearchResponse> {
  const params = new URLSearchParams({
    q,
    translation,
    page: String(page),
    per_page: String(perPage),
  });

  return apiRequest<BibleSearchResponse>(`/wcm/v1/search?${params.toString()}`);
}

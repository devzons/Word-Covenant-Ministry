import { apiRequest } from "@/lib/api/client";
import type { BibleChapterResponse } from "@/types/bible";

export function getBibleChapter(
  version: string,
  book: string,
  chapter: number,
): Promise<BibleChapterResponse> {
  return apiRequest<BibleChapterResponse>(
    `/wcm/v1/bible/${encodeURIComponent(version)}/${encodeURIComponent(book)}/${chapter}`,
  );
}

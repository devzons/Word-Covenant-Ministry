import { apiRequest } from "@/lib/api/client";
import type {
  CrossReferenceResponse,
  CrossReferenceSearchParams,
} from "@/types/cross-reference";

export function getCrossReferences({
  book,
  chapter,
  verse,
  page = 1,
  perPage = 20,
}: CrossReferenceSearchParams): Promise<CrossReferenceResponse> {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });

  return apiRequest<CrossReferenceResponse>(
    `/wcm/v1/cross-references/${encodeURIComponent(book)}/${chapter}/${verse}?${params.toString()}`,
  );
}

import { apiRequest } from "@/lib/api/client";
import type {
  HighLevelInterlinearResponse,
  OriginalLanguageInterlinearResponse,
  OriginalLanguageSourceAlias,
  OriginalLanguageStrongsTermsResponse,
  OriginalLanguageTermOccurrencesResponse,
  OriginalLanguageTermResponse,
  OriginalLanguageType,
  OriginalLanguageVerseResponse,
  WordStudyStrongsResponse,
  WordStudyTermDistributionResponse,
  WordStudyTermResponse,
} from "@/types/original-language";

export function getOriginalLanguageVerse(
  source: OriginalLanguageSourceAlias,
  book: string,
  chapter: number,
  verse: number,
): Promise<OriginalLanguageVerseResponse> {
  return apiRequest<OriginalLanguageVerseResponse>(
    `/wcm/v1/original-language/${encodePathSegment(source)}/${encodePathSegment(book)}/${chapter}/${verse}`,
  );
}

export function getOriginalLanguageInterlinear(
  source: OriginalLanguageSourceAlias,
  book: string,
  chapter: number,
  verse: number,
): Promise<OriginalLanguageInterlinearResponse> {
  return apiRequest<OriginalLanguageInterlinearResponse>(
    `/wcm/v1/original-language/interlinear/${encodePathSegment(source)}/${encodePathSegment(book)}/${chapter}/${verse}`,
  );
}

export function getOriginalLanguageTerm(
  termId: number,
): Promise<OriginalLanguageTermResponse> {
  return apiRequest<OriginalLanguageTermResponse>(
    `/wcm/v1/original-language/terms/${termId}`,
  );
}

export function getOriginalLanguageTermOccurrences(
  termId: number,
  page = 1,
  perPage = 20,
): Promise<OriginalLanguageTermOccurrencesResponse> {
  const params = paginationParams(page, perPage);

  return apiRequest<OriginalLanguageTermOccurrencesResponse>(
    `/wcm/v1/original-language/terms/${termId}/occurrences?${params.toString()}`,
  );
}

export function getOriginalLanguageStrongs(
  strongsNumber: string,
  language: OriginalLanguageType,
  page = 1,
  perPage = 20,
): Promise<OriginalLanguageStrongsTermsResponse> {
  const params = paginationParams(page, perPage);
  params.set("language", language);

  return apiRequest<OriginalLanguageStrongsTermsResponse>(
    `/wcm/v1/original-language/strongs/${encodePathSegment(strongsNumber)}?${params.toString()}`,
  );
}

export function getWordStudyStrong(
  strongsNumber: string,
): Promise<WordStudyStrongsResponse> {
  return apiRequest<WordStudyStrongsResponse>(
    `/wcm/v1/word-study/strongs/${encodePathSegment(strongsNumber)}`,
  );
}

export function getWordStudyTerm(
  termId: number,
  page = 1,
  perPage = 20,
): Promise<WordStudyTermResponse> {
  const params = paginationParams(page, perPage);

  return apiRequest<WordStudyTermResponse>(
    `/wcm/v1/word-study/terms/${termId}?${params.toString()}`,
  );
}

export function getWordStudyTermDistribution(
  termId: number,
): Promise<WordStudyTermDistributionResponse> {
  return apiRequest<WordStudyTermDistributionResponse>(
    `/wcm/v1/word-study/terms/${termId}/distribution`,
  );
}

export function getInterlinearVerse(
  source: OriginalLanguageSourceAlias,
  book: string,
  chapter: number,
  verse: number,
): Promise<HighLevelInterlinearResponse> {
  return apiRequest<HighLevelInterlinearResponse>(
    `/wcm/v1/interlinear/${encodePathSegment(source)}/${encodePathSegment(book)}/${chapter}/${verse}`,
  );
}

function paginationParams(page: number, perPage: number): URLSearchParams {
  return new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });
}

function encodePathSegment(segment: number | string): string {
  return encodeURIComponent(String(segment));
}

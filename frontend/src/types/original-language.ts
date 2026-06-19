export type OriginalLanguageSourceDataset = "STEP_TAGNT" | "STEP_TAHOT";

export type OriginalLanguageSourceAlias =
  | OriginalLanguageSourceDataset
  | "step_tagnt"
  | "step_tahot"
  | "step-tagnt"
  | "step-tahot"
  | "tagnt"
  | "tahot";

export type OriginalLanguageReaderMode = "reader" | "original" | "interlinear";

export type OriginalLanguageType = "hebrew" | "greek";

export type OriginalLanguageBook = {
  id: number;
  slug: string;
  name_ko: string;
  name_en: string;
};

export type OriginalLanguageDistributionBook = OriginalLanguageBook & {
  testament: string;
};

export type OriginalLanguageReference = {
  chapter: number;
  verse: number;
};

export type OriginalLanguagePaginationParams = {
  page?: number;
  perPage?: number;
};

export type OriginalLanguagePaginatedResponse = {
  total: number;
  page: number;
  per_page: number;
};

export type OriginalLanguageMeta = {
  count: number;
};

export type OriginalLanguageTerm = {
  id: number;
  language_type: OriginalLanguageType;
  lemma: string;
  lemma_normalized: string;
  strongs_number: string;
  strongs_extended: string;
  transliteration: string;
  gloss: string | null;
};

export type OriginalLanguageOccurrence = {
  id: number;
  term_id: number;
  book_id: number;
  chapter: number;
  verse: number;
  word_order: number;
  subword_order: number;
  token_type: string;
  surface_form: string;
  normalized_form: string;
  morphology: string;
  contextual_function: string | null;
  source_dataset: OriginalLanguageSourceDataset;
  source_ref: string;
};

export type OriginalLanguageJoinedOccurrence = Omit<
  OriginalLanguageOccurrence,
  "term_id" | "book_id" | "chapter" | "verse"
> & {
  term: OriginalLanguageTerm;
};

export type OriginalLanguageVerseResponse = {
  source_dataset: OriginalLanguageSourceDataset;
  book: OriginalLanguageBook;
  reference: OriginalLanguageReference;
  occurrences: OriginalLanguageJoinedOccurrence[];
  meta: OriginalLanguageMeta;
};

export type OriginalLanguageInterlinearToken = {
  id: number;
  source_dataset: OriginalLanguageSourceDataset;
  source_ref: string;
  word_order: number;
  subword_order: number;
  token_type: string;
  surface_form: string;
  normalized_form: string;
  lemma: string;
  lemma_normalized: string;
  strongs_number: string;
  strongs_extended: string;
  transliteration: string;
  morphology: string;
  gloss: string | null;
  contextual_function: string | null;
};

export type OriginalLanguageInterlinearResponse = {
  source_dataset: OriginalLanguageSourceDataset;
  book: OriginalLanguageBook;
  reference: OriginalLanguageReference;
  tokens: OriginalLanguageInterlinearToken[];
  meta: OriginalLanguageMeta;
};

export type OriginalLanguageTermResponse = {
  term: OriginalLanguageTerm;
};

export type OriginalLanguageTermOccurrencesResponse = OriginalLanguagePaginatedResponse & {
  term: OriginalLanguageTerm;
  occurrences: OriginalLanguageOccurrence[];
};

export type OriginalLanguageStrongsTermsResponse = OriginalLanguagePaginatedResponse & {
  language_type: OriginalLanguageType;
  strongs_number: string;
  terms: OriginalLanguageTerm[];
};

export type WordStudyTerm = OriginalLanguageTerm & {
  occurrence_count: number;
};

export type WordStudyExtendedTermsGroup = {
  strongs_extended: string;
  term_count: number;
  occurrence_count: number;
  terms: WordStudyTerm[];
};

export type WordStudyBookDistribution = {
  book: OriginalLanguageDistributionBook;
  occurrence_count: number;
};

export type WordStudyTermSummary = {
  total_occurrences: number;
  book_count: number;
  chapter_count: number;
};

export type WordStudyTermChapterDistribution = {
  chapter: number;
  occurrence_count: number;
};

export type WordStudyTermBookDistribution = WordStudyBookDistribution & {
  chapters: WordStudyTermChapterDistribution[];
};

export type WordStudyStrongsResponse = {
  language_type: OriginalLanguageType;
  strongs_number: string;
  total_terms: number;
  total_occurrences: number;
  terms_by_extended: WordStudyExtendedTermsGroup[];
  book_distribution: WordStudyBookDistribution[];
};

export type WordStudyTermResponse = {
  term: OriginalLanguageTerm;
  summary: WordStudyTermSummary;
  sample_occurrences: OriginalLanguageOccurrence[];
  page: number;
  per_page: number;
};

export type WordStudyTermDistributionResponse = {
  term: OriginalLanguageTerm;
  summary: WordStudyTermSummary;
  books: WordStudyTermBookDistribution[];
};

export type HighLevelInterlinearVersion = {
  code: string;
  name: string;
  language: string;
};

export type HighLevelInterlinearToken = {
  id: number;
  source_ref: string;
  position: {
    word_order: number;
    subword_order: number;
  };
  token_type: string;
  surface_form: string;
  normalized_form: string;
  morphology: string;
  contextual_function: string | null;
  term: OriginalLanguageTerm;
};

export type HighLevelInterlinearResponse = {
  source_dataset: OriginalLanguageSourceDataset;
  version: HighLevelInterlinearVersion;
  book: OriginalLanguageBook;
  reference: OriginalLanguageReference;
  text: string;
  tokens: HighLevelInterlinearToken[];
  meta: {
    token_count: number;
  };
};

export type OriginalLanguageVerseParams = {
  source: OriginalLanguageSourceAlias;
  book: string;
  chapter: number;
  verse: number;
};

export type OriginalLanguageTermOccurrencesParams = OriginalLanguagePaginationParams & {
  termId: number;
};

export type OriginalLanguageStrongsTermsParams = OriginalLanguagePaginationParams & {
  strongsNumber: string;
  language: OriginalLanguageType;
};

export type WordStudyTermParams = OriginalLanguagePaginationParams & {
  termId: number;
};

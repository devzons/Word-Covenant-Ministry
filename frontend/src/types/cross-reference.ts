export type CrossReferenceSourceReference = {
  book: string;
  chapter: number;
  verse: number;
};

export type CrossReferenceTargetReference = {
  book: string;
  start_chapter: number;
  start_verse: number;
  end_chapter: number | null;
  end_verse: number | null;
};

export type CrossReferenceItem = {
  target_reference: CrossReferenceTargetReference;
  relationship_type: string;
  relationship_label: string;
  review_status: string;
  source_score: number | null;
  source_dataset: string;
};

export type CrossReferencePagination = {
  page: number;
  per_page: number;
  total: number;
  has_more: boolean;
};

export type CrossReferenceAttribution = {
  source_dataset: string;
  attribution: string;
  source_url: string;
};

export type CrossReferenceResponse = {
  source_reference: CrossReferenceSourceReference;
  items: CrossReferenceItem[];
  pagination: CrossReferencePagination;
  attribution: CrossReferenceAttribution;
  source_dataset_summary: Record<string, number>;
};

export type CrossReferenceSearchParams = {
  book: string;
  chapter: number;
  verse: number;
  page?: number;
  perPage?: number;
};

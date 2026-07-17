export type StudyLocale = "en" | "ko";

export type StudyContentSummary = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  modified: string;
  link: string;
  studyCategoryIds: number[];
};

export type StudyCategory = {
  id: number;
  slug: string;
  name: string;
  description: string;
  count: number;
  link: string;
  parent: number;
};

export type StudyContentQueryOptions = {
  page?: number;
  perPage?: number;
  search?: string;
  categoryId?: number;
  order?: "asc" | "desc";
  orderBy?: "date" | "modified" | "title";
};

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

export type StudyCategoryRef = {
  id: number;
  slug: string;
  name: string;
  parent: number;
};

export type StudyContentDetail = StudyContentSummary & {
  content: string;
  authorName: string;
  categories: StudyCategoryRef[];
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

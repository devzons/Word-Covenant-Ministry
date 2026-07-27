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

export type StudyEngagement = {
  study_id: number;
  locale: StudyLocale;
  views_total: number;
  views_7d: number;
  views_30d: number;
  comments_approved: number;
};

export type StudyViewRecordResult = StudyEngagement & {
  counted: boolean;
  reason: "recorded" | "duplicate" | "prefetch" | "bot";
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

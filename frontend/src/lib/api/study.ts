import { apiRequest } from "@/lib/api/client";
import type {
  StudyCategory,
  StudyContentQueryOptions,
  StudyContentSummary,
  StudyLocale,
} from "@/types/study";

type WordPressRenderedField = {
  rendered?: string;
};

type WordPressStudyContent = {
  id?: number;
  slug?: string;
  title?: WordPressRenderedField;
  excerpt?: WordPressRenderedField;
  date?: string;
  modified?: string;
  link?: string;
  categories?: unknown;
  wcm_study_category?: unknown;
  wcm_study_category_ids?: unknown;
};

type WordPressStudyCategory = {
  id?: number;
  slug?: string;
  name?: string;
  description?: string;
  count?: number;
  link?: string;
  parent?: number;
};

export async function fetchStudyContents(
  locale: StudyLocale,
  options: StudyContentQueryOptions = {},
): Promise<StudyContentSummary[]> {
  const params = new URLSearchParams({
    _fields: "id,slug,title,excerpt,date,modified,link,categories,wcm_study_category",
    per_page: String(toPositiveInt(options.perPage, 20)),
    page: String(toPositiveInt(options.page, 1)),
    status: "publish",
    order: options.order ?? "desc",
    orderby: options.orderBy ?? "date",
  });
  params.set("lang", locale);

  if (typeof options.search === "string" && options.search.trim() !== "") {
    params.set("search", options.search.trim());
  }

  if (typeof options.categoryId === "number" && Number.isInteger(options.categoryId)) {
    params.set("wcm_study_category", String(options.categoryId));
  }

  try {
    const response = await apiRequest<WordPressStudyContent[]>(`/wp/v2/wcm_study?${params.toString()}`);

    return normalizeStudyContentList(response);
  } catch {
    return [];
  }
}

export async function fetchStudyCategories(locale: StudyLocale): Promise<StudyCategory[]> {
  const params = new URLSearchParams({
    _fields: "id,slug,name,description,count,link,parent",
    per_page: "100",
    order: "asc",
    orderby: "name",
    hide_empty: "false",
  });
  params.set("lang", locale);

  try {
    const response = await apiRequest<WordPressStudyCategory[]>(`/wp/v2/wcm_study_category?${params.toString()}`);

    return normalizeStudyCategoryList(response);
  } catch {
    return [];
  }
}

function normalizeStudyContentList(response: WordPressStudyContent[] | unknown): StudyContentSummary[] {
  if (!Array.isArray(response)) {
    return [];
  }

  return response.flatMap((item) => {
    const content = normalizeStudyContent(item);

    return content ? [content] : [];
  });
}

function normalizeStudyContent(item: unknown): StudyContentSummary | null {
  if (!isRecord(item)) {
    return null;
  }

  const id = parseNumber(item.id);
  const slug = parseString(item.slug);
  const title = parseRenderedString(item.title);
  const excerpt = parseRenderedString(item.excerpt);
  const date = parseString(item.date);
  const modified = parseString(item.modified);
  const link = parseString(item.link);
  const studyCategoryIds = parseStudyCategoryIds(item);

  if (id === null || slug === "" || title === "") {
    return null;
  }

  return {
    id,
    slug,
    title,
    excerpt,
    date,
    modified,
    link,
    studyCategoryIds,
  };
}

function normalizeStudyCategoryList(response: WordPressStudyCategory[] | unknown): StudyCategory[] {
  if (!Array.isArray(response)) {
    return [];
  }

  return response.flatMap((item) => {
    const category = normalizeStudyCategory(item);

    return category ? [category] : [];
  });
}

function normalizeStudyCategory(item: unknown): StudyCategory | null {
  if (!isRecord(item)) {
    return null;
  }

  const id = parseNumber(item.id);
  const slug = parseString(item.slug);
  const name = parseString(item.name);
  const description = parseString(item.description);
  const count = parseNumber(item.count) ?? 0;
  const link = parseString(item.link);
  const parent = parseNumber(item.parent) ?? 0;

  if (id === null || slug === "" || name === "") {
    return null;
  }

  return {
    id,
    slug,
    name,
    description,
    count,
    link,
    parent,
  };
}

function parseStudyCategoryIds(item: Record<string, unknown>): number[] {
  const rawValue =
    item.wcm_study_category ?? item.wcm_study_category_ids ?? item.categories ?? [];

  if (!Array.isArray(rawValue)) {
    return [];
  }

  return rawValue.flatMap((value) => {
    if (isRecord(value)) {
      const parsedFromObject = parseNumber(value.id);

      return parsedFromObject === null ? [] : [parsedFromObject];
    }

    const parsed = parseNumber(value);

    return parsed === null ? [] : [parsed];
  });
}

function parseRenderedString(value: unknown): string {
  if (!isRecord(value)) {
    return "";
  }

  return parseString(value.rendered);
}

function parseNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function parseString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function toPositiveInt(value: number | undefined, fallback: number): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    return fallback;
  }

  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

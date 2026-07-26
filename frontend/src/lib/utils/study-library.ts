import type {
  StudyCategory,
  StudyCategoryRef,
  StudyContentDetail,
  StudyContentSummary,
} from "@/types/study";

export type StudyLibraryVariant = "sermons" | "publications";
export type StudyLibraryPublicationKind = "all" | "books" | "papers";

export type StudyLibraryItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  modified: string;
  link: string;
  studyCategoryIds: number[];
  topLevelSlug: string | null;
  topLevelName: string | null;
  branchSlug: string | null;
  branchName: string | null;
};

export type StudyLibraryGroup = {
  id: string;
  slug: string;
  title: string;
  description: string;
  count: number;
  items: StudyLibraryItem[];
};

export type StudyLibraryScope = {
  groups: StudyLibraryGroup[];
  items: StudyLibraryItem[];
};

const SERMON_CATEGORY_SLUG = "sermon_exposition";
const PUBLICATIONS_CATEGORY_SLUG = "books_papers";
const BOOKS_CATEGORY_SLUG = "book_intro";
const PAPERS_CATEGORY_SLUG = "research_paper";

export function buildStudyLibraryScope(
  variant: StudyLibraryVariant,
  contents: StudyContentSummary[],
  categories: StudyCategory[],
  publicationKind: StudyLibraryPublicationKind = "all",
): StudyLibraryScope {
  const categoriesById = new Map(categories.map((category) => [category.id, category]));

  const items = contents
    .map((content) => decorateStudyContent(content, categoriesById))
    .filter((item) => matchesStudyVariant(item, variant, publicationKind))
    .sort((a, b) => a.title.localeCompare(b.title));

  if (variant === "sermons") {
    const sermonCategory = categories.find((category) => category.slug === SERMON_CATEGORY_SLUG);

    return {
      groups: [
        {
          id: sermonCategory ? `category-${sermonCategory.id}` : SERMON_CATEGORY_SLUG,
          slug: SERMON_CATEGORY_SLUG,
          title: sermonCategory?.name ?? "Sermons & Exposition",
          description: sermonCategory?.description ?? "",
          count: items.length,
          items,
        },
      ],
      items,
    };
  }

  const booksCategory = categories.find((category) => category.slug === BOOKS_CATEGORY_SLUG);
  const papersCategory = categories.find((category) => category.slug === PAPERS_CATEGORY_SLUG);
  const orderedGroups = [booksCategory, papersCategory].filter(
    (category): category is StudyCategory => Boolean(category),
  );

  return {
    groups: orderedGroups.map((group) => {
      const groupItems = items.filter((item) => item.branchSlug === group.slug);

      return {
        id: `category-${group.id}`,
        slug: group.slug,
        title: group.name,
        description: group.description,
        count: groupItems.length,
        items: groupItems,
      };
    }),
    items,
  };
}

export function filterStudyLibraryItems(
  scope: StudyLibraryScope,
  query: string,
): StudyLibraryItem[] {
  const normalizedQuery = normalizeQuery(query);

  if (normalizedQuery === "") {
    return scope.items;
  }

  return scope.items.filter((item) => {
    const haystack = [
      item.title,
      item.excerpt,
      item.branchName ?? "",
      item.topLevelName ?? "",
    ]
      .join(" ")
      .toLocaleLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function resolveOpenGroupSlug(
  scope: StudyLibraryScope,
  selectedSlug: string | null,
): string | null {
  if (!selectedSlug) {
    return scope.groups[0]?.slug ?? null;
  }

  const selected = scope.items.find((item) => item.slug === selectedSlug);

  if (!selected) {
    return scope.groups[0]?.slug ?? null;
  }

  return selected.branchSlug ?? selected.topLevelSlug ?? scope.groups[0]?.slug ?? null;
}

export function buildStudyDetailHref(
  locale: "en" | "ko",
  variant: StudyLibraryVariant,
  slug: string,
): string {
  return variant === "sermons"
    ? `/${locale}/sermons/${encodeURIComponent(slug)}`
    : `/${locale}/study/${encodeURIComponent(slug)}`;
}

export function buildStudyIndexHref(
  locale: "en" | "ko",
  variant: StudyLibraryVariant,
): string {
  return variant === "sermons" ? `/${locale}/sermons` : `/${locale}/study`;
}

export function getStudyTopLevelLabel(
  detail: Pick<StudyContentDetail, "categories" | "studyCategoryIds">,
  categories: StudyCategory[],
): { topLevel: StudyCategory | null; branch: StudyCategory | null } {
  const categoriesById = new Map(categories.map((category) => [category.id, category]));
  const refs = detail.categories.length > 0
    ? detail.categories
    : detail.studyCategoryIds
        .map((categoryId) => categoriesById.get(categoryId))
        .filter((category): category is StudyCategory => Boolean(category))
        .map((category) => ({
          id: category.id,
          slug: category.slug,
          name: category.name,
          parent: category.parent,
        }));

  const branch = refs[0] ?? null;
  const topLevel = branch ? resolveTopLevelCategory(branch, categoriesById) : null;

  return {
    topLevel,
    branch: branch ? categoriesById.get(branch.id) ?? null : null,
  };
}

export function buildStudySiblingLinks(
  locale: "en" | "ko",
  variant: StudyLibraryVariant,
  currentSlug: string,
  scope: StudyLibraryScope,
  searchQuery: string,
  publicationKind: StudyLibraryPublicationKind = "all",
): { previous: { title: string; href: string } | null; next: { title: string; href: string } | null } {
  const visibleItems = filterStudyLibraryItems(scope, searchQuery);
  const currentIndex = visibleItems.findIndex((item) => item.slug === currentSlug);
  const previousItem = currentIndex > 0 ? visibleItems[currentIndex - 1] : null;
  const nextItem = currentIndex >= 0 && currentIndex < visibleItems.length - 1
    ? visibleItems[currentIndex + 1]
    : null;

  return {
    previous: previousItem
      ? {
          title: previousItem.title,
          href: appendStudyQuery(
            buildStudyDetailHref(locale, variant, previousItem.slug),
            searchQuery,
            publicationKind,
            variant,
          ),
        }
      : null,
    next: nextItem
      ? {
          title: nextItem.title,
          href: appendStudyQuery(
            buildStudyDetailHref(locale, variant, nextItem.slug),
            searchQuery,
            publicationKind,
            variant,
          ),
        }
      : null,
  };
}

export function appendStudyQuery(
  href: string,
  searchQuery: string,
  publicationKind: StudyLibraryPublicationKind,
  variant: StudyLibraryVariant,
): string {
  const params = new URLSearchParams();

  if (normalizeQuery(searchQuery) !== "") {
    params.set("q", searchQuery.trim());
  }

  if (variant === "publications" && publicationKind !== "all") {
    params.set("kind", publicationKind);
  }

  const query = params.toString();

  return query === "" ? href : `${href}?${query}`;
}

function decorateStudyContent(
  content: StudyContentSummary,
  categoriesById: Map<number, StudyCategory>,
): StudyLibraryItem {
  const categoryRefs = content.studyCategoryIds
    .map((categoryId) => categoriesById.get(categoryId))
    .filter((category): category is StudyCategory => Boolean(category));
  const branch = categoryRefs[0] ?? null;
  const topLevel = branch ? resolveTopLevelCategory(branch, categoriesById) : null;

  return {
    ...content,
    topLevelSlug: topLevel?.slug ?? null,
    topLevelName: topLevel?.name ?? null,
    branchSlug: branch?.slug ?? topLevel?.slug ?? null,
    branchName: branch?.name ?? topLevel?.name ?? null,
  };
}

function resolveTopLevelCategory(
  branch: Pick<StudyCategoryRef, "id" | "parent">,
  categoriesById: Map<number, StudyCategory>,
): StudyCategory | null {
  let current = categoriesById.get(branch.id) ?? null;

  while (current && current.parent > 0) {
    current = categoriesById.get(current.parent) ?? null;
  }

  return current;
}

function matchesStudyVariant(
  item: StudyLibraryItem,
  variant: StudyLibraryVariant,
  publicationKind: StudyLibraryPublicationKind,
): boolean {
  if (variant === "sermons") {
    return item.topLevelSlug === SERMON_CATEGORY_SLUG;
  }

  if (item.topLevelSlug !== PUBLICATIONS_CATEGORY_SLUG) {
    return false;
  }

  if (publicationKind === "books") {
    return item.branchSlug === BOOKS_CATEGORY_SLUG;
  }

  if (publicationKind === "papers") {
    return item.branchSlug === PAPERS_CATEGORY_SLUG;
  }

  return true;
}

function normalizeQuery(value: string): string {
  return value.trim().toLocaleLowerCase();
}

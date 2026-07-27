import { notFound } from "next/navigation";

import { StudyContentArticle } from "@/components/content/study/StudyContentArticle";
import { siteConfig } from "@/config/site";
import { fetchStudyCategories, fetchStudyContentBySlug, fetchStudyContents } from "@/lib/api/study";
import {
  buildStudyIndexHref,
  buildStudyLibraryScope,
  buildStudySiblingLinks,
  getStudyTopLevelLabel,
  type StudyLibraryPublicationKind,
} from "@/lib/utils/study-library";

type StudyPublicationDetailPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
  searchParams: Promise<{
    q?: string;
    kind?: string;
  }>;
};

const copy = {
  en: {
    archive: "Open library",
    source: "Open source post",
    previous: "Previous document",
    next: "Next document",
    emptyBody: "This document is published without body content yet.",
    date: "Published",
    books: "Book",
    papers: "Research Paper",
  },
  ko: {
    archive: "라이브러리 열기",
    source: "원문 글 열기",
    previous: "이전 문서",
    next: "다음 문서",
    emptyBody: "이 문서는 아직 본문이 공개되지 않았습니다.",
    date: "공개일",
    books: "책",
    papers: "연구논문",
  },
} as const;

export const dynamic = "force-dynamic";

export default async function StudyPublicationDetailPage({
  params,
  searchParams,
}: StudyPublicationDetailPageProps) {
  const { locale, slug } = await params;
  const { q = "", kind = "" } = await searchParams;
  const activeLocale = getSupportedLocale(locale);
  const pageCopy = copy[activeLocale];
  const publicationKind = getPublicationKind(kind);
  const [detail, categories, contents] = await Promise.all([
    fetchStudyContentBySlug(activeLocale, slug),
    fetchStudyCategories(activeLocale),
    fetchStudyContents(activeLocale, { perPage: 100, order: "asc", orderBy: "title" }),
  ]);

  if (!detail) {
    notFound();
  }

  const labels = getStudyTopLevelLabel(detail, categories);

  if (labels.topLevel?.slug !== "books_papers") {
    notFound();
  }

  const scope = buildStudyLibraryScope("publications", contents, categories, publicationKind);
  const siblings = buildStudySiblingLinks(
    activeLocale,
    "publications",
    detail.slug,
    scope,
    q,
    publicationKind,
  );
  const subtitle = formatStudyDate(detail.date, activeLocale, detail.authorName);
  const badge = labels.branch?.slug === "research_paper" ? pageCopy.papers : pageCopy.books;

  return (
    <StudyContentArticle
      badge={badge}
      breadcrumb={[
        activeLocale === "en" ? "Study" : "말씀연구",
        activeLocale === "en" ? "Books & Research Papers" : "책과 연구논문",
        detail.title,
      ]}
      categoryLabel={labels.branch?.name ?? badge}
      contentHtml={detail.content}
      dateLabel={pageCopy.date}
      emptyBody={pageCopy.emptyBody}
      excerpt={detail.excerpt}
      metaValue={subtitle}
      nextHref={siblings.next?.href ?? null}
      nextLabel={pageCopy.next}
      nextTitle={siblings.next?.title ?? null}
      openArchiveHref={buildStudyIndexHref(activeLocale, "publications")}
      openArchiveLabel={pageCopy.archive}
      openSourceHref={detail.link}
      openSourceLabel={pageCopy.source}
      previousHref={siblings.previous?.href ?? null}
      previousLabel={pageCopy.previous}
      previousTitle={siblings.previous?.title ?? null}
      subtitle={subtitle}
      title={detail.title}
    />
  );
}

function getSupportedLocale(locale: string): "en" | "ko" {
  return siteConfig.supportedLocales.includes(
    locale as (typeof siteConfig.supportedLocales)[number],
  ) && locale === "en"
    ? "en"
    : "ko";
}

function getPublicationKind(value: string): StudyLibraryPublicationKind {
  return value === "books" || value === "papers" ? value : "all";
}

function formatStudyDate(value: string, locale: "en" | "ko", authorName: string): string {
  const date = new Date(value);
  const formattedDate = Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(locale === "en" ? "en-US" : "ko-KR", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);

  return authorName !== "" ? `${formattedDate} · ${authorName}` : formattedDate;
}

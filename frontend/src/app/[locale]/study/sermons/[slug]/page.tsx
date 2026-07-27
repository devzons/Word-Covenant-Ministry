import { notFound } from "next/navigation";

import { StudyContentArticle } from "@/components/content/study/StudyContentArticle";
import { siteConfig } from "@/config/site";
import { fetchStudyCategories, fetchStudyContentBySlug, fetchStudyContents } from "@/lib/api/study";
import {
  buildStudyIndexHref,
  buildStudyLibraryScope,
  buildStudySiblingLinks,
  getStudyTopLevelLabel,
} from "@/lib/utils/study-library";

type SermonDetailPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
  searchParams: Promise<{
    q?: string;
  }>;
};

const copy = {
  en: {
    badge: "Sermon & Exposition",
    archive: "Open archive",
    source: "Open source post",
    previous: "Previous manuscript",
    next: "Next manuscript",
    emptyBody: "This manuscript is published without body content yet.",
    date: "Published",
  },
  ko: {
    badge: "설교와 강해",
    archive: "아카이브 열기",
    source: "원문 글 열기",
    previous: "이전 원고",
    next: "다음 원고",
    emptyBody: "이 원고는 아직 본문이 공개되지 않았습니다.",
    date: "공개일",
  },
} as const;

export const dynamic = "force-dynamic";

export default async function StudySermonDetailPage({
  params,
  searchParams,
}: SermonDetailPageProps) {
  const { locale, slug } = await params;
  const { q = "" } = await searchParams;
  const activeLocale = getSupportedLocale(locale);
  const pageCopy = copy[activeLocale];
  const [detail, categories, contents] = await Promise.all([
    fetchStudyContentBySlug(activeLocale, slug),
    fetchStudyCategories(activeLocale),
    fetchStudyContents(activeLocale, { perPage: 100, order: "asc", orderBy: "title" }),
  ]);

  if (!detail) {
    notFound();
  }

  const labels = getStudyTopLevelLabel(detail, categories);

  if (labels.topLevel?.slug !== "sermon_exposition") {
    notFound();
  }

  const scope = buildStudyLibraryScope("sermons", contents, categories);
  const siblings = buildStudySiblingLinks(activeLocale, "sermons", detail.slug, scope, q);
  const subtitle = formatStudyDate(detail.date, activeLocale, detail.authorName);

  return (
    <StudyContentArticle
      badge={pageCopy.badge}
      breadcrumb={[
        activeLocale === "en" ? "Study" : "말씀연구",
        activeLocale === "en" ? "Sermons & Exposition" : "설교와 강해",
        detail.title,
      ]}
      categoryLabel={labels.branch?.name ?? pageCopy.badge}
      contentHtml={detail.content}
      dateLabel={pageCopy.date}
      emptyBody={pageCopy.emptyBody}
      excerpt={detail.excerpt}
      metaValue={subtitle}
      nextHref={siblings.next?.href ?? null}
      nextLabel={pageCopy.next}
      nextTitle={siblings.next?.title ?? null}
      openArchiveHref={buildStudyIndexHref(activeLocale, "sermons")}
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

import { redirect } from "next/navigation";

import {
  buildQueryString,
  buildStudyDetailHref,
} from "@/lib/utils/study-library";

type StudyLegacyPublicationRedirectPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
  searchParams: Promise<{
    q?: string;
    kind?: string;
  }>;
};

export default async function StudyLegacyPublicationRedirectPage({
  params,
  searchParams,
}: StudyLegacyPublicationRedirectPageProps) {
  const { locale, slug } = await params;
  const currentSearchParams = await searchParams;
  const activeLocale = locale === "en" ? "en" : "ko";
  const query = buildQueryString(currentSearchParams);

  redirect(buildStudyDetailHref(activeLocale, "publications", decodePathSegment(slug)) + query);
}

function decodePathSegment(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

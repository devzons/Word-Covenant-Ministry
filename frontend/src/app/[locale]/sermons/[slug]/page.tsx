import { redirect } from "next/navigation";

import {
  buildQueryString,
  buildStudyDetailHref,
} from "@/lib/utils/study-library";

type LegacySermonDetailPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export default async function LegacySermonDetailPage({
  params,
  searchParams,
}: LegacySermonDetailPageProps) {
  const { locale, slug } = await params;
  const activeLocale = locale === "en" ? "en" : "ko";
  const currentSearchParams = await searchParams;
  const query = buildQueryString(currentSearchParams);

  redirect(buildStudyDetailHref(activeLocale, "sermons", decodePathSegment(slug)) + query);
}

function decodePathSegment(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

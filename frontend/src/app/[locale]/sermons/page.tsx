import { redirect } from "next/navigation";

import {
  buildQueryString,
  buildStudyIndexHref,
} from "@/lib/utils/study-library";

type LegacySermonsIndexPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export default async function LegacySermonsIndexPage({
  params,
  searchParams,
}: LegacySermonsIndexPageProps) {
  const { locale } = await params;
  const activeLocale = locale === "en" ? "en" : "ko";
  const currentSearchParams = await searchParams;
  const query = buildQueryString(currentSearchParams);

  redirect(buildStudyIndexHref(activeLocale, "sermons") + query);
}

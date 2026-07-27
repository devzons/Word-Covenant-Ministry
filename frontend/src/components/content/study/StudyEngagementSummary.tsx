"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { getStudyEngagement } from "@/lib/api/study";
import type { StudyEngagement, StudyLocale, StudyViewRecordResult } from "@/types/study";

import { StudyViewTracker } from "./StudyViewTracker";

type StudyEngagementSummaryProps = {
  bodyElementId: string;
  locale: StudyLocale;
  studyId: number;
};

const copy = {
  en: {
    views: (count: number) => `${count} views`,
  },
  ko: {
    views: (count: number) => `조회 ${count}`,
  },
} as const;

export function StudyEngagementSummary({
  bodyElementId,
  locale,
  studyId,
}: StudyEngagementSummaryProps) {
  const [engagement, setEngagement] = useState<StudyEngagement | null>(null);

  useEffect(() => {
    let cancelled = false;

    void getStudyEngagement(studyId, locale).then((result) => {
      if (!cancelled && result) {
        setEngagement(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [locale, studyId]);

  const label = useMemo(() => {
    if (!engagement) {
      return null;
    }

    return copy[locale].views(engagement.views_total);
  }, [engagement, locale]);

  const handleTracked = useCallback((result: StudyViewRecordResult) => {
    setEngagement({
      study_id: result.study_id,
      locale: result.locale,
      views_total: result.views_total,
      views_7d: result.views_7d,
      views_30d: result.views_30d,
      comments_approved: result.comments_approved,
    });
  }, []);

  return (
    <>
      <StudyViewTracker
        bodyElementId={bodyElementId}
        locale={locale}
        onTracked={handleTracked}
        studyId={studyId}
      />
      {label ? (
        <div className="border-t border-zinc-200 pt-4 text-sm text-zinc-500">
          {label}
        </div>
      ) : null}
    </>
  );
}

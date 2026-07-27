"use client";

import { useEffect, useRef } from "react";

import { recordStudyView } from "@/lib/api/study";
import type { StudyLocale, StudyViewRecordResult } from "@/types/study";

type StudyViewTrackerProps = {
  bodyElementId: string;
  locale: StudyLocale;
  onTracked: (result: StudyViewRecordResult) => void;
  studyId: number;
};

export function StudyViewTracker({
  bodyElementId,
  locale,
  onTracked,
  studyId,
}: StudyViewTrackerProps) {
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    hasTriggeredRef.current = false;

    const submit = async () => {
      if (hasTriggeredRef.current) {
        return;
      }

      hasTriggeredRef.current = true;
      const result = await recordStudyView(studyId, locale);

      if (result) {
        onTracked(result);
        return;
      }

      hasTriggeredRef.current = false;
    };

    const timer = window.setTimeout(() => {
      void submit();
    }, 10000);

    const onScroll = () => {
      const body = document.getElementById(bodyElementId);

      if (!body || hasTriggeredRef.current) {
        return;
      }

      const rect = body.getBoundingClientRect();
      const bodyTop = rect.top + window.scrollY;
      const bodyHeight = Math.max(body.offsetHeight, 1);
      const viewportBottom = window.scrollY + window.innerHeight;
      const progressedRatio = (viewportBottom - bodyTop) / bodyHeight;

      if (progressedRatio >= 0.25) {
        void submit();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [bodyElementId, locale, onTracked, studyId]);

  return null;
}

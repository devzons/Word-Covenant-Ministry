"use client";

import { useMemo, useRef, useState } from "react";

import {
  CrossReferenceItemCard,
  crossReferenceItemKey,
  type PassagePreviewTarget,
} from "@/components/scripture/CrossReferenceItemCard";
import {
  CrossReferencePassagePreviewModal,
  type PassagePreviewCacheEntry,
} from "@/components/scripture/CrossReferencePassagePreviewModal";
import {
  formatReferenceLabel,
  parseSourceReference,
  type ParsedReference,
} from "@/components/scripture/TermOccurrenceExplorer";
import { getCrossReferences } from "@/lib/api/cross-references";
import type { CrossReferenceAttribution, CrossReferenceItem } from "@/types/cross-reference";
import type { OriginalLanguageOccurrence } from "@/types/original-language";

type TermStudyRelatedPassagesProps = {
  locale?: string;
  occurrences: OriginalLanguageOccurrence[];
  translation: string;
};

type MappedOccurrence = {
  occurrence: OriginalLanguageOccurrence;
  reference: ParsedReference & { bookSlug: string };
  referenceLabel: string;
};

type RelatedPassageGroup = MappedOccurrence & {
  attribution: CrossReferenceAttribution | null;
  items: CrossReferenceItem[];
};

const MAX_OCCURRENCES = 3;
const MAX_RELATED_PASSAGES = 3;

const termStudyRelatedPassagesCopy = {
  en: {
    title: "Related Passages",
    description:
      "Related passages for sampled occurrences of this term. These are unreviewed theme links.",
    load: "Load related passages",
    loading: "Loading related passages...",
    empty: "No related passages were found for sampled occurrences.",
    unavailable: "Sample occurrence references could not be mapped.",
    error: "Related passages could not be loaded.",
    occurrence: "Occurrence",
    relatedTheme: "Theme",
    unreviewed: "Unreviewed",
    viewPassage: "View passage",
    openInReader: "Open in Reader",
    close: "Close",
    closePreview: "Close passage preview",
    previewDialog: "Passage preview",
    loadingPassage: "Loading passage...",
    passageError: "Unable to load passage.",
    passageUnavailable: "This passage is unavailable for the selected version.",
    unsupportedRange: "This range is not supported in preview.",
    version: "Version",
  },
  ko: {
    title: "관련 구절",
    description:
      "이 단어의 출현 예시와 관련된 구절입니다. 이 참조는 검토 전 주제 링크입니다.",
    load: "관련 구절 불러오기",
    loading: "관련 구절을 불러오는 중입니다...",
    empty: "출현 예시에 대한 관련 구절이 없습니다.",
    unavailable: "출현 예시 참조를 연결할 수 없습니다.",
    error: "관련 구절을 불러오지 못했습니다.",
    occurrence: "출현",
    relatedTheme: "주제",
    unreviewed: "검토 전",
    viewPassage: "본문 보기",
    openInReader: "성경 본문으로 이동",
    close: "닫기",
    closePreview: "본문 미리보기 닫기",
    previewDialog: "본문 미리보기",
    loadingPassage: "본문을 불러오는 중입니다.",
    passageError: "본문을 불러오지 못했습니다.",
    passageUnavailable: "이 번역본에서 본문을 찾을 수 없습니다.",
    unsupportedRange: "이 범위는 미리보기에서 지원하지 않습니다.",
    version: "번역",
  },
};

export function TermStudyRelatedPassages({
  locale = "en",
  occurrences,
  translation,
}: TermStudyRelatedPassagesProps) {
  const activeLocale = locale === "ko" ? "ko" : "en";
  const copy = termStudyRelatedPassagesCopy[activeLocale];
  const [groups, setGroups] = useState<RelatedPassageGroup[] | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewTarget, setPreviewTarget] = useState<PassagePreviewTarget | null>(null);
  const [previewCache, setPreviewCache] = useState<Record<string, PassagePreviewCacheEntry>>({});
  const previewReturnFocusRef = useRef<HTMLElement | null>(null);

  const mappedOccurrences = useMemo(
    () =>
      occurrences
        .map((occurrence) => {
          const reference = parseSourceReference(occurrence.source_ref);

          if (!reference?.bookSlug) {
            return null;
          }

          return {
            occurrence,
            reference: {
              ...reference,
              bookSlug: reference.bookSlug,
            },
            referenceLabel: formatReferenceLabel(reference, occurrence.source_ref, activeLocale),
          };
        })
        .filter((occurrence): occurrence is MappedOccurrence => occurrence !== null)
        .slice(0, MAX_OCCURRENCES),
    [activeLocale, occurrences],
  );

  async function handleLoadRelatedPassages() {
    if (mappedOccurrences.length === 0) {
      setGroups([]);
      setErrorMessage("");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const nextGroups = await Promise.all(
        mappedOccurrences.map(async (mappedOccurrence) => {
          const response = await getCrossReferences({
            book: mappedOccurrence.reference.bookSlug,
            chapter: mappedOccurrence.reference.chapter,
            page: 1,
            perPage: MAX_RELATED_PASSAGES,
            verse: mappedOccurrence.reference.verse,
          });

          return {
            ...mappedOccurrence,
            attribution: response.attribution,
            items: response.items.slice(0, MAX_RELATED_PASSAGES),
          };
        }),
      );

      setGroups(nextGroups);
    } catch {
      setGroups(null);
      setErrorMessage(copy.error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenPreview(target: PassagePreviewTarget, triggerElement: HTMLElement) {
    previewReturnFocusRef.current = triggerElement;
    setPreviewTarget(target);
  }

  function restorePreviewFocus() {
    const returnElement = previewReturnFocusRef.current;
    previewReturnFocusRef.current = null;

    window.requestAnimationFrame(() => {
      if (
        returnElement &&
        document.contains(returnElement) &&
        typeof returnElement.focus === "function"
      ) {
        returnElement.focus();
      }
    });
  }

  function handleClosePreview() {
    setPreviewTarget(null);
    restorePreviewFocus();
  }

  const visibleGroups = groups?.filter((group) => group.items.length > 0) ?? [];

  return (
    <section className="rounded-md border border-zinc-200 bg-white p-3">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
          {copy.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-zinc-600">{copy.description}</p>
      </div>

      <div className="mt-3">
        <button
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-400"
          disabled={isLoading}
          onClick={handleLoadRelatedPassages}
          type="button"
        >
          {isLoading ? copy.loading : copy.load}
        </button>
      </div>

      {mappedOccurrences.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-600">{copy.unavailable}</p>
      ) : null}

      {errorMessage ? <p className="mt-3 text-sm text-red-700">{errorMessage}</p> : null}

      {groups && visibleGroups.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-600">{copy.empty}</p>
      ) : null}

      {visibleGroups.length > 0 ? (
        <div className="mt-4 flex flex-col gap-4">
          {visibleGroups.map((group) => (
            <div
              className="rounded-md border border-zinc-100 bg-zinc-50 p-3"
              key={`${group.reference.bookSlug}-${group.reference.chapter}-${group.reference.verse}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-zinc-950">
                  {copy.occurrence}: {group.referenceLabel}
                </p>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-zinc-500">
                  {group.occurrence.surface_form}
                </span>
              </div>
              <ul className="mt-3 flex flex-col gap-2">
                {group.items.map((item, index) => (
                  <CrossReferenceItemCard
                    copy={copy}
                    item={item}
                    key={crossReferenceItemKey(item, index)}
                    locale={activeLocale}
                    onPreview={handleOpenPreview}
                    translation={translation}
                  />
                ))}
              </ul>
              {group.attribution ? (
                <p className="mt-3 text-xs leading-5 text-zinc-500">
                  <a
                    className="underline-offset-2 hover:underline"
                    href={group.attribution.source_url}
                  >
                    {group.attribution.attribution}
                  </a>
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {previewTarget ? (
        <CrossReferencePassagePreviewModal
          cache={previewCache}
          copy={copy}
          onCacheChange={setPreviewCache}
          onClose={handleClosePreview}
          returnFocusRef={previewReturnFocusRef}
          target={previewTarget}
          translation={translation}
        />
      ) : null}
    </section>
  );
}

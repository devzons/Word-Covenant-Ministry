"use client";

import { useEffect, useRef, useState } from "react";

import {
  CrossReferenceItemCard,
  crossReferenceItemKey,
  type PassagePreviewTarget,
} from "@/components/scripture/CrossReferenceItemCard";
import {
  CrossReferencePassagePreviewModal,
  type PassagePreviewCacheEntry,
} from "@/components/scripture/CrossReferencePassagePreviewModal";
import { getCrossReferences } from "@/lib/api/cross-references";
import type { CrossReferenceResponse } from "@/types/cross-reference";

type CrossReferencePanelProps = {
  book: string;
  chapter: number;
  locale: string;
  translation: string;
  verse?: number | null;
};

const CROSS_REFERENCE_PER_PAGE = 20;

const crossReferencePanelCopy = {
  en: {
    title: "Related Passages",
    description:
      "Related passages for the selected verse. These references are unreviewed source links, not Bible text.",
    selectVerse: "Select a verse to view related passages.",
    loading: "Loading related passages...",
    loadingMore: "Loading more...",
    empty: "No related passages are available for the selected verse.",
    error: "Unable to load related passages.",
    loadMore: "Load more",
    relatedTheme: "Theme",
    unreviewed: "Unreviewed",
    source: "Source",
    attributionLabel: "Attribution",
    total: "total",
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
      "선택한 절과 관련된 구절입니다. 이 참조는 검토 전 출처 링크이며 성경 본문을 저장하지 않습니다.",
    selectVerse: "구절을 선택하면 관련 구절이 표시됩니다.",
    loading: "관련 구절을 불러오는 중입니다...",
    loadingMore: "더 불러오는 중입니다...",
    empty: "선택한 절에 대한 관련 구절이 아직 없습니다.",
    error: "관련 구절을 불러오지 못했습니다.",
    loadMore: "더 보기",
    relatedTheme: "주제",
    unreviewed: "검토 전",
    source: "출처",
    attributionLabel: "출처 표기",
    total: "전체",
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

export function CrossReferencePanel({
  book,
  chapter,
  locale,
  translation,
  verse,
}: CrossReferencePanelProps) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const copy = crossReferencePanelCopy[activeLocale];
  const [crossReferences, setCrossReferences] = useState<CrossReferenceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [previewTarget, setPreviewTarget] = useState<PassagePreviewTarget | null>(null);
  const [previewCache, setPreviewCache] = useState<Record<string, PassagePreviewCacheEntry>>({});
  const previewReturnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!verse) {
      return;
    }

    let isCurrent = true;
    const selectedVerse = verse;

    async function loadInitialCrossReferences() {
      setIsLoading(true);
      setErrorMessage("");
      setCrossReferences(null);

      try {
        const nextReferences = await getCrossReferences({
          book,
          chapter,
          page: 1,
          perPage: CROSS_REFERENCE_PER_PAGE,
          verse: selectedVerse,
        });

        if (isCurrent) {
          setCrossReferences(nextReferences);
        }
      } catch {
        if (isCurrent) {
          setErrorMessage(copy.error);
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialCrossReferences();

    return () => {
      isCurrent = false;
    };
  }, [book, chapter, copy.error, verse]);

  async function handleLoadMore() {
    if (!verse || !crossReferences || !crossReferences.pagination.has_more) {
      return;
    }

    setIsLoadingMore(true);
    setErrorMessage("");

    try {
      const nextReferences = await getCrossReferences({
        book,
        chapter,
        page: crossReferences.pagination.page + 1,
        perPage: crossReferences.pagination.per_page,
        verse,
      });

      setCrossReferences({
        ...nextReferences,
        items: [...crossReferences.items, ...nextReferences.items],
      });
    } catch {
      setErrorMessage(copy.error);
    } finally {
      setIsLoadingMore(false);
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

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-zinc-950">{copy.title}</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600">{copy.description}</p>
      </div>

      {!verse ? <CrossReferenceStatus message={copy.selectVerse} /> : null}
      {verse && isLoading ? <CrossReferenceStatus message={copy.loading} /> : null}
      {verse && errorMessage ? <CrossReferenceStatus message={errorMessage} tone="error" /> : null}

      {!isLoading && verse && crossReferences?.items.length === 0 ? (
        <CrossReferenceStatus message={copy.empty} />
      ) : null}

      {verse && crossReferences && crossReferences.items.length > 0 ? (
        <div className="flex min-w-0 flex-col gap-3">
          <p className="text-sm text-zinc-600">
            {copy.total}: {crossReferences.pagination.total}
          </p>
          <ul className="flex min-w-0 flex-col gap-2">
            {crossReferences.items.map((item, index) => (
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

          {crossReferences.pagination.has_more ? (
            <button
              className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:text-zinc-400"
              disabled={isLoadingMore}
              onClick={handleLoadMore}
              type="button"
            >
              {isLoadingMore ? copy.loadingMore : copy.loadMore}
            </button>
          ) : null}

          <CrossReferenceAttribution
            attribution={crossReferences.attribution.attribution}
            label={copy.attributionLabel}
            sourceUrl={crossReferences.attribution.source_url}
          />
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
    </div>
  );
}

function CrossReferenceStatus({
  message,
  tone = "default",
}: {
  message: string;
  tone?: "default" | "error";
}) {
  const className =
    tone === "error"
      ? "rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"
      : "rounded-md border border-zinc-200 bg-white p-3 text-sm text-zinc-600";

  return <div className={className}>{message}</div>;
}

function CrossReferenceAttribution({
  attribution,
  label,
  sourceUrl,
}: {
  attribution: string;
  label: string;
  sourceUrl: string;
}) {
  return (
    <p className="border-t border-zinc-200 pt-3 text-xs leading-5 text-zinc-500">
      {label}:{" "}
      <a className="underline-offset-2 hover:underline" href={sourceUrl}>
        {attribution}
      </a>
    </p>
  );
}

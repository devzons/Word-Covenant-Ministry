"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";

import type { PassagePreviewTarget } from "@/components/scripture/CrossReferenceItemCard";
import { getBibleChapter } from "@/lib/api/bible";
import type { BibleVerse } from "@/types/bible";
import type { CrossReferenceTargetReference } from "@/types/cross-reference";

export type PassagePreviewCacheEntry =
  | { status: "ready"; verses: BibleVerse[] }
  | { status: "error"; message: string }
  | { status: "unsupported"; message: string };

export type PassagePreviewCopy = {
  close: string;
  closePreview: string;
  loadingPassage: string;
  openInReader: string;
  passageError: string;
  passageUnavailable: string;
  previewDialog: string;
  unsupportedRange: string;
  version: string;
};

type CrossReferencePassagePreviewModalProps = {
  cache: Record<string, PassagePreviewCacheEntry>;
  copy: PassagePreviewCopy;
  onCacheChange: (cache: Record<string, PassagePreviewCacheEntry>) => void;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
  target: PassagePreviewTarget;
  translation: string;
};

const MAX_PREVIEW_VERSES = 10;

export function CrossReferencePassagePreviewModal({
  cache,
  copy,
  onCacheChange,
  onClose,
  returnFocusRef,
  target,
  translation,
}: CrossReferencePassagePreviewModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const cacheKey = passagePreviewCacheKey(translation, target.reference);
  const cachedPreview = cache[cacheKey] ?? null;
  const isLoading = !cachedPreview;

  useEffect(() => {
    closeButtonRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, returnFocusRef]);

  useEffect(() => {
    if (cachedPreview) {
      return;
    }

    const rangeValidation = validatePreviewRange(target.reference, copy.unsupportedRange);
    if (rangeValidation.status === "unsupported") {
      onCacheChange({
        ...cache,
        [cacheKey]: rangeValidation,
      });
      return;
    }

    let isCurrent = true;

    async function loadPassagePreview() {
      try {
        const chapter = await getBibleChapter(
          translation,
          target.reference.book,
          target.reference.start_chapter,
        );
        const endVerse = target.reference.end_verse ?? target.reference.start_verse;
        const verses = chapter.verses.filter(
          (verse) =>
            verse.verse >= target.reference.start_verse && verse.verse <= endVerse,
        );
        const nextPreview: PassagePreviewCacheEntry =
          verses.length > 0
            ? { status: "ready", verses }
            : { status: "error", message: copy.passageUnavailable };

        if (isCurrent) {
          onCacheChange({
            ...cache,
            [cacheKey]: nextPreview,
          });
        }
      } catch {
        if (isCurrent) {
          onCacheChange({
            ...cache,
            [cacheKey]: { status: "error", message: copy.passageError },
          });
        }
      }
    }

    void loadPassagePreview();

    return () => {
      isCurrent = false;
    };
  }, [
    cache,
    cacheKey,
    cachedPreview,
    copy.passageError,
    copy.passageUnavailable,
    copy.unsupportedRange,
    onCacheChange,
    target.reference,
    translation,
  ]);

  const preview = cache[cacheKey] ?? null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label={copy.closePreview}
        className="absolute inset-0 bg-zinc-950/40"
        onClick={onClose}
        type="button"
      />
      <section
        aria-labelledby="cross-reference-preview-title"
        aria-modal="true"
        className="absolute inset-x-4 top-16 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-lg border border-zinc-200 bg-white p-5 shadow-2xl sm:left-1/2 sm:right-auto sm:w-full sm:max-w-lg sm:-translate-x-1/2"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
              {copy.previewDialog}
            </p>
            <h2
              className="mt-1 text-lg font-semibold text-zinc-950"
              id="cross-reference-preview-title"
            >
              {target.referenceLabel}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {copy.version}: {translation}
            </p>
          </div>
          <button
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
            onClick={onClose}
            ref={closeButtonRef}
            type="button"
          >
            {copy.close}
          </button>
        </div>

        <div className="mt-5">
          {isLoading ? <PassagePreviewStatus message={copy.loadingPassage} /> : null}

          {!isLoading && preview?.status === "unsupported" ? (
            <PassagePreviewStatus message={preview.message} />
          ) : null}

          {!isLoading && preview?.status === "error" ? (
            <PassagePreviewStatus message={preview.message} tone="error" />
          ) : null}

          {!isLoading && preview?.status === "ready" ? (
            <ol className="flex flex-col gap-3">
              {preview.verses.map((verse) => (
                <li className="text-base leading-7 text-zinc-900" key={verse.verse}>
                  <span className="mr-2 align-super text-xs font-semibold text-zinc-500">
                    {verse.verse}
                  </span>
                  {verse.text}
                </li>
              ))}
            </ol>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-zinc-200 pt-4">
          <Link
            className="rounded-md bg-zinc-950 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
            href={target.href}
            onClick={onClose}
          >
            {copy.openInReader}
          </Link>
          <button
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
            onClick={onClose}
            type="button"
          >
            {copy.close}
          </button>
        </div>
      </section>
    </div>
  );
}

function validatePreviewRange(
  reference: CrossReferenceTargetReference,
  message: string,
): PassagePreviewCacheEntry | { status: "supported" } {
  const endChapter = reference.end_chapter ?? reference.start_chapter;
  const endVerse = reference.end_verse ?? reference.start_verse;
  const verseCount = endVerse - reference.start_verse + 1;

  if (
    endChapter !== reference.start_chapter ||
    verseCount < 1 ||
    verseCount > MAX_PREVIEW_VERSES
  ) {
    return { status: "unsupported", message };
  }

  return { status: "supported" };
}

function passagePreviewCacheKey(
  translation: string,
  reference: CrossReferenceTargetReference,
): string {
  return [
    translation,
    reference.book,
    reference.start_chapter,
    reference.start_verse,
    reference.end_chapter ?? "",
    reference.end_verse ?? "",
  ].join(":");
}

function PassagePreviewStatus({
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

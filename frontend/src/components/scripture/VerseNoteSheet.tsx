"use client";

import { useEffect, useRef } from "react";

import { VerseNotePanel, type VerseNotePanelLabels } from "@/components/scripture/VerseNotePanel";

type VerseNoteSheetProps = {
  draft: string;
  errorMessage: string;
  isDeleting: boolean;
  isLoading: boolean;
  isOpen: boolean;
  isSaving: boolean;
  labels: VerseNotePanelLabels;
  onClose: () => void;
  onDelete: () => void;
  onDraftChange: (value: string) => void;
  onSave: () => void;
  referenceLabel: string;
  saveState: "idle" | "saving" | "saved" | "error";
  showDelete: boolean;
};

export function VerseNoteSheet({
  draft,
  errorMessage,
  isDeleting,
  isLoading,
  isOpen,
  isSaving,
  labels,
  onClose,
  onDelete,
  onDraftChange,
  onSave,
  referenceLabel,
  saveState,
  showDelete,
}: VerseNoteSheetProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

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
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        aria-label={labels.close}
        className="absolute inset-0 bg-zinc-950/30"
        onClick={onClose}
        type="button"
      />
      <section
        aria-label={referenceLabel}
        aria-modal="true"
        className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-2xl"
        role="dialog"
      >
        <div className="mb-3 flex justify-center">
          <span className="h-1.5 w-12 rounded-full bg-zinc-300" />
        </div>
        <button
          className="sr-only"
          onClick={onClose}
          ref={closeButtonRef}
          type="button"
        >
          {labels.close}
        </button>
        <VerseNotePanel
          canDelete={showDelete}
          closeLabel={labels.close}
          draft={draft}
          errorMessage={errorMessage}
          hasNote={showDelete}
          isDeleting={isDeleting}
          isLoading={isLoading}
          isSaving={isSaving}
          labels={labels}
          onClose={onClose}
          onDelete={onDelete}
          onDraftChange={onDraftChange}
          onSave={onSave}
          referenceLabel={referenceLabel}
          saveState={saveState}
        />
      </section>
    </div>
  );
}

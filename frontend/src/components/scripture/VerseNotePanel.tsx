"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

export type VerseNotePanelLabels = {
  close: string;
  delete: string;
  empty: string;
  note: string;
  loading: string;
  placeholder: string;
  privacy: string;
  save: string;
  saved: string;
  saving: string;
  unsaved: string;
  error: string;
};

type VerseNotePanelProps = {
  canDelete: boolean;
  closeLabel?: string;
  draft: string;
  errorMessage: string;
  hasNote: boolean;
  isDeleting: boolean;
  isLoading: boolean;
  isSaving: boolean;
  labels: VerseNotePanelLabels;
  onClose?: () => void;
  onDelete: () => void;
  onDraftChange: (value: string) => void;
  onSave: () => void;
  referenceLabel: string;
  saveState: "idle" | "saving" | "saved" | "error";
};

export function VerseNotePanel({
  canDelete,
  closeLabel,
  draft,
  errorMessage,
  hasNote,
  isDeleting,
  isLoading,
  isSaving,
  labels,
  onClose,
  onDelete,
  onDraftChange,
  onSave,
  referenceLabel,
  saveState,
}: VerseNotePanelProps) {
  const statusMessage =
    saveState === "saving"
      ? labels.saving
      : saveState === "saved"
        ? labels.saved
        : saveState === "error"
          ? labels.error
          : labels.unsaved;

  return (
    <div className="space-y-3 rounded-md border border-zinc-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3 border-b border-zinc-200 pb-3">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
            {labels.note}
          </p>
          <h3 className="text-sm font-semibold text-zinc-950">{referenceLabel}</h3>
          <p className="text-xs text-zinc-500">{labels.privacy}</p>
        </div>
        {onClose && closeLabel ? (
          <Button className="h-8 px-3" onClick={onClose} variant="ghost">
            {closeLabel}
          </Button>
        ) : null}
      </div>

      {isLoading ? <p className="text-sm text-zinc-600">{labels.loading}</p> : null}

      {!isLoading ? (
        <>
          {!hasNote && draft.trim().length === 0 ? (
            <p className="text-sm text-zinc-600">{labels.empty}</p>
          ) : null}

          <textarea
            className="min-h-36 w-full rounded-md border border-zinc-300 bg-white px-3 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950"
            maxLength={10000}
            onChange={(event) => onDraftChange(event.target.value)}
            placeholder={labels.placeholder}
            value={draft}
          />

          <div className="flex items-center justify-between gap-3">
            <p
              className={cn(
                "text-xs text-zinc-500",
                saveState === "saved" && "text-zinc-600",
                saveState === "error" && "text-red-700",
              )}
            >
              {statusMessage}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {canDelete ? (
                <Button
                  className="h-9 border-red-200 px-3 text-red-700 hover:bg-red-50 hover:text-red-800"
                  disabled={isSaving || isDeleting}
                  onClick={onDelete}
                  variant="secondary"
                >
                  {labels.delete}
                </Button>
              ) : null}
              <Button className="h-9 px-3" disabled={isSaving || isDeleting} onClick={onSave}>
                {isSaving ? labels.saving : labels.save}
              </Button>
            </div>
          </div>

          {errorMessage ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

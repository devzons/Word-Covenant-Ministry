"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/components/layout/AuthProvider";
import { Button } from "@/components/ui/Button";
import {
  deleteNote,
  getNoteByReference,
  NotesApiError,
  saveNote,
} from "@/lib/api/notes";
import type { VerseNote } from "@/types/notes";

type VerseNotePanelProps = {
  book: string;
  chapter: number;
  locale: string;
  referenceLabel: string;
  translation: string;
  verse: number;
};

const copy = {
  en: {
    close: "Close",
    delete: "Delete",
    empty: "Write a private note for this verse.",
    error: "Personal note could not be updated.",
    loading: "Loading note...",
    login: "Log in",
    note: "Personal note",
    placeholder: "Write your note for this verse.",
    save: "Save",
    saved: "Personal note saved.",
    saving: "Saving...",
    signInPrompt: "Log in to save a private note for this verse.",
  },
  ko: {
    close: "닫기",
    delete: "삭제",
    empty: "이 구절에 대한 개인 노트를 작성해 보세요.",
    error: "개인 노트를 처리할 수 없습니다.",
    loading: "노트를 불러오는 중...",
    login: "로그인",
    note: "개인 노트",
    placeholder: "이 구절에 대한 노트를 입력하세요.",
    save: "저장",
    saved: "개인 노트를 저장했습니다.",
    saving: "저장 중...",
    signInPrompt: "이 구절에 개인 노트를 저장하려면 로그인하세요.",
  },
} as const;

export function VerseNotePanel({
  book,
  chapter,
  locale,
  referenceLabel,
  translation,
  verse,
}: VerseNotePanelProps) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const labels = copy[activeLocale];
  const { refresh, restNonce, status } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [draft, setDraft] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [note, setNote] = useState<VerseNote | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const loginHref = `${`/${activeLocale}/login`}?redirect=${encodeURIComponent(
    `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}#v${verse}`,
  )}`;

  const loadNote = useCallback(
    async (nonce: string): Promise<void> => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const nextNote = await getNoteByReference({
          book,
          chapter,
          nonce,
          translation,
          verse,
        });

        setNote(nextNote);
        setDraft(nextNote?.note ?? "");
      } catch (error) {
        if (error instanceof NotesApiError && error.status === 403) {
          await refresh();
        }

        setErrorMessage(labels.error);
      } finally {
        setIsLoading(false);
      }
    },
    [book, chapter, labels.error, refresh, translation, verse],
  );

  async function openPanel(): Promise<void> {
    setSuccessMessage("");
    setErrorMessage("");

    if (status === "loading") {
      return;
    }

    if (status !== "authenticated") {
      router.push(loginHref);
      return;
    }

    if (restNonce === null) {
      const refreshedUser = await refresh();

      if (!refreshedUser) {
        router.push(loginHref);
        return;
      }

      setErrorMessage(labels.error);
      return;
    }

    const activeNonce = restNonce;
    setIsOpen(true);

    if (activeNonce) {
      await loadNote(activeNonce);
    }
  }

  async function handleSave(): Promise<void> {
    const activeNonce = restNonce;

    if (!activeNonce) {
      await refresh();
      setErrorMessage(labels.error);
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const savedNote = await saveNote({
        book,
        chapter,
        nonce: activeNonce,
        note: draft,
        translation,
        verse,
      });

      setNote(savedNote);
      setDraft(savedNote.note);
      setSuccessMessage(labels.saved);
    } catch (error) {
      if (error instanceof NotesApiError && error.status === 403) {
        await refresh();
      }

      setErrorMessage(labels.error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(): Promise<void> {
    if (!note || !restNonce) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await deleteNote({
        id: note.id,
        nonce: restNonce,
      });

      setNote(null);
      setDraft("");
    } catch (error) {
      if (error instanceof NotesApiError && error.status === 403) {
        await refresh();
      }

      setErrorMessage(labels.error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="mt-3 rounded-md border border-zinc-200 bg-zinc-50 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
          {labels.note}
        </span>
        <span className="text-sm text-zinc-600">{referenceLabel}</span>
        {!isOpen ? (
          <Button className="h-8 px-3" onClick={() => void openPanel()} variant="secondary">
            {labels.note}
          </Button>
        ) : (
          <Button
            className="h-8 px-3"
            onClick={() => {
              setIsOpen(false);
              setErrorMessage("");
              setSuccessMessage("");
            }}
            variant="ghost"
          >
            {labels.close}
          </Button>
        )}
      </div>

      {isOpen ? (
        <div className="mt-3 space-y-3">
          {status !== "authenticated" ? (
            <div className="rounded-md border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-700">
              <p>{labels.signInPrompt}</p>
              <Link
                className="mt-2 inline-flex text-sm font-medium text-zinc-950 underline underline-offset-4"
                href={loginHref}
              >
                {labels.login}
              </Link>
            </div>
          ) : isLoading ? (
            <p className="text-sm text-zinc-600">{labels.loading}</p>
          ) : (
            <>
              <p className="text-sm text-zinc-600">
                {note ? null : labels.empty}
              </p>
              <textarea
                className="min-h-36 w-full rounded-md border border-zinc-300 bg-white px-3 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950"
                maxLength={10000}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={labels.placeholder}
                value={draft}
              />
              {errorMessage ? (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {errorMessage}
                </p>
              ) : null}
              {successMessage ? (
                <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {successMessage}
                </p>
              ) : null}
              <div className="flex flex-wrap items-center gap-2">
                <Button disabled={isSaving || isDeleting} onClick={() => void handleSave()}>
                  {isSaving ? labels.saving : labels.save}
                </Button>
                {note ? (
                  <Button
                    className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                    disabled={isSaving || isDeleting}
                    onClick={() => void handleDelete()}
                    variant="secondary"
                  >
                    {labels.delete}
                  </Button>
                ) : null}
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

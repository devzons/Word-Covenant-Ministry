"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "@/components/layout/AuthProvider";
import {
  deleteNote,
  getNoteByReference,
  NotesApiError,
  saveNote,
} from "@/lib/api/notes";
import type { VerseNote } from "@/types/notes";

type VerseNoteReference = {
  book: string;
  chapter: number;
  referenceLabel: string;
  translation: string;
  verse: number;
};

export type VerseNoteWorkspaceState = {
  draft: string;
  errorMessage: string;
  isDeleting: boolean;
  isDirty: boolean;
  isLoading: boolean;
  isOpen: boolean;
  isSaving: boolean;
  labels: {
    close: string;
    confirmDiscard: string;
    delete: string;
    empty: string;
    error: string;
    loading: string;
    login: string;
    note: string;
    placeholder: string;
    privacy: string;
    save: string;
    saved: string;
    saving: string;
    signInPrompt: string;
    trigger: string;
    unsaved: string;
  };
  note: VerseNote | null;
  openForVerse: (reference: VerseNoteReference) => Promise<boolean>;
  reference: VerseNoteReference | null;
  requestClose: () => boolean;
  saveState: "idle" | "saving" | "saved" | "error";
  setDraft: (value: string) => void;
  submitDelete: () => Promise<void>;
  submitSave: () => Promise<void>;
};

const copy = {
  en: {
    close: "Close",
    confirmDiscard: "Discard unsaved note changes?",
    delete: "Delete",
    empty: "Write a private note for this verse.",
    error: "Personal note could not be updated.",
    loading: "Loading note...",
    login: "Log in",
    note: "Personal note",
    placeholder: "Write your note for this verse.",
    privacy: "Visible only to you.",
    save: "Save",
    saved: "Saved",
    saving: "Saving...",
    signInPrompt: "Log in to save a private note for this verse.",
    trigger: "Note",
    unsaved: "Unsaved changes",
  },
  ko: {
    close: "닫기",
    confirmDiscard: "저장하지 않은 노트 변경 내용을 버릴까요?",
    delete: "삭제",
    empty: "이 구절에 대한 개인 노트를 작성해 보세요.",
    error: "개인 노트를 처리할 수 없습니다.",
    loading: "노트를 불러오는 중...",
    login: "로그인",
    note: "개인 노트",
    placeholder: "이 구절에 대한 노트를 입력하세요.",
    privacy: "나에게만 표시됩니다.",
    save: "저장",
    saved: "저장됨",
    saving: "저장 중...",
    signInPrompt: "이 구절에 개인 노트를 저장하려면 로그인하세요.",
    trigger: "노트",
    unsaved: "저장되지 않음",
  },
} as const;

export function useVerseNoteWorkspace(locale: string): VerseNoteWorkspaceState {
  const activeLocale = locale === "en" ? "en" : "ko";
  const labels = copy[activeLocale];
  const { refresh, restNonce, status, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [draft, setDraftState] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [note, setNote] = useState<VerseNote | null>(null);
  const [reference, setReference] = useState<VerseNoteReference | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const loadedKeyRef = useRef<string | null>(null);
  const lastUserIdRef = useRef<number | null>(user?.id ?? null);

  const noteKey = reference
    ? `${reference.translation}:${reference.book}:${reference.chapter}:${reference.verse}`
    : null;
  const persistedNote = note?.note ?? "";
  const isDirty = draft !== persistedNote;

  const setDraft = useCallback((value: string) => {
    setDraftState(value);
    setErrorMessage("");
    setSaveState("idle");
  }, []);

  const resetState = useCallback(() => {
    loadedKeyRef.current = null;
    setDraftState("");
    setErrorMessage("");
    setIsDeleting(false);
    setIsLoading(false);
    setIsOpen(false);
    setIsSaving(false);
    setNote(null);
    setReference(null);
    setSaveState("idle");
  }, []);

  const loginHref = useCallback(
    (verse: number) =>
      `${`/${activeLocale}/login`}?redirect=${encodeURIComponent(
        `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}#v${verse}`,
      )}`,
    [activeLocale, pathname, searchParams],
  );

  const confirmDiscard = useCallback(() => {
    if (!isDirty) {
      return true;
    }

    if (typeof window === "undefined") {
      return false;
    }

    return window.confirm(labels.confirmDiscard);
  }, [isDirty, labels.confirmDiscard]);

  const openForVerse = useCallback(
    async (nextReference: VerseNoteReference) => {
      setErrorMessage("");

      if (status === "loading") {
        return false;
      }

      if (status !== "authenticated") {
        router.push(loginHref(nextReference.verse));
        return false;
      }

      if (reference && noteKey !== null && noteKey !== createNoteKey(nextReference)) {
        if (!confirmDiscard()) {
          return false;
        }
      }

      setReference(nextReference);
      setIsOpen(true);
      setSaveState("idle");

      if (noteKey !== createNoteKey(nextReference)) {
        loadedKeyRef.current = null;
        setNote(null);
        setDraftState("");
      }

      return true;
    },
    [confirmDiscard, loginHref, noteKey, reference, router, status],
  );

  const requestClose = useCallback(() => {
    if (!confirmDiscard()) {
      return false;
    }

    setDraftState(note?.note ?? "");
    setErrorMessage("");
    setIsOpen(false);
    setSaveState("idle");
    return true;
  }, [confirmDiscard, note?.note]);

  const loadNote = useCallback(async () => {
    if (!reference || !restNonce || status !== "authenticated") {
      return;
    }

    const activeKey = createNoteKey(reference);
    if (loadedKeyRef.current === activeKey) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const nextNote = await getNoteByReference({
        book: reference.book,
        chapter: reference.chapter,
        nonce: restNonce,
        translation: reference.translation,
        verse: reference.verse,
      });

      loadedKeyRef.current = activeKey;
      setNote(nextNote);
      setDraftState(nextNote?.note ?? "");
      setSaveState("idle");
    } catch (error) {
      if (error instanceof NotesApiError && error.status === 403) {
        loadedKeyRef.current = null;
        await refresh();
      }

      setErrorMessage(labels.error);
      setSaveState("error");
    } finally {
      setIsLoading(false);
    }
  }, [labels.error, reference, refresh, restNonce, status]);

  const submitSave = useCallback(async () => {
    if (!reference) {
      return;
    }

    if (!restNonce) {
      await refresh();
      setErrorMessage(labels.error);
      setSaveState("error");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSaveState("saving");

    try {
      const savedNote = await saveNote({
        book: reference.book,
        chapter: reference.chapter,
        nonce: restNonce,
        note: draft,
        translation: reference.translation,
        verse: reference.verse,
      });

      setNote(savedNote);
      setDraftState(savedNote.note);
      setSaveState("saved");
    } catch (error) {
      if (error instanceof NotesApiError && error.status === 403) {
        await refresh();
      }

      setErrorMessage(labels.error);
      setSaveState("error");
    } finally {
      setIsSaving(false);
    }
  }, [draft, labels.error, reference, refresh, restNonce]);

  const submitDelete = useCallback(async () => {
    if (!note || !restNonce) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage("");
    setSaveState("idle");

    try {
      await deleteNote({
        id: note.id,
        nonce: restNonce,
      });

      setNote(null);
      setDraftState("");
      setSaveState("idle");
    } catch (error) {
      if (error instanceof NotesApiError && error.status === 403) {
        await refresh();
      }

      setErrorMessage(labels.error);
      setSaveState("error");
    } finally {
      setIsDeleting(false);
    }
  }, [labels.error, note, refresh, restNonce]);

  useEffect(() => {
    if (!isOpen || !reference) {
      return;
    }

    if (status === "authenticated" && restNonce) {
      queueMicrotask(() => {
        void loadNote();
      });
      return;
    }

    if (status === "authenticated" && !restNonce) {
      queueMicrotask(() => {
        void refresh();
      });
    }
  }, [isOpen, loadNote, reference, refresh, restNonce, status]);

  useEffect(() => {
    const currentUserId = user?.id ?? null;
    if (lastUserIdRef.current === currentUserId && status !== "unauthenticated") {
      return;
    }

    lastUserIdRef.current = currentUserId;
    resetState();
  }, [resetState, status, user?.id]);

  useEffect(() => {
    if (!isOpen || !isDirty) {
      return;
    }

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty, isOpen]);

  return useMemo(
    () => ({
      draft,
      errorMessage,
      isDeleting,
      isDirty,
      isLoading,
      isOpen,
      isSaving,
      labels,
      note,
      openForVerse,
      reference,
      requestClose,
      saveState,
      setDraft,
      submitDelete,
      submitSave,
    }),
    [
      draft,
      errorMessage,
      isDeleting,
      isDirty,
      isLoading,
      isOpen,
      isSaving,
      labels,
      note,
      openForVerse,
      reference,
      requestClose,
      saveState,
      setDraft,
      submitDelete,
      submitSave,
    ],
  );
}

function createNoteKey(reference: VerseNoteReference): string {
  return `${reference.translation}:${reference.book}:${reference.chapter}:${reference.verse}`;
}

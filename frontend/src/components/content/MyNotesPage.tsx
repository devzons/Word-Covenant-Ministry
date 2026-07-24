"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/components/layout/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  deleteNote,
  listNotes,
  NotesApiError,
  updateNote,
} from "@/lib/api/notes";
import type { VerseNote } from "@/types/notes";

type MyNotesPageProps = {
  locale: string;
};

const copy = {
  en: {
    delete: "Delete",
    edit: "Edit",
    empty: "You have no saved Bible notes.",
    error: "Bible notes could not be loaded.",
    loading: "Loading your Bible notes...",
    loginRedirect: "Sign in required.",
    openReader: "Open reader",
    save: "Save",
    saved: "Saved.",
    saving: "Saving...",
    subtitle: "Private verse notes are only visible to your account.",
    title: "My Bible Notes",
    updated: "Updated",
  },
  ko: {
    delete: "삭제",
    edit: "수정",
    empty: "저장한 개인 노트가 없습니다.",
    error: "성경 노트를 불러올 수 없습니다.",
    loading: "나의 성경 노트를 불러오는 중...",
    loginRedirect: "로그인이 필요합니다.",
    openReader: "본문 열기",
    save: "저장",
    saved: "저장했습니다.",
    saving: "저장 중...",
    subtitle: "개인 구절 노트는 로그인한 사용자에게만 보입니다.",
    title: "나의 성경 노트",
    updated: "수정일",
  },
} as const;

export function MyNotesPage({ locale }: MyNotesPageProps) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const labels = copy[activeLocale];
  const pathname = usePathname();
  const router = useRouter();
  const { refresh, restNonce, status } = useAuth();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingId, setIsSavingId] = useState<number | null>(null);
  const [items, setItems] = useState<VerseNote[]>([]);
  const [savedMessage, setSavedMessage] = useState("");
  const [drafts, setDrafts] = useState<Record<number, string>>({});

  const loginHref = useMemo(
    () => `/${activeLocale}/login?redirect=${encodeURIComponent(pathname)}`,
    [activeLocale, pathname],
  );

  const loadItems = useCallback(
    async (nonce: string): Promise<void> => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await listNotes({ nonce });
        setItems(response.items);
      } catch (error) {
        if (error instanceof NotesApiError && error.status === 403) {
          await refresh();
        }

        setErrorMessage(labels.error);
      } finally {
        setIsLoading(false);
      }
    },
    [labels.error, refresh],
  );

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      router.replace(loginHref);
      return;
    }

    if (restNonce) {
      queueMicrotask(() => {
        void loadItems(restNonce);
      });
      return;
    }

    void refresh();
  }, [loadItems, loginHref, refresh, restNonce, router, status]);

  if (status === "loading" || (status === "authenticated" && isLoading)) {
    return (
      <Card className="mx-auto max-w-4xl">
        <p className="text-sm text-zinc-600">{labels.loading}</p>
      </Card>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Card className="mx-auto max-w-4xl">
        <p className="text-sm text-zinc-600">{labels.loginRedirect}</p>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-zinc-950">{labels.title}</h1>
        <p className="text-sm text-zinc-600">{labels.subtitle}</p>
      </div>

      {errorMessage ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {savedMessage ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {savedMessage}
        </div>
      ) : null}

      {items.length === 0 ? (
        <Card>
          <p className="text-sm text-zinc-600">{labels.empty}</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const isEditing = editingId === item.id;
            const draft = drafts[item.id] ?? item.note;

            return (
              <Card className="space-y-4" key={item.id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-zinc-950">
                      {item.translation} {item.book} {item.chapter}:{item.verse}
                    </h2>
                    <p className="text-sm text-zinc-500">
                      {labels.updated} {formatDate(item.updatedAt, activeLocale)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950"
                      href={`/${activeLocale}/bible/${item.translation}/${item.book}/${item.chapter}#v${item.verse}`}
                    >
                      {labels.openReader}
                    </Link>
                    <Button
                      className="h-9 px-3"
                      onClick={() => {
                        setDrafts((current) => ({
                          ...current,
                          [item.id]: draft,
                        }));
                        setEditingId(isEditing ? null : item.id);
                        setSavedMessage("");
                      }}
                      variant="secondary"
                    >
                      {labels.edit}
                    </Button>
                    <Button
                      className="h-9 border-red-200 px-3 text-red-700 hover:bg-red-50 hover:text-red-800"
                      disabled={isSavingId === item.id || !restNonce}
                      onClick={async () => {
                        if (!restNonce) {
                          return;
                        }

                        setIsSavingId(item.id);
                        setErrorMessage("");
                        setSavedMessage("");

                        try {
                          await deleteNote({
                            id: item.id,
                            nonce: restNonce,
                          });

                          setItems((current) => current.filter((entry) => entry.id !== item.id));
                          setEditingId((current) => (current === item.id ? null : current));
                        } catch (error) {
                          if (error instanceof NotesApiError && error.status === 403) {
                            await refresh();
                          }

                          setErrorMessage(labels.error);
                        } finally {
                          setIsSavingId(null);
                        }
                      }}
                      variant="secondary"
                    >
                      {labels.delete}
                    </Button>
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      className="min-h-40 w-full rounded-md border border-zinc-300 bg-white px-3 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950"
                      maxLength={10000}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [item.id]: event.target.value,
                        }))
                      }
                      value={draft}
                    />
                    <Button
                      disabled={isSavingId === item.id || !restNonce}
                      onClick={async () => {
                        if (!restNonce) {
                          return;
                        }

                        setIsSavingId(item.id);
                        setErrorMessage("");
                        setSavedMessage("");

                        try {
                          const updated = await updateNote({
                            id: item.id,
                            nonce: restNonce,
                            note: draft,
                          });

                          setItems((current) =>
                            current.map((entry) => (entry.id === item.id ? updated : entry)),
                          );
                          setEditingId(null);
                          setSavedMessage(labels.saved);
                        } catch (error) {
                          if (error instanceof NotesApiError && error.status === 403) {
                            await refresh();
                          }

                          setErrorMessage(labels.error);
                        } finally {
                          setIsSavingId(null);
                        }
                      }}
                    >
                      {isSavingId === item.id ? labels.saving : labels.save}
                    </Button>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-700">{item.note}</p>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatDate(value: string, locale: "en" | "ko"): string {
  const parsed = new Date(value.replace(" ", "T"));

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString(locale === "ko" ? "ko-KR" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

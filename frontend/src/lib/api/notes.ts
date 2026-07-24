import { createApiUrl } from "@/lib/api/client";
import type { AuthEnvelope } from "@/types/auth";
import type { VerseNote, VerseNoteList } from "@/types/notes";

export class NotesApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string | null = null,
  ) {
    super(message);
    this.name = "NotesApiError";
  }
}

type NoteReferenceInput = {
  book: string;
  chapter: number;
  nonce: string;
  translation: string;
  verse: number;
};

type NoteSaveInput = NoteReferenceInput & {
  note: string;
};

type NoteUpdateInput = {
  id: number;
  nonce: string;
  note: string;
};

type NoteDeleteInput = {
  id: number;
  nonce: string;
};

type NotesListResponse = VerseNoteList;

type NoteResponse = {
  note: VerseNote | null;
};

type DeleteResponse = {
  deleted: boolean;
};

export async function listNotes(input: {
  nonce: string;
  page?: number;
  perPage?: number;
}): Promise<VerseNoteList> {
  const params = new URLSearchParams();

  if (input.page) {
    params.set("page", String(input.page));
  }

  if (input.perPage) {
    params.set("perPage", String(input.perPage));
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";

  return notesRequest<NotesListResponse>(`/wcm/v1/my/notes${suffix}`, {
    method: "GET",
    nonce: input.nonce,
  });
}

export async function getNoteByReference(input: NoteReferenceInput): Promise<VerseNote | null> {
  const params = new URLSearchParams({
    book: input.book,
    chapter: String(input.chapter),
    translation: input.translation,
    verse: String(input.verse),
  });

  const data = await notesRequest<NoteResponse>(
    `/wcm/v1/my/notes/by-reference?${params.toString()}`,
    {
      method: "GET",
      nonce: input.nonce,
    },
  );

  return data.note;
}

export async function saveNote(input: NoteSaveInput): Promise<VerseNote> {
  const data = await notesRequest<NoteResponse>("/wcm/v1/my/notes", {
    body: JSON.stringify({
      book: input.book,
      chapter: input.chapter,
      note: input.note,
      translation: input.translation,
      verse: input.verse,
    }),
    method: "POST",
    nonce: input.nonce,
  });

  if (data.note === null) {
    throw new NotesApiError("Saved note is missing.", 500);
  }

  return data.note;
}

export async function updateNote(input: NoteUpdateInput): Promise<VerseNote> {
  const data = await notesRequest<NoteResponse>(`/wcm/v1/my/notes/${input.id}`, {
    body: JSON.stringify({
      note: input.note,
    }),
    method: "PATCH",
    nonce: input.nonce,
  });

  if (data.note === null) {
    throw new NotesApiError("Updated note is missing.", 500);
  }

  return data.note;
}

export async function deleteNote(input: NoteDeleteInput): Promise<void> {
  await notesRequest<DeleteResponse>(`/wcm/v1/my/notes/${input.id}`, {
    method: "DELETE",
    nonce: input.nonce,
  });
}

async function notesRequest<T>(
  path: string,
  init: Omit<RequestInit, "headers"> & { nonce: string },
): Promise<T> {
  if (init.nonce.trim() === "") {
    throw new NotesApiError("REST nonce is required.", 401, "rest_nonce_missing");
  }

  const response = await fetch(createApiUrl(path), {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      "X-WP-Nonce": init.nonce,
    },
  });

  const payload = (await response.json().catch(() => null)) as AuthEnvelope<T> | null;

  if (!response.ok || payload?.success !== true || payload.data === undefined) {
    throw new NotesApiError(
      payload?.message ?? `API request failed: ${response.status}`,
      response.status,
      payload?.code ?? null,
    );
  }

  return payload.data;
}

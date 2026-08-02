import { createApiUrl } from "@/lib/api/client";
import type { AuthEnvelope } from "@/types/auth";
import type {
  StudyDiscussion,
  StudyDiscussionDeleteInput,
  StudyDiscussionList,
  StudyDiscussionMutationInput,
  StudyDiscussionUpdateInput,
} from "@/types/study-discussions";

export class StudyDiscussionApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string | null = null,
  ) {
    super(message);
    this.name = "StudyDiscussionApiError";
  }
}

type DiscussionResponse = {
  discussion: StudyDiscussion;
};

type DeleteResponse = {
  deleted: boolean;
};

export async function listStudyDiscussions(input: {
  nonce?: string | null;
  page?: number;
  perPage?: number;
  studyId: number;
}): Promise<StudyDiscussionList> {
  const params = new URLSearchParams({
    page: String(input.page ?? 1),
    per_page: String(input.perPage ?? 10),
  });

  return studyDiscussionRequest<StudyDiscussionList>(
    `/wcm/v1/studies/${input.studyId}/discussions?${params.toString()}`,
    {
      method: "GET",
      nonce: input.nonce,
    },
  );
}

export async function createStudyDiscussion(
  input: StudyDiscussionMutationInput,
): Promise<StudyDiscussion> {
  const data = await studyDiscussionRequest<DiscussionResponse>(
    `/wcm/v1/studies/${input.studyId}/discussions`,
    {
      body: JSON.stringify({
        content: input.content,
        locale: input.locale,
        parentId: input.parentId,
      }),
      method: "POST",
      nonce: input.nonce,
    },
  );

  return data.discussion;
}

export async function updateStudyDiscussion(
  input: StudyDiscussionUpdateInput,
): Promise<StudyDiscussion> {
  const data = await studyDiscussionRequest<DiscussionResponse>(
    `/wcm/v1/studies/${input.studyId}/discussions/${input.discussionId}`,
    {
      body: JSON.stringify({
        content: input.content,
      }),
      method: "PATCH",
      nonce: input.nonce,
    },
  );

  return data.discussion;
}

export async function deleteStudyDiscussion(
  input: StudyDiscussionDeleteInput,
): Promise<void> {
  await studyDiscussionRequest<DeleteResponse>(
    `/wcm/v1/studies/${input.studyId}/discussions/${input.discussionId}`,
    {
      method: "DELETE",
      nonce: input.nonce,
    },
  );
}

async function studyDiscussionRequest<T>(
  path: string,
  init: Omit<RequestInit, "headers"> & { nonce?: string | null },
): Promise<T> {
  const response = await fetch(createApiUrl(path), {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.nonce ? { "X-WP-Nonce": init.nonce } : {}),
    },
  });

  const payload = (await response.json().catch(() => null)) as AuthEnvelope<T> | null;

  if (!response.ok || payload?.success !== true || payload.data === undefined) {
    throw new StudyDiscussionApiError(
      payload?.message ?? `API request failed: ${response.status}`,
      response.status,
      payload?.code ?? null,
    );
  }

  return payload.data;
}

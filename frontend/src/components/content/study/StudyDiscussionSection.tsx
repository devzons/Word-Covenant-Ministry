"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useAuth } from "@/components/layout/AuthProvider";
import {
  createStudyDiscussion,
  deleteStudyDiscussion,
  listStudyDiscussions,
  StudyDiscussionApiError,
  updateStudyDiscussion,
} from "@/lib/api/study-discussions";
import type { StudyDiscussion } from "@/types/study-discussions";
import type { StudyLocale } from "@/types/study";

type StudyDiscussionSectionProps = {
  locale: StudyLocale;
  studyId: number;
};

type DraftMap = Record<number, string>;

const MAX_CONTENT_LENGTH = 2000;
const DISCUSSIONS_PER_PAGE = 10;

const copy = {
  en: {
    title: "Discussion",
    subtitle: "Read and join the study discussion.",
    loading: "Loading discussions…",
    empty: "No discussions have been posted yet.",
    loginRequired: "Log in to join the discussion.",
    loginLink: "Log in",
    closed: "Discussion is closed for this study.",
    verificationRequired: "Please verify your email before posting a discussion.",
    composerLabel: "Write a discussion",
    composerPlaceholder: "Share a question or reflection.",
    replyLabel: "Write a reply",
    editLabel: "Edit discussion",
    submit: "Post",
    reply: "Reply",
    edit: "Edit",
    delete: "Delete",
    cancel: "Cancel",
    save: "Save",
    pending: "Pending review",
    loadMore: "Load more",
    loadingMore: "Loading more…",
    characters: "characters",
    successCreated: "Discussion submitted.",
    successUpdated: "Discussion updated.",
    successDeleted: "Discussion deleted.",
    confirmDelete: "Delete this discussion?",
    contentRequired: "Enter discussion content before submitting.",
    contentTooLong: "Discussion content must be 2,000 characters or fewer.",
    tooManyLinks: "This discussion contains too many links.",
    invalidParent: "This reply target is no longer available.",
    duplicate: "This discussion was already submitted.",
    rateLimit: "Please wait a moment before trying again.",
    sessionExpired: "Your session expired. Refresh and try again.",
    forbidden: "You do not have permission to perform this action.",
    notFound: "This discussion is no longer available.",
    origin: "This request was blocked by the site security policy.",
    generic: "Unable to complete the request. Please try again.",
    updated: "Updated",
    replies: "replies",
  },
  ko: {
    title: "토론",
    subtitle: "말씀연구 토론을 읽고 참여하세요.",
    loading: "토론을 불러오는 중입니다…",
    empty: "아직 등록된 토론이 없습니다.",
    loginRequired: "토론에 참여하려면 로그인하십시오.",
    loginLink: "로그인",
    closed: "이 말씀연구의 토론은 종료되었습니다.",
    verificationRequired: "토론을 작성하려면 이메일 인증을 완료하십시오.",
    composerLabel: "토론 작성",
    composerPlaceholder: "질문이나 묵상을 남겨 주세요.",
    replyLabel: "답글 작성",
    editLabel: "토론 수정",
    submit: "등록",
    reply: "답글",
    edit: "수정",
    delete: "삭제",
    cancel: "취소",
    save: "저장",
    pending: "승인 대기",
    loadMore: "더 보기",
    loadingMore: "더 불러오는 중…",
    characters: "자",
    successCreated: "토론이 등록되었습니다.",
    successUpdated: "토론이 수정되었습니다.",
    successDeleted: "토론이 삭제되었습니다.",
    confirmDelete: "이 토론을 삭제하시겠습니까?",
    contentRequired: "토론 내용을 입력한 뒤 등록하십시오.",
    contentTooLong: "토론 내용은 2,000자 이하여야 합니다.",
    tooManyLinks: "토론에 링크가 너무 많습니다.",
    invalidParent: "답글 대상 토론을 사용할 수 없습니다.",
    duplicate: "이미 등록된 토론입니다.",
    rateLimit: "잠시 후 다시 시도하십시오.",
    sessionExpired: "세션이 만료되었습니다. 새로고침 후 다시 시도하십시오.",
    forbidden: "이 작업을 수행할 권한이 없습니다.",
    notFound: "이 토론을 더 이상 사용할 수 없습니다.",
    origin: "사이트 보안 정책에 의해 요청이 차단되었습니다.",
    generic: "요청을 완료할 수 없습니다. 다시 시도하십시오.",
    updated: "수정됨",
    replies: "답글",
  },
} as const;

export function StudyDiscussionSection({ locale, studyId }: StudyDiscussionSectionProps) {
  const text = copy[locale];
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { refresh, restNonce, status } = useAuth();
  const [items, setItems] = useState<StudyDiscussion[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [discussionOpen, setDiscussionOpen] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [composerContent, setComposerContent] = useState("");
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<DraftMap>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDrafts, setEditDrafts] = useState<DraftMap>({});
  const [mutatingIds, setMutatingIds] = useState<Set<number>>(() => new Set());
  const [deletingIds, setDeletingIds] = useState<Set<number>>(() => new Set());
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const createLockRef = useRef(false);
  const loadMoreLockRef = useRef(false);
  const replyLocksRef = useRef<Set<number>>(new Set());
  const editLocksRef = useRef<Set<number>>(new Set());
  const deleteLocksRef = useRef<Set<number>>(new Set());

  const nonce = status === "authenticated" ? restNonce : null;
  const loginHref = useMemo(() => {
    const query = searchParams.toString();
    const currentPath = query === "" ? pathname : `${pathname}?${query}`;

    return `/${locale}/login?redirect=${encodeURIComponent(currentPath)}`;
  }, [locale, pathname, searchParams]);

  const loadPage = useCallback(
    async (nextPage: number, mode: "replace" | "append") => {
      const data = await listStudyDiscussions({
        nonce,
        page: nextPage,
        perPage: DISCUSSIONS_PER_PAGE,
        studyId,
      });

      setDiscussionOpen(data.discussion.open);
      setPage(data.pagination.page);
      setHasMore(data.pagination.hasMore);
      setItems((current) =>
        mode === "replace" ? data.items : mergeDiscussions(current, data.items),
      );
    },
    [nonce, studyId],
  );

  const reloadFirstPage = useCallback(async () => {
    await loadPage(1, "replace");
  }, [loadPage]);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialDiscussions() {
      if (status === "loading") {
        return;
      }

      if (status === "authenticated" && !restNonce) {
        await refresh().catch(() => undefined);

        return;
      }

      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      try {
        const data = await listStudyDiscussions({
          nonce: status === "authenticated" ? restNonce : null,
          page: 1,
          perPage: DISCUSSIONS_PER_PAGE,
          studyId,
        });

        if (!isMounted) {
          return;
        }

        setDiscussionOpen(data.discussion.open);
        setPage(data.pagination.page);
        setHasMore(data.pagination.hasMore);
        setItems(data.items);
      } catch (error) {
        if (isMounted) {
          setErrorMessage(mapErrorMessage(error, locale));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialDiscussions();

    return () => {
      isMounted = false;
    };
  }, [locale, refresh, restNonce, status, studyId]);

  const groupedItems = useMemo(() => groupDiscussions(items), [items]);
  const canWrite = status === "authenticated" && Boolean(nonce) && discussionOpen === true;
  const authReady = status !== "loading";

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateContent(composerContent, locale);

    if (validationError) {
      setErrorMessage(validationError);

      return;
    }

    if (!nonce || createLockRef.current) {
      return;
    }

    createLockRef.current = true;
    setIsCreating(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await createStudyDiscussion({
        content: composerContent.trim(),
        locale,
        nonce,
        studyId,
      });
      setComposerContent("");
      setSuccessMessage(text.successCreated);
      await reloadFirstPage();
    } catch (error) {
      setErrorMessage(mapErrorMessage(error, locale));
    } finally {
      createLockRef.current = false;
      setIsCreating(false);
    }
  }

  async function handleReply(parentId: number) {
    const content = replyDrafts[parentId] ?? "";
    const validationError = validateContent(content, locale);

    if (validationError) {
      setErrorMessage(validationError);

      return;
    }

    if (!nonce || replyLocksRef.current.has(parentId)) {
      return;
    }

    replyLocksRef.current.add(parentId);
    setMutatingIds((current) => new Set(current).add(parentId));
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await createStudyDiscussion({
        content: content.trim(),
        locale,
        nonce,
        parentId,
        studyId,
      });
      setReplyDrafts((current) => ({ ...current, [parentId]: "" }));
      setReplyingToId(null);
      setSuccessMessage(text.successCreated);
      await reloadFirstPage();
    } catch (error) {
      setErrorMessage(mapErrorMessage(error, locale));
    } finally {
      replyLocksRef.current.delete(parentId);
      setMutatingIds((current) => removeSetValue(current, parentId));
    }
  }

  async function handleEdit(discussionId: number) {
    const content = editDrafts[discussionId] ?? "";
    const validationError = validateContent(content, locale);

    if (validationError) {
      setErrorMessage(validationError);

      return;
    }

    if (!nonce || editLocksRef.current.has(discussionId)) {
      return;
    }

    editLocksRef.current.add(discussionId);
    setMutatingIds((current) => new Set(current).add(discussionId));
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await updateStudyDiscussion({
        content: content.trim(),
        discussionId,
        nonce,
        studyId,
      });
      setEditingId(null);
      setSuccessMessage(text.successUpdated);
      await reloadFirstPage();
    } catch (error) {
      setErrorMessage(mapErrorMessage(error, locale));
    } finally {
      editLocksRef.current.delete(discussionId);
      setMutatingIds((current) => removeSetValue(current, discussionId));
    }
  }

  async function handleDelete(discussionId: number) {
    if (!nonce || deleteLocksRef.current.has(discussionId)) {
      return;
    }

    if (!window.confirm(text.confirmDelete)) {
      return;
    }

    deleteLocksRef.current.add(discussionId);
    setDeletingIds((current) => new Set(current).add(discussionId));
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await deleteStudyDiscussion({
        discussionId,
        nonce,
        studyId,
      });
      setSuccessMessage(text.successDeleted);
      await reloadFirstPage();
    } catch (error) {
      setErrorMessage(mapErrorMessage(error, locale));
    } finally {
      deleteLocksRef.current.delete(discussionId);
      setDeletingIds((current) => removeSetValue(current, discussionId));
    }
  }

  async function handleLoadMore() {
    if (!hasMore || isLoadingMore || loadMoreLockRef.current) {
      return;
    }

    loadMoreLockRef.current = true;
    setIsLoadingMore(true);
    setErrorMessage("");

    try {
      await loadPage(page + 1, "append");
    } catch (error) {
      setErrorMessage(mapErrorMessage(error, locale));
    } finally {
      loadMoreLockRef.current = false;
      setIsLoadingMore(false);
    }
  }

  return (
    <section
      aria-busy={isLoading || isCreating || isLoadingMore}
      aria-labelledby="study-discussions-heading"
      className="min-w-0 rounded-md border border-zinc-200 bg-white p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-6">
        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
            {text.title}
          </p>
          <h2 id="study-discussions-heading" className="text-2xl font-semibold text-zinc-950">
            {text.title}
          </h2>
          <p className="text-sm leading-6 text-zinc-600">{text.subtitle}</p>
        </div>

        {errorMessage !== "" ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {errorMessage}
          </p>
        ) : null}
        {successMessage !== "" ? (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" aria-live="polite">
            {successMessage}
          </p>
        ) : null}

        {isLoading || !authReady ? (
          <p className="text-sm text-zinc-600">{text.loading}</p>
        ) : (
          <>
            {discussionOpen === false ? (
              <p className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
                {text.closed}
              </p>
            ) : null}

            {discussionOpen === true && status !== "authenticated" ? (
              <div className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm text-zinc-700">
                <p>{text.loginRequired}</p>
                <Link
                  className="mt-3 inline-flex min-h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                  href={loginHref}
                >
                  {text.loginLink}
                </Link>
              </div>
            ) : null}

            {canWrite ? (
              <form className="flex min-w-0 flex-col gap-3" onSubmit={handleCreate}>
                <label className="text-sm font-semibold text-zinc-900" htmlFor={`study-discussion-composer-${studyId}`}>
                  {text.composerLabel}
                </label>
                <textarea
                  className="min-h-28 w-full resize-y rounded-md border border-zinc-300 px-3 py-2 text-sm leading-6 text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:bg-zinc-100"
                  disabled={isCreating}
                  id={`study-discussion-composer-${studyId}`}
                  maxLength={MAX_CONTENT_LENGTH}
                  onChange={(event) => setComposerContent(event.target.value)}
                  placeholder={text.composerPlaceholder}
                  value={composerContent}
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-zinc-500">
                    {composerContent.length}/{MAX_CONTENT_LENGTH} {text.characters}
                  </span>
                  <button
                    className="inline-flex min-h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:cursor-not-allowed disabled:bg-zinc-400"
                    disabled={isCreating}
                    type="submit"
                  >
                    {text.submit}
                  </button>
                </div>
              </form>
            ) : null}

            <DiscussionList
              deletingIds={deletingIds}
              editDrafts={editDrafts}
              editingId={editingId}
              group={groupedItems}
              locale={locale}
              mutatingIds={mutatingIds}
              onCancelEdit={() => setEditingId(null)}
              onCancelReply={() => setReplyingToId(null)}
              onChangeEditDraft={(id, value) => setEditDrafts((current) => ({ ...current, [id]: value }))}
              onChangeReplyDraft={(id, value) => setReplyDrafts((current) => ({ ...current, [id]: value }))}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onReply={handleReply}
              onStartEdit={(discussion) => {
                setEditingId(discussion.id);
                setEditDrafts((current) => ({ ...current, [discussion.id]: discussion.content }));
              }}
              onStartReply={(discussionId) => {
                setReplyingToId(discussionId);
                setReplyDrafts((current) => ({ ...current, [discussionId]: current[discussionId] ?? "" }));
              }}
              replyDrafts={replyDrafts}
              replyingToId={replyingToId}
              text={text}
              userCanReply={canWrite}
            />

            {items.length === 0 ? (
              <p className="rounded-md border border-dashed border-zinc-200 px-4 py-6 text-sm text-zinc-600">
                {text.empty}
              </p>
            ) : null}

            {hasMore ? (
              <div className="flex justify-center">
                <button
                  className="inline-flex min-h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500"
                  disabled={isLoadingMore}
                  onClick={handleLoadMore}
                  type="button"
                >
                  {isLoadingMore ? text.loadingMore : text.loadMore}
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}

function DiscussionList({
  deletingIds,
  editDrafts,
  editingId,
  group,
  locale,
  mutatingIds,
  onCancelEdit,
  onCancelReply,
  onChangeEditDraft,
  onChangeReplyDraft,
  onDelete,
  onEdit,
  onReply,
  onStartEdit,
  onStartReply,
  replyDrafts,
  replyingToId,
  text,
  userCanReply,
}: {
  deletingIds: Set<number>;
  editDrafts: DraftMap;
  editingId: number | null;
  group: GroupedDiscussions;
  locale: StudyLocale;
  mutatingIds: Set<number>;
  onCancelEdit: () => void;
  onCancelReply: () => void;
  onChangeEditDraft: (id: number, value: string) => void;
  onChangeReplyDraft: (id: number, value: string) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onReply: (id: number) => void;
  onStartEdit: (discussion: StudyDiscussion) => void;
  onStartReply: (id: number) => void;
  replyDrafts: DraftMap;
  replyingToId: number | null;
  text: (typeof copy)[StudyLocale];
  userCanReply: boolean;
}) {
  if (group.roots.length === 0) {
    return null;
  }

  return (
    <ol className="flex min-w-0 flex-col gap-4">
      {group.roots.map((discussion) => (
        <li className="min-w-0" key={discussion.id}>
          <DiscussionItem
            deletingIds={deletingIds}
            discussion={discussion}
            editDrafts={editDrafts}
            editingId={editingId}
            isReply={false}
            locale={locale}
            mutatingIds={mutatingIds}
            onCancelEdit={onCancelEdit}
            onCancelReply={onCancelReply}
            onChangeEditDraft={onChangeEditDraft}
            onChangeReplyDraft={onChangeReplyDraft}
            onDelete={onDelete}
            onEdit={onEdit}
            onReply={onReply}
            onStartEdit={onStartEdit}
            onStartReply={onStartReply}
            replyDrafts={replyDrafts}
            replyingToId={replyingToId}
            replies={group.repliesByParent.get(discussion.id) ?? []}
            text={text}
            userCanReply={userCanReply}
          />
        </li>
      ))}
    </ol>
  );
}

function DiscussionItem({
  deletingIds,
  discussion,
  editDrafts,
  editingId,
  isReply,
  locale,
  mutatingIds,
  onCancelEdit,
  onCancelReply,
  onChangeEditDraft,
  onChangeReplyDraft,
  onDelete,
  onEdit,
  onReply,
  onStartEdit,
  onStartReply,
  replies,
  replyDrafts,
  replyingToId,
  text,
  userCanReply,
}: {
  deletingIds: Set<number>;
  discussion: StudyDiscussion;
  editDrafts: DraftMap;
  editingId: number | null;
  isReply: boolean;
  locale: StudyLocale;
  mutatingIds: Set<number>;
  onCancelEdit: () => void;
  onCancelReply: () => void;
  onChangeEditDraft: (id: number, value: string) => void;
  onChangeReplyDraft: (id: number, value: string) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onReply: (id: number) => void;
  onStartEdit: (discussion: StudyDiscussion) => void;
  onStartReply: (id: number) => void;
  replies: StudyDiscussion[];
  replyDrafts: DraftMap;
  replyingToId: number | null;
  text: (typeof copy)[StudyLocale];
  userCanReply: boolean;
}) {
  const isEditing = editingId === discussion.id;
  const isMutating = mutatingIds.has(discussion.id);
  const isDeleting = deletingIds.has(discussion.id);
  const replyDraft = replyDrafts[discussion.id] ?? "";
  const editDraft = editDrafts[discussion.id] ?? discussion.content;
  const showReplyForm = replyingToId === discussion.id;
  const canShowReply = userCanReply && !isReply;

  return (
    <article
      className={[
        "min-w-0 rounded-md border border-zinc-200 bg-white p-4",
        isReply ? "ml-0 border-l-4 bg-zinc-50 sm:ml-4" : "",
      ].join(" ")}
    >
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs text-zinc-500">
          <span className="min-w-0 max-w-full truncate font-semibold text-zinc-800">
            {discussion.author.displayName}
          </span>
          <span aria-hidden="true">·</span>
          <time dateTime={discussion.createdAt}>{formatDate(discussion.createdAt, locale)}</time>
          {discussion.updatedAt !== discussion.createdAt ? (
            <>
              <span aria-hidden="true">·</span>
              <span>{text.updated}</span>
            </>
          ) : null}
          {discussion.status !== "approved" ? (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
              {text.pending}
            </span>
          ) : null}
        </div>

        {isEditing ? (
          <div className="flex min-w-0 flex-col gap-3">
            <label className="sr-only" htmlFor={`study-discussion-edit-${discussion.id}`}>
              {text.editLabel}
            </label>
            <textarea
              className="min-h-28 w-full resize-y rounded-md border border-zinc-300 px-3 py-2 text-sm leading-6 text-zinc-900 outline-none transition-colors focus:border-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:bg-zinc-100"
              disabled={isMutating}
              id={`study-discussion-edit-${discussion.id}`}
              maxLength={MAX_CONTENT_LENGTH}
              onChange={(event) => onChangeEditDraft(discussion.id, event.target.value)}
              value={editDraft}
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-zinc-500">
                {editDraft.length}/{MAX_CONTENT_LENGTH} {text.characters}
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  className={secondaryButtonClass}
                  disabled={isMutating}
                  onClick={onCancelEdit}
                  type="button"
                >
                  {text.cancel}
                </button>
                <button
                  className={primaryButtonClass}
                  disabled={isMutating}
                  onClick={() => onEdit(discussion.id)}
                  type="button"
                >
                  {text.save}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="min-w-0 whitespace-pre-wrap text-sm leading-7 text-zinc-700 [overflow-wrap:anywhere]">
            {discussion.content}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {discussion.replyCount > 0 ? (
            <span className="text-xs text-zinc-500">
              {discussion.replyCount} {text.replies}
            </span>
          ) : null}
          {canShowReply ? (
            <button
              className={secondaryButtonClass}
              onClick={() => onStartReply(discussion.id)}
              type="button"
            >
              {text.reply}
            </button>
          ) : null}
          {discussion.canEdit ? (
            <button
              className={secondaryButtonClass}
              disabled={isMutating}
              onClick={() => onStartEdit(discussion)}
              type="button"
            >
              {text.edit}
            </button>
          ) : null}
          {discussion.canDelete ? (
            <button
              className={dangerButtonClass}
              disabled={isDeleting}
              onClick={() => onDelete(discussion.id)}
              type="button"
            >
              {text.delete}
            </button>
          ) : null}
        </div>

        {showReplyForm ? (
          <div className="flex min-w-0 flex-col gap-3 border-t border-zinc-200 pt-3">
            <label className="text-sm font-semibold text-zinc-900" htmlFor={`study-discussion-reply-${discussion.id}`}>
              {text.replyLabel}
            </label>
            <textarea
              className="min-h-24 w-full resize-y rounded-md border border-zinc-300 px-3 py-2 text-sm leading-6 text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:bg-zinc-100"
              disabled={isMutating}
              id={`study-discussion-reply-${discussion.id}`}
              maxLength={MAX_CONTENT_LENGTH}
              onChange={(event) => onChangeReplyDraft(discussion.id, event.target.value)}
              placeholder={text.composerPlaceholder}
              value={replyDraft}
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-zinc-500">
                {replyDraft.length}/{MAX_CONTENT_LENGTH} {text.characters}
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  className={secondaryButtonClass}
                  disabled={isMutating}
                  onClick={onCancelReply}
                  type="button"
                >
                  {text.cancel}
                </button>
                <button
                  className={primaryButtonClass}
                  disabled={isMutating}
                  onClick={() => onReply(discussion.id)}
                  type="button"
                >
                  {text.submit}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {replies.length > 0 ? (
          <ol className="flex min-w-0 flex-col gap-3 pt-2">
            {replies.map((reply) => (
              <li className="min-w-0" key={reply.id}>
                <DiscussionItem
                  deletingIds={deletingIds}
                  discussion={reply}
                  editDrafts={editDrafts}
                  editingId={editingId}
                  isReply
                  locale={locale}
                  mutatingIds={mutatingIds}
                  onCancelEdit={onCancelEdit}
                  onCancelReply={onCancelReply}
                  onChangeEditDraft={onChangeEditDraft}
                  onChangeReplyDraft={onChangeReplyDraft}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onReply={onReply}
                  onStartEdit={onStartEdit}
                  onStartReply={onStartReply}
                  replies={[]}
                  replyDrafts={replyDrafts}
                  replyingToId={replyingToId}
                  text={text}
                  userCanReply={userCanReply}
                />
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </article>
  );
}

type GroupedDiscussions = {
  roots: StudyDiscussion[];
  repliesByParent: Map<number, StudyDiscussion[]>;
};

function groupDiscussions(items: StudyDiscussion[]): GroupedDiscussions {
  const ids = new Set(items.map((item) => item.id));
  const roots: StudyDiscussion[] = [];
  const repliesByParent = new Map<number, StudyDiscussion[]>();

  for (const item of items) {
    if (item.parentId > 0 && ids.has(item.parentId)) {
      const replies = repliesByParent.get(item.parentId) ?? [];
      replies.push(item);
      repliesByParent.set(item.parentId, replies);

      continue;
    }

    roots.push(item);
  }

  return { roots, repliesByParent };
}

function mergeDiscussions(
  current: StudyDiscussion[],
  next: StudyDiscussion[],
): StudyDiscussion[] {
  const seen = new Set(current.map((item) => item.id));
  const merged = [...current];

  for (const item of next) {
    if (!seen.has(item.id)) {
      merged.push(item);
      seen.add(item.id);
    }
  }

  return merged;
}

function removeSetValue(current: Set<number>, value: number): Set<number> {
  const next = new Set(current);
  next.delete(value);

  return next;
}

function validateContent(value: string, locale: StudyLocale): string | null {
  const text = copy[locale];
  const trimmed = value.trim();

  if (trimmed === "") {
    return text.contentRequired;
  }

  if (trimmed.length > MAX_CONTENT_LENGTH) {
    return text.contentTooLong;
  }

  return null;
}

function mapErrorMessage(error: unknown, locale: StudyLocale): string {
  const text = copy[locale];

  if (!(error instanceof StudyDiscussionApiError)) {
    return text.generic;
  }

  switch (error.code) {
    case "rest_forbidden":
      return error.status === 401 ? text.loginRequired : text.forbidden;
    case "rest_nonce_invalid":
      return text.sessionExpired;
    case "email_verification_required":
      return text.verificationRequired;
    case "study_discussion_closed":
      return text.closed;
    case "discussion_content_required":
      return text.contentRequired;
    case "discussion_content_too_long":
      return text.contentTooLong;
    case "discussion_too_many_links":
      return text.tooManyLinks;
    case "discussion_parent_invalid":
    case "discussion_reply_depth_exceeded":
      return text.invalidParent;
    case "study_discussion_duplicate":
      return text.duplicate;
    case "study_discussion_rate_limited":
      return text.rateLimit;
    case "discussion_not_found":
      return text.notFound;
    case "forbidden_origin":
      return text.origin;
    default:
      if (error.status === 429) {
        return text.rateLimit;
      }

      return text.generic;
  }
}

function formatDate(value: string, locale: StudyLocale): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

const primaryButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:cursor-not-allowed disabled:bg-zinc-400";

const secondaryButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-md border border-zinc-300 px-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500";

const dangerButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-md border border-red-200 px-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500";

import type { StudyLocale } from "@/types/study";

export type StudyDiscussionStatus = "pending" | "approved" | "spam" | "trash";

export type StudyDiscussionAuthor = {
  id: number;
  displayName: string;
};

export type StudyDiscussion = {
  id: number;
  studyId: number;
  parentId: number;
  author: StudyDiscussionAuthor;
  content: string;
  status: StudyDiscussionStatus;
  createdAt: string;
  updatedAt: string;
  canEdit: boolean;
  canDelete: boolean;
  replyCount: number;
};

export type StudyDiscussionPagination = {
  page: number;
  perPage: number;
  total: number;
  hasMore: boolean;
};

export type StudyDiscussionList = {
  items: StudyDiscussion[];
  pagination: StudyDiscussionPagination;
  discussion: {
    open: boolean;
  };
};

export type StudyDiscussionMutationInput = {
  content: string;
  locale: StudyLocale;
  nonce: string;
  parentId?: number;
  studyId: number;
};

export type StudyDiscussionUpdateInput = {
  content: string;
  nonce: string;
  discussionId: number;
  studyId: number;
};

export type StudyDiscussionDeleteInput = {
  nonce: string;
  discussionId: number;
  studyId: number;
};

import type { ScriptureReference } from "@/types/scripture";
import type { MediaAsset } from "@/types/media";

export type ContentStatus = "draft" | "published";

export type ContentType = "sermon" | "bible-study" | "book" | "resource";

export type MinistryContent = {
  id: string;
  title: string;
  slug: string;
  type: ContentType;
  excerpt?: string;
  status: ContentStatus;
  scriptureReferences?: ScriptureReference[];
  media?: MediaAsset[];
  publishedAt?: string;
  updatedAt?: string;
};

export type Sermon = MinistryContent & {
  type: "sermon";
  speaker?: string;
};

export type BibleStudy = MinistryContent & {
  type: "bible-study";
  teacher?: string;
};

export type Book = MinistryContent & {
  type: "book";
  author?: string;
};

export type Resource = MinistryContent & {
  type: "resource";
  resourceType?: string;
};

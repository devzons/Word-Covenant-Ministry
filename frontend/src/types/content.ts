import type { ScriptureReference } from "@/types/scripture";
import type { MediaItem } from "@/types/media";

export type ContentStatus = "draft" | "published";

export type MinistryContent = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  status: ContentStatus;
  scriptureReferences?: ScriptureReference[];
  media?: MediaItem[];
  publishedAt?: string;
  updatedAt?: string;
};

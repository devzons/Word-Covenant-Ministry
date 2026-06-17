export type MediaProvider = "cloudflare" | "youtube" | "wordpress" | "external";

export type MediaItem = {
  id: string;
  title: string;
  provider: MediaProvider;
  url: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  transcriptUrl?: string;
};

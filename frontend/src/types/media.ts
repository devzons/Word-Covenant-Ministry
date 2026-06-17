export type CloudflareImage = {
  id: string;
  alt: string;
  variant?: string;
};

export type VideoProvider = "cloudflare-stream" | "youtube" | "vimeo";

export type MediaProvider =
  | "cloudflare"
  | "wordpress"
  | "external"
  | VideoProvider;

export type MediaAsset = {
  id: string;
  title: string;
  provider: MediaProvider;
  url: string;
  image?: CloudflareImage;
  thumbnailUrl?: string;
  durationSeconds?: number;
  transcriptUrl?: string;
};

export type MediaItem = MediaAsset;

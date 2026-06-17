import { siteConfig } from "@/config/site";

type CloudflareImageOptions = {
  variant?: string;
};

export function getCloudflareImageUrl(
  imageId: string,
  options: CloudflareImageOptions = {},
): string {
  const variant = options.variant || "public";

  if (!siteConfig.cloudflareImageAccountHash) {
    return imageId;
  }

  return `https://imagedelivery.net/${siteConfig.cloudflareImageAccountHash}/${imageId}/${variant}`;
}

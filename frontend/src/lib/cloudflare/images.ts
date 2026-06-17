import { siteConfig } from "@/config/site";
import type { CloudflareImage } from "@/types/media";

type CloudflareImageOptions = {
  variant?: string;
};

export function getCloudflareImageUrl(
  image: string | CloudflareImage,
  options: CloudflareImageOptions = {},
): string {
  const imageId = typeof image === "string" ? image : image.id;
  const variant =
    options.variant || (typeof image === "string" ? undefined : image.variant) || "public";

  if (!siteConfig.cloudflareImageAccountHash) {
    return imageId;
  }

  return `https://imagedelivery.net/${siteConfig.cloudflareImageAccountHash}/${imageId}/${variant}`;
}

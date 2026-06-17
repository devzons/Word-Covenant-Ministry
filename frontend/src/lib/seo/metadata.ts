import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

type MetadataOptions = {
  title?: string;
  description?: string;
};

export function createMetadata(options: MetadataOptions = {}): Metadata {
  const title = options.title
    ? `${options.title} | ${siteConfig.name}`
    : siteConfig.name;

  return {
    title,
    description:
      options.description ||
      "Christ-centered Scripture teaching and ministry resources.",
    metadataBase: new URL(siteConfig.url),
  };
}

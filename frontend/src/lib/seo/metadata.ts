import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

type MetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
};

export function createMetadata(options: MetadataOptions = {}): Metadata {
  const title = createMetadataTitle(options.title);
  const description = options.description || siteConfig.description;
  const url = options.path
    ? new URL(options.path, siteConfig.url).toString()
    : siteConfig.url;

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.defaultLocale,
      type: "website",
    },
  };
}

export function createMetadataTitle(title?: string): string {
  return title ? `${title} | ${siteConfig.name}` : siteConfig.name;
}

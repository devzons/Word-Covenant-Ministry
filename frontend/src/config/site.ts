export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "Word Covenant Ministry",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:10003/wp-json",
  environment: process.env.NEXT_PUBLIC_ENV || "local",
  cloudflareImageAccountHash:
    process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGE_ACCOUNT_HASH || "",
} as const;

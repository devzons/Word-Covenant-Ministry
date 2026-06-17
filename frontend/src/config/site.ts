export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "Word Covenant Ministry",
  description: "A Christ-centered Scripture platform for ministry teaching and biblical study.",
  localUrl: "http://wordcovenantministry.local:3030",
  productionUrl: "https://wordcovenantministry.org",
  url:
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://wordcovenantministry.local:3030",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:10003/wp-json",
  environment: process.env.NEXT_PUBLIC_ENV || "local",
  defaultLocale: "ko",
  supportedLocales: ["ko", "en"],
  cloudflareImageAccountHash:
    process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGE_ACCOUNT_HASH || "",
} as const;

"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

type Locale = (typeof siteConfig.supportedLocales)[number];

type LocaleSwitcherProps = {
  className?: string;
  currentLocale: string;
};

const localeLabels: Record<Locale, string> = {
  en: "EN",
  ko: "KO",
};

export function LocaleSwitcher({ className, currentLocale }: LocaleSwitcherProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <nav aria-label="Language selector" className={cn("flex items-center gap-1", className)}>
      {siteConfig.supportedLocales.map((locale) => {
        const isActive = locale === currentLocale;

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors",
              isActive
                ? "bg-zinc-950 text-white"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950",
            )}
            href={switchLocaleHref(pathname, locale, searchParams.toString())}
            key={locale}
          >
            {localeLabels[locale]}
          </Link>
        );
      })}
    </nav>
  );
}

function switchLocaleHref(pathname: string, nextLocale: Locale, queryString: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  const suffix = queryString ? `?${queryString}` : "";

  if (isSupportedLocale(firstSegment)) {
    return `/${[nextLocale, ...segments.slice(1)].join("/")}${suffix}`;
  }

  if (segments.length > 0) {
    return `/${[nextLocale, ...segments].join("/")}${suffix}`;
  }

  return `/${nextLocale}${suffix}`;
}

function isSupportedLocale(locale: string | undefined): locale is Locale {
  return siteConfig.supportedLocales.includes(locale as Locale);
}

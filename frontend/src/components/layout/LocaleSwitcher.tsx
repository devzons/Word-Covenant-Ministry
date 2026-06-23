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

const defaultBibleVersions: Record<Locale, string> = {
  en: "WEB",
  ko: "KRV",
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

function switchLocaleHref(
  pathname: string,
  nextLocale: Locale,
  queryString: string,
): string {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (isSupportedLocale(firstSegment)) {
    return createLocalizedHref([nextLocale, ...localizedSegments(segments.slice(1), nextLocale)], {
      queryString,
    });
  }

  if (segments.length > 0) {
    return createLocalizedHref([nextLocale, ...localizedSegments(segments, nextLocale)], {
      queryString,
    });
  }

  return createLocalizedHref([nextLocale], { queryString });
}

function isSupportedLocale(locale: string | undefined): locale is Locale {
  return siteConfig.supportedLocales.includes(locale as Locale);
}

function localizedSegments(segments: string[], nextLocale: Locale): string[] {
  if (isBibleChapterRoute(segments)) {
    return ["bible", defaultBibleVersions[nextLocale], ...segments.slice(2)];
  }

  return segments;
}

function isBibleChapterRoute(segments: string[]): boolean {
  return segments[0] === "bible" && segments.length >= 4;
}

function createLocalizedHref(
  segments: string[],
  {
    queryString,
  }: {
    queryString: string;
  },
): string {
  const params = new URLSearchParams(queryString);
  const nextParams = new URLSearchParams();

  if (isBibleChapterRoute(segments.slice(1))) {
    const mode = params.get("mode");

    if (mode) {
      nextParams.set("mode", mode);
    }
  } else {
    params.forEach((value, key) => {
      nextParams.append(key, value);
    });
  }

  const nextQueryString = nextParams.toString();
  const querySuffix = nextQueryString ? `?${nextQueryString}` : "";

  return `/${segments.join("/")}${querySuffix}`;
}

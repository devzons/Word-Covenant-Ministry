import Link from "next/link";
import { Suspense } from "react";

import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { Container } from "@/components/ui/Container";
import { primaryNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

type SiteHeaderProps = {
  className?: string;
  locale: string;
};

export function SiteHeader({ className, locale }: SiteHeaderProps) {
  return (
    <header className={cn("border-b border-zinc-200 bg-white", className)}>
      <Container className="flex flex-col gap-3 py-4 md:min-h-16 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="flex items-center justify-between gap-4">
          <Link href={localizedHref("/", locale)} className="text-base font-semibold text-zinc-950">
            {siteConfig.name}
          </Link>
          <div className="md:hidden">
            <Suspense fallback={null}>
              <LocaleSwitcher currentLocale={locale} />
            </Suspense>
          </div>
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <nav aria-label="Primary navigation" className="flex gap-5">
            {primaryNavigation.map((item) => (
              <Link
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950"
                href={localizedHref(item.href, locale)}
                key={item.href}
              >
                {item.label[localeLabel(locale)]}
              </Link>
            ))}
          </nav>
          <Suspense fallback={null}>
            <LocaleSwitcher currentLocale={locale} />
          </Suspense>
        </div>

        <details className="group md:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-md border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-900 marker:hidden">
            <span>{locale === "ko" ? "메뉴" : "Menu"}</span>
            <span aria-hidden="true" className="text-zinc-500 group-open:rotate-180">
              v
            </span>
          </summary>
          <nav aria-label="Mobile primary navigation" className="mt-3 grid gap-1">
            {primaryNavigation.map((item) => (
              <Link
                className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
                href={localizedHref(item.href, locale)}
                key={item.href}
              >
                {item.label[localeLabel(locale)]}
              </Link>
            ))}
          </nav>
          <div className="mt-3 border-t border-zinc-200 pt-3">
            <Suspense fallback={null}>
              <LocaleSwitcher currentLocale={locale} />
            </Suspense>
          </div>
        </details>
      </Container>
    </header>
  );
}

function localizedHref(href: string, locale: string): string {
  if (href === "/") {
    return `/${locale}`;
  }

  return `/${locale}${href}`;
}

function localeLabel(locale: string): "en" | "ko" {
  return locale === "en" ? "en" : "ko";
}

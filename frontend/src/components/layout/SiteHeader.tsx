import Link from "next/link";
import { Suspense } from "react";

import { AuthStatus } from "@/components/layout/AuthStatus";
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
      <Container className="py-0">
        <div className="flex min-w-0 items-start justify-between gap-4 border-b border-zinc-200 py-3 sm:items-center">
          <Link
            href={localizedHref("/", locale)}
            className="shrink-0 text-base font-semibold text-zinc-950"
          >
            {siteConfig.name}
          </Link>

          <div className="flex min-w-0 flex-col items-end gap-2 md:hidden">
            <Suspense fallback={null}>
              <LocaleSwitcher currentLocale={locale} />
            </Suspense>
            <AuthStatus className="justify-end" locale={locale} />
          </div>

          <div className="hidden min-w-0 items-center gap-4 md:flex">
            <Suspense fallback={null}>
              <LocaleSwitcher currentLocale={locale} />
            </Suspense>
            <AuthStatus className="justify-end" locale={locale} />
          </div>
        </div>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-5 overflow-x-auto py-3 md:flex"
        >
          {primaryNavigation.map((item) => (
            <Link
              className="whitespace-nowrap text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950"
              href={localizedHref(item.href, locale)}
              key={item.href}
            >
              {item.label[localeLabel(locale)]}
            </Link>
          ))}
        </nav>

        <details className="group py-3 md:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-md border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-900 marker:hidden">
            <span>{locale === "ko" ? "메뉴" : "Menu"}</span>
            <span aria-hidden="true" className="text-zinc-500 transition-transform group-open:rotate-180">
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

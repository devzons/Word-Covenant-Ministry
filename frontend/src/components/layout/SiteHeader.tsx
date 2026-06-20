import Link from "next/link";

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
      <Container className="flex min-h-16 items-center justify-between gap-6 py-4">
        <Link href={localizedHref("/", locale)} className="text-base font-semibold text-zinc-950">
          {siteConfig.name}
        </Link>
        <nav aria-label="Primary navigation" className="hidden gap-5 md:flex">
          {primaryNavigation.map((item) => (
            <Link
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950"
              href={localizedHref(item.href, locale)}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
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

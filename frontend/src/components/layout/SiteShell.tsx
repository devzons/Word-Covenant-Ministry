import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

type SiteShellProps = {
  children: ReactNode;
  className?: string;
  locale?: string;
};

export function SiteShell({
  children,
  className,
  locale = siteConfig.defaultLocale,
}: SiteShellProps) {
  return (
    <div className={cn("flex min-h-screen flex-col bg-white text-zinc-950", className)}>
      <SiteHeader locale={locale} />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale} />
    </div>
  );
}

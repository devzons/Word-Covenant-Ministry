import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { primaryNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

type SiteFooterProps = {
  className?: string;
  locale: string;
};

const footerCopy = {
  en: {
    description:
      "A Christ-centered Scripture platform for Bible reading, search, and original-language study.",
    copyright: "All rights reserved.",
  },
  ko: {
    description: "성경 읽기, 검색, 원어 연구를 위한 그리스도 중심의 성경 플랫폼입니다.",
    copyright: "모든 권리 보유.",
  },
};

export function SiteFooter({ className, locale }: SiteFooterProps) {
  const activeLocale = locale === "en" ? "en" : "ko";

  return (
    <footer className={cn("border-t border-zinc-200 bg-white", className)}>
      <Container className="grid gap-6 py-8 text-sm text-zinc-600 md:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-zinc-950">{siteConfig.name}</p>
          <p className="max-w-xl leading-6">{footerCopy[activeLocale].description}</p>
          <p className="pt-2 text-xs">
            © {new Date().getFullYear()} {siteConfig.name}. {footerCopy[activeLocale].copyright}
          </p>
        </div>
        <nav aria-label="Footer navigation" className="grid gap-2 sm:grid-cols-2">
          {primaryNavigation.map((item) => (
            <Link
              className="font-medium text-zinc-600 transition-colors hover:text-zinc-950"
              href={localizedHref(item.href, activeLocale)}
              key={item.href}
            >
              {item.label[activeLocale]}
            </Link>
          ))}
        </nav>
      </Container>
    </footer>
  );
}

function localizedHref(href: string, locale: string): string {
  if (href === "/") {
    return `/${locale}`;
  }

  return `/${locale}${href}`;
}

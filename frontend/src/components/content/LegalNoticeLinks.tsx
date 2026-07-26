import Link from "next/link";

import { getLegalLinkLabels, getLegalPath } from "@/content/legal/legalDocuments";

type LegalNoticeLinksProps = {
  className?: string;
  locale: string;
};

export function LegalNoticeLinks({ className, locale }: LegalNoticeLinksProps) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const labels = getLegalLinkLabels(activeLocale);

  return (
    <div className={className}>
      <Link
        className="transition-colors hover:text-zinc-950"
        href={getLegalPath(activeLocale, "terms")}
      >
        {labels.terms}
      </Link>
      <span aria-hidden="true" className="text-zinc-300">
        ·
      </span>
      <Link
        className="transition-colors hover:text-zinc-950"
        href={getLegalPath(activeLocale, "privacy")}
      >
        {labels.privacy}
      </Link>
    </div>
  );
}

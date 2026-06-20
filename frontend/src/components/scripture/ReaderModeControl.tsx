import Link from "next/link";

import { cn } from "@/lib/utils/cn";
import type { OriginalLanguageReaderMode } from "@/types/original-language";

type ReaderModeControlProps = {
  locale: string;
  version: string;
  book: string;
  chapter: number;
  mode: OriginalLanguageReaderMode;
};

const readerModes: Array<{
  value: OriginalLanguageReaderMode;
  label: {
    en: string;
    ko: string;
  };
}> = [
  { value: "reader", label: { en: "Reader", ko: "본문" } },
  { value: "original", label: { en: "Original", ko: "원어 보기" } },
  { value: "interlinear", label: { en: "Interlinear", ko: "행간 보기" } },
];

export function ReaderModeControl({
  locale,
  version,
  book,
  chapter,
  mode,
}: ReaderModeControlProps) {
  const activeLocale = locale === "en" ? "en" : "ko";

  return (
    <nav aria-label={activeLocale === "ko" ? "읽기 모드" : "Reader mode"} className="flex overflow-x-auto">
      <div className="inline-flex min-w-full rounded-md border border-zinc-300 bg-white p-1 sm:min-w-0">
        {readerModes.map((readerMode) => {
          const isActive = readerMode.value === mode;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-9 flex-1 items-center justify-center rounded px-3 text-sm font-semibold transition-colors sm:flex-none",
                isActive
                  ? "bg-zinc-950 text-white"
                  : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950",
              )}
              href={createReaderModeHref({
                locale,
                version,
                book,
                chapter,
                mode: readerMode.value,
              })}
              key={readerMode.value}
            >
              {readerMode.label[activeLocale]}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function createReaderModeHref({
  locale,
  version,
  book,
  chapter,
  mode,
}: ReaderModeControlProps): string {
  const params = new URLSearchParams({
    mode,
  });

  return `/${locale}/bible/${version}/${book}/${chapter}?${params.toString()}`;
}

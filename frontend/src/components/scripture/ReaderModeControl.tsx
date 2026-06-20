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
    <nav
      aria-label={activeLocale === "ko" ? "읽기 모드" : "Reader mode"}
      className="w-full min-w-0 max-w-full overflow-hidden"
    >
      <div className="grid w-full min-w-0 max-w-full grid-cols-3 rounded-md border border-zinc-300 bg-white p-1 sm:inline-grid sm:w-auto">
        {readerModes.map((readerMode) => {
          const isActive = readerMode.value === mode;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-10 min-w-0 items-center justify-center rounded px-1.5 text-center text-xs font-semibold leading-4 whitespace-normal transition-colors sm:h-9 sm:min-h-0 sm:px-3 sm:text-sm",
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

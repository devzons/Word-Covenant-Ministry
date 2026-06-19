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
  label: string;
}> = [
  { value: "reader", label: "Reader" },
  { value: "original", label: "Original" },
  { value: "interlinear", label: "Interlinear" },
];

export function ReaderModeControl({
  locale,
  version,
  book,
  chapter,
  mode,
}: ReaderModeControlProps) {
  return (
    <nav aria-label="Reader mode" className="flex overflow-x-auto">
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
              {readerMode.label}
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

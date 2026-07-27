"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { buildStudyIndexHref, type StudyLibraryVariant } from "@/lib/utils/study-library";

type StudyHubSearchProps = {
  locale: "en" | "ko";
};

const copy = {
  en: {
    label: "Search study content",
    placeholder: "Search sermons, exposition, books, and papers",
    submit: "Search",
    sermons: "Sermons & Exposition",
    publications: "Books & Research Papers",
    scope: "Search scope",
  },
  ko: {
    label: "말씀연구 검색",
    placeholder: "설교, 강해, 책, 연구논문 검색",
    submit: "검색",
    sermons: "설교와 강해",
    publications: "책과 연구논문",
    scope: "검색 범위",
  },
} as const;

export function StudyHubSearch({ locale }: StudyHubSearchProps) {
  const router = useRouter();
  const pageCopy = copy[locale];
  const [scope, setScope] = useState<StudyLibraryVariant>("sermons");
  const [query, setQuery] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const href = buildStudyIndexHref(locale, scope);
    const trimmed = query.trim();

    if (trimmed === "") {
      router.push(href);
      return;
    }

    const params = new URLSearchParams({ q: trimmed });
    router.push(`${href}?${params.toString()}`);
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-zinc-800">{pageCopy.scope}</span>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["sermons", pageCopy.sermons],
              ["publications", pageCopy.publications],
            ] as const
          ).map(([value, label]) => (
            <button
              aria-pressed={scope === value}
              className={
                scope === value
                  ? "inline-flex min-h-11 items-center rounded-full border border-zinc-950 bg-zinc-950 px-4 text-sm font-semibold text-white"
                  : "inline-flex min-h-11 items-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100"
              }
              key={value}
              onClick={() => setScope(value)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-zinc-800" htmlFor="study-hub-search">
            {pageCopy.label}
          </label>
          <input
            className="min-h-12 rounded-md border border-zinc-300 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
            id="study-hub-search"
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder={pageCopy.placeholder}
            type="search"
            value={query}
          />
        </div>
        <button
          className="inline-flex min-h-12 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 sm:self-end"
          type="submit"
        >
          {pageCopy.submit}
        </button>
      </div>
    </form>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getOriginalLanguageTermOccurrences } from "@/lib/api/original-language";
import { formatOriginalLanguageMorphology } from "@/lib/original-language/morphology";
import type {
  OriginalLanguageOccurrence,
  OriginalLanguageTermOccurrencesResponse,
} from "@/types/original-language";

type TermOccurrenceExplorerProps = {
  locale?: string;
  termId: number;
  onBack: () => void;
  onOpenDistribution?: () => void;
};

type ParsedReference = {
  bookCode: string;
  bookSlug: string | null;
  chapter: number;
  verse: number;
};

const perPage = 20;

const termOccurrenceExplorerCopy = {
  en: {
    title: "All Occurrences",
    back: "Back to Term Study",
    loading: "Loading occurrences...",
    error: "Occurrences could not be loaded.",
    empty: "No occurrences returned.",
    previous: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
    form: "Form",
    morphology: "Morphology",
    source: "Source",
    openReference: "Open passage",
    viewDistribution: "View Distribution",
  },
  ko: {
    title: "전체 출현",
    back: "단어 연구로 돌아가기",
    loading: "출현 목록을 불러오는 중입니다...",
    error: "출현 목록을 불러올 수 없습니다.",
    empty: "출현 목록이 없습니다.",
    previous: "이전",
    next: "다음",
    page: "페이지",
    of: "/",
    form: "표기",
    morphology: "형태",
    source: "자료",
    openReference: "본문 열기",
    viewDistribution: "분포 보기",
  },
};

export function TermOccurrenceExplorer({
  locale = "en",
  termId,
  onBack,
  onOpenDistribution,
}: TermOccurrenceExplorerProps) {
  const activeLocale = locale === "ko" ? "ko" : "en";
  const copy = termOccurrenceExplorerCopy[activeLocale];
  const [page, setPage] = useState(1);
  const [data, setData] = useState<OriginalLanguageTermOccurrencesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadOccurrences() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getOriginalLanguageTermOccurrences(termId, page, perPage);

        if (isCurrent) {
          setData(response);
        }
      } catch {
        if (isCurrent) {
          setData(null);
          setErrorMessage(copy.error);
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    void loadOccurrences();

    return () => {
      isCurrent = false;
    };
  }, [copy.error, page, termId]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.per_page)) : 1;

  return (
    <div>
      <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
            {copy.title}
          </p>
          <h2 className="mt-1 break-words text-2xl font-semibold text-zinc-950">
            {data?.term.lemma ?? `#${termId}`}
          </h2>
        </div>
        <button
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
          onClick={onBack}
          type="button"
        >
          {copy.back}
        </button>
      </div>

      {onOpenDistribution ? (
        <button
          className="mt-5 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
          onClick={onOpenDistribution}
          type="button"
        >
          {copy.viewDistribution}
        </button>
      ) : null}

      <div className="mt-5">
        {renderOccurrenceExplorerState({
          copy,
          data,
          errorMessage,
          isLoading,
          locale: activeLocale,
        })}
      </div>

      {data && data.total > 0 ? (
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-zinc-200 pt-4 text-sm">
          <button
            className="rounded-md border border-zinc-300 px-3 py-1.5 font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={page <= 1 || isLoading}
            onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
            type="button"
          >
            {copy.previous}
          </button>
          <p className="text-zinc-600">
            {copy.page} {page.toLocaleString()} {copy.of} {totalPages.toLocaleString()}
          </p>
          <button
            className="rounded-md border border-zinc-300 px-3 py-1.5 font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={page >= totalPages || isLoading}
            onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
            type="button"
          >
            {copy.next}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function renderOccurrenceExplorerState({
  copy,
  data,
  errorMessage,
  isLoading,
  locale,
}: {
  copy: (typeof termOccurrenceExplorerCopy)["en"];
  data: OriginalLanguageTermOccurrencesResponse | null;
  errorMessage: string;
  isLoading: boolean;
  locale: "en" | "ko";
}) {
  if (isLoading) {
    return <p className="text-sm text-zinc-600">{copy.loading}</p>;
  }

  if (errorMessage) {
    return <p className="text-sm text-red-700">{errorMessage}</p>;
  }

  if (!data || data.occurrences.length === 0) {
    return <p className="text-sm text-zinc-600">{copy.empty}</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {data.occurrences.map((occurrence) => (
        <OccurrenceListItem
          copy={copy}
          key={occurrence.id}
          locale={locale}
          occurrence={occurrence}
        />
      ))}
    </ul>
  );
}

function OccurrenceListItem({
  copy,
  locale,
  occurrence,
}: {
  copy: (typeof termOccurrenceExplorerCopy)["en"];
  locale: "en" | "ko";
  occurrence: OriginalLanguageOccurrence;
}) {
  const morphology = formatOriginalLanguageMorphology(occurrence.morphology, locale);
  const reference = parseSourceReference(occurrence.source_ref);
  const referenceLabel = formatReferenceLabel(reference, occurrence.source_ref, locale);
  const href = reference?.bookSlug
    ? `/${locale}/bible/KRV/${reference.bookSlug}/${reference.chapter}?mode=interlinear#v${reference.verse}`
    : "";

  return (
    <li className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {href ? (
          <Link
            aria-label={`${copy.openReference}: ${referenceLabel}`}
            className="font-semibold text-zinc-950 underline-offset-2 hover:underline"
            href={href}
          >
            {referenceLabel}
          </Link>
        ) : (
          <p className="font-semibold text-zinc-950">{referenceLabel}</p>
        )}
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-zinc-500">
          {occurrence.source_dataset}
        </span>
      </div>

      <dl className="mt-2 grid gap-1">
        <div>
          <dt className="sr-only">{copy.form}</dt>
          <dd className={surfaceFormClassName(occurrence.source_dataset)}>
            {occurrence.surface_form}
          </dd>
        </div>
        {morphology.display ? (
          <div>
            <dt className="font-semibold text-zinc-500">{copy.morphology}</dt>
            <dd className="mt-0.5 text-zinc-700">{morphology.display}</dd>
          </div>
        ) : null}
      </dl>
    </li>
  );
}

function parseSourceReference(sourceRef: string): ParsedReference | null {
  const match = sourceRef.match(/(?:^|:)([1-3]?[A-Za-z]+)\.(\d+)\.(\d+)/);

  if (!match) {
    return null;
  }

  const bookCode = match[1];
  const chapter = Number(match[2]);
  const verse = Number(match[3]);

  if (!Number.isInteger(chapter) || !Number.isInteger(verse)) {
    return null;
  }

  return {
    bookCode,
    bookSlug: stepBookCodeToSlug[bookCode] ?? null,
    chapter,
    verse,
  };
}

function formatReferenceLabel(
  reference: ParsedReference | null,
  sourceRef: string,
  locale: "en" | "ko",
): string {
  if (!reference) {
    return sourceRef;
  }

  const book = stepBookCodeToLabel[reference.bookCode];
  const bookLabel = book ? book[locale] : reference.bookCode;

  if (locale === "ko") {
    return `${bookLabel} ${reference.chapter}:${reference.verse}`;
  }

  return `${bookLabel} ${reference.chapter}:${reference.verse}`;
}

function surfaceFormClassName(sourceDataset: OriginalLanguageOccurrence["source_dataset"]): string {
  const base = "break-words text-base text-zinc-950";

  if (sourceDataset === "STEP_TAHOT") {
    return `${base} font-hebrew text-right`;
  }

  return base;
}

const stepBookCodeToSlug: Record<string, string> = {
  Gen: "genesis",
  Exo: "exodus",
  Lev: "leviticus",
  Num: "numbers",
  Deu: "deuteronomy",
  Jos: "joshua",
  Jdg: "judges",
  Rut: "ruth",
  "1Sa": "1-samuel",
  "2Sa": "2-samuel",
  "1Ki": "1-kings",
  "2Ki": "2-kings",
  "1Ch": "1-chronicles",
  "2Ch": "2-chronicles",
  Ezr: "ezra",
  Neh: "nehemiah",
  Est: "esther",
  Job: "job",
  Psa: "psalms",
  Pro: "proverbs",
  Ecc: "ecclesiastes",
  Sng: "song-of-songs",
  Isa: "isaiah",
  Jer: "jeremiah",
  Lam: "lamentations",
  Ezk: "ezekiel",
  Dan: "daniel",
  Hos: "hosea",
  Jol: "joel",
  Amo: "amos",
  Oba: "obadiah",
  Jon: "jonah",
  Mic: "micah",
  Nam: "nahum",
  Hab: "habakkuk",
  Zep: "zephaniah",
  Hag: "haggai",
  Zec: "zechariah",
  Mal: "malachi",
  Mat: "matthew",
  Mrk: "mark",
  Luk: "luke",
  Jhn: "john",
  Act: "acts",
  Rom: "romans",
  "1Co": "1-corinthians",
  "2Co": "2-corinthians",
  Gal: "galatians",
  Eph: "ephesians",
  Php: "philippians",
  Col: "colossians",
  "1Th": "1-thessalonians",
  "2Th": "2-thessalonians",
  "1Ti": "1-timothy",
  "2Ti": "2-timothy",
  Tit: "titus",
  Phm: "philemon",
  Heb: "hebrews",
  Jas: "james",
  "1Pe": "1-peter",
  "2Pe": "2-peter",
  "1Jn": "1-john",
  "2Jn": "2-john",
  "3Jn": "3-john",
  Jud: "jude",
  Rev: "revelation",
};

const stepBookCodeToLabel: Record<string, { en: string; ko: string }> = {
  Gen: { en: "Genesis", ko: "창세기" },
  Exo: { en: "Exodus", ko: "출애굽기" },
  Lev: { en: "Leviticus", ko: "레위기" },
  Num: { en: "Numbers", ko: "민수기" },
  Deu: { en: "Deuteronomy", ko: "신명기" },
  Jos: { en: "Joshua", ko: "여호수아" },
  Jdg: { en: "Judges", ko: "사사기" },
  Rut: { en: "Ruth", ko: "룻기" },
  "1Sa": { en: "1 Samuel", ko: "사무엘상" },
  "2Sa": { en: "2 Samuel", ko: "사무엘하" },
  "1Ki": { en: "1 Kings", ko: "열왕기상" },
  "2Ki": { en: "2 Kings", ko: "열왕기하" },
  "1Ch": { en: "1 Chronicles", ko: "역대상" },
  "2Ch": { en: "2 Chronicles", ko: "역대하" },
  Ezr: { en: "Ezra", ko: "에스라" },
  Neh: { en: "Nehemiah", ko: "느헤미야" },
  Est: { en: "Esther", ko: "에스더" },
  Job: { en: "Job", ko: "욥기" },
  Psa: { en: "Psalms", ko: "시편" },
  Pro: { en: "Proverbs", ko: "잠언" },
  Ecc: { en: "Ecclesiastes", ko: "전도서" },
  Sng: { en: "Song of Songs", ko: "아가" },
  Isa: { en: "Isaiah", ko: "이사야" },
  Jer: { en: "Jeremiah", ko: "예레미야" },
  Lam: { en: "Lamentations", ko: "예레미야애가" },
  Ezk: { en: "Ezekiel", ko: "에스겔" },
  Dan: { en: "Daniel", ko: "다니엘" },
  Hos: { en: "Hosea", ko: "호세아" },
  Jol: { en: "Joel", ko: "요엘" },
  Amo: { en: "Amos", ko: "아모스" },
  Oba: { en: "Obadiah", ko: "오바댜" },
  Jon: { en: "Jonah", ko: "요나" },
  Mic: { en: "Micah", ko: "미가" },
  Nam: { en: "Nahum", ko: "나훔" },
  Hab: { en: "Habakkuk", ko: "하박국" },
  Zep: { en: "Zephaniah", ko: "스바냐" },
  Hag: { en: "Haggai", ko: "학개" },
  Zec: { en: "Zechariah", ko: "스가랴" },
  Mal: { en: "Malachi", ko: "말라기" },
  Mat: { en: "Matthew", ko: "마태복음" },
  Mrk: { en: "Mark", ko: "마가복음" },
  Luk: { en: "Luke", ko: "누가복음" },
  Jhn: { en: "John", ko: "요한복음" },
  Act: { en: "Acts", ko: "사도행전" },
  Rom: { en: "Romans", ko: "로마서" },
  "1Co": { en: "1 Corinthians", ko: "고린도전서" },
  "2Co": { en: "2 Corinthians", ko: "고린도후서" },
  Gal: { en: "Galatians", ko: "갈라디아서" },
  Eph: { en: "Ephesians", ko: "에베소서" },
  Php: { en: "Philippians", ko: "빌립보서" },
  Col: { en: "Colossians", ko: "골로새서" },
  "1Th": { en: "1 Thessalonians", ko: "데살로니가전서" },
  "2Th": { en: "2 Thessalonians", ko: "데살로니가후서" },
  "1Ti": { en: "1 Timothy", ko: "디모데전서" },
  "2Ti": { en: "2 Timothy", ko: "디모데후서" },
  Tit: { en: "Titus", ko: "디도서" },
  Phm: { en: "Philemon", ko: "빌레몬서" },
  Heb: { en: "Hebrews", ko: "히브리서" },
  Jas: { en: "James", ko: "야고보서" },
  "1Pe": { en: "1 Peter", ko: "베드로전서" },
  "2Pe": { en: "2 Peter", ko: "베드로후서" },
  "1Jn": { en: "1 John", ko: "요한일서" },
  "2Jn": { en: "2 John", ko: "요한이서" },
  "3Jn": { en: "3 John", ko: "요한삼서" },
  Jud: { en: "Jude", ko: "유다서" },
  Rev: { en: "Revelation", ko: "요한계시록" },
};

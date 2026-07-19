"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

import {
  MeaningCardPilot,
  getMeaningCardPilotKey,
} from "@/components/scripture/MeaningCardPilot";
import { StrongStudyPanel } from "@/components/scripture/StrongStudyPanel";
import { formatOriginalLanguageMorphology } from "@/lib/original-language/morphology";

export type OriginalWordPanelWord = {
  occurrence_id?: number;
  source_ref?: string;
  surface_form: string;
  lemma: string;
  strongs_number: string;
  strongs_extended: string;
  transliteration: string;
  transliteration_ko?: string | null;
  gloss: string | null;
  gloss_ko?: string | null;
  morphology: string;
};

type OriginalWordPanelProps = {
  passage?: {
    book: string;
    chapter: number;
    verse: number;
  };
  locale?: string;
  translation?: string;
  word: OriginalWordPanelWord | null;
  onClose: () => void;
};

const originalWordPanelCopy = {
  en: {
    title: "Original Word",
    dialog: "Original word details",
    meaningDialog: "Meaning card",
    closePanel: "Close original word panel",
    close: "Close",
    meaningCard: "Meaning card",
    back: "Back to Word Details",
    lemma: "Lemma",
    strongs: "Strong's",
    strongsExtended: "Strong's Extended",
    strongStudyAction: "Open Strong study",
    transliteration: "Transliteration",
    transliterationFallback: "",
    gloss: "Gloss",
    englishGloss: "Gloss",
    morphology: "Morphology",
    morphologyCode: "Morphology code",
  },
  ko: {
    title: "원어 단어",
    dialog: "원어 단어 정보",
    meaningDialog: "의미 카드",
    closePanel: "원어 단어 패널 닫기",
    close: "닫기",
    meaningCard: "의미 카드",
    back: "단어 정보로 돌아가기",
    lemma: "원형",
    strongs: "스트롱 번호",
    strongsExtended: "확장 스트롱 번호",
    strongStudyAction: "스트롱 연구 열기",
    transliteration: "음역",
    transliterationFallback: "기존 원어 음역",
    gloss: "뜻",
    englishGloss: "영어 뜻",
    morphology: "형태",
    morphologyCode: "원어 형태 코드",
  },
};

export function OriginalWordPanel({
  passage,
  locale = "en",
  translation = "KRV",
  word,
  onClose,
}: OriginalWordPanelProps) {
  const activeLocale = locale === "ko" ? "ko" : "en";
  const copy = originalWordPanelCopy[activeLocale];
  const meaningCardKey =
    word && passage
      ? getMeaningCardPilotKey({
          book: passage?.book ?? "",
          chapter: passage?.chapter ?? 0,
          verse: passage?.verse ?? 0,
          strongsNumber: word?.strongs_number ?? "",
          sourceRef: word?.source_ref ?? "",
        })
      : null;
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!word) {
      return undefined;
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    };
  }, [handleClose, word]);

  if (!word) {
    return null;
  }

  const panelKey = [
    passage?.book ?? "unknown",
    passage?.chapter ?? 0,
    passage?.verse ?? 0,
    word.source_ref ?? word.occurrence_id ?? word.strongs_number,
  ].join(":");

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label={copy.closePanel}
        className="absolute inset-0 bg-zinc-950/30"
        onClick={handleClose}
        type="button"
      />
      <OriginalWordPanelContent
        key={panelKey}
        activeLocale={activeLocale}
        closeButtonRef={closeButtonRef}
        copy={copy}
        handleClose={handleClose}
        meaningCardKey={meaningCardKey}
        translation={translation}
        word={word}
      />
    </div>
  );
}

function OriginalWordPanelContent({
  activeLocale,
  closeButtonRef,
  copy,
  handleClose,
  meaningCardKey,
  translation,
  word,
}: {
  activeLocale: "en" | "ko";
  closeButtonRef: RefObject<HTMLButtonElement | null>;
  copy: (typeof originalWordPanelCopy)["en"];
  handleClose: () => void;
  meaningCardKey: "hesed" | "zera" | null;
  translation: string;
  word: OriginalWordPanelWord;
}) {
  const [panelView, setPanelView] = useState<"meaning" | "word" | "strong">(() =>
    meaningCardKey ? "meaning" : "word",
  );

  const dialogLabel = panelView === "meaning" ? copy.meaningDialog : copy.dialog;

  return (
    <aside
      aria-label={dialogLabel}
      aria-modal="true"
      className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-lg bg-white p-5 shadow-2xl sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-24 sm:h-auto sm:max-h-[calc(100vh-8rem)] sm:w-[420px] sm:rounded-lg sm:border sm:border-zinc-200"
      role="dialog"
    >
      {panelView === "strong" ? (
        <StrongStudyPanel
          backLabel={copy.back}
          locale={activeLocale}
          onBack={() => setPanelView("word")}
          strongsNumber={word.strongs_number}
          translation={translation}
        />
      ) : panelView === "meaning" ? (
        <MeaningCardPilot
          locale={activeLocale}
          pilotKey={meaningCardKey ?? "hesed"}
          onOpenWordDetails={() => setPanelView("word")}
          translation={translation}
        />
      ) : (
        <OriginalWordDetails
          closeButtonRef={closeButtonRef}
          meaningCardAvailable={Boolean(meaningCardKey)}
          onOpenMeaningCard={() => setPanelView("meaning")}
          onClose={handleClose}
          onOpenStrongStudy={() => setPanelView("strong")}
          locale={activeLocale}
          copy={copy}
          word={word}
        />
      )}
    </aside>
  );
}

function OriginalWordDetails({
  word,
  closeButtonRef,
  meaningCardAvailable,
  onOpenMeaningCard,
  onClose,
  onOpenStrongStudy,
  locale,
  copy,
}: {
  word: OriginalWordPanelWord;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
  meaningCardAvailable: boolean;
  onOpenMeaningCard: () => void;
  onClose: () => void;
  onOpenStrongStudy: () => void;
  locale: "en" | "ko";
  copy: (typeof originalWordPanelCopy)["en"];
}) {
  const morphology = formatOriginalLanguageMorphology(word.morphology, locale);
  const transliteration = localizedTransliteration(word, locale);
  const gloss = localizedGloss(word, locale);

  return (
    <>
      <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
            {copy.title}
          </p>
          <h2 className={surfaceFormClassName(word.surface_form)}>
            {word.surface_form}
          </h2>
        </div>
        <div className="flex flex-col gap-2">
          {meaningCardAvailable ? (
            <button
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
              onClick={onOpenMeaningCard}
              type="button"
            >
              {copy.meaningCard}
            </button>
          ) : null}
          <button
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
            onClick={onClose}
            ref={closeButtonRef}
            type="button"
          >
            {copy.close}
          </button>
        </div>
      </div>

      <dl className="mt-5 grid gap-4 text-sm">
        <PanelField label={copy.lemma} value={word.lemma} />
        <StrongPanelField
          actionLabel={copy.strongStudyAction}
          label={copy.strongs}
          onOpenStrongStudy={onOpenStrongStudy}
          value={word.strongs_number}
        />
        <PanelField label={copy.strongsExtended} value={word.strongs_extended} />
        {transliteration.value ? (
          <PanelField
            isFallback={transliteration.isFallback}
            label={copy.transliteration}
            note={transliteration.isFallback ? copy.transliterationFallback : ""}
            value={transliteration.value}
          />
        ) : null}
        {gloss.value ? <PanelField label={gloss.label} value={gloss.value} /> : null}
        {morphology.display ? (
          <MorphologyPanelField
            codeLabel={copy.morphologyCode}
            label={copy.morphology}
            morphology={morphology}
          />
        ) : null}
      </dl>
    </>
  );
}

function PanelField({
  isFallback = false,
  label,
  note = "",
  value,
}: {
  isFallback?: boolean;
  label: string;
  note?: string;
  value: string;
}) {
  return (
    <div>
      <dt className="font-semibold text-zinc-500">{label}</dt>
      <dd className="mt-1 break-words text-base text-zinc-950">
        <span className={isFallback ? "italic text-zinc-700" : undefined}>{value}</span>
        {note ? (
          <span className="mt-1 block text-xs font-normal text-zinc-500">{note}</span>
        ) : null}
      </dd>
    </div>
  );
}

function localizedTransliteration(
  word: Pick<OriginalWordPanelWord, "transliteration" | "transliteration_ko">,
  locale: "en" | "ko",
): { value: string; isFallback: boolean } {
  if (locale === "ko" && word.transliteration_ko) {
    return {
      value: word.transliteration_ko,
      isFallback: false,
    };
  }

  return {
    value: word.transliteration,
    isFallback: locale === "ko",
  };
}

function localizedGloss(
  word: Pick<OriginalWordPanelWord, "gloss" | "gloss_ko">,
  locale: "en" | "ko",
): { label: string; value: string } {
  if (locale === "ko" && word.gloss_ko) {
    return {
      label: originalWordPanelCopy.ko.gloss,
      value: word.gloss_ko,
    };
  }

  return {
    label: locale === "ko" ? originalWordPanelCopy.ko.englishGloss : originalWordPanelCopy.en.gloss,
    value: word.gloss || "",
  };
}

function StrongPanelField({
  actionLabel,
  label,
  value,
  onOpenStrongStudy,
}: {
  actionLabel: string;
  label: string;
  value: string;
  onOpenStrongStudy: () => void;
}) {
  return (
    <div>
      <dt className="font-semibold text-zinc-500">{label}</dt>
      <dd className="mt-1">
        <button
          aria-label={`${actionLabel}: ${value}`}
          className="inline-flex flex-col rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-left transition-colors hover:border-zinc-300 hover:bg-white"
          onClick={onOpenStrongStudy}
          type="button"
        >
          <span className="break-words text-base font-semibold text-zinc-950">{value}</span>
          <span className="mt-0.5 text-xs font-medium text-zinc-500">{actionLabel}</span>
        </button>
      </dd>
    </div>
  );
}

function MorphologyPanelField({
  codeLabel,
  label,
  morphology,
}: {
  codeLabel: string;
  label: string;
  morphology: ReturnType<typeof formatOriginalLanguageMorphology>;
}) {
  if (morphology.isFallback) {
    return (
      <div>
        <dt className="font-semibold text-zinc-500">{label}</dt>
        <dd className="mt-1 break-words text-base text-zinc-950">
          <span className="italic text-zinc-700">{morphology.display}</span>
        </dd>
      </div>
    );
  }

  return (
    <PanelField
      label={label}
      note={morphology.display !== morphology.raw ? `${codeLabel}: ${morphology.raw}` : ""}
      value={morphology.display}
    />
  );
}

function surfaceFormClassName(value: string): string {
  return [
    "mt-1 text-2xl font-semibold text-zinc-950",
    isHebrewText(value) ? "font-hebrew" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function isHebrewText(value: string): boolean {
  return /[\u0590-\u05ff]/.test(value);
}

"use client";

import { useState } from "react";

import { StrongStudyPanel } from "@/components/scripture/StrongStudyPanel";
import { formatOriginalLanguageMorphology } from "@/lib/original-language/morphology";

export type OriginalWordPanelWord = {
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
  locale?: string;
  word: OriginalWordPanelWord | null;
  onClose: () => void;
};

const originalWordPanelCopy = {
  en: {
    title: "Original Word",
    dialog: "Original word details",
    closePanel: "Close original word panel",
    close: "Close",
    back: "Word details",
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
    closePanel: "원어 단어 패널 닫기",
    close: "닫기",
    back: "단어 정보",
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

export function OriginalWordPanel({ locale = "en", word, onClose }: OriginalWordPanelProps) {
  const [panelView, setPanelView] = useState<"word" | "strong">("word");
  const activeLocale = locale === "ko" ? "ko" : "en";
  const copy = originalWordPanelCopy[activeLocale];

  if (!word) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label={copy.closePanel}
        className="absolute inset-0 bg-zinc-950/30"
        onClick={onClose}
        type="button"
      />
      <aside
        aria-label={copy.dialog}
        className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-lg bg-white p-5 shadow-2xl sm:inset-x-auto sm:bottom-0 sm:right-0 sm:top-0 sm:h-full sm:max-h-none sm:w-96 sm:rounded-none sm:border-l sm:border-zinc-200"
        role="dialog"
      >
        {panelView === "strong" ? (
          <StrongStudyPanel
            backLabel={copy.back}
            locale={activeLocale}
            onBack={() => setPanelView("word")}
            strongsNumber={word.strongs_number}
          />
        ) : (
          <OriginalWordDetails
            onClose={onClose}
            onOpenStrongStudy={() => setPanelView("strong")}
            locale={activeLocale}
            copy={copy}
            word={word}
          />
        )}
      </aside>
    </div>
  );
}

function OriginalWordDetails({
  word,
  onClose,
  onOpenStrongStudy,
  locale,
  copy,
}: {
  word: OriginalWordPanelWord;
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
          <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
            {word.surface_form}
          </h2>
        </div>
        <button
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
          onClick={onClose}
          type="button"
        >
          {copy.close}
        </button>
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

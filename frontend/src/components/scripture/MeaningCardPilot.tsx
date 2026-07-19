"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

type MeaningCardPilotLocale = "en" | "ko";

type MeaningCardPilotProps = {
  locale: MeaningCardPilotLocale;
  translation: string;
  onOpenWordDetails: () => void;
};

type MeaningCardPilotSection = "journey" | "evidence" | "passages" | null;

const meaningCardPilotCopy = {
  en: {
    eyebrow: "Meaning Card Pilot",
    openWordDetails: "Open word details",
    currentMeaning: "Current Meaning",
    shortExplanation:
      "The flow of the passage asks for covenant-aligned faithfulness rather than sacrifice alone.",
    partOfSpeech: "Part of Speech",
    theme: "Theme",
    currentPassage: "Current Passage",
    canonicalMeaning: "Canonical Meaning",
    relatedThemes: "Related Themes",
    strong: "Strong",
    lxx: "LXX",
    ntReception: "NT Reception",
    evidencePreview: "Evidence Preview",
    meaningJourney: "Meaning Journey",
    evidence: "Evidence",
    relatedPassages: "Related Passages",
    journeyNote: "The journey begins in Hosea 6:6 and continues into Matthew's citation.",
    evidenceNote: "This preview stays compact and points to the reviewed evidence trail.",
    passageNote: "These are the current pilot passage links.",
    relatedThemeList: "Mercy, Faithfulness, Love",
    relatedPassagesLabel: "Open passage",
  },
  ko: {
    eyebrow: "의미 카드 파일럿",
    openWordDetails: "원어 단어 보기",
    currentMeaning: "현재 의미",
    shortExplanation:
      "제사보다 언약 관계에 합당한 신실함을 하나님께서 원하신다는 본문 흐름입니다.",
    partOfSpeech: "품사",
    theme: "주제",
    currentPassage: "현재 본문",
    canonicalMeaning: "정경적 의미",
    relatedThemes: "관련 주제",
    strong: "스트롱",
    lxx: "칠십인역",
    ntReception: "신약 수용",
    evidencePreview: "근거 미리보기",
    meaningJourney: "의미 여정",
    evidence: "근거",
    relatedPassages: "관련 본문",
    journeyNote: "의미 여정은 호세아 6:6에서 시작해 마태복음의 인용으로 이어집니다.",
    evidenceNote: "이 미리보기는 간결하게 유지하고 검토된 근거 경로를 가리킵니다.",
    passageNote: "이 항목들은 현재 파일럿 본문 링크입니다.",
    relatedThemeList: "긍휼, 신실함, 사랑",
    relatedPassagesLabel: "본문 열기",
  },
} as const;

export function MeaningCardPilot({
  locale,
  translation,
  onOpenWordDetails,
}: MeaningCardPilotProps) {
  const [activeSection, setActiveSection] = useState<MeaningCardPilotSection>(null);
  const activeLocale = locale === "en" ? "en" : "ko";
  const copy = meaningCardPilotCopy[activeLocale];
  const passageLinks = useMemo(
    () => [
      {
        href: `/${activeLocale}/bible/${translation}/hosea/6?mode=reader#v6`,
        label: activeLocale === "ko" ? "호세아 6:6" : "Hosea 6:6",
      },
      {
        href: `/${activeLocale}/bible/${translation}/matthew/9?mode=reader#v13`,
        label: activeLocale === "ko" ? "마태복음 9:13" : "Matthew 9:13",
      },
      {
        href: `/${activeLocale}/bible/${translation}/matthew/12?mode=reader#v7`,
        label: activeLocale === "ko" ? "마태복음 12:7" : "Matthew 12:7",
      },
    ],
    [activeLocale, translation],
  );

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
            {copy.eyebrow}
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-zinc-950 sm:text-3xl">
            <span dir="rtl" lang="he">
              חֶסֶד
            </span>{" "}
            <span className="text-zinc-500">
              ({activeLocale === "ko" ? "헤세드" : "hesed"})
            </span>
          </h2>
          <p className="mt-1 text-sm font-medium text-zinc-600">
            {copy.currentPassage}:{" "}
            {activeLocale === "ko" ? "호세아 6:6" : "Hosea 6:6"}
          </p>
        </div>
        <button
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
          onClick={onOpenWordDetails}
          type="button"
        >
          {copy.openWordDetails}
        </button>
      </div>

      <dl className="grid gap-2.5 text-sm">
        <MeaningCardField
          label={activeLocale === "ko" ? "원어" : "Original Term"}
          value={
            <span className="break-words">
              <span dir="rtl" lang="he">
                חֶסֶד
              </span>{" "}
              ({activeLocale === "ko" ? "헤세드" : "hesed"})
            </span>
          }
        />
        <MeaningCardField
          emphasize
          label={copy.currentMeaning}
          value={activeLocale === "ko" ? "언약적 신실한 사랑" : "Covenant-faithful love"}
        />
        <MeaningCardField
          label={activeLocale === "ko" ? "본문 설명" : "Short Explanation"}
          value={copy.shortExplanation}
        />
        <MeaningCardField
          label={copy.partOfSpeech}
          value={activeLocale === "ko" ? "명사" : "Noun"}
        />
        <MeaningCardField
          label={copy.theme}
          value={activeLocale === "ko" ? "언약" : "Covenant"}
        />
        <MeaningCardField
          label={copy.currentPassage}
          value={activeLocale === "ko" ? "호세아 6:6" : "Hosea 6:6"}
        />
      </dl>

      <div className="flex flex-wrap gap-2">
        <MeaningCardActionButton
          active={activeSection === "journey"}
          label={copy.meaningJourney}
          onClick={() =>
            setActiveSection((current) => (current === "journey" ? null : "journey"))
          }
        />
        <MeaningCardActionButton
          active={activeSection === "evidence"}
          label={copy.evidence}
          onClick={() =>
            setActiveSection((current) => (current === "evidence" ? null : "evidence"))
          }
        />
        <MeaningCardActionButton
          active={activeSection === "passages"}
          label={copy.relatedPassages}
          onClick={() =>
            setActiveSection((current) => (current === "passages" ? null : "passages"))
          }
        />
      </div>

      {activeSection === "journey" ? (
        <MeaningCardSection title={copy.meaningJourney}>
          <p className="text-sm leading-6 text-zinc-700">{copy.journeyNote}</p>
          <p className="mt-3 text-sm font-medium text-zinc-900">
            {activeLocale === "ko"
              ? "호세아 6:6 → 마태복음 9:13 → 마태복음 12:7"
              : "Hosea 6:6 → Matthew 9:13 → Matthew 12:7"}
          </p>
        </MeaningCardSection>
      ) : null}

      {activeSection === "evidence" ? (
        <MeaningCardSection title={copy.evidence}>
          <dl className="grid gap-0.5">
            <MeaningCardField
              compact
              label={copy.canonicalMeaning}
              value={
                activeLocale === "ko"
                  ? "언약 관계에서 나타나는 사랑·인애·신실함의 검토된 성경적 의미 범위"
                  : "The reviewed biblical range of love, mercy, and faithfulness expressed within covenant relationship."
              }
            />
            <MeaningCardField
              compact
              label={copy.relatedThemes}
              value={activeLocale === "ko" ? "긍휼, 신실함, 사랑" : copy.relatedThemeList}
            />
            <MeaningCardField compact label={copy.strong} value="H2617" />
            <MeaningCardField
              compact
              label={copy.lxx}
              value={<span>ἔλεος ({activeLocale === "ko" ? "엘레오스" : "eleos"})</span>}
            />
            <MeaningCardField
              compact
              label={copy.ntReception}
              value={
                activeLocale === "ko"
                  ? "마태복음 9:13; 12:7"
                  : "Matthew 9:13; Matthew 12:7"
              }
            />
            <MeaningCardField
              compact
              label={copy.evidencePreview}
              value={
                activeLocale === "ko"
                  ? "본문 문맥, 정경 용례, 칠십인역 번역, 신약 인용"
                  : "Passage context, canonical usage, LXX translation, New Testament citation"
              }
            />
          </dl>
          <p className="mt-3 text-sm leading-6 text-zinc-600">{copy.evidenceNote}</p>
        </MeaningCardSection>
      ) : null}

      {activeSection === "passages" ? (
        <MeaningCardSection title={copy.relatedPassages}>
          <p className="text-sm leading-6 text-zinc-700">{copy.passageNote}</p>
          <div className="mt-3 flex flex-col gap-2">
            {passageLinks.map((item) => (
              <Link
                className="inline-flex min-h-10 w-fit items-center rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
                href={item.href}
                key={item.href}
              >
                {copy.relatedPassagesLabel}: {item.label}
              </Link>
            ))}
          </div>
        </MeaningCardSection>
      ) : null}
    </section>
  );
}

export function isMeaningCardPilotCandidate({
  book,
  chapter,
  verse,
  strongsNumber,
}: {
  book: string;
  chapter: number;
  verse: number;
  strongsNumber: string;
}): boolean {
  return book === "hosea" && chapter === 6 && verse === 6 && strongsNumber === "H2617";
}

function MeaningCardSection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-zinc-50/70 px-4 py-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function MeaningCardField({
  compact = false,
  emphasize = false,
  label,
  value,
}: {
  compact?: boolean;
  emphasize?: boolean;
  label: string;
  value: ReactNode;
}) {
  const baseClassName = compact
    ? "flex flex-wrap items-start gap-x-2 gap-y-0.5 py-1"
    : "flex flex-wrap items-start gap-x-2 gap-y-1 rounded-md border border-zinc-200 bg-white px-3 py-2";

  return (
    <div className={baseClassName}>
      <dt className="shrink-0 font-medium text-zinc-500">{label}:</dt>
      <dd
        className={[
          "min-w-0 flex-1 break-words",
          compact ? "text-zinc-900" : "text-zinc-950",
          emphasize ? "font-medium" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {value}
      </dd>
    </div>
  );
}

function MeaningCardActionButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={[
        "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
        active
          ? "border-zinc-900 bg-zinc-950 text-white"
          : "border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50",
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

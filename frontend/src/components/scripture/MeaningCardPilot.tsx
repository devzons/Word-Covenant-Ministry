"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

type MeaningCardPilotLocale = "en" | "ko";
type MeaningCardPilotKey = "hesed" | "zera";

type MeaningCardPilotProps = {
  locale: MeaningCardPilotLocale;
  pilotKey: MeaningCardPilotKey;
  translation: string;
  onOpenWordDetails: () => void;
};

type MeaningCardPilotSection = "journey" | "evidence" | "passages" | null;

type MeaningCardPilotLink = {
  book: string;
  chapter: number;
  verse: number;
  label: {
    en: string;
    ko: string;
  };
};

type MeaningCardPilotContent = {
  originalTerm: string;
  transliteration: {
    en: string;
    ko: string;
  };
  currentMeaning: {
    en: string;
    ko: string;
  };
  shortExplanation: {
    en: string;
    ko: string;
  };
  partOfSpeech: {
    en: string;
    ko: string;
  };
  theme: {
    en: string;
    ko: string;
  };
  currentPassage: {
    en: string;
    ko: string;
  };
  canonicalMeaning: {
    en: string;
    ko: string;
  };
  relatedThemes: {
    en: string;
    ko: string;
  };
  strong: string;
  evidencePreview: {
    en: string;
    ko: string;
  };
  otherUsage?: {
    en: string;
    ko: string;
  };
  journeyNote: {
    en: string;
    ko: string;
  };
  journeyPath: {
    en: string;
    ko: string;
  };
  passageNote: {
    en: string;
    ko: string;
  };
  passageLinks: MeaningCardPilotLink[];
};

const meaningCardPilotCopy = {
  en: {
    eyebrow: "Meaning Card Pilot",
    openWordDetails: "Open word details",
    currentMeaning: "Current Meaning",
    partOfSpeech: "Part of Speech",
    theme: "Theme",
    currentPassage: "Current Passage",
    canonicalMeaning: "Canonical Meaning",
    relatedThemes: "Related Themes",
    strong: "Strong",
    evidencePreview: "Evidence Preview",
    meaningJourney: "Meaning Journey",
    evidence: "Evidence",
    relatedPassages: "Related Passages",
    relatedPassagesLabel: "Open passage",
    otherUsage: "Other Usage",
  },
  ko: {
    eyebrow: "의미 카드 파일럿",
    openWordDetails: "원어 단어 보기",
    currentMeaning: "현재 의미",
    partOfSpeech: "품사",
    theme: "주제",
    currentPassage: "현재 본문",
    canonicalMeaning: "정경적 의미",
    relatedThemes: "관련 주제",
    strong: "스트롱",
    evidencePreview: "근거 미리보기",
    meaningJourney: "의미 여정",
    evidence: "근거",
    relatedPassages: "관련 본문",
    relatedPassagesLabel: "본문 열기",
    otherUsage: "다른 용례",
  },
} as const;

const meaningCardPilotContent: Record<MeaningCardPilotKey, Record<MeaningCardPilotLocale, MeaningCardPilotContent>> = {
  hesed: {
    en: {
      originalTerm: "חֶסֶד",
      transliteration: { en: "hesed", ko: "헤세드" },
      currentMeaning: {
        en: "Covenant-faithful love",
        ko: "언약적 신실한 사랑",
      },
      shortExplanation: {
        en: "The flow of the passage asks for covenant-aligned faithfulness rather than sacrifice alone.",
        ko: "제사보다 언약 관계에 합당한 신실함을 하나님께서 원하신다는 본문 흐름입니다.",
      },
      partOfSpeech: { en: "Noun", ko: "명사" },
      theme: { en: "Covenant", ko: "언약" },
      currentPassage: { en: "Hosea 6:6", ko: "호세아 6:6" },
      canonicalMeaning: {
        en: "The reviewed biblical range of love, mercy, and faithfulness expressed within covenant relationship.",
        ko: "언약 관계에서 나타나는 사랑·인애·신실함의 검토된 성경적 의미 범위",
      },
      relatedThemes: { en: "Mercy, Faithfulness, Love", ko: "긍휼, 신실함, 사랑" },
      strong: "H2617",
      evidencePreview: {
        en: "Passage context, canonical usage, LXX translation, New Testament citation",
        ko: "본문 문맥, 정경 용례, 칠십인역 번역, 신약 인용",
      },
      journeyNote: {
        en: "The journey begins in Hosea 6:6 and continues into Matthew's citation.",
        ko: "의미 여정은 호세아 6:6에서 시작해 마태복음의 인용으로 이어집니다.",
      },
      journeyPath: {
        en: "Hosea 6:6 → Matthew 9:13 → Matthew 12:7",
        ko: "호세아 6:6 → 마태복음 9:13 → 마태복음 12:7",
      },
      passageNote: {
        en: "These are the current pilot passage links.",
        ko: "이 항목들은 현재 파일럿 본문 링크입니다.",
      },
      passageLinks: [
        {
          book: "hosea",
          chapter: 6,
          verse: 6,
          label: {
            en: "Hosea 6:6",
            ko: "호세아 6:6",
          },
        },
        {
          book: "matthew",
          chapter: 9,
          verse: 13,
          label: {
            en: "Matthew 9:13",
            ko: "마태복음 9:13",
          },
        },
        {
          book: "matthew",
          chapter: 12,
          verse: 7,
          label: {
            en: "Matthew 12:7",
            ko: "마태복음 12:7",
          },
        },
      ],
    },
    ko: {
      originalTerm: "חֶסֶד",
      transliteration: { en: "hesed", ko: "헤세드" },
      currentMeaning: {
        en: "Covenant-faithful love",
        ko: "언약적 신실한 사랑",
      },
      shortExplanation: {
        en: "The flow of the passage asks for covenant-aligned faithfulness rather than sacrifice alone.",
        ko: "제사보다 언약 관계에 합당한 신실함을 하나님께서 원하신다는 본문 흐름입니다.",
      },
      partOfSpeech: { en: "Noun", ko: "명사" },
      theme: { en: "Covenant", ko: "언약" },
      currentPassage: { en: "Hosea 6:6", ko: "호세아 6:6" },
      canonicalMeaning: {
        en: "The reviewed biblical range of love, mercy, and faithfulness expressed within covenant relationship.",
        ko: "언약 관계에서 나타나는 사랑·인애·신실함의 검토된 성경적 의미 범위",
      },
      relatedThemes: { en: "Mercy, Faithfulness, Love", ko: "긍휼, 신실함, 사랑" },
      strong: "H2617",
      evidencePreview: {
        en: "Passage context, canonical usage, LXX translation, New Testament citation",
        ko: "본문 문맥, 정경 용례, 칠십인역 번역, 신약 인용",
      },
      journeyNote: {
        en: "The journey begins in Hosea 6:6 and continues into Matthew's citation.",
        ko: "의미 여정은 호세아 6:6에서 시작해 마태복음의 인용으로 이어집니다.",
      },
      journeyPath: {
        en: "Hosea 6:6 → Matthew 9:13 → Matthew 12:7",
        ko: "호세아 6:6 → 마태복음 9:13 → 마태복음 12:7",
      },
      passageNote: {
        en: "These are the current pilot passage links.",
        ko: "이 항목들은 현재 파일럿 본문 링크입니다.",
      },
      passageLinks: [
        {
          book: "hosea",
          chapter: 6,
          verse: 6,
          label: {
            en: "Hosea 6:6",
            ko: "호세아 6:6",
          },
        },
        {
          book: "matthew",
          chapter: 9,
          verse: 13,
          label: {
            en: "Matthew 9:13",
            ko: "마태복음 9:13",
          },
        },
        {
          book: "matthew",
          chapter: 12,
          verse: 7,
          label: {
            en: "Matthew 12:7",
            ko: "마태복음 12:7",
          },
        },
      ],
    },
  },
  zera: {
    en: {
      originalTerm: "זֶרַע",
      transliteration: { en: "zera", ko: "제라" },
      currentMeaning: {
        en: "offspring",
        ko: "후손",
      },
      shortExplanation: {
        en: "God declares continuing conflict not only between the serpent and the woman, but also between the serpent’s offspring and the woman’s offspring. In this context, זֶרַע refers to offspring rather than a planted seed.",
        ko: "하나님께서는 뱀과 여자 사이뿐 아니라 뱀의 후손과 여자의 후손 사이에도 대립이 계속될 것을 선언하십니다. 이 문맥에서 זֶרַע는 씨앗이 아니라 계보를 이어 가는 후손을 가리킵니다.",
      },
      partOfSpeech: { en: "Noun", ko: "명사" },
      theme: { en: "Promise and Offspring", ko: "약속과 후손" },
      currentPassage: { en: "Genesis 3:15", ko: "창세기 3:15" },
      canonicalMeaning: {
        en: "In Genesis, זֶרַע refers to the continuation of life and human lineage, and later becomes prominent in the promises of offspring, land, and blessing given to Abraham. Genesis 3:15 may be read as an early point in that trajectory, without placing every later canonical conclusion inside the word itself.",
        ko: "창세기에서 זֶרַע는 생명의 번식과 인간의 계보를 가리키며, 이후 아브라함에게 주어진 후손과 땅과 복의 약속 속에서 중요한 언약적 용어로 전개됩니다. 창세기 3:15은 그 흐름의 출발점으로 읽을 수 있지만, 후대의 의미를 이 단어 하나에 모두 담아서는 안 됩니다.",
      },
      relatedThemes: { en: "Promise, Offspring, Covenant", ko: "약속, 후손, 언약" },
      strong: "H2233",
      evidencePreview: {
        en: "Genesis 12:7 — promise of land to Abram’s offspring; Genesis 15:5 — promise of offspring as numerous as the stars; Genesis 17:7 — covenant extending to Abraham’s offspring; Genesis 22:17–18 — offspring and blessing to the nations",
        ko: "창세기 12:7 — 아브람의 후손에게 땅을 주시겠다는 약속; 창세기 15:5 — 셀 수 없이 많아질 후손의 약속; 창세기 17:7 — 아브라함과 그의 후손에게 이어지는 언약; 창세기 22:17–18 — 후손의 번성과 열방의 복",
      },
      otherUsage: {
        en: "Genesis 1:11–12, 29 — the basic sense of plant seed",
        ko: "창세기 1:11–12, 29 — 식물의 씨와 종자라는 기본 의미",
      },
      journeyNote: {
        en: "The journey begins in Genesis 3:15 and continues through the covenant promises given to Abraham.",
        ko: "의미 여정은 창세기 3:15에서 시작해 아브라함에게 주어진 언약 약속들 속으로 이어집니다.",
      },
      journeyPath: {
        en: "Genesis 3:15 → Genesis 12:7 → Genesis 15:5 → Genesis 17:7 → Genesis 22:17–18",
        ko: "창세기 3:15 → 창세기 12:7 → 창세기 15:5 → 창세기 17:7 → 창세기 22:17–18",
      },
      passageNote: {
        en: "These passages trace the offspring promise through Genesis.",
        ko: "이 항목들은 창세기 안에서 후손 약속의 흐름을 따라갑니다.",
      },
      passageLinks: [
        {
          book: "genesis",
          chapter: 3,
          verse: 15,
          label: {
            en: "Genesis 3:15",
            ko: "창세기 3:15",
          },
        },
        {
          book: "genesis",
          chapter: 12,
          verse: 7,
          label: {
            en: "Genesis 12:7",
            ko: "창세기 12:7",
          },
        },
        {
          book: "genesis",
          chapter: 15,
          verse: 5,
          label: {
            en: "Genesis 15:5",
            ko: "창세기 15:5",
          },
        },
        {
          book: "genesis",
          chapter: 17,
          verse: 7,
          label: {
            en: "Genesis 17:7",
            ko: "창세기 17:7",
          },
        },
        {
          book: "genesis",
          chapter: 22,
          verse: 17,
          label: {
            en: "Genesis 22:17–18",
            ko: "창세기 22:17–18",
          },
        },
      ],
    },
    ko: {
      originalTerm: "זֶרַע",
      transliteration: { en: "zera", ko: "제라" },
      currentMeaning: {
        en: "offspring",
        ko: "후손",
      },
      shortExplanation: {
        en: "God declares continuing conflict not only between the serpent and the woman, but also between the serpent’s offspring and the woman’s offspring. In this context, זֶרַע refers to offspring rather than a planted seed.",
        ko: "하나님께서는 뱀과 여자 사이뿐 아니라 뱀의 후손과 여자의 후손 사이에도 대립이 계속될 것을 선언하십니다. 이 문맥에서 זֶרַע는 씨앗이 아니라 계보를 이어 가는 후손을 가리킵니다.",
      },
      partOfSpeech: { en: "Noun", ko: "명사" },
      theme: { en: "Promise and Offspring", ko: "약속과 후손" },
      currentPassage: { en: "Genesis 3:15", ko: "창세기 3:15" },
      canonicalMeaning: {
        en: "In Genesis, זֶרַע refers to the continuation of life and human lineage, and later becomes prominent in the promises of offspring, land, and blessing given to Abraham. Genesis 3:15 may be read as an early point in that trajectory, without placing every later canonical conclusion inside the word itself.",
        ko: "창세기에서 זֶרַע는 생명의 번식과 인간의 계보를 가리키며, 이후 아브라함에게 주어진 후손과 땅과 복의 약속 속에서 중요한 언약적 용어로 전개됩니다. 창세기 3:15은 그 흐름의 출발점으로 읽을 수 있지만, 후대의 의미를 이 단어 하나에 모두 담아서는 안 됩니다.",
      },
      relatedThemes: { en: "Promise, Offspring, Covenant", ko: "약속, 후손, 언약" },
      strong: "H2233",
      evidencePreview: {
        en: "Genesis 12:7 — promise of land to Abram’s offspring; Genesis 15:5 — promise of offspring as numerous as the stars; Genesis 17:7 — covenant extending to Abraham’s offspring; Genesis 22:17–18 — offspring and blessing to the nations",
        ko: "창세기 12:7 — 아브람의 후손에게 땅을 주시겠다는 약속; 창세기 15:5 — 셀 수 없이 많아질 후손의 약속; 창세기 17:7 — 아브라함과 그의 후손에게 이어지는 언약; 창세기 22:17–18 — 후손의 번성과 열방의 복",
      },
      otherUsage: {
        en: "Genesis 1:11–12, 29 — the basic sense of plant seed",
        ko: "창세기 1:11–12, 29 — 식물의 씨와 종자라는 기본 의미",
      },
      journeyNote: {
        en: "The journey begins in Genesis 3:15 and continues through the covenant promises given to Abraham.",
        ko: "의미 여정은 창세기 3:15에서 시작해 아브라함에게 주어진 언약 약속들 속으로 이어집니다.",
      },
      journeyPath: {
        en: "Genesis 3:15 → Genesis 12:7 → Genesis 15:5 → Genesis 17:7 → Genesis 22:17–18",
        ko: "창세기 3:15 → 창세기 12:7 → 창세기 15:5 → 창세기 17:7 → 창세기 22:17–18",
      },
      passageNote: {
        en: "These passages trace the offspring promise through Genesis.",
        ko: "이 항목들은 창세기 안에서 후손 약속의 흐름을 따라갑니다.",
      },
      passageLinks: [
        {
          book: "genesis",
          chapter: 3,
          verse: 15,
          label: {
            en: "Genesis 3:15",
            ko: "창세기 3:15",
          },
        },
        {
          book: "genesis",
          chapter: 12,
          verse: 7,
          label: {
            en: "Genesis 12:7",
            ko: "창세기 12:7",
          },
        },
        {
          book: "genesis",
          chapter: 15,
          verse: 5,
          label: {
            en: "Genesis 15:5",
            ko: "창세기 15:5",
          },
        },
        {
          book: "genesis",
          chapter: 17,
          verse: 7,
          label: {
            en: "Genesis 17:7",
            ko: "창세기 17:7",
          },
        },
        {
          book: "genesis",
          chapter: 22,
          verse: 17,
          label: {
            en: "Genesis 22:17–18",
            ko: "창세기 22:17–18",
          },
        },
      ],
    },
  },
} as const;

export function MeaningCardPilot({
  locale,
  pilotKey,
  translation,
  onOpenWordDetails,
}: MeaningCardPilotProps) {
  const [activeSection, setActiveSection] = useState<MeaningCardPilotSection>(null);
  const activeLocale = locale === "en" ? "en" : "ko";
  const copy = meaningCardPilotCopy[activeLocale];
  const pilot = meaningCardPilotContent[pilotKey][activeLocale];
  const passageLinks = useMemo(
    () =>
      pilot.passageLinks.map((item) => ({
        href: `/${activeLocale}/bible/${translation}/${item.book}/${item.chapter}?mode=reader#v${item.verse}`,
        label: item.label[activeLocale],
      })),
    [activeLocale, pilot.passageLinks, translation],
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
              {pilot.originalTerm}
            </span>{" "}
            <span className="text-zinc-500">
              ({pilot.transliteration[activeLocale]})
            </span>
          </h2>
          <p className="mt-1 text-sm font-medium text-zinc-600">
            {copy.currentPassage}:{" "}
            {pilot.currentPassage[activeLocale]}
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
                {pilot.originalTerm}
              </span>{" "}
              ({pilot.transliteration[activeLocale]})
            </span>
          }
        />
        <MeaningCardField
          emphasize
          label={copy.currentMeaning}
          value={pilot.currentMeaning[activeLocale]}
        />
        <MeaningCardField
          label={activeLocale === "ko" ? "본문 설명" : "Short Explanation"}
          value={pilot.shortExplanation[activeLocale]}
        />
        <MeaningCardField
          label={copy.partOfSpeech}
          value={pilot.partOfSpeech[activeLocale]}
        />
        <MeaningCardField
          label={copy.theme}
          value={pilot.theme[activeLocale]}
        />
        <MeaningCardField
          label={copy.currentPassage}
          value={pilot.currentPassage[activeLocale]}
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
          <p className="text-sm leading-6 text-zinc-700">{pilot.journeyNote[activeLocale]}</p>
          <p className="mt-3 text-sm font-medium text-zinc-900">
            {pilot.journeyPath[activeLocale]}
          </p>
        </MeaningCardSection>
      ) : null}

      {activeSection === "evidence" ? (
        <MeaningCardSection title={copy.evidence}>
          <dl className="grid gap-0.5">
            <MeaningCardField
              compact
              label={copy.canonicalMeaning}
              value={pilot.canonicalMeaning[activeLocale]}
            />
            <MeaningCardField
              compact
              label={copy.relatedThemes}
              value={pilot.relatedThemes[activeLocale]}
            />
            <MeaningCardField compact label={copy.strong} value={pilot.strong} />
            <MeaningCardField
              compact
              label={copy.evidencePreview}
              value={pilot.evidencePreview[activeLocale]}
            />
            {pilot.otherUsage ? (
              <MeaningCardField
                compact
                label={copy.otherUsage}
                value={pilot.otherUsage[activeLocale]}
              />
            ) : null}
          </dl>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            {activeLocale === "ko"
              ? "이 미리보기는 간결하게 유지하고 검토된 근거 경로를 가리킵니다."
              : "This preview stays compact and points to the reviewed evidence trail."}
          </p>
        </MeaningCardSection>
      ) : null}

      {activeSection === "passages" ? (
        <MeaningCardSection title={copy.relatedPassages}>
          <p className="text-sm leading-6 text-zinc-700">{pilot.passageNote[activeLocale]}</p>
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

export function getMeaningCardPilotKey({
  book,
  chapter,
  verse,
  strongsNumber,
  sourceRef,
}: {
  book: string;
  chapter: number;
  verse: number;
  strongsNumber: string;
  sourceRef?: string;
}): MeaningCardPilotKey | null {
  if (book === "hosea" && chapter === 6 && verse === 6 && strongsNumber === "H2617") {
    return "hesed";
  }

  if (
    book === "genesis" &&
    chapter === 3 &&
    verse === 15 &&
    strongsNumber === "H2233" &&
    sourceRef === "STEP_TAHOT:Gen.3.15#09=L:0"
  ) {
    return "zera";
  }

  return null;
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

export type MorphologyLocale = "en" | "ko";

export type MorphologyParseResult = {
  raw: string;
  display: string;
  parts: string[];
  isFallback: boolean;
};

type LocalizedLabel = Record<MorphologyLocale, string>;

const separator = " · ";

const functionLabels = {
  A: { en: "Adjective", ko: "형용사" },
  ADV: { en: "Adverb", ko: "부사" },
  C: { en: "Conjunction", ko: "접속사" },
  CONJ: { en: "Conjunction", ko: "접속사" },
  D: { en: "Adverb", ko: "부사" },
  N: { en: "Noun", ko: "명사" },
  P: { en: "Pronoun", ko: "대명사" },
  PREP: { en: "Preposition", ko: "전치사" },
  PRT: { en: "Particle", ko: "불변화사" },
  "PRT-N": { en: "Negative particle", ko: "부정 불변화사" },
  R: { en: "Preposition", ko: "전치사" },
  T: { en: "Particle", ko: "불변화사" },
  V: { en: "Verb", ko: "동사" },
} as const;

const hebrewParticleLabels = {
  c: { en: "Direct object marker", ko: "목적격 표지" },
  d: { en: "Definite article", ko: "관사" },
  o: { en: "Object indicator", ko: "목적격 표지" },
} as const;

const hebrewGenderLabels = {
  b: { en: "Common", ko: "공성" },
  c: { en: "Common", ko: "공성" },
  f: { en: "Feminine", ko: "여성" },
  m: { en: "Masculine", ko: "남성" },
} as const;

const hebrewNumberLabels = {
  d: { en: "Dual", ko: "쌍수" },
  p: { en: "Plural", ko: "복수" },
  s: { en: "Singular", ko: "단수" },
} as const;

const hebrewStateLabels = {
  a: { en: "Absolute", ko: "절대형" },
  c: { en: "Construct", ko: "연계형" },
} as const;

const greekCaseLabels = {
  A: { en: "Accusative", ko: "목적격" },
  D: { en: "Dative", ko: "여격" },
  G: { en: "Genitive", ko: "속격" },
  N: { en: "Nominative", ko: "주격" },
  V: { en: "Vocative", ko: "호격" },
} as const;

const greekNumberLabels = {
  D: { en: "Dual", ko: "쌍수" },
  P: { en: "Plural", ko: "복수" },
  S: { en: "Singular", ko: "단수" },
} as const;

const greekGenderLabels = {
  F: { en: "Feminine", ko: "여성" },
  M: { en: "Masculine", ko: "남성" },
  N: { en: "Neuter", ko: "중성" },
} as const;

const greekTenseLabels = {
  A: { en: "Aorist", ko: "부정과거" },
  F: { en: "Future", ko: "미래" },
  I: { en: "Imperfect", ko: "미완료" },
  L: { en: "Pluperfect", ko: "과거완료" },
  P: { en: "Present", ko: "현재" },
  R: { en: "Perfect", ko: "완료" },
  "2A": { en: "Second aorist", ko: "제2부정과거" },
  "2F": { en: "Second future", ko: "제2미래" },
  "2P": { en: "Second perfect", ko: "제2완료" },
} as const;

const greekVoiceLabels = {
  A: { en: "Active voice", ko: "능동태" },
  E: { en: "Middle or passive voice", ko: "중간태 또는 수동태" },
  M: { en: "Middle voice", ko: "중간태" },
  P: { en: "Passive voice", ko: "수동태" },
} as const;

const greekMoodLabels = {
  D: { en: "Imperative mood", ko: "명령법" },
  I: { en: "Indicative mood", ko: "직설법" },
  N: { en: "Infinitive", ko: "부정사" },
  O: { en: "Optative mood", ko: "희구법" },
  P: { en: "Participle", ko: "분사" },
  S: { en: "Subjunctive mood", ko: "가정법" },
} as const;

const greekPersonLabels = {
  "1S": { en: "1st person singular", ko: "1인칭 단수" },
  "2S": { en: "2nd person singular", ko: "2인칭 단수" },
  "3S": { en: "3rd person singular", ko: "3인칭 단수" },
  "1P": { en: "1st person plural", ko: "1인칭 복수" },
  "2P": { en: "2nd person plural", ko: "2인칭 복수" },
  "3P": { en: "3rd person plural", ko: "3인칭 복수" },
} as const;

export function formatOriginalLanguageMorphology(
  morphology: string,
  locale: MorphologyLocale,
): MorphologyParseResult {
  const raw = morphology.trim();

  if (!raw) {
    return {
      raw,
      display: "",
      parts: [],
      isFallback: false,
    };
  }

  const parsed = parseKnownMorphology(raw, locale);

  if (parsed.length > 0) {
    return {
      raw,
      display: parsed.join(separator),
      parts: parsed,
      isFallback: false,
    };
  }

  return {
    raw,
    display: fallbackDisplay(raw, locale),
    parts: [fallbackDisplay(raw, locale)],
    isFallback: true,
  };
}

function parseKnownMorphology(raw: string, locale: MorphologyLocale): string[] {
  return (
    parseGreekPlainCode(raw, locale) ??
    parseGreekHyphenatedCode(raw, locale) ??
    parseHebrewCompactCode(raw, locale) ??
    []
  );
}

function parseGreekPlainCode(raw: string, locale: MorphologyLocale): string[] | null {
  const functionLabel = label(functionLabels, raw, locale);

  return functionLabel ? [functionLabel] : null;
}

function parseGreekHyphenatedCode(raw: string, locale: MorphologyLocale): string[] | null {
  const segments = raw.split("-");
  const functionCode = segments[0] ?? "";
  const functionLabel = label(functionLabels, functionCode, locale);

  if (!functionLabel || segments.length < 2) {
    return null;
  }

  if (functionCode === "V") {
    return parseGreekVerb(segments, locale, functionLabel);
  }

  if (functionCode === "N" || functionCode === "A" || functionCode === "T" || functionCode === "P") {
    const grammar = parseGreekCaseNumberGender(segments[1] ?? "", locale);

    return grammar.length > 0 ? [functionLabel, ...grammar] : null;
  }

  return [functionLabel];
}

function parseGreekVerb(
  segments: string[],
  locale: MorphologyLocale,
  functionLabel: string,
): string[] | null {
  const tenseVoiceMood = segments[1] ?? "";
  const personNumber = segments[2] ?? "";
  const tenseCode = tenseVoiceMood.startsWith("2")
    ? tenseVoiceMood.slice(0, 2)
    : tenseVoiceMood[0] ?? "";
  const voiceIndex = tenseCode.length;
  const voiceCode = tenseVoiceMood[voiceIndex] ?? "";
  const moodCode = tenseVoiceMood[voiceIndex + 1] ?? "";
  const parts = compact([
    functionLabel,
    label(greekTenseLabels, tenseCode, locale),
    label(greekVoiceLabels, voiceCode, locale),
    label(greekMoodLabels, moodCode, locale),
    label(greekPersonLabels, personNumber, locale),
  ]);

  return parts.length > 1 ? parts : null;
}

function parseGreekCaseNumberGender(code: string, locale: MorphologyLocale): string[] {
  return compact([
    label(greekGenderLabels, code[2] ?? "", locale),
    label(greekNumberLabels, code[1] ?? "", locale),
    label(greekCaseLabels, code[0] ?? "", locale),
  ]);
}

function parseHebrewCompactCode(raw: string, locale: MorphologyLocale): string[] | null {
  const code = raw.startsWith("H") || raw.startsWith("A") ? raw.slice(1) : raw;
  const functionCode = code[0] ?? "";
  const functionLabel = label(functionLabels, functionCode, locale);

  if (!functionLabel) {
    return null;
  }

  if (functionCode === "N" || functionCode === "A") {
    const grammar = parseHebrewNominalCode(code.slice(1), locale);

    return grammar.length > 0 ? [functionLabel, ...grammar] : null;
  }

  if (functionCode === "R" || functionCode === "C") {
    return [functionLabel];
  }

  if (functionCode === "T") {
    const particleLabel = label(hebrewParticleLabels, code[1] ?? "", locale);

    return particleLabel ? [particleLabel] : null;
  }

  return null;
}

function parseHebrewNominalCode(code: string, locale: MorphologyLocale): string[] {
  return compact([
    label(hebrewGenderLabels, code[1] ?? "", locale),
    label(hebrewNumberLabels, code[2] ?? "", locale),
    label(hebrewStateLabels, code[3] ?? "", locale),
  ]);
}

function fallbackDisplay(raw: string, locale: MorphologyLocale): string {
  return locale === "ko" ? `형태 코드: ${raw}` : `Morphology: ${raw}`;
}

function label<T extends Record<string, LocalizedLabel>>(
  labels: T,
  code: string,
  locale: MorphologyLocale,
): string | null {
  return labels[code]?.[locale] ?? null;
}

function compact(values: Array<string | null>): string[] {
  return values.filter((value): value is string => Boolean(value));
}

type MorphologyLocale = "en" | "ko";

type MorphologyFormatResult = {
  display: string;
  usedFallback: boolean;
};

const partOfSpeechLabels = {
  A: { en: "Adjective", ko: "형용사" },
  C: { en: "Conjunction", ko: "접속사" },
  D: { en: "Adverb", ko: "부사" },
  N: { en: "Noun", ko: "명사" },
  P: { en: "Pronoun", ko: "대명사" },
  R: { en: "Preposition", ko: "전치사" },
  T: { en: "Article", ko: "관사" },
  V: { en: "Verb", ko: "동사" },
  X: { en: "Particle", ko: "불변화사" },
} as const;

const caseLabels = {
  A: { en: "Accusative", ko: "목적격" },
  D: { en: "Dative", ko: "여격" },
  G: { en: "Genitive", ko: "소유격" },
  N: { en: "Nominative", ko: "주격" },
  V: { en: "Vocative", ko: "호격" },
} as const;

const numberLabels = {
  D: { en: "Dual", ko: "쌍수" },
  P: { en: "Plural", ko: "복수" },
  S: { en: "Singular", ko: "단수" },
} as const;

const genderLabels = {
  F: { en: "Feminine", ko: "여성" },
  M: { en: "Masculine", ko: "남성" },
  N: { en: "Neuter", ko: "중성" },
} as const;

const voiceLabels = {
  A: { en: "Active", ko: "능동태" },
  M: { en: "Middle", ko: "중간태" },
  P: { en: "Passive", ko: "수동태" },
} as const;

const moodLabels = {
  D: { en: "Imperative", ko: "명령법" },
  I: { en: "Indicative", ko: "직설법" },
  N: { en: "Infinitive", ko: "부정사" },
  O: { en: "Optative", ko: "희구법" },
  P: { en: "Participle", ko: "분사" },
  S: { en: "Subjunctive", ko: "가정법" },
} as const;

const personLabels = {
  "1S": { en: "1st Person Singular", ko: "1인칭 단수" },
  "2S": { en: "2nd Person Singular", ko: "2인칭 단수" },
  "3S": { en: "3rd Person Singular", ko: "3인칭 단수" },
  "1P": { en: "1st Person Plural", ko: "1인칭 복수" },
  "2P": { en: "2nd Person Plural", ko: "2인칭 복수" },
  "3P": { en: "3rd Person Plural", ko: "3인칭 복수" },
} as const;

export function formatMorphology(
  morphology: string,
  locale: MorphologyLocale,
): MorphologyFormatResult {
  const code = morphology.trim();

  if (!code) {
    return { display: "", usedFallback: false };
  }

  const segments = code.split("-");
  const partOfSpeech = segments[0] ?? "";
  const labels = compact([
    lookup(partOfSpeechLabels, partOfSpeech, locale),
    ...formatBody(partOfSpeech, segments.slice(1), locale),
  ]);

  if (labels.length === 0) {
    return { display: code, usedFallback: true };
  }

  return {
    display: labels.join(" · "),
    usedFallback: false,
  };
}

function formatBody(
  partOfSpeech: string,
  segments: string[],
  locale: MorphologyLocale,
): string[] {
  if (partOfSpeech === "V") {
    return formatVerb(segments, locale);
  }

  if (partOfSpeech === "N" || partOfSpeech === "A" || partOfSpeech === "T" || partOfSpeech === "P") {
    return formatCaseNumberGender(segments[0] ?? "", locale);
  }

  return [];
}

function formatVerb(segments: string[], locale: MorphologyLocale): string[] {
  const tenseVoiceMood = segments[0] ?? "";
  const voice = tenseVoiceMood.length >= 2 ? tenseVoiceMood[1] : "";
  const mood = tenseVoiceMood.length >= 3 ? tenseVoiceMood[2] : "";
  const personNumber = segments[1] ?? "";

  return compact([
    lookup(voiceLabels, voice, locale),
    lookup(moodLabels, mood, locale),
    lookup(personLabels, personNumber, locale),
  ]);
}

function formatCaseNumberGender(code: string, locale: MorphologyLocale): string[] {
  return compact([
    lookup(genderLabels, code[2] ?? "", locale),
    lookup(numberLabels, code[1] ?? "", locale),
    lookup(caseLabels, code[0] ?? "", locale),
  ]);
}

function lookup<T extends Record<string, Record<MorphologyLocale, string>>>(
  dictionary: T,
  key: string,
  locale: MorphologyLocale,
): string | null {
  return dictionary[key]?.[locale] ?? null;
}

function compact(values: Array<string | null>): string[] {
  return values.filter((value): value is string => Boolean(value));
}

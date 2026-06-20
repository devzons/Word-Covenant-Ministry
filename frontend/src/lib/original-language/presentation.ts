import type {
  HighLevelInterlinearToken,
  OriginalLanguageJoinedOccurrence,
  OriginalLanguageTerm,
} from "@/types/original-language";

type PresentationToken = Pick<
  HighLevelInterlinearToken | OriginalLanguageJoinedOccurrence,
  "token_type" | "surface_form" | "morphology"
> & {
  term: Pick<OriginalLanguageTerm, "lemma" | "gloss" | "strongs_number" | "strongs_extended">;
};

const punctuationSurfaceForms = new Set(["־", "׃", ":", ";"]);

export function shouldDisplayOriginalLanguageToken(token: PresentationToken): boolean {
  if (isPunctuationOrLinkMarker(token)) {
    return false;
  }

  if (isPseudoMorphologyTerm(token.term.lemma)) {
    return false;
  }

  return true;
}

function isPunctuationOrLinkMarker(token: PresentationToken): boolean {
  const tokenType = token.token_type.toLowerCase();

  return (
    tokenType === "punctuation" ||
    punctuationSurfaceForms.has(token.surface_form.trim()) ||
    token.term.gloss === "verseEnd"
  );
}

function isPseudoMorphologyTerm(lemma: string): boolean {
  return /^[OP]s[123][mfc]$/i.test(lemma.trim());
}

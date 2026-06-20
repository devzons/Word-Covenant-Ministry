import assert from "node:assert/strict";
import test from "node:test";

import { formatOriginalLanguageMorphology } from "./morphology.ts";

test("formats Hebrew nominal morphology in Korean", () => {
  assert.equal(
    formatOriginalLanguageMorphology("Ncfsa", "ko").display,
    "명사 · 여성 · 단수 · 절대형",
  );
  assert.equal(
    formatOriginalLanguageMorphology("Ncmsc", "ko").display,
    "명사 · 남성 · 단수 · 연계형",
  );
});

test("formats Hebrew nominal morphology in English", () => {
  assert.equal(
    formatOriginalLanguageMorphology("Ncfsa", "en").display,
    "Noun · Feminine · Singular · Absolute",
  );
  assert.equal(
    formatOriginalLanguageMorphology("HNcmsc", "en").display,
    "Noun · Masculine · Singular · Construct",
  );
});

test("formats high-frequency Hebrew function codes", () => {
  assert.equal(formatOriginalLanguageMorphology("HR", "ko").display, "전치사");
  assert.equal(formatOriginalLanguageMorphology("HC", "ko").display, "접속사");
  assert.equal(formatOriginalLanguageMorphology("HTd", "ko").display, "관사");
  assert.equal(formatOriginalLanguageMorphology("HTo", "ko").display, "목적격 표지");
});

test("formats Greek noun morphology in Korean", () => {
  assert.equal(
    formatOriginalLanguageMorphology("N-NSF", "ko").display,
    "명사 · 여성 · 단수 · 주격",
  );
  assert.equal(
    formatOriginalLanguageMorphology("N-GSM", "ko").display,
    "명사 · 남성 · 단수 · 속격",
  );
});

test("formats Greek verb morphology in Korean", () => {
  assert.equal(
    formatOriginalLanguageMorphology("V-AAI-3S", "ko").display,
    "동사 · 부정과거 · 능동태 · 직설법 · 3인칭 단수",
  );
  assert.equal(
    formatOriginalLanguageMorphology("V-PAI-1S", "ko").display,
    "동사 · 현재 · 능동태 · 직설법 · 1인칭 단수",
  );
});

test("formats Greek morphology in English", () => {
  assert.equal(
    formatOriginalLanguageMorphology("N-GSM", "en").display,
    "Noun · Masculine · Singular · Genitive",
  );
  assert.equal(
    formatOriginalLanguageMorphology("V-PAI-1S", "en").display,
    "Verb · Present · Active voice · Indicative mood · 1st person singular",
  );
});

test("formats high-frequency Greek function codes", () => {
  assert.equal(formatOriginalLanguageMorphology("CONJ", "ko").display, "접속사");
  assert.equal(formatOriginalLanguageMorphology("PREP", "ko").display, "전치사");
  assert.equal(formatOriginalLanguageMorphology("PRT-N", "en").display, "Negative particle");
});

test("falls back without guessing unknown codes", () => {
  assert.deepEqual(formatOriginalLanguageMorphology("XYZ", "ko"), {
    raw: "XYZ",
    display: "형태 코드: XYZ",
    parts: ["형태 코드: XYZ"],
    isFallback: true,
  });
  assert.deepEqual(formatOriginalLanguageMorphology("XYZ", "en"), {
    raw: "XYZ",
    display: "Morphology: XYZ",
    parts: ["Morphology: XYZ"],
    isFallback: true,
  });
});

test("suppresses empty morphology display", () => {
  assert.deepEqual(formatOriginalLanguageMorphology("   ", "ko"), {
    raw: "",
    display: "",
    parts: [],
    isFallback: false,
  });
});

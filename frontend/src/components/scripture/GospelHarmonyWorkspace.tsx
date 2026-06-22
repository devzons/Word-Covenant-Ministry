export type GospelHarmonyPassage = {
  book: string;
  startChapter: number;
  startVerse: number;
  endChapter: number;
  endVerse: number;
};

export type GospelHarmonyUnit = {
  id: string;
  title: { ko: string; en: string };
  passages: {
    matthew?: GospelHarmonyPassage;
    mark?: GospelHarmonyPassage;
    luke?: GospelHarmonyPassage;
    john?: GospelHarmonyPassage;
  };
};

type GospelHarmonyWorkspaceProps = {
  locale: "en" | "ko";
};

const gospelHarmonyCopy = {
  en: {
    title: "Gospel Harmony",
    eyebrow: "Scripture Study",
    description: "A study tool for comparing Matthew, Mark, and Luke in parallel by event unit.",
    preparing: "Preparing",
    emptyTitle: "Harmony units are being prepared.",
    emptyBody:
      "This first foundation does not include harmony-unit data yet. Future units will store passage references only and load Bible text from the selected Bible version API.",
    columns: {
      matthew: "Matthew",
      mark: "Mark",
      luke: "Luke",
    },
  },
  ko: {
    title: "복음서 대조서",
    eyebrow: "성경 연구",
    description: "마태·마가·누가복음을 사건 단위로 병행 비교하는 연구 도구입니다.",
    preparing: "준비 중",
    emptyTitle: "복음서 대조 단위를 준비하고 있습니다.",
    emptyBody:
      "이번 1차 기반에는 harmony unit 데이터를 넣지 않습니다. 이후 대조 단위는 본문을 저장하지 않고 책/장/절 범위만 저장하며, 본문은 선택된 성경 번역 API에서 불러옵니다.",
    columns: {
      matthew: "마태복음",
      mark: "마가복음",
      luke: "누가복음",
    },
  },
};

const gospelColumns = ["matthew", "mark", "luke"] as const;

// Gospel Harmony units must store references only, never copied Bible text.
// Runtime text should be loaded from the selected Bible version API:
// KRV now, with WEB support planned for Phase 9.
const harmonyUnits: GospelHarmonyUnit[] = [];

export function GospelHarmonyWorkspace({ locale }: GospelHarmonyWorkspaceProps) {
  const copy = gospelHarmonyCopy[locale];

  return (
    <section className="flex flex-col gap-8 py-12 sm:py-16">
      <div className="flex max-w-3xl flex-col gap-3">
        <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
          {copy.eyebrow}
        </p>
        <h1 className="text-3xl font-semibold text-zinc-950 sm:text-4xl">
          {copy.title}
        </h1>
        <p className="text-base leading-7 text-zinc-600">{copy.description}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {gospelColumns.map((column) => (
          <section
            className="min-h-56 rounded-md border border-zinc-200 bg-white p-4"
            key={column}
          >
            <div className="flex items-center justify-between gap-3 border-b border-zinc-200 pb-3">
              <h2 className="text-lg font-semibold text-zinc-950">
                {copy.columns[column]}
              </h2>
              <span className="rounded-sm bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-600">
                {copy.preparing}
              </span>
            </div>

            {harmonyUnits.length === 0 ? (
              <div className="mt-5 flex flex-col gap-2 text-sm text-zinc-600">
                <p className="font-semibold text-zinc-800">{copy.emptyTitle}</p>
                <p className="leading-6">{copy.emptyBody}</p>
              </div>
            ) : null}
          </section>
        ))}
      </div>
    </section>
  );
}

import Link from "next/link";

type HomePageProps = {
  locale: string;
};

const homeCopy = {
  en: {
    eyebrow: "Scripture Reader",
    title: "Word Covenant Ministry",
    subtitle: "Christ-centered Scripture reading and biblical study",
    description:
      "Read Scripture, search the Bible, and study original-language details from a focused ministry platform.",
    ctas: {
      read: "Read Scripture",
      search: "Search Scripture",
      sermons: "Browse Sermons",
    },
    featuresTitle: "Study tools",
    features: [
      {
        title: "Bible Reader",
        body: "Read KRV chapters with reader, original, and interlinear modes.",
      },
      {
        title: "Bible Search",
        body: "Search Scripture text and open results directly in the reader.",
      },
      {
        title: "Original Language",
        body: "Open verse-level Hebrew and Greek previews from the Bible reader.",
      },
      {
        title: "Sermons",
        body: "A sermon archive foundation is prepared for future ministry content.",
      },
    ],
    originalTitle: "Original-language reader",
    originalItems: [
      "Original Mode",
      "Interlinear Mode",
      "Original Word Panel",
      "Strong Study",
    ],
    startTitle: "Start with Scripture",
    startItems: ["Read", "Search", "Study the original language"],
  },
  ko: {
    eyebrow: "성경 읽기",
    title: "Word Covenant Ministry",
    subtitle: "그리스도 중심의 성경 읽기와 말씀 연구",
    description: "성경을 읽고, 말씀을 검색하며, 원어 정보를 함께 살펴볼 수 있는 사역 플랫폼입니다.",
    ctas: {
      read: "성경 읽기",
      search: "성경 검색",
      sermons: "설교 보기",
    },
    featuresTitle: "말씀 연구 도구",
    features: [
      {
        title: "성경 읽기",
        body: "KRV 본문을 일반, 원어, 인터리니어 모드로 읽을 수 있습니다.",
      },
      {
        title: "성경 검색",
        body: "성경 본문을 검색하고 결과를 바로 리더에서 열 수 있습니다.",
      },
      {
        title: "원어 연구",
        body: "성경 리더에서 히브리어와 헬라어 정보를 절별로 확인합니다.",
      },
      {
        title: "설교",
        body: "향후 사역 콘텐츠를 위한 설교 아카이브 기반을 준비하고 있습니다.",
      },
    ],
    originalTitle: "원어 리더",
    originalItems: ["원어 모드", "행간 보기", "원어 단어 패널", "스트롱 연구"],
    startTitle: "말씀으로 시작하기",
    startItems: ["읽기", "검색", "원어 연구"],
  },
};

export function HomePage({ locale }: HomePageProps) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const copy = homeCopy[activeLocale];

  return (
    <div className="flex flex-col gap-14 py-10 sm:py-14">
      <section className="grid gap-8 border-b border-zinc-200 pb-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
        <div className="flex max-w-3xl flex-col gap-5">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
            {copy.eyebrow}
          </p>
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-semibold text-zinc-950 sm:text-5xl">{copy.title}</h1>
            <p className="text-xl leading-8 text-zinc-700">{copy.subtitle}</p>
          </div>
          <p className="max-w-2xl text-base leading-7 text-zinc-600">{copy.description}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
              href={`/${activeLocale}/bible/KRV/genesis/1`}
            >
              {copy.ctas.read}
            </Link>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
              href={`/${activeLocale}/bible/search`}
            >
              {copy.ctas.search}
            </Link>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
              href={`/${activeLocale}/sermons`}
            >
              {copy.ctas.sermons}
            </Link>
          </div>
        </div>
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-5">
          <p className="text-sm font-semibold text-zinc-950">{copy.startTitle}</p>
          <ol className="mt-4 grid gap-3 text-sm text-zinc-700">
            {copy.startItems.map((item, index) => (
              <li className="flex items-center gap-3" key={item}>
                <span className="flex size-7 items-center justify-center rounded-full bg-white text-xs font-semibold text-zinc-700 ring-1 ring-zinc-200">
                  {index + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="text-2xl font-semibold text-zinc-950">{copy.featuresTitle}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {copy.features.map((feature) => (
            <article className="rounded-md border border-zinc-200 bg-white p-5" key={feature.title}>
              <h3 className="text-base font-semibold text-zinc-950">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-md border border-zinc-200 bg-zinc-50 p-6">
        <h2 className="text-2xl font-semibold text-zinc-950">{copy.originalTitle}</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {copy.originalItems.map((item) => (
            <div className="rounded-md border border-zinc-200 bg-white p-4 text-sm font-semibold text-zinc-800" key={item}>
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

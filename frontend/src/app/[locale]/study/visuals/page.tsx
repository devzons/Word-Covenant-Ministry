import Link from "next/link";

import { siteConfig } from "@/config/site";
import { buildStudyIndexHref } from "@/lib/utils/study-library";

type StudyVisualsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const copy = {
  en: {
    title: "Visual Research Resources",
    body: "This foundation route prepares the study hub for maps, timelines, genealogies, temple diagrams, and structure charts that will connect back to Scripture and related study content.",
    back: "Back to Study Hub",
    pending: "In preparation",
    sections: [
      {
        title: "Bible Maps",
        body: "Location-aware study resources will connect places, journeys, and related passages.",
      },
      {
        title: "Historical Timelines",
        body: "Timeline views will connect dates, kingdoms, prophets, and redemptive-history milestones.",
      },
      {
        title: "People & Genealogies",
        body: "Genealogical and person-based diagrams will support family, covenant, and lineage research.",
      },
      {
        title: "Tabernacle & Temple",
        body: "Temple and tabernacle study visuals will connect structure, service, and Scripture references.",
      },
      {
        title: "Charts & Structures",
        body: "Literary structures, comparison tables, and study diagrams will be published as data-backed visuals later.",
      },
    ],
  },
  ko: {
    title: "시각 연구 자료",
    body: "이 foundation route는 성경 지도, 연대표, 족보, 성막·성전 도표, 구조 차트를 성경 본문과 관련 연구 자료에 연결하기 위한 진입 기반입니다.",
    back: "말씀연구 허브로 돌아가기",
    pending: "준비 중",
    sections: [
      {
        title: "성경 지도",
        body: "장소, 이동 경로, 관련 본문을 연결하는 지도형 연구 자료를 위한 영역입니다.",
      },
      {
        title: "역사 연대표",
        body: "시대, 왕국, 선지자, 구속사 흐름을 시간 축으로 연결하는 연대표형 자료를 위한 영역입니다.",
      },
      {
        title: "인물과 족보",
        body: "가계, 언약 계보, 인물 연결 구조를 연구하는 시각 자료를 위한 영역입니다.",
      },
      {
        title: "성막과 성전",
        body: "성막과 성전 구조, 섬김, 관련 본문을 연결하는 시각 자료를 위한 영역입니다.",
      },
      {
        title: "도표와 구조",
        body: "문학 구조, 비교 도표, 연구용 구조 차트를 데이터 기반으로 연결할 예정입니다.",
      },
    ],
  },
} as const;

export const dynamic = "force-dynamic";

export default async function StudyVisualsPage({ params }: StudyVisualsPageProps) {
  const { locale } = await params;
  const activeLocale = getSupportedLocale(locale);
  const pageCopy = copy[activeLocale];

  return (
    <section className="flex min-w-0 flex-col gap-8 py-10 sm:py-12">
      <div className="rounded-md border border-zinc-200 bg-white p-6 sm:p-8">
        <div className="flex max-w-4xl flex-col gap-5">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
            Word Covenant Ministry
          </p>
          <h1 className="text-3xl font-semibold text-zinc-950 sm:text-4xl">{pageCopy.title}</h1>
          <p className="text-base leading-7 text-zinc-600">{pageCopy.body}</p>
          <div>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
              href={`/${activeLocale}/study`}
            >
              {pageCopy.back}
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {pageCopy.sections.map((section) => (
          <article className="rounded-md border border-zinc-200 bg-white p-5" key={section.title}>
            <div className="flex h-full flex-col gap-4">
              <span className="inline-flex w-fit rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                {pageCopy.pending}
              </span>
              <h2 className="text-xl font-semibold text-zinc-950">{section.title}</h2>
              <p className="text-sm leading-7 text-zinc-600">{section.body}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="rounded-md border border-zinc-200 bg-zinc-50 p-6">
        <p className="text-sm leading-7 text-zinc-600">
          {activeLocale === "en"
            ? "Visual resources are not published as a separate data model yet. This route only establishes the study-hub entry point and the future information structure."
            : "시각 연구 자료는 아직 별도 데이터 모델로 공개되지 않았습니다. 이번 route는 말씀연구 허브 진입점과 향후 정보구조만 먼저 마련합니다."}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
            href={buildStudyIndexHref(activeLocale, "sermons")}
          >
            {activeLocale === "en" ? "Open sermons & exposition" : "설교와 강해 보기"}
          </Link>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
            href={buildStudyIndexHref(activeLocale, "publications")}
          >
            {activeLocale === "en" ? "Open books & research papers" : "책과 연구논문 보기"}
          </Link>
        </div>
      </div>
    </section>
  );
}

function getSupportedLocale(locale: string): "en" | "ko" {
  return siteConfig.supportedLocales.includes(
    locale as (typeof siteConfig.supportedLocales)[number],
  ) && locale === "en"
    ? "en"
    : "ko";
}

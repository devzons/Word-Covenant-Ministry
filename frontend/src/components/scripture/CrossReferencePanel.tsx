"use client";

type CrossReferencePanelProps = {
  locale: string;
};

const relationshipTypes = [
  "quotation",
  "allusion",
  "parallel_event",
  "theme",
  "prophecy_fulfillment",
  "typology",
];

const crossReferencePanelCopy = {
  en: {
    title: "Cross References",
    description:
      "Cross references are being prepared. This layer will store reference ranges and relationship types, not Bible text.",
    relationshipTypes: "Future relationship types",
  },
  ko: {
    title: "교차 참조",
    description:
      "교차 참조는 준비 중입니다. 이 레이어는 성경 본문을 저장하지 않고 참조 범위와 관계 유형만 사용합니다.",
    relationshipTypes: "향후 관계 유형",
  },
};

export function CrossReferencePanel({ locale }: CrossReferencePanelProps) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const copy = crossReferencePanelCopy[activeLocale];

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-zinc-950">{copy.title}</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600">{copy.description}</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
          {copy.relationshipTypes}
        </h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {relationshipTypes.map((relationshipType) => (
            <li
              className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-600"
              key={relationshipType}
            >
              {relationshipType}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

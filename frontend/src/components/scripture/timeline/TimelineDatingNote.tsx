"use client";

type TimelineDatingNoteProps = {
  label: string;
  locale: "en" | "ko";
  note: string;
};

export function TimelineDatingNote({ label, locale, note }: TimelineDatingNoteProps) {
  return (
    <div className="mt-2 space-y-1.5 rounded-md border border-zinc-200 bg-white p-3 text-[12px] leading-5 text-zinc-600">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-700">{label}</p>
      <p>{note}</p>
      <p className="text-zinc-500">
        {locale === "ko"
          ? "세계사 Overlay는 이후 승인 단계에서 다룹니다."
          : "World-history overlay is deferred to a later approved phase."}
      </p>
    </div>
  );
}

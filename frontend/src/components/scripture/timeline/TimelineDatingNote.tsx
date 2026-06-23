"use client";

type TimelineDatingNoteProps = {
  label: string;
  locale: "en" | "ko";
  note: string;
};

export function TimelineDatingNote({ label, locale, note }: TimelineDatingNoteProps) {
  return (
    <div className="mt-2 space-y-1 text-[11px] leading-5 text-zinc-500">
      <p className="font-semibold text-zinc-600">{label}</p>
      <p>{note}</p>
      <p>{locale === "ko" ? "세계사 Overlay는 이후 승인 단계에서 다룹니다." : "World-history overlay is deferred to a later approved phase."}</p>
    </div>
  );
}

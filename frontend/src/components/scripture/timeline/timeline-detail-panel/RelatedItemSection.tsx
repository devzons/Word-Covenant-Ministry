import type { ReactNode } from "react";

type RelatedItemSectionProps = {
  children: ReactNode;
  label: string;
};

export function RelatedItemSection({ children, label }: RelatedItemSectionProps) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

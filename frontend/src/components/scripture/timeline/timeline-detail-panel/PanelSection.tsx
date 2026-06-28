import type { ReactNode } from "react";

type PanelSectionProps = {
  children: ReactNode;
  label: string;
};

export function PanelSection({ children, label }: PanelSectionProps) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">{label}</p>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}

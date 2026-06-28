import type { ReactNode } from "react";

type SectionNoteProps = {
  children: ReactNode;
};

export function SectionNote({ children }: SectionNoteProps) {
  return <p className="text-sm leading-6 text-zinc-600">{children}</p>;
}

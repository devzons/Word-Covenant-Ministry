import { cn } from "@/lib/utils/cn";

type RelatedItemButtonProps = {
  active?: boolean;
  eyebrow: string;
  label: string;
  onClick: () => void;
};

export function RelatedItemButton({ active = false, eyebrow, label, onClick }: RelatedItemButtonProps) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "inline-flex cursor-pointer flex-col items-start rounded-md border px-3 py-2 text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
        active
          ? "border-zinc-300 bg-zinc-100 text-zinc-950"
          : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-white",
      )}
      onClick={onClick}
      type="button"
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500">{eyebrow}</span>
      <span className="mt-1 text-sm font-medium leading-5">{label}</span>
    </button>
  );
}

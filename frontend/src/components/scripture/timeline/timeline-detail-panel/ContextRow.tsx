type ContextRowProps = {
  label: string;
  value: string;
};

export function ContextRow({ label, value }: ContextRowProps) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">{label}</p>
      <p className="text-sm leading-6 text-zinc-600">{value}</p>
    </div>
  );
}

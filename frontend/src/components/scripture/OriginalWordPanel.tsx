"use client";

export type OriginalWordPanelWord = {
  surface_form: string;
  lemma: string;
  strongs_number: string;
  strongs_extended: string;
  transliteration: string;
  gloss: string | null;
  morphology: string;
};

type OriginalWordPanelProps = {
  word: OriginalWordPanelWord | null;
  onClose: () => void;
};

export function OriginalWordPanel({ word, onClose }: OriginalWordPanelProps) {
  if (!word) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close original word panel"
        className="absolute inset-0 bg-zinc-950/30"
        onClick={onClose}
        type="button"
      />
      <aside
        aria-label="Original word details"
        className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-lg bg-white p-5 shadow-2xl sm:inset-x-auto sm:bottom-0 sm:right-0 sm:top-0 sm:h-full sm:max-h-none sm:w-96 sm:rounded-none sm:border-l sm:border-zinc-200"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
              Original Word
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
              {word.surface_form}
            </h2>
          </div>
          <button
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        <dl className="mt-5 grid gap-4 text-sm">
          <PanelField label="Lemma" value={word.lemma} />
          <PanelField label="Strong's" value={word.strongs_number} />
          <PanelField label="Strong's Extended" value={word.strongs_extended} />
          <PanelField label="Transliteration" value={word.transliteration} />
          <PanelField label="Gloss" value={word.gloss || "Not provided"} />
          <PanelField label="Morphology" value={word.morphology || "Not provided"} />
        </dl>
      </aside>
    </div>
  );
}

function PanelField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-zinc-500">{label}</dt>
      <dd className="mt-1 break-words text-base text-zinc-950">{value}</dd>
    </div>
  );
}

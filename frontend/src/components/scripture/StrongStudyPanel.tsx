"use client";

import { useEffect, useState } from "react";

import { getWordStudyStrong } from "@/lib/api/original-language";
import type { WordStudyStrongsResponse } from "@/types/original-language";

type StrongStudyPanelProps = {
  strongsNumber: string;
  onBack: () => void;
};

export function StrongStudyPanel({ strongsNumber, onBack }: StrongStudyPanelProps) {
  const [data, setData] = useState<WordStudyStrongsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadStrongStudy() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getWordStudyStrong(strongsNumber);

        if (isCurrent) {
          setData(response);
        }
      } catch {
        if (isCurrent) {
          setErrorMessage("Strong study could not be loaded.");
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    void loadStrongStudy();

    return () => {
      isCurrent = false;
    };
  }, [strongsNumber]);

  return (
    <div>
      <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
            Strong Study
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
            {strongsNumber}
          </h2>
        </div>
        <button
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
          onClick={onBack}
          type="button"
        >
          Back
        </button>
      </div>

      <div className="mt-5">{renderStrongStudyState({ data, errorMessage, isLoading })}</div>
    </div>
  );
}

function renderStrongStudyState({
  data,
  errorMessage,
  isLoading,
}: {
  data: WordStudyStrongsResponse | null;
  errorMessage: string;
  isLoading: boolean;
}) {
  if (isLoading) {
    return <p className="text-sm text-zinc-600">Loading Strong study...</p>;
  }

  if (errorMessage) {
    return <p className="text-sm text-red-700">{errorMessage}</p>;
  }

  if (!data) {
    return <p className="text-sm text-zinc-600">No Strong study loaded.</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      <dl className="grid gap-3 text-sm">
        <SummaryField label="Strong's Number" value={data.strongs_number} />
        <SummaryField label="Language" value={data.language_type} />
        <SummaryField label="Total Terms" value={data.total_terms.toLocaleString()} />
        <SummaryField
          label="Total Occurrences"
          value={data.total_occurrences.toLocaleString()}
        />
      </dl>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
          Grouped Terms
        </h3>
        {data.terms_by_extended.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {data.terms_by_extended.map((group) => (
              <li
                className="rounded-md border border-zinc-200 bg-zinc-50 p-3"
                key={group.strongs_extended}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-zinc-950">
                    {group.strongs_extended}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {group.term_count.toLocaleString()} terms
                  </p>
                </div>

                <ul className="mt-3 flex flex-col gap-2">
                  {group.terms.map((term) => (
                    <li
                      className="rounded border border-zinc-200 bg-white p-2"
                      key={term.id}
                    >
                      <p className="font-semibold text-zinc-950">{term.lemma}</p>
                      <p className="text-sm text-zinc-600">{term.transliteration}</p>
                      {term.gloss ? (
                        <p className="mt-1 text-sm text-zinc-800">{term.gloss}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-600">No grouped terms returned.</p>
        )}
      </div>
    </div>
  );
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-zinc-500">{label}</dt>
      <dd className="mt-1 text-base text-zinc-950">{value}</dd>
    </div>
  );
}

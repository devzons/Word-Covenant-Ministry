import Link from "next/link";

import { cn } from "@/lib/utils/cn";

import {
  getTimelineReaderHrefFromReader,
  getTimelineText,
  type PassionWeekTimelineEvent,
  type TimelineLocale,
} from "../passionWeekTimeline";
import { PanelSection } from "./PanelSection";
import { SectionNote } from "./SectionNote";

type ScriptureAnchorListProps = {
  anchors: PassionWeekTimelineEvent["scriptureAnchors"];
  locale: TimelineLocale;
  openInReaderLabel: string;
  rowId: string;
};

export function ScriptureAnchorList({ anchors, locale, openInReaderLabel, rowId }: ScriptureAnchorListProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {anchors.map((anchor) => (
        <Link
          className={cn(
            "inline-flex min-h-8 items-center rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold leading-none text-zinc-900 transition-colors hover:border-zinc-300 hover:bg-zinc-50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
          )}
          href={getTimelineReaderHrefFromReader(anchor.reader, locale)}
          onClick={(event) => event.stopPropagation()}
          key={`${rowId}-${anchor.label.en}-${anchor.reader.book}-${anchor.reader.chapter}-${anchor.reader.verse}`}
        >
          {getTimelineText(anchor.label, locale)}
        </Link>
      ))}
      {anchors.length ? (
        <Link
          className={cn(
            "ml-1 inline-flex min-h-8 items-center rounded-full border border-dashed border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold leading-none text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
          )}
          href={getTimelineReaderHrefFromReader(anchors[0].reader, locale)}
          onClick={(event) => event.stopPropagation()}
        >
          {openInReaderLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function ReferenceOnlyAnchorList({
  anchors,
  locale,
}: {
  anchors: PassionWeekTimelineEvent["scriptureAnchors"];
  locale: TimelineLocale;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {anchors.map((anchor) => (
        <span
          className="inline-flex min-h-8 items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold leading-none text-zinc-700"
          key={`${anchor.label.en}-${anchor.reader.book}-${anchor.reader.chapter}-${anchor.reader.verse}`}
        >
          {getTimelineText(anchor.label, locale)}
        </span>
      ))}
    </div>
  );
}

type ScriptureAnchorsSectionProps = {
  anchors: PassionWeekTimelineEvent["scriptureAnchors"];
  label: string;
  locale: TimelineLocale;
  openInReaderLabel: string;
  referenceOnly?: boolean;
  referenceOnlyDescription?: string;
  rowId: string;
};

export function ScriptureAnchorsSection({
  anchors,
  label,
  locale,
  openInReaderLabel,
  referenceOnly = false,
  referenceOnlyDescription,
  rowId,
}: ScriptureAnchorsSectionProps) {
  return (
    <PanelSection label={label}>
      {referenceOnly ? (
        <>
          <ReferenceOnlyAnchorList anchors={anchors} locale={locale} />
          {referenceOnlyDescription ? <SectionNote>{referenceOnlyDescription}</SectionNote> : null}
        </>
      ) : (
        <ScriptureAnchorList anchors={anchors} locale={locale} openInReaderLabel={openInReaderLabel} rowId={rowId} />
      )}
    </PanelSection>
  );
}

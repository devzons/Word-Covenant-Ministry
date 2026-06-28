import { getTimelineText, type TimelineLocale, type TimelineText } from "../passionWeekTimeline";
import { Tag } from "./Tag";

type ContextTagGroupProps = {
  label: string;
  locale: TimelineLocale;
  tags?: TimelineText[];
};

export function ContextTagGroup({ label, locale, tags }: ContextTagGroupProps) {
  if (!tags?.length) {
    return null;
  }

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Tag key={`${label}-${tag.en}-${tag.ko}`}>{getTimelineText(tag, locale)}</Tag>
        ))}
      </div>
    </div>
  );
}

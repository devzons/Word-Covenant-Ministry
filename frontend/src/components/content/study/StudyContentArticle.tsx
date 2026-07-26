import Link from "next/link";

type StudyContentArticleProps = {
  badge: string;
  breadcrumb: string[];
  categoryLabel: string;
  contentHtml: string;
  dateLabel: string;
  emptyBody: string;
  excerpt: string;
  metaValue: string;
  openArchiveHref: string;
  openArchiveLabel: string;
  openSourceHref: string;
  openSourceLabel: string;
  previousHref: string | null;
  previousLabel: string;
  previousTitle: string | null;
  subtitle: string;
  title: string;
  nextHref: string | null;
  nextLabel: string;
  nextTitle: string | null;
};

export function StudyContentArticle({
  badge,
  breadcrumb,
  categoryLabel,
  contentHtml,
  dateLabel,
  emptyBody,
  excerpt,
  metaValue,
  openArchiveHref,
  openArchiveLabel,
  openSourceHref,
  openSourceLabel,
  previousHref,
  previousLabel,
  previousTitle,
  subtitle,
  title,
  nextHref,
  nextLabel,
  nextTitle,
}: StudyContentArticleProps) {
  return (
    <article className="flex min-w-0 flex-col gap-6">
      <header className="rounded-md border border-zinc-200 bg-white p-6">
        <div className="flex flex-col gap-4">
          <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-xs font-medium uppercase tracking-[0.08em] text-zinc-500">
            {breadcrumb.map((item, index) => (
              <span className="flex items-center gap-2" key={`${item}-${index}`}>
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                <span>{item}</span>
              </span>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
              {badge}
            </span>
            <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
              {categoryLabel}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-semibold text-zinc-950 sm:text-4xl">{title}</h1>
            {subtitle !== "" ? <p className="text-base leading-7 text-zinc-600">{subtitle}</p> : null}
            {excerpt !== "" ? (
              <div
                className="max-w-4xl text-sm leading-7 text-zinc-600 [&_p]:m-0"
                dangerouslySetInnerHTML={{ __html: excerpt }}
              />
            ) : null}
          </div>

          <dl className="grid gap-3 text-sm text-zinc-600 sm:grid-cols-2">
            <div className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                {dateLabel}
              </dt>
              <dd className="mt-1 text-sm font-medium text-zinc-900">{metaValue}</dd>
            </div>
            <div className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                {categoryLabel}
              </dt>
              <dd className="mt-1 text-sm font-medium text-zinc-900">{badge}</dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-3">
            <Link
              className="inline-flex min-h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
              href={openArchiveHref}
            >
              {openArchiveLabel}
            </Link>
            <a
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
              href={openSourceHref}
            >
              {openSourceLabel}
            </a>
          </div>

          {previousHref || nextHref ? (
            <div className="grid gap-3 border-t border-zinc-200 pt-4 sm:grid-cols-2">
              {previousHref ? (
                <Link
                  className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 transition-colors hover:bg-zinc-100"
                  href={previousHref}
                >
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                    {previousLabel}
                  </span>
                  <span className="mt-1 block font-medium text-zinc-950">{previousTitle}</span>
                </Link>
              ) : (
                <div />
              )}
              {nextHref ? (
                <Link
                  className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 transition-colors hover:bg-zinc-100"
                  href={nextHref}
                >
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                    {nextLabel}
                  </span>
                  <span className="mt-1 block font-medium text-zinc-950">{nextTitle}</span>
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </header>

      <div className="rounded-md border border-zinc-200 bg-white p-6">
        {contentHtml !== "" ? (
          <div
            className="max-w-4xl text-base leading-8 text-zinc-800 [&_.wp-block-heading]:mt-8 [&_.wp-block-heading]:text-2xl [&_.wp-block-heading]:font-semibold [&_.wp-block-list]:my-5 [&_.wp-block-list]:pl-6 [&_.wp-block-paragraph]:my-5 [&_.wp-block-quote]:my-6 [&_.wp-block-quote]:border-l-4 [&_.wp-block-quote]:border-zinc-300 [&_.wp-block-quote]:pl-4 [&_a]:text-zinc-900 [&_a]:underline [&_a]:underline-offset-4"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        ) : (
          <p className="max-w-3xl text-base leading-8 text-zinc-600">{emptyBody}</p>
        )}
      </div>
    </article>
  );
}

import Link from "next/link";

type HomePageProps = {
  locale: string;
};

export function HomePage({ locale }: HomePageProps) {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 py-12 sm:py-16">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
          Scripture Reader
        </p>
        <h1 className="text-3xl font-semibold text-zinc-950 sm:text-4xl">
          Word Covenant Ministry
        </h1>
        <p className="max-w-2xl text-base leading-7 text-zinc-600">
          Read Scripture, search KRV text, and open original-language study tools
          from the Bible reader.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          className="rounded-md border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
          href={`/${locale}/bible/KRV/genesis/1`}
        >
          <span className="block text-base font-semibold text-zinc-950">
            Open Bible Reader
          </span>
          <span className="mt-2 block text-sm leading-6 text-zinc-600">
            Start at Genesis 1 with reader, original, and interlinear modes.
          </span>
        </Link>
        <Link
          className="rounded-md border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
          href={`/${locale}/bible/search`}
        >
          <span className="block text-base font-semibold text-zinc-950">
            Search Scripture
          </span>
          <span className="mt-2 block text-sm leading-6 text-zinc-600">
            Search KRV text through the Scripture search page.
          </span>
        </Link>
      </div>
    </section>
  );
}

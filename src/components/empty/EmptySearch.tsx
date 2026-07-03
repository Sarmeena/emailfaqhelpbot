"use client";

import Image from "next/image";

export default function EmptySearch() {
  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-col items-center text-center">
        {/* Illustration */}
        <div className="mb-md flex h-48 w-48 items-center justify-center rounded-xl bg-surface-container-low">
          <Image
            src="/empty/empty-search.png"
            alt="No Search Results"
            width={140}
            height={140}
            className="object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="mb-sm text-headline-md font-semibold text-on-surface">
          No Matches Found
        </h2>

        {/* Description */}
        <p className="mb-lg max-w-md text-body-md text-on-surface-variant">
          We could not find anything matching your search. Try different
          keywords, check for typos, or reset your filters to see more results.
        </p>

        {/* CTA */}
        <button className="rounded-lg bg-surface-variant px-lg py-3 text-label-md text-on-surface-variant transition-all hover:bg-outline-variant active:scale-95">
          Clear Search
        </button>
      </div>
    </section>
  );
}
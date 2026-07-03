"use client";

import Image from "next/image";

export default function EmptyRequests() {
  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-col items-center text-center">
        {/* Illustration */}
        <div className="mb-md flex h-48 w-48 items-center justify-center rounded-full bg-surface-container">
          <Image
            src="/empty/empty-inbox.png"
            alt="No Requests"
            width={140}
            height={140}
            className="object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="mb-sm text-headline-md font-semibold text-on-surface">
          No Requests Found
        </h2>

        {/* Description */}
        <p className="mb-lg max-w-md text-body-md text-on-surface-variant">
          Your inbox is waiting for new messages. New support requests from
          your customers will appear here once they start reaching out.
        </p>

        {/* CTA */}
        <button className="rounded-lg bg-primary px-lg py-3 text-label-md text-on-primary shadow-md transition hover:bg-primary-container active:scale-95">
          Create Request
        </button>
      </div>
    </section>
  );
}
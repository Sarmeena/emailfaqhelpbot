"use client";

import Image from "next/image";

export default function EmptyFAQ() {
  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-col items-center text-center">
        {/* Illustration */}
        <div className="mb-md flex h-48 w-48 items-center justify-center rounded-xl bg-surface-container-high">
          <Image
            src="/empty/empty-faq.png"
            alt="Knowledge Base Empty"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="mb-sm text-headline-md font-semibold text-on-surface">
          Knowledge Base is Empty
        </h2>

        {/* Description */}
        <p className="mb-lg max-w-md text-body-md text-on-surface-variant">
          Start adding frequently asked questions to help your customers find
          answers faster and reduce ticket volume for your team.
        </p>

        {/* Button */}
        <button className="rounded-lg bg-primary px-lg py-3 text-label-md text-on-primary shadow-md transition hover:bg-primary-container active:scale-95">
          Add FAQ
        </button>
      </div>
    </section>
  );
}
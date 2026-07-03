"use client";

import Image from "next/image";

export default function EmptyBroadcast() {
  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-col items-center text-center">
        {/* Illustration */}
        <div className="relative mb-md flex h-48 w-48 items-center justify-center overflow-hidden rounded-xl bg-surface-container">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />

          <Image
            src="/empty/empty-broadcast.png"
            alt="No Broadcasts"
            width={140}
            height={140}
            className="relative z-10 object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="mb-sm text-headline-md font-semibold text-on-surface">
          No Broadcasts Scheduled
        </h2>

        {/* Description */}
        <p className="mb-lg max-w-md text-body-md text-on-surface-variant">
          Ready to reach your audience? Create your first email campaign to
          announce updates, share news, or provide helpful tips to your users.
        </p>

        {/* CTA */}
        <button className="rounded-lg bg-primary px-lg py-3 text-label-md text-on-primary shadow-md transition-all hover:bg-primary-container active:scale-95">
          New Broadcast
        </button>
      </div>
    </section>
  );
}
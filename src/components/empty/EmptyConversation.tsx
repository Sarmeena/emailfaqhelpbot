"use client";

import Image from "next/image";

export default function EmptyConversation() {
  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-col items-center text-center">
        {/* Illustration */}
        <div className="mb-md flex h-48 w-48 items-center justify-center rounded-full bg-surface-container">
          <Image
            src="/empty/empty-conversation.png"
            alt="No Active Conversations"
            width={140}
            height={140}
            className="object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="mb-sm text-headline-md font-semibold text-on-surface">
          No Active Conversations
        </h2>

        {/* Description */}
        <p className="mb-lg max-w-md text-body-md text-on-surface-variant">
          Select a ticket to start chatting or wait for a new customer message.
          All your real-time interactions will be managed here.
        </p>

        {/* CTA */}
        <button className="rounded-lg bg-primary px-lg py-3 text-label-md text-on-primary shadow-md transition-all hover:bg-primary-container active:scale-95">
          View Inbox
        </button>
      </div>
    </section>
  );
}
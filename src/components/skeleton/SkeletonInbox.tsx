"use client";

import { Inbox } from "lucide-react";

export default function SkeletonInbox() {
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-outline-variant pb-3">
        <Inbox className="h-6 w-6 text-primary" />

        <h2 className="text-title-lg font-title-lg text-on-surface">
          2. Request Inbox
        </h2>
      </div>

      {/* Inbox List */}
      <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex items-start gap-6 border-b border-outline-variant p-6 last:border-0"
          >
            {/* Avatar */}
            <div className="h-12 w-12 animate-pulse rounded-full bg-surface-container-high shrink-0" />

            {/* Content */}
            <div className="flex-1 space-y-3">
              {/* Top Row */}
              <div className="flex items-center justify-between">
                <div className="h-5 w-40 animate-pulse rounded-full bg-surface-container-high" />

                <div className="h-4 w-16 animate-pulse rounded-full bg-surface-container-high" />
              </div>

              {/* Message */}
              <div className="h-4 w-full animate-pulse rounded-full bg-surface-container-high" />

              {/* Optional second line */}
              {item !== 2 && (
                <div
                  className={`h-4 animate-pulse rounded-full bg-surface-container-high ${
                    item === 1 ? "w-3/5" : "w-1/3"
                  }`}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
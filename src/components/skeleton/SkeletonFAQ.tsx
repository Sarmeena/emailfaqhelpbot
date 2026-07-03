"use client";

import { CircleHelp } from "lucide-react";

export default function SkeletonFAQ() {
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-outline-variant pb-3">
        <CircleHelp className="h-6 w-6 text-primary" />

        <h2 className="text-title-lg font-title-lg text-on-surface">
          3. FAQ Knowledge Base
        </h2>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[1, 2].map((card) => (
          <div
            key={card}
            className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm"
          >
            {/* Title */}
            <div className="mb-6 h-6 w-3/4 animate-pulse rounded-full bg-surface-container-high" />

            {/* Content */}
            <div className="space-y-3">
              <div className="h-4 w-full animate-pulse rounded-full bg-surface-container-high" />

              <div className="h-4 w-11/12 animate-pulse rounded-full bg-surface-container-high" />

              <div className="h-4 w-2/3 animate-pulse rounded-full bg-surface-container-high" />
            </div>

            {/* Tags */}
            <div className="mt-6 flex gap-3">
              <div className="h-6 w-16 animate-pulse rounded-full bg-surface-container-high" />

              {card === 1 && (
                <div className="h-6 w-16 animate-pulse rounded-full bg-surface-container-high" />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
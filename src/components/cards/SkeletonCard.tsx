"use client";

export default function SkeletonCard() {
  return (
    <div className="space-y-md rounded-xl border border-outline-variant bg-white p-md">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 animate-pulse rounded-full bg-surface-container" />

        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/2 animate-pulse rounded bg-surface-container" />
          <div className="h-3 w-1/4 animate-pulse rounded bg-surface-container" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-3 animate-pulse rounded bg-surface-container" />
        <div className="h-3 animate-pulse rounded bg-surface-container" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-surface-container" />
      </div>

      <div className="flex justify-end">
        <div className="h-8 w-24 animate-pulse rounded bg-surface-container" />
      </div>
    </div>
  );
}
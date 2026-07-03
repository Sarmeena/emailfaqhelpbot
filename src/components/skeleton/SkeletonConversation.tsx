"use client";

export default function SkeletonConversation() {
  return (
    <section className="space-y-6 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="h-6 w-56 animate-pulse rounded-full bg-surface-container-high" />

      {/* Chat Container */}
      <div className="space-y-6 rounded-2xl border border-outline-variant bg-surface-container p-6">
        {/* Agent Message */}
        <div className="flex items-end gap-3">
          <div className="h-8 w-8 animate-pulse rounded-full bg-surface-container-high" />

          <div className="w-72 rounded-2xl rounded-bl-sm border border-outline-variant bg-surface-container-lowest p-4">
            <div className="space-y-3">
              <div className="h-4 w-44 animate-pulse rounded-full bg-surface-container-high" />
              <div className="h-4 w-32 animate-pulse rounded-full bg-surface-container-high" />
            </div>
          </div>
        </div>

        {/* User Message */}
        <div className="flex flex-row-reverse items-end gap-3">
          <div className="h-8 w-8 animate-pulse rounded-full bg-surface-container-high" />

          <div className="w-56 rounded-2xl rounded-br-sm bg-primary p-4">
            <div className="h-4 w-32 animate-pulse rounded-full bg-white/20" />
          </div>
        </div>

        {/* Agent Long Message */}
        <div className="flex items-end gap-3">
          <div className="h-8 w-8 animate-pulse rounded-full bg-surface-container-high" />

          <div className="w-80 rounded-2xl rounded-bl-sm border border-outline-variant bg-surface-container-lowest p-4">
            <div className="space-y-3">
              <div className="h-4 w-full animate-pulse rounded-full bg-surface-container-high" />
              <div className="h-4 w-11/12 animate-pulse rounded-full bg-surface-container-high" />
              <div className="h-4 w-2/5 animate-pulse rounded-full bg-surface-container-high" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
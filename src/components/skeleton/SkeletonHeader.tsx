"use client";

import { Menu, Search } from "lucide-react";

export default function SkeletonHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-margin-mobile shadow-sm md:px-margin-desktop">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-full p-2 transition hover:bg-surface-container-low md:hidden"
        >
          <Menu className="h-5 w-5 text-primary" />
        </button>

        <h1 className="text-title-lg font-bold text-primary">
          SupportSync
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Search (Desktop) */}
        <div className="hidden items-center gap-2 rounded-full bg-surface-container px-4 py-2 md:flex">
          <Search className="h-4 w-4 text-on-surface-variant" />

          <span className="text-label-md text-on-surface-variant">
            Knowledge Base Search
          </span>
        </div>

        {/* Avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container font-bold text-on-primary-container shadow-sm">
          AM
        </div>
      </div>
    </header>
  );
}
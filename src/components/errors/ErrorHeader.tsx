"use client";

import { Menu } from "lucide-react";

export default function ErrorHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-margin-mobile shadow-sm md:px-margin-desktop">
      <div className="flex items-center gap-3">
        <button className="rounded-lg p-2 transition hover:bg-surface-container-low md:hidden">
          <Menu className="h-5 w-5 text-primary" />
        </button>

        <h1 className="text-title-lg font-bold text-primary">
          SupportSync
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right md:block">
          <p className="text-label-md font-medium text-on-surface">
            Alex Miller
          </p>
          <p className="text-label-sm text-on-surface-variant">
            Senior Lead
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary-fixed-dim font-semibold text-on-primary-container">
          AM
        </div>
      </div>
    </header>
  );
}
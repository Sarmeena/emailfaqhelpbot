"use client";

import Image from "next/image";
import { Menu } from "lucide-react";

export default function EmptyHeader() {
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
      <div className="flex items-center gap-3">
        <div className="hidden text-right md:block">
          <p className="text-label-md font-medium text-on-surface">
            Alex Miller
          </p>

          <p className="text-label-sm text-on-surface-variant">
            Senior Lead
          </p>
        </div>

        <div className="overflow-hidden rounded-full border-2 border-primary-container">
          <Image
            src="/avatar.png"
            alt="Profile"
            width={40}
            height={40}
            className="h-10 w-10 object-cover"
          />
        </div>
      </div>
    </header>
  );
}
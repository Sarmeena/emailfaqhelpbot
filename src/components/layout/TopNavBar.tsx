"use client";

import { Bell, Settings } from "lucide-react";
import SearchBar from "../common/SearchBar";
import Avatar from "../common/Avatar";

export default function TopNavbar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-outline-variant bg-surface px-8 shadow-sm">
      <div className="w-full max-w-md">
        <SearchBar placeholder="Search components..." />
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden rounded-full bg-surface-container-high px-3 py-1 text-sm md:flex">
          🟢 Agent Online
        </span>

        <button>
          <Bell />
        </button>

        <button>
          <Settings />
        </button>

        <Avatar />
      </div>
    </header>
  );
}
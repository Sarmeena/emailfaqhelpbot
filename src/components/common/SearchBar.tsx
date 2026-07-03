"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({
  placeholder = "Search...",
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
      />

      <input
        type="text"
        placeholder={placeholder}
        className="
          h-10
          w-full
          rounded-full
          bg-surface-container-low
          pl-10
          pr-4
          outline-none
          transition
          focus:ring-2
          focus:ring-primary/20
        "
      />
    </div>
  );
}
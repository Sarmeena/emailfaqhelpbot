"use client";

import { Filter } from "lucide-react";

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  const filters = [
    { name: "All", label: "All Tickets", hasIcon: true },
    { name: "Active", label: "Active", hasIcon: false },
    { name: "Pending", label: "Pending", hasIcon: false },
    { name: "High Priority", label: "High Priority", hasIcon: false },
    { name: "Resolved", label: "Resolved", hasIcon: false },
  ];

  return (
    <section className="mb-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((f) => {
        const isActive = activeFilter === f.name;
        return (
          <button
            key={f.name}
            type="button"
            onClick={() => onFilterChange(f.name)}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition active:scale-95 cursor-pointer ${
              isActive
                ? "bg-blue-700 text-white hover:bg-blue-800 shadow-sm"
                : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {f.hasIcon && <Filter size={16} />}
            {f.label}
          </button>
        );
      })}
    </section>
  );
}
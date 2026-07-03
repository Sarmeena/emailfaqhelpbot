"use client";

import { Filter } from "lucide-react";

export default function FilterBar() {
  return (
    <section className="mb-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {/* All Tickets */}
      <button className="flex shrink-0 items-center gap-2 rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">
        <Filter size={16} />
        All Tickets
      </button>

      {/* Active */}
      <button className="shrink-0 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-100">
        Active
      </button>

      {/* Pending */}
      <button className="shrink-0 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-100">
        Pending
      </button>

      {/* High Priority */}
      <button className="shrink-0 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-100">
        High Priority
      </button>

      {/* Resolved */}
      <button className="shrink-0 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-100">
        Resolved
      </button>
    </section>
  );
}
"use client";

import {
  Search,
  Folder,
  CheckCircle2,
} from "lucide-react";

interface FAQFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  category: string;
  onCategoryChange: (value: string) => void;

  status: string;
  onStatusChange: (value: string) => void;
}

export default function FAQFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
}: FAQFiltersProps) {
  return (
    <section className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

      <div className="flex flex-col gap-4 md:flex-row">

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
            placeholder="Search FAQs..."
            className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-600"
          />
        </div>

        {/* Category */}
        <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5">
          <Folder size={18} className="text-gray-500" />

          <select
            value={category}
            onChange={(e) =>
              onCategoryChange(e.target.value)
            }
            className="bg-transparent text-sm outline-none"
          >
            <option value="">All Categories</option>
            <option value="General">General</option>
            <option value="Technical">Technical</option>
            <option value="Billing">Billing</option>
            <option value="Account">Account</option>
          </select>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5">
          <CheckCircle2
            size={18}
            className="text-gray-500"
          />

          <select
            value={status}
            onChange={(e) =>
              onStatusChange(e.target.value)
            }
            className="bg-transparent text-sm outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

      </div>

    </section>
  );
}
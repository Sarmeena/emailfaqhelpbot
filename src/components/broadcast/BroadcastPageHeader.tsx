"use client";

import { Plus, Search } from "lucide-react";

export default function BroadcastPageHeader() {
  return (
    <section className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Broadcasts
        </h1>

        <p className="mt-2 text-gray-500">
          Manage and track your email campaigns.
        </p>
      </div>

      {/* Right */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

        {/* Search */}
        <div className="relative">

          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search broadcasts..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 sm:w-72"
          />

        </div>

        {/* Button */}
        <button className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md">

          <Plus className="h-5 w-5" />

          New Broadcast

        </button>

      </div>

    </section>
  );
}
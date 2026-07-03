"use client";

import { X } from "lucide-react";

export default function FAQMetadata() {
  return (
    <section className="h-full rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

      {/* Header */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Metadata
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Add keywords and tags to improve FAQ search.
        </p>
      </div>

      <div className="space-y-6">

        {/* Keywords */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Keywords
          </label>

          <input
            type="text"
            placeholder="password, login, security"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Tags
          </label>

          <div className="flex min-h-[56px] flex-wrap items-center gap-2 rounded-xl border border-gray-300 bg-white p-3">

            {/* Tag */}
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              Support

              <button
                type="button"
                className="rounded-full p-1 transition hover:bg-blue-200"
              >
                <X className="h-3 w-3" />
              </button>
            </span>

            {/* Tag */}
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              Account

              <button
                type="button"
                className="rounded-full p-1 transition hover:bg-blue-200"
              >
                <X className="h-3 w-3" />
              </button>
            </span>

            {/* Add Tag */}
            <input
              type="text"
              placeholder="Add tag..."
              className="min-w-[120px] flex-1 bg-transparent text-gray-700 outline-none placeholder:text-gray-400"
            />

          </div>
        </div>

      </div>

    </section>
  );
}
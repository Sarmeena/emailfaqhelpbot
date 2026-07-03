"use client";

import { Database, Eye } from "lucide-react";

export default function SettingsFirebaseCard() {
  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-orange-50 p-2">
          <Database className="h-5 w-5 text-orange-600" />
        </div>

        <h2 className="text-title-lg font-semibold text-on-surface">
          Firebase Configuration
        </h2>
      </div>

      <div className="space-y-5">
        {/* Project ID */}
        <div>
          <label className="mb-2 block text-label-sm font-medium text-outline">
            Project ID
          </label>

          <input
            type="text"
            placeholder="your-project-id"
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 font-mono text-body-md outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* API Key */}
        <div>
          <label className="mb-2 block text-label-sm font-medium text-outline">
            API Key
          </label>

          <div className="relative">
            <input
              type="password"
              placeholder="AIza..."
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 pr-12 font-mono text-body-md outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline transition hover:text-primary"
            >
              <Eye className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
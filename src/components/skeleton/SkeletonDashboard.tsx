"use client";

import { BarChart3 } from "lucide-react";

export default function SkeletonDashboard() {
  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-2 border-b border-outline-variant pb-3">
        <BarChart3 className="h-6 w-6 text-primary" />

        <h2 className="text-title-lg font-title-lg text-on-surface">
          1. Dashboard Analytics
        </h2>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm"
          >
            <div className="space-y-4">
              <div className="h-12 w-12 animate-pulse rounded-lg bg-surface-container-high" />

              <div className="h-4 w-24 animate-pulse rounded-full bg-surface-container-high" />

              <div className="h-8 w-16 animate-pulse rounded-lg bg-surface-container-high" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-6 w-48 animate-pulse rounded-full bg-surface-container-high" />

          <div className="h-6 w-24 animate-pulse rounded-full bg-surface-container-high" />
        </div>

        <div className="flex h-56 items-end gap-2">
          {[40, 65, 50, 85, 30, 70, 45, 90, 55].map((height, index) => (
            <div
              key={index}
              className="flex-1 animate-pulse rounded-t-md bg-surface-container-high"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
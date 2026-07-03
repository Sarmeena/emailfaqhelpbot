"use client";

import { Megaphone } from "lucide-react";

export default function SkeletonBroadcast() {
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-outline-variant pb-3">
        <Megaphone className="h-6 w-6 text-primary" />

        <h2 className="text-title-lg font-title-lg text-on-surface">
          5. Campaign Broadcasts
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead className="bg-surface-container">
            <tr>
              <th className="p-6">
                <div className="h-4 w-24 animate-pulse rounded-full bg-surface-container-high" />
              </th>

              <th className="p-6">
                <div className="h-4 w-16 animate-pulse rounded-full bg-surface-container-high" />
              </th>

              <th className="p-6">
                <div className="h-4 w-20 animate-pulse rounded-full bg-surface-container-high" />
              </th>

              <th className="p-6">
                <div className="h-4 w-16 animate-pulse rounded-full bg-surface-container-high" />
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-outline-variant">
            {[1, 2, 3].map((row) => (
              <tr key={row}>
                <td className="p-6">
                  <div className="h-5 w-full animate-pulse rounded-full bg-surface-container-high" />
                </td>

                <td className="p-6">
                  <div className="h-5 w-16 animate-pulse rounded-full bg-surface-container-high" />
                </td>

                <td className="p-6">
                  <div className="h-5 w-20 animate-pulse rounded-full bg-surface-container-high" />
                </td>

                <td className="p-6">
                  <div className="h-5 w-24 animate-pulse rounded-full bg-surface-container-high" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
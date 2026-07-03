"use client";

import {
  Send,
  Eye,
  Reply,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export default function BroadcastStats() {
  const stats = [
    {
      title: "Total Sent",
      value: "0",
      icon: Send,
      badge: "+12%",
      positive: true,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Avg. Open Rate",
      value: "0%",
      icon: Eye,
      badge: "+4%",
      positive: true,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Avg. Reply Rate",
      value: "0%",
      icon: Reply,
      badge: "-2%",
      positive: false,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Scheduled",
      value: "0",
      icon: Clock,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            {/* Top */}
            <div className="mb-5 flex items-center justify-between">

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${item.iconBg}`}
              >
                <Icon className={`h-6 w-6 ${item.iconColor}`} />
              </div>

              {item.badge && (
                <span
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                    item.positive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.positive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}

                  {item.badge}
                </span>
              )}

            </div>

            {/* Title */}
            <p className="text-sm font-medium text-gray-500">
              {item.title}
            </p>

            {/* Value */}
            <h3 className="mt-2 text-3xl font-bold text-gray-900">
              {item.value}
            </h3>

          </div>
        );
      })}
    </section>
  );
}
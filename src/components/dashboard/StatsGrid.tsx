"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  CheckCircle,
  BookOpen,
  Clock,
} from "lucide-react";

import {
  getDashboardStats,
  DashboardStats,
} from "../../services/firestore/dashboard";

export default function StatsGrid() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    totalFaqs: 0,
    totalBroadcasts: 0,
    openRequests: 0,
    resolvedRequests: 0,
    inProgressRequests: 0,
    peakHour: "No activity data",
    topFaqs: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  const cards = [
    {
      title: "Total Tickets",
      value: stats.totalRequests,
      change: "All Time",
      changeColor: "text-gray-500",
      icon: Mail,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-700",
    },
    {
      title: "Action Required",
      value: stats.openRequests + stats.inProgressRequests,
      change: "Active / Open",
      changeColor: "text-red-500",
      icon: Mail,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      title: "Resolved Tickets",
      value: stats.resolvedRequests,
      change: "Completed",
      changeColor: "text-green-600",
      icon: CheckCircle,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-655",
    },
    {
      title: "Peak Hour",
      value: stats.peakHour.includes(" (") ? stats.peakHour.split(" (")[0] : stats.peakHour,
      change: stats.peakHour.includes(" (") ? stats.peakHour.split(" (")[1].replace(")", "") : "Traffic Peak",
      changeColor: "text-indigo-600",
      icon: Clock,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-650",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-lg font-semibold text-gray-500">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className={`rounded-lg p-2 ${item.iconBg}`}>
                <Icon
                  size={22}
                  className={item.iconColor}
                />
              </div>

              <span
                className={`text-sm font-semibold ${item.changeColor}`}
              >
                {item.change}
              </span>
            </div>

            <p className="text-sm text-gray-500">
              {item.title}
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              {item.value}
            </h3>
          </div>
        );
      })}
    </section>
  );
}
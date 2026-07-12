"use client";

import { useEffect, useState } from "react";
import { getRecentRequests, Request } from "../../services/firestore/requests";
import Link from "next/link";

export default function RecentRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRequests() {
      try {
        const data = await getRecentRequests(3);
        setRequests(data);
      } catch (err) {
        console.error("Error loading recent requests:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRequests();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "US";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-100 text-blue-700",
      "bg-indigo-100 text-indigo-700",
      "bg-orange-100 text-orange-700",
      "bg-purple-100 text-purple-700",
      "bg-teal-100 text-teal-700",
    ];
    let hash = 0;
    for (let i = 0; i < (name || "").length; i++) {
      hash = (name || "").charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <section className="space-y-4">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Recent Requests
        </h2>

        <Link href="/requests" className="text-sm font-semibold text-blue-750 hover:underline">
          View All
        </Link>
      </div>

      {/* Request Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="h-24 rounded-xl border bg-white animate-pulse" />
        ) : requests.length === 0 ? (
          <div className="rounded-xl border bg-white p-6 text-center text-sm text-gray-400 font-medium">
            No recent requests found.
          </div>
        ) : (
          requests.map((request) => {
            const initials = getInitials(request.customerName);
            const avatarColor = getAvatarColor(request.customerName);
            const relativeTime = "Just now"; // Default relative placeholder

            return (
              <Link
                key={request.id}
                href="/conversation"
                className="block cursor-pointer rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:bg-gray-50 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Left */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold ${avatarColor}`}
                    >
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">
                        {request.customerName}
                      </h3>

                      <p className="text-sm text-gray-500 truncate font-medium">
                        {request.subject}
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        request.priority === "High"
                          ? "bg-red-150 text-red-700 font-bold"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {request.priority || "Medium"}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        request.status === "Pending"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {request.status || "Active"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </section>
  );
}
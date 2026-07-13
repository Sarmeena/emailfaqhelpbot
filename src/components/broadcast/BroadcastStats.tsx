"use client";

import {
  Send,
  Eye,
  Reply,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getBroadcasts, Broadcast } from "../../services/firestore/broadcasts";

export default function BroadcastStats() {
  const { user, role, loading: authLoading } = useAuth();
  const [totalSent, setTotalSent] = useState(0);
  const [openRate, setOpenRate] = useState(0);
  const [replyRate, setReplyRate] = useState(0);
  const [scheduled, setScheduled] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user || !role) return;

    async function loadStats() {
      try {
        const broadcasts = await getBroadcasts();
        
        let sentCount = 0;
        let totalOpen = 0;
        let totalReply = 0;
        let sentCampaignsCount = 0;
        let scheduledCount = 0;

        broadcasts.forEach((b) => {
          if (b.status === "Sent") {
            const count = parseInt(b.recipients) || 0;
            sentCount += count;
            totalOpen += b.openRate !== undefined ? b.openRate : 80;
            totalReply += b.replyRate !== undefined ? b.replyRate : 10;
            sentCampaignsCount++;
          } else if (b.status === "Scheduled") {
            scheduledCount++;
          }
        });

        setTotalSent(sentCount);
        setScheduled(scheduledCount);
        if (sentCampaignsCount > 0) {
          setOpenRate(Math.round(totalOpen / sentCampaignsCount));
          setReplyRate(Math.round(totalReply / sentCampaignsCount));
        } else {
          setOpenRate(0);
          setReplyRate(0);
        }
      } catch (e: any) {
        console.error("Error loading stats:", e);
        if (e.code === "permission-denied" || e.message?.includes("permission")) {
          console.error(`[Firestore Permission Failure] BroadcastStats query denied. UID: ${user?.uid}, Role: ${role}`);
        }
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [user, role, authLoading]);

  const isStatsLoading = authLoading || !user || !role || loading;

  const stats = [
    {
      title: "Total Sent",
      value: isStatsLoading ? "..." : String(totalSent),
      icon: Send,
      badge: "+12%",
      positive: true,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Avg. Open Rate",
      value: isStatsLoading ? "..." : `${openRate}%`,
      icon: Eye,
      badge: "+4%",
      positive: true,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Avg. Reply Rate",
      value: isStatsLoading ? "..." : `${replyRate}%`,
      icon: Reply,
      badge: "-2%",
      positive: false,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Scheduled",
      value: isStatsLoading ? "..." : String(scheduled),
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
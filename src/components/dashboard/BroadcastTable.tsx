"use client";

import { useEffect, useState } from "react";
import { getBroadcasts } from "../../services/firestore/broadcasts";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Broadcast {
  id: string;
  subject: string;
  category: string;
  status: string;
  recipients: string;
  openRate: number;
  replyRate: number;
  scheduleDate?: string;
  scheduleTime?: string;
}

export default function BroadcastTable() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBroadcasts() {
      try {
        const data = await getBroadcasts();
        setBroadcasts((data as any[] || []).slice(0, 3));
      } catch (err) {
        console.error("Error loading broadcasts for dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBroadcasts();
  }, []);

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Recent Broadcasts
        </h2>

        <Link href="/broadcasts" className="flex items-center gap-2 text-sm font-semibold text-blue-750 hover:underline">
          View All campaigns
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="h-20 bg-gray-50 animate-pulse rounded-lg" />
        ) : broadcasts.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400 font-medium">
            No broadcast campaigns created yet.
          </div>
        ) : (
          <table className="min-w-full text-left text-sm font-medium text-gray-700">
            <thead>
              <tr className="border-b text-xs font-bold uppercase tracking-wider text-gray-400">
                <th className="py-3">Campaign</th>
                <th>Status</th>
                <th>Audience</th>
                <th>Engagement</th>
                <th className="text-right">Schedule</th>
              </tr>
            </thead>

            <tbody>
              {broadcasts.map((bc) => (
                <tr key={bc.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 font-bold text-gray-900 truncate max-w-[200px]" title={bc.subject}>
                    {bc.subject || "(No Subject)"}
                  </td>

                  <td>
                    <span
                      className={`rounded px-2.5 py-1 text-xs font-bold ${
                        bc.status === "Sent"
                          ? "bg-green-100 text-green-700"
                          : bc.status === "Scheduled"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {bc.status}
                    </span>
                  </td>

                  <td className="text-gray-500">{bc.recipients || "No Recipients"}</td>

                  <td className="text-gray-500">
                    {bc.status === "Sent" ? `${bc.openRate}% / ${bc.replyRate}%` : "N/A"}
                  </td>

                  <td className="text-right text-gray-500 font-semibold">
                    {bc.status === "Scheduled" && bc.scheduleDate
                      ? `${bc.scheduleDate} ${bc.scheduleTime || ""}`
                      : bc.status === "Sent"
                      ? "Sent"
                      : "Draft"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
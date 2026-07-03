"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getRequests,
  updateRequest,
  deleteRequest,
  deriveThreadId,
  Request,
} from "../../services/firestore/requests";
import { Hash, GitBranch } from "lucide-react";

const priorityColor: Record<string, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-green-100 text-green-700",
};

const statusColor: Record<string, string> = {
  Open: "bg-blue-100 text-blue-700",
  "In Progress": "bg-orange-100 text-orange-700",
  Resolved: "bg-green-100 text-green-700",
};

export default function RequestCards() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRequests()
      .then(setRequests)
      .finally(() => setLoading(false));
  }, []);

  const refresh = async () => {
    const data = await getRequests();
    setRequests(data);
  };

  async function handleDelete(id: string) {
    if (!confirm("Delete this request?")) return;
    await deleteRequest(id);
    await refresh();
  }

  async function handleStatusChange(id: string, status: string) {
    await updateRequest(id, { status });
    await refresh();
  }

  if (loading) {
    return <div className="md:hidden p-6 text-center text-gray-400">Loading requests...</div>;
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col gap-4 md:hidden">
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <Hash size={40} className="text-blue-600 opacity-40" />
          </div>
          <h3 className="mb-2 text-2xl font-semibold text-gray-800">No requests yet</h3>
          <p className="text-gray-500">New requests will appear here once they arrive.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:hidden">
      {requests.map((request) => {
        const threadId = request.threadId ?? deriveThreadId(request.customerEmail);
        return (
          <div key={request.id} className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
            {/* IDs row */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-mono font-bold text-blue-700">
                <Hash size={11} />
                {request.requestId ?? "Legacy"}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-mono text-purple-700">
                <GitBranch size={11} />
                {threadId.slice(0, 16)}…
              </span>
            </div>

            {/* Customer & Status */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{request.customerName}</h3>
                <p className="text-xs text-gray-500">{request.customerEmail}</p>
                <p className="mt-1 text-sm text-gray-700 font-medium">{request.subject}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor[request.status] ?? "bg-gray-100 text-gray-700"}`}>
                {request.status}
              </span>
            </div>

            {/* Priority & Actions */}
            <div className="flex items-center justify-between border-t pt-3">
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityColor[request.priority] ?? "bg-gray-100 text-gray-700"}`}>
                {request.priority} Priority
              </span>
              <div className="flex gap-2">
                <Link
                  href={`/requests/edit/${request.id}`}
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(request.id!)}
                  className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Status selector */}
            <select
              value={request.status}
              onChange={(e) => handleStatusChange(request.id!, e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
          </div>
        );
      })}
    </div>
  );
}
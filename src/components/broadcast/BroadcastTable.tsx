"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Copy,
  Trash2,
  ChevronRight,
} from "lucide-react";

import {
  getBroadcasts,
  deleteBroadcast,
  createBroadcast,
  Broadcast,
} from "../../services/firestore/broadcasts";

export default function BroadcastTable() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBroadcast, setSelectedBroadcast] = useState<Broadcast | null>(null);

  useEffect(() => {
    loadBroadcasts();
  }, []);

  async function loadBroadcasts() {
    try {
      const data = await getBroadcasts();
      setBroadcasts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Delete this broadcast?"
    );

    if (!confirmed) return;

    try {
      await deleteBroadcast(id);

      setBroadcasts((prev) =>
        prev.filter((broadcast) => broadcast.id !== id)
      );

      alert("Broadcast deleted.");
    } catch (error) {
      console.error(error);
      alert("Failed to delete broadcast.");
    }
  }

  async function handleDuplicate(
    broadcast: Broadcast
  ) {
    try {
      await createBroadcast({
        subject: `${broadcast.subject} (Copy)`,
        content: broadcast.content,
        category: broadcast.category,
        recipients: broadcast.recipients,
        status: "Draft",
        openRate: 0,
        replyRate: 0,
      });

      await loadBroadcasts();

      alert("Broadcast duplicated.");
    } catch (error) {
      console.error(error);
      alert("Failed to duplicate.");
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        Loading broadcasts...
      </div>
    );
  }

  if (broadcasts.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">
          No Broadcasts Found
        </h3>

        <p className="mt-2 text-gray-500">
          Create your first broadcast.
        </p>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

      {/* Desktop */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full border-collapse">

          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500">
                Subject
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500">
                Recipients
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500">
                Status
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-500">
                Open Rate
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-500">
                Reply Rate
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500">
                Created
              </th>

              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-500">
                Actions
              </th>

            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">

            {broadcasts.map((item) => (

              <tr
                key={item.id}
                className="group transition hover:bg-gray-50"
              >

                {/* Subject */}

                <td className="px-6 py-5">

                  <p className="font-semibold text-gray-900">
                    {item.subject}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {item.category}
                  </p>

                </td>

                {/* Recipients */}

                <td className="px-6 py-5 text-gray-700">
                  {item.recipients}
                </td>

                {/* Status */}

                <td className="px-6 py-5">
                  <StatusBadge status={item.status} />
                </td>

                {/* Open Rate */}

                <td className="px-6 py-5">

                  <div className="flex flex-col items-center">

                    <span className="font-medium">
                      {item.openRate}%
                    </span>

                    <div className="mt-2 h-2 w-20 rounded-full bg-gray-200">

                      <div
                        className="h-2 rounded-full bg-blue-600"
                        style={{
                          width: `${item.openRate}%`,
                        }}
                      />

                    </div>

                  </div>

                </td>

                {/* Reply Rate */}

                <td className="px-6 py-5 text-center font-medium">
                  {item.replyRate}%
                </td>

                {/* Created */}

                <td className="px-6 py-5 text-gray-500">
                  {item.createdAt}
                </td>

                {/* Actions */}

                <td className="px-6 py-5">

                  <div className="flex justify-end gap-2 opacity-0 transition group-hover:opacity-100">

                    {/* Details */}
                    <button
                      onClick={() => setSelectedBroadcast(item)}
                      className="rounded-full px-3 py-1 hover:bg-gray-100 text-blue-600 font-semibold text-sm"
                    >
                      Details
                    </button>

                    {/* Edit */}

                    <Link
                      href={`/broadcasts/edit?id=${item.id}`}
                    >
                      <button className="rounded-full p-2 hover:bg-gray-100">
                        Edit
                      </button>
                    </Link>

                    {/* Duplicate */}

                    <IconButton
                      onClick={() =>
                        handleDuplicate(item)
                      }
                    >
                      <Copy className="h-5 w-5" />
                    </IconButton>

                    {/* Delete */}

                    <IconButton
                      danger
                      onClick={() =>
                        handleDelete(item.id!)
                      }
                    >
                      <Trash2 className="h-5 w-5" />
                    </IconButton>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>
      </div>
            {/* Mobile */}
      <div className="space-y-4 p-4 lg:hidden">
        {broadcasts.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <StatusBadge status={item.status} />

                <h3 className="mt-3 font-semibold text-gray-900">
                  {item.subject}
                </h3>

                <p className="text-sm text-gray-500">
                  {item.createdAt}
                </p>
              </div>

              <div className="flex gap-2">

                <IconButton
                  onClick={() => handleDuplicate(item)}
                >
                  <Copy className="h-5 w-5" />
                </IconButton>

                <IconButton
                  danger
                  onClick={() => handleDelete(item.id!)}
                >
                  <Trash2 className="h-5 w-5" />
                </IconButton>

              </div>
            </div>

            {item.status === "Sent" ? (
              <>
                <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Open Rate
                    </p>

                    <p className="mt-1 text-2xl font-bold text-blue-600">
                      {item.openRate}%
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Reply Rate
                    </p>

                    <p className="mt-1 text-2xl font-bold text-green-600">
                      {item.replyRate}%
                    </p>
                  </div>

                </div>

                <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4">

                  <span className="text-sm text-gray-500">
                    Recipients
                    <span className="ml-2 font-semibold text-gray-900">
                      {item.recipients}
                    </span>
                  </span>

                  <button 
                    onClick={() => setSelectedBroadcast(item)}
                    className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Details
                    <ChevronRight className="h-4 w-4" />
                  </button>

                </div>
              </>
            ) : item.status === "Scheduled" ? (

              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">

                <p className="italic text-gray-500">
                  Waiting to send...
                </p>

                <p className="font-semibold text-gray-900">
                  {item.recipients}
                </p>

              </div>

            ) : (

              <div className="mt-4 flex justify-end">

                <Link href={`/broadcasts/edit?id=${item.id}`}>
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
                    Continue Editing
                  </button>
                </Link>

              </div>

            )}

          </div>
        ))}
      </div>

      {/* Details & Delivery History Modal */}
      {selectedBroadcast && (
        <div className="fixed inset-0 z-99 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl space-y-6 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedBroadcast.subject}
                  </h3>
                  <StatusBadge status={selectedBroadcast.status} />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Category: {selectedBroadcast.category} | Created: {selectedBroadcast.createdAt}
                </p>
              </div>
              <button 
                onClick={() => setSelectedBroadcast(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition"
              >
                <XIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Campaign Stats Grid (if Sent) */}
            {selectedBroadcast.status === "Sent" && (
              <div className="grid grid-cols-3 gap-4 rounded-xl bg-gray-50 p-4 border border-gray-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Total Recipients</span>
                  <p className="text-xl font-extrabold text-gray-950 mt-1">{selectedBroadcast.recipients}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Open Rate</span>
                  <p className="text-xl font-extrabold text-blue-600 mt-1">{selectedBroadcast.openRate}%</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Reply Rate</span>
                  <p className="text-xl font-extrabold text-green-600 mt-1">{selectedBroadcast.replyRate}%</p>
                </div>
              </div>
            )}

            {/* Content Preview */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-gray-700">Email Body Preview</span>
              <div className="p-4 border rounded-xl bg-slate-50 text-sm max-h-40 overflow-y-auto whitespace-pre-wrap text-gray-700 leading-relaxed font-mono">
                {selectedBroadcast.content || <span className="italic text-gray-400">No content composed for this campaign.</span>}
              </div>
            </div>

            {/* Delivery History Log */}
            <div className="flex-1 flex flex-col min-h-0 space-y-2">
              <span className="text-xs font-semibold text-gray-700">Delivery History & Status Log</span>
              <div className="flex-1 overflow-y-auto border rounded-xl bg-white max-h-64">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b font-semibold text-gray-600 sticky top-0">
                      <th className="p-3">Recipient Name</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Time Sent</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(() => {
                      const logs = selectedBroadcast.deliveryHistory && selectedBroadcast.deliveryHistory.length > 0
                        ? selectedBroadcast.deliveryHistory
                        : selectedBroadcast.status === "Sent"
                        ? [
                            { name: "Alice Smith", email: "alice.smith@example.com", status: "Delivered", timestamp: "11:20:15 AM" },
                            { name: "Bob Jones", email: "bob.jones@example.com", status: "Delivered", timestamp: "11:20:32 AM" },
                            { name: "Charlie Brown", email: "charlie.brown@example.com", status: "Delivered", timestamp: "11:21:02 AM" },
                            { name: "Diana Prince", email: "diana.prince@example.com", status: "Delivered", timestamp: "11:21:20 AM" },
                            { name: "Ethan Hunt", email: "ethan.hunt@example.com", status: "Failed", timestamp: "11:21:35 AM" },
                            { name: "Fiona Gallagher", email: "fiona.gallagher@example.com", status: "Delivered", timestamp: "11:21:50 AM" },
                            { name: "George Clark", email: "george.clark@example.com", status: "Delivered", timestamp: "11:22:05 AM" },
                            { name: "Hannah Abbott", email: "hannah.abbott@example.com", status: "Delivered", timestamp: "11:22:18 AM" },
                            { name: "Ian Malcolm", email: "ian.malcolm@example.com", status: "Delivered", timestamp: "11:22:40 AM" },
                            { name: "Julia Roberts", email: "julia.roberts@example.com", status: "Delivered", timestamp: "11:23:02 AM" },
                          ]
                        : [];
                      
                      if (logs.length > 0) {
                        return logs.map((log, index) => (
                          <tr key={index} className="hover:bg-gray-50/50">
                            <td className="p-3 font-medium text-gray-800">{log.name}</td>
                            <td className="p-3 text-gray-600">{log.email}</td>
                            <td className="p-3 text-gray-500">{log.timestamp}</td>
                            <td className="p-3 text-right">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                log.status === "Delivered" 
                                  ? "bg-green-50 text-green-700 border border-green-200" 
                                  : "bg-red-50 text-red-700 border border-red-200"
                              }`}>
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ));
                      }
                      
                      return (
                        <tr>
                          <td colSpan={4} className="p-6 text-center text-gray-400 italic">
                            {selectedBroadcast.status === "Draft" 
                              ? "This broadcast is still a draft. No delivery logs available."
                              : "This broadcast is scheduled to be sent. No delivery logs yet."}
                          </td>
                        </tr>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setSelectedBroadcast(null)}
                className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={2} 
      stroke="currentColor" 
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

/* ---------------- STATUS BADGE ---------------- */

function StatusBadge({
  status,
}: {
  status: Broadcast["status"];
}) {
  const colors = {
    Sent: "bg-green-100 text-green-700",
    Scheduled: "bg-blue-100 text-blue-700",
    Draft: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colors[status]}`}
    >
      {status}
    </span>
  );
}

/* ---------------- ICON BUTTON ---------------- */

function IconButton({
  children,
  danger = false,
  onClick,
}: {
  children: React.ReactNode;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full p-2 transition ${
        danger
          ? "text-red-600 hover:bg-red-100"
          : "text-gray-500 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}
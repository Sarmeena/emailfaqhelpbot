"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getRequests,
  updateRequest,
  deleteRequest,
  deriveThreadId,
  Request,
} from "../../services/firestore/requests";
import { Hash, GitBranch, ChevronDown, ChevronRight, X, Link2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

type ThreadGroup = {
  threadId: string;
  customerEmail: string;
  requests: Request[];
};

interface RequestsTableProps {
  filter: string;
}

export default function RequestsTable({ filter }: RequestsTableProps) {
  const { user, role, loading: authLoading } = useAuth();
  const isReadOnly = role === "viewer";
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (authLoading || !user || !role) return;

    let mounted = true;
    const fetchRequests = async () => {
      try {
        const data = await getRequests();
        if (mounted) {
          setRequests(data);
          setLoading(false);
        }
      } catch (error: any) {
        console.error(error);
        if (error.code === "permission-denied" || error.message?.includes("permission")) {
          console.error(`[Firestore Permission Failure] RequestsTable getRequests denied. UID: ${user?.uid}, Role: ${role}`);
        }
        if (mounted) setLoading(false);
      }
    };
    fetchRequests();
    return () => { mounted = false; };
  }, [user, role, authLoading]);

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

  const filteredRequests = requests.filter((req) => {
    if (filter === "All") return true;
    if (filter === "Active") return req.status === "Active" || req.status === "Open" || req.status === "In Progress";
    if (filter === "Pending") return req.status === "Pending";
    if (filter === "High Priority") return req.priority === "High";
    if (filter === "Resolved") return req.status === "Resolved";
    return true;
  });

  // Group requests by threadId (derived from email)
  const threadGroups: ThreadGroup[] = (() => {
    const map = new Map<string, ThreadGroup>();
    filteredRequests.forEach((req) => {
      const tid = req.threadId ?? deriveThreadId(req.customerEmail);
      if (!map.has(tid)) {
        map.set(tid, { threadId: tid, customerEmail: req.customerEmail, requests: [] });
      }
      map.get(tid)!.requests.push(req);
    });
    return Array.from(map.values()).sort((a, b) => b.requests.length - a.requests.length);
  })();

  function toggleThread(tid: string) {
    setExpandedThreads((prev) => {
      const next = new Set(prev);
      if (next.has(tid)) next.delete(tid);
      else next.add(tid);
      return next;
    });
  }

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

  if (authLoading || !user || !role || loading) {
    return (
      <div className="hidden rounded-2xl bg-white p-8 md:block text-center text-gray-500">
        Loading requests...
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="hidden overflow-hidden rounded-2xl border bg-white shadow-sm md:block">
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-2xl font-semibold">No Requests Yet</h2>
          <p className="mt-3 text-gray-500">Create your first request.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-2xl border bg-white shadow-sm md:block">
        {/* Thread Summary Bar */}
        <div className="flex items-center justify-between border-b bg-gray-50 px-6 py-3 min-w-[1000px]">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <GitBranch size={16} className="text-blue-600" />
            <span>{threadGroups.length} Email Thread{threadGroups.length !== 1 ? "s" : ""}</span>
            <span className="text-gray-400">·</span>
            <span>{requests.length} Total Request{requests.length !== 1 ? "s" : ""}</span>
          </div>
          <span className="text-xs text-gray-400">Click thread row to expand</span>
        </div>

        <table className="w-full min-w-[1000px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Thread</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Request ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Subject</th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Priority</th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {threadGroups.map((group) => {
              const isExpanded = expandedThreads.has(group.threadId);
              const hasMultiple = group.requests.length > 1;

              return group.requests.map((request, idx) => {
                const isGroupHeader = idx === 0;
                const isHidden = !isExpanded && idx > 0;

                if (isHidden) return null;

                return (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50 transition"
                  >
                    {/* Thread cell — only shown on first row of group */}
                    <td className="px-4 py-4">
                      {isGroupHeader ? (
                        <button
                          onClick={() => hasMultiple && toggleThread(group.threadId)}
                          className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold ${
                            hasMultiple
                              ? "cursor-pointer text-blue-700 hover:bg-blue-50"
                              : "cursor-default text-gray-500"
                          }`}
                          title={group.threadId}
                        >
                          {hasMultiple ? (
                            isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                          ) : (
                            <Link2 size={12} className="text-gray-400" />
                          )}
                          <span className="font-mono text-[10px] tracking-tight">
                            {group.threadId.slice(0, 14)}…
                          </span>
                          {hasMultiple && (
                            <span className="ml-1 rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
                              {group.requests.length}
                            </span>
                          )}
                        </button>
                      ) : (
                        <div className="pl-6 border-l-2 border-blue-200 ml-2">
                          <span className="text-[10px] font-mono text-gray-400">↳ same thread</span>
                        </div>
                      )}
                    </td>

                    {/* Request ID */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <Hash size={13} className="text-gray-400 shrink-0" />
                        <span className="font-mono text-sm font-semibold text-gray-700">
                          {request.requestId ?? (
                            <span className="text-gray-400 italic text-xs">Legacy</span>
                          )}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-900">{request.customerName}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[160px]">{request.customerEmail}</p>
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-700 max-w-xs">
                      <p className="truncate">{request.subject}</p>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <select
                        value={request.status}
                        onChange={(e) => handleStatusChange(request.id!, e.target.value)}
                        disabled={isReadOnly}
                        className={`rounded-full px-3 py-1 text-xs font-semibold border-0 outline-none ${isReadOnly ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'} ${statusColor[request.status] ?? "bg-gray-100 text-gray-700"}`}
                      >
                        <option>Open</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                      </select>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityColor[request.priority] ?? "bg-gray-100 text-gray-700"}`}>
                        {request.priority}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="rounded bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
                        >
                          View
                        </button>
                        {!isReadOnly && (
                          <>
                            <Link
                              href={`/requests/edit/${request.id}`}
                              className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700 transition"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(request.id!)}
                              className="rounded bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600 transition"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b pb-4">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-900">Request Details</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    <Hash size={11} /> {selectedRequest.requestId ?? "Legacy"}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                    <GitBranch size={11} /> {selectedRequest.threadId ?? deriveThreadId(selectedRequest.customerEmail)}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Thread Matching Info */}
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Thread Matching</p>
              <p className="text-sm text-gray-700">
                All requests from <span className="font-semibold">{selectedRequest.customerEmail}</span> share thread{" "}
                <span className="font-mono font-semibold text-blue-700">
                  {selectedRequest.threadId ?? deriveThreadId(selectedRequest.customerEmail)}
                </span>.
              </p>
              <p className="text-xs text-gray-500">
                {(() => {
                  const tid = selectedRequest.threadId ?? deriveThreadId(selectedRequest.customerEmail);
                  const count = requests.filter(
                    (r) => (r.threadId ?? deriveThreadId(r.customerEmail)) === tid
                  ).length;
                  return count > 1
                    ? `${count} requests matched to this thread.`
                    : "This is the only request in this thread.";
                })()}
              </p>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-gray-400 uppercase">Customer</p>
                <p className="font-semibold text-gray-900">{selectedRequest.customerName}</p>
                <p className="text-gray-500">{selectedRequest.customerEmail}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-gray-400 uppercase">Status & Priority</p>
                <div className="flex gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor[selectedRequest.status] ?? "bg-gray-100 text-gray-700"}`}>
                    {selectedRequest.status}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityColor[selectedRequest.priority] ?? "bg-gray-100 text-gray-700"}`}>
                    {selectedRequest.priority}
                  </span>
                </div>
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase">Subject</p>
              <p className="font-semibold text-gray-800">{selectedRequest.subject}</p>
            </div>

            {/* Message */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase">Message</p>
              <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto font-mono leading-relaxed">
                {selectedRequest.message}
              </div>
            </div>

            {/* Thread history */}
            {(() => {
              const tid = selectedRequest.threadId ?? deriveThreadId(selectedRequest.customerEmail);
              const relatedRequests = requests.filter(
                (r) => (r.threadId ?? deriveThreadId(r.customerEmail)) === tid && r.id !== selectedRequest.id
              );
              if (relatedRequests.length === 0) return null;
              return (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase">Other Requests in This Thread</p>
                  <div className="space-y-2">
                    {relatedRequests.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between rounded-lg border bg-gray-50 px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition"
                        onClick={() => setSelectedRequest(r)}
                      >
                        <div>
                          <span className="font-mono text-xs text-blue-600 font-semibold">{r.requestId ?? "Legacy"}</span>
                          <p className="text-gray-700 truncate max-w-sm">{r.subject}</p>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor[r.status] ?? "bg-gray-100 text-gray-700"}`}>
                          {r.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="flex justify-end border-t pt-4">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
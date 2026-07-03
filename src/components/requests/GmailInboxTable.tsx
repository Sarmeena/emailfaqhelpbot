"use client";

import { useEffect, useState } from "react";
import { Mail, CheckCircle, RefreshCw, AlertTriangle, ArrowRight, ArrowLeft } from "lucide-react";

interface GmailMessage {
  id: string;
  from: string;
  fromName: string;
  subject: string;
  date: string;
  snippet: string;
  body: string;
  status: "Imported" | "Unimported";
}

export default function GmailInboxTable() {
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [importingId, setImportingId] = useState<string | null>(null);
  const [importSuccessData, setImportSuccessData] = useState<{
    requestId: string;
    threadId: string;
    escalated: boolean;
    autoReply: string;
  } | null>(null);

  async function fetchMessages() {
    setLoading(true);
    try {
      const res = await fetch("/api/gmail/messages");
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  async function handleImport(msg: GmailMessage) {
    setImportingId(msg.id);
    try {
      const res = await fetch("/api/gmail/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: msg.id,
          from: msg.from,
          fromName: msg.fromName,
          subject: msg.subject,
          body: msg.body,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setImportSuccessData({
          requestId: data.requestId,
          threadId: data.threadId,
          escalated: data.escalated,
          autoReply: data.autoReply,
        });
        // Update list status locally
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: "Imported" } : m))
        );
      } else {
        alert(data.error || "Failed to import email.");
      }
    } catch (error) {
      console.error(error);
      alert("Error importing email.");
    } finally {
      setImportingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b bg-gray-50 px-6 py-4 rounded-t-2xl border border-gray-200">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Mail size={18} className="text-red-500 animate-pulse" />
          <span>Syncing Inbox</span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500 font-medium">{messages.length} Message(s) Available</span>
        </div>
        <button
          onClick={fetchMessages}
          disabled={loading}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition disabled:opacity-50"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          Sync Gmail
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border bg-white p-20 text-center text-gray-550 font-semibold shadow-sm">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary mb-3" />
          Fetching Gmail Inbox messages...
        </div>
      ) : messages.length === 0 ? (
        <div className="rounded-2xl border bg-white p-20 text-center text-gray-500 shadow-sm">
          No new messages in connected Gmail inbox.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">From</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Subject</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Preview</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-xs font-semibold text-gray-500 whitespace-nowrap">{msg.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-bold text-gray-800 text-sm">{msg.fromName}</p>
                      <p className="text-xs text-gray-400 font-mono">{msg.from}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800 max-w-[200px] truncate">{msg.subject}</td>
                    <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">{msg.snippet}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {msg.status === "Imported" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 border border-green-200">
                          <CheckCircle size={13} />
                          Imported
                        </span>
                      ) : (
                        <button
                          onClick={() => handleImport(msg)}
                          disabled={importingId !== null}
                          className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800 transition active:scale-95 disabled:opacity-60 shadow-sm"
                        >
                          {importingId === msg.id ? "Importing..." : "Import to Tickets"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Import Success details popup */}
      {importSuccessData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-2.5 border-b pb-4 text-green-700 font-bold text-xl">
              <CheckCircle size={24} />
              Ticket Synchronized Successfully
            </div>

            <div className="grid grid-cols-2 gap-4 border bg-gray-50 p-4 rounded-xl text-xs font-mono">
              <div>
                <span className="text-gray-400 block font-sans font-bold uppercase tracking-wider mb-1">Ticket ID</span>
                <span className="text-blue-700 font-bold text-sm bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{importSuccessData.requestId}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-sans font-bold uppercase tracking-wider mb-1">Email Thread ID</span>
                <span className="text-purple-700 font-bold text-sm bg-purple-50 px-2 py-0.5 rounded border border-purple-100">{importSuccessData.threadId}</span>
              </div>
            </div>

            {/* Escalation Alert */}
            {importSuccessData.escalated ? (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/50 p-4 text-xs">
                <AlertTriangle className="h-5 w-5 text-red-650 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-red-800 uppercase tracking-wide">Escalated to Human Agent</p>
                  <p className="text-red-700 font-semibold leading-relaxed">
                    This message matched escalation rules (Sensitive content detected or no matching knowledge FAQ found). An alert was logged, and the ticket priority set to HIGH.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50/30 p-4 text-xs text-green-800">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold uppercase tracking-wide">AI Auto-responded</p>
                  <p className="leading-relaxed">
                    This ticket matches approved FAQ articles. The AI reply was sent and ticket status changed to In Progress.
                  </p>
                </div>
              </div>
            )}

            {/* Auto Reply Content */}
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Response Sent to Customer</span>
              <div className="rounded-xl border bg-gray-50 p-4 text-xs text-gray-600 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed font-mono">
                {importSuccessData.autoReply}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setImportSuccessData(null)}
                className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

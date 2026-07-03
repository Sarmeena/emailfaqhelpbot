"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addRequest, generateRequestId, deriveThreadId } from "../../../services/firestore/requests";
import { Hash, GitBranch, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateRequestPage() {
  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [loading, setLoading] = useState(false);

  // After creation — show the generated IDs
  const [createdData, setCreatedData] = useState<{
    requestId: string;
    threadId: string;
  } | null>(null);

  // Live preview IDs based on email input
  const previewRequestId = generateRequestId();
  const previewThreadId = customerEmail
    ? deriveThreadId(customerEmail)
    : "THREAD-———";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await addRequest({
        customerName,
        customerEmail,
        subject,
        message,
        priority,
        status: "Open",
      });

      setCreatedData(result);
    } catch (error) {
      console.error(error);
      alert("Failed to create request.");
    }

    setLoading(false);
  }

  // Success screen
  if (createdData) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-10 shadow space-y-6 text-center">
          <div className="flex justify-center">
            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-9 w-9 text-green-600" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Request Created!</h1>
            <p className="mt-2 text-gray-500">Your support request has been submitted successfully.</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Hash size={18} className="text-blue-700" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Request ID</p>
                <p className="text-xl font-bold font-mono text-blue-700">{createdData.requestId}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <GitBranch size={18} className="text-purple-700" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Thread ID</p>
                <p className="text-sm font-semibold font-mono text-purple-700">{createdData.threadId}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  All requests from <strong>{customerEmail}</strong> share this thread
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => {
                setCreatedData(null);
                setCustomerName("");
                setCustomerEmail("");
                setSubject("");
                setMessage("");
                setPriority("Medium");
              }}
              className="rounded-xl border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Create Another
            </button>
            <button
              onClick={() => router.push("/requests")}
              className="rounded-xl bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 transition"
            >
              View All Requests
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/requests" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition">
            <ArrowLeft size={16} /> Back to Requests
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Request</h1>
            <p className="mt-1 text-gray-500 text-sm">A unique Request ID and Thread ID will be auto-generated.</p>
          </div>

          {/* Live ID Preview */}
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Hash size={15} className="text-blue-600 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase">Request ID (auto)</p>
                <p className="font-mono font-bold text-blue-700 text-base">{previewRequestId}</p>
              </div>
            </div>
            <div className="hidden sm:block w-px bg-gray-200" />
            <div className="flex items-center gap-2 text-sm">
              <GitBranch size={15} className="text-purple-600 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase">Thread ID (from email)</p>
                <p className={`font-mono font-bold text-sm ${customerEmail ? "text-purple-700" : "text-gray-400"}`}>
                  {previewThreadId}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Customer Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Customer Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Subject</label>
              <input
                type="text"
                placeholder="Describe your issue briefly"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Message</label>
              <textarea
                placeholder="Describe your issue in detail..."
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-700 py-3 text-sm font-semibold text-white hover:bg-blue-800 transition disabled:opacity-60"
            >
              {loading ? "Creating Request..." : "Create Request"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
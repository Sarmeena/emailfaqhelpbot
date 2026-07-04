"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { MoreVertical, CheckCircle2, ShieldAlert } from "lucide-react";

interface ConversationHeaderProps {
  conversationId: string;
  onStatusUpdated?: () => void;
}

export default function ConversationHeader({ conversationId, onStatusUpdated }: ConversationHeaderProps) {
  const [customerName, setCustomerName] = useState("");
  const [status, setStatus] = useState("Open");
  const [priority, setPriority] = useState("Medium");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!conversationId) {
      setCustomerName("");
      setStatus("Open");
      setPriority("Medium");
      return;
    }

    async function loadDetails() {
      setLoading(true);
      try {
        const docRef = doc(db, "conversations", conversationId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setCustomerName(data.customerName || "");
          setStatus(data.status || "Open");
        }

        // Fetch priority from requests
        const reqRef = doc(db, "requests", conversationId);
        const reqSnap = await getDoc(reqRef);
        if (reqSnap.exists()) {
          setPriority(reqSnap.data().priority || "Medium");
        }
      } catch (err) {
        console.error("Error loading header details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [conversationId]);

  async function handleStatusChange(newStatus: string) {
    if (!conversationId) return;
    setStatus(newStatus);
    try {
      await updateDoc(doc(db, "conversations", conversationId), {
        status: newStatus,
      });
      await updateDoc(doc(db, "requests", conversationId), {
        status: newStatus,
      });
      if (onStatusUpdated) onStatusUpdated();
      alert(`Ticket status marked as ${newStatus}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    }
  }

  if (!conversationId) {
    return (
      <header className="flex h-16 items-center border-b bg-white px-6 shadow-sm">
        <span className="text-sm font-semibold text-gray-400">Select a conversation to begin</span>
      </header>
    );
  }

  const priorityStyles: Record<string, string> = {
    High: "bg-red-50 text-red-700 border-red-100",
    Medium: "bg-yellow-50 text-yellow-700 border-yellow-100",
    Low: "bg-green-50 text-green-700 border-green-100",
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-4 min-w-0">
        <div>
          <h2 className="text-base font-bold text-gray-900 truncate">
            {loading ? "Loading..." : customerName || "Customer"}
          </h2>

          <div className="mt-1.5 flex items-center gap-2 flex-wrap">
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${priorityStyles[priority] || "bg-gray-50"}`}>
              Priority: {priority}
            </span>

            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
              status === "Resolved"
                ? "bg-green-100 text-green-700"
                : status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-blue-100 text-blue-700"
            }`}>
              Status: {status}
            </span>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {status !== "Resolved" && (
          <button
            onClick={() => handleStatusChange("Resolved")}
            className="flex items-center gap-1.5 rounded-xl bg-green-750 hover:bg-green-800 text-white text-xs font-bold px-4 py-2 transition shadow-sm cursor-pointer active:scale-95"
          >
            <CheckCircle2 size={14} />
            Resolve Ticket
          </button>
        )}

        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-100 cursor-pointer"
        >
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending">Pending</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>
    </header>
  );
}
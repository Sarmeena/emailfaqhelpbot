"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { MoreVertical, CheckCircle2, ShieldAlert, Menu } from "lucide-react";
import { useSidebar } from "../../../context/SidebarContext";

interface ConversationHeaderProps {
  conversationId: string;
  onStatusUpdated?: () => void;
}

export default function ConversationHeader({ conversationId, onStatusUpdated }: ConversationHeaderProps) {
  const { open } = useSidebar();
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

        // Fetch priority from requests (by threadId)
        const q = query(
          collection(db, "requests"),
          where("threadId", "==", conversationId)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docs = [...querySnapshot.docs];
          docs.sort((a: any, b: any) => {
            const aTime = a.data().createdAt?.seconds || a.data().createdAt?._seconds || 0;
            const bTime = b.data().createdAt?.seconds || b.data().createdAt?._seconds || 0;
            return bTime - aTime;
          });
          setPriority(docs[0].data().priority || "Medium");
        } else {
          // Fallback direct get (legacy)
          const reqRef = doc(db, "requests", conversationId);
          const reqSnap = await getDoc(reqRef);
          if (reqSnap.exists()) {
            setPriority(reqSnap.data().priority || "Medium");
          }
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

      // Update all requests sharing the same threadId
      const q = query(
        collection(db, "requests"),
        where("threadId", "==", conversationId)
      );
      const querySnapshot = await getDocs(q);
      const updatePromises = querySnapshot.docs.map((d) =>
        updateDoc(doc(db, "requests", d.id), { status: newStatus })
      );
      await Promise.all(updatePromises);

      // Fallback direct update (legacy)
      try {
        await updateDoc(doc(db, "requests", conversationId), {
          status: newStatus,
        });
      } catch (e) {}

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
        {/* Hamburger Menu on Mobile */}
        <button
          onClick={open}
          className="rounded-lg p-2 hover:bg-gray-100 md:hidden shrink-0"
          aria-label="Open Sidebar Menu"
        >
          <Menu className="h-6 w-6 text-blue-700" />
        </button>

        <div className="min-w-0">
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
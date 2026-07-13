"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Search } from "lucide-react";

import { Conversation, getConversations } from "../../../services/firestore/conversations";

interface ConversationHistoryProps {
  selectedConversation: string;
  onSelectConversation: (id: string, isExplicit?: boolean) => void;
  isVisible?: boolean;
}

export default function ConversationHistory({
  selectedConversation,
  onSelectConversation,
  isVisible = false,
}: ConversationHistoryProps) {
  const { user, role, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user || !role) return;

    async function loadConversations() {
      try {
        const data = await getConversations();
        
        // Sort recent chats at the top by updatedAt seconds timestamp
        const sorted = [...data].sort((a: any, b: any) => {
          const aTime = a.updatedAt?.seconds || a.updatedAt?._seconds || 0;
          const bTime = b.updatedAt?.seconds || b.updatedAt?._seconds || 0;
          return bTime - aTime;
        });

        setConversations(sorted);
        if (sorted.length > 0 && !selectedConversation) {
          onSelectConversation(sorted[0].id!, false);
        }
      } catch (error: any) {
        console.error(error);
        if (error.code === "permission-denied" || error.message?.includes("permission")) {
          console.error(`[Firestore Permission Failure] ConversationHistory query denied. UID: ${user?.uid}, Role: ${role}`);
        }
      } finally {
        setLoading(false);
      }
    }

    loadConversations();
  }, [selectedConversation, onSelectConversation, user, role, authLoading]);

  const formatChatTime = (updatedAt: any) => {
    if (!updatedAt) return "";
    try {
      const date = updatedAt.seconds 
        ? new Date(updatedAt.seconds * 1000) 
        : updatedAt._seconds 
        ? new Date(updatedAt._seconds * 1000)
        : new Date(updatedAt);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return "";
    }
  };

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
      "bg-blue-150 text-blue-800 border-blue-200",
      "bg-indigo-150 text-indigo-800 border-indigo-200",
      "bg-orange-100 text-orange-850 border-orange-200",
      "bg-purple-150 text-purple-800 border-purple-200",
      "bg-teal-150 text-teal-800 border-teal-200",
    ];
    let hash = 0;
    for (let i = 0; i < (name || "").length; i++) {
      hash = (name || "").charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (authLoading || !user || !role || loading) {
    return (
      <aside className={`w-full lg:w-80 shrink-0 border-r bg-white items-center justify-center ${
        isVisible ? "flex" : "hidden lg:flex"
      }`}>
        Loading conversations...
      </aside>
    );
  }

  return (
    <aside className={`w-full lg:w-80 shrink-0 flex-col overflow-y-auto border-r bg-white ${
      isVisible ? "flex" : "hidden lg:flex"
    }`}>
      {/* Search */}
      <div className="border-b p-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search chats..."
            className="w-full rounded-xl border bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-550"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1">
        {conversations.map((chat) => {
          const initials = getInitials(chat.customerName);
          const avatarColor = getAvatarColor(chat.customerName);

          return (
            <div
              key={chat.id}
              onClick={() => onSelectConversation(chat.id!, true)}
              className={`cursor-pointer border-b p-4 transition hover:bg-gray-50 flex items-start gap-3 ${
                selectedConversation === chat.id ? "border-l-4 border-blue-600 bg-blue-50" : ""
              }`}
            >
              {/* Colored Initials Avatar */}
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-black border ${avatarColor}`}>
                {initials}
              </div>

              {/* Chat details */}
              <div className="flex-1 min-w-0">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <h3 className="font-bold text-gray-900 text-sm truncate flex-1">{chat.customerName}</h3>
                  <span className="text-[10px] text-gray-400 font-bold shrink-0">
                    {formatChatTime(chat.updatedAt)}
                  </span>
                </div>

                <p className="text-xs text-gray-500 truncate font-semibold mb-1">
                  {chat.subject}
                </p>

                {chat.requestId && (
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">
                    {chat.requestId}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="truncate text-xs text-gray-600 font-medium flex-1 max-w-[120px] md:max-w-none">
                    {chat.lastMessage}
                  </p>

                  <div className="flex gap-1 shrink-0">
                    {chat.priority && (
                      <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide border ${
                        chat.priority === "High"
                          ? "bg-red-50 text-red-705 border-red-200"
                          : chat.priority === "Medium"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-250"
                          : "bg-green-50 text-green-700 border-green-200"
                      }`}>
                        {chat.priority}
                      </span>
                    )}

                    <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide border ${
                      chat.status === "Resolved"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : chat.status === "Pending"
                        ? "bg-yellow-50 text-yellow-750 border-yellow-250"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}>
                      {chat.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

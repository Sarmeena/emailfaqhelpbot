"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { Conversation } from "../../../services/firestore/conversations";

interface ConversationHistoryProps {
  selectedConversation: string;
  onSelectConversation: (id: string) => void;
}

export default function ConversationHistory({
  selectedConversation,
  onSelectConversation,
}: ConversationHistoryProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConversations() {
      try {
        const res = await fetch("/api/conversations");
        if (res.ok) {
          const json = await res.json();
          const data = json.conversations || [];
          setConversations(data);
          if (data.length > 0) {
            onSelectConversation(data[0].id!);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadConversations();
  }, []);
if (loading) {
  return (
    <aside className="hidden w-80 shrink-0 border-r bg-white lg:flex items-center justify-center">
      Loading conversations...
    </aside>
  );
}
  return (
    <aside className="hidden w-80 shrink-0 flex-col overflow-y-auto border-r bg-white lg:flex">
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
            className="w-full rounded-xl border bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1">
        {conversations.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectConversation(chat.id!)}
            className={`cursor-pointer border-b p-4 transition hover:bg-gray-50 ${
              selectedConversation === chat.id ? "border-l-4 border-blue-600 bg-blue-50" : ""
            }`}
          >
            <div className="mb-1 flex items-start justify-between">
              <h3 className="font-semibold">{chat.customerName}</h3>
              <p className="text-xs text-gray-400">
  {chat.subject}
</p>

              <span className={`rounded-full px-2 py-1 text-xs font-medium ${
    chat.status === "Open"
      ? "bg-green-100 text-green-700"
      : chat.status === "Pending"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-blue-100 text-blue-700"
  }`}
>
  {chat.status}
              </span>
            </div>

            <p className="mt-2 truncate text-sm text-gray-600">
  {chat.lastMessage}
</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

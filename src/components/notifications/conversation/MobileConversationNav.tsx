"use client";

import { MessageCircle, History, Sparkles, User } from "lucide-react";
import { useSidebar } from "../../../context/SidebarContext";

interface MobileConversationNavProps {
  activeTab: "chat" | "history" | "ai";
  onTabChange: (tab: "chat" | "history" | "ai") => void;
}

export default function MobileConversationNav({
  activeTab,
  onTabChange,
}: MobileConversationNavProps) {
  const { open } = useSidebar();

  return (
    <nav className="fixed bottom-0 left-0 z-40 flex h-16 w-full items-center justify-around border-t bg-white shadow-lg md:hidden">
      <button
        onClick={() => onTabChange("chat")}
        className={`flex flex-col items-center rounded-lg px-3 py-1 transition ${
          activeTab === "chat" ? "text-blue-750 font-bold" : "text-gray-500 hover:text-blue-750"
        }`}
      >
        <MessageCircle size={20} />
        <span className="text-xs font-semibold">Chat</span>
      </button>

      <button
        onClick={() => onTabChange("history")}
        className={`flex flex-col items-center rounded-lg px-3 py-1 transition ${
          activeTab === "history" ? "text-blue-750 font-bold" : "text-gray-500 hover:text-blue-750"
        }`}
      >
        <History size={20} />
        <span className="text-xs font-semibold">History</span>
      </button>

      <button
        onClick={() => onTabChange("ai")}
        className={`relative flex flex-col items-center rounded-lg px-3 py-1 transition ${
          activeTab === "ai" ? "text-blue-750 font-bold" : "text-gray-500 hover:text-blue-750"
        }`}
      >
        <Sparkles size={20} />
        <span className="text-xs font-semibold">AI</span>
        <span className="absolute right-2 top-0 h-2 w-2 rounded-full bg-red-500"></span>
      </button>

      <button
        onClick={open}
        className="flex flex-col items-center rounded-lg px-3 py-1 text-gray-500 hover:text-blue-750 transition"
      >
        <User size={20} />
        <span className="text-xs font-semibold">Profile</span>
      </button>
    </nav>
  );
}
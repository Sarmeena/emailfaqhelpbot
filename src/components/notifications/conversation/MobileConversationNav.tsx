import { MessageCircle, History, Sparkles, User } from "lucide-react";

export default function MobileConversationNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-40 flex h-16 w-full items-center justify-around border-t bg-white shadow-lg md:hidden">
      <button className="flex flex-col items-center rounded-lg px-3 py-1 text-blue-700">
        <MessageCircle size={20} />
        <span className="text-xs font-medium">Chat</span>
      </button>

      <button className="flex flex-col items-center px-3 py-1 text-gray-500">
        <History size={20} />
        <span className="text-xs">History</span>
      </button>

      <button className="relative flex flex-col items-center px-3 py-1 text-blue-700">
        <Sparkles size={24} />
        <span className="text-xs">AI</span>

        <span className="absolute right-2 top-0 h-2 w-2 rounded-full bg-red-500"></span>
      </button>

      <button className="flex flex-col items-center px-3 py-1 text-gray-500">
        <User size={20} />
        <span className="text-xs">Profile</span>
      </button>
    </nav>
  );
}
import { MoreVertical } from "lucide-react";

export default function ConversationHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Name
          </h2>

          <div className="mt-1 flex items-center gap-2">
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
              Active
            </span>

            <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
              Priority: High
            </span>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <button className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100">
        <MoreVertical size={20} />
      </button>
    </header>
  );
}
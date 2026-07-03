import { Plus } from "lucide-react";

export default function RequestFloatingButton() {
  return (
    <button className="fixed bottom-20 right-6 z-50 flex h-14 items-center justify-center gap-2 rounded-2xl bg-blue-700 px-6 text-white shadow-xl transition-all hover:-translate-y-1 hover:bg-blue-800 active:scale-95 md:bottom-8 md:right-8">
      <Plus size={22} />

      <span className="font-semibold">
        Create Request
      </span>
    </button>
  );
}
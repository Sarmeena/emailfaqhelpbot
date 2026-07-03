"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

export default function BroadcastFAB() {
  return (
    <Link href="/createbroadcast" className="fixed bottom-6 right-6 z-50">
      <button
        type="button"
        aria-label="Create Broadcast"
        className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          bg-blue-600
          text-white
          shadow-lg
          transition-all
          duration-200
          hover:bg-blue-700
          hover:shadow-xl
          active:scale-95
          md:hidden
        "
      >
        <Plus className="h-6 w-6" />
      </button>
    </Link>
  );
}
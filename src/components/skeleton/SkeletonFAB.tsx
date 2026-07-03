"use client";

import { Plus } from "lucide-react";

export default function SkeletonFAB() {
  return (
    <button
      type="button"
      className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-lg transition-all hover:scale-105 active:scale-95 md:bottom-10"
    >
      <Plus className="h-7 w-7" />
    </button>
  );
}
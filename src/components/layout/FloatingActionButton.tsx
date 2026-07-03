"use client";

import { Bot } from "lucide-react";

export default function FloatingActionButton() {
  return (
    <button className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-xl transition hover:scale-105 active:scale-95">
      <Bot />
    </button>
  );
}
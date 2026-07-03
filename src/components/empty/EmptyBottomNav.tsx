"use client";

import {
  House,
  Mail,
  CircleHelp,
  Bell,
} from "lucide-react";

export default function EmptyBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-xl border-t border-outline-variant bg-surface-container-lowest px-margin-mobile py-3 shadow-[0px_-4px_20px_rgba(0,0,0,0.05)] md:hidden">
      {/* Home */}
      <button className="flex flex-col items-center gap-1 text-on-surface-variant transition hover:text-primary">
        <House className="h-5 w-5" />
        <span className="text-[10px]">Home</span>
      </button>

      {/* Inbox */}
      <button className="flex flex-col items-center gap-1 text-on-surface-variant transition hover:text-primary">
        <Mail className="h-5 w-5" />
        <span className="text-[10px]">Inbox</span>
      </button>

      {/* Active */}
      <button className="flex flex-col items-center gap-1 rounded-full bg-primary-container px-4 py-2 text-on-primary shadow-sm">
        <CircleHelp className="h-5 w-5 fill-current" />
        <span className="text-[10px] font-semibold">
          FAQs
        </span>
      </button>

      {/* Alerts */}
      <button className="flex flex-col items-center gap-1 text-on-surface-variant transition hover:text-primary">
        <Bell className="h-5 w-5" />
        <span className="text-[10px]">Alerts</span>
      </button>
    </nav>
  );
}
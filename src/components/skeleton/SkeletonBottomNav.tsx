"use client";

import {
  Home,
  Inbox,
  CircleHelp,
  Bell,
} from "lucide-react";

export default function SkeletonBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-outline-variant bg-surface-container-lowest px-margin-mobile py-3 shadow-[0px_-4px_20px_rgba(0,0,0,0.05)] md:hidden">
      {/* Home (Active) */}
      <button
        type="button"
        className="flex flex-col items-center rounded-full bg-primary-container/10 px-3 py-2 text-primary"
      >
        <Home className="h-5 w-5 fill-current" />

        <span className="mt-1 text-[10px] font-bold">
          Home
        </span>
      </button>

      {/* Inbox */}
      <button
        type="button"
        className="flex flex-col items-center text-on-surface-variant"
      >
        <Inbox className="h-5 w-5" />

        <span className="mt-1 text-[10px]">
          Inbox
        </span>
      </button>

      {/* FAQ */}
      <button
        type="button"
        className="flex flex-col items-center text-on-surface-variant"
      >
        <CircleHelp className="h-5 w-5" />

        <span className="mt-1 text-[10px]">
          FAQs
        </span>
      </button>

      {/* Alerts */}
      <button
        type="button"
        className="flex flex-col items-center text-on-surface-variant"
      >
        <Bell className="h-5 w-5" />

        <span className="mt-1 text-[10px]">
          Alerts
        </span>
      </button>
    </nav>
  );
}
"use client";

import {
  Home,
  Ticket,
  TriangleAlert,
  Settings,
} from "lucide-react";

export default function ErrorBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-xl border-t border-outline-variant bg-surface-container-lowest px-margin-mobile py-sm shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden">
      <button className="flex flex-col items-center text-on-surface-variant transition active:scale-95">
        <Home className="h-5 w-5" />
        <span className="mt-1 text-label-sm">Home</span>
      </button>

      <button className="flex flex-col items-center text-on-surface-variant transition active:scale-95">
        <Ticket className="h-5 w-5" />
        <span className="mt-1 text-label-sm">Tickets</span>
      </button>

      <button className="flex flex-col items-center rounded-full bg-primary-container px-4 py-1 text-on-primary-container transition active:scale-95">
        <TriangleAlert className="h-5 w-5 fill-current" />
        <span className="mt-1 text-label-sm font-semibold">
          Errors
        </span>
      </button>

      <button className="flex flex-col items-center text-on-surface-variant transition active:scale-95">
        <Settings className="h-5 w-5" />
        <span className="mt-1 text-label-sm">Settings</span>
      </button>
    </nav>
  );
}
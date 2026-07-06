"use client";

import Link from "next/link";
import {
  Home,
  Inbox,
  CircleHelp,
  Settings,
} from "lucide-react";

export default function SettingsBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t border-outline-variant bg-surface-container-lowest py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] md:hidden">
      <Link href="/dashboard" className="flex flex-col items-center gap-1 text-on-surface-variant">
        <Home className="h-5 w-5" />
        <span className="text-[10px] uppercase">Home</span>
      </Link>

      <Link href="/conversation" className="flex flex-col items-center gap-1 text-on-surface-variant">
        <Inbox className="h-5 w-5" />
        <span className="text-[10px] uppercase">Inbox</span>
      </Link>

      <Link href="/faqs" className="flex flex-col items-center gap-1 text-on-surface-variant">
        <CircleHelp className="h-5 w-5" />
        <span className="text-[10px] uppercase">FAQs</span>
      </Link>

      <Link href="/settings" className="flex flex-col items-center gap-1 font-semibold text-primary">
        <Settings className="h-5 w-5" />
        <span className="text-[10px] uppercase">
          Settings
        </span>
      </Link>
    </nav>
  );
}
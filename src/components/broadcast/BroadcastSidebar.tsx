"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Inbox,
  CircleHelp,
  Megaphone,
  Settings,
} from "lucide-react";

export default function BroadcastSidebar() {
  return (
    <aside className="fixed left-0 top-16 hidden h-[calc(100vh-4rem)] w-64 border-r border-gray-200 bg-white shadow-sm md:flex md:flex-col">

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-6">

        <Link href="/dashboard" className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition hover:bg-gray-100 hover:text-blue-600">
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>

        <Link href="/conversation" className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition hover:bg-gray-100 hover:text-blue-600">
          <Inbox className="h-5 w-5" />
          <span>Inbox</span>
        </Link>

        <Link href="/faqs" className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition hover:bg-gray-100 hover:text-blue-600">
          <CircleHelp className="h-5 w-5" />
          <span>Knowledge Base</span>
        </Link>

        {/* Active Menu */}
        <Link href="/broadcasts" className="flex w-full items-center gap-3 rounded-lg bg-blue-600 px-4 py-3 text-left font-semibold text-white shadow-sm">
          <Megaphone className="h-5 w-5" />
          <span>Campaigns</span>
        </Link>

      </nav>

      {/* Bottom Card */}
      <div className="border-t border-gray-200 p-6">

        <div className="mb-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />

          <span className="text-sm text-gray-500">
            System Online
          </span>
        </div>

        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700">
          <Settings className="h-4 w-4" />
          Agent Settings
        </button>

      </div>

    </aside>
  );
}
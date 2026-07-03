"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Inbox,
  Bot,
  BookOpen,
} from "lucide-react";

export default function EditFAQSidebar() {
  return (
    <aside className="fixed top-16 left-0 hidden h-[calc(100vh-4rem)] w-64 border-r border-gray-200 bg-white md:flex md:flex-col">

      {/* Logo */}
      <div className="border-b border-gray-100 px-6 py-6">
        <h2 className="text-2xl font-bold text-blue-700">
          Email Bot
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Support Dashboard
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">

        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-blue-700"
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="font-medium">Dashboard</span>
        </Link>

        <Link
          href="/tickets"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-blue-700"
        >
          <Inbox className="h-5 w-5" />
          <span className="font-medium">Inbox</span>
        </Link>

        <Link
          href="/assistant"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-blue-700"
        >
          <Bot className="h-5 w-5" />
          <span className="font-medium">AI Assistant</span>
        </Link>

        <Link
          href="/faqs"
          className="flex items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm"
        >
          <BookOpen className="h-5 w-5" />
          <span>Knowledge Base</span>
        </Link>

      </nav>

      {/* Profile */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 font-semibold text-white">
            SA
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              Support Agent
            </p>

            <p className="text-xs uppercase tracking-wider text-green-600">
              ● Online
            </p>
          </div>

        </div>
      </div>

    </aside>
  );
}
"use client";

import { Bell, ChevronDown, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 z-40 h-16 border-b bg-white shadow-sm">
      <div className="flex h-full items-center justify-between px-4 md:px-8">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700">
              🤖
            </div>

            <h2 className="text-lg font-bold text-blue-700">
              Email Bot
            </h2>
          </div>

          {/* Desktop Search */}
          <div className="relative hidden md:block">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search tickets, FAQs or clients..."
              className="w-96 rounded-full border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button className="rounded-full p-2 hover:bg-gray-100">
            <Bell size={22} />
          </button>

          <button className="rounded-full p-2 hover:bg-gray-100 md:hidden">
            <Search size={22} />
          </button>

          <div className="hidden cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100 md:flex">
            <div className="text-right">
              <p className="text-sm font-semibold">Alex Support</p>
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Super Admin
              </p>
            </div>

            <img
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className="h-10 w-10 rounded-full"
            />

            <ChevronDown size={18} />
          </div>
        </div>
      </div>
    </header>
  );
}
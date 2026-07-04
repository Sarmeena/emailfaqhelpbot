"use client";

import Link from "next/link";
import { Menu, Plus, User, ChevronDown } from "lucide-react";

export default function RequestHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button className="md:hidden">
          <Menu className="h-6 w-6 text-blue-700" />
        </button>

        <h2 className="hidden text-2xl font-bold text-blue-700 md:block">
          Customer Requests
        </h2>

        <h2 className="text-2xl font-bold text-blue-700 md:hidden">
          Requests
        </h2>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* New Request Button */}
        <Link
          href="/requests/create"
          className="flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
        >
          <Plus size={18} />
          <span className="hidden md:block">
            New Request
          </span>
        </Link>

        {/* Profile */}
        <div className="hidden cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100 md:flex">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-800">
              Admin
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 border border-gray-200">
            <User size={20} />
          </div>

          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  );
}
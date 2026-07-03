"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, Settings, Plus } from "lucide-react";

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

        {/* Search */}
        <div className="hidden items-center rounded-full border bg-gray-50 px-4 py-2 md:flex">
          <Search className="mr-2 h-4 w-4 text-gray-500" />

          <input
            type="text"
            placeholder="Search tickets..."
            className="w-64 bg-transparent outline-none"
          />
        </div>

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
        <Image
          src="/profile.png"
          alt="Profile"
          width={40}
          height={40}
          className="rounded-full border-2 border-blue-600"
        />

        {/* Settings */}
        <button>
          <Settings className="h-6 w-6 text-gray-600 hover:text-blue-700" />
        </button>

      </div>
    </header>
  );
}
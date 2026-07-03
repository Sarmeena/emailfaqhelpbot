"use client";

import { Menu, Bell, Search, ChevronDown } from "lucide-react";

export default function FAQHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 md:left-64 z-50 h-16 bg-white border-b shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">

        {/* Left */}
        <div className="flex items-center gap-4">

          {/* Mobile Menu */}
          <button className="rounded-lg p-2 hover:bg-gray-100 lg:hidden">
            <Menu size={22} />
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            FAQ Management
          </h1>

        </div>

        {/* Center Search */}
        <div className="mx-8 hidden max-w-xl flex-1 lg:block">
          <div className="relative">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search knowledge base..."
              className="
                w-full
                rounded-full
                border
                border-gray-300
                bg-gray-50
                py-2.5
                pl-11
                pr-4
                text-sm
                outline-none
                transition
                focus:border-blue-600
                focus:ring-2
                focus:ring-blue-100
              "
            />

          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          {/* Notification */}
          <button className="relative rounded-full p-2 hover:bg-gray-100">
            <Bell size={22} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Profile */}
          <button className="hidden items-center gap-3 rounded-xl px-2 py-1 hover:bg-gray-100 md:flex">

            <img
              src="https://i.pravatar.cc/40?img=12"
              alt="Support Agent"
              className="h-10 w-10 rounded-full object-cover"
            />

            <div className="text-left">
              <p className="text-sm font-semibold">
                Alex Support
              </p>

              <p className="text-xs text-gray-500">
                Super Admin
              </p>
            </div>

            <ChevronDown size={16} />

          </button>

        </div>

      </div>
    </header>
  );
}
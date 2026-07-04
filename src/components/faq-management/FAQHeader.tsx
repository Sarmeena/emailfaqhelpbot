"use client";

import { Menu, Search, ChevronDown, User } from "lucide-react";

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

          {/* Profile */}
          <button className="hidden items-center gap-3 rounded-xl px-2 py-1 hover:bg-gray-100 md:flex">

            <div className="text-left">
              <p className="text-sm font-bold text-gray-800">
                Admin
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 border border-gray-200">
              <User size={20} />
            </div>

            <ChevronDown size={16} />

          </button>

        </div>

      </div>
    </header>
  );
}
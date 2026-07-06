"use client";

import { Menu, ChevronDown, User } from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";

export default function FAQHeader() {
  const { open } = useSidebar();

  return (
    <header className="fixed top-0 left-0 right-0 md:left-64 z-50 h-16 bg-white border-b shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">

        {/* Left */}
        <div className="flex items-center gap-4">

          {/* Mobile Menu */}
          <button 
            onClick={open}
            className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
            aria-label="Open Sidebar Menu"
          >
            <Menu size={22} className="text-blue-700" />
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            FAQ Management
          </h1>

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
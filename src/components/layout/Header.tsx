"use client";

import { ChevronDown, User, Menu } from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";

export default function Header() {
  const { open } = useSidebar();

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 z-40 h-16 border-b bg-white shadow-sm">
      <div className="flex h-full items-center justify-between px-4 md:px-8">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          {/* Hamburger Menu on Mobile */}
          <button
            onClick={open}
            className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
            aria-label="Open Sidebar Menu"
          >
            <Menu className="h-6 w-6 text-blue-700" />
          </button>

          {/* Mobile Logo */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700">
              🤖
            </div>

            <h2 className="text-lg font-bold text-blue-700">
              Email Bot
            </h2>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          <div className="hidden cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100 md:flex">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">Admin</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 border border-gray-200">
              <User size={20} />
            </div>

            <ChevronDown size={18} />
          </div>
        </div>
      </div>
    </header>
  );
}
"use client";

import {
  LayoutDashboard,
  Inbox,
  CircleHelp,
  Megaphone,
} from "lucide-react";

export default function EmptySidebar() {
  return (
    <aside className="fixed top-16 left-0 hidden h-[calc(100vh-64px)] w-72 flex-col border-r border-outline-variant bg-surface-container-low p-md md:flex">
      {/* Navigation */}
      <nav className="space-y-2">
        <button className="flex w-full items-center gap-md rounded-lg p-md text-label-md text-on-surface-variant transition-all hover:bg-surface-container-high">
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </button>

        <button className="flex w-full items-center gap-md rounded-lg p-md text-label-md text-on-surface-variant transition-all hover:bg-surface-container-high">
          <Inbox className="h-5 w-5" />
          Inbox
        </button>

        {/* Active */}
        <button className="flex w-full items-center gap-md rounded-lg bg-secondary-container p-md font-bold text-label-md text-on-secondary-container shadow-sm">
          <CircleHelp className="h-5 w-5 fill-current" />
          Knowledge Base
        </button>

        <button className="flex w-full items-center gap-md rounded-lg p-md text-label-md text-on-surface-variant transition-all hover:bg-surface-container-high">
          <Megaphone className="h-5 w-5" />
          Campaigns
        </button>
      </nav>

      {/* Bottom Status */}
      <div className="mt-auto border-t border-outline-variant pt-md">
        <div className="flex items-center justify-between rounded-lg bg-surface-container-high p-sm">
          <span className="text-label-md text-on-surface-variant">
            Availability
          </span>

          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              defaultChecked
              className="peer sr-only"
            />

            <div className="h-6 w-11 rounded-full bg-surface-variant after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full" />
          </label>
        </div>
      </div>
    </aside>
  );
}
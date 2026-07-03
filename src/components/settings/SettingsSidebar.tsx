"use client";

import {
  LayoutDashboard,
  Inbox,
  CircleHelp,
  Settings,
} from "lucide-react";

export default function SettingsSidebar() {
  return (
    <aside className="fixed top-16 left-0 hidden h-[calc(100vh-64px)] w-72 flex-col border-r border-outline-variant bg-surface-container-low p-md shadow-md md:flex">
      {/* Navigation */}
      <nav className="space-y-2">
        <button className="flex w-full items-center gap-md rounded-lg p-md text-label-md text-on-surface-variant transition-all hover:translate-x-1 hover:bg-surface-container-high">
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </button>

        <button className="flex w-full items-center gap-md rounded-lg p-md text-label-md text-on-surface-variant transition-all hover:translate-x-1 hover:bg-surface-container-high">
          <Inbox className="h-5 w-5" />
          Inbox
        </button>

        <button className="flex w-full items-center gap-md rounded-lg p-md text-label-md text-on-surface-variant transition-all hover:translate-x-1 hover:bg-surface-container-high">
          <CircleHelp className="h-5 w-5" />
          Knowledge Base
        </button>

        <button className="flex w-full items-center gap-md rounded-lg bg-primary p-md font-bold text-label-md text-on-primary shadow-sm">
          <Settings className="h-5 w-5" />
          Settings
        </button>
      </nav>

      {/* Bottom Status */}
      <div className="mt-auto border-t border-outline-variant pt-md">
        <div className="rounded-lg bg-surface-container-high p-sm">
          <p className="mb-xs text-label-sm uppercase tracking-wider text-on-surface-variant">
            System Status
          </p>

          <div className="flex items-center gap-xs">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span className="text-label-md text-on-surface">
              Bot Online
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
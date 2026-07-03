"use client";

import {
  LayoutDashboard,
  Inbox,
  TriangleAlert,
  Settings,
} from "lucide-react";

export default function ErrorSidebar() {
  return (
    <aside className="fixed left-0 top-16 hidden h-[calc(100vh-64px)] w-72 flex-col border-r border-outline-variant bg-surface-container-low p-md md:flex">
      <nav className="space-y-2">
        <button className="flex w-full items-center gap-md rounded-lg p-md text-label-md text-on-surface-variant transition hover:bg-surface-container-high">
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </button>

        <button className="flex w-full items-center gap-md rounded-lg p-md text-label-md text-on-surface-variant transition hover:bg-surface-container-high">
          <Inbox className="h-5 w-5" />
          Tickets
        </button>

        <button className="flex w-full items-center gap-md rounded-lg bg-primary p-md font-bold text-label-md text-on-primary shadow-sm">
          <TriangleAlert className="h-5 w-5" />
          Error Library
        </button>

        <button className="flex w-full items-center gap-md rounded-lg p-md text-label-md text-on-surface-variant transition hover:bg-surface-container-high">
          <Settings className="h-5 w-5" />
          Settings
        </button>
      </nav>

      <div className="mt-auto border-t border-outline-variant pt-md">
        <div className="rounded-lg bg-surface-container-high p-md">
          <p className="mb-2 text-label-sm uppercase tracking-wider text-on-surface-variant">
            System Status
          </p>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />

            <span className="text-label-md text-on-surface">
              All Services Operational
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
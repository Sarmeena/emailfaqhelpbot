"use client";

import {
  LayoutDashboard,
  Inbox,
  CircleHelp,
  Megaphone,
  User,
} from "lucide-react";

export default function SkeletonSidebar() {
  return (
    <aside className="fixed left-0 top-16 hidden h-[calc(100vh-64px)] w-72 flex-col border-r border-outline-variant bg-surface-container-low md:flex">
      {/* Profile */}
      <div className="p-6">
        <div className="flex items-center gap-3 rounded-xl bg-surface-container-lowest p-3 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-fixed">
            <User className="h-6 w-6 text-on-secondary-fixed" />
          </div>

          <div>
            <p className="text-label-md font-bold text-on-surface">
              Alex Miller
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />

              <span className="text-label-sm text-primary">
                Online
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {/* Active */}
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg bg-secondary-container px-4 py-3 font-medium text-on-secondary-container shadow-sm"
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </button>

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-on-surface-variant transition hover:bg-surface-container-high"
        >
          <Inbox className="h-5 w-5" />
          Inbox
        </button>

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-on-surface-variant transition hover:bg-surface-container-high"
        >
          <CircleHelp className="h-5 w-5" />
          Knowledge Base
        </button>

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-on-surface-variant transition hover:bg-surface-container-high"
        >
          <Megaphone className="h-5 w-5" />
          Campaigns
        </button>
      </nav>
    </aside>
  );
}
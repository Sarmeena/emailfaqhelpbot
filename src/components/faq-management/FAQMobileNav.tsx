"use client";

import Link from "next/link";
import {
  Home,
  CircleHelp,
  BarChart3,
  Settings,
} from "lucide-react";

export default function FAQMobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex h-20 w-full items-center justify-around rounded-t-xl border-t border-outline-variant bg-surface px-4 py-2 shadow-lg lg:hidden">
      {/* Home */}
      <Link
        href="/"
        className="flex flex-col items-center justify-center text-on-surface-variant transition hover:bg-surface-container active:scale-90"
      >
        <Home className="h-6 w-6" />
        <span className="mt-1 text-label-sm">Home</span>
      </Link>

      {/* FAQs (Active) */}
      <Link
        href="/faq-management"
        className="flex flex-col items-center justify-center rounded-2xl bg-primary-container px-4 py-1 text-on-primary-container active:scale-90"
      >
        <CircleHelp className="h-6 w-6 fill-current" />
        <span className="mt-1 text-label-sm font-medium">
          FAQs
        </span>
      </Link>

      {/* Stats */}
      <Link
        href="/analytics"
        className="flex flex-col items-center justify-center text-on-surface-variant transition hover:bg-surface-container active:scale-90"
      >
        <BarChart3 className="h-6 w-6" />
        <span className="mt-1 text-label-sm">Stats</span>
      </Link>

      {/* Settings */}
      <Link
        href="/settings"
        className="flex flex-col items-center justify-center text-on-surface-variant transition hover:bg-surface-container active:scale-90"
      >
        <Settings className="h-6 w-6" />
        <span className="mt-1 text-label-sm">Settings</span>
      </Link>
    </nav>
  );
}
"use client";

import { LogOut } from "lucide-react";

export default function SettingsLogout() {
  return (
    <section className="pt-6">
      <button
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-error/10 p-4 font-semibold text-error shadow-sm transition-all hover:bg-error hover:text-on-error active:scale-95"
      >
        <LogOut className="h-5 w-5" />

        Logout Session
      </button>

      <p className="mt-4 text-center text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
        Version 2.4.0-build.82
      </p>
    </section>
  );
}
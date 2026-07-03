"use client";

import { KeyRound, LogOut, ShieldCheck } from "lucide-react";

export default function SettingsSecurity() {
  return (
    <>
      {/* Security */}
      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>

          <h2 className="text-title-lg font-semibold text-on-surface">
            Security & Access
          </h2>
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <button
            type="button"
            className="flex items-center justify-center gap-3 rounded-lg border border-outline-variant px-6 py-3 text-body-md font-medium text-on-surface transition hover:bg-surface-container-low"
          >
            <KeyRound className="h-5 w-5" />
            Change Password
          </button>

          <p className="max-w-md text-body-sm text-on-surface-variant">
            Update your login credentials regularly to keep your account
            secure.
          </p>
        </div>
      </section>

      {/* Logout */}
      <section className="pt-6">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-error/10 p-4 font-semibold text-error transition hover:bg-error hover:text-on-error active:scale-95"
        >
          <LogOut className="h-5 w-5" />
          Logout Session
        </button>

        <p className="mt-4 text-center text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
          Version 2.4.0-build.82
        </p>
      </section>
    </>
  );
}
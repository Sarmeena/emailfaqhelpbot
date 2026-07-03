"use client";

import { Moon, Sun } from "lucide-react";

export default function SettingsAppearance() {
  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Sun className="h-5 w-5 text-primary" />
        </div>

        <h2 className="text-title-lg font-semibold text-on-surface">
          Appearance
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Light */}
        <button
          type="button"
          className="rounded-lg border-2 border-primary bg-primary/5 p-4 transition"
        >
          <div className="flex flex-col items-center gap-2">
            <Sun className="h-6 w-6 text-primary" />

            <span className="font-semibold text-primary">
              Light
            </span>
          </div>
        </button>

        {/* Dark */}
        <button
          type="button"
          className="rounded-lg border border-outline-variant p-4 transition hover:border-primary"
        >
          <div className="flex flex-col items-center gap-2">
            <Moon className="h-6 w-6 text-on-surface-variant" />

            <span className="text-on-surface-variant">
              Dark
            </span>
          </div>
        </button>
      </div>
    </section>
  );
}
"use client";

import { Mail } from "lucide-react";

export default function SettingsEmail() {
  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Mail className="h-5 w-5 text-primary" />
        </div>

        <h2 className="text-title-lg font-semibold text-on-surface">
          Email Service (SMTP)
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* SMTP Server */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-label-sm font-medium text-outline">
            SMTP Server
          </label>

          <input
            type="text"
            placeholder="smtp.gmail.com"
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Port */}
        <div>
          <label className="mb-2 block text-label-sm font-medium text-outline">
            Port
          </label>

          <input
            type="text"
            placeholder="587"
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Username */}
        <div className="md:col-span-3">
          <label className="mb-2 block text-label-sm font-medium text-outline">
            Username
          </label>

          <input
            type="email"
            placeholder="support@example.com"
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
    </section>
  );
}
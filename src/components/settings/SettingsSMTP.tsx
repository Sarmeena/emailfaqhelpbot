"use client";

import { Mail } from "lucide-react";

export default function SettingsSMTP() {
  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <div className="rounded-lg bg-primary/10 p-2">
          <Mail className="h-5 w-5 text-primary" />
        </div>

        <h2 className="text-title-lg font-semibold text-on-surface">
          Email Service (SMTP)
        </h2>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* SMTP Server */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-label-sm text-on-surface-variant">
            SMTP Server
          </label>

          <input
            type="text"
            placeholder="smtp.gmail.com"
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Port */}
        <div>
          <label className="mb-2 block text-label-sm text-on-surface-variant">
            Port
          </label>

          <input
            type="number"
            placeholder="587"
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Username */}
        <div className="md:col-span-3">
          <label className="mb-2 block text-label-sm text-on-surface-variant">
            Username
          </label>

          <input
            type="email"
            placeholder="support@example.com"
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Password */}
        <div className="md:col-span-3">
          <label className="mb-2 block text-label-sm text-on-surface-variant">
            Password
          </label>

          <input
            type="password"
            placeholder="••••••••••••"
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Sender Email */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-label-sm text-on-surface-variant">
            Sender Email
          </label>

          <input
            type="email"
            placeholder="support@company.com"
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Encryption */}
        <div>
          <label className="mb-2 block text-label-sm text-on-surface-variant">
            Encryption
          </label>

          <select
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            defaultValue="TLS"
          >
            <option>TLS</option>
            <option>SSL</option>
            <option>None</option>
          </select>
        </div>
      </div>
    </section>
  );
}
"use client";

import { User } from "lucide-react";

export default function SettingsProfile() {
  return (
    <>
      {/* Page Heading */}
      <div className="mb-10">
        <h1 className="text-headline-lg font-bold text-on-surface">
          Settings
        </h1>

        <p className="mt-2 text-body-md text-on-surface-variant">
          Manage your account and integration configurations.
        </p>
      </div>

      {/* Profile Card */}
      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
        {/* Card Header */}
        <div className="mb-6 flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2">
            <User className="h-5 w-5 text-primary" />
          </div>

          <h2 className="text-title-lg font-semibold text-on-surface">
            Profile Information
          </h2>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-label-sm text-on-surface-variant">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Alex Miller"
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-label-sm text-on-surface-variant">
              Email Address
            </label>

            <input
              type="email"
              placeholder="alex@example.com"
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </section>
    </>
  );
}
"use client";

import { Bell } from "lucide-react";

export default function SettingsNotifications() {
  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Bell className="h-5 w-5 text-primary" />
        </div>

        <h2 className="text-title-lg font-semibold text-on-surface">
          Notifications
        </h2>
      </div>

      <div className="space-y-6">
        {/* Email Summary */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-on-surface">
              Email Summaries
            </p>

            <p className="text-label-sm text-on-surface-variant">
              Weekly bot performance report
            </p>
          </div>

          <input
            type="checkbox"
            defaultChecked
            className="h-5 w-5 accent-primary"
          />
        </div>

        {/* Push Alerts */}
        <div className="flex items-center justify-between border-t border-outline-variant pt-6">
          <div>
            <p className="font-medium text-on-surface">
              Push Alerts
            </p>

            <p className="text-label-sm text-on-surface-variant">
              Critical error notifications
            </p>
          </div>

          <input
            type="checkbox"
            className="h-5 w-5 accent-primary"
          />
        </div>
      </div>
    </section>
  );
}
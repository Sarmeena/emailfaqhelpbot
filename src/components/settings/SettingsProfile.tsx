"use client";

import { User } from "lucide-react";

export default function SettingsProfile() {
  return (
    <>
      {/* Page Heading */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Settings
          </h1>
          <p className="mt-1 text-sm text-gray-500 font-medium">
            Manage your account and integration configurations.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-150 rounded-xl p-4 text-xs font-semibold text-blue-900 space-y-1.5 shrink-0 shadow-sm">
          <div><span className="font-bold text-blue-700">Project:</span> Email FAQ Help Bot</div>
          <div><span className="font-bold text-blue-700">User:</span> Admin</div>
          <div><span className="font-bold text-blue-700">Email:</span> emailfaqhelpbot@gmail.com</div>
        </div>
      </div>

      {/* Profile Card */}
      <section className="rounded-xl border border-outline-variant bg-white p-6 shadow-sm">
        {/* Card Header */}
        <div className="mb-6 flex items-center gap-2">
          <div className="rounded-lg bg-blue-100 p-2">
            <User className="h-5 w-5 text-blue-700" />
          </div>

          <h2 className="text-lg font-bold text-gray-900">
            Profile Information
          </h2>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-xs font-bold text-gray-500 uppercase tracking-wide">
              Full Name
            </label>

            <input
              type="text"
              readOnly
              value="Admin"
              className="w-full rounded-lg border bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none font-medium cursor-not-allowed"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-gray-500 uppercase tracking-wide">
              Email Address
            </label>

            <input
              type="email"
              readOnly
              value="emailfaqhelpbot@gmail.com"
              className="w-full rounded-lg border bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none font-medium cursor-not-allowed"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-gray-500 uppercase tracking-wide">
              Project Name
            </label>

            <input
              type="text"
              readOnly
              value="Email FAQ Help Bot"
              className="w-full rounded-lg border bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none font-medium cursor-not-allowed"
            />
          </div>
        </div>
      </section>
    </>
  );
}
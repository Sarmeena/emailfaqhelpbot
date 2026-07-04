"use client";

import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import MobileNav from "../../components/layout/MobileNav";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import {
  Sparkles,
  Layers,
  ChevronDown,
  Info,
  CheckCircle,
  AlertTriangle,
  Play,
  Mail,
  Users,
  Copy,
  Check,
} from "lucide-react";

export default function UILibraryPage() {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const copyButtonCode = `<button className="rounded-xl bg-blue-700 px-5 py-3 text-white font-semibold shadow hover:bg-blue-800 transition active:scale-[0.98]">
  Primary Action
</button>`;

  const copyBadgeCode = `<span className="text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded border bg-red-50 text-red-700 border-red-200">
  High Priority
</span>`;

  const copyInputCode = `<input
  type="text"
  placeholder="Enter value..."
  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition"
/>`;

  const copyCardCode = `<div className="rounded-xl border bg-white p-6 shadow-sm">
  <p className="text-sm font-semibold text-gray-500">Metric</p>
  <h3 className="mt-2 text-3xl font-bold">1,240</h3>
</div>`;

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Right Side */}
        <div className="flex flex-1 flex-col md:ml-64">
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main className="mt-16 flex-1 p-6 pb-24 md:pb-8">
            <div className="mx-auto max-w-7xl">
              {/* Page Title */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
                  <Layers className="text-blue-700 h-8 w-8" />
                  UI Library & Showroom
                </h1>
                <p className="mt-1 text-gray-500">
                  Reusable UI design tokens, components, forms, and alerts implemented across the application.
                </p>
              </div>

              {/* Grid Layout of Components */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* 1. Buttons & Controls */}
                <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-lg font-bold text-gray-900">Buttons & Actions</h3>
                    <button
                      onClick={() => handleCopy(copyButtonCode, "btn")}
                      className="text-gray-400 hover:text-blue-700 flex items-center gap-1 text-xs font-semibold"
                    >
                      {copiedText === "btn" ? (
                        <>
                          <Check size={14} className="text-green-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          Copy HTML
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3 items-center">
                    <button className="rounded-xl bg-blue-700 px-5 py-3 text-white font-semibold shadow hover:bg-blue-800 transition active:scale-[0.98]">
                      Primary Button
                    </button>
                    <button className="rounded-xl bg-gray-150 border px-5 py-3 text-gray-700 font-semibold hover:bg-gray-200 transition active:scale-[0.98]">
                      Secondary Button
                    </button>
                    <button className="rounded-xl border border-blue-600 px-5 py-3 text-blue-700 font-semibold hover:bg-blue-50 transition active:scale-[0.98]">
                      Outline Button
                    </button>
                    <button className="rounded-xl bg-red-600 px-5 py-3 text-white font-semibold hover:bg-red-700 transition active:scale-[0.98]">
                      Danger Button
                    </button>
                    <button
                      disabled
                      className="rounded-xl bg-gray-200 px-5 py-3 text-gray-400 cursor-not-allowed font-semibold"
                    >
                      Disabled Button
                    </button>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border font-mono text-[11px] text-gray-650 whitespace-pre-wrap overflow-x-auto">
                    {copyButtonCode}
                  </div>
                </div>

                {/* 2. Badges & Indicators */}
                <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-lg font-bold text-gray-900">Badges & Statuses</h3>
                    <button
                      onClick={() => handleCopy(copyBadgeCode, "badge")}
                      className="text-gray-400 hover:text-blue-700 flex items-center gap-1 text-xs font-semibold"
                    >
                      {copiedText === "badge" ? (
                        <>
                          <Check size={14} className="text-green-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          Copy HTML
                        </>
                      )}
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-gray-400 font-semibold block mb-2">Priority Levels</span>
                      <div className="flex gap-2">
                        <span className="text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded border bg-red-50 text-red-700 border-red-205">
                          High Priority
                        </span>
                        <span className="text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded border bg-yellow-50 text-yellow-700 border-yellow-250">
                          Medium Priority
                        </span>
                        <span className="text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded border bg-green-50 text-green-700 border-green-205">
                          Low Priority
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 font-semibold block mb-2">Ticket Statuses</span>
                      <div className="flex gap-2">
                        <span className="text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded border bg-red-50 text-red-750 border-red-200">
                          Open
                        </span>
                        <span className="text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded border bg-blue-50 text-blue-700 border-blue-200">
                          In Progress
                        </span>
                        <span className="text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded border bg-green-50 text-green-700 border-green-200">
                          Resolved
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border font-mono text-[11px] text-gray-650 whitespace-pre-wrap overflow-x-auto">
                    {copyBadgeCode}
                  </div>
                </div>

                {/* 3. Inputs & Forms */}
                <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-lg font-bold text-gray-900">Form Inputs & Controls</h3>
                    <button
                      onClick={() => handleCopy(copyInputCode, "input")}
                      className="text-gray-400 hover:text-blue-700 flex items-center gap-1 text-xs font-semibold"
                    >
                      {copiedText === "input" ? (
                        <>
                          <Check size={14} className="text-green-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          Copy HTML
                        </>
                      )}
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1">Standard Input</label>
                      <input
                        type="text"
                        placeholder="Enter value..."
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1">Dropdown Selection</label>
                      <div className="relative">
                        <select className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition">
                          <option>Select Option 1</option>
                          <option>Select Option 2</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border font-mono text-[11px] text-gray-650 whitespace-pre-wrap overflow-x-auto">
                    {copyInputCode}
                  </div>
                </div>

                {/* 4. Display Cards */}
                <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-lg font-bold text-gray-900">Display Cards</h3>
                    <button
                      onClick={() => handleCopy(copyCardCode, "card")}
                      className="text-gray-400 hover:text-blue-700 flex items-center gap-1 text-xs font-semibold"
                    >
                      {copiedText === "card" ? (
                        <>
                          <Check size={14} className="text-green-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          Copy HTML
                        </>
                      )}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border bg-white p-5 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="rounded-lg p-2 bg-blue-50">
                          <Mail size={18} className="text-blue-700" />
                        </div>
                        <span className="text-[10px] text-gray-400 font-semibold">Active</span>
                      </div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Total Mailbox</p>
                      <h3 className="text-2xl font-bold">1,824</h3>
                    </div>
                    <div className="rounded-xl border bg-white p-5 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="rounded-lg p-2 bg-green-50">
                          <Users size={18} className="text-green-600" />
                        </div>
                        <span className="text-[10px] text-gray-400 font-semibold">Updated</span>
                      </div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Active Users</p>
                      <h3 className="text-2xl font-bold">859</h3>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border font-mono text-[11px] text-gray-650 whitespace-pre-wrap overflow-x-auto">
                    {copyCardCode}
                  </div>
                </div>
              </div>

              {/* 5. Dialogs/Popups Showroom Card */}
              <div className="rounded-xl border bg-white p-6 shadow-sm mt-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="text-blue-700" />
                    Overlay & Modal Dialogs
                  </h3>
                  <p className="text-sm text-gray-500">
                    Modals, confirmations, loading screens, and custom alert systems are styled with absolute layouts and backdrop blur overlays.
                  </p>
                </div>
                <button
                  onClick={() => setShowDemoModal(true)}
                  className="rounded-xl bg-blue-600 px-6 py-3.5 text-white font-semibold flex items-center gap-2 hover:bg-blue-700 transition active:scale-95 shadow shrink-0"
                >
                  <Play size={16} />
                  Trigger Test Modal
                </button>
              </div>
            </div>
          </main>
        </div>

        {/* Demo Modal Overlay */}
        {showDemoModal && (
          <div className="fixed inset-0 z-99 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-50 p-2 text-blue-700">
                  <Info size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Modal Component Demo</h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                This is a live preview of the modal overlay component. It uses a backdrop-blur overlay for background focus and absolute center alignment.
              </p>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="rounded-xl bg-gray-100 border px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-250 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  Acknowledge
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </ProtectedRoute>
  );
}

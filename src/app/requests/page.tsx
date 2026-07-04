"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import MobileNav from "../../components/layout/MobileNav";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import RequestHeader from "../../components/requests/RequestHeader";
import FilterBar from "../../components/requests/FilterBar";
import RequestsTable from "../../components/requests/RequestsTable";
import RequestCards from "../../components/requests/RequestCards";
import { Ticket, Mail, RefreshCw } from "lucide-react";

export default function RequestsPage() {
  const [syncKey, setSyncKey] = useState(0);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    async function triggerGmailSync() {
      setSyncing(true);
      try {
        const res = await fetch("/api/gmail/messages");
        if (res.ok) {
          // Trigger reload of requests table
          setSyncKey((prev) => prev + 1);
        }
      } catch (e) {
        console.error("Gmail background sync error:", e);
      } finally {
        setSyncing(false);
      }
    }
    triggerGmailSync();
  }, []);

  const [filter, setFilter] = useState("All");

  return (
    <ProtectedRoute>
      <>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="min-h-screen bg-gray-100 md:ml-64">
          {/* Header */}
          <RequestHeader />

          <div className="mx-auto max-w-7xl p-6">
            {/* Syncing Status Indicator */}
            {syncing && (
              <div className="mb-6 flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-150 p-4 text-sm text-blue-700 animate-pulse w-fit">
                <RefreshCw size={16} className="animate-spin text-blue-700" />
                <span className="font-semibold">Syncing Gmail Inbox...</span>
              </div>
            )}

            {/* Mobile Search */}
            <div className="mb-6 md:hidden">
              <input
                type="text"
                placeholder="Search your requests..."
                className="w-full rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Filters */}
            <FilterBar activeFilter={filter} onFilterChange={setFilter} />

            {/* Desktop Table */}
            <RequestsTable key={syncKey} filter={filter} />

            {/* Mobile Cards */}
            <RequestCards key={`cards-${syncKey}`} filter={filter} />
          </div>
        </main>

        {/* Mobile Navigation */}
        <MobileNav />
      </>
    </ProtectedRoute>
  );
}
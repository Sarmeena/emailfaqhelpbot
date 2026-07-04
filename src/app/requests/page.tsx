"use client";

import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import MobileNav from "../../components/layout/MobileNav";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import RequestHeader from "../../components/requests/RequestHeader";
import FilterBar from "../../components/requests/FilterBar";
import RequestsTable from "../../components/requests/RequestsTable";
import RequestCards from "../../components/requests/RequestCards";
import GmailInboxTable from "../../components/requests/GmailInboxTable";
import { Ticket, Mail } from "lucide-react";

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState<"tickets" | "gmail">("tickets");

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
          {/* Tabs */}
          <div className="mb-6 flex border-b border-gray-200 bg-white rounded-xl shadow-sm overflow-hidden p-1.5 gap-2 self-start md:self-auto w-fit">
            <button
              onClick={() => setActiveTab("tickets")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === "tickets"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-650 hover:bg-gray-100"
              }`}
            >
              <Ticket size={16} />
              All Tickets
            </button>
            <button
              onClick={() => setActiveTab("gmail")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === "gmail"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-655 hover:bg-gray-100"
              }`}
            >
              <Mail size={16} />
              Gmail Sync Inbox
            </button>
          </div>

          {activeTab === "tickets" ? (
            <>
              {/* Mobile Search */}
              <div className="mb-6 md:hidden">
                <input
                  type="text"
                  placeholder="Search your requests..."
                  className="w-full rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Filters */}
              <FilterBar />

              {/* Desktop Table */}
              <RequestsTable />

              {/* Mobile Cards */}
              <RequestCards />
            </>
          ) : (
            <GmailInboxTable />
          )}
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </>
    </ProtectedRoute>
  );
}
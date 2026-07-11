"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

import Sidebar from "../../components/layout/Sidebar";
import FAQHeader from "../../components/faq-management/FAQHeader";
import FAQFilters from "../../components/faq-management/FAQFilters";
import FAQTable from "../../components/faq-management/FAQTable";
import FAQMobileList from "../../components/faq-management/FAQMobileList";
import FAQMobileNav from "../../components/faq-management/FAQMobileNav";

export default function FAQManagementPage() {
  const { role } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Right Side */}
        <div className="flex flex-1 flex-col md:ml-64">
          {/* Header */}
          <FAQHeader />

          {/* Page */}
          <main className="mx-auto max-w-7xl px-6 py-8 mt-16 pb-24 md:pb-8">

          {/* Title */}
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                FAQ Management
              </h1>

              <p className="mt-2 text-gray-500">
                Manage your knowledge base and AI-powered responses.
              </p>
            </div>

            <div className="flex gap-3 self-start md:self-auto">
              <Link
                href="/faqs/portal"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-gray-700 font-semibold shadow hover:bg-gray-50 transition active:scale-95"
              >
                View FAQ Portal
              </Link>

              {role !== "viewer" && (
                <Link
                  href="/faq/new"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-white font-semibold shadow hover:bg-blue-800 transition active:scale-95"
                >
                  <Plus size={18} />
                  Add FAQ
                </Link>
              )}
            </div>

          </div>

          {/* Filters */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

            <FAQFilters
              search={search}
              onSearchChange={setSearch}
              category={category}
              onCategoryChange={setCategory}
              status={status}
              onStatusChange={setStatus}
            />

          </div>

          {/* Desktop Table */}
          <div className="hidden rounded-xl border border-gray-200 bg-white shadow-sm md:block">

            <FAQTable
              search={search}
              category={category}
              status={status}
            />

          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">
            <FAQMobileList />
          </div>

        </main>
      </div>
    </div>

      <FAQMobileNav />
    </ProtectedRoute>
  );
}
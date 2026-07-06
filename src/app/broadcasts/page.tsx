import Link from "next/link";
import { Plus } from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import BroadcastStats from "../../components/broadcast/BroadcastStats";
import BroadcastTable from "../../components/broadcast/BroadcastTable";
import BroadcastMobileCards from "../../components/broadcast/BroadcastMobileCards";
import BroadcastBottomNav from "../../components/broadcast/BroadcastBottomNav";
import BroadcastFAB from "../../components/broadcast/BroadcastFAB";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { Suspense } from "react";
export default function BroadcastPage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <div className="flex flex-1 flex-col md:ml-64">
          <Header />

          <main className="mt-16 w-full p-8 pb-24 md:pb-8">
            {/* Page Header */}
            <div className="p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="mb-2 text-4xl font-bold text-gray-900">
                  Broadcasts
                </h2>

                <p className="text-body-md text-on-surface-variant">
                  Manage and track your email campaign performance.
                </p>
              </div>

              <Link
                href="/createbroadcast"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-blue-700 transition active:scale-95"
              >
                <Plus className="h-5 w-5" />
                <span>New Broadcast</span>
              </Link>
            </div>

            {/* Stats */}
            <BroadcastStats />

            {/* Responsive Table & Mobile Cards */}
            <BroadcastTable />
          </main>
        </div>
      </div>

      <BroadcastBottomNav />
      <BroadcastFAB />
    </ProtectedRoute>
  );
}
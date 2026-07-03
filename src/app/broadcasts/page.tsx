import Link from "next/link";
import { Plus } from "lucide-react";
import BroadcastHeader from "../../components/broadcast/BroadcastHeader";
import BroadcastSidebar from "../../components/broadcast/BroadcastSidebar";
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
      <>
        <BroadcastHeader />

        <div className="flex h-[calc(100vh-64px)]">
          <BroadcastSidebar />

          <main className="pt-16 md:ml-64 w-full">
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

            {/* Desktop */}
            <div className="hidden lg:block">
              <BroadcastTable />
            </div>

            {/* Mobile */}
            <div className="lg:hidden">
              <BroadcastMobileCards />
            </div>
          </main>
        </div>

        <BroadcastBottomNav />
        <BroadcastFAB />
      </>
    </ProtectedRoute>
  );
}
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import StatsGrid from "../../components/dashboard/StatsGrid";
import RecentRequests from "../../components/dashboard/RecentRequests";
import AIInsightCard from "../../components/dashboard/AIInsightCard";
import TrendingFaqs from "../../components/dashboard/TrendingFaqs";
import BroadcastTable from "../../components/dashboard/BroadcastTable";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import MobileNav from "../../components/layout/MobileNav";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <div className="flex flex-1 flex-col md:ml-64">

        {/* Header */}
        <Header />

        {/* Main */}
        <main className="mt-16 flex-1 p-6">

          {/* Dashboard Title */}
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>
              <h1 className="text-4xl font-bold">
                Dashboard
              </h1>

              <p className="mt-1 text-gray-500">
                Welcome back! Here is what happening today.
              </p>
            </div>

          </div>

          {/* Stats */}
          <StatsGrid />

          {/* Main Grid */}
          <div className="mt-8 grid gap-6 lg:grid-cols-3">

            <div className="space-y-6 lg:col-span-2">
              <RecentRequests />
              <BroadcastTable />
            </div>

            <div className="space-y-6">
              <AIInsightCard />
              <TrendingFaqs />
            </div>

          </div>

        </main>

      </div>

      <MobileNav />

    </div>
    </ProtectedRoute>
  );
}
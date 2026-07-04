"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import MobileNav from "../../components/layout/MobileNav";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import {
  BarChart3,
  TrendingUp,
  Inbox,
  CheckCircle,
  Clock,
  Radio,
  FileText,
  AlertTriangle,
  Mail,
  User,
} from "lucide-react";

interface AnalyticsData {
  totalRequests: number;
  totalFaqs: number;
  totalBroadcasts: number;
  openRequests: number;
  resolvedRequests: number;
  inProgressRequests: number;
  peakHour: string;
  topFaqs: Array<{ id: string; question: string; usage: number }>;
  priorityBreakdown: {
    high: number;
    medium: number;
    low: number;
  };
  sourceBreakdown: {
    gmail: number;
    manual: number;
  };
  gmailStatus: {
    connected: boolean;
    isSimulated: boolean;
    watchExpiration: number | null;
    email: string;
  };
  recentActivity: Array<{
    id: string;
    customerName: string;
    customerEmail: string;
    subject: string;
    status: string;
    priority: string;
    source: string;
    createdAt: string;
  }>;
  chartData: Array<{
    date: string;
    count: number;
  }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/analytics");
        if (res.ok) {
          const json = await res.json();
          setData(json.stats);
        }
      } catch (err) {
        console.error("Failed to load analytics data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen bg-gray-100">
          <Sidebar />
          <div className="flex flex-1 flex-col md:ml-64">
            <Header />
            <main className="mt-16 flex-1 flex items-center justify-center p-6">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <p className="text-sm font-semibold text-gray-500">Loading Analytics Dashboard...</p>
              </div>
            </main>
          </div>
          <MobileNav />
        </div>
      </ProtectedRoute>
    );
  }

  const stats = data || {
    totalRequests: 0,
    totalFaqs: 0,
    totalBroadcasts: 0,
    openRequests: 0,
    resolvedRequests: 0,
    inProgressRequests: 0,
    peakHour: "No activity data",
    topFaqs: [],
    priorityBreakdown: { high: 0, medium: 0, low: 0 },
    sourceBreakdown: { gmail: 0, manual: 0 },
    gmailStatus: { connected: false, isSimulated: false, watchExpiration: null, email: "Not Connected" },
    recentActivity: [],
    chartData: [],
  };

  const cards = [
    {
      title: "Total Tickets",
      value: stats.totalRequests,
      icon: Inbox,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-700",
      desc: "All incoming requests",
    },
    {
      title: "Action Required",
      value: stats.openRequests + stats.inProgressRequests,
      icon: AlertTriangle,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      desc: "Open / In Progress",
    },
    {
      title: "Resolved Tickets",
      value: stats.resolvedRequests,
      icon: CheckCircle,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      desc: "Completed requests",
    },
    {
      title: "Peak Hour",
      value: stats.peakHour.includes(" (") ? stats.peakHour.split(" (")[0] : stats.peakHour,
      icon: Clock,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-650",
      desc: stats.peakHour.includes(" (") ? stats.peakHour.split(" (")[1].replace(")", "") : "Traffic Peak",
    },
  ];

  const totalPriority = stats.priorityBreakdown.high + stats.priorityBreakdown.medium + stats.priorityBreakdown.low || 1;
  const highPercentage = Math.round((stats.priorityBreakdown.high / totalPriority) * 100);
  const mediumPercentage = Math.round((stats.priorityBreakdown.medium / totalPriority) * 100);
  const lowPercentage = Math.round((stats.priorityBreakdown.low / totalPriority) * 100);

  const totalSource = stats.sourceBreakdown.gmail + stats.sourceBreakdown.manual || 1;
  const gmailPercentage = Math.round((stats.sourceBreakdown.gmail / totalSource) * 100);
  const manualPercentage = Math.round((stats.sourceBreakdown.manual / totalSource) * 100);

  const maxChartCount = Math.max(...stats.chartData.map((d) => d.count), 1);

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
                  <BarChart3 className="text-blue-700 h-8 w-8" />
                  Analytics & Reports
                </h1>
                <p className="mt-1 text-gray-500">
                  Real-time ticket volumes, response distribution, and system connection health.
                </p>
              </div>

              {/* Top Stats Cards */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
                {cards.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div className={`rounded-lg p-2 ${item.iconBg}`}>
                          <Icon size={22} className={item.iconColor} />
                        </div>
                        <span className="text-xs text-gray-400 font-semibold">{item.desc}</span>
                      </div>
                      <p className="text-sm text-gray-500 font-medium">{item.title}</p>
                      <h3 className="mt-2 text-3xl font-bold text-gray-900">{item.value}</h3>
                    </div>
                  );
                })}
              </div>

              {/* Middle Charts & Metrics */}
              <div className="grid gap-6 lg:grid-cols-3 mb-8">
                {/* 7-Day Ticket Trend Chart */}
                <div className="rounded-xl border bg-white p-6 shadow-sm lg:col-span-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="text-blue-700 h-5 w-5" />
                    Incoming Ticket Volume (Last 7 Days)
                  </h3>
                  <div className="flex h-64 items-end gap-3 pt-6 border-b border-gray-100">
                    {stats.chartData.map((d, idx) => {
                      const heightPercent = Math.max(5, Math.round((d.count / maxChartCount) * 100));
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                          <div className="text-xs font-semibold text-gray-600 mb-2">{d.count}</div>
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className="w-full bg-blue-600 rounded-t-lg min-h-[10px] transition-all duration-500 hover:bg-blue-700 relative group"
                          >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] rounded py-1 px-2 opacity-0 group-hover:opacity-100 pointer-events-none transition whitespace-nowrap shadow">
                              {d.count} Tickets
                            </div>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-2 font-medium truncate max-w-full text-center">
                            {d.date}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Ticket Status & Priority Breakdowns */}
                <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-4">Tickets by Priority</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                          <span>High</span>
                          <span>{stats.priorityBreakdown.high} ({highPercentage}%)</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div style={{ width: `${highPercentage}%` }} className="h-full bg-red-500 rounded-full" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                          <span>Medium</span>
                          <span>{stats.priorityBreakdown.medium} ({mediumPercentage}%)</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div style={{ width: `${mediumPercentage}%` }} className="h-full bg-yellow-500 rounded-full" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                          <span>Low</span>
                          <span>{stats.priorityBreakdown.low} ({lowPercentage}%)</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div style={{ width: `${lowPercentage}%` }} className="h-full bg-green-500 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-4">Support Channels</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                          <span>Gmail Sync Inbox</span>
                          <span>{stats.sourceBreakdown.gmail} ({gmailPercentage}%)</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div style={{ width: `${gmailPercentage}%` }} className="h-full bg-indigo-600 rounded-full" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                          <span>Manual / Portal</span>
                          <span>{stats.sourceBreakdown.manual} ({manualPercentage}%)</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div style={{ width: `${manualPercentage}%` }} className="h-full bg-blue-500 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lower Section: FAQs & Recent Activity & Webhook Status */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Popular FAQs */}
                <div className="rounded-xl border bg-white p-6 shadow-sm lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="text-blue-700 h-5 w-5" />
                    Top Performing FAQ Matches
                  </h3>
                  <div className="space-y-4">
                    {stats.topFaqs.length > 0 ? (
                      stats.topFaqs.map((faq, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-sm font-semibold text-gray-800">
                            <span className="truncate max-w-[85%]">{faq.question}</span>
                            <span className="text-blue-700 shrink-0">{faq.usage} matches</span>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${Math.min(100, (faq.usage / (stats.totalRequests || 1)) * 100)}%` }}
                              className="h-full bg-blue-600 rounded-full"
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 italic text-center py-6 text-sm">No FAQ usage stats recorded.</p>
                    )}
                  </div>
                </div>

                {/* System Watcher status */}
                <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                      <Radio className="text-blue-700 h-5 w-5" />
                      Gmail Watch Sync
                    </h3>
                    <div className="rounded-xl bg-gray-50 border p-4 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Status</span>
                        {stats.gmailStatus.connected ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                            ● Connected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded border">
                            ○ Disconnected
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Mailbox</span>
                        <span className="font-semibold text-gray-800 truncate max-w-[60%]">
                          {stats.gmailStatus.email}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Mode</span>
                        <span className="font-semibold text-gray-800">
                          {stats.gmailStatus.isSimulated ? "Simulated Sandbox" : "Live Production"}
                        </span>
                      </div>
                      {stats.gmailStatus.watchExpiration && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 font-medium">Expiration</span>
                          <span className="font-semibold text-gray-800 text-xs">
                            {new Date(stats.gmailStatus.watchExpiration).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="pt-4 text-[11px] text-gray-400 leading-normal">
                    This module reports live mailbox sync and Pub/Sub webhook registrations setup via System Settings.
                  </div>
                </div>
              </div>

              {/* Recent Activity Table */}
              <div className="rounded-xl border bg-white p-6 shadow-sm mt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="text-blue-700 h-5 w-5" />
                  Recent Support Activity
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-xs text-gray-400 font-bold uppercase">
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Subject</th>
                        <th className="py-3 px-4">Source</th>
                        <th className="py-3 px-4">Priority</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                      {stats.recentActivity.length > 0 ? (
                        stats.recentActivity.map((activity, idx) => (
                          <tr key={idx} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-xs">
                                {activity.customerName.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{activity.customerName}</p>
                                <p className="text-[11px] text-gray-400">{activity.customerEmail}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4 truncate max-w-[180px] font-medium text-gray-850">
                              {activity.subject}
                            </td>
                            <td className="py-3 px-4 font-semibold text-xs text-gray-500">
                              {activity.source}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded border ${
                                  activity.priority === "High"
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : activity.priority === "Medium"
                                    ? "bg-yellow-50 text-yellow-700 border-yellow-250"
                                    : "bg-green-50 text-green-700 border-green-200"
                                }`}
                              >
                                {activity.priority}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded border ${
                                  activity.status === "Resolved"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : activity.status === "In Progress"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-red-50 text-red-700 border-red-250"
                                }`}
                              >
                                {activity.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-400 italic">
                            No incoming ticket activity recorded.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </ProtectedRoute>
  );
}

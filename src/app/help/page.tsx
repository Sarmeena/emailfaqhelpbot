"use client";

import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import MobileNav from "../../components/layout/MobileNav";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { HelpCircle, Mail, BookOpen, Settings, Users, Radio, Shield } from "lucide-react";

export default function HelpPage() {
  const sections = [
    {
      title: "Incoming Tickets & Requests",
      icon: Mail,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-700",
      desc: "Tickets are generated automatically when a customer emails your connected Gmail inbox. You can view, assign priority, review AI-drafted replies, or type a custom message in the ticket detail screen.",
    },
    {
      title: "Knowledge Base (FAQs)",
      icon: BookOpen,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      desc: "Manage the source data used by the bot to draft answers. Add, edit, or delete FAQ articles. The AI scans this database first to answer incoming user emails before escalating to agents.",
    },
    {
      title: "Real-time Gmail Sync",
      icon: Radio,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      desc: "Connected accounts are monitored using Google Cloud Pub/Sub Webhooks. Turn on webhook watches in Settings to receive and auto-respond to messages in real-time.",
    },
    {
      title: "Email Campaigns (Broadcasts)",
      icon: Users,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-650",
      desc: "Draft and send updates or newsletters to selected recipient groups. The system connects to the Gmail API send endpoint to deliver your messages and records detailed delivery statistics.",
    },
  ];

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
            <div className="mx-auto max-w-4xl">
              {/* Page Title */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
                  <HelpCircle className="text-blue-700 h-8 w-8 animate-bounce" />
                  Help & Documentation Center
                </h1>
                <p className="mt-1 text-gray-500">
                  Quick help, system guides, and workspace overview instructions.
                </p>
              </div>

              {/* Grid of Sections */}
              <div className="grid gap-6 md:grid-cols-2 mb-8">
                {sections.map((sec, idx) => {
                  const Icon = sec.icon;
                  return (
                    <div key={idx} className="rounded-xl border bg-white p-6 shadow-sm space-y-4 hover:shadow-md transition">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-lg p-2 ${sec.iconBg} ${sec.iconColor}`}>
                          <Icon size={20} />
                        </div>
                        <h3 className="font-bold text-gray-900 text-base">{sec.title}</h3>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{sec.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Troubleshooting Card */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-6 space-y-3">
                <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                  <Shield size={20} className="text-blue-750" />
                  Access & Security Settings
                </h3>
                <p className="text-sm text-blue-800 leading-relaxed">
                  If real-time notifications are not appearing or broadcasts fail, check if the Gmail Access Token is expired in the settings panel. Google OAuth tokens expire after 60 minutes and are refreshed automatically if refresh tokens are configured properly.
                </p>
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

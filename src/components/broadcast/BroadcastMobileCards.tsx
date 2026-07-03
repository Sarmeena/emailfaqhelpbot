"use client";

import { Copy, Trash2, ChevronRight } from "lucide-react";

type Broadcast = {
  id: number;
  subject: string;
  category: string;
  recipients: string;
  status: "Sent" | "Scheduled" | "Draft";
  openRate: string;
  replyRate: string;
  date: string;
};

const broadcasts: Broadcast[] = [
  {
    id: 1,
    subject: "Welcome to our platform",
    category: "Onboarding Sequence",
    recipients: "1,200 users",
    status: "Sent",
    openRate: "42%",
    replyRate: "5%",
    date: "Oct 28, 2023",
  },
  {
    id: 2,
    subject: "New Feature Alert: AI Insights",
    category: "Product Update",
    recipients: "All Customers",
    status: "Scheduled",
    openRate: "--",
    replyRate: "--",
    date: "Nov 02, 2023",
  },
  {
    id: 3,
    subject: "Feedback Request: Beta Program",
    category: "Marketing",
    recipients: "500 users",
    status: "Draft",
    openRate: "--",
    replyRate: "--",
    date: "Oct 30, 2023",
  },
];

export default function BroadcastMobileCards() {
  return (
    <div className="space-y-5 lg:hidden">
      {broadcasts.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          {/* Header */}
          <div className="mb-5 flex items-start justify-between">
            <div className="max-w-[70%]">
              <StatusBadge status={item.status} />

              <h3 className="mt-3 text-lg font-semibold text-gray-900">
                {item.subject}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {item.category}
              </p>

              <p className="text-sm text-gray-400">
                {item.date}
              </p>
            </div>

            <div className="flex gap-2">
              <IconButton>
                <Copy className="h-5 w-5" />
              </IconButton>

              <IconButton danger>
                <Trash2 className="h-5 w-5" />
              </IconButton>
            </div>
          </div>

          {/* Sent */}
          {item.status === "Sent" && (
            <>
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Open Rate
                  </p>

                  <p className="mt-1 text-2xl font-bold text-blue-600">
                    {item.openRate}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Reply Rate
                  </p>

                  <p className="mt-1 text-2xl font-bold text-green-600">
                    {item.replyRate}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Recipients
                  </p>

                  <p className="font-semibold text-gray-900">
                    {item.recipients}
                  </p>
                </div>

                <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                  Details

                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}

          {/* Scheduled */}
          {item.status === "Scheduled" && (
            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <p className="italic text-gray-500">
                Waiting to send...
              </p>

              <p className="font-semibold text-gray-900">
                {item.recipients}
              </p>
            </div>
          )}

          {/* Draft */}
          {item.status === "Draft" && (
            <div className="mt-5 flex justify-end">
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
                Continue Editing
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: Broadcast["status"];
}) {
  const colors = {
    Sent: "bg-green-100 text-green-700",
    Scheduled: "bg-blue-100 text-blue-700",
    Draft: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colors[status]}`}
    >
      {status}
    </span>
  );
}

function IconButton({
  children,
  danger = false,
}: {
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      className={`rounded-lg p-2 transition ${
        danger
          ? "text-red-600 hover:bg-red-100"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}
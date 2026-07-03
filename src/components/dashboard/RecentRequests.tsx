"use client";

interface Request {
  id: number;
  initials: string;
  name: string;
  subject: string;
  priority: "High" | "Medium";
  status: "Pending" | "Active";
  time: string;
  avatarColor: string;
}

const requests: Request[] = [
  {
    id: 1,
    initials: "JD",
    name: "John Doe",
    subject: "Subject: Billing issues regarding last invoice #4422",
    priority: "High",
    status: "Pending",
    time: "2m ago",
    avatarColor: "bg-blue-100 text-blue-700",
  },
  {
    id: 2,
    initials: "SA",
    name: "Sarah Adams",
    subject: "How do I export my FAQ database to PDF?",
    priority: "Medium",
    status: "Active",
    time: "15m ago",
    avatarColor: "bg-indigo-100 text-indigo-700",
  },
  {
    id: 3,
    initials: "MK",
    name: "Mike Knight",
    subject: "Login portal showing 500 error since morning",
    priority: "High",
    status: "Pending",
    time: "1h ago",
    avatarColor: "bg-orange-100 text-orange-700",
  },
];

export default function RecentRequests() {
  return (
    <section className="space-y-4">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Recent Requests
        </h2>

        <button className="text-sm font-medium text-blue-700 hover:underline">
          View All
        </button>
      </div>

      {/* Request Cards */}
      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="cursor-pointer rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:bg-gray-50 hover:shadow-md"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Left */}
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full font-bold ${request.avatarColor}`}
                >
                  {request.initials}
                </div>

                <div>
                  <h3 className="font-semibold">
                    {request.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {request.subject}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    request.priority === "High"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {request.priority}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    request.status === "Pending"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {request.status}
                </span>

                <span className="ml-2 text-sm text-gray-400">
                  {request.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
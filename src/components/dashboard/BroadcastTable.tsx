import { ArrowRight } from "lucide-react";

export default function BroadcastTable() {
  return (
    <section className="rounded-xl border bg-white p-6 shadow">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Recent Broadcasts
        </h2>

        <button className="flex items-center gap-2 text-blue-700">
          View Schedule

          <ArrowRight size={18} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-3">Campaign</th>
              <th>Status</th>
              <th>Audience</th>
              <th>Engagement</th>
              <th className="text-right">Date</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="py-4">
                Winter Sale FAQ Update
              </td>

              <td>
                <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                  Sent
                </span>
              </td>

              <td>4.2k Users</td>

              <td>68%</td>

              <td className="text-right">
                Oct 24, 2023
              </td>
            </tr>

            <tr className="hover:bg-gray-50">
              <td className="py-4">
                New Feature: Webhooks
              </td>

              <td>
                <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                  Draft
                </span>
              </td>

              <td>Admin Group</td>

              <td>N/A</td>

              <td className="text-right">
                Oct 26, 2023
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
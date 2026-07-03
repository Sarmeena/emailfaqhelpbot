"use client";

interface BroadcastSettingsProps {
  status: "Draft" | "Scheduled" | "Sent";
  onStatusChange: (
    value: "Draft" | "Scheduled" | "Sent"
  ) => void;

  scheduleDate: string;
  scheduleTime: string;

  onScheduleDateChange: (value: string) => void;
  onScheduleTimeChange: (value: string) => void;
}

export default function BroadcastSettings({
  status,
  onStatusChange,
  scheduleDate,
  scheduleTime,
  onScheduleDateChange,
  onScheduleTimeChange,
}: BroadcastSettingsProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      {/* Header */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Broadcast Settings
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Configure how and when this broadcast will be sent.
        </p>
      </div>

      <div className="space-y-6">

        {/* Status */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              onStatusChange(
                e.target.value as "Draft" | "Scheduled" | "Sent"
              )
            }
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          >
            <option value="Draft">Draft</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Sent">Sent</option>
          </select>
        </div>

        {/* Schedule Date */}
        {status === "Scheduled" && (
          <>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Schedule Date
              </label>

              <input
                type="date"
                value={scheduleDate}
                onChange={(e) =>
                  onScheduleDateChange(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Schedule Time
              </label>

              <input
                type="time"
                value={scheduleTime}
                onChange={(e) =>
                  onScheduleTimeChange(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </>
        )}

        {/* Summary */}
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
          <h3 className="mb-3 font-semibold text-blue-900">
            Broadcast Summary
          </h3>

          <div className="space-y-2 text-sm">

            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>

              <span className="font-semibold">
                {status}
              </span>
            </div>

            {status === "Scheduled" && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Date
                  </span>

                  <span className="font-semibold">
                    {scheduleDate || "-"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Time
                  </span>

                  <span className="font-semibold">
                    {scheduleTime || "-"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
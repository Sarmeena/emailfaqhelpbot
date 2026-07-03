"use client";

interface BroadcastRecipientsProps {
  recipients: string;
  category: string;
  onRecipientsChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export default function BroadcastRecipients({
  recipients,
  category,
  onRecipientsChange,
  onCategoryChange,
}: BroadcastRecipientsProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      {/* Header */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Recipients
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Select who should receive this broadcast.
        </p>
      </div>

      <div className="space-y-6">
        {/* Recipient Group */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Recipient Group
          </label>

          <select
            value={recipients}
            onChange={(e) => onRecipientsChange(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select Recipients</option>
            <option value="All Customers">All Customers</option>
            <option value="New Users">New Users</option>
            <option value="Premium Users">Premium Users</option>
            <option value="Inactive Users">Inactive Users</option>
            <option value="Beta Testers">Beta Testers</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Category
          </label>

          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select Category</option>
            <option value="Announcement">Announcement</option>
            <option value="Marketing">Marketing</option>
            <option value="Newsletter">Newsletter</option>
            <option value="Product Update">Product Update</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Promotion">Promotion</option>
          </select>
        </div>
      </div>
    </section>
  );
}
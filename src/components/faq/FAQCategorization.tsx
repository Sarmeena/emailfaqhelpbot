"use client";

interface FAQCategorizationProps {
  category: string;
  onCategoryChange: (value: string) => void;
}

export default function FAQCategorization({
  category,
  onCategoryChange,
}: FAQCategorizationProps) {
  return (
    <section className="h-full rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

      {/* Header */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Categorization
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Organize this FAQ to make it easier to discover.
        </p>
      </div>

      <div className="space-y-6">

        {/* Category */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Category
          </label>

          <select
            value={category}
            onChange={(e) =>
              onCategoryChange(e.target.value)
            }
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select Category</option>
            <option value="General">General</option>
            <option value="Technical">Technical</option>
            <option value="Billing">Billing</option>
            <option value="Account">Account</option>
            <option value="Security">Security</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Status
          </label>

          <input
            value="Published"
            readOnly
            className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-gray-600"
          />
        </div>

        {/* Visibility */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Visibility
          </label>

          <input
            value="Public"
            readOnly
            className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-gray-600"
          />
        </div>

      </div>

    </section>
  );
}
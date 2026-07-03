"use client";

interface BroadcastContentFormProps {
  subject: string;
  content: string;
  onSubjectChange: (value: string) => void;
  onContentChange: (value: string) => void;
}

export default function BroadcastContentForm({
  subject,
  content,
  onSubjectChange,
  onContentChange,
}: BroadcastContentFormProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      {/* Header */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Broadcast Content
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Compose the email your recipients will receive.
        </p>
      </div>

      <div className="space-y-6">
        {/* Subject */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email Subject
          </label>

          <input
            type="text"
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            placeholder="Enter email subject..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Email Content */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email Content
          </label>

          <textarea
            rows={14}
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Write your broadcast email here..."
            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>
    </section>
  );
}
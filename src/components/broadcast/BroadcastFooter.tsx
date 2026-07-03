"use client";

interface BroadcastFooterProps {
  onCancel: () => void;
  onSaveDraft: () => void;
  onSend: () => void;
}

export default function BroadcastFooter({
  onCancel,
  onSaveDraft,
  onSend,
}: BroadcastFooterProps) {
  return (
    <div className="sticky bottom-0 z-40 border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-end gap-4 px-8 py-4">

        {/* Cancel */}
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 active:scale-95"
        >
          Cancel
        </button>

        {/* Save Draft */}
        <button
          type="button"
          onClick={onSaveDraft}
          className="rounded-xl border border-blue-600 px-6 py-3 text-sm font-medium text-blue-600 transition hover:bg-blue-50 active:scale-95"
        >
          Save Draft
        </button>

        {/* Send */}
        <button
          type="button"
          onClick={onSend}
          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow transition hover:bg-blue-700 active:scale-95"
        >
          Send Broadcast
        </button>

      </div>
    </div>
  );
}
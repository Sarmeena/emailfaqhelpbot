"use client";

import {
  Save,
  SendHorizontal,
  CalendarDays,
  Rocket,
} from "lucide-react";

interface CreateBroadcastFooterProps {
  onSaveDraft: () => void;
  onSendNow: () => void;
  onSchedule: () => void;
}

export default function CreateBroadcastFooter({
  onSaveDraft,
  onSendNow,
  onSchedule,
}: CreateBroadcastFooterProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-outline-variant bg-surface-container-lowest px-margin-mobile py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:px-margin-desktop md:py-5">
      <div className="mx-auto flex max-w-360 flex-col gap-3 md:flex-row md:items-center md:justify-end">
        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 md:flex md:gap-4">
          {/* Save Draft */}
          <button
            type="button"
            onClick={onSaveDraft}
            className="flex flex-col items-center justify-center gap-1 rounded-lg px-4 py-2 text-on-surface-variant transition hover:bg-surface-container md:flex-row md:gap-2"
          >
            <Save className="h-5 w-5" />

            <span className="text-label-md font-label-md">
              Save Draft
            </span>
          </button>

          {/* Send Test */}
          <button
            type="button"
            onClick={() => alert("Test email sent!")}
            className="flex flex-col items-center justify-center gap-1 rounded-lg px-4 py-2 text-on-surface-variant transition hover:bg-surface-container md:flex-row md:gap-2"
          >
            <SendHorizontal className="h-5 w-5" />

            <span className="text-label-md font-label-md">
              Send Test
            </span>
          </button>

          {/* Schedule */}
          <button
            type="button"
            onClick={onSchedule}
            className="flex flex-col items-center justify-center gap-1 rounded-lg px-4 py-2 text-on-surface-variant transition hover:bg-surface-container md:flex-row md:gap-2"
          >
            <CalendarDays className="h-5 w-5" />

            <span className="text-label-md font-label-md">
              Schedule
            </span>
          </button>
        </div>

        {/* Primary Button */}
        <button
          type="button"
          onClick={onSendNow}
          className="flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-label-md font-label-md text-on-primary shadow-lg transition hover:bg-primary-container md:py-3"
        >
          <Rocket className="h-5 w-5" />

          <span>Send Now</span>
        </button>
      </div>
    </nav>
  );
}
"use client";

import {
  Monitor,
  Smartphone,
  Bot,
} from "lucide-react";

interface CreateBroadcastPreviewProps {
  subject: string;
  content: string;
}

export default function CreateBroadcastPreview({
  subject,
  content,
}: CreateBroadcastPreviewProps) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between px-1">
          <h2 className="text-label-md font-label-md uppercase tracking-wider text-on-surface-variant">
            Live Desktop Preview
          </h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg p-1 text-primary"
            >
              <Monitor className="h-5 w-5" />
            </button>

            <button
              type="button"
              className="rounded-lg p-1 text-on-surface-variant transition hover:text-primary"
            >
              <Smartphone className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Preview Card */}
        <div className="flex h-175 flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-lg">
          {/* Browser Header */}
          <div className="border-b border-outline-variant bg-surface-container-high p-5">
            <div className="mb-4 flex gap-2">
              <span className="h-3 w-3 rounded-full bg-red-300"></span>
              <span className="h-3 w-3 rounded-full bg-yellow-300"></span>
              <span className="h-3 w-3 rounded-full bg-green-300"></span>
            </div>

            <div className="space-y-2">
              <p className="text-body-sm">
                <span className="text-on-surface-variant">
                  From:
                </span>{" "}
                <span className="font-medium text-on-surface">
                  Email FAQ Help Bot &lt;emailfaqhelpbot@gmail.com&gt;
                </span>
              </p>

              <p className="text-body-sm">
                <span className="text-on-surface-variant">
                  Subject:
                </span>{" "}
                <span className="font-semibold text-on-surface">
                  {subject || "How can we help you today?"}
                </span>
              </p>
            </div>
          </div>

          {/* Email Preview */}
          <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
            <div className="mx-auto max-w-md overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              {/* Banner */}
              <div className="flex h-32 items-center justify-center bg-primary">
                <div className="flex items-center gap-2 text-on-primary">
                  <Bot className="h-10 w-10" />

                  <span className="text-3xl font-bold">
                    BotManager
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6 p-6">
                <div className="min-h-55 text-body-md leading-relaxed text-on-surface-variant whitespace-pre-wrap">
                  {content || "Your email content will appear here in real-time as you type..."}
                </div>

                <div className="border-t border-outline-variant pt-6">
                  <button
                    type="button"
                    className="w-full rounded-lg bg-primary py-3 text-label-md font-label-md text-on-primary transition hover:bg-primary-container"
                  >
                    View FAQ Portal
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-slate-50 p-4 text-center">
                <p className="text-[10px] text-slate-400">
                  © 2024 BotManager AI. 123 Support St,
                  Tech City.
                </p>

                <p className="mt-1 cursor-pointer text-[10px] text-slate-400 underline">
                  Unsubscribe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
"use client";

import { Megaphone } from "lucide-react";

interface CreateBroadcastCampaignDetailsProps {
  campaignName: string;
  setCampaignName: (val: string) => void;
  subject: string;
  setSubject: (val: string) => void;
  previewText: string;
  setPreviewText: (val: string) => void;
}

export default function CreateBroadcastCampaignDetails({
  campaignName,
  setCampaignName,
  subject,
  setSubject,
  previewText,
  setPreviewText,
}: CreateBroadcastCampaignDetailsProps) {
  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <Megaphone className="h-6 w-6 text-primary" />

        <h2 className="text-title-lg font-title-lg text-on-surface">
          Campaign Details
        </h2>
      </div>

      <div className="space-y-6">
        {/* Campaign Name */}
        <div>
          <label className="mb-2 block text-label-md text-on-surface-variant">
            Campaign Name
          </label>

          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="e.g. Monthly FAQ Newsletter June"
            className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-3 text-body-md text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Subject & Preview */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Subject */}
          <div>
            <label className="mb-2 block text-label-md text-on-surface-variant">
              Email Subject
            </label>

            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="How can we help you today?"
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-3 text-body-md text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Preview Text */}
          <div>
            <label className="mb-2 block text-label-md text-on-surface-variant">
              Preview Text
            </label>

            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              placeholder="Check out our latest help guides..."
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-3 text-body-md text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
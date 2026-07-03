"use client";

import { Sparkles } from "lucide-react";

interface SuggestionCardProps {
  title: string;
  description: string;
}

export default function SuggestionCard({
  title,
  description,
}: SuggestionCardProps) {
  return (
    <div className="rounded-xl border-l-4 border-secondary bg-white p-md shadow-lg backdrop-blur">
      <div className="flex items-start gap-3">
        <Sparkles className="text-secondary" />

        <div>
          <h4 className="font-semibold text-secondary">
            {title}
          </h4>

          <p className="mt-1 text-body-sm italic text-on-surface-variant">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-md flex gap-2">
        <button className="flex-1 rounded-lg bg-secondary py-2 text-label-sm font-semibold text-on-secondary">
          Review & Send
        </button>

        <button className="rounded-lg border border-outline-variant px-4 py-2 text-label-sm">
          Dismiss
        </button>
      </div>
    </div>
  );
}
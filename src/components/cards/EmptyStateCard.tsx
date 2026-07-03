"use client";

import { Inbox } from "lucide-react";

interface EmptyStateCardProps {
  title: string;
  description: string;
}

export default function EmptyStateCard({
  title,
  description,
}: EmptyStateCardProps) {
  return (
    <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low p-xl text-center">
      <div className="mb-md flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
        <Inbox
          size={32}
          className="text-outline"
        />
      </div>

      <h3 className="text-body-lg font-semibold">
        {title}
      </h3>

      <p className="mt-xs max-w-xs text-body-sm text-on-surface-variant">
        {description}
      </p>
    </div>
  );
}
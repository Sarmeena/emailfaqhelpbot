"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "online" | "offline" | "away";
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const styles = {
    online:
      "bg-green-100 text-green-700 border-green-200",

    offline:
      "bg-surface-container-highest text-on-surface-variant border-outline-variant",

    away:
      "bg-yellow-100 text-yellow-700 border-yellow-200",
  };

  const dot = {
    online: "bg-green-500",
    offline: "bg-outline",
    away: "bg-yellow-500",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-label-sm font-semibold",
        styles[status]
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          dot[status]
        )}
      />

      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
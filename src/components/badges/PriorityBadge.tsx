"use client";

import {
  ArrowDown,
  Minus,
  AlertTriangle,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface PriorityBadgeProps {
  priority: "high" | "medium" | "low";
}

export default function PriorityBadge({
  priority,
}: PriorityBadgeProps) {
  const config = {
    high: {
      icon: AlertTriangle,
      className:
        "bg-error-container text-on-error-container",
      label: "High",
    },

    medium: {
      icon: Minus,
      className:
        "bg-blue-100 text-blue-700",
      label: "Medium",
    },

    low: {
      icon: ArrowDown,
      className:
        "border border-outline-variant bg-surface-container-low text-on-surface-variant",
      label: "Low",
    },
  };

  const Icon = config[priority].icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-label-sm font-semibold",
        config[priority].className
      )}
    >
      <Icon size={14} />
      {config[priority].label}
    </span>
  );
}
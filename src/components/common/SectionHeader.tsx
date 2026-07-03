"use client";

import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

export default function SectionHeader({
  title,
  description,
  icon: Icon,
}: SectionHeaderProps) {
  return (
    <div className="mb-md">
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon
            size={24}
            className="text-primary"
          />
        )}

        <h2 className="text-title-lg font-bold text-on-surface">
          {title}
        </h2>
      </div>

      {description && (
        <p className="mt-1 text-body-sm text-on-surface-variant">
          {description}
        </p>
      )}
    </div>
  );
}
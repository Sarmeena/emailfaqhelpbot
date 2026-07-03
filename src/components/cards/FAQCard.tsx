"use client";

import { HelpCircle } from "lucide-react";

interface FAQCardProps {
  title: string;
  description: string;
  tags: string[];
}

export default function FAQCard({
  title,
  description,
  tags,
}: FAQCardProps) {
  return (
    <div className="cursor-pointer rounded-xl border border-outline-variant bg-white p-md shadow-sm transition hover:border-primary">
      <div className="mb-sm flex items-center gap-3">
        <HelpCircle
          className="text-secondary"
          size={22}
        />

        <h4 className="font-semibold">
          {title}
        </h4>
      </div>

      <p className="text-body-sm text-on-surface-variant">
        {description}
      </p>

      <div className="mt-md flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-surface-container px-2 py-1 text-[10px]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
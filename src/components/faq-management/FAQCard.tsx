"use client";

import { Pencil, BarChart3 } from "lucide-react";
import {
  FAQ,
  categoryStyles,
  statusStyles,
} from "./faq-data";

interface FAQCardProps {
  faq: FAQ;
}

export default function FAQCard({ faq }: FAQCardProps) {
  return (
    <div className="flex flex-col gap-sm rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-sm">
        <h3 className="text-title-lg font-bold leading-tight text-on-surface">
          {faq.question}
        </h3>

        <button className="rounded-lg bg-surface-container p-2 text-primary transition active:scale-95">
          <Pencil className="h-5 w-5" />
        </button>
      </div>

      {/* Answer */}
      <p className="line-clamp-2 text-body-sm text-on-surface-variant">
        {faq.answer}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-xs">
        <span
          className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${categoryStyles[faq.category]}`}
        >
          {faq.category}
        </span>

        <span
          className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${statusStyles[faq.status]}`}
        >
          {faq.status}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-xs flex items-center justify-between border-t border-outline-variant pt-sm">
        <div className="flex items-center gap-xs">
          <BarChart3 className="h-4 w-4 text-outline" />

          <span className="text-[12px] font-medium text-on-surface-variant">
            Used {faq.usage.toLocaleString()} times
          </span>
        </div>

        <span className="text-[12px] text-outline">
          Updated {faq.updated}
        </span>
      </div>
    </div>
  );
}
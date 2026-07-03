"use client";

import { Trash2 } from "lucide-react";

interface FAQDangerZoneProps {
  onDelete: () => void;
}

export default function FAQDangerZone({
  onDelete,
}: FAQDangerZoneProps) {
  return (
    <section className="rounded-2xl border border-red-200 bg-white p-8 shadow-sm">

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-red-600">
          Danger Zone
        </h3>

        <p className="mt-2 text-sm text-gray-600">
          Once you delete an FAQ, it cannot be recovered.
        </p>
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="flex items-center gap-2 rounded-lg border border-red-500 px-4 py-2 text-red-600 transition hover:bg-red-600 hover:text-white"
      >
        <Trash2 className="h-4 w-4" />
        Delete FAQ
      </button>

    </section>
  );
}
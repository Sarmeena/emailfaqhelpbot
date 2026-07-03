"use client";

import { CheckCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
}

export default function Toast({
  message,
}: ToastProps) {
  return (
    <div className="flex items-center justify-between gap-md rounded-lg bg-inverse-surface p-sm pl-md text-inverse-on-surface shadow-2xl">
      <div className="flex items-center gap-3">
        <CheckCircle
          size={20}
          className="text-green-400"
        />

        <p className="text-body-sm">
          {message}
        </p>
      </div>

      <button className="rounded p-1 hover:bg-white/10">
        <X size={18} />
      </button>
    </div>
  );
}
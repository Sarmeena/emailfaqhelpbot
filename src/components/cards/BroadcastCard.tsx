"use client";

import { Megaphone } from "lucide-react";

interface BroadcastCardProps {
  title: string;
  description: string;
  date: string;
}

export default function BroadcastCard({
  title,
  description,
  date,
}: BroadcastCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-primary p-md text-on-primary shadow-md">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.15),transparent_70%)]" />

      <Megaphone size={24} />

      <h3 className="mt-sm font-semibold">
        {title}
      </h3>

      <p className="mt-xs text-body-sm text-white/80">
        {description}
      </p>

      <div className="mt-md flex items-center justify-between">
        <span className="text-label-sm text-white/70">
          {date}
        </span>

        <button className="rounded-lg bg-white/20 px-3 py-1 text-label-sm hover:bg-white/30">
          Details
        </button>
      </div>
    </div>
  );
}
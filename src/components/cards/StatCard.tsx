"use client";

import { Ticket, BarChart3, Users, Clock } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  progress?: number;
  icon: "ticket" | "chart" | "users" | "clock";
}

export default function StatCard({
  title,
  value,
  change,
  progress = 70,
  icon,
}: StatCardProps) {
  const icons = {
    ticket: Ticket,
    chart: BarChart3,
    users: Users,
    clock: Clock,
  };

  const Icon = icons[icon];

  return (
    <div className="group rounded-xl border border-outline-variant bg-white p-md shadow-sm transition hover:-translate-y-1">
      <div className="mb-base flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-container/10 text-primary">
          <Icon size={24} />
        </div>

        {change && (
          <span className="text-label-sm font-bold text-green-600">
            {change}
          </span>
        )}
      </div>

      <p className="text-label-md text-on-surface-variant">
        {title}
      </p>

      <h3 className="mt-xs text-headline-lg font-bold text-primary">
        {value}
      </h3>

      <div className="mt-md h-2 overflow-hidden rounded-full bg-surface-container">
        <div
          className="h-full rounded-full bg-primary transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
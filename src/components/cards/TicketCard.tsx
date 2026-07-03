"use client";

import Avatar from "../../components/common/Avatar";
import PriorityBadge from "../../components/badges/PriorityBadge";

interface TicketCardProps {
  avatar: string;
  name: string;
  ticketId: string;
  description: string;
  priority: "high" | "medium" | "low";
  time: string;
}

export default function TicketCard({
  avatar,
  name,
  ticketId,
  description,
  priority,
  time,
}: TicketCardProps) {
  return (
    <div className="rounded-xl border border-outline-variant bg-white p-md shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            src={avatar}
            name={name}
          />

          <div>
            <h4 className="font-semibold">
              {name}
            </h4>

            <p className="text-label-sm text-on-surface-variant">
              {ticketId}
            </p>
          </div>
        </div>

        <PriorityBadge priority={priority} />
      </div>

      <p className="mt-md line-clamp-2 text-body-sm text-on-surface-variant">
        {description}
      </p>

      <div className="mt-md flex items-center justify-between border-t border-outline-variant pt-sm">
        <span className="text-label-sm text-primary">
          {time}
        </span>

        <button className="rounded-lg bg-surface-container px-3 py-1 text-label-sm hover:bg-surface-variant">
          Assign AI
        </button>
      </div>
    </div>
  );
}
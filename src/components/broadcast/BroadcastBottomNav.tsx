"use client";

import Link from "next/link";
import {
  House,
  Mail,
  CircleHelp,
  Send,
} from "lucide-react";

export default function BroadcastBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg md:hidden">
      <div className="grid h-16 grid-cols-4">

        <NavItem
          href="/dashboard"
          icon={<House className="h-5 w-5" />}
          label="Home"
        />

        <NavItem
          href="/conversation"
          icon={<Mail className="h-5 w-5" />}
          label="Inbox"
        />

        <NavItem
          href="/faqs"
          icon={<CircleHelp className="h-5 w-5" />}
          label="FAQs"
        />

        <NavItem
          href="/broadcasts"
          active
          icon={<Send className="h-5 w-5" />}
          label="Broadcast"
        />

      </div>
    </nav>
  );
}

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
};

function NavItem({
  href,
  icon,
  label,
  active = false,
}: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center transition-all duration-200 ${
        active
          ? "text-blue-600"
          : "text-gray-500 hover:text-blue-600"
      }`}
    >
      <div
        className={`rounded-xl p-2 ${
          active ? "bg-blue-50" : ""
        }`}
      >
        {icon}
      </div>

      <span
        className={`mt-1 text-xs font-medium ${
          active ? "text-blue-600" : ""
        }`}
      >
        {label}
      </span>
    </Link>
  );
}
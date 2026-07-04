"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Ticket,
  CircleHelp,
  BarChart3,
} from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/dashboard", icon: Home },
    { label: "Tickets", href: "/requests", icon: Ticket },
    { label: "FAQs", href: "/faqs", icon: CircleHelp },
    { label: "Stats", href: "/analytics", icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 flex w-full justify-around border-t bg-white py-3 md:hidden z-40 shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center transition ${
              isActive ? "text-blue-700 font-semibold" : "text-gray-500 hover:text-blue-700"
            }`}
          >
            <Icon size={20} />
            <span className="text-xs">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
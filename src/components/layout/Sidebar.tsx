"use client";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "../../services/auth/auth";
import Link from "next/link";
import {
  LayoutDashboard,
  Ticket,
  Search,
  Megaphone,
  BarChart3,
  HelpCircle,
  LogOut,
  Plus,
  Bot,
  MessageSquare,
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Tickets",
    icon: Ticket,
    href: "/requests",
  },
  {
    title: "Conversations",
    icon: MessageSquare,
    href: "/conversation",
  },
  {
    title: "UI Library",
    icon: Bot,
    href: "/ui-library",
  },
  {
    title: "KB Search",
    icon: Search,
    href: "/faqs",
  },
  {
    title: "Broadcasts",
    icon: Megaphone,
    href: "/broadcasts",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/analytics",
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const handleLogout = async () => {
  try {
    await logout();

    router.replace("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
  return (
      <aside
  className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-gray-200 bg-white shadow-sm md:flex"
>      
      <Link href="/dashboard" className="flex items-center gap-sm px-base py-md hover:opacity-85 transition cursor-pointer">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container">
          <Bot className="h-5 w-5 text-on-primary" />
        </div>

        <div>
          <h1 className="text-title-lg font-black text-primary">
            HelpBot
          </h1>

          <p className="text-label-sm text-on-surface-variant">
            AI Assistant
          </p>
        </div>
      </Link>

      <button 
        onClick={() => router.push("/requests/create")}
        className="mb-md flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-on-primary cursor-pointer hover:bg-blue-800 transition mx-4 shadow-sm"
      >
        <Plus size={18} />
        New Ticket
      </button>

      <nav className="flex-1 space-y-1 px-3">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                isActive
                  ? "bg-blue-50 font-semibold text-blue-700"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <Icon size={20} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-outline-variant pt-base px-3">
        <Link
          href="/help"
          className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${
            pathname === "/help"
              ? "bg-blue-50 font-semibold text-blue-700"
              : "text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          <HelpCircle size={20} />
          Help
        </Link>
          <button
  onClick={handleLogout}
  className="flex items-center gap-3 rounded-lg px-4 py-3 text-error hover:bg-surface-container-high w-full text-left"
>
  Logout
</button>

      </div>
    </aside>
  );
}
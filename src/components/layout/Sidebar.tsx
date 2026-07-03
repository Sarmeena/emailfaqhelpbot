"use client";
import { useRouter } from "next/navigation";
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
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "#",
  },
  {
    title: "Tickets",
    icon: Ticket,
    href: "#",
  },
  {
    title: "UI Library",
    icon: Bot,
    href: "#",
    active: true,
  },
  {
    title: "KB Search",
    icon: Search,
    href: "#",
  },
  {
    title: "Broadcasts",
    icon: Megaphone,
    href: "#",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "#",
  },
];

export default function Sidebar() {
  const router = useRouter();
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
      <div className="flex items-center gap-sm px-base py-md">
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
      </div>

      <button className="mb-md flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-on-primary">
        <Plus size={18} />
        New Ticket
      </button>

      <nav className="flex-1 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                item.active
                  ? "bg-secondary-container font-semibold text-on-secondary-container"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <Icon size={20} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-outline-variant pt-base">
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-surface-container-high"
        >
          <HelpCircle size={20} />
          Help
        </Link>
          <button
  onClick={handleLogout}
  className="flex items-center gap-3 rounded-lg px-4 py-3 text-error hover:bg-surface-container-high"
>
  Logout
</button>

      </div>
    </aside>
  );
}
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
  CircleHelp,
  Settings,
} from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";
import { useAuth } from "../../context/AuthContext";

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
    title: "FAQ",
    icon: CircleHelp,
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
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();
  const { role } = useAuth();

  const allowedMenu = menu.filter((item) => {
    if (role === "viewer") {
      return !["Broadcasts", "Analytics", "Settings"].includes(item.title);
    }
    if (role === "agent") {
      return !["Analytics", "Settings"].includes(item.title);
    }
    return true;
  });
  
  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 md:hidden transition-opacity duration-300"
          onClick={close}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white shadow-sm transition-transform duration-300 overflow-y-auto md:translate-x-0 md:flex ${
          isOpen ? "translate-x-0 flex" : "-translate-x-full hidden"
        }`}
      >      
        <Link 
          href="/dashboard" 
          onClick={close}
          className="flex items-center gap-sm px-base py-md hover:opacity-85 transition cursor-pointer"
        >
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

        <div className="mb-md" />

        <nav className="flex-1 space-y-1 px-3">
          {allowedMenu.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={close}
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

        <div className="border-t border-outline-variant pt-base px-3 pb-4">
          <Link
            href="/help"
            onClick={close}
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
            onClick={() => {
              close();
              handleLogout();
            }}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-error hover:bg-surface-container-high w-full text-left"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
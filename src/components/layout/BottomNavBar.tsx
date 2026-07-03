"use client";

import {
  Home,
  MessageSquare,
  BookOpen,
  User,
} from "lucide-react";

export default function BottomNavbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-outline-variant bg-surface md:hidden">
      <Home />
      <MessageSquare />
      <BookOpen />
      <User />
    </nav>
  );
}
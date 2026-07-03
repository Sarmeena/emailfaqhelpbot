"use client";

import type { ReactNode } from "react";

interface ChatBubbleProps {
  children: ReactNode;
  isUser?: boolean;
}

export default function ChatBubble({
  children,
  isUser = false,
}: ChatBubbleProps) {
  return (
    <div
      className={`max-w-[85%] rounded-2xl p-3 text-body-sm shadow-sm ${
        isUser
          ? "ml-auto rounded-tr-none bg-primary text-on-primary"
          : "rounded-tl-none border border-outline-variant bg-white text-on-surface"
      }`}
    >
      {children}
    </div>
  );
}
"use client";

import ChatBubble from "./ChatBubble";
import { Bot } from "lucide-react";

interface AIMessageProps {
  message: string;
  time: string;
}

export default function AIMessage({
  message,
  time,
}: AIMessageProps) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
        <Bot size={18} />
      </div>

      <div>
        <ChatBubble>
          {message}
        </ChatBubble>

        <span className="ml-1 mt-1 block text-[10px] text-on-surface-variant">
          {time}
        </span>
      </div>
    </div>
  );
}
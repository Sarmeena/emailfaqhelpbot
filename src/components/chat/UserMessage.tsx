"use client";

import ChatBubble from "./ChatBubble";

interface UserMessageProps {
  message: string;
  time: string;
}

export default function UserMessage({
  message,
  time,
}: UserMessageProps) {
  return (
    <div className="flex flex-col items-end">
      <ChatBubble isUser>
        {message}
      </ChatBubble>

      <span className="mr-1 mt-1 text-[10px] text-on-surface-variant">
        {time}
      </span>
    </div>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";

import {
  subscribeMessages,
  Message,
} from "../../../services/firestore/conversations";

interface ChatWindowProps {
  conversationId: string;
  onLatestCustomerMessage: (message: string) => void;
}

export default function ChatWindow({
  conversationId,
  onLatestCustomerMessage,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = subscribeMessages(
      conversationId,
      (data) => {
        setMessages(data);

        const latestCustomer = [...data]
          .reverse()
          .find((msg) => msg.sender !== "agent" && msg.sender !== "AI Assistant");

        if (latestCustomer) {
          onLatestCustomerMessage(latestCustomer.message);
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [conversationId, onLatestCustomerMessage]);

  const formatMessageTime = (ts: any) => {
    if (!ts) return "Just now";
    try {
      const date = ts.toDate ? ts.toDate() : new Date(ts.seconds ? ts.seconds * 1000 : ts);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return "Just now";
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="animate-pulse text-gray-400">
          Loading conversation...
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 overflow-y-auto bg-white p-6">
      {/* Conversation Label */}
      <div className="flex justify-center">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Conversation
        </span>
      </div>

      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center text-gray-500">
          <div className="flex h-full flex-col items-center justify-center text-gray-500">
            <p className="text-lg font-semibold">
              No conversation yet
            </p>

            <p className="text-sm">
              Start chatting to see messages.
            </p>
          </div>
        </div>
      ) : (
        messages.map((msg) => {
          const isReceived = msg.sender !== "agent" && msg.sender !== "AI Assistant";
          return isReceived ? (
            <div
              key={msg.id}
              className="flex max-w-[85%] items-start gap-3"
            >
              <img
                src="https://i.pravatar.cc/40?img=12"
                alt="Customer"
                className="mt-1 h-8 w-8 rounded-full"
              />

              <div className="rounded-2xl rounded-tl-none border bg-gray-100 p-4 shadow-sm break-words max-w-full overflow-hidden">
                <p className="whitespace-pre-wrap text-sm text-gray-800 font-medium">
                  {msg.message}
                </p>

                <span className="mt-2 block text-[10px] text-gray-400">
                  {msg.sender} • {formatMessageTime(msg.createdAt)}
                </span>
              </div>
            </div>
          ) : (
            <div
              key={msg.id}
              className="ml-auto flex max-w-[85%] flex-row-reverse items-start gap-3 animate-fade-in"
            >
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white shadow-sm shrink-0">
                {msg.sender === "AI Assistant" ? "🤖" : "AG"}
              </div>

              <div className="rounded-2xl rounded-tr-none bg-blue-700 p-4 text-white shadow-md break-words max-w-full overflow-hidden">
                <p className="whitespace-pre-wrap text-sm font-medium">
                  {msg.message}
                </p>
                <span className="mt-2 block text-right text-[10px] text-blue-100">
                  {msg.sender} • {formatMessageTime(msg.createdAt)}
                </span>
              </div>
            </div>
          );
        })
      )}

      {/* Auto Scroll Target */}
      <div ref={bottomRef} />
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import {
  Paperclip,
  Send,
  Sparkles,
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

interface ChatComposerProps {
  conversationId: string;
  customerMessage: string;
  onMessageSent?: () => void;
}

export default function ChatComposer({
  conversationId,
  customerMessage,
  onMessageSent,
}: ChatComposerProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [requestDetails, setRequestDetails] = useState<{
    customerEmail: string;
    subject: string;
    gmailMessageId?: string;
    gmailThreadId?: string;
    source?: string;
  } | null>(null);
  const [sendGmailEmail, setSendGmailEmail] = useState(true);

  useEffect(() => {
    if (!conversationId) {
      setRequestDetails(null);
      return;
    }
    async function loadRequest() {
      try {
        const docRef = doc(db, "requests", conversationId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setRequestDetails({
            customerEmail: data.customerEmail,
            subject: data.subject,
            gmailMessageId: data.gmailMessageId,
            gmailThreadId: data.gmailThreadId,
            source: data.source,
          });
          setSendGmailEmail(data.source === "Gmail");
        } else {
          setRequestDetails(null);
        }
      } catch (err) {
        console.error("Error loading request details:", err);
      }
    }
    loadRequest();
  }, [conversationId]);

  async function handleAISuggestion() {
    if (!customerMessage.trim()) {
      alert("No customer message found.");
      return;
    }

    try {
      setGenerating(true);

      const response = await fetch("/api/generate-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: customerMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      setMessage(data.reply);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Failed to generate AI reply.");
      }
    } finally {
      setGenerating(false);
    }
  }

  async function handleSend() {
    if (!conversationId) {
      alert("Please select a conversation.");
      return;
    }

    if (!message.trim()) return;

    try {
      setSending(true);

      // Save inside local Firestore database messages via backend API
      const saveRes = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          sender: "agent",
          message,
        }),
      });

      if (!saveRes.ok) {
        throw new Error("Failed to save message on server");
      }

      // Send via Gmail API if flagged
      if (requestDetails?.source === "Gmail" && sendGmailEmail) {
        const emailSubject = requestDetails.subject.toLowerCase().startsWith("re:")
          ? requestDetails.subject
          : `Re: ${requestDetails.subject}`;

        await fetch("/api/gmail/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipient: requestDetails.customerEmail,
            subject: emailSubject,
            message: message,
            messageId: requestDetails.gmailMessageId,
            threadId: requestDetails.gmailThreadId,
          }),
        });
      }

      setMessage("");

      if (onMessageSent) {
        onMessageSent();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to send message.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="border-t bg-white p-4">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-end gap-2 rounded-2xl border bg-gray-50 p-2 focus-within:ring-2 focus-within:ring-blue-500">
          {/* Attachment */}
          <button className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-200 hover:text-blue-700">
            <Paperclip size={20} />
          </button>

          {/* Message Input */}
          <textarea
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your response..."
            className="max-h-32 min-h-11 flex-1 resize-none bg-transparent py-2 text-sm outline-none"
          />

          {/* AI Suggest */}
          <button
            onClick={handleAISuggestion}
            disabled={generating}
            className="flex items-center gap-2 rounded-xl bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-700 hover:text-white disabled:opacity-50"
          >
            <Sparkles size={18} />
            <span>
              {generating ? "Generating..." : "AI Suggest"}
            </span>
          </button>

          {/* Send */}
          <button
            onClick={handleSend}
            disabled={sending}
            className="rounded-xl bg-blue-700 p-2 text-white transition hover:bg-blue-800 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>

        {/* Gmail Toggle */}
        {requestDetails?.source === "Gmail" && (
          <div className="mt-2 flex items-center justify-end px-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 cursor-pointer hover:text-gray-700 transition">
              <input
                type="checkbox"
                checked={sendGmailEmail}
                onChange={(e) => setSendGmailEmail(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              Send email response back to customer via Gmail thread
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
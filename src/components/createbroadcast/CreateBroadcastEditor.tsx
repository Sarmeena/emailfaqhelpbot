"use client";

import { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Link,
  Image as ImageIcon,
  PencilLine,
  Sparkles,
  RefreshCw,
} from "lucide-react";

interface CreateBroadcastEditorProps {
  content: string;
  setContent: (val: string) => void;
  subject?: string;
}

export default function CreateBroadcastEditor({
  content,
  setContent,
  subject = "",
}: CreateBroadcastEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiTone, setAiTone] = useState("Professional");
  const [generating, setGenerating] = useState(false);

  const insertFormat = (type: "bold" | "italic" | "link" | "image") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    let replacement = "";
    if (type === "bold") {
      replacement = `**${selected || "bold text"}**`;
    } else if (type === "italic") {
      replacement = `*${selected || "italic text"}*`;
    } else if (type === "link") {
      const url = prompt("Enter link URL:", "https://");
      if (url === null) return;
      replacement = `[${selected || "link text"}](${url})`;
    } else if (type === "image") {
      const url = prompt("Enter image URL:", "https://");
      if (url === null) return;
      replacement = `![${selected || "image alt"}](${url})`;
    }

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      const offset = replacement.length;
      textarea.setSelectionRange(start + offset, start + offset);
    }, 0);
  };

  async function handleAIDraft() {
    if (!aiPrompt.trim()) {
      alert("Please enter what you want Gemini to write.");
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch("/api/ai/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          tone: aiTone,
          subject,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setContent(json.content);
        } else {
          alert(json.error || "Failed to generate draft.");
        }
      } else {
        alert("Failed to contact Gemini broadcast builder.");
      }
    } catch (e) {
      console.error(e);
      alert("Error generating AI email content.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Assistant card */}
      <section className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-blue-700 animate-pulse" />
          <h2 className="text-lg font-bold text-blue-900">Gemini Broadcast Writer</h2>
        </div>

        <p className="text-xs text-blue-700 mb-4 font-medium">
          Ask Gemini to draft professional marketing templates, announcements, or discount sales campaigns.
        </p>

        <div className="space-y-3">
          <textarea
            rows={2}
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="e.g. Write a newsletter campaign introducing our new dashboard layout and settings page..."
            className="w-full rounded-lg border border-blue-200 bg-white p-3 text-sm outline-none focus:border-blue-700 text-gray-700 placeholder-gray-400 font-medium"
          />

          <div className="flex gap-3">
            <select
              value={aiTone}
              onChange={(e) => setAiTone(e.target.value)}
              className="rounded-lg border border-blue-250 bg-white px-3 py-2 text-xs font-semibold text-gray-700 outline-none"
            >
              <option value="Professional">Professional</option>
              <option value="Casual & Friendly">Casual & Friendly</option>
              <option value="Sales / Promotional">Sales / Promotional</option>
              <option value="Urgent / Direct">Urgent / Direct</option>
            </select>

            <button
              onClick={handleAIDraft}
              disabled={generating}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold py-2 transition disabled:opacity-50"
            >
              {generating ? (
                <>
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Draft with Gemini
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PencilLine className="h-6 w-6 text-primary" />

            <h2 className="text-title-lg font-title-lg text-on-surface">
              Email Body
            </h2>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => insertFormat("bold")}
              className="rounded-lg p-2 transition hover:bg-gray-100 cursor-pointer active:scale-95"
              title="Bold"
            >
              <Bold className="h-5 w-5 text-gray-650" />
            </button>

            <button
              type="button"
              onClick={() => insertFormat("italic")}
              className="rounded-lg p-2 transition hover:bg-gray-100 cursor-pointer active:scale-95"
              title="Italic"
            >
              <Italic className="h-5 w-5 text-gray-650" />
            </button>

            <button
              type="button"
              onClick={() => insertFormat("link")}
              className="rounded-lg p-2 transition hover:bg-gray-100 cursor-pointer active:scale-95"
              title="Insert Link"
            >
              <Link className="h-5 w-5 text-gray-650" />
            </button>

            <button
              type="button"
              onClick={() => insertFormat("image")}
              className="rounded-lg p-2 transition hover:bg-gray-100 cursor-pointer active:scale-95"
              title="Insert Image"
            >
              <ImageIcon className="h-5 w-5 text-gray-650" />
            </button>
          </div>
        </div>

        {/* Email Body */}
        <textarea
          ref={textareaRef}
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your email here..."
          className="w-full resize-none rounded-lg border border-outline-variant bg-surface-container-low p-4 text-body-md text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary"
        />
      </section>
    </div>
  );
}
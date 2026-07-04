"use client";

import { useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";

interface BroadcastContentFormProps {
  subject: string;
  content: string;
  onSubjectChange: (value: string) => void;
  onContentChange: (value: string) => void;
}

export default function BroadcastContentForm({
  subject,
  content,
  onSubjectChange,
  onContentChange,
}: BroadcastContentFormProps) {
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiTone, setAiTone] = useState("Professional");
  const [generating, setGenerating] = useState(false);

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
          onContentChange(json.content);
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
      {/* Gemini Writer Card */}
      <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-blue-700 animate-pulse" />
          <h2 className="text-lg font-bold text-blue-900">Gemini Broadcast Writer</h2>
        </div>

        <p className="text-xs text-blue-750 mb-4 font-medium">
          Ask Gemini to draft professional email templates, newsletters, or promotional campaigns.
        </p>

        <div className="space-y-3">
          <textarea
            rows={2}
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="e.g. Write a marketing campaign offering 20% summer discount to our customers..."
            className="w-full rounded-xl border border-blue-200 bg-white p-3 text-sm outline-none focus:border-blue-700 text-gray-700 placeholder-gray-400 font-medium"
          />

          <div className="flex gap-3">
            <select
              value={aiTone}
              onChange={(e) => setAiTone(e.target.value)}
              className="rounded-xl border border-blue-250 bg-white px-3 py-2 text-xs font-semibold text-gray-700 outline-none"
            >
              <option value="Professional">Professional</option>
              <option value="Casual & Friendly">Casual & Friendly</option>
              <option value="Sales / Promotional">Sales / Promotional</option>
              <option value="Urgent / Direct">Urgent / Direct</option>
            </select>

            <button
              onClick={handleAIDraft}
              disabled={generating}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold py-2 transition disabled:opacity-50"
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

      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Broadcast Content
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Compose the email your recipients will receive.
          </p>
        </div>

        <div className="space-y-6">
          {/* Subject */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Subject
            </label>

            <input
              type="text"
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
              placeholder="Enter email subject..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Email Content */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Content
            </label>

            <textarea
              rows={14}
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="Write your broadcast email here..."
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
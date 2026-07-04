"use client";

import { Brain, Save, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsGemini() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gemini-2.5-flash");
  const [temperature, setTemperature] = useState(0.7);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);
  const [autoFaqEnabled, setAutoFaqEnabled] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch("/api/settings/gemini");
        if (res.ok) {
          const json = await res.json();
          const config = json.config;
          if (config) {
            setApiKey(config.apiKey || "");
            setModel(config.model || "gemini-2.5-flash");
            setTemperature(config.temperature !== undefined ? config.temperature : 0.7);
            setAutoReplyEnabled(!!config.autoReplyEnabled);
            setAutoFaqEnabled(!!config.autoFaqEnabled);
          }
        }
      } catch (err) {
        console.error("Failed to load Gemini config:", err);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          model,
          temperature,
          autoReplyEnabled,
          autoFaqEnabled,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save configuration");
      }

      alert("Gemini configuration saved successfully.");
    } catch (err) {
      console.error(err);
      alert("Error saving Gemini configuration.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-outline-variant bg-white p-6 animate-pulse text-gray-400">
        Loading Gemini AI Settings...
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-secondary/10 p-2">
            <Brain className="h-5 w-5 text-secondary" />
          </div>

          <h2 className="text-title-lg font-semibold text-on-surface">
            Gemini AI Engine
          </h2>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 text-sm font-semibold transition disabled:opacity-50 active:scale-95"
        >
          {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Gemini Config
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left */}
        <div className="space-y-5">
          {/* Model */}
          <div>
            <label className="mb-2 block text-label-sm font-medium text-outline">
              Model Selection
            </label>

            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended)</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            </select>
          </div>

          {/* API Key */}
          <div>
            <label className="mb-2 block text-label-sm font-medium text-outline">
              API Key
            </label>

            <input
              type="password"
              placeholder="AIza..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 font-mono text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5">
          {/* Temperature */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-label-sm font-medium text-outline">
                Response Temperature
              </label>

              <span className="font-semibold text-primary">
                {temperature.toFixed(1)}
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-primary"
            />

            <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-outline">
              <span>Precise</span>
              <span>Creative</span>
            </div>
          </div>

          {/* AI Settings Toggles */}
          <div className="space-y-3 rounded-lg bg-gray-50 p-4 border border-gray-150">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Automation Settings</span>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoReplyEnabled}
                onChange={(e) => setAutoReplyEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-sm">
                <span className="font-medium text-gray-800">Auto-Reply Gmail Messages</span>
                <p className="text-xs text-gray-500">Automatically generate and send email replies via webhook matches.</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoFaqEnabled}
                onChange={(e) => setAutoFaqEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-sm">
                <span className="font-medium text-gray-800">Auto-Generate FAQ Articles</span>
                <p className="text-xs text-gray-500">Suggest automatic FAQ article drafts during chat interactions.</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
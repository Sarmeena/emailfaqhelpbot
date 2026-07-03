"use client";

import { Brain } from "lucide-react";
import { useState } from "react";

export default function SettingsGemini() {
  const [temperature, setTemperature] = useState(0.7);

  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-secondary/10 p-2">
          <Brain className="h-5 w-5 text-secondary" />
        </div>

        <h2 className="text-title-lg font-semibold text-on-surface">
          Gemini AI Engine
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left */}
        <div className="space-y-5">
          {/* Model */}
          <div>
            <label className="mb-2 block text-label-sm font-medium text-outline">
              Model Selection
            </label>

            <select className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20">
              <option>Select a model</option>
              <option>Gemini 1.5 Pro</option>
              <option>Gemini 1.5 Flash</option>
              <option>Gemini 1.0 Ultra</option>
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
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 font-mono text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col justify-center">
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
      </div>
    </section>
  );
}
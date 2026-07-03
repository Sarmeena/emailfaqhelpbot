import { Sparkles } from "lucide-react";

export default function AIInsightCard() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-blue-700 p-6 text-white shadow-lg">
      <div className="relative z-10">
        <div className="mb-6 flex items-center gap-2">
          <Sparkles size={24} />
          <h2 className="text-xl font-semibold">
            AI Smart Insights
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-blue-200">
              Responses Generated
            </p>

            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold">
                14,281
              </h3>

              <span className="text-green-300 text-sm">
                ↑ 4%
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-blue-200">
              Accuracy Rate
            </p>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-blue-500">
              <div className="h-full w-[94%] bg-green-400" />
            </div>

            <p className="mt-1 text-right text-xs">
              94.2%
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-white/10 p-3">
            <span>Knowledge Base</span>

            <span className="rounded bg-green-500 px-2 py-1 text-xs font-bold uppercase">
              Synced
            </span>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
    </div>
  );
}
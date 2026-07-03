import {
  Sparkles,
  Copy,
  RefreshCw,
  FileText,
  ExternalLink,
} from "lucide-react";

export default function ConversationAIPanel() {
  return (
    <aside className="hidden w-90 flex-col border-l bg-gray-50 xl:flex">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-white p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-blue-700" size={20} />
          <h3 className="text-lg font-semibold">AI Assistant</h3>
        </div>

        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
          Active
        </span>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        {/* Suggested Response */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                Suggested Response
              </span>

              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                94% Match
              </span>
            </div>

            <div className="rounded-lg bg-gray-100 p-3 text-sm italic text-gray-700">
              I have checked our logs and identified a sync delay with the
              password reset server. I have manually triggered a fresh
              link for you. It should arrive in your inbox shortly.
            </div>

            <div className="space-y-2">
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 py-2 text-sm font-semibold text-white hover:bg-blue-800">
                <Copy size={16} />
                Insert into Chat
              </button>

              <button className="flex w-full items-center justify-center gap-2 rounded-lg border py-2 text-sm hover:bg-gray-100">
                <RefreshCw size={16} />
                Regenerate Suggestion
              </button>
            </div>
          </div>
        </div>

        {/* Source Documents */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500">
              Source Documents
            </h4>

            <button className="text-xs font-medium text-blue-700 hover:underline">
              Manage KB
            </button>
          </div>

          <div className="space-y-2">
            <button className="flex w-full items-center justify-between rounded-lg border bg-white p-3 hover:border-blue-600">
              <div className="flex items-center gap-3">
                <FileText
                  size={18}
                  className="text-blue-700"
                />

                <div className="text-left">
                  <p className="text-sm font-semibold">
                    FAQ: Password Resets
                  </p>

                  <p className="text-xs text-gray-500">
                    88% Relevance
                  </p>
                </div>
              </div>

              <ExternalLink size={16} />
            </button>

            <button className="flex w-full items-center justify-between rounded-lg border bg-white p-3 hover:border-blue-600">
              <div className="flex items-center gap-3">
                <FileText
                  size={18}
                  className="text-blue-700"
                />

                <div className="text-left">
                  <p className="text-sm font-semibold">
                    Troubleshooting Email Links
                  </p>

                  <p className="text-xs text-gray-500">
                    72% Relevance
                  </p>
                </div>
              </div>

              <ExternalLink size={16} />
            </button>
          </div>
        </div>

        {/* Agent Insights */}
        <div className="rounded-xl bg-blue-50 p-4">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-blue-700">
            Agent Insights
          </h4>

          <ul className="space-y-2 text-sm text-gray-700">
            <li>• 3 previous password requests today</li>
            <li>• Last successful login: 14 days ago</li>
            <li>• Account status: Premium Tier</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
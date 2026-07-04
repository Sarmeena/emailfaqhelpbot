import { useEffect, useState } from "react";
import {
  Sparkles,
  Copy,
  RefreshCw,
  FileText,
  Save,
  CheckCircle,
} from "lucide-react";

interface ConversationAIPanelProps {
  conversationId: string;
  customerMessage: string;
  onInsertSuggestedResponse: (text: string) => void;
}

export default function ConversationAIPanel({
  conversationId,
  customerMessage,
  onInsertSuggestedResponse,
}: ConversationAIPanelProps) {
  const [suggestion, setSuggestion] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  // FAQ generation states
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqCategory, setFaqCategory] = useState("Support");
  const [generatingFaq, setGeneratingFaq] = useState(false);
  const [faqSaved, setFaqSaved] = useState(false);
  const [showFaqEditor, setShowFaqEditor] = useState(false);

  // Fetch AI suggested reply
  async function loadSuggestion() {
    if (!customerMessage.trim()) {
      setSuggestion("No message from the customer yet to analyze.");
      setConfidence(0);
      return;
    }

    setLoadingSuggestion(true);
    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: customerMessage }),
      });

      if (res.ok) {
        const json = await res.json();
        setSuggestion(json.suggestion || "Failed to generate suggest.");
        setConfidence(json.confidence || 75);
      } else {
        setSuggestion("Failed to load suggested reply from AI engine.");
      }
    } catch (error) {
      console.error(error);
      setSuggestion("Error contacting Gemini AI suggestions engine.");
    } finally {
      setLoadingSuggestion(false);
    }
  }

  // Load suggestion when active message changes
  useEffect(() => {
    loadSuggestion();
    setShowFaqEditor(false);
    setFaqSaved(false);
  }, [customerMessage]);

  // Generate FAQ from conversation details
  async function handleGenerateFAQ() {
    if (!conversationId) {
      alert("No active ticket selected.");
      return;
    }

    setGeneratingFaq(true);
    setFaqSaved(false);
    try {
      const res = await fetch("/api/ai/generate-faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.faq) {
          setFaqQuestion(json.faq.question);
          setFaqAnswer(json.faq.answer);
          setFaqCategory(json.faq.category);
          setShowFaqEditor(true);
        } else {
          alert(json.error || "Failed to parse auto-FAQ.");
        }
      } else {
        const errorText = await res.text();
        alert(`Failed: ${errorText}`);
      }
    } catch (error) {
      console.error(error);
      alert("Error calling Gemini auto-FAQ API.");
    } finally {
      setGeneratingFaq(false);
    }
  }

  // Save auto-generated FAQ into the database KB
  async function handleSaveFAQ() {
    if (!faqQuestion.trim() || !faqAnswer.trim()) {
      alert("Please ensure both question and answer are populated.");
      return;
    }

    try {
      const res = await fetch("/api/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: faqQuestion,
          answer: faqAnswer,
          category: faqCategory,
          source: "AI Auto-Generated",
        }),
      });

      if (res.ok) {
        setFaqSaved(true);
        setTimeout(() => setShowFaqEditor(false), 2000);
      } else {
        alert("Failed to save FAQ article.");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving FAQ article to KB.");
    }
  }

  return (
    <aside className="hidden w-96 shrink-0 flex-col border-l bg-gray-50 xl:flex">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-white p-4 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="text-blue-700 animate-pulse" size={20} />
          <h3 className="text-lg font-semibold">AI Assistant</h3>
        </div>

        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
          Gemini 2.5 Active
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

              {confidence > 0 && (
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  confidence > 80 ? "bg-green-150 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {confidence}% Match
                </span>
              )}
            </div>

            {loadingSuggestion ? (
              <div className="rounded-lg bg-gray-50 p-4 border border-gray-150 animate-pulse text-sm text-gray-500 italic">
                Analyzing customer message and generating suggestions...
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto rounded-lg bg-gray-50 p-3 text-sm text-gray-700 whitespace-pre-line border border-gray-150 font-medium break-words max-w-full overflow-hidden">
                {suggestion || "Type a customer message to generate response suggestions."}
              </div>
            )}

            {suggestion && !loadingSuggestion && customerMessage.trim() && (
              <div className="space-y-2">
                <button
                  onClick={() => onInsertSuggestedResponse(suggestion)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 transition active:scale-95 cursor-pointer shadow-sm"
                >
                  <Copy size={16} />
                  Insert into Chat
                </button>

                <button
                  onClick={loadSuggestion}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border py-2 text-sm text-gray-700 hover:bg-gray-100 transition active:scale-95"
                >
                  <RefreshCw size={16} />
                  Regenerate Suggestion
                </button>
              </div>
            )}
          </div>
        </div>

        {/* AI FAQ Generator Section */}
        <div className="rounded-xl border bg-white shadow-sm p-4 space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <FileText className="text-blue-700" size={18} />
            <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
              Knowledge Base Creator
            </span>
          </div>

          <p className="text-xs text-gray-500">
            Automatically transform this customer ticket conversation into a reusable FAQ article with Gemini.
          </p>

          {!showFaqEditor ? (
            <button
              onClick={handleGenerateFAQ}
              disabled={generatingFaq || !conversationId}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 text-sm font-semibold transition disabled:opacity-50 active:scale-95"
            >
              {generatingFaq ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating draft...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Auto-Generate FAQ
                </>
              )}
            </button>
          ) : (
            <div className="space-y-3 rounded-lg bg-gray-50 p-3 border border-gray-200">
              {faqSaved ? (
                <div className="flex flex-col items-center justify-center py-6 text-emerald-600 space-y-2">
                  <CheckCircle size={32} className="animate-bounce" />
                  <span className="text-sm font-bold">Saved to Knowledge Base!</span>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Draft Question</label>
                    <input
                      type="text"
                      value={faqQuestion}
                      onChange={(e) => setFaqQuestion(e.target.value)}
                      className="mt-1 w-full rounded-md border bg-white p-2 text-xs outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Draft Answer</label>
                    <textarea
                      rows={3}
                      value={faqAnswer}
                      onChange={(e) => setFaqAnswer(e.target.value)}
                      className="mt-1 w-full rounded-md border bg-white p-2 text-xs outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Category</label>
                    <select
                      value={faqCategory}
                      onChange={(e) => setFaqCategory(e.target.value)}
                      className="mt-1 w-full rounded-md border bg-white p-2 text-xs outline-none focus:border-blue-600"
                    >
                      <option value="Technical">Technical</option>
                      <option value="Support">Support</option>
                      <option value="Billing">Billing</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSaveFAQ}
                      className="flex-1 flex items-center justify-center gap-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 transition"
                    >
                      <Save size={12} />
                      Save to KB
                    </button>
                    <button
                      onClick={() => setShowFaqEditor(false)}
                      className="flex-1 rounded border hover:bg-gray-100 text-gray-700 text-xs font-semibold py-2 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
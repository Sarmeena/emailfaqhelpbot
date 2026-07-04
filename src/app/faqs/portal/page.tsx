"use client";

import { useEffect, useState, Suspense } from "react";
import { Search, ChevronDown, ChevronUp, BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: string;
}

export default function FAQPortalPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 italic">
        Loading FAQ Knowledge Base...
      </div>
    }>
      <FAQPortalContent />
    </Suspense>
  );
}

function FAQPortalContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadFAQs() {
      try {
        const res = await fetch("/api/faqs");
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.faqs)) {
            setFaqs(data.faqs);
          } else {
            setFaqs(Array.isArray(data) ? data : []);
          }
        }
      } catch (e) {
        console.error("Error loading FAQs for portal:", e);
      } finally {
        setLoading(false);
      }
    }
    loadFAQs();
  }, []);

  const categories = ["All", "Technical", "Support", "Billing", "General"];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  function toggleFAQ(id: string) {
    setExpandedId(expandedId === id ? null : id);
  }

  const backUrl = from === "createbroadcast" ? "/createbroadcast" : "/faqs";
  const backLabel = from === "createbroadcast" ? "Continue Creating Campaign" : "Back to Management";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href={backUrl}
            className="flex items-center gap-2 text-sm font-semibold text-blue-750 hover:text-blue-900 transition animate-fade-in"
          >
            <ArrowLeft size={16} />
            {backLabel}
          </Link>

          <div className="flex items-center gap-2">
            <BookOpen className="text-blue-700 animate-pulse" size={20} />
            <span className="font-bold text-gray-900">Knowledge Base Portal</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-3xl px-6 py-12">
        {/* Page title header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-950 tracking-tight">
            How can we help you?
          </h1>
          <p className="mt-3 text-base text-gray-500 max-w-lg mx-auto font-medium">
            Search our frequently asked questions or select a category below to find answers immediately.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 shadow-sm rounded-2xl border bg-white focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs by keywords..."
            className="w-full bg-transparent py-4 pl-12 pr-4 outline-none text-sm font-medium"
          />
        </div>

        {/* Categories Chips */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4.5 py-1.5 text-xs font-bold transition cursor-pointer active:scale-95 ${
                selectedCategory === cat
                  ? "bg-blue-700 text-white shadow-sm"
                  : "bg-white border text-gray-600 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 rounded-xl bg-white border animate-pulse" />
            ))}
          </div>
        ) : filteredFAQs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border">
            <h3 className="text-lg font-bold text-gray-900">No results found</h3>
            <p className="text-sm text-gray-500 mt-1">
              Try adjusting your keywords or category filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFAQs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl border bg-white shadow-sm overflow-hidden transition"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="flex w-full items-center justify-between p-5 text-left font-bold text-gray-900 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isExpanded ? (
                      <ChevronUp size={18} className="text-blue-700" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="border-t bg-gray-50 p-5 text-sm text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">
                      {faq.answer}
                      <div className="mt-4 flex items-center justify-between border-t pt-3">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                          Category: {faq.category}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6 text-center text-xs text-gray-400 mt-20 font-medium">
        &copy; {new Date().getFullYear()} HelpBot FAQ Knowledge Base Portal. All rights reserved.
      </footer>
    </div>
  );
}

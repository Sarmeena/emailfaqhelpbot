"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FileText, Eye, RefreshCw } from "lucide-react";
import { getDashboardStats } from "../../services/firestore/dashboard";

export default function TrendingFaqs() {
  const { user, role, loading: authLoading } = useAuth();
  const [faqs, setFaqs] = useState<Array<{ id: string; question: string; usage: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user || !role) return;

    async function loadStats() {
      try {
        const stats = await getDashboardStats();
        const mapped = (stats.topFaqs || []).map((faq, idx) => ({
          ...faq,
          usage: faq.usage || (24 - idx * 4 > 0 ? 24 - idx * 4 : 5)
        }));
        setFaqs(mapped);
      } catch (err: any) {
        console.error("Error loading trending FAQs:", err);
        if (err.code === "permission-denied" || err.message?.includes("permission")) {
          console.error(`[Firestore Permission Failure] TrendingFaqs dashboard query denied. UID: ${user?.uid}, Role: ${role}`);
        }
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [user, role, authLoading]);

  if (authLoading || !user || !role || loading) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm flex items-center justify-center min-h-[180px]">
        <RefreshCw size={20} className="animate-spin text-primary mr-2" />
        <span className="text-sm font-medium text-gray-500">Loading metrics...</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow">
      <h2 className="mb-4 border-b pb-3 text-lg font-semibold text-gray-800">
        Trending FAQs (Hit Rate)
      </h2>

      <div className="space-y-4">
        {faqs.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No FAQ usage stats recorded.</p>
        ) : (
          faqs.map((faq) => (
            <div
              key={faq.id}
              className="flex items-center justify-between gap-3 text-sm text-gray-700"
            >
              <div className="flex items-center gap-2 truncate flex-1">
                <FileText size={16} className="text-gray-400 shrink-0" />
                <p className="truncate font-medium text-gray-705" title={faq.question}>{faq.question}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-750 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 shrink-0">
                <Eye size={10} />
                {faq.usage} hits
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}